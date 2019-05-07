var http = require("http")
var express = require("express")
var app = express()
const PORT = 1414;


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})