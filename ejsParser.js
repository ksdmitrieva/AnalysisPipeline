module.exports.parse = parse;

//use the modified version of the EJS engine
var ejs = require('../ejs-master/');

function parse(fileContents, path, filename, log) {
    var output;
    //log("ejs: Parse file "+filename);
    var options = {
        filename: filename,
        debug: true
    }
    output = ejs.createModel(fileContents, options);
    log("Results: ");
    outputArray(output, log);
    log("FILE "+path+ " has total of "+output.length+" vulnerabilities");
    return output.length;
}

function outputArray(arr, log){
    for (var i=0; i < arr.length; i++){
        log(JSON.stringify(arr[i]));
    }
}
