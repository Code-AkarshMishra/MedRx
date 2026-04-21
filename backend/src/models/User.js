const mongoose = require('mongoose');
const crypto = require("crypto");

function computeAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age -= 1;
  return age;
}

function makePatientId() {
  const year = new Date().getFullYear();
  const rand = crypto.randomBytes(4).toString("hex").toUpperCase(); // 8 chars
  return `MRX-${year}-${rand}`;
}

const userSchema = new mongoose.Schema({
  patientId: { type: String, unique: true, index: true },
  name: { type: String, required: true, trim: true },
  contactNo: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true, enum: ["Male", "Female", "Other"] }
}, { timestamps: true });

userSchema.virtual("age").get(function ageVirtual() {
  return computeAge(this.dob);
});

userSchema.pre("save", function ensurePatientId() {
  if (!this.patientId) this.patientId = makePatientId();
});

module.exports = mongoose.model('User', userSchema);