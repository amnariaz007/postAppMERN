const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const tokenGenerator = (user) => {
    return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY, {
        expiresIn: maxAge
    });
}

module.exports.tokenGenerator = tokenGenerator
