var cookieparser = require("cookie-parser");
var https = require("https");
var fs = require("fs");
var express = require("express");
var uniqid = require("uniqid");
var mysql = require("mysql");
var app = express();
app.use(cookieparser());
var cookie = fs.readFileSync("cookie.html");
var nocookie = fs.readFileSync("nocookie.html");

app.use(express.static("."));

var sock = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "memes",
    database: "donutme"
});

sock.connect(function(err){
    if(err) throw err;
    console.log("Connected to mysql database");
});

app.listen(8080,function(){
    console.log("Server Running…");
});

app.get("/", function(req, res){
    var id = req.cookies.id;
    if(id)
        res.end(cookie);
    else
        res.end(nocookie);
});

app.get("/donuts", function(req, res){
	var path = "/v3/businesses/search?term=";
	path += req.query.term;
	path += "&location=";
	path += req.query.zip;
    var token = "Bearer tFAr5YtkP-r7ZPR5Aj6-Ck5gfKXFKoDOrqjZ3-nuHVFppkMf0D_PxnEibe8bdNdKIx8WN7wa_osnRj4Yjc-D5SkkgSw9hadK7oAkQK2fFBEYLqjEh8T9WXSqV4p7WXYx";
    var options = {
        hostname: "api.yelp.com",
        path: path,
        method: "GET",
        headers: {
            "Authorization": token
        }
    };

    var req = https.request(options, function(response) {
        var data = "";
        console.log("Status: " + response.statusCode);
        console.log("Headers: " + JSON.stringify(response.headers));
        response.setEncoding("utf8");
        response.on("data", function (body) {
            data += body;
        });

        response.on("end", function(){
            res.end(data);
        });
    }).end();
});

app.get("/cookie", function(req, res){
    var id = uniqid();
    var zipcode = req.query.zipcode;
    console.log(id, zipcode);
    res.cookie("id", id).send('cookie set');
    sock.query("INSERT INTO users(id, zipcode) VALUES('" + id + "', '" + zipcode + "')", function(err, result){
        if(err) throw err;
    });
});

app.get("/lookup", function(req, res){ //If the user has no cookie this returns an empty JS object
    var id = req.cookies.id;
    sock.query("SELECT * FROM users WHERE id = '" + id + "'", function(err, result){
        if(err) throw err;
        console.log(result);
        res.send(result);
    });
});
