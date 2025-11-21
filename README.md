
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
6. BOT CUSTOMIZATION GUIDE
----------------------------------------------------

This guide provides instructions on how to customize the bot to make it more interactive, fun, and personalized for users.

----------------------------------------------------
🕹️ Mini-Games
----------------------------------------------------

Mini-games are small games that users can play with the bot, such as Rock Paper Scissors or Dice Roll. Each mini-game has its own set of rules.

How it works:

Each mini-game is assigned to a function (e.g., rockPaperScissors) and is triggered when the user interacts with the bot. For example, in Rock Paper Scissors, the bot randomly picks moves for the user and their opponent, then declares a winner.

How to add:

To add a new mini-game, simply list the game and its corresponding function in the miniGames block. please use other games for references For instance:

```yaml
const miniGames = {
rps: rockPaperScissors,
tugofwar: tugOfWar,
diceroll: diceRoll,
coinflip: coinFlip,
rpsls: rpsls,
highorlow: highOrLow,
newgame : newgame,
};
```
to add the game to your minigame list 

```yaml
// newgame
function rockPaperScissors(sender, target) {
const choices = ["bacon", "eggs", "pancakes", "sausage"];
const senderMove = pickRandom(choices); // Bot decides the sender's move
const targetMove = pickRandom(choices); // Bot decides the target's move

if (senderMove === targetMove) {
return `${sender}, it's a tie with ${target}! Both chose ${senderMove}.`;
}
if (
(senderMove === "bacon" && targetMove === "sausage") ||
(senderMove === "pancakes" && targetMove === "bacon") ||
(senderMove === "eggs" && targetMove === "pancakes")
) {
return `${sender} wins! ${senderMove} beats ${targetMove}.`;
}
return `${target} wins! ${targetMove} beats ${senderMove}.`;
}
```

You now have a breakfast-themed Rock Paper Scissors game.

----------------------------------------------------
🌟 Special Users
----------------------------------------------------

Special users are individuals who have personalized messages or actions when they interact with the bot. These users might receive compliments, jokes, or special interactions.

How it works:

The bot checks if the user is a special user and then displays a personalized message tailored to them. For example, a user named yourusername might receive a message about their majestic beard.

How to add:

To add a new special user, simply add their name and custom messages under specialUsers:

```yaml
const specialUsers = {
newuser123: {
beard: "@newuser123, your beard is majestic like a wizard!",
hair: "@newuser123, LUL You have no hair silly",
},
```

This will create personalized responses for newuser123.

----------------------------------------------------
😂 Jokes
----------------------------------------------------

Jokes are humorous messages that the bot sends during interactions. These jokes are categorized by different levels (low, medium, high), based on the user's actions or stats.

How it works:

Each joke category contains a list of jokes. The bot picks one from the appropriate category and sends it to the user when an interaction occurs.

How to add:

To add a new joke, simply go to the jokes block and add the new category (e.g., low, medium, high) with the jokes.

The way the code pulls in the joke from the Jokes Library is as follows.

```yaml
function getJoke(req, type, value) {
const level = value <= 30 ? "low" : value <= 70 ? "medium" : "high";
if (!isJokeEnabled(req, type)) return "";
if (!jokes[type] || !jokes[type][level]) return "";
return " " + pickRandom(jokes[type][level]);
}
``` 
This line of code tells the script to run "function getJoke(req, type, value) {const level = value <= 30 ? "low" : value <= 70 ? "medium" : "high";"
As seen below the script will run !sleep and if the persons replies are as followed the jokes will be selected from Low, Medium and High.

```yaml
sleep: { min: 0, max: 100, levels: [30, 70], label: "sleep needed", unit: "%", unitSpace: false },
sleep: is the cost identity label
min: 0, max: 100, are the minimum and maximum values
levels: [30, 70] this is the key part for the jokes. Anything below 30% is a Low joke, Anything from 31-70% is a Medium Joke, Anything 71-100% is a High joke.
label: "sleep needed" how the bot writes the value in chat "your SLEEP NEEDED is 16% today! You’re well-rested — alert and ready. 🦸"
unit: "%" the measurement value. This can be anything you want! yes it can even be a custom value such as hair or doodles.
unitSpace: false this simply means do you want a space after the unit so 16% would become 16 %. Some readings look better with spaces so I added this as an option
```
And then the joke will be called from this list. Feel free to make this your own. 

```yaml
sleep: {
low: ["You’re well-rested — alert and ready. 🦸", "You don’t need much sleep today. 😎"],
medium: ["You could use a nap later. 💤", "You’re doing fine, but bed is calling. 🛏️"],
high: ["You desperately need sleep. 😴", "Someone get you a pillow immediately. 🛌"],
```

Now, when newuser123 interacts, the bot will pick a joke based on the user's level.

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
🌟 Creating "Show of the Day"
----------------------------------------------------

"Show of the Day" is a special feature that highlights a user or value for the day. For example, a user could be selected as "Daddy of the Day" based on a fun stat or interaction.

How it works:

The bot randomly or based on performance selects a user for "Show of the Day" and displays a custom message. For instance, in the "Daddy of the Day" feature, the bot tracks the "daddy" stat and announces a winner when it hits 100%.

How to add:

To create a new "Show of the Day", define a new category like the "daddy" stat, and generate a response for the winner. Here’s an example of how to do it:

```yaml
if (type === "showoftheday") {
  const cfg = personality.showoftheday;
  const value = generateValue(seed, type, cfg.max, cfg.min, sender);
  const space = spaceIf(cfg.unitSpace);

  if (value === 100 && !aspectsOfTheDay.showoftheday[today]) {
    aspectsOfTheDay.showoftheday[today] = { user: sender, value };
    message = `${senderDisplay}, you're the Show of the Day with 100%! 🌟`;
  } else {
    message = `${senderDisplay}, your Show of the Day value is ${value}${space}% today!`;
  }

  statCounters[sender] = statCounters[sender] || {};
  statCounters[sender][type] = (statCounters[sender][type] || 0) + 1;
  commandCounters[type] = (commandCounters[type] || 0) + 1;
  return res.send(message);
}

if (type === "showofthedaywinner") {
  const winner = aspectsOfTheDay.showoftheday[today];
  return res.send(winner ? `🌟 The Show of the Day is ${formatDisplayName(winner.user)}!` : "There is no Show of the Day yet!");
}
```
This checks for the winner each day and announces them as the "Show of the Day".

----------------------------------------------------
Note: to add values into the "of the day" items, please find this line of code and change it to suit your needs.
----------------------------------------------------
```yaml
const aspectsOfTheDay = { daddy: {}, pp: {}, bb: {}, princess: {}, goodgirl: {} }; // storage for "of the Day"
```
So to add something, it would become.

```yaml
const aspectsOfTheDay = { daddy: {}, pp: {}, bb: {}, princess: {}, goodgirl: {}, something: {} }; // storage for "of the Day"
```
This way, the bot will only store selected values to ensure it is not saving every single command. 

----------------------------------------------------
 🧮 GENERIC WORD COUNTER
----------------------------------------------------

In our latest edition of this code we have added a word counyter. 

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
----------------------------------------------------
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
