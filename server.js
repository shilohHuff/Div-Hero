var express = require('express');

var app = express()

app.use(express.static('public'))
app.listen(8090, function(){
    console.log("Serving Files")
})