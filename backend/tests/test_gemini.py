
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
print(f"API Key found: {'Yes' if api_key else 'No'}")

if api_key:
    genai.configure(api_key=api_key)
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Hello, simulate a farming assistant.")
        print(f"Response: {response.text[:50]}...")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("No API Key.")
