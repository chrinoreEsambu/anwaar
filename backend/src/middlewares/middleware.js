const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.isValidEmail = (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email requis",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Format d'email invalide",
    });
  }
  next();
};

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token manquant" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // ← Remplace req.session

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide" });
  }
};

exports.schekrole = async (req, res) => {
  const role = req.user.role;

  if (role || role.toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Accès refusé, admin requis" });
  }

  res.json({ data: "Secret admin" });
};
