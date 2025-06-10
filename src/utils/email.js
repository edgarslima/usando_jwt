module.exports = {
    async sendResetPasswordMail(to, token) {
        // TODO: configure real email service
        console.log(`Send reset password token to ${to}: ${token}`);
    }
};
