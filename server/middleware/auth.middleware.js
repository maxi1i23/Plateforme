// Fichier middleware/auth.middleware.js
const jwt = require('jsonwebtoken')


function auth(req, res, next){
    const jwtToken = req.cookies['jwtToken'];
    if(!jwtToken) return res.status(401).json({message: 'Non autorisé'});
    jwt.verify(jwtToken, process.env.JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).json({message : 'Non autorisé'});
        }
        req.user = decoded; //  garder l’utilisateur connecté
        next()
    })
}

module.exports = auth