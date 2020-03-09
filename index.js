var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var room = [];
var Game = function (roomId) {
    this.roomId = roomId;
    this.board = [];
    this.moves = 0;
}
var user1socket;
var user2socket;

var bodyParser = require('body-parser')

var fs = require('fs');
var stats = fs.statSync("userinfo.txt");
    readline = require('readline');;

var Player1Score=0;

var Player2Score = 0;
var roomcout = 0;

var array = [];
var field = [["",""],["",""],["",""]];

var username


server.listen(process.env.PORT, function () {
    console.log('Example app listening on port 3000!');
  
    
    console.log('userinfosize File Size in Bytes:- ' + stats.size);
});


//function handler(req, res) {
//    console.log(__dirname);
//    fs.readFile(__dirname + '/index.html',
//    function (err, data) {
//        if (err) {
//            res.writeHead(500);
//            return res.end('Error loading index.html');
//        }

//        res.writeHead(200);
//        res.end(data);
//    });
//}

io.on('connection', function (socket) {
    console.log("connect");
    console.log(socket.id)
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log("1-" + data);
    });
    socket.on('my other event2', function (data) {
        console.log();
        console.log("2-" + data);
        socket.emit('news2', 'hello ricky god')
    });
    
    socket.on('createroom', function (username) {
        
        var create = true;
        var id, username1, username2;
        console.log("createroom" + username);

        for (var i = 0; i < room.length; i++) {



            if (room[i].username1 == username) {
                id = room[i].roomid;
                username1 = room[i].username1;
                username2 = room[i].username2;
                create = false;
                break;
            }


        }


        if (create) {
            room.push({
                roomid: room.length,

                username1: username,

                username2: "Waiting"

            });

            socket.emit('roomid', room[room.length - 1].roomid, room[room.length - 1].username1, room[room.length - 1].username2, 1);

            console.log(room[room.length - 1].roomid + "" + room[room.length - 1].username1 + "" + room[room.length - 1].username2);

            console.log(socket.id + 'is user1socket');
            user1socket = socket.id;
        }
        else {
            socket.emit('roomid', id, username1, username2, 0);
        }
        //roomid = room[room.length - 1].username1;
        //socket.emit("roomid", roomid);
    });
    socket.on('joinroom', function (roomid, username2) {
        console.log("try to join room");

        //console.log("createroom" + username);
        var join = false;
        for (var i = 0; i < room.length; i++) {



            if (room[i].username2 == "Waiting" && roomid == room[i].roomid) {

                room[i].username2 = username2;


                join = true;
                console.log(room[i].roomid, room[i].username1, room[i].username2);
                socket.emit('joinstatus', room[i].roomid, room[i].username1, room[i].username2, 4);
                console.log(socket.id + 'is user2socket');
                user2socket = socket.id;
                io.emit(user2socket).emit('messeger', 2);
                // 2 = game start
                console.log("user2 first");
                //field.push({

                //    username: line.split(';')[0],

                //    password: line.split(';')[1]

                //});

                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        field[i][j]=(" ");
                    }
                }
            }


        }

        if (join == false) {
            for (var i = 0; i < room.length; i++) {



                if (roomid == room[i].roomid) {
                    socket.emit('joinstatus', room[i].roomid, room[i].username1, room[i].username2, 3);
                }
                console.log("Join fail go to spec");
            }
        }


        //roomid.push(roomid.length);
        //socket.emit('roomid', roomid[roomid.length - 1]);
    });

    socket.on('move', function (button, username, mark) {
        if (mark == "X") {
            mark = 1;
        } else {
            mark = 0;
        }
        io.emit('boardstatus', button, mark);
        console.log(button);
        console.log(username);
        console.log(mark);

        
            if (mark == 1) {
                mark = 1
                //change move
                socket.to(user2socket).emit('messeger', 2);
                console.log(user2socket, "is user 2 id");
                console.log("change move to user2");
                //Player1Score = Player1Score + button;
                if (button == 1) field[0][0] = "X";
                else if (button == 2) field[0][1] = "X";
                else if (button == 4) field[0][2] = "X";
                else if (button == 8) field[1][0] = "X";
                else if (button == 16) field[1][1] = "X";
                else if (button == 32) field[1][2] = "X";
                else if (button == 64) field[2][0] = "X";
                else if (button == 128) field[2][1] = "X";
                else if (button == 256) field[2][2] = "X";
                console.log("Player1Score:", Player1Score);
                if (CheckWin()) {
                    console.log("Player1 Win");
                    io.emit('messeger', 1);
                    io.in(user1socket).emit('messeger', 1);
                    io.in(user2socket).emit('messeger', 1);
                    io.emit('messeger', 3);
                    roomcout = 0;

                    for (var i = 0; i < 3; i++) {
                        for (var j = 0; j < 3; j++) {
                            field[i][j] = (" ");
                        }
                    }
                }
                roomcout++;
            }
            else {
                mark = 0;

                socket.to(user1socket).emit('messeger', 2);
                console.log("change move to user1");
                console.log(user1socket, "is user 1 id");
                //Player2Score = Player2Score + button;

                if (button == 1) field[0][0] = "O";
                else if (button == 2) field[0][1] = "O";
                else if (button == 4) field[0][2] = "O";
                else if (button == 8) field[1][0] = "O";
                else if (button == 16) field[1][1] = "O";
                else if (button == 32) field[1][2] = "O";
                else if (button == 64) field[2][0] = "O";
                else if (button == 128) field[2][1] = "O";
                else if (button == 256) field[2][2] = "O";
                console.log("Player2Score:", Player2Score);
                if (CheckWin()) {
                    console.log("Player2 Win");
                    io.emit('messeger', 1);
                    io.in(user1socket).emit('messeger', 1);
                    io.in(user2socket).emit('messeger', 1);
                    io.emit('messeger', 4);
                    roomcout = 0;

                    for (var i = 0; i < 3; i++) {
                        for (var j = 0; j < 3; j++) {
                            field[i][j] = (" ");
                        }
                    }
                }
                roomcout++
            }
            if (roomcout == 9) {
                console.log("Draw and resetboard")
                io.emit('messeger', 1);
                io.in(user1socket).emit('messeger', 1);
                io.in(user2socket).emit('messeger', 1);
                roomcout = 0;

                for (var i = 0; i < 3; i++) {
                    for (var j = 0; j < 3; j++) {
                        field[i][j] = (" ");
                    }
                }
            }
        console.log(field[0][0] + "|" + field[0][1] + "|" + field[0][2]);
        console.log(field[1][0] + "|" + field[1][1] + "|" + field[1][2]);
        console.log(field[2][0] + "|" + field[2][1] + "|" + field[2][2]);
        //1 = X 
        //0 = O
        //if (Player1Score == 7 || Player1Score == 56 || Player1Score == 448 || Player1Score == 73 || Player1Score == 146 || Player1Score == 292 || Player1Score == 273 || Player1Score == 84)

        //{
        //    console.log("Play1 WIN")
        //    socket.broadcast.emit('messeger', 1);
        //    Player1Score = 0;
        //    Player2Score = 0;

        //} else if (Player2Score == 7 || Player2Score == 56 || Player2Score == 448 || Player2Score == 73 || Player2Score == 146 || Player2Score == 292 || Player2Score == 273 || Player2Score == 84) {
        //    console.log("Play2 WIN")
        //    socket.broadcast.emit('messeger', 1);
        //    Player1Score = 0;
        //    Player2Score = 0;

        //} else if (roomcout == 9) {
        //    console.log("Draw and resetboard")
        //    socket.broadcast.emit('messeger', 1);
        //    Player1Score = 0;
        //    Player2Score = 0;
        //}

     
    })

    socket.on('roomstatus', function (roomid) {

        console.log("roomstatus Request", "Room ID = ",roomid);
        for (var i = 0; i < room.length; i++) {

            if (roomid == room[i].roomid) {


                console.log("roomstatus Request", room[i].roomid, room[i].username1, room[i].username2);
                io.emit('roomstatus', room[i].username1, room[i].username2, 1);
                
               
                    
                if (field[0][0] == "X") {
                    button = 1;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                }
                if (field[0][0] == "O") {
                    button = 1;
                    mark = 0;
                    socket.emit('boardstatus', button, mark)
                }
                if (field[0][1] == "X") {
                    button = 2;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[0][1] == "O") {
                    button = 2;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                }
                if (field[0][2] == "X") {
                    button = 4;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[0][2] == "O") {
                    button = 4;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[1][0] == "X") {
                    button = 8;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[1][0] == "O") {
                    button = 8;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[1][1] == "X") {
                    button = 16;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[1][1] == "O") {
                    button = 16;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[1][2] == "X") {
                    button = 32;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[1][2] == "O") {
                    button = 32;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[2][0] == "X") {
                    button = 64;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[2][0] == "O") {
                    button = 64;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[2][1] == "X") {
                    button = 128;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[2][1] == "O") {
                    button = 128;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[2][2] == "X") {
                    button = 256;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                } if (field[2][2] == "O") {
                    button = 256;
                    mark = 1;
                    socket.emit('boardstatus', button, mark)
                }


         
            }

        }

    });
    socket.on('messeger', function (reset) {
        if (reset == 1) {
            io.emit('messeger', 1);
            io.in(user1socket).emit('messeger', 1);
            io.in(user1socket).emit('messeger', 2);
            io.in(user2socket).emit('messeger', 3);
            io.in(user2socket).emit('messeger', 1);
            roomcout = 0;

            for (var i = 0; i < 3; i++) {
                for (var j = 0; j < 3; j++) {
                    field[i][j] = (" ");
                }
            }
        }
        // 1 = reset board
    })

})

function CheckWin()
{
    for (var i = 0; i < 3; i++) {
        if (field[i][0]==(field[i][1])
                && field[i][0]==(field[i][2])
                && field[i][0]!=(" ")) {
            return true;
        }
    }

    for (var i = 0; i < 3; i++) {
        if (field[0][i]==(field[1][i])
                && field[0][i]==(field[2][i])
                && field[0][i]!=(" ")) {
            return true;
        }
    }

    if (field[0][0]==(field[1][1])
            && field[0][0]==(field[2][2])
            && field[0][0]!=(" ")) {
        return true;
    }

    if (field[0][2]==(field[1][1])
            && field[0][2]==(field[2][0])
            && field[0][2]!=(" ")) {
        return true;
    }

    return false;
}

// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }))



// parse application/json

app.use(bodyParser.json())



function Registration(username, password) {

    for (var i = 0; i < array.length; i++) {



        if (array[i].username == username) {

            return false;

        }

    }



    require('fs').appendFileSync("userpass.txt", username + ";" + password + "\n");



    array = [];

    require('fs').readFileSync('userpass.txt', 'utf-8').split(/\r?\n/).forEach(function (line) {

        array.push({

            username: line.split(';')[0],

            password: line.split(';')[1]

        });

        //console.log(array);

    })
    return true;

}

function Checkinfosize() {
    var fs = require('fs');
    var stats = fs.statSync("userinfo.txt");
    if (stats.size > 150) {
        const fs = require('fs')
        fs.truncate('userinfo.txt', 0, function () { console.log('clearinfo') })


    } else;

}

function checkUserExist(username, password) {

    for (var i = 0; i < array.length; i++) {



        if (array[i].username == username && array[i].password == password) {

            return true;

        }

    }

    return false;

}

function writeTextFile() {

    //for(var i=0; i< array.length;i++)




    require('fs').appendFileSync("userinfo.txt", username + ";" + new Date().toLocaleString("en-US", { timeZone: "Asia/Shanghai" }) + "\n")

}





app.get('/', function (req, res) {

    res.status(200).send('Hello World');

});



app.get('/status', function (req, res) {

    Checkinfosize();

    var content = "";

    fs.readFileSync('userinfo.txt', 'utf8').split(/\r?\n/).forEach(function (line) { content += line + "<br />" });

    res.status(200).send(content);



});



app.post('/login', function (req, res) {

    console.log('user: ', req.body.user);

    username = req.body.user;

    console.log('password: ', req.body.password);



    if (checkUserExist(req.body.user, req.body.password)) {

        //login success

        writeTextFile();

        res.status(200).send('OK');



    } else {

        //login failed

        res.status(400).send('Invaild username or password');

    }



    //if (req.body.user && req.body.password ) {

    //    console.log('login sus!');

    //    //req.session.user_id = 0; // This is failing (req.session is undefined)

    //    //res.redirect('/index');

    //    res.status(200).send('OK');

    //} else {

    //    console.log('login error!');

    //    //res.send('Bad user/pass');

    //    res.status(400).send('Invaild username or password');

    //}

});



app.post('/Registation', function (req, res) {



    console.log('user: ', req.body.user);



    if (Registration(req.body.user, req.body.password)) {



        res.status(200).send('Registration OK');
        console.log('Registration OK');


    } else {



        res.status(400).send('Registration Failed, User name already exist');
        console.log('Registration Fail');

    }


})

require('fs').readFileSync('userpass.txt', 'utf-8').split(/\r?\n/).forEach(function (line) {

    array.push({

        username: line.split(';')[0],

        password: line.split(';')[1]

    });

    //console.log(array);

})



//array = fs.readFileSync('userpass.txt').toString().split(";");

//for (i in array) {

//    console.log(array[0]);

//}



//app.listen(process.env.PORT, function () {

//    //var fs = require('fs')

//    // var content = fs.readFileSync('userpass.txt', 'utf8');

//    // console.log(content);







//});