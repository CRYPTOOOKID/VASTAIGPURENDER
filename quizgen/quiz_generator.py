#!/usr/bin/env python3
"""
Quiz Generator - Automated quiz generation using OpenAI GPT-5-mini
Generates 90-question quizzes (30 low, 30 medium, 30 hard) for multiple topics
One request every 30 seconds (2 requests per minute)
"""

import os
import json
import time
import asyncio
from pathlib import Path
from typing import List, Dict, Any
from datetime import datetime
import aiohttp
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configuration
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', '')
MODEL_NAME = 'gpt-5-mini-2025-08-07'
API_URL = 'https://api.openai.com/v1/chat/completions'

# Rate limiting configuration - Sequential processing
# 1 request per minute with 6 minute timeout for 90-question generation
DELAY_BETWEEN_REQUESTS = 60  # 1 minute between requests
REQUEST_TIMEOUT = 360  # 6 minutes (360 seconds) timeout per request - generating 90 questions takes time

# Paths
BASE_DIR = Path(__file__).parent
PROMPT_FILE = BASE_DIR / 'prompt.json'
TOPICS_FILE = BASE_DIR / 'topics.json'
OUTPUT_DIR = BASE_DIR / 'QuizzesOp'
LOG_FILE = BASE_DIR / 'quiz_generation.log'

# Ensure output directory exists
OUTPUT_DIR.mkdir(exist_ok=True)


class QuizGenerator:
    """Main class for generating quizzes using OpenAI API"""

    def __init__(self):
        self.api_key = OPENAI_API_KEY
        self.master_prompt = self._load_master_prompt()
        self.topics = self._load_topics()
        self.session = None
        self.generated_count = 0
        self.failed_topics = []
        self.log_entries = []
        self.skipped_count = 0

    def _load_master_prompt(self) -> str:
        """Load the master prompt from prompt.json"""
        try:
            with open(PROMPT_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('prompt', '')
        except Exception as e:
            raise Exception(f"Error loading prompt.json: {e}")

    def _load_topics(self) -> List[str]:
        """Load topics from topics.json"""
        try:
            with open(TOPICS_FILE, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('quizTopics', [])
        except Exception as e:
            raise Exception(f"Error loading topics.json: {e}")

    def _sanitize_filename(self, topic: str) -> str:
        """Convert topic name to a valid filename"""
        # Remove or replace invalid characters
        invalid_chars = '<>:"/\\|?*'
        filename = topic
        for char in invalid_chars:
            filename = filename.replace(char, '_')
        # Limit length and remove leading/trailing spaces
        filename = filename.strip()[:200]
        return filename + '.json'

    def _is_topic_already_processed(self, topic: str) -> bool:
        """Check if a quiz file already exists for this topic"""
        filename = self._sanitize_filename(topic)
        filepath = OUTPUT_DIR / filename
        return filepath.exists()

    def _create_prompt_for_topic(self, topic: str) -> str:
        """Replace [TOPIC] placeholder with actual topic"""
        return self.master_prompt.replace('[TOPIC]', topic)

    async def _make_api_request(self, topic: str, retry_count: int = 3) -> Dict[str, Any]:
        """Make API request to OpenAI for a single topic"""
        prompt = self._create_prompt_for_topic(topic)

        headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {self.api_key}'
        }

        payload = {
            'model': MODEL_NAME,
            'messages': [
                {
                    'role': 'system',
                    'content': 'You are a quiz generation expert. Generate high-quality, engaging quiz questions organized by difficulty level in valid JSON format only. Return only the JSON object with structure: {"quiz": {"low": [...], "medium": [...], "hard": [...]}}, no additional text.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            'max_completion_tokens': 16000,  # GPT-5-mini uses max_completion_tokens instead of max_tokens
            'response_format': {'type': 'json_object'},
            'reasoning_effort': 'medium'  # Minimize reasoning time for faster responses
            # Note: temperature is not included - GPT-5-mini only supports default value of 1
        }

        for attempt in range(retry_count):
            try:
                async with self.session.post(API_URL, headers=headers, json=payload, timeout=REQUEST_TIMEOUT) as response:
                    if response.status == 200:
                        result = await response.json()
                        content = result['choices'][0]['message']['content']

                        # Parse the JSON response
                        quiz_data = json.loads(content)

                        # Validate the structure
                        if self._validate_quiz_structure(quiz_data):
                            return {'success': True, 'data': quiz_data, 'topic': topic}
                        else:
                            error_msg = self._get_validation_error(quiz_data)
                            return {'success': False, 'error': f'Invalid structure: {error_msg}', 'topic': topic}

                    elif response.status == 429:  # Rate limit
                        wait_time = 60
                        self._log(f"Rate limit hit for '{topic}', waiting {wait_time}s...")
                        await asyncio.sleep(wait_time)
                        continue

                    else:
                        error_text = await response.text()
                        return {'success': False, 'error': f"API error {response.status}: {error_text}", 'topic': topic}

            except asyncio.TimeoutError:
                self._log(f"Timeout for '{topic}', attempt {attempt + 1}/{retry_count}")
                if attempt < retry_count - 1:
                    await asyncio.sleep(10)
                    continue
                return {'success': False, 'error': 'Request timeout', 'topic': topic}

            except Exception as e:
                self._log(f"Error for '{topic}': {str(e)}")
                if attempt < retry_count - 1:
                    await asyncio.sleep(10)
                    continue
                return {'success': False, 'error': str(e), 'topic': topic}

        return {'success': False, 'error': 'Max retries exceeded', 'topic': topic}

    def _validate_quiz_structure(self, quiz_data: Dict[str, Any]) -> bool:
        """Validate that quiz has correct structure - accepts any number of questions per difficulty"""
        try:
            if 'quiz' not in quiz_data:
                return False

            quiz = quiz_data['quiz']

            # Check for all three difficulty levels
            if 'low' not in quiz or 'medium' not in quiz or 'hard' not in quiz:
                return False

            # Check that each difficulty has at least 1 question
            low_count = len(quiz['low'])
            medium_count = len(quiz['medium'])
            hard_count = len(quiz['hard'])

            if low_count < 1 or medium_count < 1 or hard_count < 1:
                return False

            # Validate each question has required fields
            for difficulty in ['low', 'medium', 'hard']:
                for q in quiz[difficulty]:
                    if not all(key in q for key in ['question', 'options', 'answer']):
                        return False
                    if len(q['options']) != 3:
                        return False
                    if q['answer'] not in q['options']:
                        return False

            return True
        except:
            return False

    def _get_validation_error(self, quiz_data: Dict[str, Any]) -> str:
        """Get specific validation error message"""
        try:
            if 'quiz' not in quiz_data:
                return "Missing 'quiz' key"

            quiz = quiz_data['quiz']

            if 'low' not in quiz:
                return "Missing 'low' difficulty"
            if 'medium' not in quiz:
                return "Missing 'medium' difficulty"
            if 'hard' not in quiz:
                return "Missing 'hard' difficulty"

            low_count = len(quiz.get('low', []))
            medium_count = len(quiz.get('medium', []))
            hard_count = len(quiz.get('hard', []))

            # Check for empty difficulties
            if low_count < 1:
                return f"'low' difficulty has no questions"
            if medium_count < 1:
                return f"'medium' difficulty has no questions"
            if hard_count < 1:
                return f"'hard' difficulty has no questions"

            # Check individual questions for missing fields
            for difficulty in ['low', 'medium', 'hard']:
                for idx, q in enumerate(quiz[difficulty], 1):
                    if not all(key in q for key in ['question', 'options', 'answer']):
                        missing = [k for k in ['question', 'options', 'answer'] if k not in q]
                        return f"{difficulty} question #{idx} missing fields: {missing}"
                    if len(q.get('options', [])) != 3:
                        return f"{difficulty} question #{idx} has {len(q.get('options', []))} options (need 3)"
                    if q.get('answer') not in q.get('options', []):
                        return f"{difficulty} question #{idx} answer not in options"

            return f"Unknown validation error - counts: low={low_count}, medium={medium_count}, hard={hard_count}"
        except Exception as e:
            return str(e)

    def _save_quiz(self, topic: str, quiz_data: Dict[str, Any]) -> bool:
        """Save quiz data to a JSON file"""
        try:
            filename = self._sanitize_filename(topic)
            filepath = OUTPUT_DIR / filename

            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(quiz_data, f, indent=2, ensure_ascii=False)

            # Count questions
            low = len(quiz_data['quiz']['low'])
            med = len(quiz_data['quiz']['medium'])
            hard = len(quiz_data['quiz']['hard'])
            total = low + med + hard

            self._log(f"✓ Saved quiz for '{topic}' ({total} questions: {low} low, {med} medium, {hard} hard) to {filename}")
            return True

        except Exception as e:
            self._log(f"✗ Error saving quiz for '{topic}': {e}")
            return False

    def _log(self, message: str):
        """Log message to console and file"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        log_message = f"[{timestamp}] {message}"
        print(log_message)
        self.log_entries.append(log_message)

    def _save_log(self):
        """Save log entries to file"""
        try:
            with open(LOG_FILE, 'a', encoding='utf-8') as f:
                f.write('\n'.join(self.log_entries) + '\n\n')
        except Exception as e:
            print(f"Error saving log: {e}")

    async def generate_all_quizzes(self):
        """Main method to generate quizzes for all topics sequentially"""
        if not self.api_key:
            self._log("ERROR: OPENAI_API_KEY not found. Please set it in .env file")
            return

        total_topics = len(self.topics)
        self._log(f"Starting quiz generation for {total_topics} topics")
        self._log(f"Processing: 1 request every {DELAY_BETWEEN_REQUESTS} seconds")
        self._log(f"Timeout per request: {REQUEST_TIMEOUT} seconds (3 minutes)")
        self._log(f"Each quiz: 90 questions (28-32 low, 28-32 medium, 28-32 hard)")
        estimated_time = (total_topics * DELAY_BETWEEN_REQUESTS) / 60
        self._log(f"Estimated time: {estimated_time:.1f} minutes ({estimated_time/60:.1f} hours)")
        self._log("=" * 80)

        # Create aiohttp session
        async with aiohttp.ClientSession() as session:
            self.session = session

            # Process topics one by one with delay
            for idx, topic in enumerate(self.topics, 1):
                self._log(f"\n--- Processing {idx}/{total_topics}: '{topic}' ---")

                # Check if topic already processed
                if self._is_topic_already_processed(topic):
                    self._log(f"⊘ Skipping '{topic}' - already processed")
                    self.skipped_count += 1
                    continue

                start_time = time.time()

                # Make API request
                result = await self._make_api_request(topic)

                # Save result
                if result['success']:
                    if self._save_quiz(result['topic'], result['data']):
                        self.generated_count += 1
                else:
                    self._log(f"✗ Failed to generate quiz for '{result['topic']}': {result['error']}")
                    self.failed_topics.append({
                        'topic': result['topic'],
                        'error': result['error']
                    })

                elapsed = time.time() - start_time

                # Wait before next request (except for the last one)
                if idx < total_topics:
                    wait_time = max(0, DELAY_BETWEEN_REQUESTS - elapsed)
                    if wait_time > 0:
                        self._log(f"Waiting {wait_time:.1f}s before next request...")
                        await asyncio.sleep(wait_time)

        # Summary
        self._log("\n" + "=" * 80)
        self._log(f"Quiz Generation Complete!")
        self._log(f"Successfully generated: {self.generated_count}/{total_topics}")
        self._log(f"Skipped (already processed): {self.skipped_count}/{total_topics}")
        self._log(f"Failed: {len(self.failed_topics)}/{total_topics}")

        if self.generated_count > 0:
            total_questions = self.generated_count * 90
            self._log(f"Total questions generated: {total_questions} (90 per quiz)")

        if self.failed_topics:
            self._log("\nFailed Topics:")
            for failed in self.failed_topics:
                self._log(f"  - {failed['topic']}: {failed['error']}")

        # Save log
        self._save_log()

        # Save failed topics for retry
        if self.failed_topics:
            failed_file = BASE_DIR / 'failed_topics.json'
            with open(failed_file, 'w', encoding='utf-8') as f:
                json.dump(self.failed_topics, f, indent=2)
            self._log(f"\nFailed topics saved to {failed_file}")


async def main():
    """Entry point"""
    print("=" * 80)
    print("Quiz Generator - OpenAI GPT-5-mini")
    print("90 Questions per Topic (30 Low, 30 Medium, 30 Hard)")
    print("=" * 80)

    generator = QuizGenerator()
    await generator.generate_all_quizzes()

    print("\n" + "=" * 80)
    print(f"All quizzes saved to: {OUTPUT_DIR}")
    print("=" * 80)


if __name__ == '__main__':
    asyncio.run(main())
