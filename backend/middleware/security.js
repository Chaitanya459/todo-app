const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
exports.applyHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"]
    }
  }
});

// Rate limiting
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// JWT validation enhancement
exports.enhancedAuth = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Add security context
    req.user = user;
    req.securityContext = {
      userId: user._id,
      authTime: new Date(),
      ipAddress: req.ip
    };

    next();
  } catch (err) {
    res.status(401).json({ 
      error: 'Session expired. Please login again',
      code: 'TOKEN_EXPIRED'
    });
  }
};