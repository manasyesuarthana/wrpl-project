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

router.get("/contacts", (req, res) => {
  res.render("../views/contacts.ejs");
});

router.get("/reminders", (req, res) => {
  res.render("../views/reminders.ejs");
});

router.get('/documents', (req, res) => {
  const query = req.query.query || '';
  const page = parseInt(req.query.page) || 1;

  res.render('documents', {
    query,
    page
  });
});

router.get("/viewJobDetail", (req, res) => {
  res.render("job-detail");
});
export default router;