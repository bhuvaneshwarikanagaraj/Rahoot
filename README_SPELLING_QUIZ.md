# Spelling Quiz with Online Audio - Complete Guide

## 🎯 Overview

The Rahoot spelling quiz now supports **online text-to-speech** audio, eliminating the need for local audio files. The system automatically uses web-based speech synthesis to pronounce words clearly.

## 🔊 **Audio System**

### **Smart Audio Handling**
1. **Local Files First** - Checks for `/sounds/word.mp3` files
2. **Online TTS Fallback** - Uses browser speech synthesis
3. **Google TTS Backup** - Falls back to Google Translate TTS
4. **No Files Needed** - Just specify the word in the quiz JSON

### **How It Works**
```json
{
  "question": "A large African mammal with a trunk",
  "audio": "elephant",        // Just the word - no file needed!
  "solution": "elephant"
}
```

The system will:
1. See `"audio": "elephant"` 
2. Use browser text-to-speech to say "elephant"
3. If that fails, try Google Translate TTS
4. Clear, natural pronunciation automatically

## 📝 **Updated Quiz Format**

### **Simple Word-Based Audio**
```json
{
  "subject": "Spelling Quiz",
  "type": "spelling",
  "questions": [
    {
      "question": "A large African mammal with a trunk",
      "audio": "elephant",
      "solution": "elephant",
      "cooldown": 3,
      "time": 30
    },
    {
      "question": "A yellow curved fruit",
      "audio": "banana", 
      "solution": "banana",
      "cooldown": 3,
      "time": 25
    },
    {
      "question": "The study of numbers and calculations",
      "audio": "mathematics",
      "solution": "mathematics", 
      "cooldown": 3,
      "time": 40
    }
  ]
}
```

### **Mixed Audio Sources (Advanced)**
```json
{
  "questions": [
    {
      "question": "Local audio file example",
      "audio": "/sounds/custom-word.mp3",  // Local file
      "solution": "custom"
    },
    {
      "question": "Online TTS example", 
      "audio": "pronunciation",           // Online TTS
      "solution": "pronunciation"
    }
  ]
}
```

## 🎮 **Player Experience**

### **Enhanced Audio Features**
- **🔊 Play Word Button** - Click to hear pronunciation
- **🔄 Replay Anytime** - Click multiple times to repeat
- **🎯 Clear Speech** - Optimized rate and pitch for learning
- **🌐 Always Available** - No audio files needed
- **📱 Cross-Platform** - Works on all devices with browsers

### **Audio Quality**
- **Slower Rate** - 0.8x speed for clarity
- **Optimal Pitch** - Natural voice tone
- **English Voices** - Prefers Google/system English voices
- **Consistent Volume** - 80% volume for comfortable listening

## 🔧 **Technical Implementation**

### **Audio Priority System**
1. **Local Files** - `/sounds/word.mp3` (if exists)
2. **Web Speech API** - Browser built-in TTS
3. **Google TTS** - Online fallback service
4. **Error Handling** - Graceful degradation

### **Browser Compatibility**
- ✅ **Chrome/Edge** - Excellent (Google voices)
- ✅ **Safari** - Good (System voices)  
- ✅ **Firefox** - Good (System voices)
- ✅ **Mobile** - Works on iOS/Android

### **Code Implementation**
```typescript
// Smart audio detection
const playWordAudio = () => {
  if (audio && audio.startsWith('/sounds/')) {
    playAudio() // Local file
  } else {
    playTextToSpeech(audio) // Online TTS
  }
}

// Web Speech API with fallbacks
const playTextToSpeech = (text: string) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.8 // Slower for clarity
    utterance.pitch = 1.0
    utterance.volume = 0.8
    
    // Prefer English voices
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en')
    )
    
    if (englishVoice) utterance.voice = englishVoice
    window.speechSynthesis.speak(utterance)
  } else {
    playOnlineTTS(text) // Google TTS fallback
  }
}
```

## 📚 **Available Quiz Examples**

### **Basic Spelling Quiz**
- File: `config/quizz/spelling.json`
- 3 simple words: elephant, banana, easy
- Perfect for testing the system

### **Advanced Spelling Quiz** 
- File: `config/quizz/advanced-spelling.json`
- 8 varied words: elephant, banana, easy, ocean, butterfly, mathematics, teacher, notebook
- Different difficulty levels and word lengths

## 🚀 **Getting Started**

### **Create Your First Online Audio Quiz**
1. **Create quiz file** in `config/quizz/my-spelling.json`
2. **Add questions** with word-based audio:
   ```json
   {
     "subject": "My Spelling Quiz",
     "type": "spelling", 
     "questions": [
       {
         "question": "Man's best friend",
         "audio": "dog",
         "solution": "dog",
         "cooldown": 3,
         "time": 20
       }
     ]
   }
   ```
3. **Test immediately** - No audio files needed!

### **Test the System**
1. Go to http://localhost:3000/manager
2. Enter password: `PASSWORD`
3. Select "Spelling Quiz" or "Advanced Spelling Quiz"
4. Share PIN with players
5. Click "🔊 Play Word" to hear online pronunciation

## 🌟 **Benefits**

### **For Educators**
- ✅ **No Audio Files** - Just type the word
- ✅ **Instant Setup** - Create quizzes in minutes  
- ✅ **Any Word** - System can pronounce anything
- ✅ **Consistent Quality** - Same voice across all words
- ✅ **Easy Updates** - Change words without new recordings

### **For Students**
- ✅ **Clear Pronunciation** - Optimized for learning
- ✅ **Replay Anytime** - Hear words multiple times
- ✅ **Always Available** - No broken audio links
- ✅ **Natural Voices** - High-quality speech synthesis

## 🎯 **Best Practices**

### **Word Selection**
- Use common English words for best pronunciation
- Avoid complex technical terms (unless needed)
- Test pronunciation before using in quiz
- Consider word length for time limits

### **Quiz Design**
- Start with shorter words (3-6 letters)
- Progress to longer words (7+ letters)
- Mix familiar and challenging words
- Allow adequate time for longer words

---

## 🎉 **Ready to Use!**

The online audio system is **live and ready** at http://localhost:3000! 

**No audio files needed - just create your quiz and the system handles pronunciation automatically!** 🚀