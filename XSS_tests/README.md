# AnalysisPipeline for XSS

These scripts discover potential XSS vulnerabilities in JavaScript projects written with EJS, Jade/Pug, or Angular templates. The code queries GitHub to produce all JavaScript related projects according to specified criteria, downloads the selected projects, and then runs one of the analyzers, depending on the criteria used (for EJS, for Jade/Pug, or for Angular). The analyzers produce a text file per project with a list of potential XSS vulnerabilities.

Note that the scripts do not perform any dataflow analysis, therefore, the findings are "potential", i.e. they will contain false positives.

The pipeline functions as following:
1. Run repos_crawler.js with the specified criteria to get a list of projects.
2. Run repoStructureAnalyzer.js to get the needed content of the project (we are not downloading everything, only the files we need for analysis).
3. Depending on the criteria selected in step one, run one of the analyzers (ejsFilesAnalyzer.js, jadeFilesAnalyzer.js, or angularFilesAnalyzer.js).

Note:
* angularFilesAnalyzer.js uses ESLint CLIEngine with an additional rule. The rule is in updates/eslint/lib/rules/angular_trustAs.js
* ejsFilesAnalyzer.js uses a custom ejsParser.js which calls the modified [EJS Core engine](https://github.com/mde/ejs) to perform the analysis. The modifications are in updates/ejs/lib/ejs.js
* jadeFilesAnalyzer.js uses a custom pugParser.js which is built on top of the modified [pug-lexer](https://github.com/pugjs/pug-lexer). The modifications are in updates/pug-lexer/index.js
