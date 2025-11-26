
NEED HELP?
====================================================
For a small donation, I will help you tailor the script to suit your needs. This includes.

- adding in new commands 
- altering "of the day" to change from say "Daddy of the day" to "Penguin of the day" 
- adding or removing jokes 
- adding new interactions such as "poke" or "prod"
- and more

DEPLOYING YOUR CUSTOM APICORE USING RENDER
====================================================

Bring your API to life on the web in just a few minutes! 
Follow this simple step-by-step guide to get your bot commands or API running.

----------------------------------------------------
1. PUSH TO GITHUB
----------------------------------------------------

Let’s start by putting your project online.

Steps:
1. Create a new GitHub repository (example name: CustomAPICore)
2. Add or upload your files:
   - CustomAPICore.js
   - package.json
   - (optional) README.md
3. Commit and push your changes to GitHub.

🎉 Once your code is pushed, your project is now accessible to Render!

🎉 Bonus tip 
- You can simply click "New Repository," then click on "Import a Repository" and use the following link https://github.com/FluffFaceYeti/CustomAPICommands---Tested-for-StreamElements-Fossabot
- Simply give it a name and GitHub will pull all the files over for you!

----------------------------------------------------
2. DEPLOY ON RENDER
----------------------------------------------------

Now let’s connect your GitHub repo to Render.

Steps:
1. Go to https://render.com
2. Sign in with your GitHub account.
3. Click “New +” → “Web Service”
4. Select your CustomAPICore repository.

Then set up your service like this:

- Environment: Node
- Build Command: npm install
- Start Command: npm start

Once everything looks good, click “Create Web Service.”

----------------------------------------------------
WHAT HAPPENS NEXT
----------------------------------------------------

Render will automatically:
- Clone your GitHub repo
- Install your dependencies (like express)
- Run your app using node CustomAPICore.js
- Give you a live link — something like:
  https://customapicore.onrender.com

🎯 You can now use that link in StreamElements, Fossabot, or anywhere your commands call the API!

----------------------------------------------------
3. UPDATING YOUR CODE
----------------------------------------------------

Need to make changes? Easy!

1. Edit your files locally.
2. Commit and push to GitHub.
3. Render will automatically redeploy the new version.

You can also manually redeploy anytime from your Render dashboard.

----------------------------------------------------
4. IMPORTANT NOTE ABOUT FREE HOSTING
----------------------------------------------------

Render’s free tier is awesome for testing — but here’s what you should know:

- The service goes to sleep after 15 minutes of inactivity.
- When it wakes up (the first command after a break), it takes about 50 seconds to restart.
- For full 24/7 uptime and instant responses, consider upgrading to the $7/month plan.

----------------------------------------------------
QUICK RECAP
----------------------------------------------------

1️⃣ Push your files to GitHub
2️⃣ Deploy to Render as a Web Service
3️⃣ Set Environment = Node, Build = npm install, Start = npm start
4️⃣ Get your public API link and enjoy!
💡 Upgrade if you need constant uptime

----------------------------------------------------
4. Consider Donating? 
----------------------------------------------------

While this file is free to use:

- Some time has been spent on it, ensuring it is simple and easy to follow.
- It will allow you to have commands with stored replies, as well as optional things such as spaces and jokes.
- If you feel like sending a small thank-you tip, you can do so here.
- If you feel like sending a small thank-you tip, you can do so here.
- https://streamelements.com/FluffFaceYeti/tip

----------------------------------------------------
5. OnRender shuts down after 15 minutes of no activity?
----------------------------------------------------
- The free version does that, but there is a way to trick it!
- Create a StreamElements Timer 
- Have the timer run every 10 minutes when you are live 
- have the response be $(urlfetch https://yourusername.onrender.com/ping)
- So if your OnRender service is called waffles, it would be $(urlfetch https://waffles.onrender.com/ping)
- Set the chat lines to zero
- StreamElements will now ping your service every 10 minutes. Stopping the service from shutting down while you are live. 

----------------------------------------------------
6. BOT CUSTOMIZATION GUIDE V2 - Wriiten by FluffFaceyeti
----------------------------------------------------

This guide provides clear instructions on how to customize the bot to make it more interactive, fun, and personalized for your stream!

----------------------------------------------------
🕹️ Adding new Mini-Games
----------------------------------------------------

Find the following block 

```yaml
const miniGames = {
rps: rockPaperScissors,
tugofwar: tugOfWar,
diceroll: diceRoll,
coinflip: coinFlip,
rpsls: rpsls,
highorlow: highOrLow,
};
```

add the name of your game inside it for example

```yaml
const miniGames = {
rps: rockPaperScissors,
tugofwar: tugOfWar,
diceroll: diceRoll,
coinflip: coinFlip,
rpsls: rpsls,
highorlow: highOrLow,
bse: baconsauceegg,
};
```
Then simply copy one of the existing game blocks and tailor it to your needs for example. Lets take the Rock paper Scissors block and make it breakfast themed! 

```yaml
// ===========================================
// 🎮 ROCK PAPER SCISSORS - BREAKFAST VERSION
// ===========================================

function baconsauceegg(sender, target) {
  const pairSeed = dailyPairSeed("rps", sender, target);
  const hash = crypto.createHash("md5").update(pairSeed).digest("hex");
  const num = parseInt(hash.slice(0, 8), 16);

  const choices = ["bacon", "sausage", "egg"];
  const senderMove = choices[num % 3];
  const targetMove = choices[(num >> 2) % 3];

  if (senderMove === targetMove)
    return `${sender}, it's a tie with ${target}! Both chose ${senderMove}. 😅`;

  if (
    (senderMove === "bacon" && targetMove === "egg") ||
    (senderMove === "sausage" && targetMove === "bacon") ||
    (senderMove === "egg" && targetMove === "sausage")
  )
    return `${sender} wins! ${senderMove} beats ${targetMove}. 😎`;

  return `${target} wins! ${targetMove} beats ${senderMove}. 😂`;
}
```

And now you have a breakfast themed mini game for your chatters to enjoy!

----------------------------------------------------
🌟 Special Users
----------------------------------------------------

Special users are individuals who have personalized messages when they use specified commands.

To add a new special user, simply add their name and custom messages under specialUsers:
Each command will deliver a custom message like so.

```yaml
const specialUsers = {
newuser123: {
beard: "@newuser123, your beard is majestic like a wizard!",
hair: "@newuser123, LUL You have no hair silly",
},
```

This will create personalized responses for newuser123.

you can add as many users as you like, simply extend the block like so. 

```yaml
const specialUsers = {
newuser123: {
beard: "@newuser123, your beard is majestic like a wizard!",
hair: "@newuser123, LUL You have no hair silly",
},
newuser123: {
beard: "@newuser123, your beard is majestic like a wizard!",
hair: "@newuser123, LUL You have no hair silly",
},
```

----------------------------------------------------
🌟 Custom Interaction Messages
----------------------------------------------------

Special user interaction messages are individual personalized for actions!

To add a new special user, simply add their name and custom messages under specialUsers:

```yaml
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
```

This will create personalized responses username2 letting them know that usernam1 cuddled them with 10000% force.

----------------------------------------------------
😂 Jokes
----------------------------------------------------

Jokes are humorous messages that the bot sends during interactions. These jokes are categorized by different levels (low, medium, high), based on the user's actions or stats.

How it works:

Each joke category contains a list of jokes. The bot picks one from the appropriate category and sends it to the user when an interaction occurs.

How to add:

To add a new joke, simply go to the jokes block and add the new category (e.g., low, medium, high) with the jokes.

```yaml
sleep: {
low: ["You’re well-rested — alert and ready. 🦸", "You don’t need much sleep today. 😎"],
medium: ["You could use a nap later. 💤", "You’re doing fine, but bed is calling. 🛏️"],
high: ["You desperately need sleep. 😴", "Someone get you a pillow immediately. 🛌"],
```

Now, when someone runs the !sleep command the bot will respond with a joke based on the value they got!

----------------------------------------------------
📊 Stats
----------------------------------------------------

Stats are attributes like “beard length”, “hair length”, or “strength” that are tracked for each user. These stats have a minimum, maximum, and sometimes levels (e.g., 10 cm, 20 cm, 60 cm).

How it works:

The bot generates a random value within the specified range (min to max) for each stat and uses it to customize interactions.

How to add:

To add a new stat, add it to the stats block with its range (min, max) and levels. For example, adding a "catmom" stat:

```yaml
const stats = {
beard: { min: 1, max: 30, levels: [10, 25], unit: "cm", label: "beard", unitSpace: false },
hair: { min: 10, max: 100, levels: [30, 70], unit: "cm", label: "hair", unitSpace: false },
pp: { min: 3, max: 15, levels: [5, 7], unit: "inches", label: "pp", unitSpace: false },
bb: { label: "boob size", type: "bra", bands: [28, 30, 32, 34, 36, 38, 40, 42, 44], cups: ["AA", "A", "B", "C", "D", "DD", "E", "F", "FF", "G", "GG"], unitSpace: false, },
catmom: { min: 0, max: 100, levels: [30, 70], label: "Cat Mom level", unit: "%", unitSpace: false },
```
or 

```yaml
nerd: { min: 0, max: 100, levels: [30, 70], label: "nerd level", unit: "%", unitSpace: false },
```

This will track the user’s "fart" and assign them a value between 1 and 100.

----------------------------------------------------
🤝 Interactions
----------------------------------------------------

Interactions are actions like “hug”, “kiss”, or “slap” that users can perform. The bot generates a response based on the action, such as "User1 hugged User2 with 50% power."

How it works:

When a user performs an interaction, the bot randomly generates a value (e.g., "50% power") and displays a message with the interaction (e.g., "User1 high-fived User2 with 80% power!").

How to add:

To add a new interaction, simply add the name of the action to the interactions array:

```yaml
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
"tickle",
"poke",
];
```

Now, users can choose “tickle” as an interaction, and the bot will create a response for it.

----------------------------------------------------
🔄 Replacing Text in Interactions
----------------------------------------------------

The .replace() function allows you to modify how interactions are displayed. For example, “throwshoe” is replaced with “threw a shoe at”, making the response sound more natural.

How it works:

The .replace() function checks if the action corresponds to a specific word (e.g., "throwshoe") and replaces it with a more natural phrase (e.g., "threw a shoe at").

How to add:

To add a new interaction replacement, simply add a new .replace() line in the actionWord part of the code. For example, to replace “tickle” with a full sentence:
```yaml
.replace("tickle", "tickled")
```
The block of code to do this is near the bottom and looks like this. 

```yaml
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
```

This ensures the message becomes something like "User1 tickled User2 with 70% power!"

----------------------------------------------------
🌟 Creating "Of The Day" Aspects!
----------------------------------------------------

We have spent sometime working on our "Of The Day" aspects and have slimmed it down to make it easier for users to make additions to. 

here are the blocks that are used in Aspects Of The day. 

```yaml
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
```
to add a new value simply add your new value such aa "shoe" like so 

```yaml
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
shoe: {},
};
```
```yaml
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
```
These are the triggers that are used to decide the winner of the day. Lets say your shoe size is "4-17" and you wanted size 6 to be the Aspect of The day, you would add it like so. 

```yaml
const aspectsOfTheDayTriggers = {
pp: 15,
daddy: 100,
princess: 100,
goodgirl: 100,
catmom: 100,
stinker: 100,
pirate: 100,
captain: 100,
shoe: 6,
};
```
The second part of that block is for listed items and none numeric items. If you have a list of brands and wanted for example "nike" to win you would add it like so. 

```yaml
const listAspectTriggers = {
drink: {
includes: "🍸 martini",
},
animal: {
includes: "unicorn",
},
shoebrands: {
includes: "nike",
};
```

```yaml
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
```
The winning messages for Aspects of The day, once you have added your item and set the condition simply add a winning message into one of these blocks like so. 

shoesize: (senderDisplay, value, space, cfg) =>
`${senderDisplay}, your shoe size Level is ${value}${space}${cfg.unit} today! 🐾 You are the shoe size of the Day! 🎉`,
```
```yaml
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
```
These blocks allow other chatters to know who is the Aspect of The day holder. 

----------------------------------------------------
 🧮 GENERIC WORD COUNTER
----------------------------------------------------

In our latest edition of this code we have added a word counter. 

simply find this block 

```yaml
// ===========================================
// 🗣️ WORD COUNTERS - CONFIGURATION
// ===========================================

const wordCounters = {
  waffles: { label: "waffles" },
};
```

and add words to suit your needs

such as 

```yaml
  cookies: { label: "cookies" },
  coffee:  { label: "coffee" },
  bananas: { label: "bananas" },
  hugs:    { label: "hugs" },
  ```
  Now add a command series for them like this. 

```yaml
  !addcookies - ${customapi.https://yourusername.onrender.com?sender=${sender}&type=addcookies}
  !cookies - ${customapi.https://yourusername.onrender.com?sender=${sender}&type=cookies}
  !removecookies - ${customapi.https://yourusername.onrender.com?sender=${sender}&type=removecookies}
  ```
  
--------------------------------------------------
🌟 DATE COUNTDOWN
----------------------------------------------------

We left this block in our public branch instead of making it generic as a few people haved asked for it

```yaml
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
```
What does it do? 

It tells your chat exactly how many

Days, Hours and Minutes it is until a specific date wich in this case is July 10th! 

You can change this or add as many as you wish, Simply copy and paste the block below and change the dates and the wording! 

Note:
```yaml
const message =
`🏴‍☠️ Ahoy, ${senderDisplay}! The grand **SOTFEST** be drawin’ near!\n` +
`⏳ There be **${diffDays} days**, **${diffHours} hours**, and **${diffMinutes} minutes** ` +
`’til we set sail on **July 10th**, ye salty sea-dog! 🍻⚓`;
```
```yaml
${senderDisplay} - User who did the command 
${diffDays} - Days 
${diffHours} - Hours 
${diffMinutes} - Minutes 
```
Are the key factors here. Don't break them!

----------------------------------------------------
🌟 GIVEAWAYS
----------------------------------------------------

We have added a small Giveaway function within the code, As the code is pretty long I will make it very simple to follow 

```yaml
${customapi.https://yourusername.onrender.com?sender=${sender}&type=giveaway} - Enters someone into the giveaway 
```
```yaml
${customapi.https://yourusername.onrender.com?sender=${sender}&type=giveawayroll} - Rolls the giveaway - Suggested MOD only!
```
```yaml
${customapi.https://yourusername.onrender.com?sender=${sender}&type=giveawayreroll} - Re Rolls the giveaway - Suggested MOD only!
```
```yaml
${customapi.https://yourusername.onrender.com?sender=${sender}&type=giveawaylist} - Shows the entries - Suggested MOD only!
```
```yaml
${customapi.https://yourusername.onrender.com?sender=${sender}&type=giveawaycount} - Shows the entries Count - Suggested MOD only!
```
```yaml
${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=giveawayremove} - Remove someone from the giveaway - Suggested MOD only!
```
```yaml
${customapi.https://yourusername.onrender.com?sender=${sender}&type=giveawayclear} - Clears The Giveaway - Suggested MOD only!
```
```yaml
${customapi.https://yourusername.onrender.com?sender=${sender}&type=giveawaygiveawaywinnersclear} - Shows The Winners - Suggested MOD only!
```

----------------------------------------------------
YOU CAN NOW CUSTOMIZE THE BOT AND MAKE IT MORE ENGAGING FOR YOUR CHAT!
----------------------------------------------------

----------------------------------------------------
LINK EXAMPLES
----------------------------------------------------

----------------------------------------------------
😂 Jokes
----------------------------------------------------

Jokes are enabled by default, If you wish to remove them simply add 

```yaml
&jokes=false
```
At the end of your link.
example below:

```yaml
Beard:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=beard}
```
to

```yaml
Beard:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=beard&jokes=false}
```
----------------------------------------------------
CONSENT
----------------------------------------------------

We have implimented an optional consent system for all interactions. 
Simply alter your links as follows. 

```yaml
&consent=true
```
Within your link
example below:

```yaml
Boop:
${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=boop}
```
to

```yaml
Boop:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=boop&consent=true}
```

Now when someone tries to !spank someone it will ask the target user to consent using 
!accept 

Or 

!deny 

You will need to add these as commands using StreamElements, Fossabot or a bot of your choice. We have only tested it with these two and Nighbot for now. 

```yaml
!accept - ${customapi.https://yourusername.onrender.com?sender=${sender}&type=accept}
```
```yaml
!deny - ${customapi.https://yourusername.onrender.com?sender=${sender}&type=deny}
```
----------------------------------------------------
TARGETED LINKS
----------------------------------------------------

These links are slightly different as they include a target

----------------------------------------------------
Rock Paper Scissors
----------------------------------------------------

Note: Jokes for these blocks are pre-implemented, so the link does not need to contain &jokes=true
```yaml
rps: 
${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=rps}
```
```yaml
PP Duel:
${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=ppduel}
```
----------------------------------------------------
TIME ZONE EXAMPLES
----------------------------------------------------
```yaml
Use the time zone that works best for you

America/New_York
America/Chicago
America/Denver
America/Los_Angeles
America/Anchorage
Pacific/Honolulu
America/Phoenix
America/St_Johns
America/Halifax
America/Toronto
America/Winnipeg
America/Edmonton
America/Vancouver
America/Detroit
America/Indiana/Indianapolis
America/Kentucky/Louisville
America/Regina
America/Moncton
America/Whitehorse
America/Yellowknife
America/Iqaluit
```

----------------------------------------------------
BASE TYPES
----------------------------------------------------

How to use? 

For each command your link will look like this
```yaml
${customapi.https://yourusername.onrender.com?sender=${sender}&type=beard}
```
The key part being the end, That &type=beard tells the code and your bot wich part to look at and wich data to use in order to run the command. 
below is a list of the Types that come with the file as a default, you can add as many as you like by following the guides provided. 
For each command your link will look like this
```yaml
# 📊 Stats
&type=beard
&type=hair
&type=pp
&type=bb
&type=daddy
&type=catmom
&type=stinker
&type=fox
&type=nerd
&type=tinkabell
&type=princess
&type=goodgirl
```
```yaml
# ❤️ Love
&type=flame
```
```yaml
# 💔 Hate
&type=flamehate
```
```yaml
# 🧠 Personality
&type=clowning
&type=heroComplex
&type=darkHumor
&type=whimsicality
&type=ambition
&type=mischief
&type=bookishness
&type=zen
&type=selfConfidence
&type=thoughtfulness
&type=creativity
&type=spontaneity
&type=cookingSkills
&type=competitiveSpirit
&type=eccentricity
&type=sassiness
&type=imagination
&type=nurturingInstinct
&type=patience
&type=charisma
&type=luck
```
```yaml
# 🏋️ Gym
&type=lift
&type=run
&type=sprint
&type=deadlift
&type=curl
&type=row
&type=stretch
```
```yaml
# 🏦 Hold
&type=gold
```
```yaml
# 🏦 Carry
&type=weight
&type=items
```
```yaml
# 💪 Actions
&type=squeeze
&type=push
&type=jump
&type=press
&type=kick
&type=dodge
&type=roll
&type=slide
&type=climb
&type=punch
&type=block
&type=tackle
&type=throw
&type=kickflip
&type=spin
&type=uppercut
&type=grapple
```
```yaml
# 😃 Emotions & Feelings
&type=happiness
&type=anger
&type=calmness
&type=joy
&type=excitement
&type=energy
&type=sleep
&type=sadness
&type=anxiety
&type=love
&type=nostalgia
&type=gratitude
&type=guilt
&type=pride
&type=frustration
&type=hope
&type=love_hate_balance
```
```yaml
# 🎯 Skills
&type=precision
&type=accuracy
&type=focus
&type=flirting
&type=dj
&type=intelligence
&type=stealth
&type=cooking
&type=leadership
&type=negotiation
&type=martial_arts
&type=strength
&type=adaptability
```
```yaml
# 🏴‍☠️ Pirate Skills
&type=pirate
&type=captain
&type=treasure_hunting
&type=sea_navigation
&type=ship_maintenance
&type=swordsmanship
&type=swashbuckling
&type=plunder
&type=cannon_use
&type=crew_morale
&type=intimidation
&type=parley
```
```yaml
# 🐾 Animal Vibes
&type=animal
```
```yaml
# 🍹 Drink Vibes
&type=drink
```
```yaml
# 🎨 Colors
&type=colors
```
```yaml
# 🧘 Aura Vibes
&type=auravibes
```
```yaml
# 🏴‍☠️ Pirate Vibes
&type=piratevibes
```
```yaml
# 🧙 Wizard Vibes
&type=wizardvibes
```
```yaml
# 👗 Outfits / Styles
&type=outfits
```
```yaml
# ⚡ Elements
&type=elements
```
```yaml
# 🌟 Powers / Abilities
&type=powers
```
```yaml
# 🏴‍☠️ Pirate Accessories
&type=pirateoutfits
```
```yaml
# 🧙 Wizard Accessories
&type=wizarditems
```
```yaml
# 🌿 Elemental Accessories
&type=elementalitems
```
```yaml
# ✨ Aura Accessories
&type=auraitems
```
```yaml
These require targeted links such as 

${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=bonk}

If you wish to use the consent system, change it to the following

${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=bonk&consent=true}

# 🤝 Interactions
&type=bonk
&type=boop
&type=fliptable
&type=highfive
&type=hug
&type=kiss
&type=love
&type=pat
&type=slap
&type=spank
&type=throwshoe
```
