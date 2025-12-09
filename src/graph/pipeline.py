from langgraph.graph import StateGraph

from graph.state import PipelineState
from graph.nodes.fetch import fetch_node
from graph.nodes.clean import clean_node
from graph.nodes.summarize import summarize_node


def build_pipeline():
    """
    Build and compile the LangGraph pipeline:
    fetch -> clean -> summarize
    """
    workflow = StateGraph(PipelineState)

    # Register nodes
    workflow.add_node("fetch", fetch_node)
    workflow.add_node("clean", clean_node)
    workflow.add_node("summarize", summarize_node)

    # Define graph structure
    workflow.set_entry_point("fetch")
    workflow.add_edge("fetch", "clean")
    workflow.add_edge("clean", "summarize")

    app = workflow.compile()
    return app