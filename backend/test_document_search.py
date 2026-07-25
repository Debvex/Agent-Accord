"""
Test script for document upload and search functionality
"""
import asyncio
import os
import sys
from dotenv import load_dotenv

# Add backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

async def test_document_search():
    """Test the document search tool with uploaded files"""
    from tools import DocumentSearchTool
    
    print("=" * 60)
    print("Testing Document Search Tool")
    print("=" * 60)
    
    # Check if uploads directory exists and has files
    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
    if not os.path.exists(uploads_dir):
        print(f"\n❌ Uploads directory not found: {uploads_dir}")
        print("Creating uploads directory...")
        os.makedirs(uploads_dir, exist_ok=True)
    
    # List files in uploads
    files = os.listdir(uploads_dir) if os.path.exists(uploads_dir) else []
    print(f"\n[INFO] Files in uploads directory: {len(files)}")
    for f in files:
        print(f"   - {f}")
    
    if not files:
        print("\n[WARN] No files in uploads directory. Creating test file...")
        test_file = os.path.join(uploads_dir, "test_company_policy.txt")
        with open(test_file, "w", encoding="utf-8") as f:
            f.write("""
Company Policy: Remote Work Guidelines
Effective Date: 2026-01-01

1. ELIGIBILITY
All full-time employees who have completed their probation period are eligible for remote work.

2. WORKING HOURS
Remote employees must be available during core hours: 10:00 AM - 3:00 PM EST
Flexible scheduling allowed outside core hours with manager approval.

3. EQUIPMENT
Company provides laptop and $500 home office setup stipend.
Employee responsible for internet connection (up to $50/month reimbursement).

4. COMMUNICATION
Daily standup at 9:30 AM EST via Zoom
Weekly team meeting on Tuesdays at 2:00 PM EST
Response time expectation: within 2 hours during core hours

5. PERFORMANCE
Same performance standards as office-based employees
Monthly check-ins with manager required
            """)
        print(f"[OK] Created test file: {test_file}")
        files = [test_file]
    
    # Test document search
    print("\n" + "=" * 60)
    print("Testing Document Search")
    print("=" * 60)
    
    search_tool = DocumentSearchTool()
    
    test_queries = [
        "remote work policy",
        "working hours",
        "equipment stipend",
        "communication requirements"
    ]
    
    for query in test_queries:
        print(f"\n[SEARCH] Query: '{query}'")
        print("-" * 60)
        try:
            result = search_tool._run(query)
            if result and "No relevant information" not in result and "Error" not in result:
                print(f"[OK] Found relevant information")
                # Show first 200 chars of result
                preview = result[:200].replace('\n', ' ')
                print(f"   Preview: {preview}...")
            else:
                print(f"[WARN] {result}")
        except Exception as e:
            print(f"[ERROR] {e}")
    
    print("\n" + "=" * 60)
    print("Test Complete")
    print("=" * 60)

if __name__ == "__main__":
    asyncio.run(test_document_search())
