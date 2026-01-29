from langchain_text_splitters import RecursiveCharacterTextSplitter
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader
from sentence_transformers import SentenceTransformer
import faiss
import uuid
import pickle
import os
import numpy as np
import requests
from langchain_ollama import OllamaEmbeddings

FAISS_INDEX_PATH = "./faiss.index"
DOCSTORE_PATH = "./documents.pkl"
MODEL_NAME = "all-MiniLM-L6-v2"

# --------------------------------------

def process_all_pdfs(pdf_directory):
    all_documents = []
    pdf_dir = Path(pdf_directory)

    pdf_files = list(pdf_dir.glob("**/*.pdf"))
    print(f"Found {len(pdf_files)} PDF files")

    for pdf_file in pdf_files:
        print(f"Processing: {pdf_file.name}")
        try:
            loader = PyPDFLoader(str(pdf_file))
            documents = loader.load()

            for doc in documents:
                doc.metadata["source_file"] = pdf_file.name
                doc.metadata["file_type"] = "pdf"

            all_documents.extend(documents)
            print(f"  ✓ {len(documents)} pages")

        except Exception as e:
            print(f"  ✗ Error: {e}")

    return all_documents


def split_documents(documents, chunk_size=1000, chunk_overlap=200):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""],
    )

    chunks = splitter.split_documents(documents)
    print(f"Chunks created: {len(chunks)}")
    return chunks


def generate_embeddings(texts):
    embeddings_model = OllamaEmbeddings(model="nomic-embed-text:v1.5")
    embeddings = embeddings_model.embed_documents(texts)
    return np.array(embeddings).astype("float32")


def save_faiss(embeddings, chunks):
    dim = embeddings.shape[1]

    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)

    # Save FAISS index
    faiss.write_index(index, FAISS_INDEX_PATH)

    # Save documents + metadata
    payload = []
    for doc in chunks:
        payload.append(
            {
                "id": str(uuid.uuid4()),
                "text": doc.page_content,
                "metadata": doc.metadata,
            }
        )

    with open(DOCSTORE_PATH, "wb") as f:
        pickle.dump(payload, f)

    print("✅ FAISS index saved")
    print("✅ Documents saved")


def load_faiss():
    index = faiss.read_index(FAISS_INDEX_PATH)

    with open(DOCSTORE_PATH, "rb") as f:
        docs = pickle.load(f)

    return index, docs


def search(query, k=2):
    # Use Ollama embeddings instead of SentenceTransformer
    embeddings_model = OllamaEmbeddings(model="nomic-embed-text:v1.5")
    index, docs = load_faiss()

    # Generate query embedding using Ollama
    q_emb = np.array([embeddings_model.embed_query(query)]).astype("float32")

    distances, indices = index.search(q_emb, k)

    results = []
    for i in indices[0]:
        results.append(docs[i])

    return results


# ---------------- MAIN INGEST ----------------

if __name__ == "__main__":
    pdf_dir = "data"  

    docs = process_all_pdfs(pdf_dir)
    chunks = split_documents(docs)

    texts = [c.page_content for c in chunks]
    embeddings = generate_embeddings(texts)

    save_faiss(embeddings, chunks)

    print("\n🎉 Ingestion complete")
