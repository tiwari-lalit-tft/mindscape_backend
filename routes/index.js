const express = require("express"),
  router = express.Router();
const userController = require("../controllers/user/index");
const projectController = require("../controllers/project");
const newsletterController = require("../controllers/newsLetter");
const contactController = require("../controllers/contact");

router.get("/save_user", userController.saveUser);
router.get("/verify_email/:token", userController.verifyEmail);
router.post("/update_user/:id", userController.updateUser);

router.post("/projects", projectController.createProject);
router.get("/projects", projectController.getAllProjects);
router.put("/projects/:projectId", projectController.updateProject);
router.delete("/projects/:projectId", projectController.deleteProject);

router.post("/subscribe", newsletterController.subscribe);
router.get("/subscribers", newsletterController.listSubscribers);
router.delete("/unsubscribe/:subscriberId", newsletterController.unsubscribe);

router.post("/contact", contactController.addContactMessage);

module.exports = router;