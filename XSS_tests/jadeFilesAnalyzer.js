var fs = require("fs");
var pugParser = require('./pugParser');

const dir = "./resultfiles/jadeResults/";
const dirResults = "./resultfiles/jadeAnalyzed/"

var resultsStream = null;
var filename = "";
var files = null;

function initLogging(filename){
    resultsStream = fs.createWriteStream(dirResults +filename.substring(0, filename.length-5)+"_analyzed.txt");
}

function log(message){
    if (resultsStream) {
        resultsStream.write(message+"\n");
    } else {
        console.log(message);
    }
}

function closeLogging() {
    resultsStream.end();
}

function readFiles(path){
    fs.readdir(path, function(err, items) {
        files = items;
        //console.log(files);
        //console.log(files.length);
        for (var i = 10; i < files.length; i++) {
            filename = files[i];
            initLogging(filename);
            contentsFromBase64(path+filename);
        }
    });
}

function contentsFromBase64(filename){
    log("Analyzing file "+filename);
    var fileContents;
    fs.readFile(filename, function(err, data){
        if (err) throw err;
        var items = JSON.parse(data);
        var vulnsCount = 0;
        var exceptionsCount = 0;
        items.forEach(function(element, index, arr){
            //console.log(element.path+" Content "+element.content);
            fileContents = new Buffer(element.content, 'base64').toString('utf-8');
            log("ANALYZE FILE "+element.path);
            log("url: "+element.url);
            var pathParts = element.path.split("/");
            var fname = pathParts[pathParts.length-1];
            //console.log(fileContents);
            try {
                vulnsCount += pugParser.parse(fileContents, element.path, fname, log);
            } catch (err) {
                exceptionsCount ++;
                log(fname+" encountered a syntax error "+err);
            }
        });
        log("\n");
        log("RESULTS");
        log("Files: "+items.length);
        log("Vulnerabilities: "+vulnsCount);
        log("Exceptions: "+exceptionsCount);
    });
};

readFiles(dir);
