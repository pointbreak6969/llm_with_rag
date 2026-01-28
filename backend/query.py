from ingest import search
from dotenv import load_dotenv
from pydantic import BaseModel
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from langchain_ollama import ChatOllama
load_dotenv()

class Response(BaseModel):
    topic: str
    answer: str
    sources: str

model = ChatOllama(model="llama3.1",)
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
5. If the context is PARTIALLY available:
   - Use the available context.
   - Clearly state which parts were inferred or supplemented with general knowledge.
6. If the answer is NOT FOUND in the context:
   - Clearly say: " This topic was not found in the provided university materials."
   - Then provide a best-effort general explanation.
   - Add this warning at the end:

"Since this information was not present in your university resources, this answer may not fully match your syllabus. Please confirm with your subject teacher."

7. Never pretend information exists if it does not.
8. Prefer educational clarity over brevity.
9. Avoid hallucinating facts, definitions, or formulas not present in the context.

Tone:
- Professional teacher
- Supportive
- Clear and explanatory
- Student-friendly

CRITICAL: You MUST respond with ONLY valid JSON. No markdown formatting, no bold text, no extra text before or after.

Your response must be a valid JSON object exactly matching this structure:
{format_instructions}


Return ONLY the JSON object. Do not add any text, markdown, or formatting outside the JSON.
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


# Create a chain with the model and prompt
chain = prompt | model | parser

user_query = input("Enter your query: ")

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
llm_response_with_rag = chain.invoke({
    "query": query_with_context,
})

print("\n=== Response with RAG ===")
print(f"Topic: {llm_response_with_rag.topic}")
print(f"\nAnswer: {llm_response_with_rag.answer}")
print(f"\nSources: {llm_response_with_rag.sources}")


if __name__ == "__main__":
    pass