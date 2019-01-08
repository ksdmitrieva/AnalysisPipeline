/**
 * Created by ksdmitrieva on 09/12/2018.
 * This script writes the list of directories in a folder into a CSV file, where
 * each directory is on a new line.
 *
 * To run the script:
 *
 * node .\directoriesToCSV.js [path_to_folder] output_file
 *
 * For example:
 * node .\directoriesToCSV.js ..\KoaApps\blog Koa-blog-results.csv
 *
 * After that you can save the csv file as .ods
 *
 */

var fs = require("fs");

var dir = "";
var output = "";
var outputFile = null;

dir = process.argv[2];
output = process.argv[3];

console.log("Read files from "+dir);
console.log("Write to file "+output);

if (output != "") {
  var filepath = dir+"\\"+output;
  console.log("Filepath: "+filepath)
  outputFile = fs.openSync(filepath, "w");
  console.log("outputFile "+output);
}

function readFiles(path){
  if (outputFile == null || dir === "") {
    console.log("Something is wrong, did not read the directories");
    console.log("dir "+dir);
    console.log("outputFile "+outputFile);
    return;
  }

  fs.readdir(path, function(err, items) {
    var filename = "";
    for (var i = 0; i < items.length; i++) {
      filename = items[i];
      fs.writeSync(outputFile, filename+"\n");
    }
    fs.close(outputFile, (err) => {
      if (err) throw err;
    });
  });
}

readFiles(dir);
