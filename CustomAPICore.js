/* =========================================================
   COMMAND REFERENCE AND QUICK GUIDE
   =========================================================

   This file powers your fun daily commands!

   HOW IT WORKS:
   ---------------------------------------------------------
   • Each "type" (like beard, mila, boop, etc.) gives a 
     daily result that changes every 24 hours (UK time).

   • The result is based on a mix of username + date.
     This means it’s random-looking, but the same user
     gets the same answer all day — no data is stored.

   ---------------------------------------------------------
   UNDERSTANDING THE STRUCTURE
   ---------------------------------------------------------

   Each command or type has a simple format like this:
   mila: { min: 0, max: 100, levels: [30, 70], label: "Mila loves you" }

   Here’s what those parts mean:
   - min: the lowest number it can generate (0%)
   - max: the highest number it can generate (100%)
   - levels: the cutoff points for jokes
       Example: [30, 70]
         → 0–30 = low
         → 31–70 = medium
         → 71–100 = high
   - label: what text appears in the sentence
       Example output:
       "@user, Mila loves you 82% today!"

   ---------------------------------------------------------
   CONST SECTIONS (main parts of the code)
   ---------------------------------------------------------
   • const stats → measures (beard, hair, pp)
   • const love → love/affection for animals/people/objects (mila, ivy, theo, fluffy)
   • const hate → mirrors love, shows how much something hates you
   • const personality → personality-based values (daddy, pirate, nerd, etc.)
   • const skills → precision/accuracy/luck/focus/flirting
   • const interactions → actions between two people (hug, boop, slap, etc.)
   • const jokes → contains joke messages for each type and category
   • const specialUsers → custom fixed messages for certain names

   ---------------------------------------------------------
   ADDING A NEW COMMAND
   ---------------------------------------------------------
   1. Add a new entry under the right section (stats, love, hate, personality, skills, interactions)
   2. Add jokes for it under const jokes (optional)
   3. No other code changes needed — it works automatically!

   ---------------------------------------------------------
   EXAMPLE LINKS (for StreamElements)
   ---------------------------------------------------------
   • Single user command:
     ${customapi.https://yourusername.onrender.com?sender=${sender}&type=beard&jokes=true}

   • Targeted command (sender + user):
     ${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=boop&jokes=false}
---------------------------------------------------------
---------------------------------------------------------
   EXAMPLE LINKS (for Fossabot)
   ---------------------------------------------------------
   • Single user command:
     $(customapi https://yourusername.onrender.com?sender=${sender}&type=beard&jokes=true)

   • Targeted command (sender + user):
     $(customapi https://yourusername.onrender.com?sender=${sender}&user=${user}&type=boop&jokes=false)
---------------------------------------------------------*/
import express from "express";
import crypto from "crypto";

const app = express();
const TIMEZONE = "Europe/London";

// ===========================================
// 🚫 HELPERS
// ===========================================

// Generate a deterministic daily value based on seed, offset, and user
function generateValue(seed, offset, max, min = 0, user = "") {
const hash = crypto.createHash("md5").update(seed + offset + user).digest("hex");
const num = parseInt(hash.slice(0, 8), 16);
return (num % (max - min + 1)) + min;
}

// Pick a random element from an array
function pickRandom(arr) {
return arr[Math.floor(Math.random() * arr.length)];
}

// Check if jokes are enabled (global or per-type)
function isJokeEnabled(req, type) {
const global = req.query.jokes;
if (global === "false") return false;
if (global === "true") return true;

const specific = req.query[`joke_${type}`];
if (specific === "false") return false;
if (specific === "true") return true;

return true; // default to enabled
}

// Get a joke string for a given category and value (scales automatically)
function getJoke(req, type, value) {
  if (!isJokeEnabled(req, type)) return "";
  const cfg =
    (stats && stats[type]) ||
    (personality && personality[type]) ||
    (piracy && piracy[type]) ||
    null;
  if (!cfg || !cfg.levels) return "";

  const [lowThreshold, highThreshold] = cfg.levels;
  let level = "high"; // default to high
  if (value <= lowThreshold) level = "low";
  else if (value <= highThreshold) level = "medium";

  if (!jokes[type] || !jokes[type][level]) return "";
  return " " + pickRandom(jokes[type][level]);
}

// Format a username: remove @ and lowercase for internal use
function cleanUsername(name = "") {
return name.replace(/^@/, "").toLowerCase();
}

// Format a username for display: always start with @
function formatDisplayName(name = "") {
return name.startsWith("@") ? name : `@${name}`;
}

// Optional space before a unit
function spaceIf(unitSpace) {
return unitSpace ? " " : "";
}

// ===========================================
// 🎮 MINI GAMES
// ===========================================

const miniGames = {
rps: rockPaperScissors,
tugofwar: tugOfWar,
diceroll: diceRoll,
coinflip: coinFlip,
rpsls: rpsls,
highorlow: highOrLow,
};

// Rock Paper Scissors
function rockPaperScissors(sender, target) {
  const choices = ["rock", "paper", "scissors"];
  const senderMove = pickRandom(choices); // Bot decides the sender's move
  const targetMove = pickRandom(choices); // Bot decides the target's move

  if (senderMove === targetMove) {
    return `${sender}, it's a tie with ${target}! Both chose ${senderMove}. Looks like you're equally matched! Maybe next time you'll win... or not. 😅`;
  }
  if (
    (senderMove === "rock" && targetMove === "scissors") ||
    (senderMove === "paper" && targetMove === "rock") ||
    (senderMove === "scissors" && targetMove === "paper")
  ) {
    return `${sender} wins! ${senderMove} beats ${targetMove}. Victory is sweet... but remember, don't get cocky! 😎`;
  }
  return `${target} wins! ${targetMove} beats ${senderMove}. Oof, that’s gotta hurt! Better luck next time! 😂`;
}

// Tug of War
function tugOfWar(sender, target) {
  const senderStrength = Math.floor(Math.random() * 100);
  const targetStrength = Math.floor(Math.random() * 100);

  if (senderStrength > targetStrength) {
    return `${sender} wins! They pulled with ${senderStrength} strength, while ${target} pulled with ${targetStrength}. Looks like you're the stronger one! 💪`;
  } else if (senderStrength < targetStrength) {
    return `${target} wins! They pulled with ${targetStrength} strength, while ${sender} pulled with ${senderStrength}. Ouch, looks like someone skipped leg day! 😂`;
  } else {
    return `It's a tie! Both ${sender} and ${target} pulled with ${senderStrength} strength. A real stalemate! 😅`;
  }
}

// Dice Roll
function diceRoll(sender, target) {
  const senderRoll = Math.floor(Math.random() * 6) + 1;
  const targetRoll = Math.floor(Math.random() * 6) + 1;

  if (senderRoll > targetRoll) {
    return `${sender} wins! They rolled a ${senderRoll}, and ${target} rolled a ${targetRoll}. Lucky roll! 🍀`;
  } else if (senderRoll < targetRoll) {
    return `${target} wins! They rolled a ${targetRoll}, and ${sender} rolled a ${senderRoll}. Better luck next time, dice are cruel! 🎲`;
  } else {
    return `It's a tie! Both ${sender} and ${target} rolled a ${senderRoll}. A roll of destiny! 🤔`;
  }
}

// Coin Flip
function coinFlip(sender, target) {
  const result = Math.random() < 0.5 ? "Heads" : "Tails";

  if (sender.toLowerCase() === result.toLowerCase()) {
    return `${sender} wins! The coin landed on ${result}. Heads or tails, it’s your lucky day! 🍀`;
  } else {
    return `${target} wins! The coin landed on ${result}. Looks like luck wasn't on your side this time! 😅`;
  }
}

// Rock Paper Scissors Lizard Spock (RPSLS)
function rpsls(sender, target) {
  const choices = ["rock", "paper", "scissors", "lizard", "spock"];
  const winConditions = {
    rock: ["scissors", "lizard"],
    paper: ["rock", "spock"],
    scissors: ["paper", "lizard"],
    lizard: ["spock", "paper"],
    spock: ["rock", "scissors"]
  };

  const senderMove = pickRandom(choices);
  const targetMove = pickRandom(choices);

  if (senderMove === targetMove) {
    return `${sender}, it's a tie with ${target}! Both chose ${senderMove}. A cosmic stalemate! 🌌`;
  }

  if (winConditions[senderMove].includes(targetMove)) {
    return `${sender} wins! ${senderMove} beats ${targetMove}. Oh, you’re the true master of the universe! 💥`;
  } else {
    return `${target} wins! ${targetMove} beats ${senderMove}. Looks like they outsmarted you this time! 🤔`;
  }
}

// High or Low
function highOrLow(sender, target) {
  const secretNumber = Math.floor(Math.random() * 100) + 1;
  let result = "";

  if (sender.toLowerCase() === "higher" && secretNumber > 50) {
    result = `${sender} wins! The secret number was ${secretNumber}, which is higher than 50. Call it a win for your intuition! 🔮`;
  } else if (sender.toLowerCase() === "lower" && secretNumber <= 50) {
    result = `${sender} wins! The secret number was ${secretNumber}, which is lower than 50. Looks like you have the magic touch! ✨`;
  } else {
    result = `${target} wins! The secret number was ${secretNumber}, and ${sender} guessed wrong. Better luck next time! 🎯`;
  }

  return result;
}

// ===========================================
// 👑 SPECIAL USERS
// ===========================================

const specialUsers = {
  username1: {
    hair: "@username, your hair is the longest ever!",
  },
  username2: {
    pet1: "username2, pet2 loves your face!",
  },
};

// ===========================================
// 📊 STATS
// ===========================================

const stats = {
beard: { min: 1, max: 30, levels: [5, 15], unit: "cm", label: "beard", unitSpace: false },
hair: { min: 10, max: 100, levels: [20, 60], unit: "cm", label: "hair", unitSpace: false },
pp: { min: 4, max: 15, levels: [6, 10], unit: "inches", label: "pp", unitSpace: false },
bb: {
label: "boob size",
type: "bra", // custom type flag for special generation
bands: [30, 32, 34, 36, 38, 40, 42],
cups: ["A", "B", "C", "D", "DD", "E", "F"],
unitSpace: false
},
};                                 

// ===========================================
// ❤️ LOVE
// ===========================================

const love = {
pet1: { min: 0, max: 100, levels: [30, 70], label: "Pet1 loves you", unit: "%", unitSpace: false },
pet2: { min: 0, max: 100, levels: [30, 70], label: "Pet2 loves you", unit: "%", unitSpace: false },
person1: { min: 0, max: 100, levels: [30, 70], label: "Person1 loves you", unit: "%", unitSpace: false },
person2: { min: 0, max: 100, levels: [30, 70], label: "Person2 loves you", unit: "%", unitSpace: false },
};

// ===========================================
// NOTE: DO NOT HAVE DUPLICATED VALUES. 
// Pet1 CAN NOT BE IN LOVE AND HATE 
// SEPERATE AS FOLLOWS
// pe1love AND pet1hate 
// EXAMPLE COMMAND! 
// !pet1love "Pet1 loves you 70% today!"
// !pet1hate "Pet1 hates you 70% today!"
// ===========================================

// ===========================================
// 💔 HATE
// ===========================================

const hate = {
  pet1: { min: 0, max: 100, levels: [30, 70], label: "Pet1 hates you", unit: "%", unitSpace: false },
  pet2: { min: 0, max: 100, levels: [30, 70], label: "Pet2 hates you", unit: "%", unitSpace: false },
  person1: { min: 0, max: 100, levels: [30, 70], label: "Person1 hates you", unit: "%", unitSpace: false },
  person2: { min: 0, max: 100, levels: [30, 70], label: "Person2 hates you", unit: "%", unitSpace: false },
};

// ===========================================
// 🧠 PERSONALITY
// ===========================================

const personality = {
  butt: { min: 0, max: 100, levels: [30, 70], label: "butt fruitiness", unit: "%", unitSpace: false },
  daddy: { min: 0, max: 100, levels: [30, 70], label: "daddy level", unit: "%", unitSpace: false },
  fox: { min: 0, max: 100, levels: [30, 70], label: "fox level", unit: "%", unitSpace: false },
  goodgirl: { min: 0, max: 100, levels: [30, 70], label: "good girl level", unit: "%", unitSpace: false },
  nerd: { min: 0, max: 100, levels: [30, 70], label: "nerd level", unit: "%", unitSpace: false },
  pirate: { min: 0, max: 100, levels: [30, 70], label: "pirate power", unit: "%", unitSpace: false },
  princess: { min: 0, max: 100, levels: [30, 70], label: "princess energy", unit: "%", unitSpace: false },
  swordlunge: { min: 0, max: 100, levels: [30, 70], label: "sword lunge effectiveness", unit: "%", unitSpace: false },
  flame: { min: 0, max: 100, levels: [30, 70], label: "flame love", unit: "%", unitSpace: false },
  tinkabell: { min: 0, max: 100, levels: [20, 60], label: "tinkabell level", unit: "%", unitSpace: false },
};

// ===========================================
// 🏋️ GYM STATS
// ===========================================

const gym = {
lift: { min: 0, max: 500, levels: [100, 300], label: "lifting power", unit: "kg", unitSpace: false },
run: { min: 0, max: 42, levels: [10, 25], label: "running distance", unit: "km", unitSpace: false },
sprint: { min: 0, max: 100, levels: [30, 70], label: "sprint speed", unit: "m/s", unitSpace: false },
deadlift: { min: 0, max: 500, levels: [100, 300], label: "deadlift weight", unit: "kg", unitSpace: false },
curl: { min: 0, max: 200, levels: [20, 80], label: "curl strength", unit: "kg", unitSpace: false },
row: { min: 0, max: 1000, levels: [100, 500], label: "rowing distance", unit: "m", unitSpace: false },
stretch: { min: 0, max: 100, levels: [30, 70], label: "flexibility", unit: "%", unitSpace: false },
};

// ===========================================
// 🏦 HOLD
// ===========================================

const hold = {
gold: { min: 0, max: 100, levels: [30, 70], label: "gold pouch", unit: "coins", unitSpace: true },
};

// ===========================================
// 💪 ACTIONS
// ===========================================

const actions = {
squeeze: { min: 0, max: 100, levels: [30, 70], label: "squeeze strength", unit: "%", unitSpace: true },
push: { min: 0, max: 100, levels: [30, 70], label: "push power", unit: "kg", unitSpace: true },
jump: { min: 0, max: 100, levels: [30, 70], label: "jump height", unit: "cm", unitSpace: true },
press: { min: 0, max: 100, levels: [30, 70], label: "press strength", unit: "kg", unitSpace: true },
kick: { min: 0, max: 100, levels: [30, 70], label: "kick power", unit: "%", unitSpace: true },
};

// ===========================================
// 😃 EMOTIONS & FEELINGS
// ===========================================

const emotions = {
happiness: { min: 0, max: 100, levels: [30, 70], label: "happiness", unit: "%", unitSpace: true },
anger: { min: 0, max: 100, levels: [30, 70], label: "anger level", unit: "%", unitSpace: false },
calmness: { min: 0, max: 100, levels: [30, 70], label: "calmness", unit: "%", unitSpace: true },
joy: { min: 0, max: 100, levels: [30, 70], label: "joy level", unit: "%", unitSpace: true },
excitement: { min: 0, max: 100, levels: [30, 70], label: "excitement", unit: "%", unitSpace: true },
energy: { min: 0, max: 100, levels: [30, 70], label: "energy level", unit: "%", unitSpace: false },
sleep: { min: 0, max: 100, levels: [30, 70], label: "sleep needed", unit: "%", unitSpace: false },
};

// ===========================================
// 🎯 SKILLS
// ===========================================

const skills = {
precision: { min: 0, max: 100, levels: [30, 70], label: "precision", unit: "%", unitSpace: false },
accuracy: { min: 0, max: 100, levels: [30, 70], label: "accuracy", unit: "%", unitSpace: false },
focus: { min: 0, max: 100, levels: [30, 70], label: "focus level", unit: "%", unitSpace: false },
flirting: { min: 0, max: 100, levels: [30, 70], label: "flirting skill", unit: "%", unitSpace: false },
luck: { min: 1, max: 10, levels: [3, 7], label: "luck roll", unit: "/10", unitSpace: false },
dj: { min: 1, max: 10, levels: [3, 7], label: "DJ skill level ", unit: "%", unitSpace: false },
};

// ===========================================
// 🤝 INTERACTIONS
// ===========================================

const interactions = [
"bonk",
"boop",
"fliptable",
"highfive",
"hug",
"kiss",
"love",
"pat",
"slap",
"spank",
"throwshoe",
];

// ===========================================
// 🎭 JOKES LIBRARY WITH EMOJIS
// ===========================================

const jokes = {
tinkabell: {
low: ["your fairy level is FUCKING DISGUSTING. 😂", "You shine bright like a diamond...covered in shit. 💩"],
medium: ["Your wings are growing. 🦋", "fairy training is starting to pay off. 💖"],
high: ["peter pan would be so proud. 🦸", "LOOK AT THAT PISS CURSE FLY. 🪄"],
},
fox: {
low: ["You are a sleepy fox today. 🦊", "Your tail is drooping a little. Maybe get some rest. 💤"],
medium: ["You are a curious fox exploring new burrows. 🔎", "Your cunning is showing today. 🦊"],
high: ["You are a sly fox stealing hearts and sandwiches. ❤️", "Everyone’s keeping an eye on you, clever fox. 👀"],
},
goodgirl: {
low: ["You might need a few more pats to reach your full potential. 🤔", "Trying, but could be better behaved today. 😅"],
medium: ["Doing well — you deserve a treat. 🍪", "A proper good girl performance today. 💕"],
high: ["Excellent! Gold star for best behavior. 🌟", "You’ve achieved maximum good girl mode. 👑"],
},
flame: {
low: ["Agent Flame sent you a cold shoulder today. ❄️", "The spark is weak — maybe light a match. 🔥"],
medium: ["Agent Flame nods in quiet approval. 👌", "There’s a warm glow between you and Flame. 🔥"],
high: ["Agent Flame can’t stop talking about you. 💬", "You are burning bright in Flame’s memory today. 🔥"],
},
sleep: {
low: ["You’re well-rested — alert and ready. 🦸", "You don’t need much sleep today. 😎"],
medium: ["You could use a nap later. 💤", "You’re doing fine, but bed is calling. 🛏️"],
high: ["You desperately need sleep. 😴", "Someone get you a pillow immediately. 🛌"],
},
beard: {
low: ["Patchy but proud! 😅", "Still in early access version. ⏳"],
medium: ["Solid beard game! 💪", "Respectable chin forest. 🌲"],
high: ["Wizard mode unlocked! 🧙‍♂️", "That beard tells stories of adventure. 📖"],
},
hair: {
low: ["Short and snappy! ✂️", "Buzzcut of confidence. 😎"],
medium: ["Perfect flow length! 💇", "Balanced and beautiful. 🌸"],
high: ["Rapunzel could never! 💇‍♀️", "That mane is a national treasure. 🇺🇸"],
},
pp: {
low: ["Compact and efficient! 🏋️‍♂️", "Fun-sized champion! 🏆"],
medium: ["Perfectly balanced. ⚖️", "Reliable and effective! 💪"],
high: ["Legendary proportions! 📏", "Folklore-worthy size! 📚"],
},
mila: {
low: ["Mila glanced and walked away. 🐾", "She tolerates your existence. 🐱"],
medium: ["Mila approves for now. 👍", "She blinked slowly. That is cat love. 💖"],
high: ["Mila purrs loudly in your honor! 😻", "Mila adores you. 🐾"],
},
ivy: {
low: ["Ivy is pretending you do not exist. 😒", "Denied cuddle privileges. ❌"],
medium: ["Ivy tolerates you. 🤔", "She let you exist in her space. 🏡"],
high: ["Ivy loves you unconditionally! 💚", "You are the chosen lap human! 🏆"],
},
theo: {
low: ["Theo is pretending you do not exist. 😤", "Theo left the room. 🏃‍♂️"],
medium: ["Theo tolerates you. 🤝", "Theo sat next to you. 🐾"],
high: ["Theo loves you unconditionally! 💙", "Theo will nap on you later. 💤"],
},
fluffy: {
low: ["Fluffy wagged half a tail. 🐾", "Fluffy is ignoring your messages. 💬"],
medium: ["Fluffy smiled a little. 😊", "Fluffy seems mildly impressed. 👀"],
high: ["Fluffy cannot stop purring! 🐱", "Fluffy thinks you are the best human! 🌟"],
},
daddy: {
low: ["Not very daddy today. 😬", "Maybe work on your confidence. 💪"],
medium: ["You are somewhat daddy. 👨", "The vibes are respectable. 👍"],
high: ["Certified DILF energy. 😎", "The room goes quiet when you enter. 🕴"],
},
pirate: {
low: ["You dropped your compass. 🧭", "Your ship is still in dock. 🚢"],
medium: ["You are swashbuckling nicely. ⚓", "The crew respects you. 👑"],
high: ["Captain material! 🏴‍☠️", "The seas whisper your name! 🌊"],
},
swordlunge: {
low: ["You tripped on the lunge. 🤦‍♂️", "Practice makes perfect. 💪"],
medium: ["A clean strike. ⚔️", "Your stance is strong. 💪"],
high: ["A masterful lunge! 🏆", "Your enemies tremble in fear! 😱"],
},
butt: {
low: ["Flat as a plank. 🚫", "Not much bounce today. 🛑"],
medium: ["Nice curve going! 🍑", "A respectable peach. 🍑"],
high: ["Legend status! 👑", "That is a certified fruit salad! 🥝"],
},
anger: {
low: ["Calm as a monk. 🧘", "You are chill today. 😌"],
medium: ["Mildly irritated. 😤", "Someone cut you off in traffic. 🚗"],
high: ["Rage incarnate! 😡", "Your keyboard fears for its life. ⌨️"],
},
princess: {
low: ["A little scruffy today. 👑", "Your tiara is crooked. 👑"],
medium: ["Graceful enough. 🌸", "A respectable royal presence. 👸"],
high: ["Royalty radiates from you! 👑", "All hail the majestic princess! 👑"],
},
nerd: {
low: ["Barely read one wiki today. 📚", "Low nerd output. 🤓"],
medium: ["Decent nerd energy. ⚡", "Glasses adjusted successfully. 👓"],
high: ["Big brain mode activated! 🤯", "You just debugged reality itself! 🖥️"],
},
bonk: {
low: ["That was more of a gentle tap than a bonk. 😅", "You missed completely. Try again. 🙃"],
medium: ["A solid bonk — respectably executed. 👊", "You gave a good bonk. Not too hard, not too soft. 🤜"],
high: ["That bonk echoed through the land! 🔊", "Maximum bonk achieved! Someone’s going to feel that. 😬"],
},
boop: {
low: ["A small, hesitant boop. 👃", "Barely a touch — shy booper detected. 🤭"],
medium: ["Boop executed successfully. 👏", "That was a decent boop. Nose contact confirmed. 👃"],
high: ["A powerful boop! 💥", "The world trembles before your booping power. 🌍"],
},
fliptable: {
low: ["You flipped a coaster instead of a table. 🍽️", "The table wobbled but didn’t flip. 😬"],
medium: ["Table flipped! Drinks everywhere. 🍸", "You flipped the table with respectable rage. 😤"],
high: ["That table didn’t stand a chance. ⚡", "Utter chaos. The table flew across the room. 💥"],
},
highfive: {
low: ["You missed the hand completely. 🙈", "Awkward air high-five. Maybe next time. ✋"],
medium: ["Nice contact! That was a proper high-five. 👏", "Crisp sound, solid form — approved. 👍"],
high: ["Perfect synchronization! That clap could summon thunder. ⚡", "Legendary high-five! Everyone felt that energy. 🔥"],
},
hug: {
low: ["A quick and slightly awkward hug. 😬", "You went for a hug, but it turned into a polite pat. 🤗"],
medium: ["A warm, friendly hug. 🫂", "That was a solid hug — not too tight, not too loose. 🤗"],
high: ["A bear hug that could break your bones! 🐻", "You’re enveloped in warmth and love. 🥰"],
},
kiss: {
low: ["You missed and kissed the air. 💨", "It was more of a smooch sound than an actual kiss. 💋"],
medium: ["A sweet little kiss. 😘", "You shared a proper kiss — charming work. 💖"],
high: ["That kiss could melt hearts. ❤️", "Romance level: professional. 💍"],
},
love: {
low: ["You tried to love, but it came out awkward. 😬", "Not feeling very affectionate today. 🤷‍♂️"],
medium: ["A healthy dose of love shared. 💌", "You spread a reasonable amount of love. 🌹"],
high: ["Overflowing with love and positivity! 💖", "You radiate pure affection today. ✨"],
},
pat: {
low: ["You missed and patted the air. 👋", "That pat was a bit weak, try again. 🙈"],
medium: ["A gentle and comforting pat. 🤗", "Perfect pat form. Well done. 👏"],
high: ["An excellent pat — pure serotonin. 🧠", "Your pats bring joy to all. 😻"],
},
slap: {
low: ["That was more of a light tap. 🤏", "You hesitated — weak slap detected. 🧐"],
medium: ["A solid slap. Just the right amount of sting. 👋", "You delivered a respectable slap. 👏"],
high: ["A thunderous slap heard across chat. ⚡", "That slap will be remembered forever. 🏆"],
},
spank: {
low: ["A shy and hesitant spank. 🙈", "You tried, but it barely registered. 💤"],
medium: ["A confident spank with good form. 💪", "That spank landed nicely — well done. 👏"],
high: ["A flawless spank. 10/10 execution. 👏", "You spanked like a pro — impressive work. 👑"],
},
throwshoe: {
low: ["You threw a slipper instead of a shoe. 🥿", "Missed completely. Shoe is lost forever. 🏃‍♂️"],
medium: ["Direct hit! That was a clean throw. 🎯", "You lobbed the shoe with respectable accuracy. 👟"],
high: ["Bullseye! The shoe hit perfectly. 🎯", "That throw could win the Olympics. 🥇"],
},
lift: {
low: ["You barely lifted it off the ground. 🏋️‍♂️", "That bar isn’t impressed yet. 😑"],
medium: ["Solid lift! Good form and focus. 💪", "You’re warming up nicely. 🔥"],
high: ["Beast mode activated! 💥", "That lift shook the gym! 🏋️‍♀️"],
},
run: {
low: ["You walked more than you ran. 🚶‍♂️", "A light jog counts, right? 🏃‍♂️"],
medium: ["Smooth stride and steady breathing. 🌬️", "You’re keeping a great pace! 🏃‍♀️"],
high: ["You sprinted like the wind! 🌪️", "Track star energy today! 🏅"],
},
sprint: {
low: ["More of a power walk than a sprint. 🚶‍♀️", "You tripped over enthusiasm. 🤸‍♂️"],
medium: ["Quick burst of energy! ⚡", "You dashed like you meant it! 🏃‍♂️"],
high: ["Lightning couldn’t keep up! ⚡", "You left dust trails behind! 🌪️"],
},
deadlift: {
low: ["That barbell didn’t move much. 🏋️‍♂️", "You gave it a polite tug. 🙃"],
medium: ["Solid lift! Muscles engaged. 💪", "Good pull with clean form. 🏋️‍♀️"],
high: ["Ground shaking deadlift! 🌍", "That was a personal best! 🏆"],
},
curl: {
low: ["Those curls need more conviction. 💪", "You lifted air with style. 🕺"],
medium: ["Nice pump forming! 💥", "Steady curl with proper form. 🏋️‍♂️"],
high: ["Biceps of steel! 🏋️‍♀️", "Those arms could crush walnuts! 🌰"],
},
row: {
low: ["You gently rocked the boat. 🚣‍♀️", "Barely moved the oars. 🌊"],
medium: ["Smooth rowing pace. ⛵", "Consistent strokes, nice rhythm. 🏆"],
high: ["You powered through the water! 🌊", "Rowing champion performance! 🏅"],
},
stretch: {
low: ["You reached halfway there. 🤸‍♂️", "Could use more bend next time. 🙆‍♀️"],
medium: ["Flexible and focused. 🧘‍♂️", "That stretch looked clean! 🧘‍♀️"],
high: ["Gymnast levels of flexibility! 🤸‍♀️", "You could join a yoga class! 🧘‍♀️"],
},
gold: {
low: ["Your pouch jingles modestly. 💰", "Not much shine in there today. 💸"],
medium: ["Your pouch feels a bit heavier. 🤑", "Steady earnings for a good day. 💵"],
high: ["Your pouch overflows with coins! 💰", "You could buy the tavern today! 🍻"],
},
squeeze: {
low: ["That’s the weakest handshake I’ve ever felt! 🖐️", "Barely a squeeze, try harder! 💪", "You could use a bit more grip strength. 🤲"],
medium: ["Not bad, you’re getting stronger! 💪", "Nice squeeze, a bit more power next time. 💥", "You're really getting the hang of it. 🖐️"],
high: ["You could crush a watermelon with that squeeze! 🍉", "Squeeze of a champion! 🏆", "Your grip is as strong as steel! 🔩"],
},
push: {
low: ["That push barely moved anything! 🛑", "You pushed, but the wall didn’t budge. 🧱", "Keep pushing, you’ll get stronger! 💪"],
medium: ["Nice push, you’ve got some power! 💥", "You're pushing the limits! 🚀", "Solid push, not bad at all. 👍"],
high: ["That push is like a bulldozer! 🚜", "You're pushing like a pro! 🏋️‍♂️", "That was a monster push! 💥"],
},
jump: {
low: ["That was more of a hop than a jump. 🐇", "You’re getting there, but not quite yet. ⬆️", "Not bad for a small jump! 🦘"],
medium: ["Great jump! You’re getting some air. 🏀", "Nice leap, you’re on your way. 🏃‍♂️", "Good jump, you're in the zone! 🔥"],
high: ["You jumped so high, you almost touched the stars! ✨", "You’ve got wings, my friend! 🕊️", "That was an Olympic-level jump! 🏅"],
},
press: {
low: ["You barely moved the barbell. 🏋️‍♂️", "That’s just a warm-up press. 💪", "You’re starting slow, but it’s okay. 🧘‍♂️"],
medium: ["Good press! You’ve got some solid form. 💪", "Nice press, you’re making progress. 📈", "You’re building some solid strength. 💥"],
high: ["That press could lift a truck! 🚚", "You’re pressing like a powerlifter! 🏋️‍♀️", "That press could break records! 🏆"],
},
kick: {
low: ["That was more of a gentle tap. 👢", "Not a kick, more like a nudge! 💨", "You need to put more force into that. ⚡"],
medium: ["Nice kick, good form! 👣", "Your kick’s getting stronger! 🦵", "Solid kick, you're improving. 💪"],
high: ["That kick would knock someone out cold! 🥋", "Your kick is unstoppable! 💥", "That kick would make a superhero proud! 💪"],
},
happiness: {
low: ["You might need a little more sunshine today! 🌥️", "Try smiling, it helps. 😊"],
medium: ["Not bad, a bit of a smile would help. 🙂", "You're halfway there, keep smiling. 😁"],
high: ["You're glowing with happiness today! 🌟", "You're the embodiment of joy right now! 😄"],
},
anger: {
low: ["Just a bit grumpy, huh? 😤", "You’re feeling a little off today. 😒"],
medium: ["You're getting there, but take a deep breath. 🌬️", "A little fire in your soul today. 🔥"],
high: ["You're ready to smash things, calm down! 🧨", "Easy there, Hulk. Let's take a breath. 😤"],
},
calmness: {
low: ["A bit stressed today? 😬", "Maybe a deep breath might help. 🧘‍♂️"],
medium: ["You're doing alright, deep breath. 🌿", "Keeping it together, not bad. 😌"],
high: ["You're the calmest person in the room right now. 😎", "Nothing can shake your calmness today. 🧘‍♀️"],
},
joy: {
low: ["Not feeling too joyful yet, huh? 🙁", "Try smiling and maybe some ice cream? 🍦"],
medium: ["You're getting there, keep the good vibes rolling. ✌️", "Things are looking brighter, huh? 🌞"],
high: ["You're radiating pure joy right now! 🌟", "Your joy could light up a whole city! 🏙️"],
},
excitement: {
low: ["Not much excitement today, maybe try something new? 🌱", "You're just waking up to the fun. 😴"],
medium: ["You're getting excited, just a little more! ⚡", "Some excitement is building up! 😆"],
high: ["You're practically bouncing with excitement! 🤩", "You’re so excited, it’s contagious! 😜"],
},
// Category-level jokes
love_group: {
low: ["barely noticed you today. 🙄", "is ignoring you again. 🤷‍♂️"],
medium: ["seems to like you okay. 🙂", "shared a little love. 💘"],
high: ["is obsessed with you today. 😍", "can't stop thinking about you. 💭"],
},
hate_group: {
low: ["barely annoyed with you. 😑", "shrugged it off. 🤷‍♀️"],
medium: ["gave you a dirty look. 😒", "is not impressed. 🙄"],
high: ["absolutely furious with you. 😡", "can't stand you today. 🤬"],
},
skills_group: {
low: ["Your aim is terrible today. 🎯", "Not very focused at all. 🤔"],
medium: ["You’re doing alright, could be sharper. 🧐", "Pretty decent performance. 👌"],
high: ["Perfect form and focus. 🏆", "You could teach others today. 🎓"],
},
dj: {
low: ["Your beats are so soft, even the plants are falling asleep. 🪴", "You just pressed play, right? Because that’s the loudest thing you’ve done today. 🔇", "Your DJ name should be ‘Volume: 1’. 🔉"],
medium: ["Not bad, you could drop a sick beat… if the speakers were louder. 🎶", "You’re halfway to headliner status… keep spinning! 🎧", "Your playlist is solid, just don’t forget to smile between tracks. 😊"],
high: ["Drop that bass! 🎧 The crowd didn’t know they needed it until now. 🎶", "You just turned the dance floor into a hurricane of awesome. 🌪️", "Your mixes are so fire, the fire extinguisher just ran out. 🔥"],
},
bb: {
low: ["A humble hero 😌", "Small but mighty 💕"],
medium: ["Perfectly balanced, as all things should be ✨", "Top-tier symmetry 💖"],
high: ["An absolute legend 😳", "That’s... gravitationally impressive 🌌"],
}
};

// ===========================================
// 🌟 MINI GAMES (GLOBAL)
// ===========================================

// ===========================================
// 💘 COMPATIBILITY CHECKER
// ===========================================

miniGames.compat = (senderRaw, userRaw) => {
const sender = cleanUsername(senderRaw);
const target = cleanUsername(userRaw);
const senderDisplay = formatDisplayName(senderRaw);
const targetDisplay = formatDisplayName(userRaw);

if (!userRaw || sender === target) {
return `${senderDisplay}, you can’t test compatibility with yourself 😅`;
}

const today = new Date().toLocaleDateString("en-GB");
const seed = `${today}-compat-${[sender, target].sort().join("-")}`;
const value = generateValue(seed, "compat", 100, 1, sender);

let message = "";

if (value >= 80) {
message = `💖 ${senderDisplay} and ${targetDisplay} are ${value}% compatible — almost soulmates!`;
} else if (value >= 60) {
message = `🔥 Sparks fly! ${senderDisplay} & ${targetDisplay} are ${value}% in sync.`;
} else if (value >= 40) {
message = `😬 ${senderDisplay} and ${targetDisplay} are only ${value}% compatible… could work with effort. 😅`;
} else {
message = `💔 ${senderDisplay} and ${targetDisplay} share ${value}% chemistry — better as friends.`;
}

return message;
};

// ===========================================
// ⚔️ PP DUEL
// ===========================================

miniGames.poduel = (senderRaw, userRaw) => {
const sender = cleanUsername(senderRaw);
const target = cleanUsername(userRaw);
const senderDisplay = formatDisplayName(senderRaw);
const targetDisplay = formatDisplayName(userRaw);

if (!userRaw || sender === target) {
return `${senderDisplay} tried to duel themselves… awkward. 😅`;
}

const today = new Date().toLocaleDateString("en-GB");
const seedSender = `${today}-pp-${sender}`;
const seedTarget = `${today}-pp-${target}`;

const cfg = stats.pp;
const senderPP = generateValue(seedSender, "pp", cfg.max, cfg.min, sender);
const targetPP = generateValue(seedTarget, "pp", cfg.max, cfg.min, target);

if (senderPP === targetPP) {
return `${senderDisplay} and ${targetDisplay} clashed in an epic PP duel… it’s a draw at ${senderPP} inches each! 🍆⚔️`;
}

const winner = senderPP > targetPP
? { name: senderDisplay, pp: senderPP }
: { name: targetDisplay, pp: targetPP };
const loser = senderPP > targetPP
? { name: targetDisplay, pp: targetPP }
: { name: senderDisplay, pp: senderPP };

const outcomes = [
`${winner.name} swung their PP with ${winner.pp} inches of fury, flattening ${loser.name}’s measly ${loser.pp} inch attempt! 🍆💥`,
`${loser.name} tried their best, but ${winner.name}’s ${winner.pp} inch weapon of mass distraction was too powerful. 🏆`,
`In a blinding flash, ${winner.name} defeated ${loser.name} — PP dominance secured (${winner.pp} vs ${loser.pp})! 💪🍆`,
`${loser.name} cried “It’s not the size that matters!” right before ${winner.name} proved it actually does (${winner.pp} vs ${loser.pp}). 😂`
];

return pickRandom(outcomes);
};

// ===========================================
// 🧠 MAIN CODE ROUTE
// ===========================================

const aspectsOfTheDay = { daddy: {}, pp: {}, bb: {}, princess: {}, goodgirl: {} }; // storage for "of the Day"
const lock = {}; // lock mechanism
const statCounters = {}; // { username: { command: count } }
const commandCounters = {}; // { command: totalCount }

app.get("/", (req, res) => {
const senderRaw = req.query.sender || req.query.user || "someone";
const userRaw = req.query.user || "";
const type = (req.query.type || "beard").toLowerCase();
const sender = cleanUsername(senderRaw);
const senderDisplay = formatDisplayName(senderRaw);
const targetDisplay = formatDisplayName(userRaw);
const today = new Date().toLocaleDateString("en-GB");

if (specialUsers[sender] && specialUsers[sender][type])
return res.send(specialUsers[sender][type]);

if (!lock[type]) lock[type] = false;
if (lock[type])
return res.send(`Please wait a moment, ${type} of the Day is being updated.`);

lock[type] = true;
try {
const seed = `${today}-${type}`;
let value, message = "";

// ===========================================
// 🏆 LEADERBOARD
// ===========================================

if (type === "leaderboard") {
const scope = (req.query.scope || "commands").toLowerCase();

if (scope === "users") {
const entries = Object.entries(statCounters)
.map(([user, stats]) => ({
user,
total: Object.values(stats).reduce((a, b) => a + b, 0),
}))
.sort((a, b) => b.total - a.total)
.slice(0, 5);

if (!entries.length) return res.send("No stats yet!");

const leaderboard = entries
.map((e, i) => `${i + 1}. @${e.user} - ${e.total} uses`)
.join(" | ");

return res.send(`🏆 Daily Leaderboard (users): ${leaderboard}`);
} else {
const entries = Object.entries(commandCounters)
.map(([cmd, count]) => ({ cmd, count }))
.sort((a, b) => b.count - a.count)
.slice(0, 5);

if (!entries.length) return res.send("No command stats yet!");

const leaderboard = entries
.map((e, i) => `${i + 1}. !${e.cmd} - ${e.count} uses`)
.join(" | ");

return res.send(`🏆 Daily Leaderboard (commands): ${leaderboard}`);
}
}

// ===========================================
// 🎮 MINI GAMES FUNCTION
// ===========================================

if (miniGames[type]) {
message = miniGames[type](senderRaw, userRaw);
return res.send(message);
}

// ===========================================
// 🍆 PP & PP OF THE DAY
// ===========================================

if (type === "pp") {
const cfg = stats.pp;
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);

if (value === 15 && !aspectsOfTheDay.pp[today]) {
aspectsOfTheDay.pp[today] = { user: sender, value };
message = `${senderDisplay}, your PP is exactly 15 inches today! 🎉 You are the PP of the Day!`;
} else {
message = `${senderDisplay}, your PP is ${value}${space}inches today!${getJoke(req, type, value)}`;
}

// Track usage
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

if (type === "ppofday") {
const winner = aspectsOfTheDay.pp[today];
return res.send(
winner
? `🍆 The PP of the Day is ${formatDisplayName(winner.user)}!`
: "There is no PP of the Day yet!"
);
}

// ===========================================
// 👙 BB (BOOB SIZE) & BB OF THE DAY
// ===========================================

if (type === "bb") {
const cfg = stats.bb;
const bandIndex = generateValue(seed, type + "_band", cfg.bands.length - 1, 0, sender);
const cupIndex = generateValue(seed, type + "_cup", cfg.cups.length - 1, 0, sender);
const band = cfg.bands[bandIndex];
const cup = cfg.cups[cupIndex];
const size = `${band}${cup}`;

if (cup === "DD" && !aspectsOfTheDay.bb[today]) {
aspectsOfTheDay.bb[today] = { user: sender, size };
message = `${senderDisplay}, your size is ${size} today! 🎀 You are the Boob of the Day!`;
} else {
message = `${senderDisplay}, your boob size is ${size} today!${getJoke(req, type, bandIndex)}`;
}

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

if (type === "bbofday") {
const winner = aspectsOfTheDay.bb[today];
return res.send(
winner
? `👑 The Boob of the Day is ${formatDisplayName(winner.user)} (${winner.size})!`
: "There is no Boob of the Day yet!"
);
}

// ===========================================
// 🧔 DADDY & DADDY OF THE DAY
// ===========================================

if (type === "daddy") {
const cfg = personality.daddy;
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);

if (value === 100 && !aspectsOfTheDay.daddy[today]) {
aspectsOfTheDay.daddy[today] = { user: sender, value };
message = `${senderDisplay}, your Daddy value is 100%! 🎉 You are the Daddy of the Day!`;
} else {
message = `${senderDisplay}, your Daddy value is ${value}${space}% today!${getJoke(req, type, value)}`;
}

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

if (type === "dadofday") {
const winner = aspectsOfTheDay.daddy[today];
return res.send(
winner
? `🦸‍♂️ The Daddy of the Day is ${formatDisplayName(winner.user)}!`
: "There is no Daddy of the Day yet!"
);
}

// ===========================================
// 👑 PRINCESS & PRINCESS OF THE DAY
// ===========================================

if (type === "princess") {
const cfg = personality.princess;
value = generateValue(seed, type, cfg.max, cfg.min, sender);
value = Math.round(value);
const space = spaceIf(cfg.unitSpace);

// Only assign Princess of the Day if value is 100 and not already set
if (value === 100 && !aspectsOfTheDay.princess[today]) {
aspectsOfTheDay.princess[today] = { user: sender, value };
message = `${senderDisplay}, your Princess rating is ${value}${space}% today! 👑 You are the Princess of the Day! 🎉`;
} else {
message = `${senderDisplay}, your Princess rating is ${value}${space}% today!${getJoke(req, type, value)}`;
}

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;

return res.send(message);
}

if (type === "princessofday") {
const winner = aspectsOfTheDay.princess[today];
return res.send(
winner
? `👑 The Princess of the Day is ${formatDisplayName(winner.user)}!`
: "There is no Princess of the Day yet!"
);
}

// ===========================================
// 🐶 GOOD GIRL & GOOD GIRL OF THE DAY
// ===========================================

if (type === "goodgirl") {
const cfg = personality.goodgirl;
value = generateValue(seed, type, cfg.max, cfg.min, sender);
value = Math.round(value);
const space = spaceIf(cfg.unitSpace);

// Only assign Good Girl of the Day if value is 100 and not already set
if (value === 100 && !aspectsOfTheDay.goodgirl[today]) {
aspectsOfTheDay.goodgirl[today] = { user: sender, value };
message = `${senderDisplay}, your Good Girl rating is ${value}${space}% today! 🐶 You are the Good Girl of the Day! 🎉`;
} else {
message = `${senderDisplay}, your Good Girl rating is ${value}${space}% today!${getJoke(req, type, value)}`;
}

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;

return res.send(message);
}

if (type === "goodgirlofday") {
const winner = aspectsOfTheDay.goodgirl[today];
return res.send(
winner
? `🐶 The Good Girl of the Day is ${formatDisplayName(winner.user)}!`
: "There is no Good Girl of the Day yet!"
);
}

// ===========================================
// 📊 STATS
// ===========================================

if (stats[type]) {
const cfg = stats[type];
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);
message = `${senderDisplay}, your ${cfg.label} is ${value}${space}${cfg.unit} today!${getJoke(req, type, value)}`;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// 🏋️ GYM
// ===========================================

if (gym[type]) {
const cfg = gym[type];
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);
message = `${senderDisplay}, your ${cfg.label} is ${value}${space}${cfg.unit} today!${getJoke(req, type, value)}`;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// 💖 LOVE
// ===========================================

if (love[type]) {
const cfg = love[type];
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);
message = `${senderDisplay}, ${cfg.label} ${value}${space}${cfg.unit} today!${getJoke(req, type, value)}`;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// 💢 HATE
// ===========================================

if (hate[type]) {
const cfg = hate[type];
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);
message = `${senderDisplay}, ${cfg.label} ${value}${space}${cfg.unit} today!${getJoke(req, type, value)}`;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// 😎 PERSONALITY
// ===========================================

if (personality[type]) {
const cfg = personality[type];
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);
message = `${senderDisplay}, your ${cfg.label} is ${value}${space}${cfg.unit} today!${getJoke(req, type, value)}`;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// 😭 EMOTIONS
// ===========================================

if (emotions[type]) {
const cfg = emotions[type];
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);
message = `${senderDisplay}, your ${cfg.label} is ${value}${space}${cfg.unit} today!${getJoke(req, type, value)}`;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// 🧩 SKILLS
// ===========================================

if (skills[type]) {
const cfg = skills[type];
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);
message = `${senderDisplay}, your ${cfg.label} is ${value}${space}${cfg.unit} today!${getJoke(req, type, value)}`;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// 🎭 ACTIONS
// ===========================================

if (actions[type]) {
const cfg = actions[type];
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);
message = `${senderDisplay}, your ${cfg.label} is ${value}${space}${cfg.unit} today!${getJoke(req, type, value)}`;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// ✋ HOLD
// ===========================================

if (hold[type]) {
const cfg = hold[type];
value = generateValue(seed, type, cfg.max, cfg.min, sender);
const space = spaceIf(cfg.unitSpace);
message = `${senderDisplay}, your ${cfg.label} holds ${value}${space}${cfg.unit} today!${getJoke(req, type, value)}`;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// 🤝 INTERACTIONS
// ===========================================

if (interactions.includes(type)) {
value = generateValue(seed, type, 100, 1, sender);
const actionWord = type
.replace("throwshoe", "threw a shoe at")
.replace("fliptable", "flipped a table")
.replace("highfive", "high-fived")
.replace("love", "sent love to")
.replace("bonk", "bonked")
.replace("boop", "booped")
.replace("hug", "hugged")
.replace("kiss", "kissed")
.replace("pat", "patted")
.replace("slap", "slapped")
.replace("spank", "spanked");

if (!userRaw || sender === cleanUsername(userRaw)) {
message = `${senderDisplay} tried to ${type} the air with ${value}% power!${getJoke(req, type, value)}`;
} else {
message = `${senderDisplay} ${actionWord} ${targetDisplay} with ${value}% power!${getJoke(req, type, value)}`;
}

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

// ===========================================
// 🚫 INVALID TYPE
// ===========================================

message = `${senderDisplay}, invalid type. Try pp, daddy, bb, or fun ones like beard, hug, boop, bonk, etc.`;
return res.send(message);
} finally {
lock[type] = false; // Always release lock
}
});

// ===========================================
// 🚫 URL PING
// ===========================================

app.get("/ping", (req, res) => {
res.send("pong");
});

// ===========================================
// 🚫 START SERVER
// ===========================================

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Daily Stat API running on port ${port}`));


