const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../models/user");
const logger = require("../logger"); // นำเข้า logger
require("dotenv").config();
// Route สำหรับ register user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, age, role } = req.body;

    if (!email) {
      logger.warn("POST /register - Email is required");
      return res.status(400).json({ message: "Email is required" });
    }

    if (!password) {
      logger.warn("POST /register - Password is required");
      return res.status(400).json({ message: "Password is required" });
    }

    // ตรวจสอบว่าอีเมลมีอยู่แล้วหรือไม่
    const user = await User.findOne({
      where: { email: email },
    });

    if (user) {
      logger.warn(`POST /register - Email already exists: ${email}`);
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้างผู้ใช้ใหม่
    const createUser = await User.create({
      name,
      email,
      age,
      role,
      password: hashedPassword,
    });

    // Generate token
    const token = jwt.sign({ userId: createUser.id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    logger.info(`POST /register - User created: ${createUser.id}`);
    res.status(201).json({ token });
  } catch (err) {
    logger.error("POST /register - Error: " + err.message, err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route สำหรับ login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ค้นหาผู้ใช้จากอีเมล
    const user = await User.findOne({
      where: { email: email },
    });

    if (!user) {
      logger.warn(`POST /login - Invalid email: ${email}`);
      return res.status(401).json({ message: "Invalid email" });
    }

    // ตรวจสอบรหัสผ่าน
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`POST /login - Invalid password for email: ${email}`);
      return res.status(401).json({ message: "Password doesn't match" });
    }

    const payload = {
      id: user.id,
      isAdmin: user.isAdmin,
      email: user.email,
    };

    // 👉 สร้าง Access Token
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m", // หรือ 10m ตามที่คุณต้องการ
    });

    // 👉 สร้าง Refresh Token
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // 👉 (Optional) เก็บ Refresh Token ลง DB
    await User.update(
      { refreshToken: refreshToken },
      { where: { id: user.id } }
    );

    logger.info(`POST /login - User logged in: ${user.id}`);
    res.json({ payload, accessToken, refreshToken, id: user.id });
  } catch (err) {
    logger.error("POST /login - Error: " + err.message, err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  // console.log("Incoming refresh token from auth:", refreshToken);

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  try {
    // ตรวจสอบว่า refresh token อยู่ใน database
    const user = await User.findOne({ where: { refreshToken } });

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // ตรวจสอบความถูกต้องของ refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err || decoded.id !== user.id) {
          return res
            .status(403)
            .json({ message: "Token is invalid or expired" });
        }

        // สร้าง access token ใหม่
        const accessToken = jwt.sign(
          { id: user.id, email: user.email, isAdmin: user.isAdmin },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        res.json({ accessToken });
      }
    );
  } catch (err) {
    console.error("Error in refresh-token:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Route สำหรับ check email
router.get("/check-email", async (req, res) => {
  const { email } = req.query;
  try {
    const user = await User.findOne({ where: { email: email } });
    logger.info(
      `GET /check-email - Email checked: ${email} - Exists: ${!!user}`
    );
    res.json({ exists: !!user });
  } catch (err) {
    logger.error("GET /check-email - Error: " + err.message, err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
