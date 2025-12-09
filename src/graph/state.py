from typing import TypedDict, List, Dict, Optional

# PipelineState is a dictionary that contains the state of the pipeline.
class PipelineState(TypedDict, total=False):
    """Shared state passed between LangGraph nodes."""
    raw_emails: List[Dict]
    cleaned_emails: List[Dict]
    summary_json: Dict