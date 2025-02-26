import express from "express";

const router = express.Router();

// Route for signup page
router.get("/signup", (req, res) => {
  res.render("forms/signup.ejs");
});

// Route for signin page
router.get("/signin", (req, res) => {
  res.render("forms/signin.ejs");
});

export default router;
