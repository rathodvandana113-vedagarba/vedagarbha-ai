"use client";

import React, { useState } from 'react';
import Navbar from '@/components/navbars/KlingNav';
import { useRouter } from 'next/navigation';
import { Copy, Flame, Search, ArrowRight, Video, Image, Mic } from 'lucide-react';

const CATEGORIES = ["All", "Cinematic Videos", "Text to Speech", "Text to Image", "Anime Style", "Fantasy Worlds", "AI Portraits", "Product Ads", "Social Media Reels", "Nature & Landscape", "Sci-Fi", "Horror & Dark", "Architecture", "Food & Cooking", "Fashion", "Sports & Action"];

type PromptType = "text-to-video" | "text-to-image" | "text-to-speech";

interface Prompt {
  id: number;
  title: string;
  text: string;
  category: string;
  type: PromptType;
  trending: boolean;
  image: string;
}

const UNSPLASH = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const PROMPTS: Prompt[] = [
  // ─── CINEMATIC VIDEOS (text-to-video) ───────────────────────────────────────
  { id:1, title:"Neon City Drive", text:"Cinematic drone shot flying over a futuristic neon city at night, ultra realistic, 4K", category:"Cinematic Videos", type:"text-to-video", trending:true, image:UNSPLASH("photo-1555680202-c86f0e12f086") },
  { id:2, title:"Sports Car Chase", text:"High speed sports car chase through a desert highway, motion blur, cinematic 8K", category:"Cinematic Videos", type:"text-to-video", trending:true, image:UNSPLASH("photo-1492144534655-ae79c964c9d7") },
  { id:3, title:"Ocean Sunrise", text:"Time-lapse of a golden sunrise over calm ocean waves, aerial view, vibrant colors, 4K", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1507525428034-b723cf961d3e") },
  { id:4, title:"Waterfall Mist", text:"Majestic waterfall crashing into a turquoise lagoon, slow motion, ultra HD, cinematic", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1433086966358-54859d0ed716") },
  { id:5, title:"City Time-Lapse", text:"Bustling city time-lapse from golden hour to midnight, lights streak across streets, 4K", category:"Cinematic Videos", type:"text-to-video", trending:true, image:UNSPLASH("photo-1477959858617-67f85cf4f1df") },
  { id:6, title:"Volcanic Eruption", text:"Massive volcanic eruption with glowing lava rivers at night, cinematic wide shot, dramatic", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1570129477492-45c003edd2be") },
  { id:7, title:"Rainstorm Drama", text:"Dark rainstorm over a lonely highway, headlights cutting through rain and fog, noir cinematic", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1501999635878-71cb5379c2d8") },
  { id:8, title:"Northern Lights", text:"Aurora borealis dancing over snowy mountains, hypnotic green and purple waves, time-lapse 4K", category:"Cinematic Videos", type:"text-to-video", trending:true, image:UNSPLASH("photo-1531366936337-7c912a4589a7") },
  { id:9, title:"Desert Sandstorm", text:"Massive sandstorm rolling across a vast desert at sunset, cinematic, aerial drone, slow motion", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1509316785289-025f5b846b35") },
  { id:10, title:"Skyscraper Storm", text:"Lightning storm over a skyline of glass skyscrapers, electric streaks, cinematic reflection", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1444723121867-7a241cacace9") },
  { id:11, title:"Underwater World", text:"Slow motion underwater shot of a coral reef with vibrant fish, sun rays piercing through water", category:"Cinematic Videos", type:"text-to-video", trending:true, image:UNSPLASH("photo-1518020382113-a7e8fc38eac9") },
  { id:12, title:"Train Through Alps", text:"A vintage train rushing through misty alpine meadows, golden autumn, cinematic wide shot", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1474487548417-781cb71495f3") },
  { id:13, title:"Drone City Reveal", text:"Epic drone reveal shot rising from street level to above the clouds over a mega city, 4K", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1480714378408-67cf0d13bc1b") },
  { id:14, title:"Snowstorm Forest", text:"Dense snowstorm in a dark pine forest, soft bokeh snowflakes, moody cinematic atmosphere", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1516912481808-3406841bd33c") },
  { id:15, title:"Meteor Shower", text:"Breathtaking meteor shower over a dark desert canyon, stars streaking, long exposure cinematic", category:"Cinematic Videos", type:"text-to-video", trending:false, image:UNSPLASH("photo-1534796636912-3b95919381ac") },

  // ─── ANIME STYLE ────────────────────────────────────────────────────────────
  { id:16, title:"Rainy Tokyo Walk", text:"Anime girl walking in rainy Tokyo street with neon lights, cinematic atmosphere, Studio Ghibli style", category:"Anime Style", type:"text-to-video", trending:true, image:UNSPLASH("photo-1540959733332-eab4deabeeaf") },
  { id:17, title:"Samurai Duel", text:"Epic samurai duel on a cherry blossom mountain, dramatic wind, Demon Slayer art style", category:"Anime Style", type:"text-to-video", trending:true, image:UNSPLASH("photo-1528360983277-13d401cdc186") },
  { id:18, title:"Mech Battle", text:"Giant mechs battling in a destroyed Tokyo skyline, explosions, anime cinematic, ultra detailed", category:"Anime Style", type:"text-to-video", trending:false, image:UNSPLASH("photo-1561336313-0bd5e0b27ec8") },
  { id:19, title:"Magic Academy", text:"Students casting colorful spells in a grand magic academy, glowing particles, anime style", category:"Anime Style", type:"text-to-image", trending:false, image:UNSPLASH("photo-1573496359142-b8d87734a5a2") },
  { id:20, title:"Ninja Night Run", text:"Anime ninja running across rooftops under a full moon, motion blur, Naruto inspired", category:"Anime Style", type:"text-to-video", trending:false, image:UNSPLASH("photo-1480074568708-e7b720bb3f09") },
  { id:21, title:"Dragon Encounter", text:"Young girl facing a massive dragon in a glowing forest, anime art style, dreamy atmosphere", category:"Anime Style", type:"text-to-image", trending:true, image:UNSPLASH("photo-1535666669445-e8c15cd2e7d9") },
  { id:22, title:"Underwater City", text:"Anime girl floating through an abandoned underwater city, soft blue light, ethereal", category:"Anime Style", type:"text-to-image", trending:false, image:UNSPLASH("photo-1518020382113-a7e8fc38eac9") },
  { id:23, title:"Spirit Fox", text:"A glowing spirit fox running through an enchanted bamboo forest at dusk, anime cinematic", category:"Anime Style", type:"text-to-video", trending:false, image:UNSPLASH("photo-1535295972055-1c762f4483e5") },
  { id:24, title:"Sky Castle", text:"A floating castle in the clouds at golden hour, anime style, Studio Ghibli inspired, 4K", category:"Anime Style", type:"text-to-image", trending:true, image:UNSPLASH("photo-1518709268805-4e9042af9f23") },
  { id:25, title:"Cyberpunk Anime City", text:"Anime cyberpunk cityscape at night, pink neon signs, rain-slicked streets, blade runner vibes", category:"Anime Style", type:"text-to-image", trending:false, image:UNSPLASH("photo-1518770660439-4636190af475") },

  // ─── FANTASY WORLDS ─────────────────────────────────────────────────────────
  { id:26, title:"Epic Fantasy Dragon", text:"Epic fantasy dragon flying above snowy mountains, cinematic lighting, dramatic clouds in 4K", category:"Fantasy Worlds", type:"text-to-image", trending:true, image:UNSPLASH("photo-1577493340887-b7bfff550145") },
  { id:27, title:"Ancient Castle Ruins", text:"Overgrown ancient castle ruins in a misty forest, god rays shining through trees, ultra detailed", category:"Fantasy Worlds", type:"text-to-image", trending:false, image:UNSPLASH("photo-1518709268805-4e9042af9f23") },
  { id:28, title:"Crystal Cave", text:"A magical crystal cave glowing with blue and purple light, underground lake reflections", category:"Fantasy Worlds", type:"text-to-image", trending:true, image:UNSPLASH("photo-1612178537253-bccd437b730e") },
  { id:29, title:"Enchanted Forest", text:"A glowing enchanted forest at midnight, fireflies, magical fog, ancient trees, ethereal light", category:"Fantasy Worlds", type:"text-to-image", trending:false, image:UNSPLASH("photo-1448375240586-882707db888b") },
  { id:30, title:"Phoenix Rising", text:"A majestic phoenix rising from golden flames against a dark stormy sky, ultra detailed", category:"Fantasy Worlds", type:"text-to-image", trending:true, image:UNSPLASH("photo-1516912481808-3406841bd33c") },
  { id:31, title:"Floating Islands", text:"Massive floating islands with waterfalls cascading into clouds, lush vegetation, fantasy world", category:"Fantasy Worlds", type:"text-to-image", trending:false, image:UNSPLASH("photo-1507525428034-b723cf961d3e") },
  { id:32, title:"Wizard Tower", text:"A towering wizard's spire on a cliff overlooking a mystical sea, lightning striking the top", category:"Fantasy Worlds", type:"text-to-image", trending:false, image:UNSPLASH("photo-1533587851505-d119e13fa0d7") },
  { id:33, title:"Dragon Hoard", text:"A dragon sleeping on a mountain of gold coins in a vast underground cave, dramatic torchlight", category:"Fantasy Worlds", type:"text-to-image", trending:false, image:UNSPLASH("photo-1612178537253-bccd437b730e") },
  { id:34, title:"Mythical Kraken", text:"A colossal kraken rising from the sea during a storm, engulfing ancient ships, cinematic", category:"Fantasy Worlds", type:"text-to-video", trending:true, image:UNSPLASH("photo-1518020382113-a7e8fc38eac9") },
  { id:35, title:"Heaven's Gate", text:"Ethereal golden gates at the edge of clouds, angelic light beams, heaven concept art", category:"Fantasy Worlds", type:"text-to-image", trending:false, image:UNSPLASH("photo-1534796636912-3b95919381ac") },

  // ─── AI PORTRAITS ────────────────────────────────────────────────────────────
  { id:36, title:"Cyberpunk Portrait", text:"Close up portrait of a cyberpunk hacker with neon reflections in eyes, hyper-detailed, 8K", category:"AI Portraits", type:"text-to-image", trending:false, image:UNSPLASH("photo-1535295972055-1c762f4483e5") },
  { id:37, title:"Viking Warrior", text:"Photorealistic portrait of a fierce Viking warrior with battle scars, dramatic lighting, 8K", category:"AI Portraits", type:"text-to-image", trending:true, image:UNSPLASH("photo-1570168007204-dfb528c6958f") },
  { id:38, title:"Elven Queen", text:"Majestic elven queen with silver hair and crystal crown, golden armor, hyper-detailed fantasy", category:"AI Portraits", type:"text-to-image", trending:true, image:UNSPLASH("photo-1529626455594-4ff0802cfb7e") },
  { id:39, title:"Space Explorer", text:"Futuristic space explorer in a reflective suit on an alien planet surface, cinematic portrait", category:"AI Portraits", type:"text-to-image", trending:false, image:UNSPLASH("photo-1451187580459-43490279c0fa") },
  { id:40, title:"Samurai Close-Up", text:"Extreme close-up portrait of a weathered samurai with intense eyes, dramatic side lighting, 4K", category:"AI Portraits", type:"text-to-image", trending:true, image:UNSPLASH("photo-1528360983277-13d401cdc186") },
  { id:41, title:"Gothic Vampire", text:"Elegant gothic vampire woman with pale porcelain skin, dark velvet dress, crimson moonlight", category:"AI Portraits", type:"text-to-image", trending:false, image:UNSPLASH("photo-1529626455594-4ff0802cfb7e") },
  { id:42, title:"Fire Mage", text:"A powerful fire mage with swirling flames reflected in amber eyes, fantasy portrait, 8K", category:"AI Portraits", type:"text-to-image", trending:false, image:UNSPLASH("photo-1519058082700-08a0b56da9b4") },
  { id:43, title:"Ancient Pharaoh", text:"Photorealistic portrait of an Egyptian pharaoh with golden headdress, desert ruins backdrop", category:"AI Portraits", type:"text-to-image", trending:false, image:UNSPLASH("photo-1530982011887-3cc11cc85693") },
  { id:44, title:"Futuristic Cyborg", text:"Half-human half-robot cyborg face, glowing blue circuits in skin, ultra detailed portrait", category:"AI Portraits", type:"text-to-image", trending:true, image:UNSPLASH("photo-1535295972055-1c762f4483e5") },
  { id:45, title:"Ocean Goddess", text:"A mythical ocean goddess with flowing water hair, bioluminescent coral crown, underwater light", category:"AI Portraits", type:"text-to-image", trending:false, image:UNSPLASH("photo-1573496359142-b8d87734a5a2") },

  // ─── PRODUCT ADS ─────────────────────────────────────────────────────────────
  { id:46, title:"Luxury Perfume Ad", text:"Luxury perfume bottle ad with golden light and slow motion liquid droplets, shallow depth, 8K", category:"Product Ads", type:"text-to-video", trending:true, image:UNSPLASH("photo-1594035910387-fea47794261f") },
  { id:47, title:"Sneaker Launch Ad", text:"Cinematic sneaker product ad with dramatic lighting, slow motion spin, dark background, luxury", category:"Product Ads", type:"text-to-video", trending:true, image:UNSPLASH("photo-1542291026-7eec264c27ff") },
  { id:48, title:"Watch Commercial", text:"Luxury Swiss watch on a marble surface, extreme close-up, dramatic light beams, cinematic 4K", category:"Product Ads", type:"text-to-video", trending:false, image:UNSPLASH("photo-1523275335684-37898b6baf30") },
  { id:49, title:"Sports Drink Ad", text:"Energy drink exploding in slow motion, cyan and electric blue splash, dark background, product ad", category:"Product Ads", type:"text-to-video", trending:false, image:UNSPLASH("photo-1539592439196-3604e1cd02f0") },
  { id:50, title:"Laptop Tech Ad", text:"Sleek laptop opening in a dark room with ethereal light, particle effects, futuristic product ad", category:"Product Ads", type:"text-to-video", trending:true, image:UNSPLASH("photo-1496181133206-80ce9b88a853") },
  { id:51, title:"Diamond Jewelry Ad", text:"Diamond necklace rotating on black velvet, glittering light refractions, ultra luxury product ad", category:"Product Ads", type:"text-to-video", trending:false, image:UNSPLASH("photo-1515562141207-7a88fb7ce338") },
  { id:52, title:"Coffee Pour Ad", text:"Slow motion coffee pour into white ceramic mug, steam rising, warm moody lighting, product ad", category:"Product Ads", type:"text-to-video", trending:false, image:UNSPLASH("photo-1495474472287-4d71bcdd2085") },
  { id:53, title:"Car Reveal Ad", text:"Cinematic reveal of a luxury sports car emerging from fog, dramatic headlights, 4K commercial", category:"Product Ads", type:"text-to-video", trending:true, image:UNSPLASH("photo-1492144534655-ae79c964c9d7") },
  { id:54, title:"Skincare Glow Ad", text:"Luxury skincare product with dewdrop splash on white surface, glowing light, clean aesthetic", category:"Product Ads", type:"text-to-video", trending:false, image:UNSPLASH("photo-1609840114035-3c981b782dfe") },
  { id:55, title:"Headphone Ad", text:"Premium headphones floating in dark space with sound waves visualized as glowing rings", category:"Product Ads", type:"text-to-video", trending:false, image:UNSPLASH("photo-1505740420928-5e560c06d30e") },

  // ─── SOCIAL MEDIA REELS ──────────────────────────────────────────────────────
  { id:56, title:"Viral TikTok Dance", text:"High energy dance transition video, vibrant colors, dynamic motion, optimized for social media", category:"Social Media Reels", type:"text-to-video", trending:false, image:UNSPLASH("photo-1611162617474-5b21e879e113") },
  { id:57, title:"Aesthetic Morning", text:"Aesthetic morning routine reel — coffee, plants, sunlight, warm golden tones, cozy vibe", category:"Social Media Reels", type:"text-to-video", trending:true, image:UNSPLASH("photo-1495474472287-4d71bcdd2085") },
  { id:58, title:"Gym Motivation Reel", text:"Fast-cut gym motivation reel, heavy lifts, dramatic music sync, high contrast, intense lighting", category:"Social Media Reels", type:"text-to-video", trending:true, image:UNSPLASH("photo-1534367610401-9f5ed68180aa") },
  { id:59, title:"Travel Highlights", text:"Cinematic travel highlights reel across multiple continents, fast cuts, vibrant colors, 4K", category:"Social Media Reels", type:"text-to-video", trending:false, image:UNSPLASH("photo-1488646953014-85cb44e25828") },
  { id:60, title:"Food Satisfying Reel", text:"Slow motion satisfying food preparation reel — slicing, pouring, melting, macro shots", category:"Social Media Reels", type:"text-to-video", trending:true, image:UNSPLASH("photo-1565299624946-b28f40a0ae38") },
  { id:61, title:"Luxury Lifestyle Reel", text:"Luxury lifestyle reel — yachts, private jets, five star hotels, golden hour, cinematic transitions", category:"Social Media Reels", type:"text-to-video", trending:false, image:UNSPLASH("photo-1563089145-599997674d42") },
  { id:62, title:"Outfit Change Reel", text:"Rapid fashion outfit transitions on a rooftop at golden hour, vibrant colors, trendy vibe", category:"Social Media Reels", type:"text-to-video", trending:false, image:UNSPLASH("photo-1558618666-fcd25c85cd64") },
  { id:63, title:"Coding Montage", text:"Fast-cut coding montage, multiple screens, late night hacker aesthetic, blue light, motivation", category:"Social Media Reels", type:"text-to-video", trending:false, image:UNSPLASH("photo-1498050108023-c5249f4df085") },

  // ─── TEXT TO SPEECH ──────────────────────────────────────────────────────────
  { id:64, title:"Motivational Speech", text:"The greatest glory in living lies not in never falling, but in rising every time we fall. Push forward, no matter the obstacles, because every champion was once a contender who refused to give up.", category:"Text to Speech", type:"text-to-speech", trending:true, image:UNSPLASH("photo-1557804506-669a67965ba0") },
  { id:65, title:"Product Launch Script", text:"Introducing the future of technology. Sleek. Powerful. Unstoppable. Meet the device that will change the way you create, connect, and experience the world. Available now.", category:"Text to Speech", type:"text-to-speech", trending:true, image:UNSPLASH("photo-1496181133206-80ce9b88a853") },
  { id:66, title:"Movie Trailer Voice", text:"In a world where nothing is as it seems, one warrior stands between order and chaos. This summer, witness the battle that will decide the fate of humanity. Coming soon to theaters worldwide.", category:"Text to Speech", type:"text-to-speech", trending:true, image:UNSPLASH("photo-1478720568477-152d9b164e26") },
  { id:67, title:"Meditation Narration", text:"Close your eyes. Take a slow, deep breath in. Feel the tension leaving your body. With every exhale, release what no longer serves you. You are calm. You are centered. You are at peace.", category:"Text to Speech", type:"text-to-speech", trending:false, image:UNSPLASH("photo-1506126613408-eca07ce68773") },
  { id:68, title:"News Anchor Intro", text:"Good evening, and welcome to Vedagarbha News. Tonight's top story: breakthrough developments in artificial intelligence are reshaping industries across the globe. Here is what you need to know.", category:"Text to Speech", type:"text-to-speech", trending:false, image:UNSPLASH("photo-1557804506-669a67965ba0") },
  { id:69, title:"Podcast Intro", text:"Welcome back to The Daily Digest, the podcast where we break down the biggest stories in tech, business, and culture. I am your host, and today we are diving into something truly fascinating.", category:"Text to Speech", type:"text-to-speech", trending:true, image:UNSPLASH("photo-1453738773917-9c3eff1db985") },
  { id:70, title:"Audiobook Narration", text:"The old house at the end of Maple Street had stood empty for twenty years. No one in the town spoke of what had happened there. But on the night of the autumn harvest, one curious girl decided to find out.", category:"Text to Speech", type:"text-to-speech", trending:false, image:UNSPLASH("photo-1507003211169-0a1dd7228f2d") },
  { id:71, title:"YouTube Intro Script", text:"Hey everyone and welcome back to the channel! If you are new here, I create videos about productivity, tech, and personal growth. Make sure you hit that subscribe button and let us get into today's video.", category:"Text to Speech", type:"text-to-speech", trending:true, image:UNSPLASH("photo-1611162617474-5b21e879e113") },
  { id:72, title:"Kids Story", text:"Once upon a time, in a magical forest where the trees sparkled with golden leaves, a tiny rabbit named Pip discovered a mysterious glowing door hidden behind the oldest oak tree.", category:"Text to Speech", type:"text-to-speech", trending:false, image:UNSPLASH("photo-1448375240586-882707db888b") },
  { id:73, title:"Corporate Explainer", text:"Our platform helps businesses of all sizes automate their workflows, reduce costs by up to forty percent, and scale faster than ever before. Join over ten thousand companies already transforming their operations.", category:"Text to Speech", type:"text-to-speech", trending:false, image:UNSPLASH("photo-1497366216548-37526070297c") },
  { id:74, title:"Game Trailer Voice", text:"The kingdom has fallen. The heroes are scattered. But one warrior remains. Fight through a hundred enemies, claim the throne, and restore peace to a shattered world. The battle begins now.", category:"Text to Speech", type:"text-to-speech", trending:true, image:UNSPLASH("photo-1561336313-0bd5e0b27ec8") },
  { id:75, title:"Luxury Brand Ad Voice", text:"Elegance is not about being noticed. It is about being remembered. Discover our new collection — crafted for those who believe that every detail matters, and every moment deserves perfection.", category:"Text to Speech", type:"text-to-speech", trending:false, image:UNSPLASH("photo-1558618666-fcd25c85cd64") },
  { id:76, title:"Tech Launch Voice", text:"The wait is over. After three years of engineering and innovation, we are proud to present a product that redefines what is possible. This is not just an upgrade. This is a revolution.", category:"Text to Speech", type:"text-to-speech", trending:true, image:UNSPLASH("photo-1518770660439-4636190af475") },
  { id:77, title:"Sports Commentary", text:"And he charges down the left flank — incredible pace — a quick dummy to beat the defender — SHOOTS! He scores! The stadium erupts! What an incredible goal from the young striker!", category:"Text to Speech", type:"text-to-speech", trending:false, image:UNSPLASH("photo-1534367610401-9f5ed68180aa") },
  { id:78, title:"Inspirational Quote", text:"You have exactly one life in which to do everything you will ever do. Act accordingly. The time will never be just right. Start where you stand, and work with whatever tools you may have.", category:"Text to Speech", type:"text-to-speech", trending:true, image:UNSPLASH("photo-1557804506-669a67965ba0") },
  { id:79, title:"ASMR Bedtime Story", text:"The stars are beginning to appear, one by one, like tiny candles being lit in the great dark ceiling of the sky. It is time to rest now. Close your eyes, little one, and let the dreams begin.", category:"Text to Speech", type:"text-to-speech", trending:false, image:UNSPLASH("photo-1534796636912-3b95919381ac") },
  { id:80, title:"Documentary Narration", text:"For thousands of years, the Amazon rainforest has been Earth's greatest living library. Home to tens of millions of species, it holds secrets that humanity has only begun to uncover.", category:"Text to Speech", type:"text-to-speech", trending:false, image:UNSPLASH("photo-1448375240586-882707db888b") },

  // ─── NATURE & LANDSCAPE ──────────────────────────────────────────────────────
  { id:81, title:"Sahara at Sunset", text:"Vast Sahara desert with golden sand dunes at sunset, camel silhouettes, rich warm tones, 4K", category:"Nature & Landscape", type:"text-to-image", trending:false, image:UNSPLASH("photo-1509316785289-025f5b846b35") },
  { id:82, title:"Cherry Blossom Path", text:"A beautiful path lined with pink cherry blossom trees in full bloom, soft petals falling, Japan", category:"Nature & Landscape", type:"text-to-image", trending:true, image:UNSPLASH("photo-1522383225653-ed111181a951") },
  { id:83, title:"Iceland Glacier", text:"Photorealistic Icelandic glacier with electric blue ice crevasses, snow storm approaching, 8K", category:"Nature & Landscape", type:"text-to-image", trending:false, image:UNSPLASH("photo-1531366936337-7c912a4589a7") },
  { id:84, title:"Amazon River", text:"Aerial shot of the Amazon river winding through dense green rainforest, morning mist, 4K", category:"Nature & Landscape", type:"text-to-image", trending:false, image:UNSPLASH("photo-1448375240586-882707db888b") },
  { id:85, title:"Grand Canyon Storm", text:"Dramatic storm over the Grand Canyon, lightning strikes in the gorge, cinematic wide angle", category:"Nature & Landscape", type:"text-to-image", trending:true, image:UNSPLASH("photo-1509316785289-025f5b846b35") },
  { id:86, title:"Tropical Island", text:"Perfect tropical island with crystal-clear turquoise water, white sand beach, aerial overhead view", category:"Nature & Landscape", type:"text-to-image", trending:true, image:UNSPLASH("photo-1507525428034-b723cf961d3e") },
  { id:87, title:"Lavender Fields", text:"Endless rows of purple lavender fields in Provence, France, golden sunset, dreamy bokeh", category:"Nature & Landscape", type:"text-to-image", trending:false, image:UNSPLASH("photo-1499002238440-d264edd596ec") },
  { id:88, title:"Mountain Mirror Lake", text:"Snow-capped mountains perfectly reflected in a glass-like alpine lake, serene, ultra detailed", category:"Nature & Landscape", type:"text-to-image", trending:true, image:UNSPLASH("photo-1503614472-8c93d56e92ce") },
  { id:89, title:"Forest Rain", text:"Cinematic slow motion rain falling in an ancient forest, green bokeh, peaceful and atmospheric", category:"Nature & Landscape", type:"text-to-video", trending:false, image:UNSPLASH("photo-1448375240586-882707db888b") },
  { id:90, title:"Bioluminescent Beach", text:"Bioluminescent waves glowing electric blue on a dark beach at night, magical, ultra realistic", category:"Nature & Landscape", type:"text-to-image", trending:true, image:UNSPLASH("photo-1507525428034-b723cf961d3e") },

  // ─── SCI-FI ──────────────────────────────────────────────────────────────────
  { id:91, title:"Space Station", text:"Interior of a futuristic space station, astronauts floating, Earth visible through panoramic window", category:"Sci-Fi", type:"text-to-image", trending:true, image:UNSPLASH("photo-1451187580459-43490279c0fa") },
  { id:92, title:"Alien Planet", text:"Breathtaking alien planet surface with two suns setting, exotic flora, purple sky, ultra detailed", category:"Sci-Fi", type:"text-to-image", trending:true, image:UNSPLASH("photo-1614728894747-a83421e2b9c9") },
  { id:93, title:"Robot City", text:"A city run entirely by robots, towering machine architecture, steam and neon, cinematic sci-fi", category:"Sci-Fi", type:"text-to-image", trending:false, image:UNSPLASH("photo-1485827404703-89b55fcc595e") },
  { id:94, title:"Wormhole Jump", text:"Spacecraft entering a swirling wormhole, time distortion, light streaks, ultra cinematic 4K", category:"Sci-Fi", type:"text-to-video", trending:true, image:UNSPLASH("photo-1451187580459-43490279c0fa") },
  { id:95, title:"Utopian Future", text:"A utopian future city with floating parks, clean energy towers, happy people, golden sunlight", category:"Sci-Fi", type:"text-to-image", trending:false, image:UNSPLASH("photo-1477959858617-67f85cf4f1df") },
  { id:96, title:"Mars Colony", text:"Photorealistic Mars colony with geodesic domes, red landscape, rocket launchpad in background", category:"Sci-Fi", type:"text-to-image", trending:true, image:UNSPLASH("photo-1614728894747-a83421e2b9c9") },
  { id:97, title:"Quantum Computer", text:"Glowing quantum computer in a dark lab, intricate circuitry, cold vapor, ultra detailed close-up", category:"Sci-Fi", type:"text-to-image", trending:false, image:UNSPLASH("photo-1518770660439-4636190af475") },
  { id:98, title:"Time Machine", text:"A gleaming steampunk time machine spinning rapidly through a vortex of glowing chronological debris", category:"Sci-Fi", type:"text-to-video", trending:false, image:UNSPLASH("photo-1474487548417-781cb71495f3") },
  { id:99, title:"AI Awakening", text:"A humanoid AI robot opening its eyes for the first time, glowing irises, dramatic close-up, 8K", category:"Sci-Fi", type:"text-to-image", trending:true, image:UNSPLASH("photo-1485827404703-89b55fcc595e") },
  { id:100, title:"Galactic Battle", text:"Epic space battle between two galactic fleets, laser cannons, explosions, nebula backdrop, 4K", category:"Sci-Fi", type:"text-to-video", trending:true, image:UNSPLASH("photo-1451187580459-43490279c0fa") },

  // ─── HORROR & DARK ───────────────────────────────────────────────────────────
  { id:101, title:"Haunted Mansion", text:"A crumbling Victorian haunted mansion on a stormy cliff, lightning illuminating ghostly figures", category:"Horror & Dark", type:"text-to-image", trending:false, image:UNSPLASH("photo-1518709268805-4e9042af9f23") },
  { id:102, title:"Dark Forest Entity", text:"A shadowy supernatural entity lurking between ancient trees in a dark forest, fog, moonlight", category:"Horror & Dark", type:"text-to-image", trending:false, image:UNSPLASH("photo-1448375240586-882707db888b") },
  { id:103, title:"Apocalypse Dawn", text:"A post-apocalyptic city at dawn, broken skyscrapers, blood-red sky, lone survivor silhouette", category:"Horror & Dark", type:"text-to-image", trending:true, image:UNSPLASH("photo-1444723121867-7a241cacace9") },
  { id:104, title:"Demon Summoning", text:"Dark ritual circle glowing with crimson runes, shadowy demon emerging, smoke and fire, dramatic", category:"Horror & Dark", type:"text-to-image", trending:false, image:UNSPLASH("photo-1516912481808-3406841bd33c") },
  { id:105, title:"Zombie Horde", text:"Cinematic overhead shot of a massive zombie horde filling city streets at night, eerie atmosphere", category:"Horror & Dark", type:"text-to-video", trending:false, image:UNSPLASH("photo-1477959858617-67f85cf4f1df") },

  // ─── ARCHITECTURE ────────────────────────────────────────────────────────────
  { id:106, title:"Futuristic Museum", text:"A stunning futuristic museum with parametric curves, glass and steel, cinematic exterior shot, 8K", category:"Architecture", type:"text-to-image", trending:true, image:UNSPLASH("photo-1497366216548-37526070297c") },
  { id:107, title:"Minimalist Villa", text:"Luxury minimalist villa on a cliff overlooking the Mediterranean at sunset, infinity pool, 4K", category:"Architecture", type:"text-to-image", trending:true, image:UNSPLASH("photo-1613490493576-7fde63acd811") },
  { id:108, title:"Japanese Shrine", text:"Traditional Japanese shrine in autumn, red torii gates, maple leaves, golden morning light, 8K", category:"Architecture", type:"text-to-image", trending:false, image:UNSPLASH("photo-1528360983277-13d401cdc186") },
  { id:109, title:"Gothic Cathedral", text:"Towering Gothic cathedral interior with massive stained glass windows, divine light, ultra detailed", category:"Architecture", type:"text-to-image", trending:false, image:UNSPLASH("photo-1533587851505-d119e13fa0d7") },
  { id:110, title:"Brutalist Tower", text:"Dramatic brutalist skyscraper at blue hour, angular concrete forms, moody sky, architectural photography", category:"Architecture", type:"text-to-image", trending:false, image:UNSPLASH("photo-1444723121867-7a241cacace9") },

  // ─── FOOD & COOKING ──────────────────────────────────────────────────────────
  { id:111, title:"Melting Chocolate", text:"Cinematic macro shot of dark chocolate slowly melting, warm amber light, slow motion luxury food ad", category:"Food & Cooking", type:"text-to-video", trending:true, image:UNSPLASH("photo-1606312619070-d48b4c652a52") },
  { id:112, title:"Sushi Plating", text:"Master chef plating exquisite sushi in a Michelin star restaurant, macro close-up, dramatic light", category:"Food & Cooking", type:"text-to-video", trending:false, image:UNSPLASH("photo-1540189549336-e6e99eb4b895") },
  { id:113, title:"Pizza Cheese Pull", text:"Slow motion cheese pull from a fresh wood-fired Neapolitan pizza, warm light, 4K food video", category:"Food & Cooking", type:"text-to-video", trending:true, image:UNSPLASH("photo-1565299624946-b28f40a0ae38") },
  { id:114, title:"Cocktail Pour", text:"Cinematic cocktail being poured over ice, citrus slice, neon bar reflection, luxury drink ad", category:"Food & Cooking", type:"text-to-video", trending:false, image:UNSPLASH("photo-1551024709-8f23befc6f87") },
  { id:115, title:"Ramen Bowl Close-Up", text:"Photorealistic close-up of a steaming ramen bowl, perfectly arranged toppings, broth glistening, 8K", category:"Food & Cooking", type:"text-to-image", trending:true, image:UNSPLASH("photo-1569718212165-3a8278d5f624") },

  // ─── FASHION ─────────────────────────────────────────────────────────────────
  { id:116, title:"Paris Runway", text:"High fashion model walking a glowing runway in Paris, dramatic fashion photography, elegant gown", category:"Fashion", type:"text-to-video", trending:true, image:UNSPLASH("photo-1558618666-fcd25c85cd64") },
  { id:117, title:"Streetwear Editorial", text:"Bold streetwear editorial shoot in a graffiti alley, vibrant colors, high-contrast, urban attitude", category:"Fashion", type:"text-to-image", trending:true, image:UNSPLASH("photo-1558618666-fcd25c85cd64") },
  { id:118, title:"Vintage Couture", text:"Vintage 1960s couture fashion portrait, pastel palette, retro makeup, elegant pose, film grain", category:"Fashion", type:"text-to-image", trending:false, image:UNSPLASH("photo-1529626455594-4ff0802cfb7e") },
  { id:119, title:"Futuristic Fashion", text:"Model wearing futuristic metallic avant-garde fashion, sleek set design, studio lighting, editorial", category:"Fashion", type:"text-to-image", trending:false, image:UNSPLASH("photo-1558618666-fcd25c85cd64") },
  { id:120, title:"Luxury Watch Wrist", text:"Close-up wrist shot wearing a luxury gold timepiece, tailored suit cuff, bokeh background, 8K", category:"Fashion", type:"text-to-image", trending:false, image:UNSPLASH("photo-1523275335684-37898b6baf30") },

  // ─── SPORTS & ACTION ─────────────────────────────────────────────────────────
  { id:121, title:"Skateboarder Trick", text:"Extreme close-up of a skateboarder landing a perfect kick-flip at sunset, slow motion, 4K", category:"Sports & Action", type:"text-to-video", trending:true, image:UNSPLASH("photo-1547447134-cd3f5c716030") },
  { id:122, title:"Basketball Dunk", text:"Cinematic slow motion basketball player dunking with incredible athleticism, packed stadium crowd", category:"Sports & Action", type:"text-to-video", trending:true, image:UNSPLASH("photo-1546519638-68e109498ffc") },
  { id:123, title:"Surfer Barrel", text:"Pro surfer riding inside a massive barrel wave, slow motion, sun refraction through water, 4K", category:"Sports & Action", type:"text-to-video", trending:true, image:UNSPLASH("photo-1502680390469-be75c86b636f") },
  { id:124, title:"MMA Fighter", text:"Dramatic portrait of an MMA fighter wrapping hands before a title fight, cinematic dark lighting", category:"Sports & Action", type:"text-to-image", trending:false, image:UNSPLASH("photo-1534367610401-9f5ed68180aa") },
  { id:125, title:"Marathon Finish Line", text:"Exhausted marathon runner crossing the finish line, crowd cheering, golden hour, slow motion 4K", category:"Sports & Action", type:"text-to-video", trending:false, image:UNSPLASH("photo-1552674605-db6ffd4facb5") },
];

// ── additional speech prompts (IDs 126-200) ─────────────────────────────────
const EXTRA_SPEECH: Prompt[] = Array.from({ length: 75 }, (_, i) => {
  const scripts = [
    "Welcome to Vedagarbha AI. The platform that transforms your imagination into stunning visual content in seconds. Try it today.",
    "Hard work beats talent when talent doesn't work hard. Every single day is a new chance to improve. Take it.",
    "The only limit is the one you set yourself. Dream big, start small, but most importantly — start now.",
    "Science is not only a discipline of reason but also one of romance and passion. It drives us to explore the unknown.",
    "Success is not the destination. It is the journey. Every step forward, no matter how small, is progress.",
    "In this age of artificial intelligence, creativity is the most uniquely human skill we possess. Use it.",
    "Good morning. Today is a brand new day full of possibilities. Set your intention, take a deep breath, and go.",
    "The world's fastest growing companies all have one thing in common: they solve real problems for real people.",
    "Once you replace negative thoughts with positive ones, you'll start having positive results. Mind your mindset.",
    "We are all connected by invisible threads of shared humanity. Kindness costs nothing and means everything.",
  ];
  return {
    id: 126 + i,
    title: `Speech Prompt ${i + 1}`,
    text: scripts[i % scripts.length] + (i > 0 ? " " + ("✦").repeat((i % 3) + 1) : ""),
    category: "Text to Speech",
    type: "text-to-speech" as PromptType,
    trending: i % 7 === 0,
    image: UNSPLASH("photo-1557804506-669a67965ba0"),
  };
});

// ── additional video/image prompts (IDs 201-500) ────────────────────────────
const EXTRA_PROMPTS: Prompt[] = Array.from({ length: 300 }, (_, i) => {
  const videoIdeas = [
    { t: "Cyber Street Chase", p: "Cinematic chase scene through neon-lit cyberpunk alleys, parkour athlete, rain, slow motion", cat: "Cinematic Videos", type: "text-to-video" as PromptType },
    { t: "Forest Spirit", p: "Ancient forest spirit made of glowing leaves and light emerges from a white oak tree, epic fantasy", cat: "Fantasy Worlds", type: "text-to-image" as PromptType },
    { t: "Astral Projection", p: "Soul leaving the body, floating upward through the ceiling into a swirling galaxy, spiritual cinematic", cat: "Sci-Fi", type: "text-to-video" as PromptType },
    { t: "Burning Rose", p: "A single rose slowly blooming and then catching fire in slow motion, macro cinematic, 4K", cat: "Cinematic Videos", type: "text-to-video" as PromptType },
    { t: "Knight Portrait", p: "Battle-worn knight in ornate silver armor, visor open, stormy battlefield backdrop, 8K portrait", cat: "AI Portraits", type: "text-to-image" as PromptType },
    { t: "Galaxy Swirl", p: "Tight vortex of a spiral galaxy spinning, vibrant gas clouds, stardust, cinematic space zoom", cat: "Sci-Fi", type: "text-to-video" as PromptType },
    { t: "Ice Cave", p: "Explorer inside a massive Antarctic ice cave, electric blue ice walls, shaft of sunlight, 8K", cat: "Nature & Landscape", type: "text-to-image" as PromptType },
    { t: "Bullet Train", p: "Japan's bullet train racing past Mount Fuji at golden hour, motion blur, cinematic wide, 4K", cat: "Cinematic Videos", type: "text-to-video" as PromptType },
    { t: "Mermaid Kingdom", p: "Underwater mermaid kingdom with glowing coral towers, bioluminescent ocean floor, fantasy 8K", cat: "Fantasy Worlds", type: "text-to-image" as PromptType },
    { t: "Burning City", p: "A post-apocalyptic city in flames, drone aerial, lone warrior walks through ash, cinematic 4K", cat: "Horror & Dark", type: "text-to-video" as PromptType },
  ];
  const idea = videoIdeas[i % videoIdeas.length];
  return {
    id: 201 + i,
    title: `${idea.t} ${Math.floor(i / videoIdeas.length) + 1}`,
    text: idea.p,
    category: idea.cat,
    type: idea.type,
    trending: i % 11 === 0,
    image: UNSPLASH("photo-1534796636912-3b95919381ac"),
  };
});

const ALL_PROMPTS: Prompt[] = [...PROMPTS, ...EXTRA_SPEECH, ...EXTRA_PROMPTS];

const TYPE_ICON: Record<PromptType, React.ReactNode> = {
  "text-to-video": <Video size={10} />,
  "text-to-image": <Image size={10} />,
  "text-to-speech": <Mic size={10} />,
};
const TYPE_LABEL: Record<PromptType, string> = {
  "text-to-video": "Video",
  "text-to-image": "Image",
  "text-to-speech": "Speech",
};

export default function PromptLibraryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePType, setActivePType] = useState<"all"|PromptType>("all");
  const router = useRouter();

  const handleUsePrompt = (promptText: string, type: PromptType) => {
    const routeMap: Record<PromptType, string> = {
      "text-to-video": "text-to-video",
      "text-to-image": "text-to-image",
      "text-to-speech": "text-to-speech",
    };
    router.push(`/generate/${routeMap[type]}?prompt=${encodeURIComponent(promptText)}`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const filteredPrompts = ALL_PROMPTS.filter(p => {
    if (activeCategory !== "All" && p.category !== activeCategory) return false;
    if (activePType !== "all" && p.type !== activePType) return false;
    if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase()) && !p.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const trendingPrompts = ALL_PROMPTS.filter(p => p.trending).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white font-sans overflow-x-hidden">
      <Navbar />

      <main className="pt-[100px] pb-24 max-w-[1440px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 pb-8 border-b border-white/10">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-3 bg-gradient-to-r from-[#D4AF37] to-[#F5D97A] text-transparent bg-clip-text">Prompt Library</h1>
            <p className="text-[#A1A1A6] text-lg max-w-[600px]">500+ ready-made prompts for videos, images, and speech. Click any to generate instantly.</p>
          </div>
          <div className="relative w-full md:w-[350px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121218] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>
        </div>

        {/* Type Filter */}
        <div className="flex gap-2 mb-6">
          {([["all","All"], ["text-to-video","Video"], ["text-to-image","Image"], ["text-to-speech","Speech"]] as [string, string][]).map(([val, label]) => (
            <button key={val} onClick={() => setActivePType(val as any)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${activePType === val ? "bg-[#D4AF37] text-black" : "bg-[#121218] text-[#A1A1A6] border border-white/10 hover:text-white"}`}>{label}</button>
          ))}
        </div>

        {/* Trending */}
        {activeCategory === "All" && !searchQuery && activePType === "all" && (
          <section className="mb-14">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Flame className="text-[#FF453A]" /> Trending Prompts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {trendingPrompts.map(prompt => (
                <div key={prompt.id} className="bg-[#121218]/80 backdrop-blur-md border border-white/5 hover:border-[#D4AF37]/50 rounded-2xl flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] relative overflow-hidden h-[300px]">
                  <div className="absolute inset-0 z-0">
                    <img src={prompt.image} alt={prompt.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-110 transition-all duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-[#121218]/90 to-transparent" />
                  </div>
                  <div className="absolute top-3 right-3 z-20">
                    <button onClick={() => handleCopy(prompt.text)} className="bg-black/60 backdrop-blur-sm p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">
                      <Copy size={13} className="text-gray-300" />
                    </button>
                  </div>
                  <div className="p-5 relative z-10 flex-1 flex flex-col justify-end">
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/30">{prompt.category}</span>
                      <span className="text-[10px] uppercase tracking-wider font-bold bg-black/40 text-gray-300 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">{TYPE_ICON[prompt.type]}{TYPE_LABEL[prompt.type]}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-1">{prompt.title}</h3>
                    <p className="text-xs text-[#A1A1A6] line-clamp-2 mb-3">"{prompt.text}"</p>
                    <button onClick={() => handleUsePrompt(prompt.text, prompt.type)}
                      className="w-full py-2 rounded-lg bg-black/50 backdrop-blur-md text-white border border-white/20 font-medium text-sm group-hover:border-[#D4AF37] group-hover:text-[#F5D97A] transition-all flex items-center justify-center gap-2">
                      Use Prompt <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Category chips */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? "bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]" : "bg-[#121218] text-[#A1A1A6] hover:text-white hover:bg-white/10 border border-white/5"}`}
            >{cat}</button>
          ))}
        </div>

        {/* Count */}
        <p className="text-[#6E6E73] text-sm mb-6">{filteredPrompts.length} prompts</p>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredPrompts.length > 0 ? filteredPrompts.map(prompt => (
            <div key={prompt.id} className="bg-[#121218]/80 border border-white/5 hover:border-white/20 rounded-2xl flex flex-col justify-between group transition-all duration-300 overflow-hidden relative h-[280px]">
              <div className="absolute inset-0 z-0">
                <img src={prompt.image} alt={prompt.title} className="w-full h-full object-cover opacity-20 group-hover:opacity-30 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121218] via-[#121218]/95 to-transparent" />
              </div>
              <div className="p-5 relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-[9px] uppercase tracking-wider font-bold bg-black/50 text-gray-300 px-2 py-0.5 rounded border border-white/10">{prompt.category}</span>
                      <span className="text-[9px] uppercase tracking-wider font-bold bg-[#D4AF37]/10 text-[#D4AF37] px-2 py-0.5 rounded border border-[#D4AF37]/20 flex items-center gap-1">{TYPE_ICON[prompt.type]}{TYPE_LABEL[prompt.type]}</span>
                    </div>
                    <button onClick={() => handleCopy(prompt.text)} className="p-1.5 rounded-md hover:bg-white/20 bg-black/30 text-gray-400 hover:text-white transition-colors border border-white/5">
                      <Copy size={13} />
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{prompt.title}</h3>
                  <p className="text-xs text-[#A1A1A6] leading-relaxed line-clamp-3">"{prompt.text}"</p>
                </div>
                <button onClick={() => handleUsePrompt(prompt.text, prompt.type)}
                  className="mt-4 w-max text-sm font-semibold text-[#D4AF37] hover:text-[#F5D97A] hover:underline underline-offset-4 transition-all flex items-center gap-1">
                  Use Prompt <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-[#A1A1A6] text-lg">No prompts found for "{searchQuery}" in {activeCategory}.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
