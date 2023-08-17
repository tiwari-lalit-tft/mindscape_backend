const { sendRegistrationEmailMessage, sendWelcomeEmail } = require("../../utils/email");
const user = require("../../models/user");
const { verify } = require("jsonwebtoken");

const saveUser = async (req, res) => {
  const { email,
    uid,
    displayName,
    emailVerified,
    photoURL,
    companyName,
    companySize } = req.body;
  if (!email) {
    return res.status(401).json({
      message: "Please enter email"
    });
  }
  try {
    let updated_user;
    updated_user = await user.findOne({ "email": email });
    if (!updated_user) {
      console.log("creating a new user");
      updated_user = await user.create({
        email,
        uid,
        displayName,
        verified: emailVerified,
        photoURL,
        companyName,
        companySize
      })
    }
    else {
      return res.status(400).json({
        message: "user already exists"
      });
    }
    if (!emailVerified) {
      sendRegistrationEmailMessage(updated_user);
      return res.status(200).json({
        message: "verification email sent successfully"
      });
    }
    return res.status(200).json({
      message: "user created !"
    });
  }
  catch (err) {
    console.log(err);
    res.status(400).send(err);
  }
}

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const { role, purpose, experience, department } = req.body;

  try {
    const updatedUser = await user.findByIdAndUpdate(
      userId,
      {
        role,
        purpose,
        experience,
        department,
      }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userSearch = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const get_user = await user.findOne({ email });

    if (!get_user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(get_user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return responses.sendResponse("Missing Token", 422, res);
    }

    const payload = verify(token, process.env.TOKEN_KEY);
    const updated_user = await user.findById(payload.admin_id);
    if (!updated_user) {
      return res.status(404).json({
        message: "User not found. Please sign up"
      });
    }
    updated_user.verified = true;
    await updated_user.save();
    sendWelcomeEmail(updated_user);
    return res.render('thanks');
  } catch (error) {
    console.log(error);
    return res.render('verificationError');
  }
};

module.exports = {
  saveUser,
  verifyEmail,
  updateUser,
  userSearch
}