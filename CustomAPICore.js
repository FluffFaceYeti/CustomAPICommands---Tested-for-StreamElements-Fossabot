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
// HELPERS
// ===========================================
function generateValue(seed, offset, max, min = 0) {
  const hash = crypto.createHash("md5").update(seed + offset).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);
  return (num % (max - min + 1)) + min;
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function jokesEnabled(req, type) {
  const global = req.query.jokes;
  if (global === "false") return false;
  if (global === "true") return true;
  const specific = req.query[`joke_${type}`];
  if (specific === "false") return false;
  if (specific === "true") return true;
  return true;
}

function cleanUsername(name = "") {
  return name.replace(/^@/, "").toLowerCase();
}

function formatDisplayName(name = "") {
  return name.startsWith("@") ? name : `@${name}`;
}

// ===========================================
// SPECIAL USERS
// HOW THEY SHOW UP IN CHAT
// If username1 wrote !hair in chat it would show up as 
// "@username, your hair is the longest ever!"
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
// STATS
// HOW THEY SHOW UP IN CHAT
// "@YOURNAME your (Classname) is (level)(Unit) long today!"
// "@YOURNAME your beard is 10cm long today!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&type=beard&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&type=beard&jokes=true)
// To remove jokes use "&jokes=false"
// ===========================================
const stats = {
  beard: { min: 1, max: 30, levels: [5, 15], unit: "cm", label: "beard", unitSpace: false },
  hair: { min: 10, max: 100, levels: [20, 60], unit: "cm", label: "hair", unitSpace: false },
  pp: { min: 4, max: 15, levels: [6, 10], unit: "inches", label: "pp", unitSpace: false },
};

// ===========================================
// LOVE
// HOW THEY SHOW UP IN CHAT
// "@YOURNAME, Pet1 loves you 87% today!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&type=mila&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&type=mila&jokes=true)
// To remove jokes use "&jokes=false"
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

// HATE
// HOW THEY SHOW UP IN CHAT
// "@YOURNAME, Pet1 hates you 23% today!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&type=mila_hate&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&type=mila_hate&jokes=true)
// To remove jokes use "&jokes=false"
// ===========================================
const hate = {
  pet1: { min: 0, max: 100, levels: [30, 70], label: "Pet1 hates you", unit: "%", unitSpace: false },
  pet2: { min: 0, max: 100, levels: [30, 70], label: "Pet2 hates you", unit: "%", unitSpace: false },
  person1: { min: 0, max: 100, levels: [30, 70], label: "Person1 hates you", unit: "%", unitSpace: false },
  person2: { min: 0, max: 100, levels: [30, 70], label: "Person2 hates you", unit: "%", unitSpace: false },
};

// ===========================================
// PERSONALITY
// HOW THEY SHOW UP IN CHAT
// "@YOURNAME your Thing Level is 82% today!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&type=daddy&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&type=daddy&jokes=true)
// To remove jokes use "&jokes=false"
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
// GYM
// HOW THEY SHOW UP IN CHAT
// "@YOURNAME your lift is 200kg today!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&type=lift&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&type=lift&jokes=true)
// To remove jokes use "&jokes=false"
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
// HOLD
// HOW THEY SHOW UP IN CHAT
// "@YOURNAME your gold pouch holds 50 coins today!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&type=gold&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&type=gold&jokes=true)
// To remove jokes use "&jokes=false"
// ===========================================
const hold = {
  gold: { min: 0, max: 100, levels: [30, 70], label: "gold pouch", unit: "coins", unitSpace: true },
};

// ===========================================
// ACTIONS
// HOW THEY SHOW UP IN CHAT
// "@YOURNAME your push power is 50kg today!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&type=push&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&type=push&jokes=true)
// To remove jokes use "&jokes=false"
// ===========================================
const actions = {
  squeeze: { min: 0, max: 100, levels: [30, 70], label: "squeeze strength", unit: "%", unitSpace: true },
  push: { min: 0, max: 100, levels: [30, 70], label: "push power", unit: "kg", unitSpace: true },
  jump: { min: 0, max: 100, levels: [30, 70], label: "jump height", unit: "cm", unitSpace: true },
  press: { min: 0, max: 100, levels: [30, 70], label: "press strength", unit: "kg", unitSpace: true },
  kick: { min: 0, max: 100, levels: [30, 70], label: "kick power", unit: "%", unitSpace: true },
};

// ===========================================
// EMOTIONS & FEELINGS
// HOW THEY SHOW UP IN CHAT
// "@YOURNAME your happiness is 80% today!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&type=happiness&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&type=happiness&jokes=true)
// To remove jokes use "&jokes=false"
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
// SKILLS
// HOW THEY SHOW UP IN CHAT
// "@YOURNAME, your precision is 87% today!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&type=precision&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&type=precision&jokes=true)
// To remove jokes use "&jokes=false"
// ===========================================
const skills = {
  precision: { min: 0, max: 100, levels: [30, 70], label: "precision", unit: "%", unitSpace: false },
  accuracy: { min: 0, max: 100, levels: [30, 70], label: "accuracy", unit: "%", unitSpace: false },
  focus: { min: 0, max: 100, levels: [30, 70], label: "focus level", unit: "%", unitSpace: false },
  flirting: { min: 0, max: 100, levels: [30, 70], label: "flirting skill", unit: "%", unitSpace: false },
  luck: { min: 1, max: 10, levels: [3, 7], label: "luck roll", unit: "/10", unitSpace: false },
};

// ===========================================
// INTERACTIONS
// HOW THEY SHOW UP IN CHAT
// Example (single): "@YOURNAME tried to boop the air with 45% power!"
// Example (targeted): "@SENDER booped @TARGET with 77% power!"
// Link for StreamElements: ${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=boop&jokes=true}
// Link for Fossabot: $(customapi https://yourusername.onrender.com?sender=${sender}&user=${user}&type=boop&jokes=true)
// To remove jokes use "&jokes=false"
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
// JOKES LIBRARY. I HAVE INCLUDED ALL MY JOKES
// ===========================================
const jokes = {
  tinkabell: {
    low: ["your fairy level is FUCKING DISGUSTING.","You shine bright like a diamond...covered in shit."],
    medium: ["Your wings are growing.","fairy trainign is starting to pay off."],
    high: ["peter pan would be so proud.","LOOK AT THAT PISS CURSE FLY."],
  },
  fox: {
    low: ["You are a sleepy fox today.","Your tail is drooping a little. Maybe get some rest."],
    medium: ["You are a curious fox exploring new burrows.","Your cunning is showing today."],
    high: ["You are a sly fox stealing hearts and sandwiches.","Everyone’s keeping an eye on you, clever fox."],
  },
  goodgirl: {
    low: ["You might need a few more pats to reach your full potential.","Trying, but could be better behaved today."],
    medium: ["Doing well — you deserve a treat.","A proper good girl performance today."],
    high: ["Excellent! Gold star for best behavior.","You’ve achieved maximum good girl mode."],
  },
  flame: {
    low: ["Agent Flame sent you a cold shoulder today.","The spark is weak — maybe light a match."],
    medium: ["Agent Flame nods in quiet approval.","There’s a warm glow between you and Flame."],
    high: ["Agent Flame can’t stop talking about you.","You are burning bright in Flame’s memory today."],
  },
  sleep: {
    low: ["You’re well-rested — alert and ready.","You don’t need much sleep today."],
    medium: ["You could use a nap later.","You’re doing fine, but bed is calling."],
    high: ["You desperately need sleep.","Someone get you a pillow immediately."],
  },  
  beard: {
    low: ["Patchy but proud!", "Still in early access version."],
    medium: ["Solid beard game!", "Respectable chin forest."],
    high: ["Wizard mode unlocked!", "That beard tells stories of adventure."],
  },
  hair: {
    low: ["Short and snappy!", "Buzzcut of confidence."],
    medium: ["Perfect flow length!", "Balanced and beautiful."],
    high: ["Rapunzel could never!", "That mane is a national treasure."],
  },
  pp: {
    low: ["Compact and efficient!", "Fun-sized champion!"],
    medium: ["Perfectly balanced.", "Reliable and effective!"],
    high: ["Legendary proportions!", "Folklore-worthy size!"],
  },
  mila: {
    low: ["Mila glanced and walked away.", "She tolerates your existence."],
    medium: ["Mila approves for now.", "She blinked slowly. That is cat love."],
    high: ["Mila purrs loudly in your honor!", "Mila adores you."],
  },
  ivy: {
    low: ["Ivy is pretending you do not exist.", "Denied cuddle privileges."],
    medium: ["Ivy tolerates you.", "She let you exist in her space."],
    high: ["Ivy loves you unconditionally!", "You are the chosen lap human!"],
  },
  theo: {
    low: ["Theo is pretending you do not exist.", "Theo left the room."],
    medium: ["Theo tolerates you.", "Theo sat next to you."],
    high: ["Theo loves you unconditionally!", "Theo will nap on you later."],
  },
  fluffy: {
    low: ["Fluffy wagged half a tail.", "Fluffy is ignoring your messages."],
    medium: ["Fluffy smiled a little.", "Fluffy seems mildly impressed."],
    high: ["Fluffy cannot stop purring!", "Fluffy thinks you are the best human!"],
  },
  daddy: {
    low: ["Not very daddy today.", "Maybe work on your confidence."],
    medium: ["You are somewhat daddy.", "The vibes are respectable."],
    high: ["Certified DILF energy.", "The room goes quiet when you enter."],
  },
  pirate: {
    low: ["You dropped your compass.", "Your ship is still in dock."],
    medium: ["You are swashbuckling nicely.", "The crew respects you."],
    high: ["Captain material!", "The seas whisper your name!"],
  },
  swordlunge: {
    low: ["You tripped on the lunge.", "Practice makes perfect."],
    medium: ["A clean strike.", "Your stance is strong."],
    high: ["A masterful lunge!", "Your enemies tremble in fear!"],
  },
  butt: {
    low: ["Flat as a plank.", "Not much bounce today."],
    medium: ["Nice curve going!", "A respectable peach."],
    high: ["Legend status!", "That is a certified fruit salad!"],
  },
  anger: {
    low: ["Calm as a monk.", "You are chill today."],
    medium: ["Mildly irritated.", "Someone cut you off in traffic."],
    high: ["Rage incarnate!", "Your keyboard fears for its life."],
  },
  princess: {
    low: ["A little scruffy today.", "Your tiara is crooked."],
    medium: ["Graceful enough.", "A respectable royal presence."],
    high: ["Royalty radiates from you!", "All hail the majestic princess!"],
  },
  nerd: {
    low: ["Barely read one wiki today.", "Low nerd output."],
    medium: ["Decent nerd energy.", "Glasses adjusted successfully."],
    high: ["Big brain mode activated!", "You just debugged reality itself!"],
  },
  bonk: {
    low: ["That was more of a gentle tap than a bonk.","You missed completely. Try again."],
    medium: ["A solid bonk — respectably executed.","You gave a good bonk. Not too hard, not too soft."],
    high: ["That bonk echoed through the land!","Maximum bonk achieved! Someone’s going to feel that."],
  },
  boop: {
    low: ["A small, hesitant boop.","Barely a touch — shy booper detected."],
    medium: ["Boop executed successfully.","That was a decent boop. Nose contact confirmed."],
    high: ["A powerful boop! You’ve mastered the art.","The world trembles before your booping power."],
  },
  fliptable: {
    low: ["You flipped a coaster instead of a table.","The table wobbled but didn’t flip."],
    medium: ["Table flipped! Drinks everywhere.","You flipped the table with respectable rage."],
    high: ["That table didn’t stand a chance.","Utter chaos. The table flew across the room."],
  },
  highfive: {
    low: ["You missed the hand completely.","Awkward air high-five. Maybe next time."],
    medium: ["Nice contact! That was a proper high-five.","Crisp sound, solid form — approved."],
    high: ["Perfect synchronization! That clap could summon thunder.","Legendary high-five! Everyone felt that energy."],
  },
  hug: {
    low: ["A quick and slightly awkward hug.","You went for a hug, but it turned into a polite pat."],
  medium: ["A warm, friendly hug.","That was a solid hug — wholesome and comfortable."],
  high: ["A legendary hug that could cure sadness.","Pure warmth and affection radiate from that hug."],
  },
  kiss: {
    low: ["You missed and kissed the air.","It was more of a smooch sound than an actual kiss."],
    medium: ["A sweet little kiss.","You shared a proper kiss — charming work."],
    high: ["That kiss could melt hearts.","Romance level: professional."],
  },
  love: {
    low: ["You tried to love, but it came out awkward.","Not feeling very affectionate today."],
    medium: ["A healthy dose of love shared.","You spread a reasonable amount of love."],
    high: ["Overflowing with love and positivity!","You radiate pure affection today."],
  },
  pat: {
    low: ["You missed and patted the air.","That pat was a bit weak, try again."],
    medium: ["A gentle and comforting pat.","Perfect pat form. Well done."],
    high: ["An excellent pat — pure serotonin.","Your pats bring joy to all."],
  },
  slap: {
    low: ["That was more of a light tap.","You hesitated — weak slap detected."],
    medium: ["A solid slap. Just the right amount of sting.","You delivered a respectable slap."],
    high: ["A thunderous slap heard across chat.","That slap will be remembered forever."],
  },
  spank: {
    low: ["A shy and hesitant spank.","You tried, but it barely registered."],
    medium: ["A confident spank with good form.","That spank landed nicely — well done."],
    high: ["A flawless spank. 10/10 execution.","You spanked like a pro — impressive work."],
  },
  throwshoe: {
    low: ["You threw a slipper instead of a shoe.","Missed completely. Shoe is lost forever."],
    medium: ["Direct hit! That was a clean throw.","You lobbed the shoe with respectable accuracy."],
    high: ["Bullseye! The shoe hit perfectly.","That throw could win the Olympics."],
  },
  lift: {
    low: ["You barely lifted it off the ground.","That bar isn’t impressed yet."],
    medium: ["Solid lift! Good form and focus.","You’re warming up nicely."],
    high: ["Beast mode activated!","That lift shook the gym!"],
  },
  run: {
    low: ["You walked more than you ran.","A light jog counts, right?"],
    medium: ["Smooth stride and steady breathing.","You’re keeping a great pace!"],
    high: ["You sprinted like the wind!","Track star energy today!"],
  },
  sprint: {
    low: ["More of a power walk than a sprint.","You tripped over enthusiasm."],
    medium: ["Quick burst of energy!","You dashed like you meant it!"],
    high: ["Lightning couldn’t keep up!","You left dust trails behind!"],
  },
  deadlift: {
    low: ["That barbell didn’t move much.","You gave it a polite tug."],
    medium: ["Solid lift! Muscles engaged.","Good pull with clean form."],
    high: ["Ground shaking deadlift!","That was a personal best!"],
  },
  curl: {
    low: ["Those curls need more conviction.","You lifted air with style."],
    medium: ["Nice pump forming!","Steady curl with proper form."],
    high: ["Biceps of steel!","Those arms could crush walnuts!"],
  },
  row: {
    low: ["You gently rocked the boat.","Barely moved the oars."],
    medium: ["Smooth rowing pace.","Consistent strokes, nice rhythm."],
    high: ["You powered through the water!","Rowing champion performance!"],
  },
  stretch: {
    low: ["You reached halfway there.","Could use more bend next time."],
    medium: ["Flexible and focused.","That stretch looked clean!"],
    high: ["Gymnast levels of flexibility!","You could join a yoga class!"],
  },
  gold: {
    low: ["Your pouch jingles modestly.","Not much shine in there today."],
    medium: ["Your pouch feels a bit heavier.","Steady earnings for a good day."],
    high: ["Your pouch overflows with coins!","You could buy the tavern today!"],
  },
  squeeze: {
    low: ["That’s the weakest handshake I’ve ever felt!","Barely a squeeze, try harder!","You could use a bit more grip strength."],
    medium: ["Not bad, you’re getting stronger!","Nice squeeze, a bit more power next time.","You're really getting the hang of it."],
    high: ["You could crush a watermelon with that squeeze!","Squeeze of a champion!","Your grip is as strong as steel!"]
  },
  push: {
    low: ["That push barely moved anything!","You pushed, but the wall didn’t budge.","Keep pushing, you’ll get stronger!"],
    medium: ["Nice push, you’ve got some power!","You're pushing the limits!","Solid push, not bad at all."],
    high: ["That push is like a bulldozer!","You're pushing like a pro!","That was a monster push!"]
  },
  jump: {
    low: ["That was more of a hop than a jump.","You’re getting there, but not quite yet.","Not bad for a small jump!"],
    medium: ["Great jump! You’re getting some air.","Nice leap, you’re on your way.","Good jump, you're in the zone!"],
    high: ["You jumped so high, you almost touched the stars!","You’ve got wings, my friend!","That was an Olympic-level jump!"]
  },
  press: {
    low: ["You barely moved the barbell.","That’s just a warm-up press.","You’re starting slow, but it’s okay."],
    medium: ["Good press! You’ve got some solid form.","Nice press, you’re making progress.","You’re building some solid strength."],
    high: ["That press could lift a truck!","You’re pressing like a powerlifter!","That press could break records!"]
  },
  kick: {
    low: ["That was more of a gentle tap.","Not a kick, more like a nudge!","You need to put more force into that."],
    medium: ["Nice kick, good form!","Your kick’s getting stronger!","Solid kick, you're improving."],
    high: ["That kick would knock someone out cold!","Your kick is unstoppable!","That kick would make a superhero proud!"]
  },
  happiness: {
    low: ["You might need a little more sunshine today!","Try smiling, it helps."],
    medium: ["Not bad, a bit of a smile would help.","You're halfway there, keep smiling."],
    high: ["You're glowing with happiness today!","You're the embodiment of joy right now!"]
  },
  anger: {
    low: ["Just a bit grumpy, huh?","You’re feeling a little off today."],
    medium: ["You're getting there, but take a deep breath.","A little fire in your soul today."],
    high: ["You're ready to smash things, calm down!","Easy there, Hulk. Let's take a breath."]
  },
  calmness: {
    low: ["A bit stressed today?","Maybe a deep breath might help."],
    medium: ["You're doing alright, deep breath.","Keeping it together, not bad."],
    high: ["You're the calmest person in the room right now.","Nothing can shake your calmness today."]
  },
  joy: {
    low: ["Not feeling too joyful yet, huh?","Try smiling and maybe some ice cream?"],
    medium: ["You're getting there, keep the good vibes rolling.","Things are looking brighter, huh?"],
    high: ["You're radiating pure joy right now!","Your joy could light up a whole city!"]
  },
  excitement: {
    low: ["Not much excitement today, maybe try something new?","You're just waking up to the fun."],
    medium: ["You're getting excited, just a little more!","Some excitement is building up!"],
    high: ["You're practically bouncing with excitement!","You’re so excited, it’s contagious!"]
  },
  // Category-level jokes
  love_group: {
    low: ["barely noticed you today.","is ignoring you again."],
    medium: ["seems to like you okay.","shared a little love."],
    high: ["is obsessed with you today.","can't stop thinking about you."]
  },
  hate_group: {
    low: ["barely annoyed with you.","shrugged it off."],
    medium: ["gave you a dirty look.","is not impressed."],
    high: ["absolutely furious with you.","can't stand you today."]
  },
  skills_group: {
    low: ["Your aim is terrible today.","Not very focused at all."],
    medium: ["You’re doing alright, could be sharper.","Pretty decent performance."],
    high: ["Perfect form and focus.","You could teach others today."]
  }
};

// ===========================================
// MAIN ROUTE
// ===========================================
app.get("/", (req, res) => {
  const senderRaw = req.query.sender || req.query.user || "someone";
  const userRaw = req.query.user || "";
  const type = (req.query.type || "beard").toLowerCase();
  const sender = cleanUsername(senderRaw);
  const target = cleanUsername(userRaw);
  const includeJokes = jokesEnabled(req, type);

  if (specialUsers[sender] && specialUsers[sender][type]) return res.send(specialUsers[sender][type]);

  const date = new Date().toLocaleDateString("en-CA", { timeZone: TIMEZONE });
  const seed = `${date}-${sender}-${target}`;
  const senderDisplay = formatDisplayName(senderRaw);
  const targetDisplay = formatDisplayName(userRaw);
  let message = "";

  const getJoke = (t, level) => {
    // priority: specific type jokes (jokes[t]) -> category group jokes -> none
    if (!includeJokes) return "";
    if (jokes[t] && jokes[t][level]) return " " + pickRandom(jokes[t][level]);
    if (love[t] && jokes["love_group"] && jokes["love_group"][level]) return " " + pickRandom(jokes["love_group"][level]);
    if (hate[t] && jokes["hate_group"] && jokes["hate_group"][level]) return " " + pickRandom(jokes["hate_group"][level]);
    if (skills[t] && jokes["skills_group"] && jokes["skills_group"][level]) return " " + pickRandom(jokes["skills_group"][level]);
    // fallback to category keys if they match exact type name (e.g., "love" interaction)
    if (jokes[t] && jokes[t][level]) return " " + pickRandom(jokes[t][level]);
    return "";
  };

  const spaceIf = (hasSpace) => (hasSpace ? " " : "");

  // STATS
  if (stats[type]) {
    const v = generateValue(seed, type, stats[type].max, stats[type].min);
    const [low, mid] = stats[type].levels;
    const level = v <= low ? "low" : v <= mid ? "medium" : "high";
    const space = spaceIf(stats[type].unitSpace);
    message = `${senderDisplay}, your ${stats[type].label} is ${v}${space}${stats[type].unit} today!${getJoke(type, level)}`;
  }

  // LOVE
  else if (love[type]) {
    const v = generateValue(seed, type, love[type].max, love[type].min);
    const [low, mid] = love[type].levels;
    const level = v <= low ? "low" : v <= mid ? "medium" : "high";
    const space = spaceIf(love[type].unitSpace);
    message = `${senderDisplay}, ${love[type].label} ${v}${space}${love[type].unit} today!${getJoke(type, level)}`;
  }

  // HATE
  else if (hate[type]) {
    const v = generateValue(seed, type, hate[type].max, hate[type].min);
    const [low, mid] = hate[type].levels;
    const level = v <= low ? "low" : v <= mid ? "medium" : "high";
    const space = spaceIf(hate[type].unitSpace);
    message = `${senderDisplay}, ${hate[type].label} ${v}${space}${hate[type].unit} today!${getJoke(type, level)}`;
  }

  // PERSONALITY
  else if (personality[type]) {
    const v = generateValue(seed, type, personality[type].max, personality[type].min);
    const [low, mid] = personality[type].levels;
    const level = v <= low ? "low" : v <= mid ? "medium" : "high";
    const space = spaceIf(personality[type].unitSpace);
    message = `${senderDisplay}, your ${personality[type].label} is ${v}${space}${personality[type].unit} today!${getJoke(type, level)}`;
  }

  // GYM
  else if (gym[type]) {
    const cfg = gym[type];
    const v = generateValue(seed, type, cfg.max, cfg.min);
    const [low, mid] = cfg.levels;
    const level = v <= low ? "low" : v <= mid ? "medium" : "high";
    const space = spaceIf(cfg.unitSpace);
    message = `${senderDisplay}, your ${cfg.label} at ${v}${space}${cfg.unit} today!${getJoke(type, level)}`;
  }

  // HOLD
  else if (hold[type]) {
    const cfg = hold[type];
    const v = generateValue(seed, type, cfg.max, cfg.min);
    const [low, mid] = cfg.levels;
    const level = v <= low ? "low" : v <= mid ? "medium" : "high";
    const space = spaceIf(cfg.unitSpace);
    message = `${senderDisplay}, your ${cfg.label} holds ${v}${space}${cfg.unit} today!${getJoke(type, level)}`;
  }

  // ACTIONS
  else if (actions[type]) {
    const cfg = actions[type];
    const v = generateValue(seed, type, cfg.max, cfg.min);
    const [low, mid] = cfg.levels;
    const level = v <= low ? "low" : v <= mid ? "medium" : "high";
    const space = spaceIf(cfg.unitSpace);
    message = `${senderDisplay}, your ${cfg.label} is ${v}${space}${cfg.unit} today!${getJoke(type, level)}`;
  }

  // EMOTIONS
  else if (emotions[type]) {
    const cfg = emotions[type];
    const v = generateValue(seed, type, cfg.max, cfg.min);
    const [low, mid] = cfg.levels;
    const level = v <= low ? "low" : v <= mid ? "medium" : "high";
    const space = spaceIf(cfg.unitSpace);
    message = `${senderDisplay}, your ${cfg.label} is ${v}${space}${cfg.unit} today!${getJoke(type, level)}`;
  }

  // SKILLS
  else if (skills[type]) {
    const cfg = skills[type];
    const v = generateValue(seed, type, cfg.max, cfg.min);
    const [low, mid] = cfg.levels;
    const level = v <= low ? "low" : v <= mid ? "medium" : "high";
    const space = spaceIf(cfg.unitSpace);
    // special handling for luck unit like "/10" where min might be 1
    message = `${senderDisplay}, your ${cfg.label} is ${v}${space}${cfg.unit} today!${getJoke(type, level)}`;
  }

  // INTERACTIONS
  else if (interactions.includes(type)) {
    const v = generateValue(seed, type, 100, 1);
    const level = v <= 30 ? "low" : v <= 70 ? "medium" : "high";
    if (!userRaw || sender === target) {
      message = `${senderDisplay} tried to ${type} the air with ${v}% power!${getJoke(type, level)}`;
    } else {
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

      message = `${senderDisplay} ${actionWord} ${targetDisplay} with ${v}% power!${getJoke(type, level)}`;
    }
  }

  else {
    message = `${senderDisplay}, invalid type. Try beard, hair, pp, mila, ivy, theo, or one of the fun ones like hug, boop, bonk, pat, etc.`;
  }

  res.send(message);
});

// ===========================================
// START SERVER
// ===========================================
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Daily Stat API running on port ${port}`));
