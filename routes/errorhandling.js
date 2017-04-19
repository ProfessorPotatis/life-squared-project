function errorHandling(err, next, req, res, path) {
    // If a validation error occurred, view the form and an error message.
    if (err.errors.username !== undefined && err.errors.username.name === 'ValidatorError') {
        // We handle the validation error!
            return res.render('home/' + path, {
                validationErrors: [err.errors.username.message],
                password: req.body.password,
                username: req.body.username
            });
    } else if (err.errors.password !== undefined && err.errors.password.name === 'ValidatorError') {
        return res.render('home/' + path, {
            validationErrors: [err.errors.password.message],
            password: req.body.password,
            username: req.body.username
        });
    } else if (err.errors.password.name === 'ValidatorError' && err.errors.username.name === 'ValidatorError') {
        return res.render('home/' + path, {
            validationErrors: [err.errors.username.message, err.errors.password.message],
            password: req.body.password,
            username: req.body.username
        });
    }

    // Let the middleware handle any errors but ValidatorErrors.
    next(err);
}

module.exports = {
    errorHandling: errorHandling
};
