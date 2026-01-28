from flask import Flask, request, jsonify
from flask_cors import CORS
from ingest import search
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Optional
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_ollama import ChatOllama

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/query": {"origins": "http://localhost:3000"}})

class Response(BaseModel):
    topic: str = Field(description="The main topic or subject of the question")
    answer: str = Field(description="Detailed answer in markdown format with headings, lists, and emphasis")
    sources: str = Field(description="Comma-separated list of source files used. Leave empty string if no sources were used.")

model = ChatOllama(model="llama3.1")
parser = PydanticOutputParser(pydantic_object=Response)

prompt = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are a university lecturer helping students. Answer questions using the provided context.

Rules:
- Use context when available; cite sources
- If context missing: state this clearly, provide general answer, set sources=""
- Write in markdown (## headings, - bullets, **bold**)
- Minimum 300 words, clear academic language
- Add warning if answering without context

{format_instructions}

Return only valid JSON."""
    ),
    (
        "human",
        """Context:
{context}

Question: {question}"""
    ),
]).partial(format_instructions=parser.get_format_instructions())
chain = prompt | model | parser

@app.route("/")
def answer():
    return "hello"
@app.route("/query", methods=["POST"])
def query_endpoint():
    try:
        data = request.get_json()
        user_query = data["query"]
        
        # Reduce k from 5 to 2-3
        results = search(user_query, k=2)
        
        if results and len(results) > 0:
            # LIMIT each document to first 300-400 tokens (~400 words)
            context = "\n\n".join([
                f"Source: {result['metadata'].get('source_file', 'Unknown')}\n{result['text'][:800]}"  # Truncate!
                for result in results
            ])
        else:
            context = "No context available."
        
        llm_response = chain.invoke({
            "context": context,
            "question": user_query
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