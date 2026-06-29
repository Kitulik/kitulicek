require("dotenv").config();
const axios = require("axios");

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}

const numberEmojis = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "keycap_ten"
];

app.command("/kitulicek-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms\nI am awake.` });
});

app.command("/kitulicek-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/kitulicek-ping - Check bot latency
/kitulicek-roll - Roll dice
/kitulicek-bored - Get a random activity suggestion
/kitulicek-compliment - Get a random compliment
/kitulicek-pool - Create a poll (only in <#C0P5NE354>)
/kitulicek-pool-delete - Delete your poll (only in <#C0P5NE354>)`
  });
});

app.command("/kitulicek-roll", async ({ command, ack, respond }) => {
  await ack();

  if (!command.text.trim()) {
    await respond({
        text: "❌ You need to use format **XdY**.\nFor example:\n• `/kitulicek-roll d20`\n• `/kitulicek-roll 3d6`\n• `/kitulicek-roll 2d10`"
    });
    return;
  }

  const parts = command.text.split("d");

  const count = parts[0] === "" ? 1 : parseInt(parts[0]);
  const sides = parseInt(parts[1]);

  const rolls = [];
  let total = 0;

  for (let i = 0; i < count; i++) {
    const roll = getRandomInt(sides);
    rolls.push(roll);
    total += roll;
  }

  await respond({
    text: `🎲 Rolled ${count}d${sides}\nResults: ${rolls.join(", ")}\nTotal: ${total}`
  });
});

app.command("/kitulicek-bored", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    await respond({ text: `
      What you can do:\n${response.data.activity}
      Availability: ${response.data.availability}
      Price: ${response.data.price}
      Type: ${response.data.type}
      Duration: ${response.data.duration}
      Kid Friendly: ${response.data.kidFriendly}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a bored activity. Go touch some grass!" });
  }
});

app.command("/kitulicek-compliment", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://api.ibrahimmoalim.dev/compliments/random");
    await respond({ text: `${response.data.text}` });
  } catch (err) {
    await respond({ text: "Failed to compliment you! But have a nice day!" });
  }
});

const POLL_CHANNEL_ID = "C0P5NE354"; // ID kanálu pro ankety

app.command("/kitulicek-poll", async ({command, ack, respond, client}) => {
  await ack();
  if (command.channel_id !== POLL_CHANNEL_ID) {
    await respond({
      response_type: "ephemeral",
      text: "❌ Polls can only be created in <#C0P5NE354>."
    });
    return;
  }

  if (!command.text.trim()) {
    await respond({
        text: "❌ You need to use this format\n• `/kitulicek-pool pool_name | answer1 | answer2 | answer3...`"
    });
    return;
  }

  const parts = command.text.split("|").map(p => p.trim()).filter(o => o.length);
  const poolName = parts[0];
  const answers = parts.slice(1);

  if (answers.length < 2) {
    await respond({
        text: "❌ You need to provide at least 2 answers for the pool."
    });
    return;
  }

  if (answers.length > 10) {
    await respond({
        text: "❌ You can provide a maximum of 10 answers for the pool."
    });
    return;
  }

  let pollText = `*${poolName}*\n\n`;

  answers.forEach((answer, index) => {
    const emoji = `${index + 1}️⃣`;
    pollText += `${emoji} ${answer}\n`;
  });

  pollText += `\ncreated by <@${command.user_id}>`;

  const result = await client.chat.postMessage({
    channel: command.channel_id,
    text: pollText
  });

  for (let i = 0; i < answers.length; i++) {
    await client.reactions.add({
      channel: command.channel_id,
      timestamp: result.ts,
      name: numberEmojis[i]
    });
  }
});

app.command("/kitulicek-poll-delete", async ({command, ack, respond, client}) => {
  await ack();

  if (command.channel_id !== POLL_CHANNEL_ID) {
    await respond({
      response_type: "ephemeral",
      text: "❌ This command can only be used in the poll channel."
    });
    return;
  }

  const link = command.text.trim();

  if (!link) {
    await respond({
      response_type: "ephemeral",
      text: "❌ Please provide a Slack message link.\n\nExample:\n`/kitulicek-poll-delete https://workspace.slack.com/archives/C123456789/p1234567890123456`"
    });
    return;
  }

  const match = link.match(/archives\/([A-Z0-9]+)\/p(\d+)/);

  if (!match) {
    await respond({
      response_type: "ephemeral",
      text: "❌ Invalid Slack message link."
    });
    return;
  }

  const channel = match[1];
  const rawTs = match[2];

  const ts = rawTs.slice(0, 10) + "." + rawTs.slice(10);

  try {
    await client.chat.delete({
      channel: channel,
      ts: ts
    }); 

    await respond({
      response_type: "ephemeral",
      text: "✅ Poll deleted successfully."
    });
  } catch (err) { 

    console.error(err);

    await respond ({
      response_type: "ephemeral",
      text: `❌ Failed to delete the poll.\n${err.data?.error ?? err.message}`
    });
  }
});


(async () => {
  await app.start();
  console.log("bot is running!");
})();