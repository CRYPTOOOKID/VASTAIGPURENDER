# Pre-Run Checklist

Before running the quiz generator, verify these items:

## Required Files ✓

- [x] `quiz_generator.py` - Main Python script
- [x] `prompt.json` - Master prompt template with [TOPIC] placeholder
- [x] `topics.json` - 80 quiz topics
- [x] `requirements.txt` - Python dependencies
- [x] `.env` - Environment file for API key
- [x] `run.sh` - Easy run script
- [x] `QuizzesOp/` - Output directory

## Setup Status ✓

- [x] Virtual environment created (`venv/`)
- [x] Dependencies installed (aiohttp, python-dotenv, tqdm)
- [x] Python 3.13.7 detected and compatible
- [x] Run script is executable

## What You Need to Do ⚠️

### REQUIRED: Add Your API Key

1. Open file: `quizgen/.env`
2. Replace:
   ```
   OPENAI_API_KEY=
   ```
   With:
   ```
   OPENAI_API_KEY=your-openai-api-key-here
   ```
3. Save the file

## Ready to Run?

Once you've added your API key, run:

```bash
cd "/Users/srinadhchitrakavi/Desktop/Projects /Quiz Channel 2.0/quizgen"
./run.sh
```

## What to Expect

- **Duration**: ~4-5 minutes for all 80 topics
- **Output**: 80 JSON files in `QuizzesOp/` folder
- **Each file**: Contains 15 quiz questions
- **Format**: Matches the structure in your example.json

## System Information

- Python Version: 3.13.7
- Operating System: macOS 15.0
- Model: gpt-5-mini-2025-08-07
- Rate Limit: Tier 1 (500 RPM, 500k TPM)
- Batch Processing: 20 concurrent requests
- Delay Between Batches: 60 seconds

## Files Generated After Run

After successful execution, you'll have:
- 80 quiz JSON files in `QuizzesOp/`
- `quiz_generation.log` - Detailed log
- `failed_topics.json` - If any topics failed (hopefully none!)

## Cost Estimate

- Approximately $2-5 USD for 80 topics
- Check OpenAI usage dashboard for exact costs

---

**Everything is ready! Just add your API key and run the script.**
