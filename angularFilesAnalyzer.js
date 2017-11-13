var fs = require("fs");
const dir = "./resultfiles/angularResults/";
const dirResults = "./resultfiles/angularAnalyzed/"
const tempFileName = "./testFiles/tempFile.js";

var resultsStream = null;
var filename = "";
var files = null;

var CLIEngine = require("eslint").CLIEngine;

//Configure ESLint CLI engine
var cli = new CLIEngine({
    envs: ["browser", "node"],
    parser: "babel-eslint",
    useEslintrc: false,
    rules: {
        angular_trustAs: 2
    }
});

function initLogging(filename){
    var logFile = dirResults +filename.substring(0, filename.length-15)+"_analyzed.txt";
    console.log("Output file: "+logFile);
    resultsStream = fs.createWriteStream(logFile);
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
        console.log("Total number of Angular projects "+files.length);
        for (var i = 0; i < files.length; i++) {
          filename = files[i];
          initLogging(filename);
          contentsFromBase64(path+filename);
        }
    });
}

function contentsFromBase64(filename){
    log("Analyzing project file "+filename);
    var fileContents;
    fs.readFile(filename, function(err, data){
        if (err) throw err;
        var items = JSON.parse(data);
        var vulnsCount = 0;
        var exceptionsCount = 0;
        var report = null;
        var element = null;
        for(var i=0; i < items.length; i++) {
            //console.log(element.path+" Content "+element.content);

            //test each base64 item-file in the file
            element = items[i];

            fileContents = new Buffer(element.content, 'base64').toString('utf-8');
            log("ANALYZE FILE "+element.path);
            var pathParts = element.path.split("/");
            var fname = pathParts[pathParts.length-1];
            //console.log(fileContents);
            try {
                //write fileContents to a file
                fs.writeFileSync(tempFileName, fileContents);
                //analyze the saved file with ESLint CLI
                report = cli.executeOnFiles([tempFileName]);

                vulnsCount += report.results[0].messages.length;

                //log results to a file
                log("results: "+fname);
                for(var m = 0; m < report.results[0].messages.length; m++) {
                    log(JSON.stringify(report.results[0].messages[m]));
                }

            } catch (err) {
                exceptionsCount ++;
                log(fname+" encountered a syntax error "+err);
            }
        }
        log("\n");
        log("RESULTS");
        log("Files: "+items.length);
        log("Vulnerabilities: "+vulnsCount);
        log("Exceptions: "+exceptionsCount);
    });
};

readFiles(dir);
