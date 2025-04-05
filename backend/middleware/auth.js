const jwt = require('jsonwebtoken');

// Middleware to protect routes - expects Authorization: Bearer <token>
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }
  // authHeader may be "Bearer token", we need the token part
  const token = authHeader.split(' ')[0] === 'Bearer' ? authHeader.split(' ')[1] : authHeader;
  if (!token) {
    return res.status(401).json({ message: 'Invalid token format' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'development_jwt_secret';
    const decoded = jwt.verify(token, secret);
    // decoded payload should contain userId (and maybe other info)
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authMiddleware;
