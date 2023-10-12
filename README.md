# Web Scraping and Analysis Test

This project provides a web server that scrapes content from https://wsa-test.vercel.app/ and analyzes its sentiment to determine if it's positive, negative, or neutral. In addition to the API, the project also includes a web app named `qwik-app` for a user-friendly interface to the scraping service.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Overview](#overview)
- [API Endpoints](#api-endpoints)

## Installation

1. **Prerequisites**: Ensure you have [Node.js](https://nodejs.org/en/) installed on your machine.

2. **Clone the Repository**:
   ```bash
   git clone https://github.com/Switty6/WebScrapingAPI
   cd WebScrapingAPI
   ```

3. **Install Dependencies**:
   ```bash
   npm install
   ```
   or

   ```bash
   npm i
   ```

4. **Start the Server**:
   ```bash
   npm run dev
   ```

5. **Setup and Start the Web App (qwik-app)**:
   
   First, navigate to the `qwik-app` directory:
   ```bash
   cd qwik-app
   ```

   Install the dependencies for the web app:
   ```bash
   npm install
   ```

   Finally, start the web app:
   ```bash
   npm start
   ```

   Note: Ensure you run the web app in a separate console or terminal instance.

## Usage

Once the server is running, you can make a GET request to:
```
http://localhost:3000/scrape?url=https://wsa-test.vercel.app/
```

## Overview

- The system uses `fastify` for creating a web server, `puppeteer` for web scraping, and `fs` & `path` for file system operations.
- Positive and negative words are cached from external files to assist in sentiment analysis.
- The server scrapes data from the provided URL, extracts various content details, and then analyzes the sentiment of the content.

## API Endpoints

- **/scrape** (Method: GET)
  - **Parameters**: 
    - `url`: The URL of the website you want to scrape.
  - **Response**: JSON containing scraped content details and sentiment analysis result.