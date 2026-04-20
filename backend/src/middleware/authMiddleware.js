const jwt = require("jsonwebtoken");

const authMiddleware = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    req.user = null;
    return next();
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
  } catch (_error) {
    req.user = null;
  }
  return next();
};

module.exports = authMiddleware;
