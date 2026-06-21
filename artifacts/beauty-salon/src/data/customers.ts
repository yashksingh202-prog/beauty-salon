export type CustomerEmotion = 'excited' | 'nervous' | 'impatient' | 'happy' | 'demanding' | 'sweet' | 'dramatic';

export type ChallengeType = 'classic' | 'bridal' | 'fashion' | 'celebrity' | 'speed';

export type Customer = {
  id: string;
  name: string;
  emoji: string;
  title: string;
  personality: string;
  backstory: string;
  emotion: CustomerEmotion;
  preferredColors: string[];
  preferredHairStyle: string;
  preferredNailDesign: string;
  preferredFoundation: string;
  preferredEyeStyle: string;
  preferredLipStyle: string;
  dialogues: {
    arrival: string;
    excited: string;
    happy: string;
    neutral: string;
    disappointed: string;
  };
  isVIP: boolean;
  challengeType: ChallengeType;
  tipMultiplier: number;
  starColor: string;
};

export const CUSTOMERS: Customer[] = [
  {
    id: "sophie",
    name: "Sophie",
    emoji: "👰",
    title: "The Blushing Bride",
    personality: "Nervous & Sweet",
    backstory: "Sophie is getting married tomorrow! She's been dreaming of her perfect wedding look for years. Every detail matters.",
    emotion: "nervous",
    preferredColors: ["nude", "blush", "white"],
    preferredHairStyle: "updo",
    preferredNailDesign: "french",
    preferredFoundation: "natural",
    preferredEyeStyle: "natural",
    preferredLipStyle: "glossy",
    dialogues: {
      arrival: "Oh gosh, I'm getting married TOMORROW! I need to look absolutely perfect! 💍",
      excited: "I can't believe how beautiful this is turning out!",
      happy: "You've made me feel like a princess! Thank you so much! ✨",
      neutral: "It's... nice. I hope it photographs well...",
      disappointed: "I was hoping for something a bit more... bridal?"
    },
    isVIP: false,
    challengeType: "bridal",
    tipMultiplier: 1.5,
    starColor: "#FFD700"
  },
  {
    id: "luna",
    name: "Luna",
    emoji: "🌟",
    title: "The Pop Sensation",
    personality: "Bold & Fabulous",
    backstory: "Luna is filming her new music video this weekend. It's going to be streamed globally. She needs a look that POPS on camera!",
    emotion: "excited",
    preferredColors: ["hot pink", "electric blue", "gold"],
    preferredHairStyle: "waves",
    preferredNailDesign: "art",
    preferredFoundation: "glowy",
    preferredEyeStyle: "dramatic",
    preferredLipStyle: "bold",
    dialogues: {
      arrival: "I need to SLAY for my music video! My fans are counting on me! 🎵",
      excited: "YES! This is giving me all the pop star energy!",
      happy: "I'm obsessed! My fans are going to absolutely love this look! 🎤",
      neutral: "It's giving... more background dancer than lead vocalist.",
      disappointed: "This is not the main character energy I was going for..."
    },
    isVIP: true,
    challengeType: "celebrity",
    tipMultiplier: 2.0,
    starColor: "#FF69B4"
  },
  {
    id: "emma",
    name: "Emma",
    emoji: "👩‍💼",
    title: "The Power Executive",
    personality: "Professional & Precise",
    backstory: "Emma has the most important board meeting of her career in two hours. She needs a polished, authoritative look.",
    emotion: "impatient",
    preferredColors: ["burgundy", "nude", "brown"],
    preferredHairStyle: "straight",
    preferredNailDesign: "plain",
    preferredFoundation: "matte",
    preferredEyeStyle: "natural",
    preferredLipStyle: "matte",
    dialogues: {
      arrival: "I have a board meeting in two hours. I need to look powerful. Let's be efficient. ⏰",
      excited: "Efficient AND beautiful. Perfect.",
      happy: "Exactly what I needed. Confident, professional, in control. 💼",
      neutral: "I suppose it's adequate for the meeting.",
      disappointed: "This is too casual. I need to command a room, not a brunch."
    },
    isVIP: false,
    challengeType: "classic",
    tipMultiplier: 1.2,
    starColor: "#8B0000"
  },
  {
    id: "zara",
    name: "Zara",
    emoji: "📸",
    title: "The Social Influencer",
    personality: "Trendy & Demanding",
    backstory: "Zara has a major brand deal photoshoot today. 2 million followers are watching — everything must be Instagram-perfect.",
    emotion: "demanding",
    preferredColors: ["coral", "peach", "rose gold"],
    preferredHairStyle: "waves",
    preferredNailDesign: "gradient",
    preferredFoundation: "dewy",
    preferredEyeStyle: "colorful",
    preferredLipStyle: "glossy",
    dialogues: {
      arrival: "Hi! My feed needs to be PERFECT. My audience expects nothing but the best! 📱",
      excited: "Omg this is literally so aesthetic! Very main character!",
      happy: "This is SO posting this! Viral for sure! ✨💅",
      neutral: "It's cute I guess... might need a filter though.",
      disappointed: "This is giving very 2019 vibes. Not in a good way."
    },
    isVIP: true,
    challengeType: "fashion",
    tipMultiplier: 1.8,
    starColor: "#FF7F50"
  },
  {
    id: "rose",
    name: "Grandma Rose",
    emoji: "🌹",
    title: "The Beloved Nana",
    personality: "Sweet & Grateful",
    backstory: "Rose's granddaughter is getting married! She wants to look beautiful in the family photos. Such a precious occasion!",
    emotion: "sweet",
    preferredColors: ["lavender", "pink", "cream"],
    preferredHairStyle: "curls",
    preferredNailDesign: "french",
    preferredFoundation: "natural",
    preferredEyeStyle: "natural",
    preferredLipStyle: "natural",
    dialogues: {
      arrival: "My granddaughter is getting married! I want to look beautiful for her big day. 🌸",
      excited: "Oh my, I haven't felt this beautiful in years!",
      happy: "My granddaughter will be so pleased! You're an angel, dear! 💕",
      neutral: "It's very sweet, dear. My granddaughter will love it no matter what.",
      disappointed: "Oh... perhaps something a bit more grandmother-appropriate?"
    },
    isVIP: false,
    challengeType: "classic",
    tipMultiplier: 1.0,
    starColor: "#DDA0DD"
  },
  {
    id: "priya",
    name: "Priya",
    emoji: "🎭",
    title: "The Bollywood Star",
    personality: "Dramatic & Glamorous",
    backstory: "Priya is starring in a major Bollywood film premiere tonight! Hundreds of cameras, millions of viewers. Go BIG or go home!",
    emotion: "dramatic",
    preferredColors: ["red", "gold", "deep purple"],
    preferredHairStyle: "curls",
    preferredNailDesign: "art",
    preferredFoundation: "glowy",
    preferredEyeStyle: "dramatic",
    preferredLipStyle: "bold",
    dialogues: {
      arrival: "Darling, I need glamour! Opulence! Tonight I must outshine every star in Bollywood! ✨",
      excited: "Yes! MORE sparkle! MORE drama! This is my destiny!",
      happy: "Perfection! I look like the goddess I was always meant to be! 🌟",
      neutral: "It's... fine. But fine is not my brand.",
      disappointed: "This is a film premiere, not a trip to the market, darling."
    },
    isVIP: true,
    challengeType: "celebrity",
    tipMultiplier: 2.5,
    starColor: "#FFD700"
  },
  {
    id: "lily",
    name: "Lily",
    emoji: "🌸",
    title: "The Hopeless Romantic",
    personality: "Shy & Sweet",
    backstory: "Lily has her first date in THREE years tonight! She wants to look naturally beautiful — not overdone, just perfectly herself.",
    emotion: "nervous",
    preferredColors: ["blush", "peach", "nude"],
    preferredHairStyle: "waves",
    preferredNailDesign: "plain",
    preferredFoundation: "natural",
    preferredEyeStyle: "natural",
    preferredLipStyle: "glossy",
    dialogues: {
      arrival: "First date in forever... I just want to look like myself, but like, the BEST version? 🥺",
      excited: "Oh! I actually love this! It's so me!",
      happy: "He's going to think I look beautiful. Thank you for giving me confidence! 💗",
      neutral: "It's sweet... maybe a little safe? Like me.",
      disappointed: "I feel like I'm wearing a costume... not myself."
    },
    isVIP: false,
    challengeType: "classic",
    tipMultiplier: 1.1,
    starColor: "#FFB6C1"
  },
  {
    id: "victoria",
    name: "Victoria",
    emoji: "👑",
    title: "The High Society Queen",
    personality: "Exacting & Refined",
    backstory: "Victoria is the most influential socialite in the city. Her annual charity gala is tonight. Every detail will be photographed and judged.",
    emotion: "demanding",
    preferredColors: ["champagne", "ivory", "gold"],
    preferredHairStyle: "updo",
    preferredNailDesign: "french",
    preferredFoundation: "dewy",
    preferredEyeStyle: "smoky",
    preferredLipStyle: "matte",
    dialogues: {
      arrival: "I attend 47 galas per year. I know exactly what I want. Please don't disappoint me. 💎",
      excited: "...I'm impressed. That's not a word I use lightly.",
      happy: "Exquisite. Precisely right. I may become a regular. 💎",
      neutral: "Acceptable. Not exceptional, but acceptable.",
      disappointed: "This is not quite the standard I'm accustomed to."
    },
    isVIP: true,
    challengeType: "fashion",
    tipMultiplier: 3.0,
    starColor: "#F5F5DC"
  },
  {
    id: "maya",
    name: "Maya",
    emoji: "🎨",
    title: "The Creative Soul",
    personality: "Artistic & Adventurous",
    backstory: "Maya is opening her first art exhibition tomorrow. She wants a look as bold and unconventional as her art — something that makes a statement!",
    emotion: "excited",
    preferredColors: ["electric blue", "purple", "emerald"],
    preferredHairStyle: "braided",
    preferredNailDesign: "art",
    preferredFoundation: "matte",
    preferredEyeStyle: "colorful",
    preferredLipStyle: "bold",
    dialogues: {
      arrival: "I want to look like living artwork! Unexpected! Vibrant! Conversation-starting! 🎨",
      excited: "This is GENIUS! You're an artist too!",
      happy: "Perfect! I'll be the most talked-about person at my own exhibition! 🖼️",
      neutral: "It's interesting. But I wanted to really take risks...",
      disappointed: "This is a bit too... conventional for my taste."
    },
    isVIP: false,
    challengeType: "fashion",
    tipMultiplier: 1.3,
    starColor: "#9370DB"
  },
  {
    id: "taylor",
    name: "Taylor",
    emoji: "🎸",
    title: "The Rock Star",
    personality: "Edgy & Fierce",
    backstory: "Taylor's band just got their big break! First major festival performance tonight in front of 50,000 people. Time to look LEGENDARY.",
    emotion: "excited",
    preferredColors: ["black", "red", "silver"],
    preferredHairStyle: "straight",
    preferredNailDesign: "art",
    preferredFoundation: "matte",
    preferredEyeStyle: "smoky",
    preferredLipStyle: "bold",
    dialogues: {
      arrival: "Fifty thousand fans tonight. I need to look like I was BORN for this stage! 🎸",
      excited: "YES! This is giving me rock goddess energy!",
      happy: "The crowd is going to LOSE IT when they see me! This is perfect! 🤘",
      neutral: "Hmm... could be edgier. I want to look dangerous.",
      disappointed: "This is more coffee shop than rock festival, honestly."
    },
    isVIP: false,
    challengeType: "celebrity",
    tipMultiplier: 1.7,
    starColor: "#DC143C"
  },
  {
    id: "isabelle",
    name: "Isabelle",
    emoji: "🤰",
    title: "The Radiant Mom-to-Be",
    personality: "Glowing & Grateful",
    backstory: "Isabelle is 8 months pregnant and attending her baby shower! She wants to feel beautiful and radiant during this special time.",
    emotion: "happy",
    preferredColors: ["mint", "baby blue", "soft yellow"],
    preferredHairStyle: "waves",
    preferredNailDesign: "plain",
    preferredFoundation: "natural",
    preferredEyeStyle: "natural",
    preferredLipStyle: "glossy",
    dialogues: {
      arrival: "Baby shower time! I want to glow — for me AND my little one! 🍼",
      excited: "I feel so beautiful! Baby must be loving all this pampering!",
      happy: "This is the most beautiful I've felt in months! Thank you! 👶💕",
      neutral: "Comfy and pretty. That's all I really need right now.",
      disappointed: "Hmm, I was hoping to feel a bit more special today."
    },
    isVIP: false,
    challengeType: "classic",
    tipMultiplier: 1.2,
    starColor: "#98FB98"
  },
  {
    id: "cleo",
    name: "Cleo",
    emoji: "🏆",
    title: "The Champion Athlete",
    personality: "Competitive & Confident",
    backstory: "Cleo just won the national gymnastics championship! She's going straight from the competition to the victory press conference.",
    emotion: "excited",
    preferredColors: ["gold", "royal blue", "white"],
    preferredHairStyle: "straight",
    preferredNailDesign: "french",
    preferredFoundation: "dewy",
    preferredEyeStyle: "natural",
    preferredLipStyle: "glossy",
    dialogues: {
      arrival: "National champion! I need to look like a winner for the cameras! 🥇",
      excited: "I'm going to look amazing in those press photos!",
      happy: "Gold medal AND perfect makeup — today is my day! 🏆✨",
      neutral: "It works. I need to get to the press conference.",
      disappointed: "I was hoping to look more... victorious?"
    },
    isVIP: false,
    challengeType: "classic",
    tipMultiplier: 1.4,
    starColor: "#4169E1"
  },
  {
    id: "diana",
    name: "Diana",
    emoji: "💼",
    title: "The Entrepreneur",
    personality: "Sharp & Ambitious",
    backstory: "Diana is pitching to investors for her startup tomorrow. She needs to exude confidence, innovation, and trustworthiness.",
    emotion: "impatient",
    preferredColors: ["navy", "white", "teal"],
    preferredHairStyle: "straight",
    preferredNailDesign: "plain",
    preferredFoundation: "matte",
    preferredEyeStyle: "natural",
    preferredLipStyle: "matte",
    dialogues: {
      arrival: "Pitch deck: done. Product demo: done. Now I need to look like a billion-dollar idea. 💰",
      excited: "This communicates exactly the right message!",
      happy: "Smart, modern, confident. This is worth investing in. 🚀",
      neutral: "It's professional. Gets the job done.",
      disappointed: "This reads more 'employee' than 'founder.'"
    },
    isVIP: false,
    challengeType: "classic",
    tipMultiplier: 1.3,
    starColor: "#008080"
  },
  {
    id: "paris",
    name: "Paris",
    emoji: "🗼",
    title: "The Fashion Designer",
    personality: "Avant-garde & Sophisticated",
    backstory: "Paris is debuting her new couture collection at Paris Fashion Week. Her look must perfectly complement her designs.",
    emotion: "dramatic",
    preferredColors: ["crimson", "black", "ivory"],
    preferredHairStyle: "updo",
    preferredNailDesign: "art",
    preferredFoundation: "matte",
    preferredEyeStyle: "dramatic",
    preferredLipStyle: "bold",
    dialogues: {
      arrival: "Fashion Week waits for no one! My look must be haute couture perfection! 🗼",
      excited: "Magnifique! This is truly couture!",
      happy: "You understand beauty. This is everything — the whole look, total harmony! ✨",
      neutral: "Hmm. There are elements I like. Others... less so.",
      disappointed: "Non, non, non. This is prêt-à-porter at best."
    },
    isVIP: true,
    challengeType: "fashion",
    tipMultiplier: 2.2,
    starColor: "#8B0000"
  },
  {
    id: "honey",
    name: "Honey",
    emoji: "🍯",
    title: "The Sweet Influencer",
    personality: "Bubbly & Positive",
    backstory: "Honey runs the most popular beauty YouTube channel for kids! She's filming her 1 million subscriber special video today!",
    emotion: "excited",
    preferredColors: ["yellow", "pink", "orange"],
    preferredHairStyle: "curls",
    preferredNailDesign: "art",
    preferredFoundation: "natural",
    preferredEyeStyle: "colorful",
    preferredLipStyle: "glossy",
    dialogues: {
      arrival: "ONE MILLION SUBSCRIBERS! This has to be the most magical video ever! 🎉",
      excited: "Oh my gosh, I love it SO much! My subscribers are going to DIE!",
      happy: "You just made my 1M special even MORE special! Thank you! 💛",
      neutral: "It's really cute! My subscribers will love it!",
      disappointed: "Oh... it's okay! I can work with it! (mostly)"
    },
    isVIP: false,
    challengeType: "classic",
    tipMultiplier: 1.4,
    starColor: "#FFD700"
  },
  {
    id: "stella",
    name: "Stella",
    emoji: "⭐",
    title: "The Rising Actress",
    personality: "Ambitious & Bright",
    backstory: "Stella just landed her first leading role in a Hollywood film! Tonight is the casting announcement party — her Hollywood debut!",
    emotion: "excited",
    preferredColors: ["red", "gold", "champagne"],
    preferredHairStyle: "waves",
    preferredNailDesign: "french",
    preferredFoundation: "glowy",
    preferredEyeStyle: "smoky",
    preferredLipStyle: "bold",
    dialogues: {
      arrival: "I just got my FIRST Hollywood role! This party has to be unforgettable! ⭐",
      excited: "I look like a STAR! A real Hollywood star!",
      happy: "This is my Cinderella moment! You're my fairy godmother! 🌟",
      neutral: "I like it... is it movie-star enough though?",
      disappointed: "I need to look like I belong in Hollywood, not... a local commercial."
    },
    isVIP: false,
    challengeType: "celebrity",
    tipMultiplier: 1.6,
    starColor: "#FFD700"
  },
  {
    id: "mia",
    name: "Mia",
    emoji: "🎓",
    title: "The Graduate",
    personality: "Proud & Grateful",
    backstory: "After 6 years of medical school, Mia is FINALLY graduating today! Her whole family is flying in just to see her walk across that stage.",
    emotion: "happy",
    preferredColors: ["powder blue", "white", "gold"],
    preferredHairStyle: "straight",
    preferredNailDesign: "french",
    preferredFoundation: "natural",
    preferredEyeStyle: "natural",
    preferredLipStyle: "glossy",
    dialogues: {
      arrival: "Six years of med school and TODAY I finally graduate! Family's watching! 🎓",
      excited: "I'm going to cry! I look so grown up!",
      happy: "Dr. Mia! That's me! And I look the part! Thank you! 🩺✨",
      neutral: "Simple and elegant. Just like I wanted.",
      disappointed: "I wanted to look... I don't know, more like a doctor?"
    },
    isVIP: false,
    challengeType: "classic",
    tipMultiplier: 1.1,
    starColor: "#87CEEB"
  },
  {
    id: "ruby",
    name: "Ruby",
    emoji: "💎",
    title: "The Gem Heiress",
    personality: "Ultra VIP",
    backstory: "Ruby is the heiress to a global diamond empire. She travels with her own entourage. The finest things only — settling is not in her vocabulary.",
    emotion: "demanding",
    preferredColors: ["ruby red", "diamond white", "sapphire blue"],
    preferredHairStyle: "updo",
    preferredNailDesign: "art",
    preferredFoundation: "dewy",
    preferredEyeStyle: "dramatic",
    preferredLipStyle: "bold",
    dialogues: {
      arrival: "I'm accustomed to the finest salons in Milan, Paris, and Tokyo. Impress me. 💎",
      excited: "...This is extraordinary. You have genuine talent.",
      happy: "Remarkable. Truly world-class work. I'll be back — and I'll bring my friends. 💍",
      neutral: "Passable. Not my best experience, but not my worst.",
      disappointed: "I expected more. Much more."
    },
    isVIP: true,
    challengeType: "celebrity",
    tipMultiplier: 5.0,
    starColor: "#E0115F"
  },
  {
    id: "joy",
    name: "Joy",
    emoji: "🎈",
    title: "The Birthday Girl",
    personality: "Joyful & Carefree",
    backstory: "It's Joy's 30th birthday and she's throwing herself the party she always deserved! She just wants to look absolutely fabulous and have fun!",
    emotion: "excited",
    preferredColors: ["hot pink", "purple", "sparkle gold"],
    preferredHairStyle: "curls",
    preferredNailDesign: "art",
    preferredFoundation: "glowy",
    preferredEyeStyle: "colorful",
    preferredLipStyle: "glossy",
    dialogues: {
      arrival: "IT'S MY BIRTHDAY and I'm determined to be the most glamorous 30-year-old EVER! 🎂",
      excited: "YES! YES! YES! I'm OBSESSED!",
      happy: "Best birthday present I could give myself! I look AMAZING! 🎉",
      neutral: "Cute! Anything with glitter is a win honestly.",
      disappointed: "I mean... it's fine? It's my birthday so I'll smile anyway!"
    },
    isVIP: false,
    challengeType: "classic",
    tipMultiplier: 1.3,
    starColor: "#FF69B4"
  },
  {
    id: "aurora",
    name: "Aurora",
    emoji: "🌅",
    title: "The Runway Model",
    personality: "Ethereal & Precise",
    backstory: "Aurora has walked runways in 15 countries. She's being photographed for a major fashion magazine cover — every angle, every shadow matters.",
    emotion: "impatient",
    preferredColors: ["dusty rose", "sage", "terracotta"],
    preferredHairStyle: "straight",
    preferredNailDesign: "gradient",
    preferredFoundation: "dewy",
    preferredEyeStyle: "natural",
    preferredLipStyle: "matte",
    dialogues: {
      arrival: "Magazine cover shoot in 45 minutes. I know my angles. Make me editorial. 📷",
      excited: "This reads perfectly on camera. Well done.",
      happy: "This is the cover shot. I can feel it. Stunning work. ✨",
      neutral: "Technically correct. Somewhat safe though.",
      disappointed: "This doesn't have the editorial edge I need."
    },
    isVIP: true,
    challengeType: "fashion",
    tipMultiplier: 2.8,
    starColor: "#BC8F8F"
  },
];

export function getCustomerById(id: string): Customer {
  return CUSTOMERS.find(c => c.id === id) ?? CUSTOMERS[0];
}

export function getVIPCustomers(): Customer[] {
  return CUSTOMERS.filter(c => c.isVIP);
}

export function getCustomersByChallenge(type: ChallengeType): Customer[] {
  return CUSTOMERS.filter(c => c.challengeType === type);
}
