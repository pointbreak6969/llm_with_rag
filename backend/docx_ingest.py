from langchain_text_splitters import RecursiveCharacterTextSplitter
from pathlib import Path
from langchain_community.document_loaders import PyPDFLoader, Docx2txtLoader
from sentence_transformers import SentenceTransformer
import faiss
import uuid
import pickle
import os
import numpy as np
from langchain_ollama import OllamaEmbeddings
FAISS_INDEX_PATH = "./faiss.index"
DOCSTORE_PATH = "./documents.pkl"
DOCX_FAISS_INDEX_PATH = "./faiss_docx.index"
DOCX_DOCSTORE_PATH = "./documents_docx.pkl"
MODEL_NAME = "all-MiniLM-L6-v2"

# -------- PDF PIPELINE --------

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


# -------- DOCX PIPELINE --------

def process_all_docx(docx_directory):
    all_documents = []
    docx_dir = Path(docx_directory)

    docx_files = list(docx_dir.glob("**/*.docx"))
    print(f"Found {len(docx_files)} DOCX files")

    for docx_file in docx_files:
        print(f"Processing: {docx_file.name}")
        try:
            loader = Docx2txtLoader(str(docx_file))
            documents = loader.load()

            for doc in documents:
                doc.metadata["source_file"] = docx_file.name
                doc.metadata["file_type"] = "docx"

            all_documents.extend(documents)
            print(f"  ✓ Loaded")

        except Exception as e:
            print(f"  ✗ Error: {e}")

    return all_documents


# -------- COMMON FUNCTIONS --------

def split_documents(documents, chunk_size=2000, chunk_overlap=300):
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n\n", "\n", " ", ""],
    )

    chunks = splitter.split_documents(documents)
    print(f"Chunks created: {len(chunks)}")
    return chunks


def generate_embeddings(texts):
    model = OllamaEmbeddings(model="nomic-embed-text:v1.5")
    embeddings = model.embed_documents(texts)
    return np.array(embeddings).astype("float32")


def save_faiss(embeddings, chunks, index_path, docstore_path):
    dim = embeddings.shape[1]

    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)

    # Save FAISS index
    faiss.write_index(index, index_path)

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

    with open(docstore_path, "wb") as f:
        pickle.dump(payload, f)

    print("✅ FAISS index saved")
    print("✅ Documents saved")


def load_faiss(index_path, docstore_path):
    index = faiss.read_index(index_path)

    with open(docstore_path, "rb") as f:
        docs = pickle.load(f)

    return index, docs


def search_pdf_only(query, k=2):
    """Search only PDF documents"""
    embeddings_model = OllamaEmbeddings(model="nomic-embed-text:v1.5")
    index, docs = load_faiss(FAISS_INDEX_PATH, DOCSTORE_PATH)

    q_emb = np.array([embeddings_model.embed_query(query)]).astype("float32")
    distances, indices = index.search(q_emb, k)

    results = []
    for i in indices[0]:
        results.append(docs[i])

    return results


def search_all(query, k=2):
    """Search both PDF and DOCX documents"""
    embeddings_model = OllamaEmbeddings(model="nomic-embed-text:v1.5")
    
    # Search PDFs
    pdf_index, pdf_docs = load_faiss(FAISS_INDEX_PATH, DOCSTORE_PATH)
    q_emb = np.array([embeddings_model.embed_query(query)]).astype("float32")
    pdf_distances, pdf_indices = pdf_index.search(q_emb, k)
    
    # Search DOCX
    docx_index, docx_docs = load_faiss(DOCX_FAISS_INDEX_PATH, DOCX_DOCSTORE_PATH)
    docx_distances, docx_indices = docx_index.search(q_emb, k)
    
    # Combine results with distances
    combined = []
    for i, idx in enumerate(pdf_indices[0]):
        combined.append({
            "doc": pdf_docs[idx],
            "distance": pdf_distances[0][i],
            "type": "pdf"
        })
    
    for i, idx in enumerate(docx_indices[0]):
        combined.append({
            "doc": docx_docs[idx],
            "distance": docx_distances[0][i],
            "type": "docx"
        })
    
    # Sort by distance (lower is better) and get top k
    combined.sort(key=lambda x: x["distance"])
    results = [item["doc"] for item in combined[:k]]
    
    return results
    

# -------- MAIN INGEST --------

if __name__ == "__main__":
    pdf_dir = "data"
    docx_dir = "data"

    # Process PDFs
    print("📄 Processing PDFs...")
    pdf_docs = process_all_pdfs(pdf_dir)
    pdf_chunks = split_documents(pdf_docs)
    pdf_texts = [c.page_content for c in pdf_chunks]
    pdf_embeddings = generate_embeddings(pdf_texts)
    save_faiss(pdf_embeddings, pdf_chunks, FAISS_INDEX_PATH, DOCSTORE_PATH)

    # Process DOCX
    print("\n📝 Processing DOCX...")
    docx_docs = process_all_docx(docx_dir)
    docx_chunks = split_documents(docx_docs)
    docx_texts = [c.page_content for c in docx_chunks]
    docx_embeddings = generate_embeddings(docx_texts)
    save_faiss(docx_embeddings, docx_chunks, DOCX_FAISS_INDEX_PATH, DOCX_DOCSTORE_PATH)

    print("\n🎉 Ingestion complete")