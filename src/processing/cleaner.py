from bs4 import BeautifulSoup
import re

class HTMLCleaner:
    @staticmethod
    def clean(html: str) -> str:
        """Convert HTML to clean text"""
        soup = BeautifulSoup(html, 'html.parser')
        
        # Remove script and style tags
        for tag in soup(['script', 'style', 'header', 'footer', 'nav']):
            tag.decompose()
        
        # Get text
        text = soup.get_text(separator='\n', strip=True)
        
        # Clean whitespace
        text = re.sub(r'\n\s*\n', '\n\n', text)
        text = re.sub(r' +', ' ', text)
        
        return text.strip()
    
    @staticmethod
    def truncate(text: str, max_chars: int = 3000) -> str:
        """Truncate long text"""
        return text[:max_chars] + "..." if len(text) > max_chars else text