const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

exports.limiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50 // limit each IP to 50 requests per windowMs
});
exports.userLimiter = rateLimit({ 
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    skipSuccessfulRequests: true
});
exports.speedLimiter = slowDown({
    windowMs: 30 * 1000, // 30 sec
    delayAfter: 100, // allow 100 requests per 15 minutes, then...
    delayMs: () =>1000 // begin adding 1000ms of delay per request above 100:
});

