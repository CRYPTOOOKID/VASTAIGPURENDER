#!/usr/bin/env python3
"""
Audio Generator for Quiz Questions
Generates audio files from JSON quiz questions using Kokoro TTS service.
"""

import os
import sys
import json
import random
from pathlib import Path

# Add kokoro_tts directory to path
kokoro_path = Path(__file__).parent.parent / "kokoro_tts"
sys.path.insert(0, str(kokoro_path))

from kokoro_tts_service import KokoroTTSService

# Configuration
JSONS_DIR = Path(__file__).parent / "jsons "
OUTPUT_DIR = Path(__file__).parent / "output audios"
SPEED = 1.0

# Best quality voices from Kokoro TTS
BEST_VOICES = [
    "af_heart",     # American Female - A rating (Best overall)
    "af_bella",     # American Female - A- rating
    "af_nicole",    # American Female - B- rating
    "bf_emma",      # British Female - B- rating
    "bf_isabella",  # British Female - B- rating
    "am_michael",   # American Male - C+ rating (Best male)
    "am_puck",      # American Male - C+ rating
    "am_fenrir",    # American Male - C+ rating
    "bm_george",    # British Male - C rating
]


def get_all_json_files():
    """Get all JSON files from the jsons directory."""
    json_files = sorted(list(JSONS_DIR.glob("*.json")))
    return json_files


def load_json_file(json_path):
    """Load and parse a JSON file."""
    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        print(f"❌ Error loading {json_path.name}: {e}")
        return None


def select_voice_for_json():
    """Randomly select a voice from the best voices list."""
    return random.choice(BEST_VOICES)


def generate_audio_for_question(tts_service, question_text, voice, output_path):
    """
    Generate audio for a single question.
    
    Args:
        tts_service: Kokoro TTS service instance
        question_text: The question text to synthesize
        voice: Kokoro voice identifier
        output_path: Path to save the audio file
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        success = tts_service.synthesize_speech_to_file(
            text=question_text,
            voice_name=voice,
            speaking_rate=SPEED,
            output_file=str(output_path)
        )
        return success
    except Exception as e:
        print(f"❌ Error generating audio: {e}")
        return False


def process_single_json(json_path, tts_service):
    """
    Process a single JSON file and generate audio for all questions.
    
    Args:
        json_path: Path to the JSON file
        tts_service: Kokoro TTS service instance
    
    Returns:
        bool: True if successful, False otherwise
    """
    # Load JSON data
    data = load_json_file(json_path)
    if not data or 'quiz' not in data:
        print(f"❌ Invalid JSON structure in {json_path.name}")
        return False
    
    # Create output folder (same name as JSON file without extension)
    json_name = json_path.stem  # filename without extension
    output_folder = OUTPUT_DIR / json_name
    output_folder.mkdir(parents=True, exist_ok=True)
    
    # Select a voice for this entire JSON
    voice = select_voice_for_json()
    
    print(f"\n{'='*80}")
    print(f"📁 Processing: {json_path.name}")
    print(f"🎤 Voice: {voice}")
    print(f"📊 Questions: {len(data['quiz'])}")
    print(f"💾 Output folder: {output_folder.name}")
    print(f"{'='*80}")
    
    # Process each question
    successful = 0
    failed = 0
    
    for item in data['quiz']:
        question_id = item.get('question_id', 0)
        question_text = item.get('question', '')
        
        if not question_text:
            print(f"⚠️  Skipping empty question {question_id}")
            failed += 1
            continue
        
        # Create output filename: question_1.mp3, question_2.mp3, etc.
        output_filename = f"question_{question_id}.mp3"
        output_path = output_folder / output_filename
        
        print(f"🔄 Generating audio for question {question_id}... ", end='', flush=True)
        
        success = generate_audio_for_question(tts_service, question_text, voice, output_path)
        
        if success:
            print(f"✅ Done")
            successful += 1
        else:
            print(f"❌ Failed")
            failed += 1
    
    print(f"\n📈 Results: {successful} successful, {failed} failed")
    print(f"✅ Completed: {json_path.name}\n")
    
    return True


def process_all_jsons(tts_service):
    """
    Process all JSON files in batch mode.
    
    Args:
        tts_service: Kokoro TTS service instance
    """
    json_files = get_all_json_files()
    
    if not json_files:
        print("❌ No JSON files found in the jsons directory!")
        return
    
    print(f"\n{'='*80}")
    print(f"🚀 BATCH PROCESSING MODE")
    print(f"{'='*80}")
    print(f"📊 Total JSON files: {len(json_files)}")
    print(f"🎤 Available voices: {', '.join(BEST_VOICES)}")
    print(f"⚡ Speed: {SPEED}")
    print(f"{'='*80}\n")
    
    # Process each JSON file
    total_processed = 0
    total_failed = 0
    
    for i, json_path in enumerate(json_files, 1):
        print(f"\n[{i}/{len(json_files)}] Processing: {json_path.name}")
        
        success = process_single_json(json_path, tts_service)
        
        if success:
            total_processed += 1
        else:
            total_failed += 1
    
    print(f"\n{'='*80}")
    print(f"🎉 BATCH PROCESSING COMPLETE!")
    print(f"{'='*80}")
    print(f"✅ Successfully processed: {total_processed}/{len(json_files)}")
    print(f"❌ Failed: {total_failed}/{len(json_files)}")
    print(f"{'='*80}\n")


def process_random_json(tts_service):
    """
    Process a randomly selected JSON file.
    
    Args:
        tts_service: Kokoro TTS service instance
    """
    json_files = get_all_json_files()
    
    if not json_files:
        print("❌ No JSON files found in the jsons directory!")
        return
    
    # Select a random JSON file
    selected_json = random.choice(json_files)
    
    print(f"\n{'='*80}")
    print(f"🎲 RANDOM SELECTION MODE")
    print(f"{'='*80}")
    print(f"📊 Total available JSON files: {len(json_files)}")
    print(f"🎯 Randomly selected: {selected_json.name}")
    print(f"{'='*80}")
    
    # Process the selected JSON
    process_single_json(selected_json, tts_service)


def main():
    """Main function to run the audio generator."""
    print("\n" + "="*80)
    print(" 🎙️  QUIZ AUDIO GENERATOR ")
    print("="*80)
    print("This program generates audio files from JSON quiz questions")
    print("using the Kokoro TTS service with high-quality voices.")
    print("="*80 + "\n")
    
    # Check if directories exist
    if not JSONS_DIR.exists():
        print(f"❌ Error: JSONs directory not found at {JSONS_DIR}")
        return
    
    # Create output directory if it doesn't exist
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Display options
    print("Select an option:")
    print("  1. Process a randomly selected JSON file")
    print("  2. Process all JSON files (batch mode)")
    print()
    
    # Get user input
    try:
        choice = input("Enter your choice (1 or 2): ").strip()
    except KeyboardInterrupt:
        print("\n\n👋 Exiting...")
        return
    
    if choice not in ['1', '2']:
        print("❌ Invalid choice! Please enter 1 or 2.")
        return
    
    # Initialize Kokoro TTS service
    print("\n🔧 Initializing Kokoro TTS service...")
    try:
        tts_service = KokoroTTSService()
        print("✅ Kokoro TTS service initialized successfully!\n")
    except Exception as e:
        print(f"❌ Failed to initialize Kokoro TTS service: {e}")
        return
    
    # Process based on choice
    if choice == '1':
        process_random_json(tts_service)
    else:
        process_all_jsons(tts_service)
    
    print("\n✨ All done! Have a great day! ✨\n")


if __name__ == "__main__":
    main()

