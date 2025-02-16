import sys
import PyPDF2
from docx import Document
import openai
import os
from dotenv import load_dotenv
import time

# Load environment variables from .env
load_dotenv()

# Get the OpenAI API key from .env
OPENAI_API_KEY = ""

if not OPENAI_API_KEY:
    print("Error: OPENAI_API_KEY is not set in the .env file.")
    sys.exit(1)

# Configure OpenAI API
openai.api_key = OPENAI_API_KEY

def extract_text_from_pdf(file_path):
    """Extracts text from a PDF file."""
    try:
        with open(file_path, 'rb') as file:
            reader = PyPDF2.PdfReader(file)
            text = ''.join(page.extract_text() or '' for page in reader.pages)
        return text.strip()
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return ""

def extract_text_from_docx(file_path):
    """Extracts text from a DOCX file."""
    try:
        doc = Document(file_path)
        return ' '.join([paragraph.text for paragraph in doc.paragraphs]).strip()
    except Exception as e:
        print(f"Error extracting text from DOCX: {e}")
        return ""

def generate_questions(text, difficulty):
    """Generates interview questions using OpenAI GPT."""
    if not text:
        print("Error: No text extracted from resume.")
        return []

    prompt = f"""
    Analyze the following resume and generate 10 {difficulty}-level questions based on the candidate's skills and experience:

    Resume:
    {text}

    Ensure the questions are relevant to the job role and test the candidate's expertise.
    """

    try:
        # Use OpenAI's GPT model to generate questions
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # Use GPT-3.5 Turbo
            messages=[
                {"role": "system", "content": "You are a helpful assistant that generates interview questions."},
                {"role": "user", "content": prompt}
            ]
        )
        if response and response.choices:
            questions = response.choices[0].message['content'].strip().split('\n')
            return [q for q in questions if q.strip()]  # Filter out empty lines
        else:
            print("Error: No response from OpenAI API.")
            return []
    except Exception as e:
        print(f"Error generating questions: {e}")
        return []

def display_questions(questions):
    """Displays questions in a loop, changing every 20 seconds."""
    for i, question in enumerate(questions):
        print(f"\nQuestion {i+1}: {question}")
        time.sleep(20)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python resume_analyzer_v2.py <file_path>")
        sys.exit(1)

    file_path = sys.argv[1]

    if file_path.endswith('.pdf'):
        text = extract_text_from_pdf(file_path)
    elif file_path.endswith('.docx'):
        text = extract_text_from_docx(file_path)
    else:
        print("Unsupported file format. Please use PDF or DOCX.")
        sys.exit(1)

    difficulty = input("Choose the difficulty level (basic/intermediate/advanced): ").lower()
    while difficulty not in ['basic', 'intermediate', 'advanced']:
        print("Invalid choice. Please choose basic, intermediate, or advanced.")
        difficulty = input("Choose the difficulty level (basic/intermediate/advanced): ").lower()

    questions = generate_questions(text, difficulty)

    if questions:
        display_questions(questions)
    else:
        print("No questions generated.")