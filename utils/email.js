const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const { createVerificationToken } = require("./shared");

/**
 * Prepares to send email
 * @param {string} user - user object
 * @param {string} subject - subject
 * @param {string} htmlMessage - html message
 */
const prepareToSendEmail = async (
  user = {},
  subject = "",
  htmlMessage = "",
  attachments = []
) => {
  user = {
    name: user.firstName,
    email: user.email,
  };

  const data = {
    user,
    subject,
    htmlMessage,
    attachments
  };
  if (process.env.SENT_MAIL) {
    await sendEmail(data, (messageSent) =>
      messageSent
        ? console.log(`Email SENT to: ${user.email}`)
        : console.log(`Email FAILED to: ${user.email}`)
    );
  }
};

const sendEmail = async (data = {}, callback, throwErrOnFailure = false, csv) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_ADDRESS}>`,
      to: Array.isArray(data?.user?.email)
        ? data.user.email
        : `${data.user.name} <${data.user.email}>`,
      ...(data?.cc && { cc: data.cc }),
      subject: data.subject,
      html: data.htmlMessage,
      attachments: data.attachments
    };
    if (data?.cc?.length) {
      mailOptions.cc = data.cc;
    }
    if (callback && typeof callback === "function") {
      transporter.sendMail(mailOptions, (err) => {
        if (callback) {
          if (err) {
            console.log(err);
            return callback(false);
          }
          return callback(true);
        }
      });
    } else {
      return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            if (throwErrOnFailure) {
              return reject(err);
            } else {
              return resolve(false);
            }
          }
          return resolve(true);
        });
      });
    }
  } catch (error) {
    console.log("Error sending email - ", error);
  }
};

/**
 * Sends registration email
 * @param {string} locale - locale
 * @param {Object} user - user object
 */
const sendRegistrationEmailMessage = async (admin = {}) => {
  console.log("admin", admin);
  const verificationToken = createVerificationToken({
    admin_id: admin._id,
    email: admin?.email,
  });

  const url = `${process.env.BACKEND_URL}/verify_email/${verificationToken}`;
  const subject = "Verify your email at mindscape";
  const htmlMessage = await ejs.renderFile(
    path.resolve(path.join(__dirname, "../", "views", "verifyEmail.ejs")),
    {
      name: admin.firstName,
      url: url,
    }
  );
  await prepareToSendEmail(admin, subject, htmlMessage);
};

const sendWelcomeEmail = async (user = {}) => {
  const url = `${process.env.FRONTEND_URL}`; // Adjust the frontend URL
  const subject = "Welcome to Mindscape!";
  const htmlMessage = await ejs.renderFile(
    path.resolve(path.join(__dirname, "../", "views", "welcomeEmail.ejs")),
    {
      url: url,
    }
  );

  await prepareToSendEmail(user, subject, htmlMessage);
};

module.exports = {
  prepareToSendEmail,
  sendEmail,
  sendRegistrationEmailMessage,
  sendWelcomeEmail
};
