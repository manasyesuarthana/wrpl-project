import express from "express";

const router = express.Router();

// Route for signup page
router.get("/register", (req, res) => {
  res.render("forms/register.ejs");
});

// Route for signin page
router.get("/login", (req, res) => {
  res.render("forms/login.ejs");
});

router.get("/open-job-form", (req, res) => {
  res.render("forms/job-info-form.ejs");
});

router.get("/contact-page", (req, res) => {
  res.render("forms/contact-form.ejs");
});

export default router;