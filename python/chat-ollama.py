from langchain_ollama import ChatOllama
from dotenv import load_dotenv
from langchain_core.prompts import ChatPromptTemplate
from langchain.messages import HumanMessage, SystemMessage
from data_handeling import rag_retriever
load_dotenv()
from langchain_google_genai import ChatGoogleGenerativeAI

class Gemini:
    def __init__(self, model_name: str = "gemini-2.5-flash", temperature: float = 0.7):
        self.model_name = model_name
        self.llm = ChatGoogleGenerativeAI(
            model=self.model_name,
            temperature=temperature,
        )
    def generateResponse(self, query, context, max_length: int = 500)->str:
        prompt_template = ChatPromptTemplate(
            input_variables=["query", "context"],
            template = """You are a helpful AI assistant. Use the following context to answer the question accurately and concisely.

Context:
{context}

Question: {query}

Answer: Provide a clear and informative answer based on the context above. If the context doesn't contain enough information to answer the question, say so."""

        )
         # Format the prompt
        formatted_prompt = prompt_template.format(context=context, query=query)
        
        try:
            # Generate response
            messages = [HumanMessage(content=formatted_prompt)]
            response = self.llm.invoke(messages)
            return response.content
            
        except Exception as e:
            return f"Error generating response: {str(e)}"
    
    def generate_response_simple(self, query: str, context: str) -> str:
        """
        Simple response generation without complex prompting
        
        Args:
            query: User question
            context: Retrieved context
            
        Returns:
            Generated response
        """
        simple_prompt = f"""Based on this context: {context}

Question: {query}

Answer:"""
        
        try:
            messages = [HumanMessage(content=simple_prompt)]
            response = self.llm.invoke(messages)
            return response.content
        except Exception as e:
            return f"Error: {str(e)}"
    
# Initialize Groq LLM (you'll need to set GROQ_API_KEY environment variable)
try:
    gemini_llm = Gemini()
    print("Gemini LLM initialized successfully!")
except ValueError as e:
    print(f"Warning: {e}")
    print("Please set your gemini environment variable to use the LLM.")
    gemini_llm = None

def rag_simple(query,retriever,llm,top_k=3):
    ## retriever the context
    results=retriever.retrieve(query,top_k=top_k)
    context="\n\n".join([doc['content'] for doc in results]) if results else ""
    if not context:
        return "No relevant context found to answer the question."
    
    ## generate the answwer using Gemini LLM
    prompt=f"""Use the following context to answer the question concisely.
Context:
{context}

Question: {query}

Answer:"""
    
    response=llm.llm.invoke([HumanMessage(content=prompt)])
    return response.content

answer=rag_simple("answer first two physics question of year 2023",rag_retriever,gemini_llm)
print(answer)