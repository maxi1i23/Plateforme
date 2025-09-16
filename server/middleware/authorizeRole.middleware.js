function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) return res.status(401).json({ message: "Non autorisé" });
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Accès refusé : rôle non autorisé" });
        }
        next();
    }
}

module.exports = authorizeRoles;
