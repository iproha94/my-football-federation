var url = require('url');
var WebSocketServer = require('ws').Server;
var sessionParser = require('./app').sessionParser;
var User = require('./models/user');
var Match = require('./models/match');

// var matches = {//стуктура matches
//     "matchId": {
//         "userId": { 
//             ws: "ws",
//             user: {//объект mongo
//                 _id: "id",
//                 //+ другая информация о юзере
//             }
//         }
//     }
// };

var matches = {};

var onStart = function (user, ws, data, idUser) {
    var userData = {
        user: user,
        ws: ws
    };

    var idMatch = data.idMatch;
    if(!matches[idMatch]){
        matches[idMatch] = {[idUser]: userData};
    } else {
        matches[idMatch][idUser] = userData;
    }
    
    return idMatch;
};

var onMessage = function (idMatch, data, currentUser) {
    var match = matches[idMatch];

    var row = {
        message: data.message,
        user: currentUser,
        time: data.time
    };

    for (var key in match) {
        var userData = match[key];
        userData.ws.send(JSON.stringify(row));
    }
    
    Match.findById(idMatch, function (err, match) {
        match.chat.push(row);
        match.save();
    });
};

module.exports = function startChat(server){
    var wss = new WebSocketServer({ server: server });
    
    wss.on('connection', function connection(ws) {
        var idMatch = "";
        var idUser = "";
        var isStart = false;
        
        sessionParser(ws.upgradeReq, {}, function(){
            var passport = ws.upgradeReq.session.passport;
            if(!passport || !passport.user) {
                ws.close();
                return;
            }
            
            idUser = passport.user;
            User.findById(idUser, function (err, user) {
                ws.on('message', function incoming(message) {
                    var data = JSON.parse(message);
                    console.log(data);
                    if(data.type === "start") {
                        idMatch = onStart(user, ws, data, idUser);
                        isStart = true;
                    }
                    if(data.type === "message") {
                        onMessage(idMatch, data, user);
                    }

                });

                ws.on('close', function() {
                    console.log('соединение закрыто ' + idUser);
                    if(isStart){
                        delete matches[idMatch][idUser];
                    }
                });
            });
            console.log("новое соединение " + idUser);
        });
    });

    console.log("start chat");
};