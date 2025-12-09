# src/graph/nodes/fetch.py
from typing import List, Dict

from gmail.fetcher import NewsletterFetcher
from graph.state import PipelineState


fetcher = NewsletterFetcher()


def fetch_node(state: PipelineState) -> PipelineState:
    """
    Fetch unread newsletters from yesterday and store them in state['raw_emails'].
    """

    emails: List[Dict] = fetcher.fetch_yesterday_newsletters()
    state["raw_emails"] = emails
    return state