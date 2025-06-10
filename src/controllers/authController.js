const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const authConfig = require('../config/auth');

const User = require('../models/user');
const emailUtil = require('../utils/email');

const router = express.Router();


router.post('/register', async (req, res) => {

    const { email } = req.body;

    try {

        if (await User.findOne({ email })){
            return res.status (400).send( { error: 'User already exists'});
        }
        
        const user = await User.create(req.body);

        user.password = undefined;

        const token = generateToken({id: user.id, email: user.email});

        return res.send({ user, token });

    }catch(err) {
        return res.status(400).send( { error: 'Registration failed' });
    }
});

function generateToken(params = {} ) {
    return jwt.sign({ params }, authConfig.secret, {
        expiresIn: 86400,
    });
}
router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user){
        return res.status(400).send( { error: 'User not found'})
    }

    if (!await bcrypt.compare(password, user.password)){
        return res.status(400).send ( { error: 'User not found or invalid password'});
    }

    user.password = undefined;

    const token = generateToken({id: user.id, email: user.email});

    res.send( { user, token });

});

router.post('/forgot_password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        const token = crypto.randomBytes(4).toString('hex');
        const now = new Date();
        now.setHours(now.getHours() + 1);

        await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now
            }
        });

        await emailUtil.sendResetPasswordMail(email, token);

        return res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Error on forgot password, try again' });
    }
});

router.post('/reset_password', async (req, res) => {
    const { email, token, password } = req.body;

    try {
        const user = await User.findOne({ email })
            .select('+passwordResetToken passwordResetExpires');

        if (!user) {
            return res.status(400).send({ error: 'User not found' });
        }

        if (token !== user.passwordResetToken) {
            return res.status(400).send({ error: 'Token invalid' });
        }

        if (new Date() > user.passwordResetExpires) {
            return res.status(400).send({ error: 'Token expired, generate a new one' });
        }

        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();

        return res.send();
    } catch (err) {
        return res.status(400).send({ error: 'Cannot reset password, try again' });
    }
});

module.exports = app => app.use('/auth', router);
