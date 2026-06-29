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

app.command("/kitulicek-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/kitulicek-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/kitulicek-ping - Check bot latency
/kitulicek-roll - Roll dice
/kitulicek-bored - Get a random activity suggestion`
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

(async () => {
  await app.start();
  console.log("bot is running!");
})();