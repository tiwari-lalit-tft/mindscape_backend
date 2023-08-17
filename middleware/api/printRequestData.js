const _ = require("lodash");
const { colors } = require("../../utils/constants");
const { isProdServer } = require("../../utils/shared");

/**
 * print request data
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.printRequestData = (req, res, next) => {
  res.on("finish", () => {
    const time = isProdServer()
      ? new Date().toUTCString()
      : new Date().toLocaleString();
    const requestedUrl = req.originalUrl;
    const userId = req.user?._id || "";
    const email = req.user?.email || "";
    if (isProdServer()) {
      console.log(
        `[${time}] : ${req.method.toUpperCase()} : Status ${res.statusCode
        } :  User ID ${userId} Email - ${email} - for endpoint ${requestedUrl} ${!_.isEmpty(req.body) ||
          !_.isEmpty(req.params) ||
          !_.isEmpty(req.query)
          ? `Request Body - ${JSON.stringify(
            req.body
          )}, Request Params - ${JSON.stringify(
            req.params
          )}, Request Query - ${JSON.stringify(req.query)}`
          : ""
        }`
      );
    } else {
      console.log(
        `[${time}] : ${req.method.toUpperCase()} : Status ${colors.fgYellow}${res.statusCode
        }${colors.reset} :  User ID ${colors.fgRed}${userId} ${colors.reset
        } - Email - ${colors.fgRed}${email}${colors.reset
        } for endpoint ${requestedUrl} ${!_.isEmpty(req.body) ||
          !_.isEmpty(req.params) ||
          !_.isEmpty(req.query)
          ? `Request Body - ${JSON.stringify(
            req.body
          )}, Request Params - ${JSON.stringify(
            req.params
          )}, Request Query - ${JSON.stringify(req.query)}`
          : ""
        }`
      );
    }
  });
  next();
};
