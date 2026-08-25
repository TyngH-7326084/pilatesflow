const jwt = require("jsonwebtoken");

// Verifies JWT and attaches decoded payload to req.user
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { sub, role, iat, exp }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

// Must be used after requireAuth
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  next();
}

module.exports = { requireAuth, requireAdmin };