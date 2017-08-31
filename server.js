var express = require("express");
var cookieparser = require("cookie-parser");
var app = express();
app.use(cookieparser());
var https = require("https");
var fs = require("fs");
var index = fs.readFileSync("index.html");

app.use(express.static("."));
app.listen(8080,function(){
    console.log("Server Running…");
});

app.get("/", function(req, res){
    res.send(index);
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
