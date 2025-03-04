import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/router.js";
import bodyParser from "body-parser";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.static("public"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Add this to parse JSON request body

app.use("/", authRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/submit-job", (req, res) => {
  console.log(req.body);
});

app.post("/submit-contacts", (req, res) => {
  console.log(req.body);
});

app.post("/login", (req, res) => {
  console.log(req.body);
});

app.post("/register", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
