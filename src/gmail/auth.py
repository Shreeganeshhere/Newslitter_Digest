from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
from googleapiclient.discovery import build
import os
import sys
sys.path.append('../..') # Adjust the path as necessary to import config.settings
from config.settings import settings

class GmailAuthenticator:
    def __init__(self):
        self.creds = None
        
    def authenticate(self):
        """Authenticate and return Gmail service"""
        if os.path.exists(settings.GMAIL_TOKEN_FILE):
            self.creds = Credentials.from_authorized_user_file(settings.GMAIL_TOKEN_FILE, settings.GMAIL_SCOPES)

        # If there are no (valid) credentials available, let the user log in.
        if not self.creds or not self.creds.valid:
            if self.creds and self.creds.expired and self.creds.refresh_token:
                self.creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    settings.GMAIL_CREDENTIALS_FILE, 
                    settings.GMAIL_SCOPES
                )
                self.creds = flow.run_local_server(port=0)
            
            print("Saving credentials to", settings.GMAIL_TOKEN_FILE)
            
            with open(settings.GMAIL_TOKEN_FILE, 'w') as token:
                token.write(self.creds.to_json())
        
        return build('gmail', 'v1', credentials=self.creds)
    
if __name__ == "__main__":
    authenticator = GmailAuthenticator()
    service = authenticator.authenticate()
    results = service.users().labels().list(userId="me").execute()
    labels = results.get("labels", [])

    if not labels:
      print("No labels found.")

    print("Labels:")
    for label in labels:
      print(label["name"])