//jshint esversion: 6
var express = require('express');

var app = express();

app.use(express.static(path.join(__dirname, '')))