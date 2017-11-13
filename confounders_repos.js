/**
 * Created by ksdmitrieva on 04/25/2017.
 */

var fs = require("fs");
var _ = require('lodash');

//processAngularRepos();
//processJadeRepos();
processEJSrepos();

function processAngularRepos() {
    const inputFile = "./resultfiles/filteredResults_2017.02.28_Angular_Blog_CMS_withJSbackend - 53.json";
    const outputFile = "repos_angular.csv";
    var results = require(inputFile);

    console.log("results "+results.length);

    var repo;
    for( var i=0; i < results.length; i++) {
        repo = results[i];

        //console.log(repo.full_name+","+repo.size+","+repo.stargazers_count+","+repo.forks);
        fs.appendFileSync(outputFile, repo.full_name+","+repo.name+","+repo.size+","+repo.stargazers_count+","+repo.forks+"\n");
    }
}

function processJadeRepos() {
    const inputFile = "./resultfiles/filteredResults_2016.11.08_noAngular - 186.json";
    const inputRepos = "repos_jade.txt";
    const outputFile = "repos_jade.csv";   //"repos_ejs.csv"

    var results = require(inputFile);
    console.log("All Repos: "+results.length);

    var reposData = fs.readFileSync(inputRepos, 'utf8');
    var repos = reposData.split('\r\n');
    console.log("Jade Repos: "+repos.length);

    var repo;
    for( var i=0; i < results.length; i++) {
        repo = results[i];
        if (_.indexOf(repos, repo.full_name) > -1 ) {
            //console.log(repo.full_name);
            fs.appendFileSync(outputFile, repo.full_name+","+repo.name+","+repo.size+","+repo.stargazers_count+","+repo.forks+"\n");
        }
    }
}

function processEJSrepos() {
    const inputFile = "./resultfiles/filteredResults_2016.11.08_noAngular - 186.json";
    const inputRepos = "repos_ejs.txt";
    const outputFile = "repos_ejs.csv";   //"repos_ejs.csv"

    var results = require(inputFile);
    console.log("All Repos: "+results.length);

    var reposData = fs.readFileSync(inputRepos, 'utf8');
    var repos = reposData.split('\r\n');
    console.log("EJS Repos: "+repos.length);

    var repo;
    for( var i=0; i < results.length; i++) {
        repo = results[i];
        if (_.indexOf(repos, repo.full_name) > -1 ) {
            //console.log(repo.full_name);
            fs.appendFileSync(outputFile, repo.full_name+","+repo.name+","+repo.size+","+repo.stargazers_count+","+repo.forks+"\n");
        }
    }
}