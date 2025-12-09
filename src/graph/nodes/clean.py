from typing import List, Dict

from processing.cleaner import HTMLCleaner
from graph.state import PipelineState


def clean_node(state: PipelineState) -> PipelineState:
    """
    Clean HTML bodies using HTMLCleaner and store result in state['cleaned_emails'].
    """
    raw_emails: List[Dict] = state.get("raw_emails", [])  # type: ignore[assignment]
    cleaned: List[Dict] = []

    for email in raw_emails:
        raw_body = email.get("body", "") or ""
        cleaned_body = HTMLCleaner.clean(raw_body)
        truncated_body = HTMLCleaner.truncate(cleaned_body)

        cleaned.append(
            {
                "id": email.get("id", ""),
                "from": email.get("from", ""),
                "subject": email.get("subject", ""),
                "date": email.get("date", ""),
                "body": truncated_body,
            }
        )

    state["cleaned_emails"] = cleaned
    return state