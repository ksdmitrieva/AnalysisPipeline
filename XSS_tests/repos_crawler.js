var GitHubApi = require("github");
var fs = require("fs");

const resultsFile = "results.json";
const filteredResults = "filteredResults.json";
const dir = "./resultfiles/";

//Modify the search string for other templates (EJS, Jade/Pug)
//Search strings for Angular projects
const searchQuery = "cms+Angular+mean";
//const searchQuery = "Blog+Angular"; //returns results with back-ends other than JS - not pure for the the experiment
//const searchQuery = "cms+Angular+Express";
//const searchQuery = "cms+Angular+node";
//const searchQuery = "Blog+Angular+node";
//const searchQuery = "Blog+Angular+mean";
//const searchQuery = "Blog+Angular+Express";

//Search string for Express without Angular
//const searchQuery = "blog+express+NOT+angular";

var github = new GitHubApi({
    // optional args
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
    //console.log("res "+JSON.stringify(res));
    var results = [];
    var count = 0;
    var totalCount = 0;
    res.items.forEach(function(element, index, arr) {
        //console.log("element "+JSON.stringify(element));
        totalCount++;
        //criteria:
        //Last commit date >= 2014
        //Stars > 0
        //Language: JavaScript, HTML, CSS, TypeScript

        if ((element.pushed_at > "2013") //2013
            && (element.stargazers_count > 0)
            && (element.language == "JavaScript" || element.language == "HTML"
                || element.language == "CSS" || element.language == "TypeScript")){
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
        }
    });

    fs.writeFile(dir+resultsFile, JSON.stringify(res), function(err) {
        //fs.appendFile(dir+resultsFile, JSON.stringify(res), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file "+resultsFile+" was saved with "+totalCount+" elements.");
    });

    fs.writeFile(dir+filteredResults, JSON.stringify(results), function(err) {
        //fs.appendFile(dir+filteredResults, JSON.stringify(results), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file "+filteredResults+" was saved with "+count+" elements.");
    });
};

github.search.repos({q: searchQuery, per_page: 100, page: 1}, processRepos);
