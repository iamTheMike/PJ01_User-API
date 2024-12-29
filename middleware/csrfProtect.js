

exports.csrfProtect = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization){
        return res.status(403).json({ message: 'Forbidden1' });
    }
    if(authorization.startsWith('Bearer')){
        try{
            const token = req.headers.authorization.split(' ')[1];
            if(token === req.cookies._csrf){
                next();
            }
            else{
                return res.status(403).json({ message: 'Forbidden2' });
            }
        }
        catch(err){
            return res.status(403).json({ message: 'Forbidden3' });
        }      
    }else{
        return res.status(403).json({ message: 'Forbidden4' });
    }
}