const dir = "./testfiles/";
const filename = "article.jade";

fs = require('fs');
//Replaced with a local updated version of pug-lexer
var lexer = require('../pug-lexer-master/index.js');
var parser = require('pug-parser');


function parse(data, filepath, filename, logFn){
    var result = lexer(data, {filename: filename});

    //console.log("Filename "+filename);
    //console.log(dir+"output_"+filename+".txt");
    if (filename) {
        fs.writeFile(dir+"output_"+filename+".txt", JSON.stringify(result), function(err){
            if (err) {
                return console.log(err);
            }
        });
    }

    return analyzeLexemes(result, filepath, logFn);
};

var analyzeLexemes = function(result, filepath, logFn) {
    //console.log("Potential XSS injections found:");
    var count = 0;
    result.forEach(function (element, index){
        if (((element.type === "interpolated-code") && (!element.mustEscape))
            || ((element.type === "code") && (element.buffer) && (!element.mustEscape))) {
            //console.log(index+": "+JSON.stringify(element));
            if (logFn) {
                logFn("Line "+element.line+", colomn "+element.col+", value: "+element.val);
            } else {
                console.log("Line "+element.line+", colomn "+element.col+", value: "+element.val);
            }
            count ++;
        }
    });
    if (logFn) {
        logFn("FILE "+filepath+ " has total of "+count+" vulnerabilities");
    } else {
        console.log("FILE "+filepath+ " has total of "+count+" vulnerabilities");
    }
    return count;
}

//To test the file by itself with a hard-coded input file
var main = function () {
    fs.readFile(dir+filename, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        //console.log(data);
        console.log("MAIN: filename "+filename);
        parse(data, './', filename, null);
    });
}

//main();

module.exports.parse = parse;
