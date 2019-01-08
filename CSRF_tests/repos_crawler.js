/**
 * Created by ksdmitrieva on 12/3/2016.
 * Querying the repos does not require GitHub credentials, as this querying is not limited by GitHub.
 * The script takes 2 command line arguments: search string and prefix for the output filteredResults
 * For example: node repos_crawler cms+express express_cms
 * This script will search for "cms+express+language:JavaScript" and save results
 * into files:
 * ./resultfiles/express_items.json and ./resultfiles/express_raw_esults.json
 *
 * Commands for Koa:
 * node repos_crawler blog+koa koa_blog
 * node repos_crawler cms+koa koa_cms
 * node repos_crawler ecommerce+koa koa_ecommerce
 * node repos_crawler e-commerce+koa koa_ecommerce
 * node repos_crawler shopping+cart+koa koa_ecommerce
 *
 * Commands for Hapi:
 * node repos_crawler rest+hapi hapi_rest
 */
var GitHubApi = require("github");
var fs = require("fs");

const dir = "./resultfiles/";


//Get search query from the command line arguments
const searchQuery = process.argv[2]+"+language:JavaScript";
console.log("Search string: "+searchQuery);

const resultsFile = process.argv[3]+"_raw_results.json";
const resultItems = process.argv[3]+"_items.json";


var github = new GitHubApi({
    debug: true,
    protocol: "https",
    host: "api.github.com",
    headers: {
        "user-agent": "My-User-Agent"
    },
    Promise: require("bluebird"),
    followRedirects: false,
    timeout: 5000
});

console.log("Starting the execution");

var processRepos = function (err, res){
    console.log("Return results: "+res.total_count);
    var results = [];
    var count = 0;
    var totalCount = 0;
    res.items.forEach(function(element, index, arr) {
        totalCount++;
            count ++;
            results.push({
                "id": element.id,
                "name": element.name,
                "full_name": element.full_name,
                "html_url": element.html_url,
                "description": element.description,
                "size": element.size,
                "stargazers_count": element.stargazers_count,
                "language": element.language,
                "forks": element.forks,
                "pushed_at": element.pushed_at,
                "owner":element.owner.login
            });
    });


    fs.appendFile(dir+resultsFile, JSON.stringify(res), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file "+resultsFile+" was saved with "+totalCount+" elements.");
    });

    fs.appendFile(dir+resultItems, JSON.stringify(results), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file "+resultItems+" was saved with "+count+" elements.");
    });
};

//Call the GitHub search function
github.search.repos({q: searchQuery, per_page: 100, page: 1}, processRepos);
