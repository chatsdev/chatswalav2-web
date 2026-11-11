import L from "leaflet";

import { Facebook, FileText, ImageIcon, Instagram, MapPin, MessageCircle, Mic, PlayCircle, Send } from "lucide-react";

export const COMMON_EMOJIS = ["❤️", "👍", "😂", "😮", "😢", "🙏"];

export const tabs = [
  { id: "images", icon: <ImageIcon size={18} />, label: "Images" },
  { id: "documents", icon: <FileText size={18} />, label: "Files" },
  { id: "locations", icon: <MapPin size={18} />, label: "Location" },
  { id: "audios", icon: <Mic size={18} />, label: "Audio" },
  { id: "videos", icon: <PlayCircle size={18} />, label: "Videos" },
];

export const CHANNELS = [
  { id: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "#25D366", bg: "bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white border-transparent shadow-primary/10 shadow-lg" },
  { id: "telegram", label: "Telegram", icon: Send, color: "#229ED9", bg: "bg-gradient-to-br from-[#229ED9] to-[#0088cc] text-white border-transparent shadow-sky-500/10 shadow-lg" },
  { id: "facebook", label: "Facebook", icon: Facebook, color: "#1877F2", bg: "bg-gradient-to-br from-[#1877F2] to-[#0056b3] text-white border-transparent shadow-blue-500/10 shadow-lg" },
  { id: "instagram", label: "Instagram", icon: Instagram, color: "#E1306C", bg: "bg-gradient-to-tr from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white border-transparent shadow-pink-500/10 shadow-lg" },
  // { id: "twitter", label: "Twitter", icon: TwitterIcon, color: "#000000", bg: "bg-gradient-to-br from-black to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-black border-transparent shadow-gray-500/10 shadow-lg" },
];

export const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export const TONES = [
  { id: "default", name: "Default Tone", file: "/assets/sounds/default.mp3" },
  { id: "bell", name: "Classic Bell", file: "/assets/sounds/bell.mp3" },
  { id: "glass", name: "Glass Clink", file: "/assets/sounds/glass.mp3" },
  { id: "glass_clink", name: "Wine Glass Clink", file: "/assets/sounds/glass2.mp3" },
  { id: "pop", name: "Bubble Pop", file: "/assets/sounds/pop.mp3" },
  { id: "happy_bells", name: "Happy Bells", file: "/assets/sounds/happy_bells.mp3" },
  { id: "ping", name: "Digital", file: "/assets/sounds/software.mp3" },
  { id: "positive", name: "Positive", file: "/assets/sounds/positive.mp3" },
  { id: "magic_marimba", name: "Magic Marimba", file: "/assets/sounds/magic_marimba.mp3" },
  { id: "arabian_mystery_harp", name: "Arabian Mystery Harp", file: "/assets/sounds/arabian_mystery_harp.mp3" },
];

export const CHANNEL_CONFIG: Record<string, { label: string; color: string; Icon: React.ElementType }> = {
  whatsapp: { label: "WhatsApp", color: "#25D366", Icon: MessageCircle },
  baileys:  { label: "WhatsApp", color: "#25D366", Icon: MessageCircle },
  telegram: { label: "Telegram", color: "#229ED9", Icon: Send },
  facebook: { label: "Facebook", color: "#1877F2", Icon: Facebook },
  instagram:{ label: "Instagram", color: "#E1306C", Icon: Instagram },
};

export const OMNICHANNEL_SOURCES = ["telegram", "facebook", "instagram"];
