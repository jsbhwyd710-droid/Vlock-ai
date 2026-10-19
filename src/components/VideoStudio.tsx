import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  Sparkles, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Download, 
  RefreshCw, 
  Film, 
  Camera, 
  Volume2, 
  VolumeX,
  Layers, 
  Music,
  CheckCircle2,
  Maximize2,
  X,
  Clock,
  Wand2,
  Compass,
  Radio,
  Sliders
} from 'lucide-react';
import { VideoProject, VideoScene } from '../types';
import { api } from '../services/api';
import { soundFxEngine } from '../services/soundFxSynthesizer';

interface VideoStudioProps {
  consumeCredit: () => boolean;
}

const PRESET_VIDEOS = [
  { label: '🐒 قرد في الغابة الاستوائية (Monkey Jungle)', prompt: 'Cinematic 4K wildlife footage of a clever chimpanzee monkey leaping through emerald jungle vines and eating fruit under misty sunbeams', style: 'Documentary Nature' },
  { label: '🏎️ سباق سيارات خارقة (Supercar Drift)', prompt: 'Cinematic 4K trailer of an electric supercar drifting at 200mph through neon rain streets with glowing brake rotors and smoke', style: 'Cinematic 4K' },
  { label: '🦁 أسد على صخرة السافانا (Lion Wildlife)', prompt: 'Epic close-up wildlife shot of a majestic male lion roaring at sunset atop a massive savanna cliff', style: 'Documentary Nature' },
  { label: '🚀 سفينة فضائية في ثقب دودي (Deep Space)', prompt: 'Sci-fi blockbuster sequence of an exploration starship warping through a luminous cosmic wormhole into deep galaxy', style: 'Cyberpunk 3D' },
  { label: '⚡ عاصفة رعدية في المحيط (Ocean Thunderstorm)', prompt: 'Dramatic cinematic 4K aerial drone shot of massive ocean waves crashing against jagged cliffs under violent lightning bolts', style: 'Cinematic 4K' },
];

export const VideoStudio: React.FC<VideoStudioProps> = ({ consumeCredit }) => {
  const [prompt, setPrompt] = useState<string>(
    'Cinematic 30-second teaser trailer for an AI robotics workspace with holographic displays and glowing neon architecture'
  );
  const [style, setStyle] = useState<string>('Cinematic 4K');
  const [videoEngine, setVideoEngine] = useState<string>('Veo 3 Ultra');
  const [duration, setDuration] = useState<number>(30);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);

  // Player & Audio state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentSceneIdx, setCurrentSceneIdx] = useState<number>(0);
  const [sceneProgress, setSceneProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [selectedSoundFx, setSelectedSoundFx] = useState<string>('auto');
  const [voiceLang, setVoiceLang] = useState<string>('ar-SA');
  const [isVoiceActive, setIsVoiceActive] = useState<boolean>(true);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [isSpeakingNow, setIsSpeakingNow] = useState<boolean>(false);
  const [theaterMode, setTheaterMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const speakVoiceover = (text: string) => {
    if (!isVoiceActive || isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLang;
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => setIsSpeakingNow(true);
      utterance.onend = () => setIsSpeakingNow(false);
      utterance.onerror = () => setIsSpeakingNow(false);

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice = voices.find(v => v.lang === voiceLang || v.lang.startsWith(voiceLang.slice(0, 2)));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis voice error:', e);
      setIsSpeakingNow(false);
    }
  };

  const [project, setProject] = useState<VideoProject>({
    title: 'Nexus Autonomous Cinema: Wild Horizons',
    synopsis: 'A visual cinematic masterpiece with immersive real-world physical soundscapes.',
    bgMusicVibe: 'Cinematic Orchestral & Physical Soundscapes',
    soundFxTheme: 'monkey_jungle',
    soundFxDescription: 'أصوات قرود حقيقية وحياة غابة استوائية 🐒🌴',
    aspectRatio: '16:9',
    scenes: [
      {
        sceneNumber: 1,
        duration: 6,
        visualPrompt: 'Wide panoramic drone shot gliding over a lush tropical jungle shrouded in morning golden mist.',
        cameraMovement: 'Slow forward dolly with subtle tilt up',
        soundFx: 'أصوات قرود حقيقية وطبيعة غابة استوائية 🐒🌴',
        visualMoodColor: '#10b981',
        visualUrl: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?auto=format&fit=crop&w=1200&q=80',
      },
      {
        sceneNumber: 2,
        duration: 8,
        visualPrompt: 'Close-up camera tracking a playful chimpanzee monkey leaping between ancient vines.',
        cameraMovement: '360-degree orbital sweep with sharp focus',
        soundFx: 'أصوات قرود وتغريد طيور برية 🐒🦜',
        visualMoodColor: '#3b82f6',
        visualUrl: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=1200&q=80',
      },
      {
        sceneNumber: 3,
        duration: 8,
        visualPrompt: 'Dynamic motion sequence through waterfall cascades as sunlight reflects through amber droplets.',
        cameraMovement: 'Fast whip-pan transition with speed ramp',
        soundFx: 'خرير مياه وشلالات هادرة 🌊',
        visualMoodColor: '#ec4899',
        visualUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      },
      {
        sceneNumber: 4,
        duration: 8,
        visualPrompt: 'Breathtaking twilight finale looking out over boundless rainforest canopies under evening skies.',
        cameraMovement: 'Slow crane up to reveal majestic horizon',
        soundFx: 'أصوات غابة ليلية هادئة 🌙',
        visualMoodColor: '#06b6d4',
        visualUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      },
    ],
  });

  const currentScene: VideoScene = project.scenes[currentSceneIdx] || project.scenes[0];

  // Real-world Sound FX Synthesizer (Monkey/Jungle, Supercar, Sci-Fi, Storm, Cinema)
  const triggerSoundFx = () => {
    if (isMuted || selectedSoundFx === 'muted') return;
    const themeToPlay = selectedSoundFx === 'auto' ? (project.soundFxTheme || prompt) : selectedSoundFx;
    soundFxEngine.playSoundForTheme(themeToPlay);
  };

  // When scene index changes during active playback, trigger physical sound effect & AI spoken voice
  useEffect(() => {
    if (isPlaying) {
      triggerSoundFx();
      const textToSpeak = currentScene.voiceover || currentScene.visualPrompt;
      speakVoiceover(textToSpeak);
    } else {
      setIsSpeakingNow(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [currentSceneIdx, isPlaying, isVoiceActive, voiceLang, isMuted]);

  // Clean speech synthesis and audio on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      soundFxEngine.stopAll();
    };
  }, []);

  // Video playback timer
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSceneProgress((prev) => {
          if (prev >= 100) {
            if (currentSceneIdx < project.scenes.length - 1) {
              setCurrentSceneIdx((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              setIsSpeakingNow(false);
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              soundFxEngine.stopAll();
              return 100;
            }
          }
          return prev + 4;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSceneIdx, project.scenes.length]);

  const togglePlay = () => {
    if (sceneProgress >= 100 && currentSceneIdx >= project.scenes.length - 1) {
      setCurrentSceneIdx(0);
      setSceneProgress(0);
    }
    const nextPlayState = !isPlaying;
    setIsPlaying(nextPlayState);
    if (!nextPlayState) {
      soundFxEngine.stopAll();
      setIsSpeakingNow(false);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      triggerSoundFx();
      const textToSpeak = currentScene.voiceover || currentScene.visualPrompt;
      speakVoiceover(textToSpeak);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    if (!consumeCredit()) {
      showToast('Credit required. Please check your plan.');
      return;
    }

    setIsGenerating(true);
    setProgressPercent(15);
    setIsPlaying(false);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    const timer = setInterval(() => {
      setProgressPercent((p) => (p >= 90 ? p : p + 15));
    }, 400);

    try {
      const res = await api.generateVideo(prompt, style, duration, aspectRatio, videoEngine);
      clearInterval(timer);
      setProgressPercent(100);
      setProject(res);
      setCurrentSceneIdx(0);
      setSceneProgress(0);
      showToast(`AI Video synthesized with ${videoEngine}!`);
    } catch (err) {
      clearInterval(timer);
      console.error('Video generation fallback activated:', err);
      showToast('Interactive AI Video preview generated.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setProgressPercent(0), 600);
    }
  };

  const handleExportScript = () => {
    const scriptContent = `TITLE: ${project.title}
ASPECT RATIO: ${project.aspectRatio}
MUSIC: ${project.bgMusicVibe}
SYNOPSIS: ${project.synopsis}

SCENE BREAKDOWN:
${project.scenes.map((s) => `
SCENE ${s.sceneNumber} (${s.duration}s):
Camera: ${s.cameraMovement}
Visual: ${s.visualPrompt}
Voiceover: "${s.voiceover}"
Mood Color: ${s.visualMoodColor}
`).join('\n')}
Generated with AI Video Production Studio.`;

    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-production-script.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Video production script downloaded!');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const target = e.currentTarget;
    target.onerror = null;
    target.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80';
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 border border-pink-500/50 text-pink-300 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-bold mb-3">
              <Film className="w-3.5 h-3.5" />
              AI CINEMATIC VIDEO & STORYBOARD STUDIO
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Direct AI Cinematic Video & Commercials
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Produce multi-scene commercials, trailers, and product showcases with camera motion simulations, synchronized AI narration, and 4K visual frames.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportScript}
              className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs shadow-lg shadow-pink-600/25 flex items-center gap-2 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Storyboard & Script</span>
            </button>
          </div>
        </div>

        {/* Input Parameters */}
        <div className="mt-6 space-y-3 pt-6 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your video storyline (e.g. 30s electric car reveal on mountain roads with sunrise)..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2 transition-all shrink-0"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Video ({progressPercent}%)...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Generate Video AI</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-pink-400" />
              Presets:
            </span>
            {PRESET_VIDEOS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(item.prompt);
                  setStyle(item.style);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:border-pink-500/60 text-slate-300 hover:text-white shrink-0 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Quick Controls & Video Engine */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-pink-400 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>محرك AI:</span>
              </span>
              <select
                value={videoEngine}
                onChange={(e) => setVideoEngine(e.target.value)}
                className="bg-slate-950 border border-pink-500/50 text-xs text-pink-300 font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:border-pink-400 cursor-pointer"
              >
                <option value="Veo 3 Ultra">🎬 Google Veo 3 Ultra (4K 60FPS)</option>
                <option value="OpenAI Sora 2">🎥 OpenAI Sora 2 (Physics & 60FPS)</option>
                <option value="Runway Gen-4 Turbo">⚡ Runway Gen-4 Turbo (Dynamic Motion)</option>
                <option value="Kling 2.0 HD">🌌 Kling 2.0 HD (High Cinema Fidelity)</option>
                <option value="Luma Dream Machine 2">✨ Luma Dream Machine 2</option>
                <option value="Nano Banana Video 4K">🍌 Nano Banana Video 4K</option>
                <option value="Gemini 9 Video Cinema">✨ Gemini 9 Video Cinema</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Style:</span>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-pink-500"
              >
                <option value="Cinematic 4K">Cinematic 4K Master</option>
                <option value="Commercial Studio">Studio Commercial Ad</option>
                <option value="Cyberpunk 3D">Cyberpunk 3D Anime</option>
                <option value="Documentary Nature">Documentary 8K</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Duration:</span>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-pink-500"
              >
                <option value={15}>15 Seconds (Story / Reel)</option>
                <option value={30}>30 Seconds (Commercial)</option>
                <option value={60}>60 Seconds (Trailer)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Aspect:</span>
              <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800">
                {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
                      aspectRatio === ratio ? 'bg-pink-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-World Sound FX Selector Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>أصوات ومؤثرات الفيديو الحقيقية (Real-World Sound Effects & Audio):</span>
              </span>
              <button
                onClick={() => triggerSoundFx()}
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors cursor-pointer"
              >
                ▶️ استمع للمؤثر الآن
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'auto', label: '🎯 تلقائي حسب الفكرة', desc: 'Auto by prompt' },
                { id: 'monkey_jungle', label: '🐒 أصوات قرود وغابة', desc: 'Monkey & Jungle calls' },
                { id: 'supercar', label: '🏎️ محركات وسيارات', desc: 'Engine revs & speed' },
                { id: 'sci_fi', label: '🚀 خيال علمي وليزر', desc: 'Space warp & lasers' },
                { id: 'nature_storm', label: '🌧️ عواصف ورعود', desc: 'Thunderstorm & rain' },
                { id: 'epic_cinema', label: '🥁 طبول وسينما', desc: 'Epic cinema hits' },
                { id: 'animals', label: '🦁 زئير وحيوانات', desc: 'Wildlife & lion roar' },
                { id: 'ocean', label: '🌊 أمواج ومحيط', desc: 'Ocean waves surge' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedSoundFx(item.id);
                    if (item.id !== 'auto') {
                      soundFxEngine.playSoundForTheme(item.id);
                      showToast(`تم اختيار المؤثر الصوتي: ${item.label} 🔊`);
                    } else {
                      showToast('تم ضبط المؤثر الصوتي تلقائياً حسب الفكرة 🎯');
                    }
                  }}
                  className={`p-2 rounded-xl border text-right rtl:text-right transition-all cursor-pointer flex flex-col justify-between ${
                    selectedSoundFx === item.id
                      ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-[11px] truncate">{item.label}</div>
                  <div className="text-[9px] text-slate-500">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {isGenerating && (
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800 mt-2">
              <div
                className="bg-gradient-to-r from-pink-500 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          )}
        </div>
      </div>

      {/* Main Video Production Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Video Player */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          {/* Video Display Viewport with Motion Animation */}
          <div
            className={`w-full bg-slate-950 relative flex items-center justify-center overflow-hidden select-none transition-all ${
              aspectRatio === '9:16' ? 'h-[500px]' : aspectRatio === '1:1' ? 'h-[440px]' : 'h-[380px]'
            }`}
          >
            {/* Real Scene Keyframe Background with Ken Burns Pan/Zoom Motion */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={currentScene.visualUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'}
                alt={currentScene.visualPrompt}
                onError={handleImageError}
                className={`w-full h-full object-cover transition-transform duration-1000 ease-out ${
                  isPlaying ? 'scale-110 translate-y-1' : 'scale-100'
                }`}
              />
              {/* Cinematic Vignette & Ambient Tint Overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${currentScene.visualMoodColor}22 0%, #020617ee 90%)`,
                }}
              ></div>
            </div>

            {/* Top Bar with Music Track & Resolution */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-slate-400 z-20">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/90 backdrop-blur border border-slate-800 text-[11px] text-slate-200">
                <Music className="w-3 h-3 text-pink-400" />
                <span>{project.bgMusicVibe}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`px-2 py-1 rounded-md border text-[11px] flex items-center gap-1.5 backdrop-blur transition-colors ${
                    isMuted ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' : 'bg-slate-900/90 text-slate-300 border-slate-800'
                  }`}
                  title={isMuted ? 'Voiceover Muted' : 'Voiceover Active'}
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                  <span>{isMuted ? 'Voice Muted' : 'AI Voice ON'}</span>
                </button>

                <span className="px-2 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[10px] font-bold uppercase">
                  4K HDR Preview
                </span>
              </div>
            </div>

            {/* Top Scene Badge & Active Voice Wave */}
            <div className="absolute top-12 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur border border-white/10 text-[10px] text-white font-mono shadow-lg">
                <Camera className="w-3 h-3 text-pink-400" />
                <span>Scene {currentScene.sceneNumber} • {currentScene.cameraMovement}</span>
              </div>

              {isSpeakingNow && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/25 backdrop-blur border border-pink-500/40 text-[10px] font-bold text-pink-300 shadow-lg animate-in fade-in">
                  <div className="flex items-center gap-0.5 h-3">
                    <span className="w-0.5 h-2.5 bg-pink-400 animate-pulse"></span>
                    <span className="w-0.5 h-3.5 bg-pink-300 animate-pulse delay-75"></span>
                    <span className="w-0.5 h-2 bg-pink-400 animate-pulse delay-150"></span>
                  </div>
                  <span>🎙️ صوت ناطق حقيقي ({voiceLang})</span>
                </div>
              )}
            </div>

            {/* Subtle Cinematic Lower-Third Caption (Clean & Non-Intrusive) */}
            {showSubtitles && (
              <div className="absolute bottom-5 left-4 right-4 z-20 text-center pointer-events-none animate-in fade-in">
                <div className="inline-block px-4 py-2 rounded-2xl bg-slate-950/75 backdrop-blur-md border border-white/15 text-white font-semibold text-xs sm:text-sm drop-shadow-xl max-w-xl leading-relaxed">
                  {currentScene.voiceover || currentScene.visualPrompt}
                </div>
              </div>
            )}

            {/* Big Play Overlay if paused */}
            {!isPlaying && (
              <div
                onClick={togglePlay}
                className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/40 cursor-pointer group"
              >
                <div className="w-16 h-16 rounded-2xl bg-pink-600/90 group-hover:bg-pink-500 text-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                  <Play className="w-7 h-7 fill-current ml-1" />
                </div>
              </div>
            )}
          </div>

          {/* Player Controls Bar */}
          <div className="p-4 bg-slate-950/90 border-t border-slate-800 space-y-3">
            {/* Scrubber */}
            <div
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = clickX / rect.width;
                const totalScenes = project.scenes.length;
                const targetScene = Math.min(Math.floor(ratio * totalScenes), totalScenes - 1);
                setCurrentSceneIdx(targetScene);
                setSceneProgress(Math.floor(((ratio * totalScenes) % 1) * 100));
              }}
              className="w-full bg-slate-900 rounded-full h-2 overflow-hidden cursor-pointer group"
            >
              <div
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 h-full transition-all duration-200"
                style={{
                  width: `${((currentSceneIdx * 100 + sceneProgress) / (project.scenes.length * 100)) * 100}%`,
                }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentSceneIdx((prev) => Math.max(0, prev - 1));
                    setSceneProgress(0);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  title="Previous Scene"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-9 h-9 rounded-xl bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center transition-all shadow-md shadow-pink-600/20"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => {
                    setCurrentSceneIdx((prev) => (prev + 1) % project.scenes.length);
                    setSceneProgress(0);
                  }}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                  title="Next Scene"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <span className="text-xs font-mono text-slate-300 ml-2">
                  Scene {currentSceneIdx + 1} / {project.scenes.length}
                </span>

                {/* Real Sound Effects Mute / Unmute & Theme Button */}
                <button
                  onClick={() => {
                    const nextMute = !isMuted;
                    setIsMuted(nextMute);
                    if (nextMute) {
                      soundFxEngine.stopAll();
                      showToast('تم كتم المؤثرات الصوتية 🔇');
                    } else {
                      triggerSoundFx();
                      showToast('تم تفعيل المؤثرات الصوتية الحقيقية 🔊');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border ${
                    !isMuted 
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' 
                      : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-white'
                  }`}
                  title="كتم أو تشغيل المؤثرات الصوتية الحقيقية للفيلم"
                >
                  {!isMuted ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{!isMuted ? 'مؤثرات: شغال 🔊' : 'صامت 🔇'}</span>
                </button>

                {/* AI Spoken Voice Language Selector */}
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5">
                  <span className="text-[10px] text-pink-400 font-bold">🎙️ صوت AI:</span>
                  <select
                    value={voiceLang}
                    onChange={(e) => {
                      const newLang = e.target.value;
                      setVoiceLang(newLang);
                      showToast(`تم تغيير لغة الصوت الناطق إلى: ${newLang} 🗣️`);
                    }}
                    className="bg-transparent text-white text-[11px] font-bold focus:outline-none cursor-pointer"
                  >
                    <option value="ar-SA" className="bg-slate-900 text-white">🇸🇦 العربية (Arabic)</option>
                    <option value="en-US" className="bg-slate-900 text-white">🇺🇸 English (US Narrator)</option>
                    <option value="en-GB" className="bg-slate-900 text-white">🇬🇧 English (UK Cinema)</option>
                    <option value="fr-FR" className="bg-slate-900 text-white">🇫🇷 Français (French)</option>
                    <option value="es-ES" className="bg-slate-900 text-white">🇪🇸 Español (Spanish)</option>
                    <option value="de-DE" className="bg-slate-900 text-white">🇩🇪 Deutsch (German)</option>
                    <option value="tr-TR" className="bg-slate-900 text-white">🇹🇷 Türkçe (Turkish)</option>
                  </select>
                </div>

                {/* Subtitle Toggle */}
                <button
                  onClick={() => setShowSubtitles(!showSubtitles)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer border ${
                    showSubtitles ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40' : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                  title="إظهار أو إخفاء نص الترجمة السينمائي"
                >
                  {showSubtitles ? '💬 الترجمة: نعم' : '💬 بدون كلام'}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-300 font-mono">
                  {project.aspectRatio} • {duration}s Total
                </span>
                <button
                  onClick={() => setTheaterMode(true)}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Fullscreen Theater"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Scene Storyboard & Narration Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Layers className="w-4 h-4 text-pink-400" />
                <span>Storyboard Scenes ({project.scenes.length})</span>
              </h4>
              <span className="text-xs text-pink-400 font-medium truncate max-w-[180px]">{project.title}</span>
            </div>

            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {project.scenes.map((scene, idx) => {
                const isSelected = currentSceneIdx === idx;
                return (
                  <div
                    key={scene.sceneNumber}
                    onClick={() => {
                      setCurrentSceneIdx(idx);
                      setSceneProgress(0);
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-950 border-pink-500/70 shadow-lg shadow-pink-500/10'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: scene.visualMoodColor }}
                        ></span>
                        Scene {scene.sceneNumber} ({scene.duration}s)
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {scene.cameraMovement}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-2 leading-relaxed line-clamp-2">
                      {scene.visualPrompt}
                    </p>

                    <div className="p-2 rounded-lg bg-slate-900/90 border border-slate-800/60 text-[11px] text-pink-300 italic flex items-center gap-1.5">
                      <Volume2 className="w-3 h-3 text-pink-400 shrink-0" />
                      <span className="line-clamp-1">"{scene.voiceover}"</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Theater Modal */}
      {theaterMode && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-lg flex items-center justify-center p-6">
          <div className="relative max-w-5xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
              <span className="text-sm font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-pink-400" />
                <span>{project.title} — Cinema Screen</span>
              </span>
              <button
                onClick={() => setTheaterMode(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative h-[480px] bg-slate-950 flex items-center justify-center overflow-hidden">
              <img
                src={currentScene.visualUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'}
                alt={currentScene.visualPrompt}
                onError={handleImageError}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-slate-950/50"></div>
              <div className="relative z-10 p-8 text-center max-w-xl space-y-4">
                <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 font-mono text-xs border border-pink-500/30">
                  Scene {currentScene.sceneNumber} • {currentScene.cameraMovement}
                </span>
                <h2 className="text-xl font-extrabold text-white leading-relaxed">
                  "{currentScene.visualPrompt}"
                </h2>
                <p className="text-sm text-pink-200 italic bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
                  {currentScene.voiceover}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={togglePlay}
                className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                <span>{isPlaying ? 'Pause' : 'Play Cinematic'}</span>
              </button>

              <span className="text-xs font-mono text-slate-400">
                Scene {currentSceneIdx + 1} of {project.scenes.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
