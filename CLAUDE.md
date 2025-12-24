# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Google Apps Script (GAS) project that tracks S&P 500 index prices and Japanese Yen exchange rates (TTM), stores them in a Google Spreadsheet, and sends daily notifications to Discord.

## Architecture

- **getSP500.js** - Scrapes S&P 500 closing prices from nikkeiyosoku.com using Cheerio, writes today's and yesterday's values to columns A-B in the spreadsheet
- **getTTM.js** - Scrapes TTS/TTB exchange rates from MURC, shifts previous values up one row, writes new values to columns E-F
- **sendDiscord.js** - Reads calculated values from the spreadsheet and posts a formatted message to Discord via webhook

All scripts share a common Google Spreadsheet (`1zgRu0By1dWlEDOkrhgBJ5rSQolAUgH33I5nyn7wPc6s`, sheet name: `シート1`) where:
- Rows 3-4: Raw data (yesterday/today SP500, TTS, TTB)
- Row 4, Column G: TTM (calculated in spreadsheet)
- Row 9, Column B: Day-over-day change percentage
- Row 10, Column B: Year-to-date performance

## Development Notes

- These are Google Apps Script files, not Node.js. They use GAS-specific APIs:
  - `UrlFetchApp.fetch()` for HTTP requests
  - `SpreadsheetApp.openById()` for spreadsheet access
  - `Cheerio` library (must be added via GAS Library menu)
- Deploy/test via Google Apps Script editor (script.google.com)
- Functions are typically triggered via GAS time-driven triggers
