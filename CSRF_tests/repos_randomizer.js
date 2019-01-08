/**
 * Created by ksdmitrieva on 07/03/2018.
 * The script randomly selects a specified sample of the GitHub projects from
 * the specified file containing JSON array of the GitHub project descriptions.
 * The first parameter is the name of the file containing the array of items to
 * be sampled. The file name should not include the extension. ".json" will be
 * added automatically
 * For example: node repos_randomizer express_blog_items 30
 * This will randomly select 30 items out of the listed in express_blog_items.json
 * and write them to express_blog_items_randomized.json
 *
 * Commands for Koa
 * node repos_randomizer koa_blog_items 68
 */

var fs = require("fs");
var _ = require("underscore");
const randomized_suffix = "_randomized.json";
const results_suffix = ".json";
const dir = "./resultfiles/";

const file = process.argv[2];
console.log("File: "+file);
const sample_size = process.argv[3];
console.log("Sample size: "+sample_size);

randomizeRepos();

function randomizeRepos() {
    fs.readFile(dir+file+results_suffix, function(err,data) {
        if (err) {
            return console.log(err);
        }
        var repos = JSON.parse(data);
        console.log("File "+(dir+file+results_suffix)+" has "+repos.length+" elements");
        var rand = repos[Math.floor(Math.random() * repos.length)];
        var sampleItems = _.sample(repos, sample_size);

        fs.appendFile(dir+file+randomized_suffix, JSON.stringify(sampleItems), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("The file "+file+randomized_suffix+" was saved with "+sampleItems.length+" elements.");
        });
    });
}
