const { Server } = require("socket.io");
const axios = require("axios");
const { format } = require("date-fns");

module.exports = (req, res) => {
  if (!res.socket.server.io) {
    console.log("Setting up socket.io");

    // Configure CORS here
    const corsOptions = {
      origin: "https://client-seven-taupe.vercel.app/",
      methods: ["GET", "POST"],
    };

    const io = new Server(res.socket.server, {
      cors: corsOptions,
    });

    io.on("connection", (socket) => {
      console.log("user connected");
      socket.on("message", async (message, messageContext) => {
        const completionsURL = "https://chat.nbox.ai/api/chat/completions/";

        const body = JSON.stringify({
          temperature: 0.5,
          messages: [
            { role: "system", content: "You are ChatNBX" },
            ...messageContext,
            { role: "user", content: message },
          ],
          model: "nous-hermes-13b-4k",
          stream: false,
          max_tokens: 1000,
        });

        try {
          const response = await axios.post(completionsURL, body, auth);

          const chatNBXResponseObj = response.data.choices[0].message;

          const latestMessage = [
            ...messageContext,
            { role: "user", content: message },
            {
              role: chatNBXResponseObj.role,
              content: chatNBXResponseObj.content,
            },
          ];

          const latestMeta = {
            role: chatNBXResponseObj.role,
            content: chatNBXResponseObj.content,
            created: format(new Date(), "p"),
          };

          io.emit("response", latestMessage, latestMeta);
        } catch (error) {
          console.error("Error calling ChatNBX API:", error);
        }
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};
