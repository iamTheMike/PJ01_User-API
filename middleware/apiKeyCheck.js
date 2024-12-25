

exports.checkApiKey = (req, res, next) => {
    const apikey = req.headers['x-api-key'];
    console.log(apikey);
    console.log(process.env.API_KEY);   
    if(apikey === process.env.API_KEY) {
        next();
    }else{
        res.status(401).json({ message: 'Unauthorized' });
    }
}