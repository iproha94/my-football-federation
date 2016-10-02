var express = require('express');
var router = express.Router();
var Tournament = require('../models/tournament');
var Federation = require('../models/federation');
var Team = require('../models/team');
var Match = require('../models/match');
var tournamentSetting = require('../lib/tournament');

router.get('/create', function(req, res, next) {
    if(!req.isAuthenticated()) {
        return res.redirect('/unauthorized' );
    }
    res.render("create-tournament", {config: tournamentSetting.config});
});

router.post('/create', function(req, res, next) {
    if(!req.isAuthenticated()) {
        return res.redirect('/unauthorized' );
    }
    Federation.findOne({name: req.query.federation}, function (err, federation) {
        var tournament = new Tournament({
            name: req.body.name,
            time: req.body.time,
            countPeriods: req.body.countPeriods,
            federation: federation._id,
            teams: [],
            team_requests: [],
            type: null,
            status: {
                prepare: true,
                undertake: false,
                finished: false
            }
        });

        tournament.save(function (err) {
            if(err) {
                return next(err);
            }
            res.redirect("/tournament/" + tournament._id);
        });
    });

});

router.get('/:idTournament', function(req, res, next) {
    var idTournament = req.params.idTournament;

    Tournament.findById(idTournament, function (err, tournament) {
        if(err) {
            return next(err);
        }

        if (req.query.setstatus == "undertake" ) {
            tournament.status.prepare = false;
            tournament.status.undertake = true;

            tournament.save(function (err) {
                if(err) {
                    return next(err);
                }
            });

            for (var i = 0; i < tournament.teams.length; ++i) {
                for (var j = i + 1; j < tournament.teams.length; ++j) {
                    var match = new Match ({
                        tournament: idTournament,
                        team1: tournament.teams[i],
                        team2: tournament.teams[j]
                    });

                    match.save(function (err) {
                        console.log("add match");
                    })
                }
            }
        }

        switch (true) {
            case tournament.status.prepare:
                Team.find({_id: {$in: tournament.teams}}, function (err, teams) {
                    return res.render("tournament-prepare", {
                        tournament: tournament,
                        teams: teams
                    });
                });
                break;

            case tournament.status.undertake:
                Match.find({_id: tournament._id}, function (err, matches) {
                    return res.render("tournament-undertake", {
                        tournament: tournament,
                        matches: matches
                    });
                });
                break;

            case tournament.status.finished:
                return res.send("3");
                break;

            default:
                return res.send("Турнир старой версии");
                break;

        }
    });
});

router.post('/add-team', function(req, res, next) {
    Tournament.findById(req.body.idTournament, function (err, tournament) {
        tournament.teams.push(req.body.idTeam);
        tournament.save(function (err) {
            if(err) {
                return res.json({
                    status: 403
                });
            }
            return res.json({
                status: 200
            });
        });
    });
});


module.exports = router;
