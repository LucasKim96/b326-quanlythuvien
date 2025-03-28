// middleware/auth.js
const jwt = require("jsonwebtoken");
const { ERROR, VALIDATION_MESSAGES } = require("../constants");

module.exports = (roles = []) => {
  return (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) return res.status(402).json({ message: ERROR.ACCESS_DENIED });

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      req.user = {
        id: verified.id,
        role: verified.role,
      };
      // console.log("Assigned user:", req.user);

      // Nếu không truyền roles => cho phép tất cả người dùng có token
      if (roles.length && !roles.includes(req.user.role)) {
        console.log("User role không hợp lệ:", req.user.role);
        return res.status(403).json({ message: ERROR.FORBIDDEN });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: VALIDATION_MESSAGES.INVALID_TOKEN });
    }
  };
};
