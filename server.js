import express from "express";
import path from "path";
import session from 'express-session';
import { fileURLToPath } from "url";
import authRoutes from "./routes/router.js";
import bodyParser from "body-parser";
import {Controller} from './server/api/controller/controller.js'
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";



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

app.post("/submit-job", controller.postSubmitJob);

app.post("/submit-contacts", controller.postSubmitContact);

app.post("/login", controller.postLogin);

app.post("/register", controller.postRegister);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
