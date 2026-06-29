# Kitulicek - Slack Bot

Kitulicek is a slack bot that can roll a dice, create pools and more.

<img width="1376" height="714" alt="Image" src="https://github.com/user-attachments/assets/307794ae-0240-4234-b90b-c881290f31a8" />

# Ussage
You can use Kitulicek in Hack Club slack [#bot-spam channel](https://hackclub.enterprise.slack.com/archives/C0P5NE354). By starting typing /kitulicek-

# What can it do
| command | use |
| ------- | --- |
| /kitulicek-ping | Check bot latency |
| /kitulicek-roll | Roll any dice you can think of |
| /kitulicek-bored | Get a random activity suggestion |
| /kitulicek-compliment | You will get a random compliment |
| /kitulicek-pool | Create a poll (only in set channel) |
| /kitulicek-pool-delete | Delete your poll |

# How to run your own Kitulicek
## Prerequisites
- Node.js
- Slack workspace with permissions to create a Slack App

## Installation
git clone https://github.com/Kitulik/kitulicek

cd kitulicek

npm install

## Configuration
Create a `.env` file in the root directory:

`SLACK_BOT_TOKEN=xoxb-your-bot-token`

`SLACK_APP_TOKEN=xapp-your-app-token`

and change ID of poll channel

## Starting the bot
node index.js

## Slack App Setup
1. Create a new Slack App at [api.slack.com/apps](https://api.slack.com/apps)
2. Enable **Socket Mode**
3. Add all Slash Commands (`/kitulicek-*`)
4. Add the following OAuth Scopes:
   - `app_mentions:read`
   - `channels:history`
   - `chat:write`
   - `commands`
   - `reactions:write`

# License
MIT