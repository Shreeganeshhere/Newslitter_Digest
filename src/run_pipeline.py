# src/run_pipeline.py
import json

from graph.pipeline import build_pipeline


def main() -> None:
    app = build_pipeline()

    # Start with empty state; LangGraph will pass this to the entry node
    result_state = app.invoke({})

    summary = result_state.get("summary_json", {})
    print(json.dumps(summary, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()