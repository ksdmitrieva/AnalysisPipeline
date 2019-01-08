# AnalysisPipeline

This project contains a number of scripts for discovering potential vulnerabilities in JavaScript projects, specifically:

* XSS vulnerabilities in applications written with EJS, Jade/Pug, or Angular templates
* CSRF vulnerabilities in applications written with Express.js, Koa.js, Hapi.js, or Sails.js frameworks.

The code queries GitHub to produce all JavaScript related projects according to specified criteria, downloads the selected projects, and then runs one of the analyzers for XSS or a set of ESLint rules for CSRF.

Note that the scripts do not perform any dataflow analysis, therefore, the findings are "potential", i.e. they will contain false positives. See ReadMe files in the `XSS_tests` and `CSRF_tests` folders for specific instructions.
