// newsletterController.js
const Newsletter = require("../../models/newsLetter");
const { validateEmail } = require("../../utils/shared");

const subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!validateEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    const newSubscriber = await Newsletter.create({ email });
    res.status(201).json(newSubscriber);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Email is already subscribed" });
    }

    console.error("Error subscribing to newsletter:", error);
    res.status(500).json({ error: "Failed to subscribe to the newsletter" });
  }
};

const listSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find();
    res.status(200).json(subscribers);
  } catch (error) {
    console.error("Error listing subscribers:", error);
    res.status(500).json({ error: "Failed to list subscribers" });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const subscriberId = req.params.subscriberId;
    await Newsletter.findByIdAndDelete(subscriberId);
    res.status(200).send({ message: "unsubscribed successfully" });
  } catch (error) {
    console.error("Error unsubscribing from newsletter:", error);
    res.status(500).json({ error: "Failed to unsubscribe from the newsletter" });
  }
};

module.exports = {
  subscribe,
  listSubscribers,
  unsubscribe,
};
