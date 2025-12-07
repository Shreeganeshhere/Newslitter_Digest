from typing import Dict
from datetime import datetime

class NewsletterFormatter:
    @staticmethod
    def to_html(data: Dict) -> str:
        """Convert JSON to HTML newsletter"""
        html = f"""
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {{ 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 680px; 
            margin: 0 auto; 
            padding: 20px;
            background: #f5f5f5;
        }}
        .container {{ background: white; padding: 40px; border-radius: 8px; }}
        h1 {{ color: #1a1a1a; font-size: 28px; }}
        .date {{ color: #666; font-size: 14px; margin-bottom: 20px; }}
        .section {{ margin: 30px 0; }}
        .section h2 {{ color: #333; font-size: 20px; border-bottom: 2px solid #007aff; padding-bottom: 8px; }}
        .item {{ 
            background: #f8f9fa; 
            padding: 15px; 
            margin: 10px 0; 
            border-radius: 6px;
            border-left: 3px solid #007aff;
        }}
        .item-title {{ font-weight: 600; color: #1a1a1a; margin-bottom: 5px; }}
        .item-snippet {{ color: #555; font-size: 14px; line-height: 1.5; }}
        .source {{ color: #999; font-size: 12px; margin-top: 8px; }}
        a {{ color: #007aff; text-decoration: none; }}
        .footer {{ margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }}
    </style>
</head>
<body>
    <div class="container">
        <h1>{data['headline']}</h1>
        <div class="date">{data.get('date', datetime.now().strftime('%B %d, %Y'))}</div>
        <p><strong>{data.get('summary', '')}</strong></p>
"""
        
        for section in data.get('sections', []):
            html += f'<div class="section"><h2>{section["title"]}</h2>'
            
            for item in section.get('items', []):
                title = item.get('title', '')
                snippet = item.get('snippet', '')
                source = item.get('source', '')
                url = item.get('url', '#')
                
                html += f"""
                <div class="item">
                    <div class="item-title"><a href="{url}">{title}</a></div>
                    <div class="item-snippet">{snippet}</div>
                    <div class="source">Source: {source}</div>
                </div>
                """
            
            html += '</div>'
        
        html += """
        <div class="footer">
            You're receiving this because you subscribed to ML Daily Digest.
            <a href="#">Unsubscribe</a>
        </div>
    </div>
</body>
</html>
"""
        return html