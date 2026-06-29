# Kitulicek Slack Bot

> A fun and useful Slack bot for your team.

![Slack](https://img.shields.io/badge/Slack-4A154B?style=for-the-badge&logo=slack&logoColor=white)

## 📋 Description

**Kitulicek** is a simple yet practical Slack bot that brings fun and useful features to your workspace. It includes classic commands like rolling dice, random activity suggestions, compliments, and especially a convenient polling system.

## ✨ Features

### Available Commands

| Command                   | Description                                      | Example Usage                     |
|---------------------------|--------------------------------------------------|-----------------------------------|
| `/kitulicek-ping`         | Check bot latency                                | `/kitulicek-ping`                |
| `/kitulicek-help`         | Show all available commands                      | `/kitulicek-help`                |
| `/kitulicek-roll`         | Roll dice (supports XdY format)                  | `/kitulicek-roll 3d6`            |
| `/kitulicek-bored`        | Get a random activity suggestion                 | `/kitulicek-bored`               |
| `/kitulicek-compliment`   | Get a random compliment                          | `/kitulicek-compliment`          |
| `/kitulicek-poll`         | Create a poll (only in designated channel)       | `/kitulicek-poll Best food \| Pizza \| Sushi` |
| `/kitulicek-poll-delete`  | Delete a poll using message link                 | `/kitulicek-poll-delete [link]`  |

## 🛠 Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- Slack workspace with permissions to create a Slack App

### Installation


`git clone https://github.com/Kitulik/kitulicek`

`cd kitulicek`

`npm install`


### Configuration

Create a `.env` file in the root directory:


`SLACK_BOT_TOKEN=xoxb-your-bot-token`

`SLACK_APP_TOKEN=xapp-your-app-token`


### Running the bot


`node index.js`

## ⚙️ Slack App Setup

1. Create a new Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Enable **Socket Mode**
3. Add all Slash Commands (`/kitulicek-*`)
4. Add the following OAuth Scopes:
   - `app_mentions:read`
   - `channels:history`
   - `chat:write`
   - `commands`
   - `reactions:write`

## 📍 Configuration

Poll channel is restricted in the code:


`const POLL_CHANNEL_ID = "C0P5NE354";`


Change this ID to match your desired poll channel.

## 📄 License

MIT