from bs4 import BeautifulSoup
import re
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from gmail.fetcher import NewsletterFetcher

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
        """Content-aware truncation that prioritizes main body content.

        - Keeps early/title paragraphs first
        - Skips typical footer/nav/legal boilerplate where possible
        - Respects paragraph boundaries instead of cutting blindly
        """
        # Fast path: nothing to do
        if len(text) <= max_chars:
            return text

        # Split by paragraph (double newline is our paragraph separator
        # given how `clean` formats the text)
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]

        # If we can't detect paragraphs, fall back to simple truncation
        if not paragraphs:
            return text[:max_chars].rstrip() + "..."

        junk_keywords = [
            "privacy policy",
            "terms of service",
            "terms & conditions",
            "terms and conditions",
            "cookie policy",
            "cookies",
            "unsubscribe",
            "all rights reserved",
            "copyright",
            "do not reply",
            "forward this email",
            "view in browser",
            "manage preferences",
            "update preferences",
            "follow us",
            "contact us",
            "about us",
        ]

        def is_junk_paragraph(p: str, index: int) -> bool:
            """Heuristic filter for footer/nav/legal-style paragraphs.

            We are conservative with the first few paragraphs to avoid
            accidentally dropping important intro content.
            """
            lower = p.lower()

            # Never treat the first two paragraphs as junk; they are
            # typically title + lead/summary.
            if index <= 1:
                return False

            # Very short paragraphs with few words are often buttons/links
            words = lower.split()
            if len(words) <= 4:
                return True

            # Obvious boilerplate / legal / email footer content
            if any(kw in lower for kw in junk_keywords):
                return True

            return False

        selected_paragraphs = []
        current_len = 0

        for idx, p in enumerate(paragraphs):
            # Skip likely boilerplate
            if is_junk_paragraph(p, idx):
                continue

            # Length if we add this paragraph (plus separator if needed)
            separator_len = 2 if selected_paragraphs else 0  # for "\n\n"
            projected_len = current_len + separator_len + len(p)

            if projected_len > max_chars:
                # Try to add a partial paragraph if nothing has been added yet
                remaining = max_chars - current_len - separator_len
                if remaining > 0:
                    truncated_p = p[:remaining].rstrip()
                    if truncated_p:
                        selected_paragraphs.append(truncated_p)
                        current_len += separator_len + len(truncated_p)
                break

            selected_paragraphs.append(p)
            current_len = projected_len

        # If, for some reason, nothing made it through the heuristics,
        # fall back to naive truncation.
        if not selected_paragraphs:
            return text[:max_chars].rstrip() + "..."

        result = "\n\n".join(selected_paragraphs).rstrip()

        # Add an explicit truncation marker so callers know it was shortened
        if len(result) < len(text):
            return result + "\n\n...[truncated]"

        return result


if __name__ == "__main__":
    newsletters = NewsletterFetcher()
    emails = newsletters.fetch_yesterday_newsletters()
    email = emails[1]
    body = email['body']
    
    # Print diagnostic information
    print(f"Email body length: {len(body)} characters")
    print(f"Email body preview (first 500 chars):\n{body[:500]}...")
    print(f"\nEmail body ends with (last 200 chars):\n...{body[-200:]}")
    print("\n" + "="*80)
    print("Full email body:")
    print("="*80)
    print(body)
    cleaned_body = HTMLCleaner.clean(body)
    # Save to file to check if terminal is truncating
    output_file = "email_body_output.txt"
    output_file_cleaned = "email_body_output_cleaned.txt"
    with open(output_file, 'w', encoding='utf-8') as f, \
    open(output_file_cleaned, 'w', encoding='utf-8') as f_cleaned:
        f.write(body)
        f_cleaned.write(cleaned_body)
    print(f"\n[Note: Full body also saved to {output_file} for verification]")
    # print(HTMLCleaner.truncate(email['body']))