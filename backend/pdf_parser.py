from pypdf import PdfReader
from io import BytesIO

def extract_text_from_pdf(file_contents: bytes) -> str:
    """Extracts text from a clear PDF file."""
    reader = PdfReader(BytesIO(file_contents))
    text = ""
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text + "\n"
    return text
