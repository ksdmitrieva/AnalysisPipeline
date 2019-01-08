/**
 * Created by ksdmitrieva on 09/12/2018.
 */

var fs = require("fs");
var _ = require('lodash');

// processRepos("./resultfiles/express_all_items.json", "./resultfiles/express_repos.csv");
// processRepos("./resultfiles/hapi_all_items.json", "./resultfiles/hapi_repos.csv");
// processRepos("./resultfiles/koa_all_items.json", "./resultfiles/koa_repos.csv");
processRepos("./resultfiles/sails_all_items.json", "./resultfiles/sails_repos.csv");

function processRepos(inputFile, outputFile) {
    var results = require(inputFile);

    console.log("results "+results.length);

    var repo;
    for( var i=0; i < results.length; i++) {
        repo = results[i];

        fs.appendFileSync(outputFile, repo.full_name+","+repo.name+","+repo.size+","+repo.stargazers_count+","+repo.forks+"\n");
    }
}
