import { AwardTrophyIcon, MusicIcon, SparklesIcon, MoonIcon, BriefcaseIcon, CpuIcon, EggIcon, GraduationIcon, RocketIcon, RepeatIcon, PaletteIcon, CogIcon, WaveformIcon, GemIcon, StarIcon, ClockIcon, GamepadIcon, BookIcon, PenIcon } from "../components/commons/Icons";

/**
 * Configurazione stili per i premi in base al type ID (0-255)
 */

export const AwardTypeConfig = {
  // Default / Special Award
  0: {
    icon: "trophy",
    color: "from-cyan-500/20 to-blue-500/20",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
    shimmer: false
  },
  // Grafica
  1: {
    icon: "gem",
    color: "from-rose-500/20 to-indigo-500/30",
    border: "border-fuchsia-500/30",
    text: "text-rose-400",
    glow: "shadow-rose-500/20",
    shimmer: true
  },
  // Sonoro / Musica / Audio
  2: {
    icon: "music",
    color: "from-blue-500/20 to-indigo-500/20",
    border: "border-blue-500/30",
    text: "text-blue-400",
    glow: "shadow-blue-500/20"
  },
  // Gameplay / Giocabilità
  3: {
    icon: "gamepad",
    color: "from-emerald-500/20 to-cyan-500/20",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    glow: "shadow-emerald-500/20"
  },
  // Trama / Narrativa / Storia
  4: {
    icon: "book",
    color: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/30",
    text: "text-amber-400",
    glow: "shadow-amber-500/20"
  },
  // Originalità / Innovazione
  5: {
    icon: "sparkles",
    color: "from-purple-500/20 to-fuchsia-500/20",
    border: "border-purple-500/30",
    text: "text-purple-400",
    glow: "shadow-purple-500/20"
  },
  // Atmosfera / Setting
  6: {
    icon: "moon",
    color: "from-indigo-500/20 to-violet-500/20",
    border: "border-indigo-500/30",
    text: "text-indigo-400",
    glow: "shadow-indigo-500/20"
  },
  // Professionalità
  10: {
    icon: "briefcase",
    color: "from-slate-500/20 to-gray-500/20",
    border: "border-slate-500/30",
    text: "text-slate-400",
    glow: "shadow-slate-500/20"
  },
  // Carisma
  11: {
    icon: "star",
    color: "from-pink-500/20 to-rose-500/20",
    border: "border-pink-500/30",
    text: "text-pink-400",
    glow: "shadow-pink-500/20"
  },
  // Longevità
  12: {
    icon: "clock",
    color: "from-teal-500/20 to-emerald-500/20",
    border: "border-teal-500/30",
    text: "text-teal-400",
    glow: "shadow-teal-500/20"
  },
  // Tecnica
  13: {
    icon: "cpu",
    color: "from-orange-500/20 to-red-500/20",
    border: "border-orange-500/30",
    text: "text-orange-400",
    glow: "shadow-orange-500/20"
  },
  // Trofeo Oro (Primo Posto)
  20: {
    icon: "gold",
    color: "from-yellow-400/20 to-amber-500/20",
    border: "border-yellow-400/50",
    text: "text-yellow-400",
    glow: "shadow-yellow-400/30"
  },
  // Trofeo Argento (Secondo Posto)
  21: {
    icon: "silver",
    color: "from-slate-300/20 to-slate-400/20",
    border: "border-slate-300/50",
    text: "text-slate-300",
    glow: "shadow-slate-300/30"
  },
  // Trofeo Bronzo (Terzo Posto)
  22: {
    icon: "bronze",
    color: "from-orange-600/20 to-amber-700/20",
    border: "border-orange-600/50",
    text: "text-orange-600",
    glow: "shadow-orange-600/30"
  },
  // Easter Egg
  30: {
    icon: "egg",
    color: "from-lime-500/20 to-green-500/20",
    border: "border-lime-500/30",
    text: "text-lime-400",
    glow: "shadow-lime-500/20"
  },
  // Matricola / Novellino
  31: {
    icon: "graduation",
    color: "from-sky-500/20 to-blue-500/20",
    border: "border-sky-500/30",
    text: "text-sky-400",
    glow: "shadow-sky-500/20"
  },
  // Ambizione
  32: {
    icon: "rocket",
    color: "from-red-500/20 to-rose-500/20",
    border: "border-red-500/30",
    text: "text-red-400",
    glow: "shadow-red-500/20"
  },
  // Rigiocabilità
  33: {
    icon: "repeat",
    color: "from-violet-500/20 to-purple-500/20",
    border: "border-violet-500/30",
    text: "text-violet-400",
    glow: "shadow-violet-500/20"
  },
  // Estetica / Appagante
  34: {
    icon: "palette",
    color: "from-fuchsia-500/20 to-pink-500/20",
    border: "border-fuchsia-500/30",
    text: "text-fuchsia-400",
    glow: "shadow-fuchsia-500/20"
  },
  // Meccanica
  35: {
    icon: "cog",
    color: "from-stone-500/20 to-stone-400/20",
    border: "border-stone-500/30",
    text: "text-stone-400",
    glow: "shadow-stone-500/20"
  },
  // Sound Design
  36: {
    icon: "waveform",
    color: "from-cyan-500/20 to-teal-500/20",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    glow: "shadow-cyan-500/20",
    shimmer: false
  }
};

// Icon SVGs mapping

export const AwardIcons = {
  trophy: <AwardTrophyIcon size={18} strokeWidth={2.5} />,
  gem: <GemIcon size={18} strokeWidth={2.5} />,
  music: <MusicIcon size={18} strokeWidth={2.5} />,
  gamepad: <GamepadIcon size={18} strokeWidth={2.5} />,
  book: <BookIcon size={18} strokeWidth={2.5} />,
  sparkles: <SparklesIcon size={18} strokeWidth={2.5} />,
  moon: <MoonIcon size={18} strokeWidth={2.5} />,
  briefcase: <BriefcaseIcon size={18} strokeWidth={2.5} />,
  star: <StarIcon size={18} strokeWidth={2.5} />,
  clock: <ClockIcon size={18} strokeWidth={2.5} />,
  cpu: <CpuIcon size={18} strokeWidth={2.5} />,
  gold: <AwardTrophyIcon size={18} strokeWidth={2.5} />,
  silver: <AwardTrophyIcon size={18} strokeWidth={2.5} />,
  bronze: <AwardTrophyIcon size={18} strokeWidth={2.5} />,
  egg: <EggIcon size={18} strokeWidth={2.5} />,
  graduation: <GraduationIcon size={18} strokeWidth={2.5} />,
  rocket: <RocketIcon size={18} strokeWidth={2.5} />,
  repeat: <RepeatIcon size={18} strokeWidth={2.5} />,
  palette: <PaletteIcon size={18} strokeWidth={2.5} />,
  cog: <CogIcon size={18} strokeWidth={2.5} />,
  waveform: <WaveformIcon size={18} strokeWidth={2.5} />,
  brush: <PenIcon size={18} strokeWidth={2.5} />
};

/**
 * Get award configuration by type ID
 * @param {number} type - Type ID (0-255)
 * @returns {Object} Award configuration
 */
export function getAwardConfigByType(type) {
  return AwardTypeConfig[type] || AwardTypeConfig[0];
}
