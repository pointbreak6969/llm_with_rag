from langchain_community.tools import DuckDuckGoSearchResults
from langchain.tools import tool

search= DuckDuckGoSearchResults()
search_tool = tool(
    func=search.run,
    name="DuckDuckGo Search",
    description="Useful for when you need to look up current information on the web. Input should be a search query.",
)   

if __name__ == "__main__":
    # Example usage of the search tool
    query = "Latest advancements in AI technology"
    results = search_tool(query)
    print(results)