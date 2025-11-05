
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

MAKING CHANGES
1. Mini-Games

What it is: Mini-games are small games that users can play with the bot, like Rock Paper Scissors or Dice Roll. Each mini-game has its own set of rules.

How it works: Each mini-game is assigned to a function (like rockPaperScissors) and is triggered by the bot when the user interacts. For example, in Rock Paper Scissors, the bot randomly picks moves for the user and their opponent, then declares a winner.

How to add:
To add a new mini-game, simply list the game and its corresponding function in the miniGames block. For example, if you have a game called newGame, you would add it like this:

miniGames.newGame = newGameFunction;


No code changes needed beyond that.

2. Special Users

What it is: Special users are users who have personalized messages or actions. They might get a compliment or joke whenever they interact with the bot.

How it works: The bot checks if the user is a special user, then displays a message tailored to them. For example, a user named yourusername might receive a message about their majestic beard.

How to add:
To add a new special user, just add their name and custom messages under specialUsers. For instance:

newuser123: {
  compliment: "@newuser123, you're a legend! 🌟",
  funFact: "@newuser123, did you know you have the fastest reflexes? 🦸‍♂️",
},


This creates personalized responses for newuser123.

3. Jokes

What it is: Jokes are humorous messages that the bot can send during interactions. They have different levels, like low, medium, and high, based on the user's actions or stats.

How it works: Each joke category (like low, medium, high) contains a list of jokes. When an interaction occurs, the bot picks one of the jokes and sends it to the user.

How to add:
To add a new joke, simply go to the jokes block and add a new category (like low, medium, or high) with your jokes. For example:

newuser123: {
  low: ["You look like you're ready to conquer the world! 💪", "Such a legend... just like your username. 😎"],
  medium: ["You’re definitely on the rise! 🔥", "I see the glow-up happening. 💖"],
  high: ["You're a rockstar! 🎸", "Superstar vibes coming through! 🌟"],
},


Now, when newuser123 interacts, the bot will pick a joke based on the user's level.

4. Stats

What it is: Stats are attributes like “beard length”, “hair length”, or “strength” that are tracked for each user. They have a minimum, maximum, and sometimes levels (e.g., 10 cm, 20 cm, 60 cm).

How it works: The bot generates a random value within the given range (min to max) for each stat and uses it to customize interactions.

How to add:
To add a new stat, you just need to add it to the stats block with its range (min, max) and levels. For instance, adding a "strength" stat could look like this:

strength: {
  min: 1,
  max: 100,
  levels: [20, 50, 80],
  unit: "kg",
  label: "strength",
  unitSpace: false,
},


This will track the user’s "strength" and assign them a value between 1 and 100.

5. Interactions

What it is: Interactions are actions like “hug”, “kiss”, or “slap” that users can perform. The bot generates a response based on the action, like "User1 hugged User2 with 50% power."

How it works: When a user performs an interaction, the bot randomly generates a value (like "50% power") and displays a message with the interaction (e.g., "User1 high-fived User2 with 80% power!").

How to add:
To add a new interaction, just add the name of the action to the interactions array:

"tickle",


Now, users can choose “tickle” as an interaction, and the bot will create a response for it.

6. Replacing Text in Interactions

What it is: The .replace() function allows you to modify how interactions are displayed. For example, "throwshoe" is replaced with "threw a shoe at", making the response more natural.

How it works: The .replace() function checks if the action corresponds to a specific word (like "throwshoe"), and replaces it with a more natural phrase ("threw a shoe at").

How to add:
To add a new interaction replacement, simply add a new .replace() line in the actionWord part of the code. For example, to replace “tickle” with a full sentence, add:

.replace("tickle", "tickled")


This ensures the message becomes something like "User1 tickled User2 with 70% power!"

7. Creating "Show of the Day"

What it is: "Show of the Day" is a special feature that highlights a user or value for the day. For example, a user could be selected as "Daddy of the Day" based on a fun stat or interaction.

How it works: The bot randomly or based on performance selects a user for "Show of the Day" and displays a custom message. For instance, in your example, the "Daddy of the Day" feature tracks the "daddy" stat and announces a winner when it hits 100%.

How to add:
You can create a new daily stat or feature (like "Show of the Day") by defining a new category, like the "daddy" stat, and generating a response. Here’s an example of how to do it for something like "Show of the Day":

if (type === "showoftheday") {
  const cfg = personality.showoftheday;  // your show of the day category
  value = generateValue(seed, type, cfg.max, cfg.min, sender);
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
  return res.send(
    winner
      ? `🌟 The Show of the Day is ${formatDisplayName(winner.user)}!`
      : "There is no Show of the Day yet!"
  );
}

This works in the same way as the "Daddy of the Day" block, but for any other value like "Show of the Day". You would create the showoftheday category and make a daily check for the winner.

Summary

To add a new feature (like a special user, joke, stat, or mini-game):

Find the relevant block (e.g., specialUsers, jokes, stats, interactions).

Add your new item to the corresponding block (no need to modify any code outside that).

The bot will automatically handle the rest!

With this, you can customize the bot to make it fun and interactive for the users. Let me know if you need more examples or explanations!

link examples

📊 STATS

Beard:
https://yourusername.onrender.com?sender=${sender}&type=beard&jokes=true

Hair:
https://yourusername.onrender.com?sender=${sender}&type=hair&jokes=true

PP (Penis Size):
https://yourusername.onrender.com?sender=${sender}&type=pp&jokes=true

Boob Size:
https://yourusername.onrender.com?sender=${sender}&type=bb&jokes=true

❤️ LOVE

Mila Loves You:
https://yourusername.onrender.com?sender=${sender}&type=mila&jokes=true

Ivy Loves You:
https://yourusername.onrender.com?sender=${sender}&type=ivy&jokes=true

Theo Loves You:
https://yourusername.onrender.com?sender=${sender}&type=theo&jokes=true

💔 HATE

Mila Hate:
https://yourusername.onrender.com?sender=${sender}&type=milahate&jokes=true

Ivy Hate:
https://yourusername.onrender.com?sender=${sender}&type=ivyhate&jokes=true

Theo Hate:
https://yourusername.onrender.com?sender=${sender}&type=theohate&jokes=true

🧠 PERSONALITY

Butt:
https://yourusername.onrender.com?sender=${sender}&type=butt&jokes=true

Daddy:
https://yourusername.onrender.com?sender=${sender}&type=daddy&jokes=true

Fox:
https://yourusername.onrender.com?sender=${sender}&type=fox&jokes=true

Nerd:
https://yourusername.onrender.com?sender=${sender}&type=nerd&jokes=true

Pirate:
https://yourusername.onrender.com?sender=${sender}&type=pirate&jokes=true

Sword Lunge:
https://yourusername.onrender.com?sender=${sender}&type=swordlunge&jokes=true

Flame:
https://yourusername.onrender.com?sender=${sender}&type=flame&jokes=true

Tinkabell:
https://yourusername.onrender.com?sender=${sender}&type=tinkabell&jokes=true

Princess:
https://yourusername.onrender.com?sender=${sender}&type=princess&jokes=true

Good Girl:
https://yourusername.onrender.com?sender=${sender}&type=goodgirl&jokes=true

🏋️ GYM STATS

Lift:
https://yourusername.onrender.com?sender=${sender}&type=lift&jokes=true

Run:
https://yourusername.onrender.com?sender=${sender}&type=run&jokes=true

Sprint:
https://yourusername.onrender.com?sender=${sender}&type=sprint&jokes=true

Deadlift:
https://yourusername.onrender.com?sender=${sender}&type=deadlift&jokes=true

Curl:
https://yourusername.onrender.com?sender=${sender}&type=curl&jokes=true

Row:
https://yourusername.onrender.com?sender=${sender}&type=row&jokes=true

Stretch:
https://yourusername.onrender.com?sender=${sender}&type=stretch&jokes=true

🏦 HOLD

Gold Pouch:
https://yourusername.onrender.com?sender=${sender}&type=gold&jokes=true

💪 ACTIONS

Squeeze:
https://yourusername.onrender.com?sender=${sender}&type=squeeze&jokes=true

Push:
https://yourusername.onrender.com?sender=${sender}&type=push&jokes=true

Jump:
https://yourusername.onrender.com?sender=${sender}&type=jump&jokes=true

Press:
https://yourusername.onrender.com?sender=${sender}&type=press&jokes=true

Kick:
https://yourusername.onrender.com?sender=${sender}&type=kick&jokes=true

😃 EMOTIONS & FEELINGS

Happiness:
https://yourusername.onrender.com?sender=${sender}&type=happiness&jokes=true

Anger:
https://yourusername.onrender.com?sender=${sender}&type=anger&jokes=true

Calmness:
https://yourusername.onrender.com?sender=${sender}&type=calmness&jokes=true

Joy:
https://yourusername.onrender.com?sender=${sender}&type=joy&jokes=true

Excitement:
https://yourusername.onrender.com?sender=${sender}&type=excitement&jokes=true

Energy:
https://yourusername.onrender.com?sender=${sender}&type=energy&jokes=true

Sleep:
https://yourusername.onrender.com?sender=${sender}&type=sleep&jokes=true

🎯 SKILLS

Precision:
https://yourusername.onrender.com?sender=${sender}&type=precision&jokes=true

Accuracy:
https://yourusername.onrender.com?sender=${sender}&type=accuracy&jokes=true

Focus:
https://yourusername.onrender.com?sender=${sender}&type=focus&jokes=true

Flirting:
https://yourusername.onrender.com?sender=${sender}&type=flirting&jokes=true

Luck:
https://yourusername.onrender.com?sender=${sender}&type=luck&jokes=true

DJ Skill:
https://yourusername.onrender.com?sender=${sender}&type=dj&jokes=true

🤝 INTERACTIONS

Bonk:
https://yourusername.onrender.com?sender=${sender}&type=bonk&jokes=true

Boop:
https://yourusername.onrender.com?sender=${sender}&type=boop&jokes=true

Flip Table:
https://yourusername.onrender.com?sender=${sender}&type=fliptable&jokes=true

High Five:
https://yourusername.onrender.com?sender=${sender}&type=highfive&jokes=true

Hug:
https://yourusername.onrender.com?sender=${sender}&type=hug&jokes=true

Kiss:
https://yourusername.onrender.com?sender=${sender}&type=kiss&jokes=true

Love:
https://yourusername.onrender.com?sender=${sender}&type=love&jokes=true

Pat:
https://yourusername.onrender.com?sender=${sender}&type=pat&jokes=true

Slap:
https://yourusername.onrender.com?sender=${sender}&type=slap&jokes=true

Spank:
https://yourusername.onrender.com?sender=${sender}&type=spank&jokes=true

Throw Shoe:
https://yourusername.onrender.com?sender=${sender}&type=throwshoe&jokes=true

MiniGames Example

For targeted mini-games like poduel:

PP Duel:
https://yourusername.onrender.com?sender=${sender}&user=${user}&type=poduel
