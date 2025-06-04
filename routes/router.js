import express from "express";
import { countryIds } from '../server/db/country_id_seed.js';
import { applicationStatusEnum } from '../server/db/schema.js';
import { Controller } from '../server/api/controller/controller.js';
import { neon } from "@neondatabase/serverless"; // For DB connection if controller needs it passed
import { drizzle } from "drizzle-orm/neon-http";
import 'dotenv/config';


const router = express.Router();

// --- Initialize Controller (needs db instance) ---
// Database URL must be in .env
let controller;
if (process.env.DATABASE_URL) {
    const sql = neon(process.env.DATABASE_URL);
    const db = drizzle(sql);
    controller = new Controller(db);
} else {
    console.error("DATABASE_URL not set, controller cannot be initialized for POST route.");
}


// Authentication Middleware
const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user_id) {
    return next();
  } else {
    res.redirect('/login');
  }
};

// --- Public Routes ---
router.get("/register", (req, res) => {
  if (req.session.user_id) return res.redirect('/');
  res.render("forms/register", { title: "Register - JobTrek" });
});

router.get("/login", (req, res) => {
  if (req.session.user_id) return res.redirect('/');
  res.render("forms/login", { title: "Login - JobTrek" });
});

// --- Protected Routes ---
router.get("/open-job-form", isAuthenticated, (req, res) => {
  res.render("forms/job-info-form", {
    title: "Add New Job Application",
    countries: countryIds,
    statuses: applicationStatusEnum.enumValues,
    formData: {}, // Pass empty formData for initial render
    errors: {}    // Pass empty errors for initial render
  });
});

// MODIFICATION: New POST route for direct form submission
router.post("/submit-job-application", isAuthenticated, (req, res, next) => {
    if (!controller) {
        return next(new Error("Controller not initialized for job submission."));
    }
    controller.postSubmitJob(req, res, next);
});


router.get("/contact-page", isAuthenticated, (req, res) => {
  res.render("forms/contact-form", { title: "Add New Contact" });
});

router.get("/contacts", isAuthenticated, (req, res) => {
  res.render("contacts", { title: "My Contacts" });
});

router.get("/reminders", isAuthenticated, (req, res) => {
  res.render("reminders", { title: "My Reminders" });
});

router.get('/documents', isAuthenticated, (req, res) => {
  const query = req.query.query || '';
  const page = parseInt(req.query.page) || 1;
  res.render('documents', {
    title: "My Documents",
    query,
    page
  });
});

router.get("/viewJobDetail", isAuthenticated, controller.renderJobDetailPage);

// Route for displaying contacts page
router.get("/contacts", isAuthenticated, (req, res) => {
  res.render("contacts", { 
    title: "My Contacts" 
  });
});

// Route for the contact form page (to add new contacts)
router.get("/contact-page", isAuthenticated, (req, res) => {
  res.render("forms/contact-form", {
    title: "Add New Contact",
    formData: {}, 
    errors: {}
  });
});

router.get("/viewJobDetail", isAuthenticated, controller.renderJobDetailPage);
export default router;