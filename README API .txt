# Regulatory Compliance RAG Scraper

A production-ready, AI-powered web scraping platform for regulatory compliance monitoring with semantic reasoning capabilities.

## Features

✅ **Ethical Web Scraping**
- Respects robots.txt automatically
- Configurable rate limiting
- Identifiable user agent
- GDPR/CCPA compliant design

✅ **RAG-Powered Analysis**
- Semantic understanding of regulations
- Question-answering over scraped content
- Source attribution and citation
- Context-aware compliance insights

✅ **Multiple Export Formats**
- PDF reports with professional formatting
- JSON API for platform integration
- Vector embeddings for advanced search

✅ **Enterprise-Ready**
- Async processing for scalability
- Background job queue
- Comprehensive error handling
- Audit logging built-in

## Quick Start

### 1. Deploy to Replit

1. Create a new Replit project
2. Upload `main.py` and `requirements.txt`
3. Add your OpenAI API key to Secrets:
   - Key: `OPENAI_API_KEY`
   - Value: `sk-...`
4. Click "Run"

### 2. Local Development

```bash
# Clone or create project directory
git clone <your-repo>
cd compliance-scraper

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Install Playwright browsers
python -m playwright install chromium

# Create .env file
echo "OPENAI_API_KEY=sk-your-key-here" > .env

# Run the server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Docker Deployment

```bash
# Build image
docker build -t compliance-scraper .

# Run container
docker run -p 8000:8000 -e OPENAI_API_KEY=sk-your-key compliance-scraper
```

## API Usage Examples

### Example 1: Basic Scraping Job

```python
import requests
import time

# Start scraping job
response = requests.post('http://localhost:8000/api/v1/scrape', json={
    'url': 'https://www.sec.gov/rules/final/2024/example.html',
    'jurisdiction': 'US',
    'category': 'finance',
    'respect_robots_txt': True,
    'rate_limit_ms': 2000
})

job = response.json()
job_id = job['job_id']
print(f"Job created: {job_id}")

# Poll for completion
while True:
    status = requests.get(f'http://localhost:8000/api/v1/jobs/{job_id}').json()
    print(f"Status: {status['status']} ({status['progress']}%)")
    
    if status['status'] in ['completed', 'failed']:
        break
    
    time.sleep(5)

print("Job completed!")
```

### Example 2: RAG Question-Answering

```python
# Ask questions about the scraped content
response = requests.post('http://localhost:8000/api/v1/analyze', json={
    'job_id': job_id,
    'question': 'What are the key compliance deadlines for financial institutions?'
})

result = response.json()
print(f"Question: {result['question']}")
print(f"Answer: {result['answer']}")
print(f"\nSources:")
for source in result['sources']:
    print(f"  - {source['title']}: {source['url']}")
```

### Example 3: Export Reports

```python
# Export as PDF
pdf_response = requests.get(f'http://localhost:8000/api/v1/export/pdf/{job_id}')
pdf_data = pdf_response.json()
print(f"PDF generated: {pdf_data['pdf_path']}")

# Export as JSON for API integration
json_response = requests.get(f'http://localhost:8000/api/v1/export/json/{job_id}')
data = json_response.json()

# Send to your platform
platform_response = requests.post(
    'https://your-platform.com/api/compliance-data',
    json=data,
    headers={'Authorization': 'Bearer your-platform-api-key'}
)
```

## Complete Client Example

```python
#!/usr/bin/env python3
"""
Complete example client for the Compliance Scraper API
"""

import requests
import time
import json
from typing import Dict, List

class ComplianceScraperClient:
    def __init__(self, base_url: str = "http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
    
    def create_scrape_job(self, url: str, jurisdiction: str = "US", 
                         category: str = "finance") -> str:
        """Create a new scraping job and return job_id"""
        response = self.session.post(f"{self.base_url}/api/v1/scrape", json={
            'url': url,
            'jurisdiction': jurisdiction,
            'category': category,
            'respect_robots_txt': True,
            'rate_limit_ms': 2000
        })
        response.raise_for_status()
        return response.json()['job_id']
    
    def wait_for_job(self, job_id: str, timeout: int = 300) -> Dict:
        """Wait for job to complete"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            status = self.get_job_status(job_id)
            
            print(f"[{status['status'].upper()}] Progress: {status['progress']}%")
            
            if status['status'] == 'completed':
                return status
            elif status['status'] == 'failed':
                raise Exception(f"Job failed: {status.get('error', 'Unknown error')}")
            
            time.sleep(5)
        
        raise TimeoutError(f"Job {job_id} did not complete within {timeout} seconds")
    
    def get_job_status(self, job_id: str) -> Dict:
        """Get current job status"""
        response = self.session.get(f"{self.base_url}/api/v1/jobs/{job_id}")
        response.raise_for_status()
        return response.json()
    
    def ask_question(self, job_id: str, question: str) -> Dict:
        """Ask a question using RAG"""
        response = self.session.post(f"{self.base_url}/api/v1/analyze", json={
            'job_id': job_id,
            'question': question
        })
        response.raise_for_status()
        return response.json()
    
    def export_pdf(self, job_id: str) -> str:
        """Export analysis as PDF"""
        response = self.session.get(f"{self.base_url}/api/v1/export/pdf/{job_id}")
        response.raise_for_status()
        return response.json()['pdf_path']
    
    def export_json(self, job_id: str) -> Dict:
        """Export analysis as JSON"""
        response = self.session.get(f"{self.base_url}/api/v1/export/json/{job_id}")
        response.raise_for_status()
        return response.json()

def main():
    # Initialize client
    client = ComplianceScraperClient("http://localhost:8000")
    
    # 1. Create scraping job
    print("=" * 60)
    print("Starting Compliance Scraping Job")
    print("=" * 60)
    
    job_id = client.create_scrape_job(
        url="https://www.sec.gov/rules/final/2023/example.html",
        jurisdiction="US",
        category="finance"
    )
    print(f"✅ Job created: {job_id}\n")
    
    # 2. Wait for completion
    print("⏳ Waiting for job to complete...")
    status = client.wait_for_job(job_id)
    print(f"✅ Job completed! Scraped {status['documents_scraped']} documents\n")
    
    # 3. Ask compliance questions
    print("=" * 60)
    print("RAG-Powered Compliance Analysis")
    print("=" * 60)
    
    questions = [
        "What are the main compliance requirements?",
        "What are the key deadlines mentioned?",
        "Which entities are affected by these regulations?",
        "What are the penalties for non-compliance?"
    ]
    
    for question in questions:
        print(f"\n❓ {question}")
        result = client.ask_question(job_id, question)
        print(f"💡 {result['answer'][:300]}...")
        print(f"📚 Sources: {len(result['sources'])} documents")
    
    # 4. Export reports
    print("\n" + "=" * 60)
    print("Exporting Reports")
    print("=" * 60)
    
    pdf_path = client.export_pdf(job_id)
    print(f"📄 PDF Report: {pdf_path}")
    
    json_data = client.export_json(job_id)
    print(f"📊 JSON Export: {len(json_data['documents'])} documents exported")
    
    # 5. Send to external platform (example)
    print("\n" + "=" * 60)
    print("Platform Integration Example")
    print("=" * 60)
    
    # Example: Send to your platform's API
    platform_payload = {
        'compliance_data': json_data['analysis'],
        'source_job_id': job_id,
        'imported_at': time.time()
    }
    
    print("📤 Ready to send to external platform:")
    print(json.dumps(platform_payload, indent=2)[:500] + "...")
    
    # Uncomment to actually send:
    # platform_response = requests.post(
    #     'https://your-platform.com/api/compliance',
    #     json=platform_payload,
    #     headers={'Authorization': 'Bearer your-api-key'}
    # )

if __name__ == "__main__":
    main()
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | OpenAI API key for GPT-4 and embeddings |
| `ANTHROPIC_API_KEY` | No | Alternative: Use Claude instead of GPT-4 |

## API Endpoints

### Core Endpoints

- `POST /api/v1/scrape` - Create scraping job
- `GET /api/v1/jobs/{job_id}` - Get job status
- `POST /api/v1/analyze` - Ask RAG questions
- `GET /api/v1/export/pdf/{job_id}` - Export PDF report
- `GET /api/v1/export/json/{job_id}` - Export JSON data
- `GET /health` - Health check

## Production Deployment

### Replit

1. **Environment**: Python 3.11+
2. **Secrets**: Add `OPENAI_API_KEY`
3. **Run Command**: Already configured in `.replit`
4. **Persistent Storage**: Enable for `chroma_db/` and `reports/`

### Railway

```bash
railway login
railway init
railway add
railway up
```

### AWS/GCP/Azure

Use the provided Dockerfile for containerized deployment.

## Compliance & Security

✅ **GDPR Compliant**: No personal data collection
✅ **Ethical Scraping**: Respects robots.txt and ToS
✅ **Rate Limited**: Prevents server overload
✅ **Audit Logs**: All operations logged
✅ **Source Attribution**: Every piece of data traceable

## Troubleshooting

**Issue**: Playwright installation fails
```bash
python -m playwright install --with-deps chromium
```

**Issue**: ChromaDB persistence errors
```bash
mkdir -p chroma_db
chmod 755 chroma_db
```

**Issue**: OpenAI rate limits
- Reduce concurrent jobs
- Implement retry logic with exponential backoff

## License

MIT License - see LICENSE file

## Support

For issues, feature requests, or questions:
- Open an issue on GitHub
- Email: support@compliance-scraper.com