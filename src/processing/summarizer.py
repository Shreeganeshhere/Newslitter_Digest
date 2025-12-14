import google.generativeai as genai
from typing import List, Dict
import json
from config.settings import settings
import re

class NewsletterSummarizer:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
    
    def summarize_batch(self, emails: List[Dict]) -> Dict:
        """Batch summarize all emails"""
        combined = self._combine_emails(emails)
        prompt = self._build_prompt(combined)
        
        response = self.model.generate_content(prompt)
        return self._parse_response(response.text)
    
    def _combine_emails(self, emails: List[Dict]) -> str:
        """Combine emails with separators"""
        parts = []
        for email in emails:
            parts.append(f"""
SOURCE: {email['from']}
SUBJECT: {email['subject']}
CONTENT:
{email['body'][:2000]}
""")
        return "\n\n---EMAIL_SEPARATOR---\n\n".join(parts)
    
    def _build_prompt(self, content: str) -> str:
        """Create summarization prompt"""
        return f"""You are a well Known journalist.
        You are curating a daily ML newsletter that is read by 10,000+ ML practitioners. Extract:

1. **Research**: New papers, models, techniques
2. **Industry**: Product launches, funding, company news
3. **Learning**: Tutorials, courses, tools, datasets
4. **Events**: Conferences, deadlines, webinars 
5. **Developers**: Opinion pieces, blog posts, tutorials, etc.
and anything else that is relevant to the ML community.

Input newsletters:
{content}

Output as JSON:
{{
  "headline": "Brief catchy headline",
  "date": "2024-XX-XX",
  "sections": [
    {{
      "title": "🔬 Research Highlights",
      "items": [
        {{"title": "...", "snippet": "...", "source": "...", "url": "...", "summary": "..." }}
      ]
    }}
  ],
}}

Be concise. Focus on actionable insights and information rich content for ML community.
Use the summary field to provide a brief 1 or 2 paragraph overview of the item."""
    
    def _parse_response(self, response: str) -> Dict:
        """Parse AI response"""
        # Extract JSON from markdown code blocks
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
        return json.loads(response)

