require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const connectDB = require("./utils/db");
connectDB();

const { AuthRoutes } = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/auth", AuthRoutes);

app.get("/api/hello", (req, res) => {
    res.status(200).json({ success: true, message: "Hello from the backend!" });
});

app.post("/api/echo", (req, res) => {
    const { message } = req.body;
    res.status(200).json({ success: true, message: `You sent: ${message}` });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on: http://localhost:${PORT}`);
});

module.exports = app;
