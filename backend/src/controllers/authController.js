// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const createToken = (userId) =>
//   jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// const signup = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const existing = await User.findOne({ email: email.toLowerCase() });
//     if (existing) return res.status(409).json({ message: "User already exists" });

//     const hash = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email: email.toLowerCase(), password: hash });
//     const token = createToken(user._id.toString());

//     return res.status(201).json({
//       token,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email: email.toLowerCase() });
//     if (!user) return res.status(401).json({ message: "Invalid credentials" });

//     const ok = await bcrypt.compare(password, user.password);
//     if (!ok) return res.status(401).json({ message: "Invalid credentials" });

//     const token = createToken(user._id.toString());
//     return res.json({
//       token,
//       user: { id: user._id, name: user.name, email: user.email },
//     });
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { signup, login };
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

function computeAge(dob) {
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
}

async function generateUniquePatientId() {
  const year = new Date().getFullYear();
  for (let i = 0; i < 8; i++) {
    const rand = crypto.randomBytes(4).toString("hex").toUpperCase();
    const patientId = `MRX-${year}-${rand}`;
    const exists = await User.exists({ patientId });
    if (!exists) return patientId;
  }
  // Fallback (extremely unlikely to collide)
  return `MRX-${year}-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
}

exports.signup = async (req, res) => {
  try {
    const { name, contactNo, email, password, dob, gender } = req.body;
    if (!name || !contactNo || !email || !password || !dob || !gender) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const age = computeAge(dob);
    if (age === null || age < 0 || age > 120) {
      return res.status(400).json({ message: "Invalid date of birth" });
    }

    const normalizedGender =
      gender === "Male" || gender === "Female" || gender === "Other" ? gender : null;
    if (!normalizedGender) {
      return res.status(400).json({ message: "Invalid gender" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const patientId = await generateUniquePatientId();
    const user = await User.create({
      patientId,
      name,
      contactNo,
      email,
      password: hashedPassword,
      dob,
      gender: normalizedGender,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id: user._id,
        patientId: user.patientId,
        name: user.name,
        contactNo: user.contactNo,
        email: user.email,
        dob: user.dob,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (err) {
    if (err?.code === 11000) {
      const key = Object.keys(err.keyPattern || err.keyValue || {})[0] || "field";
      const msg =
        key === "email"
          ? "Email already exists"
          : key === "patientId"
            ? "Please retry (patient id collision)"
            : "Duplicate value";
      return res.status(409).json({ message: msg });
    }
    res.status(400).json({ message: err?.message || "Invalid data" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
      token,
      user: {
        id: user._id,
        patientId: user.patientId,
        name: user.name,
        contactNo: user.contactNo,
        email: user.email,
        dob: user.dob,
        age: user.age,
        gender: user.gender,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};