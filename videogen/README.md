# Game-Style Quiz Video Template

An excellent, game-like quiz video template built with Remotion featuring stunning animations, creative timer effects, and professional transitions.

## Features

### 🎮 Modern Design
- **Animated Gradient Background**: Dynamic gradient mesh with flowing color blobs (purple, pink, blue spectrum)
- **Floating Geometric Shapes**: Rotating circles, squares, and rounded shapes for depth
- **3D Effects**: Perspective transforms and tilt animations
- **Glass Morphism**: Modern frosted glass effect with backdrop blur on all UI elements

### ⏱️ Creative Bomb Timer (Top-Right Position)
- **Cracker/Bomb Style**: 10-second countdown with bomb visual positioned in top-right corner
- **Dynamic Colors**: Transitions from green → yellow → orange → red as time runs out
- **Pulsing Animation**: Intensifies as timer approaches zero
- **Shake Effect**: Timer shake increases with urgency
- **Sparks & Glow**: Visual effects that activate at critical moments
- **Fuse Animation**: Burning fuse effect on top of bomb

### 📊 Progress Tracking
- **Star Progress Indicators**: Animated stars that fill as you progress through questions
- **Golden Stars**: Completed questions shown with golden stars and checkmarks
- **Current Question**: Pulsing pink/purple star with glow effect
- **Question Counter Badge**: Circular counter showing current/total questions with gradient background

### 🎬 Video Structure
1. **Intro** (4 seconds): Your intro.mp4 plays
2. **Questions Loop** (17 seconds each):
   - Question display only (5 seconds)
   - Question shrinks & options appear (0.5 seconds)
   - Timer countdown with options visible (10 seconds)
   - Answer reveal with highlight (2 seconds)
   - Logo transition (1 second) - between questions
3. **Outro** (5 seconds): Your outro.mp4 plays

### ✨ Animations
- **Question Entrance**: Bouncy spring animation with scale effect (Large 72px text)
- **Question Shrink**: Smooth scale down to 48px when options appear
- **Options Layout**: Horizontal grid layout (2 columns) with slide-up animation
- **Answer Highlight**: Vibrant green gradient (#10b981) with intense pulsing glow effect
- **Logo Burst**: Particle explosion with rotating logo
- **Font**: "DM Sans" (weights 400-800) for readability + "Press Start 2P" for retro elements

## Project Structure

```
Quiz Channel 2.0/
├── src/
│   ├── components/
│   │   ├── BombTimer.tsx       # Creative bomb/cracker timer
│   │   ├── ProgressBar.tsx     # Top progress bar with indicators
│   │   ├── QuestionScene.tsx   # Main quiz scene with all animations
│   │   └── LogoTransition.tsx  # Logo burst transition effect
│   ├── Root.tsx                # Remotion root component
│   ├── Video.tsx               # Main video composition
│   └── index.ts                # Entry point
├── public/                     # Assets folder
│   ├── intro.mp4
│   ├── outro.mp4
│   └── logo final.png
├── quiz jsons/
│   └── example.json            # Quiz questions data
└── package.json

```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
Already installed! Just run:

```bash
npm start
```

This will open the Remotion Studio in your browser at http://localhost:3000

## Customization

### Change Questions
Edit `quiz jsons/example.json`:

```json
{
  "quiz": [
    {
      "question": "Your question here?",
      "options": ["Option 1", "Option 2", "Option 3"],
      "answer": "Option 2"
    }
  ]
}
```

### Adjust Timing
Edit `src/Video.tsx`:

```typescript
const introDuration = 10 * fps; // Change intro duration
const questionDisplayDuration = 5 * fps; // Time for question only
const optionsAndTimerDuration = 10 * fps; // Timer duration
const answerRevealDuration = 2 * fps; // Time to show answer
```

### Customize Colors
Edit component files to change:
- Background gradients
- Timer color scheme
- Progress bar colors
- Glow effects

## Commands

```bash
# Start development studio
npm start

# Render video
npm run build

# Upgrade Remotion
npm run upgrade
```

## Render Settings

The video is configured as:
- **Resolution**: 1920x1080 (Landscape/YouTube standard format)
- **FPS**: 30
- **Format**: MP4

To change resolution, edit `src/Root.tsx`:

```typescript
<Composition
  width={1920}  // Change width
  height={1080} // Change height
  fps={30}
/>
```

## Technologies Used

- **Remotion**: Video creation with React
- **TypeScript**: Type-safe code
- **Spring Physics**: Natural animations via Remotion's spring()
- **Google Fonts**: DM Sans and Press Start 2P
- **CSS Animations**: Custom keyframes and transforms

## Animation Techniques

1. **Spring Physics**: Used for entrance animations and progress bar
2. **Interpolation**: Smooth transitions for colors, positions, and scales
3. **Stagger Effects**: Sequential animations for options
4. **Keyframe Animations**: CSS-based blinking and pulsing
5. **3D Transforms**: Perspective and rotation effects
6. **Particle Systems**: Logo burst with calculated trajectories

## Tips for Best Results

1. **High-Quality Assets**: Use HD intro/outro videos and logo
2. **Short Questions**: Keep questions concise for better readability
3. **Preview First**: Always preview in Remotion Studio before rendering
4. **Test Timing**: Make sure timer duration matches your preference
5. **Optimize Videos**: Compress intro/outro files if render is slow

## Browser Access

The Remotion Studio is now running at:
- **Local**: http://localhost:3000
- **Network**: Check terminal for network URL

Open this URL in your browser to see your quiz video in action!

## Support

Built with Remotion v4.0.358
For Remotion docs: https://remotion.dev/docs

---

Made with ❤️ using Remotion
