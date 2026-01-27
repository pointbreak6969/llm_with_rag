import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
from pathlib import Path
from langchain_community.document_loaders import Docx2txtLoader
# Read all the docx files from the data directory
def process_all_docx_files(path):
    all_documents = []
    docx_dir = Path(path)
    # Find all the docx files in the directory
    docx_files = list(docx_dir.glob("**/*.docx"))
    print(f"Found {len(docx_files)} DOCX files to process")

    # Process each DOCX file
    for docx_file in docx_files:
        try:
            loader = Docx2txtLoader(str(docx_file))
            documents = loader.load()
            # add source information to metadata
            for doc in documents:
                doc.metadata["source"] = str(docx_file)
                doc.metadata["file_type"] = "docx"
            all_documents.extend(documents)
            print(f"Processed {docx_file.name}, found {len(documents)} documents")
        except Exception as e:
            print(f"Error processing {docx_file.name}: {e}")

    print(f"Successfully processed {len(all_documents)} documents")
    return all_documents

all_documents = process_all_docx_files("data")
print(all_documents)
def split_documents(documents,chunk_size=1000,chunk_overlap=200):
    """Split documents into smaller chunks for better RAG performance"""
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    split_docs = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(split_docs)} chunks")
    
    # Show example of a chunk
    if split_docs:
        print(f"\nExample chunk:")
        print(f"Content: {split_docs[0].page_content[:200]}...")
        print(f"Metadata: {split_docs[0].metadata}")
    
    return split_docs
import numpy as np
from sentence_transformers import SentenceTransformer
import chromadb 
from chromadb.config import Settings
import uuid
from sklearn.metrics.pairwise import cosine_similarity
# handel embedding
class EmbeddingManager:
    def __init__(self, model_name="all-MiniLM-L6-v2", ):
        self.model_name = model_name
        self.model = None
        self.load_model()

    def load_model(self):
        try:
            print(f"Loading model: {self.model_name}")
            self.model = SentenceTransformer(self.model_name)
            print("Model loaded successfully")
        except Exception as e:
            print(f"Error loading model: {e}")
    
    def generate_embedding(self,text):
        if self.model is None:
            raise ValueError("Model is not loaded")
        embeddings = self.model.encode(text, show_progress_bar=True)
        print("embedding shape", embeddings.shape)
        return embeddings

# initalize embedding manager
embedding_manager = EmbeddingManager()
# vector store
class VectorStore:
    def __init__(self, collection_name="documents_collection", persist_directory="data/chroma_db"):
        self.collection_name = collection_name
        self.persist_directory = persist_directory
        self.client = None
        self.collection = None
        self.initialize_store()

    def initialize_store(self):
        try:
            os.makedirs(self.persist_directory, exist_ok=True)
            self.client = chromadb.PersistentClient(path=self.persist_directory)
            self.collection = self.client.get_or_create_collection(
                name=self.collection_name,
                metadata={"description": "Collection of document embeddings"}
            )
            print(f"Vector store initialized. Collection: {self.collection_name}")
            print(f"Existing documents in collection: {self.collection.count()}")
        except Exception as e:
            print(f"Error initializing vector store: {e}")
            raise

    def add_documents(self, documents, embeddings):
        if len(documents) != len(embeddings):
            raise ValueError("Number of documents must match number of embeddings")

        print(f"Adding {len(documents)} documents to vector store...")

        # Prepare data for chromadb
        ids = []
        metadatas = []
        document_texts = []
        embeddings_list = []

        for i, (doc, embedding) in enumerate(zip(documents, embeddings)):
            # Generate unique ID
            doc_id = f"doc_{uuid.uuid4().hex[:8]}_{i}"
            ids.append(doc_id)

            # Prepare metadata
            metadata = dict(doc.metadata)
            metadata['doc_index'] = i
            metadata['content_length'] = len(doc.page_content)
            metadatas.append(metadata)

            # Document content
            document_texts.append(doc.page_content)

            # Embedding
            embeddings_list.append(embedding.tolist())

        # Add to collection
        try:
            self.collection.add(
                ids=ids,
                embeddings=embeddings_list,
                metadatas=metadatas,
                documents=document_texts
            )
            print(f"Successfully added {len(documents)} documents to vector store")
            print(f"Total documents in collection: {self.collection.count()}")

        except Exception as e:
            print(f"Error adding documents to vector store: {e}")
            raise

vectorstore = VectorStore()
vectorstore
# Process documents and add to vector store
# 1. Split documents into chunks
split_docs = split_documents(all_documents)

# 2. Generate embeddings for all chunks
print(f"\nGenerating embeddings for {len(split_docs)} chunks...")
texts = [doc.page_content for doc in split_docs]
embeddings = embedding_manager.generate_embedding(texts)

# 3. Add documents and embeddings to vector store
vectorstore.add_documents(split_docs, embeddings)

print(f"\nPipeline complete! Total documents in store: {vectorstore.collection.count()}")
chunks = split_documents(all_documents)
chunks
# convert the text into embeddings 
texts = [doc.page_content for doc in chunks]
embeddings = embedding_manager.generate_embedding(texts)
# store in vector database
vectorstore.add_documents(chunks, embeddings)
# retrieve pipeline from vector store   

class RAGRetriever:
    def __init__(self, vector_store, embedding_manager):
        self.vector_store = vector_store
        self.embedding_manager = embedding_manager

    def retrieve(self, query, top_k=5, score_threshold=0.0, verbose=True):
        print(f"Retrieving top {top_k} documents for query: {query}")
        # generate query embedding
        query_embedding = self.embedding_manager.generate_embedding([query])[0]
        # search in vector store
        try:
            results = self.vector_store.collection.query(
                query_embeddings=[query_embedding.tolist()],
                n_results=top_k,
                include=["documents", "metadatas", "distances"],
            )
            retrieved_docs = []
            if results["documents"] and results["documents"][0]:
                documents = results["documents"][0]
                metadatas = results["metadatas"][0]
                distances = results["distances"][0]
                ids = results.get("ids", [[None] * len(documents)])[0]
                for i, (doc_id, document, metadata, distance) in enumerate(zip(ids, documents, metadatas, distances)):
                    similarity_score = 1 - distance  # assuming distance is cosine distance
                    if verbose:
                        print(f"rank {i + 1}: sim={similarity_score:.3f} dist={distance:.3f} id={doc_id}")
                    if score_threshold is None or similarity_score >= score_threshold:
                        retrieved_docs.append({
                            "id": doc_id,
                            "content": document,
                            "metadata": metadata,
                            "similarity_score": similarity_score,
                            "distance": distance,
                            "rank": i + 1,
                        })
                if verbose and not retrieved_docs:
                    print(f"All results were below score_threshold={score_threshold}")
                print(f"Retrieved {len(retrieved_docs)} documents (after filtering)")
            else:
                print("No documents found")
            return retrieved_docs
            
        except Exception as e:
            print(f"Error during retrieval: {e}")
            return []
rag_retriever = RAGRetriever(vectorstore, embedding_manager)


