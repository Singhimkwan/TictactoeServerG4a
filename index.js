var express = require('express');

var bodyParser = require('body-parser')

var fs = require('fs'),

    readline = require('readline');;

var app = express();

var array = [];

var username



// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: false }))



// parse application/json

app.use(bodyParser.json())



function Registration(username, password) {



    require('fs').appendFileSync("userpass.txt", username + ";" + password + "\n");



    array = [];

    require('fs').readFileSync('userpass.txt', 'utf-8').split(/\r?\n/).forEach(function (line) {

        array.push({

            username: line.split(';')[0],

            password: line.split(';')[1]

        });

        //console.log(array);

    })

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

    //require('fs').writeFileSync("userinfo.txt", username + ";" + new Date(localeTime).toISOString().replace(/T/, ' ').replace(/\..+/, ''))



    require('fs').appendFileSync("userinfo.txt", username + ";" + new Date().toLocaleString("en-US", { timeZone: "Asia/Shanghai" }) + "\n")

}





app.get('/', function (req, res) {

    res.status(200).send('Hello World');

});



app.get('/status', function (req, res) {



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

    Registration(req.body.user, req.body.password);

    res.status(200).send('Registration OK');

})



app.listen(process.env.PORT || 3000, function () {

    //var fs = require('fs')

    // var content = fs.readFileSync('userpass.txt', 'utf8');

    // console.log(content);



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

    console.log('Example app listening on port 3000!');

});