const Contact = require("../../models/contact");

const addContactMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const newContactMessage = await Contact.create({ name, email, message });
    res.status(201).json(newContactMessage);
  } catch (error) {
    console.error("Error adding contact message:", error);
    res.status(500).json({ error: "Failed to add contact message" });
  }
};

module.exports = {
  addContactMessage,
};
