from datetime import datetime
from typing import List, Dict

from processing.summarizer import NewsletterSummarizer
from graph.state import PipelineState


summarizer = NewsletterSummarizer()


def summarize_node(state: PipelineState) -> PipelineState:
    """
    Summarize cleaned emails using NewsletterSummarizer and store in state['summary_json'].
    """
    emails: List[Dict] = state.get("cleaned_emails", [])  # type: ignore[assignment]

    if not emails:
        state["summary_json"] = {
            "headline": "No newsletters today",
            "date": datetime.now().strftime("%Y-%m-%d"),
            "sections": [],
            "summary": "No matching newsletter emails were found for this run.",
        }
        return state

    summary = summarizer.summarize_batch(emails)
    state["summary_json"] = summary
    return state