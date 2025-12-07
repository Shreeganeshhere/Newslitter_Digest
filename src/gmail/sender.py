from typing import List
import base64
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from gmail.auth import GmailAuthenticator

class NewsletterSender:
    def __init__(self):
        self.service = GmailAuthenticator().authenticate()
    
    def send_newsletter(self, recipients: List[str], subject: str, html_content: str):
        """Send newsletter to multiple recipients"""
        for email in recipients:
            try:
                self._send_single(email, subject, html_content)
            except Exception as e:
                print(f"Failed to send to {email}: {e}")
    
    def _send_single(self, to: str, subject: str, html: str):
        """Send to single recipient"""
        message = MIMEMultipart('alternative')
        message['to'] = to
        message['subject'] = subject
        message['from'] = 'me'
        
        html_part = MIMEText(html, 'html')
        message.attach(html_part)
        
        raw = base64.urlsafe_b64encode(message.as_bytes()).decode()
        self.service.users().messages().send(
            userId='me',
            body={'raw': raw}
        ).execute()
