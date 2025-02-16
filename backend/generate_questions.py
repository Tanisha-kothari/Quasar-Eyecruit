import sys
import json
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get the OpenAI API key from .env
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

if not OPENAI_API_KEY:
    print("Error: OPENAI_API_KEY is not set in the .env file.")
    sys.exit(1)

# Configure OpenAI API
openai.api_key = OPENAI_API_KEY

def generate_questions(skills, difficulty):
    """Generates interview questions based on skills and difficulty."""
    if not skills:
        print("Error: No skills provided.")
        return []

    prompt = f"""
    Generate 10 {difficulty}-level interview questions based on the following skills:

    Skills:
    {', '.join(skills)}

    Ensure the questions are relevant to the skills and test the candidate's expertise.
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

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python generate_questions.py <skills_json> <difficulty>")
        sys.exit(1)

    skills = json.loads(sys.argv[1])
    difficulty = sys.argv[2]

    questions = generate_questions(skills, difficulty)

    for question in questions:
        print(question)