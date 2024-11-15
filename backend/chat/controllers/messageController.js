import Message from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  const { username, text } = req.body;
  try {
    const newMessage = await Message.create({ username, text });
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.findAll();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};
