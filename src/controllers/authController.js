import * as authService from "../services/auth.js"

export const getSignIn = (req, res) => {
    res.render("signin");
}

export const getSignUp = (req, res) => {
    res.render("signup");
}

export const postSignIn = async (req, res, errors) => {
    const {body} = req;
    try {
        if (!errors.isEmpty())
            throw new Error("validation");
        const user = await authService.signIn(body.email, body.psw);
        req.session.user = user;
        res.redirect("/");
    } catch(err) {
        if (err.message == "validation")
            res.json({errors: errors.array()});
        else
            res.json({errors: err.message});
    }
}

export const postSignUp = async (req, res, errors) => {
    const { body } = req;
    try {
        if (!errors.isEmpty())
            throw new Error("validation");
        const user = await authService.signUp(body.email, body.psw, body.fname, body.lname);
        req.session.user = user;
        res.redirect("/");
    } catch(err) {
        if (err.message == "validation")
            res.json({errors: errors.array()});
        else
            res.json({errors: err.message});
    }
}
