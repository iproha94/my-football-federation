var express = require('express');
var router = express.Router();
var Federation = require('../models/federation');
var Tournament = require('../models/tournament');
var Match = require('../models/match');

router.post('/create', function(req, res, next) {
    if (!req.isAuthenticated())  {
        res.status(403);
        return res.json({
            message: "Нет доступа"
        });
    }

    var federation = new Federation({
        name: req.body.name,
        city: req.body.city,
        creators: [req.user._id]
    });

    federation.save(function (err) {
        if(err) {
            next(err);
        } else {
            res.json({
                name: federation.name
            });
        }
    });
});

router.get('/get-by-creator', function (req, res, next) {
    console.log(req.query.idUser, req.user._id);
    var creator = req.query.idUser || req.user._id;
    Federation.find({creators: creator}, function (err, result) {
        res.json(result);
    });
});

router.get('/:name', function(req, res, next) {
    var name = req.params.name;
    var idUser = null;
    if(req.user){
        idUser = req.user._id;
    }
    Federation.findOne({name : name}, function (err, federation) {
        if(err || !federation) {
            return next();
        }
        var isAdmin = federation.creators.some(
            (item) => item.toString() == idUser
        );
        var result = Object.assign(federation.toObject(),{
            isAdmin: isAdmin
        });
        return res.json(result);
    });
});

router.get('/get-tournaments/:name', function(req, res, next) {
    Federation.findOne({name : req.params.name}, function (err, federation) {
        if(err || !federation) {
            return res.json({
                status: 404
            });
        }
        Tournament.find({federation: federation._id}, function (err, tournaments) {
            res.json(tournaments);
        });
    });
});

router.get('/get-running-match/:name', function(req, res, next) {
    Federation.findOne({name : req.params.name}, function (err, federation) {
        if(err || !federation) {
            return res.json({
                status: 404
            });
        }
        Tournament.find({federation: federation._id}, function (err, federation) {

        });
    });
});

module.exports = router;
