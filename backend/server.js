import "dotenv/config";
import express from "express";
import webhookRoutes from "./routes/webhookRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.text());

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.use("/webhook", webhookRoutes);
app.use("/api", apiRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
