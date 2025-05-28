import express from "express";
import path from "path";
import session from 'express-session';
import { fileURLToPath } from "url";
import authRoutes from "./routes/router.js";
import bodyParser from "body-parser";
import {Controller} from './server/api/controller/controller.js'
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this to parse JSON request body
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  // cookie: { secure: true } //secure:true is only for HTTPS. Future work!.
}))
let sql_uri = "postgresql://wrpl-db_owner:npg_KH1Vyfn3GXjp@ep-sparkling-mud-a8u4ru91-pooler.eastus2.azure.neon.tech/wrpl-db?sslmode=require";
const sql = neon(sql_uri);
const db = drizzle({ client: sql });
const controller = new Controller(db);
app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/api/v1/submit-job", controller.postSubmitJob);
app.post("/api/v1/submit-contacts", controller.postSubmitContact);
app.post("/api/v1/login", controller.postLogin);
app.post("/api/v1/register", controller.postRegister);
app.post("/api/v1/reminders", (req, res) => {
  console.log(req.body);
});

app.delete("/api/v1/logout", controller.deleteLogout);

app.delete("/api/v1/contact", controller.deleteContact);
app.delete("/api/v1/job", controller.deleteJob);
// app.delete("/document", controller.deleteDocument);

app.get("/api/v1/jobs", controller.getJobs);
app.get("/api/v1/contacts", controller.getContacts);
// app.get("/documents", controller.getDocuments);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});