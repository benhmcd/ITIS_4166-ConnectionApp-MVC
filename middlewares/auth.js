const Connection = require('../models/connection');
const User = require('../models/user');

//check if user is a guest
exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already!');
        return res.redirect('/users/profile');
    }
};

//check if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You must log in first!');
        return res.redirect('/users/login');
    }
};

//check if user is creator of the connection
exports.isHost = (req, res, next) => {
    let id = req.params.id;
    Connection.findById(id)
        .then(connection => {
            if (connection) {
                if (connection.host_name == req.session.user) {
                    return next();
                } else {
                    let err = new Error('Unauthorized to access the resource');
                    err.status = 401;
                    return next(err);
                }
            } else {
                let err = new Error('Cannot find a connection with id ' + req.params.id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};

//check if user is not the creator of the connection
exports.isNotHost = (req, res, next) => {
    let id = req.params.id;
    Connection.findById(id)
        .then(connection => {
            if (connection) {
                if (connection.host_name == req.session.user) {
                    let err = new Error('Unauthorized to access the resource');
                    err.status = 401;
                    return next(err);
                } else {
                    return next();
                }
            } else {
                let err = new Error('Cannot find a connection with id ' + req.params.id);
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};