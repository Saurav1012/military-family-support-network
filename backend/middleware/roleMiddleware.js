export const roleMiddleware = (...allowedRoles) => {
  const normalizedAllowedRoles = allowedRoles.map((role) => String(role).trim().toLowerCase());

  return (req, res, next) => {
    const userRole = req.user?.role ? String(req.user.role).trim().toLowerCase() : "";

    if (!req.user || !userRole) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. User role missing.",
      });
    }

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    req.user.role = userRole;
    next();
  };
};

// Aliases for compatibility across different route files
export const authorize = roleMiddleware;
export default roleMiddleware;