'use strict';

/**
 * Created by ksdmitrieva on 13/03/2018.
 * The script clones the GitHub projects from the file provided into the
 * specified directory.
 * The first parameter is the name of the file containing the array of JSON
 * items describing GitHub projects.
 * The second parameter is the directory where the projects will be cloned to.
 * Each project is placed into a folder with the author name and then the
 * project name. This is done so that projects with the same name don't
 * overwrite each other
 * For example: node repos_cloner ./resultfiles/express_blog_items_randomized.json ./../Part2Apps/ExpressApps/blog
 *
 * Commands for Express:
 * node repos_cloner ./resultfiles/express_blog_items_randomized.json ./../Part2Apps/ExpressApps/blog
 * node repos_cloner ./resultfiles/express_cms_items_randomized.json ./../Part2Apps/ExpressApps/cms
 * node repos_cloner ./resultfiles/express_ecommerce_items_randomized.json ./../Part2Apps/ExpressApps/ecommerce
 *
 * Commands for Koa:
 * node repos_cloner ./resultfiles/koa_blog_items_randomized.json ./../Part2Apps/KoaApps/blog
 * node repos_cloner ./resultfiles/koa_cms_items.json ./../Part2Apps/KoaApps/cms
 * node repos_cloner ./resultfiles/koa_ecommerce_items.json ./../Part2Apps/KoaApps/ecommerce
 *
 */

 var fs = require("fs");
 var child_process = require("child_process");

 const file = process.argv[2];
 console.log("File: "+file);
 const directory = process.argv[3];
 console.log("Directory: "+directory);

readFiles();

function readFiles() {
  fs.readFile(file, function(err,data) {
      if (err) {
          return console.log(err);
      }
      var repos = JSON.parse(data);
      console.log("File "+(file)+" has "+repos.length+" elements");
      repos.forEach(function(item) {
        console.log("Clone: "+item.full_name);
        createDirectories(item, clone);
      });
    });
}

function createDirectories(item, callback) {
  var outputDir = directory+"/"+item.owner;
  if (fs.existsSync(outputDir)) {
    outputDir = outputDir+""+getRandomInt(3);
  }
  console.log("outputDir: "+outputDir);
  fs.mkdirSync(outputDir);
  outputDir = outputDir+"/"+item.name;
  console.log("outputDir: "+outputDir);
  fs.mkdirSync(outputDir);
  callback(item, outputDir);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function clone(item, dir) {
  var command = ['git clone', item.html_url+".git", dir, '--progress'].join(' ');
  child_process.exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}
