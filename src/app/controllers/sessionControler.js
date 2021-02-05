//A declaração abaixo se liberada funciona o forgot mas ai trava o cadatro
const User = require("../models/user");
const { hash } = require("bcryptjs");
const crypto = require("crypto");
const mailer = require("../../lib/mailer");
module.exports = {
    loginForm(req, res) {
        return res.render("session/login");
    },
    login(req, res) {
        req.session.userId = req.user.id;
        return res.redirect("/users");
    },
    logout(req, res) {
        req.session.destroy();
        return res.redirect("/");
    },
    forgotForm(req, res) {
        return res.render("session/forgot-password");
    },
    async forgot(req, res) {
        const user = req.user;

        try {
            //token
            const token = crypto.randomBytes(20).toString("hex");

            //expiração token
            let now = new Date();
            now = now.setHours(now.getHours() + 1);

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now,
            });

            //enviar email
            await mailer.sendMail({
                to: user.email,
                from: "nao-responda@lojagustavo.com.br",
                subject: "Recuperação de senha",
                html: `<p>Clique no linque abaixo para recuperar sua senha.</p>
            <p>
                <a href="http://localhost:3000/users/password-reset?token=${token}" target="_blank">
                Recuperar senha
                </a>
            </p>
            `,
            });

            //avisar usuario
            return res.render("session/forgot-password", {
                success: "Verifique seu email para resetar sua senha!",
            });
        } catch (error) {
            console.error(error);
            return res.render("session/forgot-password", {
                error: "Erro inesperado, tente novamente!",
            });
        }
    },
    resetForm(req, res) {
        return res.render("session/password-reset", {
            token: req.query.token,
        });
    },
    async reset(req, res) {
        const user = req.user;
        const { password, token } = req.body;

        try {
            //cria um novo hash de senha
            const newPassword = await hash(password, 8);
            //atualiza o usuario
            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            });
            //avisa o usuario que ele tem uma nova senha
            return res.render("session/login", {
                user: req.body,
                success: "Senha atualizada!, faça seu login.!",
            });
        } catch (error) {
            console.error(error);
            return res.render("session/password-reset", {
                user: req.body,
                token,
                error: "Erro inesperado, tente novamente!",
            });
        }
    },
};
