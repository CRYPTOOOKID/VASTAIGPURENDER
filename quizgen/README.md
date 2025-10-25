# Quiz Generator

Automated quiz generation system using OpenAI GPT-5-mini API. This tool generates high-quality, engaging quizzes for multiple topics with rate limiting and concurrent processing.

## Features

- Automated batch processing of multiple topics
- Rate limiting compliance (Tier 1: 500 RPM, 500k TPM)
- Concurrent API requests (20 requests per batch)
- Automatic retry mechanism for failed requests
- Progress tracking and detailed logging
- JSON output for each topic
- Error handling and failed topics tracking

## Project Structure

```
quizgen/
├── quiz_generator.py      # Main Python script
├── prompt.json            # Master prompt template
├── topics.json            # List of all quiz topics
├── requirements.txt       # Python dependencies
├── .env                   # API key configuration (not committed)
├── .env.example          # Example environment file
├── README.md             # This file
└── QuizzesOp/            # Output directory for generated quizzes
    └── [topic_name].json # Generated quiz files
```

## Setup Instructions

### 1. Configure API Key

1. Get your OpenAI API key from: https://platform.openai.com/api-keys
2. Open the `.env` file in the quizgen directory
3. Add your API key:

```env
OPENAI_API_KEY=sk-your-api-key-here
```

**Important:** Never commit the `.env` file with your actual API key!

### 2. Install Dependencies (Automatic)

The dependencies will be installed automatically when you run the script. However, if you want to install them manually:

```bash
cd quizgen
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Verify Configuration Files

Ensure these files exist and are properly configured:

- `prompt.json` - Contains the master prompt with [TOPIC] placeholder
- `topics.json` - Contains array of topics in "quizTopics" field
- `QuizzesOp/` - Output directory (created automatically if missing)

## Usage

### Quick Start (Recommended)

Simply run the provided shell script:

```bash
cd quizgen
./run.sh
```

The script will:
- Check if virtual environment exists (creates if needed)
- Check if dependencies are installed (installs if needed)
- Verify API key is configured
- Run the quiz generator

### Manual Run

If you prefer to run manually:

```bash
cd quizgen
source venv/bin/activate
python quiz_generator.py
```

### What Happens During Execution

1. **Initialization**: Loads master prompt and topics list
2. **Batch Processing**: Processes topics in batches of 20
3. **API Requests**: Sends concurrent requests to OpenAI API
4. **Rate Limiting**: Waits 60 seconds between batches to comply with limits
5. **Saving Results**: Each successful quiz is saved as `[topic_name].json`
6. **Logging**: All activities are logged to console and `quiz_generation.log`
7. **Error Tracking**: Failed topics are saved to `failed_topics.json`

### Expected Output

```
================================================================================
Quiz Generator - OpenAI GPT-5-mini
================================================================================
[2025-10-14 14:35:22] Starting quiz generation for 80 topics
[2025-10-14 14:35:22] Batch size: 20, Delay between batches: 60s
================================================================================

--- Processing Batch 1/4 (20 topics) ---
[2025-10-14 14:35:25] ✓ Saved quiz for 'Cricket Trivia' to Cricket_Trivia.json
[2025-10-14 14:35:26] ✓ Saved quiz for 'Bollywood Movies' to Bollywood_Movies.json
...

Waiting 60s before next batch...

--- Processing Batch 2/4 (20 topics) ---
...

================================================================================
Quiz Generation Complete!
Successfully generated: 78/80
Failed: 2/80
================================================================================
```

## Output Format

Each generated quiz file follows this structure:

```json
{
  "quiz": [
    {
      "question": "Question text here?",
      "options": [
        "Option 1",
        "Option 2",
        "Option 3"
      ],
      "answer": "Correct option"
    }
    // ... 14 more questions (15 total)
  ]
}
```

## Configuration Options

Edit these constants in `quiz_generator.py` if needed:

```python
MODEL_NAME = 'gpt-5-mini-2025-08-07'  # OpenAI model to use
BATCH_SIZE = 20                        # Concurrent requests per batch
DELAY_BETWEEN_BATCHES = 60            # Seconds to wait between batches
REQUESTS_PER_MINUTE = 500             # API rate limit
TOKENS_PER_MINUTE = 500000            # Token rate limit
```

## Rate Limiting (Tier 1)

The script is configured for OpenAI Tier 1 limits:
- **500 requests per minute (RPM)**
- **500,000 tokens per minute (TPM)**

The batch system sends 20 requests, then waits 60 seconds before the next batch, ensuring compliance with rate limits.

## Troubleshooting

### Issue: "OPENAI_API_KEY not found"
**Solution:** Make sure you've added your API key to the `.env` file

### Issue: Rate limit errors (429)
**Solution:** The script automatically handles this by waiting and retrying. If it persists, increase `DELAY_BETWEEN_BATCHES`

### Issue: Timeout errors
**Solution:** Check your internet connection. The script retries up to 3 times per request

### Issue: Invalid JSON response
**Solution:** The script validates responses. Invalid quizzes are logged as failed and can be regenerated

### Issue: Module not found
**Solution:** Run `pip install -r requirements.txt` to install all dependencies

## Logs and Debugging

- **Console Output**: Real-time progress and status messages
- **quiz_generation.log**: Persistent log file with timestamps
- **failed_topics.json**: List of topics that failed with error messages

## Retry Failed Topics

If some topics fail, you can:

1. Check `failed_topics.json` for the list
2. Copy failed topics to a new `topics.json` or edit the existing one
3. Run the script again

## Performance Estimates

- **20 topics per minute** (with rate limiting)
- **80 topics = ~4 minutes** total time
- Each quiz contains **15 questions**
- Average API response time: **10-30 seconds** per topic

## Cost Estimation

Based on OpenAI GPT-5-mini pricing:
- Input: ~1000 tokens per request
- Output: ~2000 tokens per response
- Cost per 1M tokens varies by model

Check OpenAI pricing: https://openai.com/pricing

## Security Notes

- Never commit `.env` file with real API keys
- Use `.env.example` as a template for others
- Keep API keys secure and rotate them regularly
- Monitor API usage on OpenAI dashboard

## Support

For issues or questions:
1. Check the logs in `quiz_generation.log`
2. Review failed topics in `failed_topics.json`
3. Verify API key is valid and has sufficient credits
4. Check OpenAI API status: https://status.openai.com/

## License

This project is part of Quiz Channel 2.0
