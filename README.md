
DEPLOYING YOUR CUSTOMAPICORE USING RENDER
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
- you can simple click "New Repository" then click on "Import a Repository" and use the following link https://github.com/FluffFaceYeti/CustomAPICommands---Tested-for-StreamElements-Fossabot
- Simply give it a name and Github will pull all the files over for you!
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

- Sometime has been spent on it ensuring it is simple and easy to follow.
- It will allow you to have commands with stored replies as well as optional things such as spaces and jokes.
- If you feel like sending a small thank you tip you can do so here.
- If you feel like sending a small thank you tip you can do so here.
- https://streamelements.com/FluffFaceYeti/tip

----------------------------------------------------
5. OnRender shuts down after 15 minutes of no activity?
----------------------------------------------------
- The free version does that, But there is a way to trick it!
- Create a StreamElements Timer 
- Have the timer run ever 10 minutes when you are live 
- have the response be $(urlfetch https://yourusername.onrender.com/ping)
- So if your OnRender service is called waffles it would be $(urlfetch https://waffles.onrender.com/ping)
- Set the chat lines to zero
- StreamElements will now ping your service every 10 minutes. Stopping the service from shutting down while you are live. 
----------------------------------------------------

Bot Customization Guide

This guide provides instructions on how to customize the bot to make it more interactive, fun, and personalized for users.

🕹️ Mini-Games
What it is:

Mini-games are small games that users can play with the bot, such as Rock Paper Scissors or Dice Roll. Each mini-game has its own set of rules.

How it works:

Each mini-game is assigned to a function (e.g., rockPaperScissors) and is triggered when the user interacts with the bot. For example, in Rock Paper Scissors, the bot randomly picks moves for the user and their opponent, then declares a winner.

How to add:

To add a new mini-game, simply list the game and its corresponding function in the miniGames block. For instance:
```yaml
miniGames.newGame = newGameFunction;
```

No other code changes are needed beyond that.

🌟 Special Users
What it is:

Special users are individuals who have personalized messages or actions when they interact with the bot. These users might receive compliments, jokes, or special interactions.

How it works:

The bot checks if the user is a special user and then displays a personalized message tailored to them. For example, a user named yourusername might receive a message about their majestic beard.

How to add:

To add a new special user, simply add their name and custom messages under specialUsers:
```yaml
specialUsers: {
  newuser123: { 
    compliment: "@newuser123, you're a legend! 🌟", 
    funFact: "@newuser123, did you know you have the fastest reflexes? 🦸‍♂️",
  }
}
```
This will create personalized responses for newuser123.

😂 Jokes
What it is:

Jokes are humorous messages that the bot sends during interactions. These jokes are categorized by different levels (low, medium, high), based on the user's actions or stats.

How it works:

Each joke category contains a list of jokes. The bot picks one from the appropriate category and sends it to the user when an interaction occurs.

How to add:

To add a new joke, simply go to the jokes block and add the new category (e.g., low, medium, high) with the jokes.
```yaml
jokes: {
  newuser123: {
    low: ["You look like you're ready to conquer the world! 💪", "Such a legend... just like your username. 😎"],
    medium: ["You’re definitely on the rise! 🔥", "I see the glow-up happening. 💖"],
    high: ["You're a rockstar! 🎸", "Superstar vibes coming through! 🌟"]
  }
}
```

Now, when newuser123 interacts, the bot will pick a joke based on the user's level.

📊 Stats
What it is:

Stats are attributes like “beard length”, “hair length”, or “strength” that are tracked for each user. These stats have a minimum, maximum, and sometimes levels (e.g., 10 cm, 20 cm, 60 cm).

How it works:

The bot generates a random value within the specified range (min to max) for each stat and uses it to customize interactions.

How to add:

To add a new stat, add it to the stats block with its range (min, max) and levels. For example, adding a "strength" stat:
```yaml
stats: {
  strength: { 
    min: 1, 
    max: 100, 
    levels: [20, 50, 80], 
    unit: "kg", 
    label: "strength", 
    unitSpace: false 
  }
}
```
or 

```yaml
bunny: { min: 1, max: 30, levels: [5, 15], unit: "cm", label: "Bunny Size", unitSpace: false },
```

This will track the user’s "strength" and assign them a value between 1 and 100.

🤝 Interactions
What it is:

Interactions are actions like “hug”, “kiss”, or “slap” that users can perform. The bot generates a response based on the action, such as "User1 hugged User2 with 50% power."

How it works:

When a user performs an interaction, the bot randomly generates a value (e.g., "50% power") and displays a message with the interaction (e.g., "User1 high-fived User2 with 80% power!").

How to add:

To add a new interaction, simply add the name of the action to the interactions array:
```yaml
interactions: [
  "tickle"
]
```

Now, users can choose “tickle” as an interaction, and the bot will create a response for it.

🔄 Replacing Text in Interactions
What it is:

The .replace() function allows you to modify how interactions are displayed. For example, “throwshoe” is replaced with “threw a shoe at”, making the response sound more natural.

How it works:

The .replace() function checks if the action corresponds to a specific word (e.g., "throwshoe") and replaces it with a more natural phrase (e.g., "threw a shoe at").

How to add:

To add a new interaction replacement, simply add a new .replace() line in the actionWord part of the code. For example, to replace “tickle” with a full sentence:
```yaml
.replace("tickle", "tickled")
```

This ensures the message becomes something like "User1 tickled User2 with 70% power!"

🌟 Creating "Show of the Day"
What it is:

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

📋 Summary

To add a new feature (like a special user, joke, stat, or mini-game):

Find the relevant block (e.g., specialUsers, jokes, stats, interactions).

Add your new item to the corresponding block (no need to modify any code outside that).

The bot will handle the rest automatically!

This way, you can customize the bot and make it more engaging for users.

link examples

📊 STATS

Beard:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=beard}

Hair:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=hair}

PP (Penis Size):
${customapi.https://yourusername.onrender.com?sender=${sender}&type=pp}

Boob Size:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=bb}

❤️ LOVE

Mila Loves You:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=mila}

Ivy Loves You:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=ivy}

Theo Loves You:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=theo}

💔 HATE

Mila Hate:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=milahate}

Ivy Hate:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=ivyhate}

Theo Hate:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=theohate}

🧠 PERSONALITY

Butt:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=butt}

Daddy:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=daddy}

Fox:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=fox}

Nerd:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=nerd}

Pirate:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=pirate}

Sword Lunge:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=swordlunge}

Flame:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=flame}

Tinkabell:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=tinkabell}

Princess:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=princess}

Good Girl:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=goodgirl}

🏋️ GYM STATS

Lift:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=lift}

Run:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=run}

Sprint:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=sprint}

Deadlift:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=deadlift}

Curl:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=curl}

Row:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=row}

Stretch:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=stretch}

🏦 HOLD

Gold Pouch:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=gold}

💪 ACTIONS

Squeeze:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=squeeze}

Push:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=push}

Jump:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=jump}

Press:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=press}

Kick:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=kick}

😃 EMOTIONS & FEELINGS

Happiness:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=happiness}

Anger:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=anger}

Calmness:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=calmness}

Joy:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=joy}

Excitement:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=excitement}

Energy:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=energy}

Sleep:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=sleep}

🎯 SKILLS

Precision:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=precision}

Accuracy:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=accuracy}

Focus:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=focus}

Flirting:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=flirting}

Luck:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=luck}

DJ Skill:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=dj}

🤝 INTERACTIONS

Bonk:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=bonk}

Boop:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=boop}

Flip Table:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=fliptable}

High Five:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=highfive}

Hug:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=hug}

Kiss:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=kiss}

Love:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=love}

Pat:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=pat}

Slap:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=slap}

Spank:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=spank}

Throw Shoe:
${customapi.https://yourusername.onrender.com?sender=${sender}&type=throwshoe}

MiniGames Example
rps: (Rock Paper Scissors)
${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=rps}

PP Duel:
${customapi.https://yourusername.onrender.com?sender=${sender}&user=${user}&type=poduel}
