var GitHubApi = require("github");
var fs = require("fs");

const resultsFile = "results.json";
//const filteredResults = "filteredResults_2016.11.08_noAngular - 186.json";
//const filteredResults = "filteredResults_2017.02.28_Angular_withJSbackend - 64.json";
const filteredResults = "filteredResults_2017.02.28_Angular_Blog_CMS_withJSbackend - 53.json";
const dir = "./resultfiles/";
const jadeDir = "jadeResults/";
const ejsDir = "ejsResults/";
const angularDir = "angularResults/"
//const reposDir = "reposStructures/";
const reposDir = "reposStructuresAngular/";

const angularKeyWords = [
    "node_modules",
    "angular.js",
    "angular.min.js",
    "angular-sanitize.js",
    "angular-sanitize.min.js",
    "angular-loader.js",
    "angular-loader.min.js",
    "angular-cookies.js",
    "angular-cookies.min.js",
    "angular-resource.js",
    "angular-resource.min.js",
    "angular-route.js",
    "angular-route.min.js"
];

var github = new GitHubApi({
    // optional args
    debug: true,
    protocol: "https",
    host: "api.github.com", // should be api.github.com for GitHub
    headers: {
        "user-agent": "My-User-Agent" // GitHub is happy with a unique user agent
    },
    Promise: require("bluebird"),
    followRedirects: false, // default: true; there's currently an issue with non-get redirects,
                            // so allow ability to disable follow-redirects
    timeout: 5000
});

var configFile = "./config.json";
var config;
try {
    config = require(configFile);
}
catch (err) {
    config = {};
    console.log("unable to read file '" + configFile + "': ", err);
}
var git_username = config.username;
var git_password = config.password

github.authenticate({
    type: "basic",
    username: git_username,
    password: git_password
});

console.log("Starting the execution");

//to get repos from GitHub
// step 1 on querying
getReposList();


//change the name of the file to read (with underscore)
// step 2 of querying, when the list of repos is already created
//readRepoStructureFile(dir+reposDir+"zybbyzaa_NodejsBlog.json");

//get the list of repos produced by repos_crawler and call getDirectoryForRepo for each of them
function getReposList() {
    fs.readFile(dir+filteredResults, function(err,data) {
        if (err) {
            return console.log(err);
        }
        var repos = JSON.parse(data);
        console.log("File "+(dir+filteredResults)+" has "+repos.length+" elements");
        var index = 0;
        while (index < repos.length) {
            getDirectoryForRepo(repos[index]);
            index++;
        }
    });
}

//takes a JSON object from the list of filtered repos
//gets a reference for a repo branch (sha)
//gets a directory tree for that branch
//saves the directory tree into a file
//if the directory tree is not empty calls the check for Jade/Pug/EJS/Angular files in the tree
function getDirectoryForRepo(repo) {
    console.log("Repo: "+repo.full_name);
    console.log(JSON.stringify(repo));

    ///repos/:owner/:repo/git/refs
    github.gitdata.getReferences({owner:repo.owner, repo:repo.name}, function (err,res){
        //console.log("Here are the branches");
        //console.log(JSON.stringify(res));
        var sha = getMasterSha(res);
        console.log("Sha: "+sha);

        ///repos/:owner/:repo/git/trees/:sha
        github.gitdata.getTree({owner:repo.owner, repo:repo.name, sha: sha, recursive: 1}, function (err,res){
            console.log("Here is the tree");
            var filename = dir+reposDir+repo.owner+"_"+repo.name+".json";
            //console.log(JSON.stringify(res));
            writeJSONtoFile(filename, res);
            if (res.tree) {
                getAngularFiles(res.tree, repo.owner, repo.name);
            }
            //if (res.tree) {
            //    getJadeFiles(res.tree, repo.owner, repo.name);
            //}
        });
    });
};

//reads the repository structure from the file that was saved in getDirectoryForRepo
//the filename is provided as a parameter
function readRepoStructureFile(filename) {

    var file = filename.split('/')[3];
    var owner = file.split('_')[0];
    var repoName = file.split('_')[1];
    repoName = repoName.substring(0, repoName.length-5);
    console.log("Owner: "+owner);
    console.log("RepoName: "+repoName);
    fs.readFile(filename, function(err,data) {
        if (err) {
            return console.log(err);
        }
        var items = JSON.parse(data).tree;
        //console.log("Tree "+JSON.stringify(items));
        getEJSFiles(items, owner, repoName);
    });

}

//checks if the repo structure has any Jade files
//if it has, downloads the content of each file in Base64 format and saves it into one file per repository
function getJadeFiles(items, owner, repoName) {
    console.log("Owner "+owner);
    var jadeFiles = [];
    var count = 0;
    var countJade = 0;
    var fileSaved = false;
    var jadeFilesFound = false;
    console.log("array size "+items.length);
    items.forEach(function(element, index, arr) {
        if (element.type === "blob" && element.path.endsWith(".jade")) {
            jadeFilesFound = true;
            //call /repos/:owner/:repo/contents/:path
            github.repos.getContent({owner: owner, repo: repoName, path: element.path}, function (err, res){
                //console.log(countJade+" content: "); //+res.content
                element.content = res.content;
                jadeFiles.push(element);
                countJade++;
                count++;
                if (count === items.length && !fileSaved) {
                    fileSaved = true;
                    console.log(countJade+" Jade files in repo "+owner+"/"+repoName+" out of "+count);
                    var str = owner+"/"+repoName+"\t"+count+"\n";
                    fs.appendFile(dir+"filelist.txt", str, function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    //console.log(JSON.stringify(jadeFiles));
                    filename = dir + jadeDir + owner+"_"+repoName +"_jadefiles.json";
                    writeJSONtoFile(filename, jadeFiles);
                }
            });
        } else count++;
    });
    if (! jadeFilesFound)
    {
        console.log("No Jade files in repository "+owner+"/"+repoName);
        var str = owner+"/"+repoName+"\t"+0+"\n";
        fs.appendFile(dir+"filelist.txt", str, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
};

//checks if the repo structure has any EJS files
//if it has, downloads the content of each file in Base64 format and saves it into one file per repository
function getEJSFiles(items, owner, repoName) {
    console.log("Owner "+owner);
    var ejsFiles = [];
    var count = 0;
    var countEjs = 0;
    var fileSaved = false;
    var ejsFilesFound = false;
    console.log("array size "+items.length);
    items.forEach(function(element, index, arr) {
        if (element.type === "blob" && element.path.endsWith(".ejs")) {
            ejsFilesFound = true;
            //call /repos/:owner/:repo/contents/:path
            github.repos.getContent({owner: owner, repo: repoName, path: element.path}, function (err, res){
                //console.log(countEjs+" content: "); //+res.content
               count++;
               if (res) {
                   element.content = res.content;
                   ejsFiles.push(element);
                   countEjs++;

                   if (count === items.length && !fileSaved) {
                       fileSaved = true;
                       console.log(countEjs+" EJS files in repo "+owner+"/"+repoName+" out of "+count);
                       var str = owner+"/"+repoName+"\t"+count+"\t"+countEjs+"\n";
                       fs.appendFile(dir+"EJSfilelist.txt", str, function (err) {
                           if (err) {
                               return console.log(err);
                           }
                       });
                       //console.log(JSON.stringify(ejsFiles));
                       filename = dir + ejsDir + owner+"_"+repoName +"_ejsfiles.json";
                       writeJSONtoFile(filename, ejsFiles);
                   }
               }
            });
        } else count++;
    });
    if (! ejsFilesFound)
    {
        console.log("No EJS files in repository "+owner+"/"+repoName);
        var str = owner+"/"+repoName+"\t"+count+"\t"+0+"\n";
        fs.appendFile(dir+"EJSfilelist.txt", str, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
};

//checks if the repo structure has any Angular files (JavaScript)
//downloads the content of each file in Base64 format and saves it into one file per repository
function getAngularFiles(items, owner, repoName) {
    console.log("Owner "+owner);
    var jsFiles = [];
    var count = 0;
    var countJS = 0;
    var fileSaved = false;
    var jsFilesFound = false;
    console.log("array size "+items.length);
    items.forEach(function(element, index, arr) {
        if (element.type === "blob" && element.path.endsWith(".js")) {
            var libraryFile = false;
            for (var i=0; i<angularKeyWords.length; i++) {
                if (element.path.indexOf(angularKeyWords[i]) != -1)  libraryFile = true;
            }
            if (!libraryFile) {
                //console.log(element.path.indexOf("node_modules")+" element.path "+element.path);
                jsFilesFound = true;
                //call /repos/:owner/:repo/contents/:path
                github.repos.getContent({owner: owner, repo: repoName, path: element.path}, function (err, res){
                    element.content = res.content;
                    jsFiles.push(element);
                    countJS++;
                    count++;
                    if (count === items.length && !fileSaved) {
                        fileSaved = true;
                        console.log(countJS+" JS files in repo "+owner+"/"+repoName+" out of "+count);
                        var str = owner+"/"+repoName+"\t"+count+"\t"+countJS+"\n";
                        fs.appendFile(dir+"filelist.txt", str, function (err) {
                            if (err) {
                                return console.log(err);
                            }
                        });
                        //console.log(JSON.stringify(jadeFiles));
                        filename = dir + angularDir + owner+"_"+repoName +"_angularfiles.json";
                        writeJSONtoFile(filename, jsFiles);
                    }
                });
            } else count++;
        } else count++;
    });
    if (! jsFilesFound)
    {
        console.log("No JS files in repository "+owner+"/"+repoName);
        var str = owner+"/"+repoName+"\t"+0+"\t"+0+"\n";
        fs.appendFile(dir+"filelist.txt", str, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
};


var writeJSONtoFile = function (filename, obj) {
    fs.writeFile(filename, JSON.stringify(obj), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("The file " + filename + " was saved.");
    });
};

//gets the repo refernece (sha) for the 'master' branch
//if a repo doesn't have a master branch, throws an error
var getMasterSha = function (refs) {
    var sha = null;
    refs.some(function (element, index){
        if (element.ref === "refs/heads/master"){
            sha = element.object.sha;
            return true;
        }
    });
    if (sha == null) throw new Error('No master branch found');
    return sha;
}
