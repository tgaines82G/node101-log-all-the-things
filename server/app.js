const express = require("express");
const fs = require("fs");
const app = express();
//csvtojson is a data converter
const csv = require("convert-csv-to-json");

//we are dynamically changing our json spacing using express
// app.set('json spaces', 2);

app.get("/", (req, res, next) => {
    //write your logging code here
    //getting our headers
    let agent = req.headers["user-agent"].replace(",", "");
    // setting the time
    let time = new Date().toISOString();
    // our method is being completed by our req
    let method = req.method;
    // our path is taken in by our req as well
    let resource = req.url;
    // we are getting our version via our req as well
    let version = "HTTP/" + req.httpVersion;
    // the status we want to show when we let get our request
    let status = res.statusCode;
    let dataLogs = `${agent},${time},${method},${resource},${version},${status}\n`;
    //we are getting our log variable and appending it to a new file we are creating
    fs.appendFile("./log.csv", dataLogs, (err) => {
        if (err) {
            throw err;
        }
        //only have one console log. Kept getting errors about having more than one. took forever to figure out
        console.log(dataLogs);
        next();
    });
});

//get our status code and ok respond
app.get("/", (req, res) => {
    // write your code to respond "ok" here
    res.status(200).send("ok");
});

// app.get('/logs', (req, res) => {
//     // write your code to return a json object containing the log data here
//     //csv comes from our requirements at the top, turning our csv into a json

// let jsonData = csv.getJsonFromCsv('./server/logs.csv');
// res.json(jsonData);
// });

app.get("/logs", (req, res) => {
    // write your code to return a json object containing the log data here
    fs.readFile("./log.csv", "utf8", (err, data) => {
        if (err) {
            throw err;
        }
        //splting our incoming data with a new line
        let newLine = data.split("\n");
        //creating an empty array
        let jsonData = [];
        //for each each, we want to split it into an array and add the contacts to our header and then push it to our json
        newLine.forEach((line) => {
            let content = line.split(",");
            let obj = {
                Agent: content[0],
                Time: content[1],
                Method: content[2],
                Resource: content[3],
                Version: content[4],
                Status: content[5],
            };
            jsonData.push(obj);
        });
        return res.json(jsonData);
    });
});
module.exports = app;
