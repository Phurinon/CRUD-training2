const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { sequelize, connectDB } = require("./config/db");
const User = require("./models/user");
const Address = require("./models/address");
const Employee = require("./models/employee");
const cors = require("cors");
const logger = require("./logger");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
// const addressRoutes = require("./routes/address");

dotenv.config();
const app = express();

app.use(
  morgan("tiny", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.use(cors({
  origin: true,        // หรือจะใช้ "*" ถ้าไม่ใช้ credentials
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
// app.use("/api/address", addressRoutes);

app.get('/', (req, res) => {
  res.send('Backend is running');
});


// console.log(process.env.MARIADB_DB)
connectDB();

// logger.info("This is an info log");
// logger.error("This is an error log for testing");

sequelize
  .sync()
  .then(() => {
    app.listen(5000, () => {
      console.log("Server is runing on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
