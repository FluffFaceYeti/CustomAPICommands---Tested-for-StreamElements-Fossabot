import express from "express";
import crypto from "crypto";

const app = express();
const TIMEZONE = "Europe/London";

// ===========================================
// ⚙️ CONSENT TIMER
// ===========================================

const CONSENT_TIMEOUT_MS = 60000; // 60s

// ===========================================
// 💾 TEMP CONSENT STORAGE
// ===========================================

const pendingConsents = new Map();

// ===========================================
// 🚫 HELPERS
// ===========================================

function generateValue(seed, offset, max, min = 0, user = "") {
  const hash = crypto
    .createHash("md5")
    .update(seed + offset + user)
    .digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);
  return (num % (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function isJokeEnabled(req, type) {
  const global = req.query.jokes;
  if (global === "false") return false;
  if (global === "true") return true;

  const specific = req.query[`joke_${type}`];
  if (specific === "false") return false;
  if (specific === "true") return true;

  return true;
}

/**
 * Universal joke calculator
 * @param {object} req - request object
 * @param {string} type - joke type / command name
 * @param {number} value - numeric value to scale joke
 * @param {object} [cfg] - optional {min, max, levels} config for stats/interactions
 * @param {number} [index] - optional index for list-type commands
 */

function getJoke(req, type, value, cfg = null, index = null) {
  if (!isJokeEnabled(req, type)) return "";

  if (typeof value !== "number" || value == null) {
    return "";
  }

  if (type === "bb") {
    return "";
  }

  if (cfg && typeof value === "number") {
    const min = cfg.min ?? 0;
    const max = cfg.max ?? 100;
    let levels = [30, 70];

    if (Array.isArray(cfg.levels) && cfg.levels.length === 2) {
      levels = cfg.levels;
    }

    let level;
    if (value < levels[0]) {
      level = "low";
    } else if (value >= levels[0] && value <= levels[1]) {
      level = "medium";
    } else {
      level = "high";
    }

    if (jokes[type] && jokes[type][level]) {
      const joke = pickRandom(jokes[type][level]);
      return " " + joke;
    } else {
    }
  }

  const fallbackLevel = value <= 30 ? "low" : value <= 70 ? "medium" : "high";

  if (jokes[type] && jokes[type][fallbackLevel]) {
    const fallbackJoke = pickRandom(jokes[type][fallbackLevel]);
    return " " + fallbackJoke;
  }

  return "";
}

function cleanUsername(name = "") {
  return name.replace(/^@/, "").toLowerCase();
}

function formatDisplayName(name = "") {
  return name.startsWith("@") ? name : `@${name}`;
}

function spaceIf(unitSpace) {
  return unitSpace ? " " : "";
}

function inchesToCm(inches) {
  return Math.round(inches * 2.54);
}

// ===========================================
// 🌟 MINI GAMES
// ===========================================

function dailyPairSeed(gameType, sender, target) {
const today = new Date().toLocaleDateString("en-GB");
return `${today}-${gameType}-${[sender, target].sort().join("-")}`;
}

// ===========================================
// 🎮 ROCK PAPER SCISSORS
// ===========================================

function rockPaperScissors(sender, target) {
  const pairSeed = dailyPairSeed("rps", sender, target);
  const hash = crypto.createHash("md5").update(pairSeed).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);

  const choices = ["rock", "paper", "scissors"];
  const senderMove = choices[num % 3];
  const targetMove = choices[(num >> 2) % 3];

  if (senderMove === targetMove)
    return `${sender}, it's a tie with ${target}! Both chose ${senderMove}. 😅`;

  if (
    (senderMove === "rock" && targetMove === "scissors") ||
    (senderMove === "paper" && targetMove === "rock") ||
    (senderMove === "scissors" && targetMove === "paper")
  )
    return `${sender} wins! ${senderMove} beats ${targetMove}. 😎`;

  return `${target} wins! ${targetMove} beats ${senderMove}. 😂`;
}

// ===========================================
// 🎮 TUG OF WAR
// ===========================================

function tugOfWar(sender, target) {
  const pairSeed = dailyPairSeed("tug", sender, target);
  const hash = crypto.createHash("md5").update(pairSeed).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);

  const senderStrength = (num % 100) + 1;
  const targetStrength = ((num >> 4) % 100) + 1;

  if (senderStrength > targetStrength)
    return `${sender} wins! Pulled with ${senderStrength} vs ${target}'s ${targetStrength}. 💪`;
  if (senderStrength < targetStrength)
    return `${target} wins! Pulled with ${targetStrength} vs ${sender}'s ${senderStrength}. 😂`;
  return `It's a tie! Both pulled with ${senderStrength}. 😅`;
}

// ===========================================
// 🎮 DICE ROLL
// ===========================================

function diceRoll(sender, target) {
  const pairSeed = dailyPairSeed("dice", sender, target);
  const hash = crypto.createHash("md5").update(pairSeed).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);

  const senderRoll = (num % 6) + 1;
  const targetRoll = ((num >> 3) % 6) + 1;

  if (senderRoll > targetRoll)
    return `${sender} wins! 🎲 ${senderRoll} vs ${target}'s ${targetRoll}`;
  if (senderRoll < targetRoll)
    return `${target} wins! 🎲 ${targetRoll} vs ${sender}'s ${senderRoll}`;
  return `It's a tie! Both rolled ${senderRoll}. 😅`;
}

// ===========================================
// 🎮 COIN FLIP
// ===========================================

function coinFlip(sender, target) {
  const pairSeed = dailyPairSeed("coin", sender, target);
  const hash = crypto.createHash("md5").update(pairSeed).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);
  const result = num % 2 === 0 ? "Heads" : "Tails";

  return `${sender} flips a coin... ${result}! 🪙`;
}

// ===========================================
// 🎮 ROCK PAPER SCISSORS LIZARD SPOCK
// ===========================================

function rpsls(sender, target) {
  const pairSeed = dailyPairSeed("rpsls", sender, target);
  const hash = crypto.createHash("md5").update(pairSeed).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);

  const choices = ["rock", "paper", "scissors", "lizard", "spock"];
  const senderMove = choices[num % 5];
  const targetMove = choices[(num >> 3) % 5];
  const winConditions = {
    rock: ["scissors", "lizard"],
    paper: ["rock", "spock"],
    scissors: ["paper", "lizard"],
    lizard: ["spock", "paper"],
    spock: ["rock", "scissors"],
  };

  if (senderMove === targetMove)
    return `${sender} ties with ${target}! Both chose ${senderMove}. 🌌`;

  if (winConditions[senderMove].includes(targetMove))
    return `${sender} wins! ${senderMove} beats ${targetMove}. 💥`;

  return `${target} wins! ${targetMove} beats ${senderMove}. 🤔`;
}

// ===========================================
// 🎮 HIGH OR LOW
// ===========================================

function highOrLow(sender, target) {
  const pairSeed = dailyPairSeed("highlow", sender, target);
  const hash = crypto.createHash("md5").update(pairSeed).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);
  const secretNumber = (num % 100) + 1;

  if (secretNumber > 50)
    return `${sender} guessed higher — correct! The number was ${secretNumber}. 🔮`;
  return `${target} guessed lower — correct! The number was ${secretNumber}. ✨`;
}

// ===========================================
// 🎮 REGISTER MINI GAMES
// ===========================================

const miniGames = {
rps: rockPaperScissors,
tugofwar: tugOfWar,
diceroll: diceRoll,
coinflip: coinFlip,
rpsls: rpsls,
highorlow: highOrLow,
};

// ===========================================
// 👑 SPECIAL USERS
// ===========================================

const specialUsers = {
  username1: {
    beard: "@username1, your beard is majestic like a wizard!",
    hair: "@username1, LUL You have no hair silly",
  },
  username2: {
    theo: "@username2, Theo knows who his mama is and gives her all his love!",
  },
};

// ===========================================
// 🎯 SPECIAL INTERACTION OVERRIDES
// Format:
// specialInteractions[sender][target][type] = fixedValue;
// ===========================================

const specialInteractions = {
  username1: {
    username2: {
      hug: {
        value: 10000,
        message:
          "@{sender} absolutely cuddled @{target}'s face with a GOD-TIER {value}% hug! 🍑🔥",
      },
    },
  },
};

// ===========================================
// 📊 STATS
// ===========================================

const stats = {
beard:      { min: 1, max: 30,  levels: [10, 25], unit: "cm",     label: "Your Beard Length",           unitSpace: false },
hair:       { min: 10, max: 100, levels: [30,70], unit: "cm",     label: "Your Hair Length",            unitSpace: false },
pp:         { min: 3, max: 15,  levels: [5, 7],   unit: "inches", label: "Your PP Size",                unitSpace: false },
bb:         { type: "bra", bands: [28,30,32,34,36,38,40,42,44], cups: ["AA","A","B","C","D","DD","E","F","FF","G","GG"], label: "Your Boob Size", unitSpace: false },
daddy:      { min: 0, max: 100, levels: [30,70], unit: "%",       label: "Your Daddy Level",            unitSpace: false },
catmom:     { min: 0, max: 100, levels: [30,70], unit: "%",       label: "Your Cat Mom Level",          unitSpace: false },
stinker:    { min: 0, max: 100, levels: [30,70], unit: "%",       label: "Your Fart Stink Level",       unitSpace: false },
fox:        { min: 0, max: 100, levels: [30,70], unit: "%",       label: "Your Fox Energy",             unitSpace: false },
nerd:       { min: 0, max: 100, levels: [30,70], unit: "%",       label: "Your Nerd Level",             unitSpace: false },
tinkabell:  { min: 0, max: 100, levels: [20,60], unit: "%",       label: "Your Tinkabell Level",        unitSpace: false },
princess:   { min: 0, max: 100, levels: [30,70], unit: "%",       label: "Your Princess Energy",        unitSpace: false },
goodgirl:   { min: 0, max: 100, levels: [30,70], unit: "%",       label: "Your Good Girl Level",        unitSpace: false },
sloth:      { min: 0, max: 100,levels: [30,70], unit: "%",        label: "Your Sloth Level",            unitSpace: false },
butt:       { min: 0, max: 100,levels: [30,70], unit: "%",        label: "Your Butt Score",             unitSpace: false },
};

// ===========================================
// ❤️ LOVE
// ===========================================

const love = {
flame: { min: 0, max: 100, levels: [30,70], unit: "%", label: "Flame Loves You", unitSpace: false },
mila:  { min: 0, max: 100, levels: [30,70], unit: "%", label: "Mila Loves You",  unitSpace: false },
ivy:   { min: 0, max: 100, levels: [30,70], unit: "%", label: "Ivy Loves You",   unitSpace: false },
theo:  { min: 0, max: 100, levels: [30,70], unit: "%", label: "Theo Loves You",  unitSpace: false },
};

// ===========================================
// 💔 HATE
// ===========================================

const hate = {
milahate: { min: 0, max: 100, levels: [30,70], unit: "%", label: "Mila Hates You", unitSpace: false },
ivyhate:  { min: 0, max: 100, levels: [30,70], unit: "%", label: "Ivy Hates You",  unitSpace: false },
theohate: { min: 0, max: 100, levels: [30,70], unit: "%", label: "Theo Hates You", unitSpace: false },
};

// ===========================================
// 🧠 PERSONALITY
// ===========================================

const personality = {
clowning:         { min: 0, max: 100, levels: [20,50], unit: "%", label: "Your Clowning Around",       unitSpace: false },
heroComplex:      { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Hero Complex",          unitSpace: false },
darkHumor:        { min: 0, max: 100, levels: [10,50], unit: "%", label: "Your Dark Humor",            unitSpace: false },
whimsicality:     { min: 0, max: 100, levels: [25,65], unit: "%", label: "Your Whimsicality",          unitSpace: false },
ambition:         { min: 0, max: 100, levels: [40,80], unit: "%", label: "Your Ambition",              unitSpace: false },
mischief:         { min: 0, max: 100, levels: [20,60], unit: "%", label: "Your Mischief Level",        unitSpace: false },
bookishness:      { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Bookishness",           unitSpace: false },
zen:              { min: 0, max: 100, levels: [30,80], unit: "%", label: "Your Zen",                   unitSpace: false },
selfConfidence:   { min: 0, max: 100, levels: [30,80], unit: "%", label: "Your Self-Confidence",       unitSpace: false },
thoughtfulness:   { min: 0, max: 100, levels: [40,90], unit: "%", label: "Your Thoughtfulness",        unitSpace: false },
creativity:        { min: 0, max: 100, levels: [10,50], unit: "%", label: "Your Creativity",           unitSpace: false },
spontaneity:      { min: 0, max: 100, levels: [20,70], unit: "%", label: "Your Spontaneity",          unitSpace: false },
cookingSkills:    { min: 0, max: 100, levels: [20,60], unit: "%", label: "Your Cooking Skills",        unitSpace: false },
competitiveSpirit:{ min: 0, max: 100, levels: [40,90], unit: "%", label: "Your Competitive Spirit",    unitSpace: false },
eccentricity:     { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Eccentricity",          unitSpace: false },
sassiness:        { min: 0, max: 100, levels: [40,90], unit: "%", label: "Your Sassiness",             unitSpace: false },
imagination:      { min: 0, max: 100, levels: [20,60], unit: "%", label: "Your Imagination",           unitSpace: false },
nurturingInstinct:{ min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Nurturing Instinct",    unitSpace: false },
patience:         { min: 0, max: 100, levels: [20,50], unit: "%", label: "Your Patience",              unitSpace: false },
charisma:         { min: 0, max: 100, levels: [50,90], unit: "%", label: "Your Charisma",              unitSpace: false },
luck:             { min: 1, max: 10,  levels: [3,7],   unit: "/10", label: "Your Luck Roll",           unitSpace: false },
southernbelle:    { min: 0, max: 100, levels: [30,80], unit: "%", label: "Your Southern Twang",        unitSpace: false },
};

// ===========================================
// 🏋️ GYM
// ===========================================

const gym = {
lift:     { min: 0, max: 500, levels: [100,300], unit: "kg",  label: "Your Lifting Power",      unitSpace: false },
run:      { min: 0, max: 42,  levels: [10,25],   unit: "km",  label: "Your Running Distance",   unitSpace: false },
sprint:   { min: 0, max: 100, levels: [30,70],   unit: "m/s", label: "Your Sprint Speed",       unitSpace: false },
deadlift: { min: 0, max: 500, levels: [100,300], unit: "kg",  label: "Your Deadlift Strength",  unitSpace: false },
curl:     { min: 0, max: 200, levels: [20,80],   unit: "kg",  label: "Your Curl Strength",      unitSpace: false },
row:      { min: 0, max: 1000,levels: [100,500], unit: "m",   label: "Your Rowing Distance",    unitSpace: false },
stretch:  { min: 0, max: 100, levels: [30,70],   unit: "%",   label: "Your Flexibility",        unitSpace: false },
};

// ===========================================
// 🏦 HOLD
// ===========================================

const hold = {
gold: { min: 0, max: 100, levels: [30,70], unit: "coins", label: "Your Gold Pouch", unitSpace: true },
};

// ===========================================
// 🏦 CARRY
// ===========================================

const carry = {
weight: { min: 0, max: 200, levels: [50,150], unit: "kg",    label: "Your Carry Weight", unitSpace: false },
items:  { min: 0, max: 100, levels: [10,50],  unit: "items", label: "Your Carry Items",  unitSpace: true },
};

// ===========================================
// 💪 ACTIONS
// ===========================================

const actions = {
squeeze: { min: 0, max: 100, levels: [30,70], unit: "%",  label: "Your Squeeze Strength",   unitSpace: true },
push:    { min: 0, max: 100, levels: [30,70], unit: "kg", label: "Your Push Power",         unitSpace: true },
jump:    { min: 0, max: 100, levels: [30,70], unit: "cm", label: "Your Jump Height",         unitSpace: true },
press:   { min: 0, max: 100, levels: [30,70], unit: "kg", label: "Your Press Strength",      unitSpace: true },
kick:    { min: 0, max: 100, levels: [30,70], unit: "%",  label: "Your Kick Power",          unitSpace: true },
dodge:   { min: 0, max: 100, levels: [30,70], unit: "%",  label: "Your Dodge Agility",       unitSpace: true },
roll:    { min: 0, max: 100, levels: [30,70], unit: "m",  label: "Your Roll Distance",       unitSpace: true },
slide:   { min: 0, max: 100, levels: [30,70], unit: "m/s",label: "Your Slide Speed",         unitSpace: true },
climb:   { min: 0, max: 100, levels: [30,70], unit: "m/s",label: "Your Climb Speed",         unitSpace: true },
punch:   { min: 0, max: 100, levels: [30,70], unit: "kg", label: "Your Punch Power",         unitSpace: true },
block:   { min: 0, max: 100, levels: [30,70], unit: "%",  label: "Your Block Strength",      unitSpace: true },
tackle:  { min: 0, max: 100, levels: [30,70], unit: "kg", label: "Your Tackle Force",        unitSpace: true },
throw:   { min: 0, max: 100, levels: [30,70], unit: "%",  label: "Your Throw Accuracy",      unitSpace: true },
kickflip:{ min: 0, max: 100, levels: [30,70], unit: "%",  label: "Your Kickflip Ability",    unitSpace: true },
spin:    { min: 0, max: 100, levels: [30,70], unit: "rpm",label: "Your Spin Speed",          unitSpace: true },
uppercut:{ min: 0, max: 100, levels: [30,70], unit: "kg", label: "Your Uppercut Power",      unitSpace: true },
grapple: { min: 0, max: 100, levels: [30,70], unit: "%",  label: "Your Grapple Strength",    unitSpace: true },
};

// ===========================================
// 😃 EMOTIONS & FEELINGS
// ===========================================

const emotions = {
happiness:        { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Happiness",       unitSpace: true },
anger:            { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Anger Level",     unitSpace: false },
calmness:         { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Calmness",        unitSpace: true },
joy:              { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Joy Level",       unitSpace: true },
excitement:       { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Excitement",      unitSpace: true },
energy:           { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Energy Level",    unitSpace: false },
sleep:            { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Tiredness Level", unitSpace: false },
sadness:          { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Sadness Level",   unitSpace: true },
anxiety:          { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Anxiety Level",   unitSpace: true },
love:             { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Love Level",      unitSpace: true },
nostalgia:        { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Nostalgia Level", unitSpace: true },
gratitude:        { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Gratitude Level", unitSpace: true },
guilt:            { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Guilt Level",     unitSpace: true },
pride:            { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Pride Level",     unitSpace: true },
frustration:      { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Frustration Level",unitSpace: true },
hope:             { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Hope Level",      unitSpace: true },
love_hate_balance:{ min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Love vs Hate Balance", unitSpace: true },
};

// ===========================================
// 🎯 SKILLS
// ===========================================

const skills = {
precision:      { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Precision",            unitSpace: false },
accuracy:       { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Accuracy",             unitSpace: false },
focus:          { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Focus Level",          unitSpace: false },
flirting:       { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Flirting Skill",       unitSpace: false },
dj:             { min: 1, max: 10,  levels: [3,7],   unit: "/10",label: "Your DJ Skill Level",       unitSpace: false },
intelligence:   { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Intelligence",         unitSpace: false },
stealth:        { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Stealth",              unitSpace: false },
cooking:        { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Cooking Skill",        unitSpace: false },
leadership:     { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Leadership Ability",   unitSpace: false },
negotiation:    { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Negotiation Skill",    unitSpace: false },
martial_arts:   { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Martial Arts Skill",   unitSpace: false },
strength:       { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Strength",             unitSpace: false },
adaptability:   { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Adaptability",         unitSpace: false },
};

// ===========================================
// 🏴‍☠️ PIRATE
// ===========================================

const piracy = {
pirate:           { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Piracy Skill",        unitSpace: false },
captain:          { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Captain Skill",       unitSpace: false },
treasure_hunting: { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Treasure Hunting",    unitSpace: false },
sea_navigation:   { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Sea Navigation",      unitSpace: false },
ship_maintenance: { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Ship Maintenance",    unitSpace: false },
swordsmanship:    { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Swordsmanship",       unitSpace: false },
swashbuckling:    { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Swashbuckling",       unitSpace: false },
plunder:          { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Plunder Efficiency",  unitSpace: false },
cannon_use:       { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Cannon Use",          unitSpace: false },
crew_morale:      { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Crew Morale",         unitSpace: false },
intimidation:     { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Intimidation Level",  unitSpace: false },
parley:           { min: 0, max: 100, levels: [30,70], unit: "%", label: "Your Parley Skill",        unitSpace: false },
};

// ===========================================
// 🐾 ANIMAL VIBES
// ===========================================

const animal = {
animal: {
list: [
"🦁 Lion", "🐯 Tiger", "🐻 Bear", "🐶 Dog", "🐱 Cat",
"🦊 Fox", "🐼 Panda", "🐨 Koala", "🐸 Frog", "🐵 Monkey",
"🦄 Unicorn", "🐍 Snake", "🦅 Eagle", "🐺 Wolf", "🐢 Turtle"
],
label: "animal spirit"
}
};

// ===========================================
// 🍹 DRINK VIBES
// ===========================================

const drink = {
drink: {
list: [
"☕ Coffee", "🍵 Tea", "🍸 Martini", "🍹 Mojito", "🍺 Beer",
"🥃 Whiskey", "🍷 Red Wine", "🥂 Champagne", "🧋 Boba Tea",
"🍋 Lemonade", "🍫 Hot Chocolate", "🍶 Sake", "🥛 Milk",
"🧃 Juice", "🍈 Melon Soda"
],
label: "drink of the day"
}
};

// ===========================================
// 🎨 COLORS
// ===========================================

const colors = {
colors: {
list: [
"💚 Green", "💙 Blue", "💛 Yellow", "❤️ Red", "🖤 Black",
"🤍 White", "💜 Purple", "🧡 Orange", "💖 Pink", "🌈 Rainbow"
],
label: "color"
}
};

// ===========================================
// 🧘 AURA VIBES
// ===========================================

const auravibes = {
auravibes: {
list: [
"✨ Radiant", "🌊 Calm", "🔥 Fiery", "🌱 Grounded", "💫 Mystical",
"🌸 Gentle", "⚡ Energetic", "🪐 Cosmic", "🌙 Dreamy", "🌟 Sparkling"
],
label: "aura vibe"
}
};

// ===========================================
// 🏴 PIRATE VIBES
// ===========================================

const piratevibes = {
piratevibes: {
list: [
"🏴‍☠️ Swashbuckler", "⚓ Captain", "🦜 Parrot Whisperer",
"💰 Treasure Hunter", "🔥 Cannon Master", "🗺️ Navigator",
"🦑 Sea Monster Tamer"
],
label: "pirate vibe"
}
};

// ===========================================
// 🧙 WIZARD VIBES
// ===========================================

const wizardvibes = {
wizardvibes: {
list: [
"🪄 Apprentice", "✨ Sorcerer", "📜 Spellcaster", "🔮 Seer",
"🔥 Pyromancer", "❄️ Cryomancer", "🌀 Warlock"
],
label: "wizard vibe"
}
};

// ===========================================
// 👗 DAILY OUTFIT / STYLE
// ===========================================

const outfits = {
outfits: {
list: [
"🧥 Casual Chic", "👗 Elegant", "👕 Sporty", "🩳 Relaxed", "👘 Traditional",
"🧣 Cozy", "🕶️ Trendy", "🦸 Heroic", "🎭 Costume", "🥋 Martial"
],
label: "outfit/style"
}
};

// ===========================================
// ⚡ ELEMENTAL AFFINITY
// ===========================================

const elements = {
elements: {
list: ["🔥 Fire", "💧 Water", "🌱 Earth", "💨 Air", "⚡ Lightning", "❄️ Ice", "🌌 Void"],
label: "elemental affinity"
}
};

// ===========================================
// ⚡ DAILY POWER / ABILITY
// ===========================================

const powers = {
powers: {
list: [
"💪 Super Strength", "🧠 Telepathy", "🦾 Tech Genius", "🌀 Time Manipulation",
"🕶️ Invisibility", "⚡ Lightning Speed", "🌌 Cosmic Awareness"
],
label: "power/ability"
}
};

// ===========================================
// 🏴 PIRATE OUTFITS / ACCESSORIES
// ===========================================

const pirateoutfits = {
pirateoutfits: {
list: [
"🪖 Tricorn Hat", "🧥 Captain’s Coat", "🦜 Parrot Companion",
"💰 Gold Earrings", "⚓ Anchor Tattoo", "🗡️ Cutlass", "🦴 Peg Leg"
],
label: "pirate accessory"
}
};

// ===========================================
// 🧙 WIZARD ITEMS / ACCESSORIES
// ===========================================

const wizarditems = {
wizarditems: {
list: [
"🪄 Wand", "📜 Spellbook", "🔮 Crystal Ball", "🧙 Robe",
"🧪 Potion", "🪞 Mirror of Insight", "🧹 Flying Broom"
],
label: "wizard item"
}
};

// ===========================================
// 🌟 ELEMENTAL ITEMS / ACCESSORIES
// ===========================================

const elementalitems = {
elementalitems: {
list: [
"🔥 Fire Amulet", "💧 Water Orb", "🌱 Earth Ring", "💨 Air Pendant",
"⚡ Lightning Bracelet", "❄️ Ice Crystal", "🌌 Void Charm"
],
label: "elemental item"
}
};

// ===========================================
// 🧘 AURA ACCESSORIES
// ===========================================

const auraitems = {
auraitems: {
list: [
"✨ Crystal Necklace", "🌸 Flower Crown", "🪐 Cosmic Ring",
"🌊 Water Bracelet", "🔥 Flame Pendant", "🌙 Moon Charm"
],
label: "aura accessory"
}
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
  animal: [
    "You’re feeling regal and mighty today! 🦁",
    "Ferocious energy surging through you! 🐯",
    "Strong and grounded vibes. 🐻",
    "Loyal and playful spirit today. 🐶",
    "Curious and clever! 🐱",
    "Sly and mischievous energy. 🦊",
    "Cuddly and relaxed today. 🐼",
    "Calm and sleepy — taking it slow. 🐨",
    "Leaping into the day! 🐸",
    "Cheeky and fun energy. 🐵",
    "Magical and unique — unicorn vibes! 🦄",
    "Sinuous and mysterious. 🐍",
    "Soaring above challenges. 🦅",
    "Wild and adventurous! 🐺",
    "Slow but steady today. 🐢",
  ],
  drink: [
    "Strong and bold — just like your coffee! ☕",
    "Calm and soothing today, like tea. 🍵",
    "Feeling fancy and elegant. 🍸",
    "Refreshing and lively — mojito vibes! 🍹",
    "Chilled out with a casual brew. 🍺",
    "Strong spirit and full-bodied energy! 🥃",
    "Rich and smooth, like red wine. 🍷",
    "Sparkling and celebratory today! 🥂",
    "Fun and playful, like boba tea. 🧋",
    "Zesty and bright — lemonade mood! 🍋",
    "Sweet comfort for the soul. 🍫",
    "Exotic and refined — sake style. 🍶",
    "Simple and wholesome today. 🥛",
    "Juicy and energizing! 🧃",
    "Sweet, fruity, and bubbly vibes. 🍈",
  ],
  colors: [
    "Feeling fresh and natural! 🌿",
    "Calm and serene, like the ocean. 🌊",
    "Sunny and cheerful today! ☀️",
    "Passionate energy detected! 🔥",
    "Mysterious and deep vibes. 🌑",
    "Pure and peaceful today. 🕊️",
    "Royal and majestic energy! 👑",
    "Warm and vibrant today! 🍊",
    "Sparkly and sweet vibes! ✨",
    "Rainbow energy — all the colors of you! 🌈",
  ],
  auravibes: [
    "Your aura is shining bright today! ✨",
    "Flowing like a gentle river. 🌊",
    "Burning with unstoppable energy! 🔥",
    "Centered and strong. 🌱",
    "Mystical and mysterious vibes. 💫",
    "Soft and peaceful aura. 🌸",
    "Charged and vibrant! ⚡",
    "Cosmic energy surrounds you. 🪐",
    "Dreamy and whimsical mood. 🌙",
    "Sparkles everywhere you go! 🌟",
  ],
  piratevibes: [
    "Ahoy! Ready to plunder the day! 🏴‍☠️",
    "All hands on deck, captain! ⚓",
    "Squawking secrets with your feathered friends! 🦜",
    "Gold and jewels are calling your name! 💰",
    "Boom! Cannons at the ready! 🔥",
    "Charting a course to greatness! 🗺️",
    "Taming the sea’s fiercest creatures! 🦑",
  ],
  wizard: [
    "Casting charm spells like a pro! 🪄",
    "Magical energy flows through you ✨",
    "Beware, your incantations may misfire 😏",
    "Seeing visions and mysteries today 🔮",
    "You’re on fire… literally 🔥",
    "Ice cold and magical ❄️",
    "Dark magic, light heart 🌀",
  ],
  outfits: [
    "Looking stylish today! 🧥",
    "Elegance is in your aura. 👗",
    "Active and sporty vibes! 👕",
    "Relaxed and comfy — love it! 🩳",
    "Honoring tradition with style. 👘",
    "Cozy and warm for the day. 🧣",
    "Trendy and fashionable! 🕶️",
    "Heroic energy in your outfit! 🦸",
    "Fun and playful — embrace the costume! 🎭",
    "Power moves only, dressed to conquer! 🥋",
  ],
  elements: [
    "Burning bright today! 🔥",
    "Flowing smoothly and cool. 💧",
    "Strong and grounded. 🌱",
    "Light and breezy vibes. 💨",
    "Electric energy surging! ⚡",
    "Chilly and sharp! ❄️",
    "Mysterious and cosmic. 🌌",
  ],
  powers: [
    "Unstoppable strength today! 💪",
    "Reading minds like a pro! 🧠",
    "Inventive genius in full swing! 🦾",
    "Time waits for no one — you control it! 🌀",
    "Disappear like a shadow. 🕶️",
    "Fast as lightning! ⚡",
    "Cosmic awareness at its peak! 🌌",
  ],
  pirateoutfits: [
    "Looking ready to plunder! 🪖",
    "Captain chic on point! 🧥",
    "Your parrot is your hype squad! 🦜",
    "Gold shines brighter on you 💰",
    "Anchors aweigh! ⚓",
    "Sharp and deadly today! 🗡️",
    "Walking like a true pirate 🦴",
  ],
  wizarditems: [
    "Your wand is ready! 🪄",
    "Spellbook full of secrets! 📜",
    "Seeing all the mysteries 🔮",
    "Robe flowing magically 🧙",
    "Potion brewed to perfection 🧪",
    "Mirror reveals your true self 🪞",
    "Flying high on broomstick adventures 🧹",
  ],
  elementalitems: [
    "Feeling the fire within! 🔥",
    "Smooth and flowing energy 💧",
    "Grounded and strong 🌱",
    "Breezy and light today 💨",
    "Shocking power surging ⚡",
    "Chill and steady ❄️",
    "Mysterious cosmic energy 🌌",
  ],
  auraitems: [
    "Shining bright like a crystal ✨",
    "Floral energy blooming 🌸",
    "Cosmic vibes surround you 🪐",
    "Flowing like water today 🌊",
    "Fiery passion burning 🔥",
    "Moonlight magic shines 🌙",
  ],
  sloth: {
    low: [
      "you move slower than a Windows 95 update. 🐢",
      "did you even wake up today? the tree is worried. 🌳",
      "your sloth level is so low even snails are lapping you. 🐌",
    ],
    medium: [
      "look at you, moving at a casual 0.2 mph. proud of the effort! 💪",
      "a balanced sloth — naps and snacks in perfect harmony. 😴🍃",
      "you're getting the hang of slow living. zen vibes only. 🧘‍♂️",
    ],
    high: [
      "KING OF NAPS. MASTER OF LEAF EATING. TRUE SLOTH ROYALTY. 👑",
      "even the jungle applauds your laziness. 🌿👏",
      "you've achieved maximum chill. the gods of sloth salute you. 😌🦥",
    ],
  },
  tinkabell: {
    low: [
      "your fairy level is FUCKING DISGUSTING. 😂",
      "You shine bright like a diamond...covered in shit. 💩",
    ],
    medium: [
      "Your wings are growing. 🦋",
      "fairy training is starting to pay off. 💖",
    ],
    high: [
      "peter pan would be so proud. 🦸",
      "LOOK AT THAT PISS CURSE FLY. 🪄",
    ],
  },
  fox: {
    low: [
      "You are a sleepy fox today. 🦊",
      "Your tail is drooping a little. Maybe get some rest. 💤",
    ],
    medium: [
      "You are a curious fox exploring new burrows. 🔎",
      "Your cunning is showing today. 🦊",
    ],
    high: [
      "You are a sly fox stealing hearts and sandwiches. ❤️",
      "Everyone’s keeping an eye on you, clever fox. 👀",
    ],
  },
  goodgirl: {
    low: [
      "You might need a few more pats to reach your full potential. 🤔",
      "Trying, but could be better behaved today. 😅",
    ],
    medium: [
      "Doing well — you deserve a treat. 🍪",
      "A proper good girl performance today. 💕",
    ],
    high: [
      "Excellent! Gold star for best behavior. 🌟",
      "You’ve achieved maximum good girl mode. 👑",
    ],
  },
  flame: {
    low: [
      "Agent Flame sent you a cold shoulder today. ❄️",
      "The spark is weak — maybe light a match. 🔥",
    ],
    medium: [
      "Agent Flame nods in quiet approval. 👌",
      "There’s a warm glow between you and Flame. 🔥",
    ],
    high: [
      "Agent Flame can’t stop talking about you. 💬",
      "You are burning bright in Flame’s memory today. 🔥",
    ],
  },
  autism: {
    low: [
      "You’re hyper-focused — all systems go! 🔍💡✨",
      "You’ve found your special interest and are unstoppable today. 🧩🚀📚",
    ],
    medium: [
      "You could use a break from sensory overload. 🧠🔊😅",
      "You’re doing fine, but a quiet space sounds amazing. 🙉🏞️🌙",
    ],
    high: [
      "You desperately need a sensory reset. 😵‍💫🛑⚡",
      "Someone get you a weighted blanket and some earplugs ASAP. 🛏️🎧😴",
    ],
  },
  sleep: {
    low: [
      "You’re well-rested — alert and ready. 🦸",
      "You don’t need much sleep today. 😎",
    ],
    medium: [
      "You could use a nap later. 💤",
      "You’re doing fine, but bed is calling. 🛏️",
    ],
    high: [
      "You desperately need sleep. 😴",
      "Someone get you a pillow immediately. 🛌",
    ],
  },
  beard: {
    low: ["Patchy but proud! 😅", "Still in early access version. ⏳"],
    medium: ["Solid beard game! 💪", "Respectable chin forest. 🌲"],
    high: [
      "Wizard mode unlocked! 🧙‍♂️",
      "That beard tells stories of adventure. 📖",
    ],
  },
  catmom: {
    low: [
      "Trying her best, but the cat still judges her. 😼",
      "Cat Mom status: The cat allows *minimal* head pats. 🐾😅",
    ],
    medium: [
      "Solid Cat Mom energy! 💖",
      "Cat-approved… at least until dinner time. 🍽️🐱",
    ],
    high: [
      "Supreme Cat Mom — the cat has chosen her as their human. 😻👑",
      "Expert-level cat whisperer detected. 🐈✨",
    ],
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
    low: [
      "Mila glanced and walked away. 🐾",
      "She tolerates your existence. 🐱",
    ],
    medium: [
      "Mila approves for now. 👍",
      "She blinked slowly. That is cat love. 💖",
    ],
    high: ["Mila purrs loudly in your honor! 😻", "Mila adores you. 🐾"],
  },
  ivy: {
    low: [
      "Ivy is pretending you do not exist. 😒",
      "Denied cuddle privileges. ❌",
    ],
    medium: ["Ivy tolerates you. 🤔", "She let you exist in her space. 🏡"],
    high: [
      "Ivy loves you unconditionally! 💚",
      "You are the chosen lap human! 🏆",
    ],
  },
  theo: {
    low: ["Theo is pretending you do not exist. 😤", "Theo left the room. 🏃‍♂️"],
    medium: ["Theo tolerates you. 🤝", "Theo sat next to you. 🐾"],
    high: [
      "Theo loves you unconditionally! 💙",
      "Theo will nap on you later. 💤",
    ],
  },
  fluffy: {
    low: [
      "Fluffy wagged half a tail. 🐾",
      "Fluffy is ignoring your messages. 💬",
    ],
    medium: ["Fluffy smiled a little. 😊", "Fluffy seems mildly impressed. 👀"],
    high: [
      "Fluffy cannot stop purring! 🐱",
      "Fluffy thinks you are the best human! 🌟",
    ],
  },
  daddy: {
    low: ["Not very daddy today. 😬", "Maybe work on your confidence. 💪"],
    medium: ["You are somewhat daddy. 👨", "The vibes are respectable. 👍"],
    high: [
      "Certified DILF energy. 😎",
      "The room goes quiet when you enter. 🕴",
    ],
  },
  mama: {
    low: ["Not very mama today. 😬", "Maybe work on your confidence. 💪"],
    medium: ["You are somewhat mama. 👨", "The vibes are respectable. 👍"],
    high: [
      "Certified MAMA energy. 😎",
      "The room goes quiet when you enter. 🕴",
    ],
  },
  pirate: {
    low: ["You dropped your compass. 🧭", "Your ship is still in dock. 🚢"],
    medium: ["You are swashbuckling nicely. ⚓", "The crew respects you. 👑"],
    high: ["Captain material! 🏴‍☠️", "The seas whisper your name! 🌊"],
  },
  treasure_hunting: {
    low: [
      "Ye found an empty chest... again. 🪣",
      "Turns out the 'X' was bird poop. 🕊️",
    ],
    medium: [
      "You dug up some fine silver doubloons! 💰",
      "Aye, your shovel arm be strong today! ⛏️",
    ],
    high: [
      "You struck gold, Captain! 🏆",
      "Legend says the treasure sings your name! 🎶🏴‍☠️",
    ],
  },
  sea_navigation: {
    low: [
      "You're sailing in circles... 🌪️",
      "Landlubber, that’s not north! 🧭",
    ],
    medium: [
      "Smooth sailing, matey. 🌊",
      "Your course be true, as any good sailor’s should. ⚓",
    ],
    high: [
      "You ride the stars like a legend! 🌟",
      "The sea parts before ye, Navigator Supreme! 🚢✨",
    ],
  },
  ship_maintenance: {
    low: [
      "The hull’s leaking like a sieve! 💦",
      "Ye forgot to swab the deck... again. 🧽",
    ],
    medium: [
      "Aye, she’s shipshape and sturdy. ⚒️",
      "The rigging’s tight, the sails clean! ⛵",
    ],
    high: [
      "Your ship gleams brighter than gold! 🏴‍☠️✨",
      "Even Poseidon admires your craftsmanship! 🌊🔧",
    ],
  },
  swordsmanship: {
    low: [
      "You tripped over your own cutlass. 🗡️😅",
      "Careful! That’s the blunt side, mate. 🙃",
    ],
    medium: [
      "Your strikes be fierce and true! ⚔️",
      "Steel sings in your hands! 🪶",
    ],
    high: [
      "You duel like a legend of the seas! 🏴‍☠️",
      "No blade can best ye, Captain! 👑⚔️",
    ],
  },
  swashbuckling: {
    low: [
      "You dropped your hat mid-swing! 🎩",
      "Not quite the hero’s entrance you imagined... 😬",
    ],
    medium: [
      "You swing across the deck with style! 🦜",
      "That’s a fine buckle you’ve swashed! 💃🏴‍☠️",
    ],
    high: [
      "The crowd cheers your daring stunts! 🎉",
      "Even Blackbeard would applaud ye! ☠️🔥",
    ],
  },
  plunder: {
    low: [
      "Ye raided an empty barrel... 🪣",
      "No loot today, just splinters. 🪵",
    ],
    medium: [
      "You grabbed a fair haul! 💰",
      "The booty be plentiful, matey! 🏴‍☠️",
    ],
    high: [
      "You emptied a fleet’s worth of gold! 🏆",
      "The sea trembles at your greed! 💎☠️",
    ],
  },
  cannon_use: {
    low: [
      "You fired... backwards. 💥🙈",
      "The fuse went out. Maybe next time. 🕯️",
    ],
    medium: [
      "Good shot, ye hit the target! 🎯",
      "A clean blast! The crew cheers! 🏴‍☠️💥",
    ],
    high: ["Perfect aim, Captain! 💀", "The enemy ship’s in splinters! 💣🔥"],
  },
  crew_morale: {
    low: [
      "The crew’s grumbling, Captain... 😠",
      "Mutiny whispers on the wind. 🌪️",
    ],
    medium: [
      "The men sing shanties and drink rum! 🍻",
      "Your crew stands loyal and strong. ⚓",
    ],
    high: [
      "The crew would follow ye to Davy Jones! ☠️",
      "Your name lifts hearts across the sea! 🏴‍☠️❤️",
    ],
  },
  intimidation: {
    low: [
      "A seagull just stole your hat. 🐦",
      "The tavern laughed instead of fleeing. 🍺😂",
    ],
    medium: [
      "Your glare be enough to freeze a man’s soul. 👀",
      "The crew obeys without question. ☠️",
    ],
    high: [
      "Your mere presence makes krakens tremble! 🐙💀",
      "Legends whisper your wrath! ⚓🔥",
    ],
  },
  parley: {
    low: [
      "You spilled rum on the negotiation table. 🍹",
      "They took your word... and your boots. 🥾",
    ],
    medium: [
      "You struck a fair bargain, Captain. ⚖️",
      "Your tongue be as sharp as your sword. 💬⚔️",
    ],
    high: [
      "You turned enemies into allies with a word! 🤝🏴‍☠️",
      "Your diplomacy saves fleets! 🕊️🌊",
    ],
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
    high: [
      "Royalty radiates from you! 👑",
      "All hail the majestic princess! 👑",
    ],
  },
  nerd: {
    low: ["Barely read one wiki today. 📚", "Low nerd output. 🤓"],
    medium: ["Decent nerd energy. ⚡", "Glasses adjusted successfully. 👓"],
    high: [
      "Big brain mode activated! 🤯",
      "You just debugged reality itself! 🖥️",
    ],
  },
  bonk: {
    low: [
      "That was more of a gentle tap than a bonk. 😅",
      "You missed completely. Try again. 🙃",
    ],
    medium: [
      "A solid bonk — respectably executed. 👊",
      "You gave a good bonk. Not too hard, not too soft. 🤜",
    ],
    high: [
      "That bonk echoed through the land! 🔊",
      "Maximum bonk achieved! Someone’s going to feel that. 😬",
    ],
  },
  boop: {
    low: [
      "A small, hesitant boop. 👃",
      "Barely a touch — shy booper detected. 🤭",
    ],
    medium: [
      "Boop executed successfully. 👏",
      "That was a decent boop. Nose contact confirmed. 👃",
    ],
    high: [
      "A powerful boop! 💥",
      "The world trembles before your booping power. 🌍",
    ],
  },
  fliptable: {
    low: [
      "You flipped a coaster instead of a table. 🍽️",
      "The table wobbled but didn’t flip. 😬",
    ],
    medium: [
      "Table flipped! Drinks everywhere. 🍸",
      "You flipped the table with respectable rage. 😤",
    ],
    high: [
      "That table didn’t stand a chance. ⚡",
      "Utter chaos. The table flew across the room. 💥",
    ],
  },
  highfive: {
    low: [
      "You missed the hand completely. 🙈",
      "Awkward air high-five. Maybe next time. ✋",
    ],
    medium: [
      "Nice contact! That was a proper high-five. 👏",
      "Crisp sound, solid form — approved. 👍",
    ],
    high: [
      "Perfect synchronization! That clap could summon thunder. ⚡",
      "Legendary high-five! Everyone felt that energy. 🔥",
    ],
  },
  hug: {
    low: [
      "A quick and slightly awkward hug. 😬",
      "You went for a hug, but it turned into a polite pat. 🤗",
    ],
    medium: [
      "A warm, friendly hug. 🫂",
      "That was a solid hug — not too tight, not too loose. 🤗",
    ],
    high: [
      "A bear hug that could break your bones! 🐻",
      "You’re enveloped in warmth and love. 🥰",
    ],
  },
  kiss: {
    low: [
      "You missed and kissed the air. 💨",
      "It was more of a smooch sound than an actual kiss. 💋",
    ],
    medium: [
      "A sweet little kiss. 😘",
      "You shared a proper kiss — charming work. 💖",
    ],
    high: [
      "That kiss could melt hearts. ❤️",
      "Romance level: professional. 💍",
    ],
  },
  love: {
    low: [
      "You tried to love, but it came out awkward. 😬",
      "Not feeling very affectionate today. 🤷‍♂️",
    ],
    medium: [
      "A healthy dose of love shared. 💌",
      "You spread a reasonable amount of love. 🌹",
    ],
    high: [
      "Overflowing with love and positivity! 💖",
      "You radiate pure affection today. ✨",
    ],
  },
  pat: {
    low: [
      "You missed and patted the air. 👋",
      "That pat was a bit weak, try again. 🙈",
    ],
    medium: [
      "A gentle and comforting pat. 🤗",
      "Perfect pat form. Well done. 👏",
    ],
    high: [
      "An excellent pat — pure serotonin. 🧠",
      "Your pats bring joy to all. 😻",
    ],
  },
  slap: {
    low: [
      "That was more of a light tap. 🤏",
      "You hesitated — weak slap detected. 🧐",
    ],
    medium: [
      "A solid slap. Just the right amount of sting. 👋",
      "You delivered a respectable slap. 👏",
    ],
    high: [
      "A thunderous slap heard across chat. ⚡",
      "That slap will be remembered forever. 🏆",
    ],
  },
  spank: {
    low: [
      "A shy and hesitant spank. 🙈",
      "You tried, but it barely registered. 💤",
    ],
    medium: [
      "A confident spank with good form. 💪",
      "That spank landed nicely — well done. 👏",
    ],
    high: [
      "A flawless spank. 10/10 execution. 👏",
      "You spanked like a pro — impressive work. 👑",
    ],
  },
  throwshoe: {
    low: [
      "You threw a slipper instead of a shoe. 🥿",
      "Missed completely. Shoe is lost forever. 🏃‍♂️",
    ],
    medium: [
      "Direct hit! That was a clean throw. 🎯",
      "You lobbed the shoe with respectable accuracy. 👟",
    ],
    high: [
      "Bullseye! The shoe hit perfectly. 🎯",
      "That throw could win the Olympics. 🥇",
    ],
  },
  lift: {
    low: [
      "You barely lifted it off the ground. 🏋️‍♂️",
      "That bar isn’t impressed yet. 😑",
    ],
    medium: [
      "Solid lift! Good form and focus. 💪",
      "You’re warming up nicely. 🔥",
    ],
    high: ["Beast mode activated! 💥", "That lift shook the gym! 🏋️‍♀️"],
  },
  run: {
    low: ["You walked more than you ran. 🚶‍♂️", "A light jog counts, right? 🏃‍♂️"],
    medium: [
      "Smooth stride and steady breathing. 🌬️",
      "You’re keeping a great pace! 🏃‍♀️",
    ],
    high: ["You sprinted like the wind! 🌪️", "Track star energy today! 🏅"],
  },
  sprint: {
    low: [
      "More of a power walk than a sprint. 🚶‍♀️",
      "You tripped over enthusiasm. 🤸‍♂️",
    ],
    medium: ["Quick burst of energy! ⚡", "You dashed like you meant it! 🏃‍♂️"],
    high: ["Lightning couldn’t keep up! ⚡", "You left dust trails behind! 🌪️"],
  },
  deadlift: {
    low: ["That barbell didn’t move much. 🏋️‍♂️", "You gave it a polite tug. 🙃"],
    medium: [
      "Solid lift! Muscles engaged. 💪",
      "Good pull with clean form. 🏋️‍♀️",
    ],
    high: ["Ground shaking deadlift! 🌍", "That was a personal best! 🏆"],
  },
  curl: {
    low: [
      "Those curls need more conviction. 💪",
      "You lifted air with style. 🕺",
    ],
    medium: ["Nice pump forming! 💥", "Steady curl with proper form. 🏋️‍♂️"],
    high: ["Biceps of steel! 🏋️‍♀️", "Those arms could crush walnuts! 🌰"],
  },
  row: {
    low: ["You gently rocked the boat. 🚣‍♀️", "Barely moved the oars. 🌊"],
    medium: ["Smooth rowing pace. ⛵", "Consistent strokes, nice rhythm. 🏆"],
    high: [
      "You powered through the water! 🌊",
      "Rowing champion performance! 🏅",
    ],
  },
  stretch: {
    low: ["You reached halfway there. 🤸‍♂️", "Could use more bend next time. 🙆‍♀️"],
    medium: ["Flexible and focused. 🧘‍♂️", "That stretch looked clean! 🧘‍♀️"],
    high: [
      "Gymnast levels of flexibility! 🤸‍♀️",
      "You could join a yoga class! 🧘‍♀️",
    ],
  },
  gold: {
    low: [
      "Your pouch jingles modestly. 💰",
      "Not much shine in there today. 💸",
    ],
    medium: [
      "Your pouch feels a bit heavier. 🤑",
      "Steady earnings for a good day. 💵",
    ],
    high: [
      "Your pouch overflows with coins! 💰",
      "You could buy the tavern today! 🍻",
    ],
  },
  squeeze: {
    low: [
      "That’s the weakest handshake I’ve ever felt! 🖐️",
      "Barely a squeeze, try harder! 💪",
      "You could use a bit more grip strength. 🤲",
    ],
    medium: [
      "Not bad, you’re getting stronger! 💪",
      "Nice squeeze, a bit more power next time. 💥",
      "You're really getting the hang of it. 🖐️",
    ],
    high: [
      "You could crush a watermelon with that squeeze! 🍉",
      "Squeeze of a champion! 🏆",
      "Your grip is as strong as steel! 🔩",
    ],
  },
  push: {
    low: [
      "That push barely moved anything! 🛑",
      "You pushed, but the wall didn’t budge. 🧱",
      "Keep pushing, you’ll get stronger! 💪",
    ],
    medium: [
      "Nice push, you’ve got some power! 💥",
      "You're pushing the limits! 🚀",
      "Solid push, not bad at all. 👍",
    ],
    high: [
      "That push is like a bulldozer! 🚜",
      "You're pushing like a pro! 🏋️‍♂️",
      "That was a monster push! 💥",
    ],
  },
  jump: {
    low: [
      "That was more of a hop than a jump. 🐇",
      "You’re getting there, but not quite yet. ⬆️",
      "Not bad for a small jump! 🦘",
    ],
    medium: [
      "Great jump! You’re getting some air. 🏀",
      "Nice leap, you’re on your way. 🏃‍♂️",
      "Good jump, you're in the zone! 🔥",
    ],
    high: [
      "You jumped so high, you almost touched the stars! ✨",
      "You’ve got wings, my friend! 🕊️",
      "That was an Olympic-level jump! 🏅",
    ],
  },
  press: {
    low: [
      "You barely moved the barbell. 🏋️‍♂️",
      "That’s just a warm-up press. 💪",
      "You’re starting slow, but it’s okay. 🧘‍♂️",
    ],
    medium: [
      "Good press! You’ve got some solid form. 💪",
      "Nice press, you’re making progress. 📈",
      "You’re building some solid strength. 💥",
    ],
    high: [
      "That press could lift a truck! 🚚",
      "You’re pressing like a powerlifter! 🏋️‍♀️",
      "That press could break records! 🏆",
    ],
  },
  kick: {
    low: [
      "That was more of a gentle tap. 👢",
      "Not a kick, more like a nudge! 💨",
      "You need to put more force into that. ⚡",
    ],
    medium: [
      "Nice kick, good form! 👣",
      "Your kick’s getting stronger! 🦵",
      "Solid kick, you're improving. 💪",
    ],
    high: [
      "That kick would knock someone out cold! 🥋",
      "Your kick is unstoppable! 💥",
      "That kick would make a superhero proud! 💪",
    ],
  },
  happiness: {
    low: [
      "You might need a little more sunshine today! 🌥️",
      "Try smiling, it helps. 😊",
    ],
    medium: [
      "Not bad, a bit of a smile would help. 🙂",
      "You're halfway there, keep smiling. 😁",
    ],
    high: [
      "You're glowing with happiness today! 🌟",
      "You're the embodiment of joy right now! 😄",
    ],
  },
  anger: {
    low: [
      "Just a bit grumpy, huh? 😤",
      "You’re feeling a little off today. 😒",
    ],
    medium: [
      "You're getting there, but take a deep breath. 🌬️",
      "A little fire in your soul today. 🔥",
    ],
    high: [
      "You're ready to smash things, calm down! 🧨",
      "Easy there, Hulk. Let's take a breath. 😤",
    ],
  },
  calmness: {
    low: ["A bit stressed today? 😬", "Maybe a deep breath might help. 🧘‍♂️"],
    medium: [
      "You're doing alright, deep breath. 🌿",
      "Keeping it together, not bad. 😌",
    ],
    high: [
      "You're the calmest person in the room right now. 😎",
      "Nothing can shake your calmness today. 🧘‍♀️",
    ],
  },
  joy: {
    low: [
      "Not feeling too joyful yet, huh? 🙁",
      "Try smiling and maybe some ice cream? 🍦",
    ],
    medium: [
      "You're getting there, keep the good vibes rolling. ✌️",
      "Things are looking brighter, huh? 🌞",
    ],
    high: [
      "You're radiating pure joy right now! 🌟",
      "Your joy could light up a whole city! 🏙️",
    ],
  },
  excitement: {
    low: [
      "Not much excitement today, maybe try something new? 🌱",
      "You're just waking up to the fun. 😴",
    ],
    medium: [
      "You're getting excited, just a little more! ⚡",
      "Some excitement is building up! 😆",
    ],
    high: [
      "You're practically bouncing with excitement! 🤩",
      "You’re so excited, it’s contagious! 😜",
    ],
  },
  love_group: {
    low: ["barely noticed you today. 🙄", "is ignoring you again. 🤷‍♂️"],
    medium: ["seems to like you okay. 🙂", "shared a little love. 💘"],
    high: [
      "is obsessed with you today. 😍",
      "can't stop thinking about you. 💭",
    ],
  },
  hate_group: {
    low: ["barely annoyed with you. 😑", "shrugged it off. 🤷‍♀️"],
    medium: ["gave you a dirty look. 😒", "is not impressed. 🙄"],
    high: ["absolutely furious with you. 😡", "can't stand you today. 🤬"],
  },
  skills_group: {
    low: ["Your aim is terrible today. 🎯", "Not very focused at all. 🤔"],
    medium: [
      "You’re doing alright, could be sharper. 🧐",
      "Pretty decent performance. 👌",
    ],
    high: ["Perfect form and focus. 🏆", "You could teach others today. 🎓"],
  },
  dj: {
    low: [
      "Your beats are so soft, even the plants are falling asleep. 🪴",
      "You just pressed play, right? Because that’s the loudest thing you’ve done today. 🔇",
      "Your DJ name should be ‘Volume: 1’. 🔉",
    ],
    medium: [
      "Not bad, you could drop a sick beat… if the speakers were louder. 🎶",
      "You’re halfway to headliner status… keep spinning! 🎧",
      "Your playlist is solid, just don’t forget to smile between tracks. 😊",
    ],
    high: [
      "Drop that bass! 🎧 The crowd didn’t know they needed it until now. 🎶",
      "You just turned the dance floor into a hurricane of awesome. 🌪️",
      "Your mixes are so fire, the fire extinguisher just ran out. 🔥",
    ],
  },
  bb: {
    low: ["A humble hero 😌", "Small but mighty 💕"],
    medium: [
      "Perfectly balanced, as all things should be ✨",
      "Top-tier symmetry 💖",
    ],
    high: ["An absolute legend 😳", "That’s... gravitationally impressive 🌌"],
  },
  gangbang: {
    low: [
      "That was more of a polite group hug. 🤗",
      "You tried... but it felt like a networking event. 💼",
      "The squad showed up, but nobody committed. 😅",
      "That’s the quietest gangbang ever recorded. 📉",
    ],
    medium: [
      "A respectable turnout — messy, but organized. 🫡",
      "The vibes were chaotic, but everyone left smiling. 😏",
      "You brought some energy to the room! 🔥",
      "Things escalated... tastefully. 🎭",
    ],
    high: [
      "That was pure, unfiltered madness. 💥 The walls are still shaking.",
      "A legendary performance — historians will study this one. 📜",
      "An all-out festival of chaos and passion. 🎉",
      "Chat may never recover from that display of teamwork. 💦",
    ],
  },
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
// 🍑 BOOTY BATTLE
// ===========================================

miniGames.bootybattle = (senderRaw, userRaw) => {
const sender = cleanUsername(senderRaw);
const target = cleanUsername(userRaw);
const senderDisplay = formatDisplayName(senderRaw);
const targetDisplay = formatDisplayName(userRaw);

if (!userRaw || sender === target) {
return `🍑 ${senderDisplay} tried to compare booties with themselves... confidence or madness? 🤔`;
}

const today = new Date().toLocaleDateString("en-GB");
const seedSender = `${today}-booty-${sender}`;
const seedTarget = `${today}-booty-${target}`;

const cfg = stats.butt;
const senderBooty = generateValue(
seedSender,
"butt",
cfg.max,
cfg.min,
sender
);
const targetBooty = generateValue(
seedTarget,
"butt",
cfg.max,
cfg.min,
target
);

if (senderBooty === targetBooty) {
return `⚖️ ${senderDisplay} and ${targetDisplay} both have equally glorious booties at ${senderBooty}% fruitiness! 🍑 A tie worthy of song! 🎶`;
}

const winner =
senderBooty > targetBooty
? { name: senderDisplay, booty: senderBooty }
: { name: targetDisplay, booty: targetBooty };
const loser =
senderBooty > targetBooty
? { name: targetDisplay, booty: targetBooty }
: { name: senderDisplay, booty: senderBooty };

const outcomes = [
`🍑 ${winner.name} shook that booty with ${winner.booty}% fruitiness! ${loser.name} tried... but gravity was not on their side. ⚓`,
`🏴‍☠️ ${winner.name} wins the Booty Battle! ${loser.name} must polish the captain’s chair in shame (${winner.booty}% vs ${loser.booty}%). 🪑`,
`🔥 ${winner.name}’s booty be the talk of the seven seas! ${loser.name} be left in the shadows (${winner.booty}% vs ${loser.booty}%). 🌊`,
`💫 ${winner.name} has the juiciest booty in all the ports! ${loser.name} can only stare in awe. 🍑`,
];

return pickRandom(outcomes);
};

// ===========================================
// 💰 PLUNDER RAID
// ===========================================

miniGames.plunderraid = (senderRaw, userRaw) => {
const sender = cleanUsername(senderRaw);
const target = cleanUsername(userRaw);
const senderDisplay = formatDisplayName(senderRaw);
const targetDisplay = formatDisplayName(userRaw);

if (!userRaw || sender === target) {
return `🏴‍☠️ ${senderDisplay} tried to raid their own ship... that’s mutiny, ye scallywag! ⚓`;
}

const today = new Date().toLocaleDateString("en-GB");
const seedSender = `${today}-plunder-${sender}`;
const seedTarget = `${today}-plunder-${target}`;

const cfg = piracy.plunder;
const senderLoot = generateValue(
seedSender,
"plunder",
cfg.max,
cfg.min,
sender
);
const targetLoot = generateValue(
seedTarget,
"plunder",
cfg.max,
cfg.min,
target
);

if (senderLoot === targetLoot) {
return `💎 ${senderDisplay} and ${targetDisplay} raided the same island and found equal treasure (${senderLoot}% each)! A fair share for both crews! ⚖️`;
}

const winner =
senderLoot > targetLoot
? { name: senderDisplay, loot: senderLoot }
: { name: targetDisplay, loot: targetLoot };
const loser =
senderLoot > targetLoot
? { name: targetDisplay, loot: targetLoot }
: { name: senderDisplay, loot: senderLoot };

const outcomes = [
`💰 ${winner.name} pillaged with unmatched fury, looting ${winner.loot}% of the treasure! ${loser.name} was left with scraps (${loser.loot}%). 🪙`,
`🏴‍☠️ ${winner.name} struck gold while ${loser.name} found only coconuts. A rich victory! 🥥💎`,
`🔥 ${winner.name}’s crew raided the fort, leaving ${loser.name} adrift in shame! (${winner.loot}% vs ${loser.loot}%) ☠️`,
`🪓 ${winner.name} took the booty and the bragging rights! ${loser.name}’s crew be swabbing decks for a week! 🧽`,
];

return pickRandom(outcomes);
};

// ===========================================
// 🔫 PISTOL DUEL
// ===========================================

miniGames.pistolfight = (senderRaw, userRaw) => {
const sender = cleanUsername(senderRaw);
const target = cleanUsername(userRaw);
const senderDisplay = formatDisplayName(senderRaw);
const targetDisplay = formatDisplayName(userRaw);

if (!userRaw || sender === target) {
return `💥 ${senderDisplay} tried to duel themselves... and missed! 🤦‍☠️`;
}

const today = new Date().toLocaleDateString("en-GB");
const seedSender = `${today}-pistol-${sender}`;
const seedTarget = `${today}-pistol-${target}`;

const cfg = piracy.intimidation;
const senderAim = generateValue(
seedSender,
"intimidation",
cfg.max,
cfg.min,
sender
);
const targetAim = generateValue(
seedTarget,
"intimidation",
cfg.max,
cfg.min,
target
);

if (senderAim === targetAim) {
return `🔫 ${senderDisplay} and ${targetDisplay} fired at once — smoke clears, both unharmed! A draw at ${senderAim}%! ☁️`;
}

const winner =
senderAim > targetAim
? { name: senderDisplay, aim: senderAim }
: { name: targetDisplay, aim: targetAim };
const loser =
senderAim > targetAim
? { name: targetDisplay, aim: targetAim }
: { name: senderDisplay, aim: senderAim };

const outcomes = [
`💀 ${winner.name} shot true — ${loser.name} drops their pistol in surrender! (${winner.aim}% vs ${loser.aim}%) ⚓`,
`☠️ ${loser.name} fired too soon! ${winner.name} takes the win with cold precision! 🎯`,
`🔥 ${winner.name} blasted ${loser.name} clean off the deck! (${winner.aim}% vs ${loser.aim}%) 🏴‍☠️`,
`🏆 ${winner.name} wins the pistol duel! ${loser.name} be smokin’ — and not in a good way. 💨`,
];

return pickRandom(outcomes);
};

// ===========================================
// 🚢 SHIP BATTLE DUEL
// ===========================================

miniGames.shipbattle = (senderRaw, userRaw) => {
const sender = cleanUsername(senderRaw);
const target = cleanUsername(userRaw);
const senderDisplay = formatDisplayName(senderRaw);
const targetDisplay = formatDisplayName(userRaw);

if (!userRaw || sender === target) {
return `🛳️ ${senderDisplay} tried to battle their own ship… the crew be confused! 🤔`;
}

const today = new Date().toLocaleDateString("en-GB");
const seedSender = `${today}-ship-${sender}`;
const seedTarget = `${today}-ship-${target}`;

const cfg = piracy.cannon_use;
const senderPower = generateValue(
seedSender,
"cannon_use",
cfg.max,
cfg.min,
sender
);
const targetPower = generateValue(
seedTarget,
"cannon_use",
cfg.max,
cfg.min,
target
);

if (senderPower === targetPower) {
return `💣 ${senderDisplay} and ${targetDisplay} fired their cannons — a perfect draw! Both ships still float (${senderPower}% vs ${targetPower}%)! ⚓`;
}

const winner =
senderPower > targetPower
? { name: senderDisplay, power: senderPower }
: { name: targetDisplay, power: targetPower };
const loser =
senderPower > targetPower
? { name: targetDisplay, power: targetPower }
: { name: senderDisplay, power: senderPower };

const outcomes = [
`💥 ${winner.name} broadside-shattered ${loser.name}’s hull! (${winner.power}% vs ${loser.power}%) — glorious victory! 🏴‍☠️`,
`🔥 ${loser.name}’s ship be sinking! ${winner.name} claims the spoils of the sea! ⚓`,
`🌊 ${winner.name} caught the wind just right — ${loser.name} be sent to Davy Jones’ locker! ☠️`,
`🏆 ${winner.name} wins the naval clash! ${loser.name} waves the white flag (${winner.power}% vs ${loser.power}%). 🏴‍☠️`,
];

return pickRandom(outcomes);
};

// ===========================================
// ⚔️ SWORD FIGHT DUEL
// ===========================================

miniGames.swordfight = (senderRaw, userRaw) => {
const sender = cleanUsername(senderRaw);
const target = cleanUsername(userRaw);
const senderDisplay = formatDisplayName(senderRaw);
const targetDisplay = formatDisplayName(userRaw);

if (!userRaw || sender === target) {
return `☠️ ${senderDisplay} tried to duel themselves... ye fool! 🤦‍☠️`;
}

const today = new Date().toLocaleDateString("en-GB");
const seedSender = `${today}-sword-${sender}`;
const seedTarget = `${today}-sword-${target}`;

const cfg = piracy.swordsmanship;
const senderSkill = generateValue(
seedSender,
"swordsmanship",
cfg.max,
cfg.min,
sender
);
const targetSkill = generateValue(
seedTarget,
"swordsmanship",
cfg.max,
cfg.min,
target
);

if (senderSkill === targetSkill) {
return `⚔️ ${senderDisplay} and ${targetDisplay} clashed blades in an even match! Both fought bravely with skill ${senderSkill}%! 🏴‍☠️`;
}

const winner =
senderSkill > targetSkill
? { name: senderDisplay, skill: senderSkill }
: { name: targetDisplay, skill: targetSkill };
const loser =
senderSkill > targetSkill
? { name: targetDisplay, skill: targetSkill }
: { name: senderDisplay, skill: senderSkill };

const outcomes = [
`⚔️ ${winner.name} disarmed ${loser.name} with a dazzling display of blade mastery (${winner.skill}% vs ${loser.skill}%)! 🏴‍☠️`,
`💥 ${loser.name} took a step back as ${winner.name}’s sword gleamed under the sun — victory to ${winner.name}! ☠️`,
`🩸 ${winner.name} struck true! ${loser.name} drops their sword, humbled by skill ${winner.skill}%! ⚓`,
`🏆 ${winner.name} wins the duel! ${loser.name} shall be swabbing decks tonight (${winner.skill}% vs ${loser.skill}%). 🪣`,
];

return pickRandom(outcomes);
};

// ===========================================
// ⚔️ PP DUEL
// ===========================================

miniGames.ppduel = (senderRaw, userRaw) => {
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

const winner =
senderPP > targetPP
? { name: senderDisplay, pp: senderPP }
: { name: targetDisplay, pp: targetPP };
const loser =
senderPP > targetPP
? { name: targetDisplay, pp: targetPP }
: { name: senderDisplay, pp: senderPP };

const outcomes = [
`${winner.name} swung their PP with ${winner.pp} inches of fury, flattening ${loser.name}’s measly ${loser.pp} inch attempt! 🍆💥`,
`${loser.name} tried their best, but ${winner.name}’s ${winner.pp} inch weapon of mass distraction was too powerful. 🏆`,
`In a blinding flash, ${winner.name} defeated ${loser.name} — PP dominance secured (${winner.pp} vs ${loser.pp})! 💪🍆`,
`${loser.name} cried “It’s not the size that matters!” right before ${winner.name} proved it actually does (${winner.pp} vs ${loser.pp}). 😂`,
];

return pickRandom(outcomes);
};

// ===========================================
// 🧠 MAIN CODE ROUTE
// ===========================================

// ===========================================
// 🔤 ACTION WORD HELPER
// ===========================================

function getActionWord(type) {
return type
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
.replace("spank", "spanked")
}

// ===========================================
// 📅 DAILY STORAGE & COUNTERS
// ===========================================

const aspectsOfTheDay = {
daddy: {},
pp: {},
bb: {},
princess: {},
goodgirl: {},
catmom: {},
stinker: {},
pirate: {},
captain: {},
animal: {},
drink: {},
};

const wordsOfTheDay = {};
const dailyConsents = {};
const lock = {};
const statCounters = {};
const commandCounters = {};
const giveawayEntries = [];    
const giveawayWinners = [];

// ===========================================
// 🚫 ASPEECT OF THE DAY TRIGGER VALUES - NONE LIST ITEMS
// ===========================================

const aspectsOfTheDayTriggers = {
pp: 15,
daddy: 100,
princess: 100,
goodgirl: 100,
catmom: 100,
stinker: 100,
pirate: 100,
captain: 100,
};

// ===========================================
// 🚫 ASPEECT OF THE DAY TRIGGER VALUES - LIST ITEMS
// ===========================================

const listAspectTriggers = {
drink: {
includes: "🍸 martini",
},
animal: {
includes: "unicorn",
},
};

// ===========================================
// 🚫 VALUE WINNER OF THE DAY MESSAGES - NONE LIST
// ===========================================

const aspectOfTheDayMessages = {
pp: (senderDisplay, value, space, cfg) =>
`${senderDisplay}, your PP is exactly ${value}${space}${cfg.unit} today! 🎉 You are the PP of the Day!`,

daddy: (senderDisplay, value, space, cfg) =>
`${senderDisplay}, your Daddy Level is ${value}${space}${cfg.unit} today! 🎉 You are the Daddy of the Day!`,

princess: (senderDisplay, value, space, cfg) =>
`${senderDisplay}, your Princess Level is ${value}${space}${cfg.unit} today! 👑 You are the Princess of the Day! 🎉`,

goodgirl: (senderDisplay, value, space, cfg) =>
`${senderDisplay}, your Good Girl Level is ${value}${space}${cfg.unit} today! 🐶 You are the Good Girl of the Day! 🎉`,

catmom: (senderDisplay, value, space, cfg) =>
`${senderDisplay}, your Cat Mom Level is ${value}${space}${cfg.unit} today! 🐾 You are the Cat Mom of the Day! 🎉`,

stinker: (senderDisplay, value, space, cfg) =>
`${senderDisplay}, your Fart Level is ${value}${space}${cfg.unit} today! 💨 You are the Stinker of the Day! 🎉`,

pirate: (senderDisplay, value, space, cfg) =>
`🏴‍☠️ Ahoy ${senderDisplay}! Your Pirate Level be ${value}${space}${cfg.unit} today! ☠️ You are the Pirate of the Day! 🏆`,

captain: (senderDisplay, value, space, cfg) =>
`🏴‍☠️ ${senderDisplay}, your Captain Power be ${value}${space}${cfg.unit} today! ⚓ You are the Captain of the Day! 🏆`,

// ===========================================
// 🚫 VALUE WINNER OF THE DAY MESSAGES - LIST
// ===========================================

drink: (senderDisplay, chosen, _space, cfg) =>
`🍹 ${senderDisplay}, your ${cfg.label} today is ${chosen}! 🏆 You are the *Drink of the Day!* 🎉`,

animal: (senderDisplay, chosen, _space, cfg) =>
`🐾 ${senderDisplay}, your ${cfg.label} today is ${chosen}! 🏆 You are the *Animal of the Day!* 🎉`,
};

// ===========================================
// 🚫 WHO IS WINNER OF THE DAY MESSAGES
// ===========================================

const aspectOfTheDayQueryMessages = {
daddy: (winner) =>
`🦸‍♂️ The Daddy of the Day is ${formatDisplayName(winner.user)}!`,

pp: (winner) => `🍆 The PP of the Day is ${formatDisplayName(winner.user)}!`,

princess: (winner) =>
`👑 The Princess of the Day is ${formatDisplayName(winner.user)}!`,

goodgirl: (winner) =>
`🐶 The Good Girl of the Day is ${formatDisplayName(winner.user)}!`,

catmom: (winner) =>
`🐾 The Cat Mom of the Day is ${formatDisplayName(winner.user)}!`,

stinker: (winner) =>
`💨 The Stinker of the Day is ${formatDisplayName(winner.user)}!`,

pirate: (winner) =>
`🏴‍☠️☠️ The Pirate of the Day be ${formatDisplayName(
winner.user
)}! ⚓️ May the seas bow before ye! 🌊`,

captain: (winner) =>
`🏴‍☠️ The *Captain of the Day* be ${formatDisplayName(
winner.user
)}! Raise the black flag and salute! ⚓️`,

animal: (winner) =>
`🐾 The Animal of the Day is ${formatDisplayName(
winner.user
)} — a majestic ${winner.chosen}! 👑`,

drink: (winner) =>
`🍹 The Drink of the Day is ${formatDisplayName(winner.user)} — ${
winner.chosen
}! 🏆`,
};

const aspectOfTheDayNoWinnerMessages = {
daddy: "There is no Daddy of the Day yet!",
pp: "There is no PP of the Day yet!",
princess: "There is no Princess of the Day yet!",
goodgirl: "There is no Good Girl of the Day yet!",
catmom: "There is no Cat Mom of the Day yet!",
stinker: "There is no Stinker of the Day yet!",
pirate:
"☠️ There be no Pirate of the Day yet! Raise yer sails and earn yer title, ye scallywag! 🦜",
captain: "There be no Captain of the Day yet! Who will seize the helm? 🏴‍☠️",
animal: "🐾 There is no Animal of the Day yet! Be the first to roar! 🦁",
drink: "🍹 There is no Drink of the Day yet! Be the first to sip! 🍸",
};

// ===========================================
// 🚫 VALUE OF THE DAY MAPS
// ===========================================

const aspectOfTheDayAliases = {
dadofday: "daddy",
princessofday: "princess",
goodgirlofday: "goodgirl",
catmomofday: "catmom",
stinkerofday: "stinker",
pirateofday: "pirate",
captainofday: "captain",
animalofday: "animal",
drinkofday: "drink",
drinkoofday: "drink",
ppofday: "pp",
};

// ===========================================
// 🗣️ WORD COUNTERS - CONFIGURATION
// ===========================================

const wordCounters = {
waffles: { label: "waffles" },
cookies: { label: "cookies" },
coffee: { label: "coffee" },
bananas: { label: "bananas" },
hugs: { label: "hugs" },
};

// ===========================================
// 🧠 MAIN CODE
// ===========================================

app.get("/", (req, res) => {
const senderRaw = req.query.sender || req.query.user || "someone";
const userRaw = req.query.user || "";
const type = (req.query.type || "beard").toLowerCase();
const sender = cleanUsername(senderRaw);
const senderDisplay = formatDisplayName(senderRaw);
const targetDisplay = formatDisplayName(userRaw);
const target = cleanUsername(userRaw) || sender;
const today = new Date().toLocaleDateString("en-GB");

if (specialUsers[sender] && specialUsers[sender][type])
return res.send(specialUsers[sender][type]);

const isAspectType =
  aspectsOfTheDay[type] !== undefined ||
  listAspectTriggers[type] !== undefined;

if (isAspectType) {
  if (!lock[type]) lock[type] = false;
  if (lock[type]) {
    return res.send(`Please wait a moment, ${type} of the Day is being updated.`);
  }
  lock[type] = true;
}

try {
const seed = `${today}-${type}-${sender}-${target}`;
let value,
message = "";

// ======================================================
// 🎁 FULL GIVEAWAY SYSTEM
// ======================================================

const blockedBots = ["streamelements", "nightbot", "moobot", "streamlabs"];

if (
  type === "giveaway" ||
  type === "giveawayroll" ||
  type === "giveawayreroll" ||
  type === "giveawaylist" ||
  type === "giveawaycount" ||
  type === "giveawayremove" ||
  type === "giveawayclear" ||
  type === "giveawaywinners"
) {

  // -------------------------------
  // 🎁 ENTER GIVEAWAY
  // -------------------------------

  if (type === "giveaway") {
    if (blockedBots.includes(sender)) {
      return res.send(`🤖 Bots cannot enter the giveaway.`);
    }

    const exists = giveawayEntries.find(e => e.user === sender);
    if (exists) {
      return res.send(`🎁 ${senderDisplay}, you are already entered in the giveaway!`);
    }

    giveawayEntries.push({
      user: sender,
      displayName: senderDisplay,
      timestamp: new Date()
    });

    return res.send(`🎁 ${senderDisplay} has entered the giveaway! Good luck! 🍀`);
  }

  // -------------------------------
  // 🎲 ROLL WINNER (does NOT clear entries)
  // -------------------------------

  if (type === "giveawayroll") {
    if (!giveawayEntries.length) {
      return res.send("😢 There are no giveaway entries yet!");
    }

    const winner =
      giveawayEntries[Math.floor(Math.random() * giveawayEntries.length)];

    giveawayWinners.push({
      user: winner.user,
      displayName: winner.displayName,
      prize: "Giveaway",
      timestamp: new Date()
    });

    return res.send(`🏆 Giveaway winner: ${winner.displayName}! 🎉`);
  }

  // -------------------------------
  // 🔁 REROLL WINNER (entries stay)
  // -------------------------------

  if (type === "giveawayreroll") {
    if (!giveawayEntries.length) {
      return res.send("😢 There are no giveaway entries to reroll!");
    }

    const winner =
      giveawayEntries[Math.floor(Math.random() * giveawayEntries.length)];

    giveawayWinners.push({
      user: winner.user,
      displayName: winner.displayName,
      prize: "Giveaway (Reroll)",
      timestamp: new Date()
    });

    return res.send(`🔁 Reroll winner: ${winner.displayName}! 🎉`);
  }

  // -------------------------------
  // 📜 LIST ENTRIES
  // -------------------------------

  if (type === "giveawaylist") {
    if (!giveawayEntries.length) {
      return res.send("📭 No one has entered the giveaway yet!");
    }

    const list = giveawayEntries
      .map((e, i) => `${i + 1}. ${e.displayName}`)
      .join(" | ");

    return res.send(`🎟️ Giveaway Entries (${giveawayEntries.length}): ${list}`);
  }

  // -------------------------------
  // 🔢 COUNT ENTRIES
  // -------------------------------

  if (type === "giveawaycount") {
    return res.send(`🎟️ There are currently ${giveawayEntries.length} giveaway entries.`);
  }

  // -------------------------------
  // ❌ REMOVE SOMEONE
  // -------------------------------

  if (type === "giveawayremove") {
    if (!userRaw) return res.send("⚠️ Please specify a user to remove.");

    const removeUser = cleanUsername(userRaw);
    const index = giveawayEntries.findIndex(e => e.user === removeUser);

    if (index === -1) {
      return res.send(`⚠️ @${removeUser} is not in the giveaway.`);
    }

    giveawayEntries.splice(index, 1);
    return res.send(`🗑️ @${removeUser} has been removed from the giveaway.`);
  }

  // -------------------------------
  // 🧹 CLEAR ENTRIES
  // -------------------------------

  if (type === "giveawayclear") {
    giveawayEntries.length = 0;
    return res.send("🧹 Giveaway entries have been cleared.");
  }

  // -------------------------------
  // 🏅 SHOW RECENT WINNERS
  // -------------------------------

  if (type === "giveawaywinners") {
    if (!giveawayWinners.length) {
      return res.send("📜 There are no recorded giveaway winners yet!");
    }

    const recent = giveawayWinners.slice(-5).reverse();

    const list = recent
      .map((w, i) => `${i + 1}. ${w.displayName}`)
      .join(" | ");

    return res.send(`🏅 Recent giveaway winners: ${list}`);
  }

  return;
}

// ===========================================
// 🤝 INTERACTIONS (with optional consent system + daily consent memory)
// ===========================================

if (interactions.includes(type) || type === "accept" || type === "deny") {
const requireConsent = req.query.consent === "true";
const today = new Date().toLocaleDateString("en-GB");

if (type === "accept") {
const pending = Array.from(pendingConsents.entries()).find(
  ([key, v]) => v.target === sender
);

if (!pending) {
  return res.send(`${senderDisplay}, there is nothing to accept.`);
}

const [targetKey, info] = pending;
clearTimeout(info.timeout);
pendingConsents.delete(targetKey);

if (!dailyConsents[today]) dailyConsents[today] = {};
if (!dailyConsents[today][sender]) dailyConsents[today][sender] = [];
if (!dailyConsents[today][sender].includes(info.sender)) {
  dailyConsents[today][sender].push(info.sender);
}

const special =
  specialInteractions[info.sender]?.[info.target]?.[info.type] ||
  specialInteractions["anyone"]?.[info.target]?.[info.type] ||
  specialInteractions[info.sender]?.["anyone"]?.[info.type] ||
  null;

if (special) {
  const forcedValue =
    special.value !== undefined
      ? special.value
      : generateValue(
          `${today}-${info.type}-${info.sender}-${info.target}`,
          info.type,
          100,
          1,
          info.sender
        );

  const reply = special.message
    .replaceAll("@{sender}", formatDisplayName(info.sender))
    .replaceAll("@{target}", formatDisplayName(info.target))
    .replaceAll("{value}", forcedValue);

  return res.send(reply);
}

const interactionSeed = `${today}-${info.type}-${info.sender}-${info.target}`;
const value = generateValue(
  interactionSeed,
  info.type,
  100,
  1,
  info.sender
);

const tempCfg = { min: 1, max: 100, levels: [30, 70] };
const joke = getJoke(req, info.type, value, tempCfg);
const actionWord = getActionWord(info.type);

return res.send(
  `${formatDisplayName(info.sender)} ${actionWord} ${formatDisplayName(
    info.target
  )} with ${value}% power!${joke}`
);
}

if (type === "deny") {
const pending = Array.from(pendingConsents.entries()).find(
  ([key, v]) => v.target === sender
);

if (!pending) {
  return res.send(`${senderDisplay}, there is nothing to deny.`);
}

const [targetKey, info] = pending;
clearTimeout(info.timeout);
pendingConsents.delete(targetKey);

return res.send(
  `🍑 ${formatDisplayName(info.target)} denied your ${
    info.type
  }, ${formatDisplayName(info.sender)}!`
);
}

const actionWord = getActionWord(type);

if (!userRaw || sender === cleanUsername(userRaw)) {
return res.send(`${senderDisplay} tried to ${type} the air! 💨`);
}

const alreadyApproved =
dailyConsents[today]?.[target]?.includes(sender) || false;

if (requireConsent && !alreadyApproved) {
if (pendingConsents.has(target)) {
  return res.send(
    `${targetDisplay} already has a pending consent request.`
  );
}

const timeout = setTimeout(() => {
  pendingConsents.delete(target);
}, CONSENT_TIMEOUT_MS);

pendingConsents.set(target, { sender, target, type, timeout });

return res.send(
  `🫱 ${senderDisplay} wants to ${type} ${targetDisplay}!\n` +
    `${targetDisplay}, type !accept or !deny within ${
      CONSENT_TIMEOUT_MS / 1000
    } seconds.`
);
}

const override =
specialInteractions[sender]?.[target]?.[type] ||
specialInteractions["anyone"]?.[target]?.[type] ||
specialInteractions[sender]?.["anyone"]?.[type] ||
null;

if (override) {
const forcedValue =
  override.value !== undefined
    ? override.value
    : generateValue(
        `${today}-${type}-${sender}-${target}`,
        type,
        100,
        1,
        sender
      );

let reply;

if (override.message) {
  reply = override.message
    .replaceAll("@{sender}", senderDisplay)
    .replaceAll("@{target}", targetDisplay)
    .replaceAll("{value}", forcedValue);
} else {
  const joke = getJoke(req, type, forcedValue, {
    min: 1,
    max: 100,
    levels: [30, 70],
  });
  reply = `${senderDisplay} ${actionWord} ${targetDisplay} with ${forcedValue}% power!${joke}`;
}

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;

commandCounters[type] = (commandCounters[type] || 0) + 1;

return res.send(reply);
}

const interactionSeed = `${today}-${type}-${sender}-${target}`;
const value = generateValue(interactionSeed, type, 100, 1, sender);

const tempCfg = { min: 1, max: 100, levels: [30, 70] };
const joke = getJoke(req, type, value, tempCfg);

const msg = `${senderDisplay} ${actionWord} ${targetDisplay} with ${value}% power!${joke}`;

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;

commandCounters[type] = (commandCounters[type] || 0) + 1;

return res.send(msg);
}

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
// 🏴‍☠️ SOTFEST COUNTDOWN 🏴‍☠️
// ===========================================

if (type === "sotfest") {
const now = new Date();
const currentYear = now.getFullYear();

let eventDate = new Date(`${currentYear}-07-10T00:00:00`);

if (now > eventDate) {
eventDate = new Date(`${currentYear + 1}-07-10T00:00:00`);
}
const diffMs = eventDate - now;
const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
const diffHours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
const diffMinutes = Math.floor((diffMs / (1000 * 60)) % 60);

const message =
`🏴‍☠️ Ahoy, ${senderDisplay}! The grand **SOTFEST** be drawin’ near!\n` +
`⏳ There be **${diffDays} days**, **${diffHours} hours**, and **${diffMinutes} minutes** ` +
`’til we set sail on **July 10th**, ye salty sea-dog! 🍻⚓`;

return res.send(message);
}

// ===========================================
// 🧮 GENERIC WORD COUNTERS (e.g. waffles)
// ===========================================

for (const [wordKey, cfg] of Object.entries(wordCounters)) {
const word = cfg.label || wordKey;

if (!wordsOfTheDay[wordKey]) wordsOfTheDay[wordKey] = {};
if (!wordsOfTheDay[wordKey][today]) {
wordsOfTheDay[wordKey][today] = { count: 0 };
}

const store = wordsOfTheDay[wordKey][today];

if (type === `add${wordKey}`) {
store.count += 1;
statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;

return res.send(
  `${senderRaw} has added "${word}" +1. Total "${word}" count today: ${store.count}.`
);
}

if (type === `remove${wordKey}`) {
if (store.count > 0) {
  store.count -= 1;
  statCounters[sender] = statCounters[sender] || {};
  statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
  commandCounters[type] = (commandCounters[type] || 0) + 1;

  return res.send(
    `${senderRaw} has removed "${word}" -1. Total "${word}" count today: ${store.count}.`
  );
} else {
  return res.send(
    `The "${word}" count is already 0. Cannot remove further.`
  );
}
}

if (type === wordKey) {
const count = store.count;
return res.send(
  `"${word}" has been said ${count} time${
    count !== 1 ? "s" : ""
  } today!.`
);
}
}

// ===========================================
// 🏅 QUERY: WHO IS X OF THE DAY?
// e.g. dadofday, pirateofday, drinkoofday
// ===========================================

if (type.endsWith("ofday")) {
const base = aspectOfTheDayAliases[type];
if (!base || !aspectsOfTheDay[base]) {
return res.send(
  `${senderDisplay}, that 'of the Day' title is not configured.`
);
}

const winner = aspectsOfTheDay[base]?.[today];
if (!winner) {
const noMsg =
  aspectOfTheDayNoWinnerMessages[base] ||
  "There is no winner yet today!";
return res.send(noMsg);
}

const builder =
aspectOfTheDayQueryMessages[base] ||
((w) => `The ${base} of the Day is ${formatDisplayName(w.user)}!`);

return res.send(builder(winner));
}

// ===========================================
// 📋 GENERIC LIST-BASED HANDLER
// ===========================================

const listGroups = [
{ map: colors, jokesKey: "colors" },
{ map: auravibes, jokesKey: "auravibes" },
{ map: piratevibes, jokesKey: "piratevibes" },
{ map: wizardvibes, jokesKey: "wizard" },
{ map: outfits, jokesKey: "outfits" },
{ map: elements, jokesKey: "elements" },
{ map: powers, jokesKey: "powers" },
{ map: pirateoutfits, jokesKey: "pirateoutfits" },
{ map: wizarditems, jokesKey: "wizarditems" },
{ map: elementalitems, jokesKey: "elementalitems" },
{ map: auraitems, jokesKey: "auraitems" },
{ map: animal, jokesKey: "animal" },
{ map: drink, jokesKey: "drink" },
];

for (const { map, jokesKey } of listGroups) {
if (map[type]) {
const cfg = map[type];

let index = generateValue(seed, type, cfg.list.length - 1, 0, sender);
let chosen = cfg.list[index];

const jokesForGroup = jokes[jokesKey] || [];
const joke = jokesForGroup[index] || "";

const trigger = listAspectTriggers[type];
const hasAspect = aspectsOfTheDay[type] !== undefined;

if (trigger && hasAspect) {
const alreadyWinner = Boolean(aspectsOfTheDay[type][today]);

const matchesTrigger =
chosen
  .toLowerCase()
  .includes(trigger.includes.toLowerCase());

if (!alreadyWinner && matchesTrigger) {
aspectsOfTheDay[type][today] = { user: sender, chosen };

const winnerFn = aspectOfTheDayMessages[type];
if (winnerFn) {
  message = winnerFn(senderDisplay, chosen, "", cfg);
} else {
  message = `${senderDisplay}, your ${cfg.label} today is ${chosen}! ${joke} 🏆 You are the ${cfg.label} of the Day! 🎉`;
}

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;

return res.send(message);
}

if (alreadyWinner && matchesTrigger) {
if (index < cfg.list.length - 1) index++;
else if (index > 0) index--;

chosen = cfg.list[index];
}
}

message = `${senderDisplay}, your ${cfg.label} today is ${chosen}! ${joke}`;

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;

return res.send(message);
}
}
// ===========================================
// 🔢 GENERIC NUMERIC-BASED HANDLER
// ===========================================

const messageTemplates = {

stats: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} is ${value}${space}${unit} today!${joke}`,

gym: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} is ${value}${space}${unit} today!${joke}`,

love: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} ${value}${space}${unit} today!${joke}`,

hate: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} is ${value}${space}${unit} today!${joke}`,

personality: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} is ${value}${space}${unit} today!${joke}`,

emotions: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} is ${value}${space}${unit} today!${joke}`,

skills: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} is ${value}${space}${unit} today!${joke}`,

actions: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} is ${value}${space}${unit} today!${joke}`,

hold: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} is ${value}${space}${unit} today!${joke}`,

carry: (sender, cfg, value, space, unit, joke) =>
`${sender}, ${cfg.label} is ${value}${space}${unit} today!${joke}`,

piracy: (sender, cfg, value, space, unit, joke) =>
`🏴‍☠️ ${sender}, ${cfg.label} be ${value}${space}${unit} today!${joke}`,

// ================================
// 🔥 CUSTOM OVERRIDES
// ================================

beard: (sender, cfg, value, space, unit, joke) =>
`${sender}, your glorious beard measures ${value}${space}${unit} today!${joke}`,

pp: (sender, cfg, value, space, unit, joke) =>
`${sender}, your mighty PP stands at ${value}${space}${unit} today!${joke}`,

princess: (sender, cfg, value, space, unit, joke) =>
`${sender}, your princess energy radiates at ${value}${space}${unit} today!${joke}`,

goodgirl: (sender, cfg, value, space, unit, joke) =>
`${sender}, your good girl level is ${value}${space}${unit} today!${joke}`,

default: (sender, cfg, value, space, unit, joke) =>
`${sender}, your ${cfg.label} is ${value}${space}${unit} today!${joke}`,
};

const numericGroups = [
{ map: stats,       category: "stats" },
{ map: gym,         category: "gym" },
{ map: love,        category: "love" },
{ map: hate,        category: "hate" },
{ map: personality, category: "personality" },
{ map: emotions,    category: "emotions" },
{ map: skills,      category: "skills" },
{ map: actions,     category: "actions" },
{ map: hold,        category: "hold" },
{ map: carry,       category: "carry" },
{ map: piracy,      category: "piracy" },
];

for (const { map, category } of numericGroups) {
if (!map[type]) continue; 

const cfg = map[type];

if (map === stats && type === "bb") {
const bandIndex = generateValue(seed, "bb_band", cfg.bands.length - 1, 0, sender);
const cupIndex  = generateValue(seed, "bb_cup",  cfg.cups.length - 1, 0, sender);

const band = cfg.bands[bandIndex];
const cup  = cfg.cups[cupIndex];
const size = `${band}${cup}`;

const cupRank = {
AA: 1,
A:  2,
B:  3,
C:  4,
D:  5,
DD: 6,
E:  7,
F:  8,
FF: 9,
G:  10,
GG: 11,
};

const rank = cupRank[cup] || 1;

let level;
if (rank <= 3) {
level = "low";
} else if (rank <= 6) {
level = "medium";
} else {
level = "high";
}

const biggestSize = `${cfg.bands[cfg.bands.length - 1]}${
cfg.cups[cfg.cups.length - 1]
}`;

const joke =
jokes.bb && jokes.bb[level]
? pickRandom(jokes.bb[level])
: "";

if (size === biggestSize && !aspectsOfTheDay.bb[today]) {
aspectsOfTheDay.bb[today] = { user: sender, size };
message = `${senderDisplay}, your size is ${size} today! 🎀 You are the Boob of the Day!`;
} else {
message = `${senderDisplay}, your boob size is ${size} today! ${joke}`;
}

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;
return res.send(message);
}

if (map === stats && type === "pp") {
const cfg = map[type];

const value = generateValue(seed, type, cfg.max, cfg.min, sender);

const cm = inchesToCm(value);
const joke = getJoke(req, type, value, cfg);

message = `${senderDisplay}, your ${cfg.label} is ${value} inches (${cm} cm) today!${joke}`;

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;

return res.send(message);
}

value = generateValue(seed, type, cfg.max, cfg.min, target);
const space = spaceIf(cfg.unitSpace);
const unit  = cfg.unit || "";

// ----------------------------
// 🌟 ASPECT OF THE DAY
// ----------------------------

const triggerValue = aspectsOfTheDayTriggers[type];
const hasAspect = aspectsOfTheDay[type] !== undefined;

if (triggerValue !== undefined && hasAspect) {
const winnerAlready = Boolean(aspectsOfTheDay[type][today]);

if (!winnerAlready && value === triggerValue) {
aspectsOfTheDay[type][today] = { user: sender, value };

const winnerFn = aspectOfTheDayMessages[type];
if (winnerFn) {
message = winnerFn(senderDisplay, value, space, cfg);
} else {
message = `${senderDisplay}, your ${cfg.label} is ${value}${space}${unit} today! 🎉 You are the ${cfg.label} of the Day!`;
}

statCounters[sender] = statCounters[sender] || {};
statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
commandCounters[type] = (commandCounters[type] || 0) + 1;

return res.send(message);
}

if (winnerAlready && value === triggerValue) {
if (value < cfg.max) value++;
else if (value > cfg.min) value--;
}
}

let level = "low";
if (cfg.levels && Array.isArray(cfg.levels)) {
if (value >= cfg.levels[0] && value <= cfg.levels[1]) level = "medium";
if (value > cfg.levels[1]) level = "high";
}

const joke = getJoke(req, type, value, cfg);

const template =
messageTemplates[type] ||
messageTemplates[category] ||
messageTemplates.default;

message = template(senderDisplay, cfg, value, space, unit, joke);

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
  if (
    aspectsOfTheDay[type] !== undefined ||
    listAspectTriggers[type] !== undefined
  ) {
    lock[type] = false;
  }
}
});

// ===========================================
// 🚫 URL PING
// ===========================================

app.get("/ping", (req, res) => {
res.send("");
});

// ===========================================
// 🚫 START SERVER
// ===========================================

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Daily Stat API running on port ${port}`));
