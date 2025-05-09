const express = require("express");
const router = express.Router();
const { Employee } = require("../models/employee");
const { auth, adminCheck } = require("../Middleware/auth");
const logger = require("../logger"); // ✅ นำเข้า logger
const { Role } = require("../models/role");
const { Op } = require('sequelize');

router.get("/list", auth, async (req, res) => {
  try {
    const users = await Employee.findAll();
    logger.info(`GET /list - fetched ${users.length} employees`);
    res.json(users);
  } catch (err) {
    logger.error("Error fetching employees (GET /list)", err);
    res.json({
      message: "Error fetching users",
      errors: err.errors?.map((e) => e.message) || [err.message],
    });
  }
});

router.get("/listBy/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      logger.warn("GET /listBy/:id - Missing userId");
      return res.json({
        message: "userId is required",
      });
    }

    const user = await Employee.findOne({ where: { id: userId } });
    logger.info(`GET /listBy/${userId} - Employee found: ${!!user}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching employee by id (${req.params.id})`, err);
    res.json({
      message: "Error fetching users",
      errors: err.errors?.map((e) => e.message) || [err.message],
    });
  }
});

router.post("/create", async (req, res) => {
  try {
    const user = await Employee.create(req.body);
    logger.info(`POST /create - Created employee id: ${user.id}`);
    res.json(user);
  } catch (err) {
    logger.error("Error creating employee (POST /create)", err);
    res.json({
      message: "Error creating user",
      errors: err.errors?.map((e) => e.message) || [err.message],
    });
  }
});

router.put("/update/:id", auth, adminCheck, async (req, res) => {
  try {
    const data = req.body;
    const userId = req.params.id;

    const user = await Employee.update(
      {
        name: data.name,
        age: data.age,
        role: data.role,
        gender: data.gender,
      },
      {
        where: { id: userId },
      }
    );

    logger.info(`PUT /update/${userId} - Updated employee`);
    res.json({
      message: "update complete!",
      user,
    });
  } catch (err) {
    logger.error(`Error updating employee (${req.params.id})`, err);
    res.json({
      message: "Error updating user",
      errors: err.errors?.map((e) => e.message) || [err.message],
    });
  }
});

router.delete("/remove/:id", auth, adminCheck, async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      logger.warn("DELETE /remove/:id - Missing userId");
      return res.json({
        message: "userId is required",
      });
    }

    const result = await Employee.destroy({ where: { id: userId } });

    logger.info(`DELETE /remove/${userId} - Deleted employee`);
    res.json({
      message: "delete successful",
      result,
    });
  } catch (err) {
    logger.error(`Error deleting employee (${req.params.id})`, err);
    res.json({
      message: "Error deleting user",
      errors: err.errors?.map((e) => e.message) || [err.message],
    });
  }
});

// Route สำหรับ check email
router.get("/check-email", async (req, res) => {
  const { email } = req.query;
  logger.info(`Email to check: ${email}`);
  try {
    const user = await Employee.findOne({ where: { email: email } });
    logger.info(`Result from findOne: ${user}`);
    logger.info(
      `GET /check-email - Email checked: ${email} - Exists: ${!!user}`
    );
    res.json({ exists: !!user });
  } catch (err) {
    logger.error("GET /check-email - Error: " + err.message, err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/get-roles', async (req, res) => {
  try {
    const roles = await Role.findAll();
    logger.info(`GET /get-roles - Fetched roles: ${roles.length}`);
    res.json(roles);
  }catch(err){
    logger.error("GET /check-email - Error: " + err.message, err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/filter", async (req, res) => {
  try {
    const { role, gender } = req.query;
    const where = {};
    if (role) {
      where.role = {
      [Op.in]: role.split(','), // Sequelize
    }};
    if (gender) {
      where.gender = {
        [Op.in]: gender.split(","),
      };
    }

    const users = await Employee.findAll({ where });
    logger.info(`GET /filter - Employee found: ${!!users}`);
    res.json(users);
  } catch (err) {
    logger.error(`Error fetching employee by filter (${req.query})`, err);
    res.json({
      message: "Error fetching users",
      errors: err.errors?.map((e) => e.message) || [err.message],
    });
  }
});

module.exports = router;
