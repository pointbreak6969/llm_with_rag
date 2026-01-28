
from flask import Flask, request, jsonify
from flask_cors import CORS
from ingest import search
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import Union, Dict, Any
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_ollama import ChatOllama

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/query": {"origins": "http://localhost:3000"}})

class Response(BaseModel):
    topic: str
    answer: str = Field(description="Answer in markdown format")
    sources: str

model = ChatOllama(model="llama3.1")
parser = PydanticOutputParser(pydantic_object=Response)

prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            """
You are a highly experienced senior lecturer at Nepali universities with many years of teaching undergraduate and graduate students.

Your task is to answer student questions using ONLY the provided context from university learning materials whenever possible.

Follow these rules strictly:

1. Carefully read the provided context before answering.
2. If the answer EXISTS in the context:
   - Base your explanation primarily on that context.
   - Expand it with clear explanations in simple academic language.
   - Provide practical examples, diagrams-in-words, or real-world scenarios wherever appropriate.
3. Your answer MUST be detailed (minimum ~400 words) and suitable for university students.
4. Structure answers clearly using headings, bullet points, or numbered sections when helpful.
5. Write the answer body in markdown (use headings, lists, and emphasis where appropriate).
6. If the context is PARTIALLY available:
   - Use the available context.
   - Clearly state which parts were inferred or supplemented with general knowledge.
7. If the answer is NOT FOUND in the context:
   - Clearly say: " This topic was not found in the provided university materials."
   - Then provide a best-effort general explanation.
   - Add this warning at the end:

"Since this information was not present in your university resources, this answer may not fully match your syllabus. Please confirm with your subject teacher."

8. Never pretend information exists if it does not.
9. Prefer educational clarity over brevity.
10. Avoid hallucinating facts, definitions, or formulas not present in the context.

Tone:
- Professional teacher
- Supportive
- Clear and explanatory
- Student-friendly

CRITICAL: You MUST respond with ONLY valid JSON. No extra text before or after.

Your response must be a valid JSON object exactly matching this structure:
{format_instructions}


Return ONLY the JSON object. Do not add any text or formatting outside the JSON.
            """,
        ),
        (
            "human",
            """
Context from knowledge base:
{query}
            """
        ),
    ]
).partial(format_instructions=parser.get_format_instructions())

chain = prompt | model | parser

@app.route("/")
def answer():
    return "hello"

@app.route("/query", methods=["POST"])
def query_endpoint():
    try:
        data = request.get_json()
        
        if not data or "query" not in data:
            return jsonify({"error": "Missing 'query' field"}), 400
        
        user_query = data["query"]
        
        # Retrieve relevant context from the knowledge base
        results = search(user_query, k=5)
        
        # Format the context from search results
        context = "\n\n".join([
            f"Source: {result['metadata'].get('source_file', 'Unknown')}\n{result['text']}"
            for result in results
        ])
        
        # Combine user query with retrieved context
        query_with_context = f"""
Context from knowledge base:
{context}

Question: {user_query}
"""
        
        # Invoke the chain with the query and context
        llm_response = chain.invoke({
            "query": query_with_context,
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