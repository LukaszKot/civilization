var http = require("http")
var express = require("express")
var app = express()
const PORT = 6666;


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})