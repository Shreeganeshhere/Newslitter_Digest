import google.generativeai as genai
from typing import List, Dict
import json
from config.settings import settings

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
        return f"""You are curating a daily ML newsletter for students. Extract:

1. **Research**: New papers, models, techniques
2. **Industry**: Product launches, funding, company news
3. **Learning**: Tutorials, courses, tools, datasets
4. **Events**: Conferences, deadlines, webinars

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
        {{"title": "...", "snippet": "...", "source": "...", "url": "..."}}
      ]
    }}
  ],
  "summary": "One paragraph overview"
}}

Be concise. Focus on actionable insights for ML students."""
    
    def _parse_response(self, response: str) -> Dict:
        """Parse AI response"""
        # Extract JSON from markdown code blocks
        json_match = re.search(r'```json\s*(\{.*?\})\s*```', response, re.DOTALL)
        if json_match:
            return json.loads(json_match.group(1))
        return json.loads(response)