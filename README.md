# ChatNBX Server

Welcome to the ChatNBX Server project! This server handles real-time communication using Socket.IO and connects with the ChatNBX API for chat completions.

## Prerequisites

- Node.js installed
- ChatNBX API key (obtain from https://chat.nbox.ai)

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd server
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   Create a .env file in the root of the Server directory with the following content:

   ```env
   API_KEY=<your-chatnbx-api-key>
   ```

4. Run the server:

   ```bash
   npm start
   ```

   The server will start on http://localhost:3000.

## Socket.IO Configuration

The server uses Socket.IO for real-time communication. Make sure to configure your frontend to connect to the correct Socket.IO endpoint.

Example in your frontend code:

```javascript
const socket = io("http://localhost:3000");
// Use the socket for communication
```

### CORS Configuration

Enable CORS for the respective frontend url.

```javascript
const io = require("socket.io")(3000, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});
```

For example, my frontend is deployed at the following url:

```env
FRONTEND_URL= "https://client-seven-taupe.vercel.app"
```

## API Endpoints

POST /api/chat/completions/: Endpoint for obtaining chat completions.

Example code to set up auth headers:

```javascript
const auth = {
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.API_KEY,
  },
};
```

## Deployment

Deploy the server to your preferred platform. Ensure the environment variables are configured appropriately.
Currently this server runs locally and the frontend code reflects this as well. 
