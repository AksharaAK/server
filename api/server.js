const axios = require("axios");
require("dotenv").config();
const { format } = require("date-fns");

const io = require("socket.io")(3000, {
  cors: {
    origin: "https://client-seven-taupe.vercel.app/",
    methods: ["GET", "POST"],
  },
});

const auth = {
  headers: {
    "Content-Type": "application/json",
    Authorization: process.env.API_KEY,
  },
};
console.log("hello world");
io.on("connection", (socket) => {
  console.log("user is connected");
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
