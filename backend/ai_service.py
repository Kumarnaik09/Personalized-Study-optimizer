import os
import json
from groq import Groq
from dotenv import load_dotenv

class GroqService:
    def __init__(self):
        # Always load .env so the key is picked up even after hot-reloads
        load_dotenv(override=True)
        self.api_key = os.environ.get("GROQ_API_KEY")
        if not self.api_key:
            print("WARNING: GROQ_API_KEY not found. Running in mock mode.")
            self.client = None
        else:
            print(f"Groq API key loaded (starts with: {self.api_key[:8]}...)")
            self.client = Groq(api_key=self.api_key)

    def _split_text(self, text: str, chunk_size: int = 3000):
        """Split text into chunks of roughly chunk_size characters."""
        return [text[i:i + chunk_size] for i in range(0, len(text), chunk_size)]

    def _extract_list(self, data) -> list:
        """Recursively find the first list inside a parsed JSON value."""
        if isinstance(data, list):
            return data
        if isinstance(data, dict):
            for val in data.values():
                result = self._extract_list(val)
                if result is not None:
                    return result
        return []

    def _call_groq(self, prompt: str) -> str:
        """Make a single Groq API call and return the response text."""
        completion = self.client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        return completion.choices[0].message.content

    # ------------------------------------------------------------------
    # Flashcards
    # ------------------------------------------------------------------
    def generate_flashcards(self, text: str):
        if not self.client:
            return self._mock_flashcards()

        chunks = self._split_text(text)
        all_flashcards = []

        for i, chunk in enumerate(chunks):
            prompt = f"""You are an expert educator. Analyze the text below and generate high-quality educational flashcards.

Rules:
- Each flashcard MUST cover a key concept found ONLY in the provided text.
- Return a JSON object with a single key "flashcards" whose value is a list of objects.
- Each object must have exactly three keys: "concept" (short title), "explanation" (clear, concise description), "mnemonic" (a creative memory trick).
- Do NOT include any information from outside the provided text.

TEXT:
{chunk}
"""
            try:
                content = self._call_groq(prompt)
                data = json.loads(content)
                cards = self._extract_list(data)
                all_flashcards.extend(cards)
                print(f"Flashcards chunk {i}: extracted {len(cards)} cards")
            except Exception as e:
                print(f"Error generating flashcards for chunk {i}: {e}")
                continue

        # Assign sequential IDs
        for idx, card in enumerate(all_flashcards):
            card["id"] = idx + 1

        return all_flashcards if all_flashcards else self._mock_flashcards()

    # ------------------------------------------------------------------
    # Quiz
    # ------------------------------------------------------------------
    def generate_quiz(self, text: str):
        if not self.client:
            return self._mock_quiz()

        chunks = self._split_text(text)
        all_questions = []

        # Use up to the first 3 chunks so the quiz stays manageable
        for i, chunk in enumerate(chunks[:3]):
            prompt = f"""You are an expert educator. Generate exactly 3 Multiple Choice Questions (MCQs) based ONLY on the text below.

Rules:
- Questions must be based strictly on the provided text — do NOT invent topics.
- Return a JSON object with a single key "questions" whose value is a list of objects.
- Each object must have: "question" (string), "options" (list of exactly 4 strings), "correct_index" (integer 0-3).

TEXT:
{chunk}
"""
            try:
                content = self._call_groq(prompt)
                data = json.loads(content)
                questions = data.get("questions", self._extract_list(data))
                all_questions.extend(questions)
                print(f"Quiz chunk {i}: extracted {len(questions)} questions")
            except Exception as e:
                print(f"Error generating quiz for chunk {i}: {e}")
                continue

        # Assign IDs
        for idx, q in enumerate(all_questions):
            q["id"] = 1000 + idx

        return all_questions if all_questions else self._mock_quiz()

    # ------------------------------------------------------------------
    # Remedial
    # ------------------------------------------------------------------
    def generate_remedial(self, question_text: str, wrong_answer: str):
        if not self.client:
            return self._mock_remedial()

        prompt = f"""A student answered a quiz question incorrectly.

Question: "{question_text}"
Wrong answer given: "{wrong_answer}"

Your task:
1. Give a simplified, crystal-clear explanation of the concept being tested.
2. Create a new practice question on the same concept (4 options, mark the correct one).

Return a JSON object with exactly these keys:
- "simplified_explanation": string
- "new_question": object with "question" (string), "options" (list of 4 strings), "correct_index" (integer 0-3)
"""
        try:
            content = self._call_groq(prompt)
            return json.loads(content)
        except Exception as e:
            print(f"Error generating remedial: {e}")
            return self._mock_remedial()

    # ------------------------------------------------------------------
    # Mock fallbacks (shown when API key is missing or calls all fail)
    # ------------------------------------------------------------------
    def _mock_flashcards(self):
        return [
            {
                "id": 1,
                "concept": "API Key Missing",
                "explanation": "GROQ_API_KEY is not configured. Add it to backend/.env and restart the server to generate real flashcards from your PDF.",
                "mnemonic": "No key = no cards."
            }
        ]

    def _mock_quiz(self):
        return [
            {
                "id": 1001,
                "question": "[Setup Required] Add your GROQ_API_KEY to backend/.env, then restart the backend server and re-upload your PDF.",
                "options": ["Understood", "OK", "Got it", "Will do"],
                "correct_index": 0
            }
        ]

    def _mock_remedial(self):
        return {
            "simplified_explanation": "GROQ_API_KEY is not set. Add it to backend/.env and restart the backend server.",
            "new_question": {
                "question": "Have you set the GROQ_API_KEY in backend/.env?",
                "options": ["Yes", "No", "Not yet", "On it"],
                "correct_index": 0
            }
        }
