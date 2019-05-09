var http = require("http")
var express = require("express")
var app = express()
const PORT = 3000;

app.use(express.static('static'))
var path = require('path')

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname + "/static/index.html"))
})

app.get("/api/lobbies", function (req, res) {

})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})