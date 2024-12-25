const crypto = require('crypto');


const creatSaltHash = (password) => {
    const salt = crypto.randomBytes(32).toString('hex');
    const hashpassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return { salt, hashpassword };
}

const verifySaltHash = (password, salt, hash) => {
    const verifyHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512');
    //prevent timing attack
    if(crypto.timingSafeEqual(Buffer.from(hash,'hex'), verifyHash)){
        return true;
    }
}

module.exports = { creatSaltHash, verifySaltHash };