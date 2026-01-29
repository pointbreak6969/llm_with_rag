from flask import Flask, request, jsonify
from flask_cors import CORS
from docx_ingest import search_pdf_only, search_all
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Optional
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_ollama import ChatOllama
from langchain_ollama import OllamaEmbeddings


load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/(query|paidQuery)": {"origins": "http://localhost:3000"}})

class Response(BaseModel):
    topic: str = Field(description="The main topic or subject of the question")
    answer: str = Field(description="Detailed answer in markdown format with headings, lists, and emphasis")
    sources: str = Field(description="Comma-separated list of source files used. Leave empty string if no sources were used.")

model = ChatOllama(model="llama3.1", num_predict=2000)
parser = PydanticOutputParser(pydantic_object=Response)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are a university lecturer helping students. Answer questions ONLY using the provided context.

CRITICAL RULES:
- You MUST answer ONLY based on the provided context
- If the context does not contain information to answer the question, respond with: {{"topic": "Information Not Available", "answer": "I cannot answer this question as the information is not available in the provided documents.", "sources": ""}}
- NEVER use your own knowledge or make assumptions beyond the context
- You MUST respond in valid JSON format only - no markdown, no other formats
- All responses must follow this exact JSON structure

{format_instructions}

Guidelines:
- Extract information directly from the context
- Cite source files from the context metadata
- If partial information exists, answer what you can and state what's missing
- Keep answers concise and factual based on context only"""
    ),
    (
        "human",
        """Context:
{context}

Question: {question}"""
    ),
])

chain = prompt | model | parser

@app.route("/")
def answer():
    return "hello"
@app.route("/query", methods=["POST"])
def query_endpoint():
    try:
        data = request.get_json()
        user_query = data["query"]
        
        # Increase k to get more relevant chunks
        results = search_pdf_only(user_query, k=5)
        
        if results and len(results) > 0:
            # Increase context window for better coverage
            context = "\n\n".join([
                f"Source: {result['metadata'].get('source_file', 'Unknown')}\n{result['text'][:2000]}"
                for result in results
            ])
        else:
            context = "No context available."
        
        llm_response = chain.invoke({
            "context": context,
            "question": user_query,
            "format_instructions": parser.get_format_instructions()
        })
        
        return jsonify({
            "topic": llm_response.topic,
            "answer": llm_response.answer,
            "sources": llm_response.sources
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/paidQuery", methods=["POST"]   )
def paid_query_endpoint():
    # Implement the paid query logic here
    try:
        data = request.get_json()
        user_query = data["query"]
        
        # Increase k to get more relevant chunks
        results = search_all(user_query, k=5)
        
        if results and len(results) > 0:
            # Increase context window for better coverage
            context = "\n\n".join([
                f"Source: {result['metadata'].get('source_file', 'Unknown')}\n{result['text'][:2000]}"
                for result in results
            ])
        else:
            context = "No context available."
        
        llm_response = chain.invoke({
            "context": context,
            "question": user_query,
            "format_instructions": parser.get_format_instructions()
        })
        
        return jsonify({
            "topic": llm_response.topic,
            "answer": llm_response.answer,
            "sources": llm_response.sources
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)