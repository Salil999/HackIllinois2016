//jshint esversion: 6
var express = require('express');
var path = require('path');
var Firebase = require('firebase');
var Client = require('node-rest-client').Client;

function getInfo(url) {
    var client = new Client();
    client.get(url, function(data, res) {
        console.log(data);
        return data;
    });
}

var app = express();

//app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
    var x = getInfo('http://api.reimaginebanking.com/accounts?type=Checking&key=65be1ee16b2fbd6faade515551491370');
    res.send(x);
    getInfo('http://www.mocky.io/v2/56c8da23110000173cf88290');
    //res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.post('/login', function(req, res) {
    res.send('hello world');
    /*
	res.send('Hello');
    console.log(getInfo('http://www.mocky.io/v2/56c8da23110000173cf88290'));
    var x = getInfo('http://www.mocky.io/v2/56c8da23110000173cf88290');
    res.send(x);
    */
});

app.listen(5000);
