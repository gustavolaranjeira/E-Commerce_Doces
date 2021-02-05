const nodemailer = require("nodemailer");

module.exports = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "89a65fb5142e57",
        pass: "4963a43c5eb629",
    },
});
