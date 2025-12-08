from datetime import datetime, timedelta
from typing import List, Dict, Any
import base64
from gmail.auth import GmailAuthenticator

class NewsletterFetcher:
    def __init__(self):
        self.service = GmailAuthenticator().authenticate()
    
    def fetch_yesterday_newsletters(self, keywords: List[str] = None) -> List[Dict]:
        """Fetch unread newsletters from yesterday with label 'Newsletter'"""
        yesterday = (datetime.now() - timedelta(1)).strftime('%Y/%m/%d')
        
        # Filter by keywords in sender's email
        keyword_query = " OR ".join([f"from:{kw}" for kw in (keywords or [])])
        query = f'is:unread label:Newsletter after:{yesterday} ({keyword_query})' # Gmail search query
        
        results = self.service.users().messages().list(
            userId='me', 
            q=query,
            maxResults=50
        ).execute()
        
        messages = results.get('messages', []) # 
        return [self._process_message(msg['id']) for msg in messages]
    
    def _process_message(self, msg_id: str) -> Dict:
        """Extract email data"""
        email = self.service.users().messages().get(
            userId='me', 
            id=msg_id,
            format='full'
        ).execute()
        
        # Find headers and body in the payload
        headers = {h['name']: h['value'] for h in email['payload']['headers']}
        body = self._get_body(email['payload'])
        
        # Return structured email data
        return {
            'id': msg_id,
            'from': headers.get('From', ''),
            'subject': headers.get('Subject', ''),
            'body': body,
            'date': headers.get('Date', '')
        }
    
    def _get_body(self, payload: Dict[str, Any]) -> str:
        """
        Recursively extract email body, prioritizing text/html over text/plain.
        """
        
        # 1. Check for nested parts (most common for rich emails and attachments)
        if 'parts' in payload:
            # Prioritize HTML by making a first pass
            html_data = ""
            plain_data = ""
            
            for part in payload['parts']:
                # Recursively call _get_body if the part is another container (e.g., multipart/alternative)
                if part['mimeType'].startswith('multipart/'):
                    # Check for a body in the nested structure
                    nested_body = self._get_body(part)
                    if nested_body:
                        # Return immediately if a body is found in a nested container like multipart/alternative
                        return nested_body
                    
                # If it's a content part, store the data
                elif part['mimeType'] == 'text/html':
                    html_data = part['body'].get('data', '')
                elif part['mimeType'] == 'text/plain':
                    plain_data = part['body'].get('data', '')
                    
            # If we found HTML, decode and return it
            if html_data:
                return base64.urlsafe_b64decode(html_data).decode('utf-8')
            
            # Otherwise, decode and return the plain text
            if plain_data:
                return base64.urlsafe_b64decode(plain_data).decode('utf-8')

        # Check the top-level body (for simple, non-multipart messages)
        data = payload['body'].get('data', '')
        
        # Decode if data exists
        if data:
            return base64.urlsafe_b64decode(data).decode('utf-8')
        
        # Return empty string if no body is found
        return ""
    
    def mark_as_read(self, msg_id: str):
        """Mark message as read"""
        self.service.users().messages().modify(
            userId='me',
            id=msg_id,
            body={'removeLabelIds': ['UNREAD']}
        ).execute()

if __name__ == "__main__":
    newsletters = NewsletterFetcher()
    emails = newsletters.fetch_yesterday_newsletters(keywords=["newsletter", "updates"])
    print(f"Fetched {len(emails)} emails.")
    print(emails)