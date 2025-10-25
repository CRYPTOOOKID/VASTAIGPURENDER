# Quick Start Guide - Quiz Generator

## What You Need to Do

### Step 1: Add Your API Key
1. Open the file: `quizgen/.env`
2. Replace the empty line with your OpenAI API key:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```
3. Save the file

### Step 2: Run the Program
Open Terminal and run:
```bash
cd "/Users/srinadhchitrakavi/Desktop/Projects /Quiz Channel 2.0/quizgen"
./run.sh
```

That's it! The program will:
- Automatically set up everything
- Generate quizzes for all 78 topics
- Save them in the `QuizzesOp` folder

## What Will Happen

The program will process **78 topics** from your `topics.json` file:
- Processes **1 topic every 30 seconds** (2 per minute)
- Takes about **39 minutes** total
- Each topic gets **90 quiz questions** organized by difficulty:
  - **30 LOW difficulty** - Basic, foundational knowledge
  - **30 MEDIUM difficulty** - Intermediate, deeper understanding
  - **30 HARD difficulty** - Expert-level, advanced knowledge
- Questions are saved as separate JSON files

## Example Output

```
==========================================
Quiz Generator - OpenAI GPT-5-mini
90 Questions per Topic (30 Low, 30 Medium, 30 Hard)
==========================================
Starting quiz generation for 78 topics
Processing: 1 request every 30 seconds (2 requests/minute)
Each quiz: 90 questions (30 low, 30 medium, 30 hard)
Estimated time: 39.0 minutes (0.7 hours)

--- Processing 1/78: 'Guess the Movie from the Emoji Clues' ---
✓ Saved quiz for 'Guess the Movie from the Emoji Clues' (90 questions: 30 low, 30 medium, 30 hard)
Waiting 25.3s before next request...

--- Processing 2/78: 'un common country Capitals Challenge' ---
✓ Saved quiz for 'un common country Capitals Challenge' (90 questions: 30 low, 30 medium, 30 hard)
Waiting 28.1s before next request...
```

## Where to Find Generated Quizzes

All generated quizzes will be in:
```
quizgen/QuizzesOp/
```

Each file is named after its topic, for example:
- `Guess_the_Movie_from_the_Emoji_Clues.json`
- `un_common_country_Capitals_Challenge.json`
- `Bollywood_Movies___Actors.json`

## JSON Structure

Each quiz file has this structure:
```json
{
  "quiz": {
    "low": [
      {
        "question": "Easy question text?",
        "options": ["Option 1", "Option 2", "Option 3"],
        "answer": "Correct option"
      }
      // ... 29 more LOW difficulty questions
    ],
    "medium": [
      {
        "question": "Medium difficulty question?",
        "options": ["Option 1", "Option 2", "Option 3"],
        "answer": "Correct option"
      }
      // ... 29 more MEDIUM difficulty questions
    ],
    "hard": [
      {
        "question": "Hard difficulty question?",
        "options": ["Option 1", "Option 2", "Option 3"],
        "answer": "Correct option"
      }
      // ... 29 more HARD difficulty questions
    ]
  }
}
```

## If Something Goes Wrong

### Error: "OPENAI_API_KEY not found"
- You forgot to add your API key to the `.env` file
- Solution: Follow Step 1 above

### Error: "Permission denied: ./run.sh"
- The script isn't executable
- Solution: Run `chmod +x run.sh` first

### Error: "Rate limit exceeded"
- You're making too many requests
- Solution: The program handles this automatically, just wait

### Some Quizzes Failed
- Check `failed_topics.json` to see which ones
- Check `quiz_generation.log` for details
- You can run the program again to retry

### Invalid quiz structure
- The AI didn't generate exactly 30 questions per difficulty
- Solution: The program will mark it as failed and you can retry

## Important Notes

1. **Time**: Total time is about **39 minutes** for all 78 topics (30 seconds per topic)

2. **Cost**: Each quiz costs more due to 90 questions vs 15. Estimate **$10-15** for all 78 topics

3. **Questions**: Total of **7,020 questions** will be generated (90 × 78)

4. **API Key**: Never share your API key or commit it to Git

5. **Format**: All quizzes follow the exact format in `example.json` with difficulty levels

6. **Rate Limit**: Very conservative - 2 requests per minute to ensure no rate limit issues

## Need Help?

Check these files:
- `README.md` - Full documentation
- `quiz_generation.log` - Detailed logs
- `failed_topics.json` - Failed topics list
- `example.json` - Expected output structure

## Current Configuration

- **Model**: GPT-5-mini (gpt-5-mini-2025-08-07)
- **Total Topics**: 78
- **Questions per Quiz**: 90 (30 low, 30 medium, 30 hard)
- **Rate Limit**: 1 request every 30 seconds (2 per minute)
- **Estimated Duration**: 39 minutes
- **Total Questions**: 7,020

Everything is ready to go! Just add your API key and run.
