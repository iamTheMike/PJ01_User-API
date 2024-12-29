const { verifyToken } = require("../services/๋jsonwebtoken");


exports.tokenDecrypt = async (req, res, next) => {
   try {
        const authorization = req.headers.authorization;
        if(authorization.startsWith('Bearer')){
            const token = req.headers.authorization.split(' ')[1];
            console.log(token);
            const decoded = verifyToken(token);;
            req.user = decoded;
            next();
        }
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
}

