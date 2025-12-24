# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Node.js project that tracks S&P 500 index prices and Japanese Yen exchange rates (TTM), stores them in data.json, and sends daily notifications to Discord via GitHub Actions.

## Architecture

- **src/index.js** - Entry point, orchestrates data fetching and Discord notification
- **src/fetchSP500.js** - Scrapes S&P 500 closing prices from nikkeiyosoku.com using Cheerio
- **src/fetchTTM.js** - Scrapes TTS/TTB exchange rates from MURC
- **src/checkHoliday.js** - Checks if today is a US market holiday
- **src/sendDiscord.js** - Posts formatted message to Discord via webhook
- **data.json** - Stores historical data (SP500, TTM, calculated values)

## GitHub Actions

- **.github/workflows/notify.yml** - Runs weekdays at JST 10:00, executes notification and commits data.json

## Development

```bash
npm install          # Install dependencies
npm start            # Run notification locally
```

## Environment Variables

- `DISCORD_WEBHOOK_URL` - Discord webhook URL (set in GitHub Secrets)

## Tech Stack

- Node.js 24 (LTS)
- Cheerio for HTML parsing
- ES Modules (type: "module")
