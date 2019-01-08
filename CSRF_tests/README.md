# AnalysisPipeline for CSRF

These scripts discover if server-side applications written with Express.js, Koa.js, Hapi.js, or Sails.js frameworks have a CSRF protection or use JWTs which eliminate the possibility of a CSRF attack.

The code queries GitHub to produce all JavaScript related projects according to specified criteria and downloads the selected projects. Then run ESLint with the custom rules for CSRF and JWT detection (see the `updates` folder).

Note that the scripts do not perform any dataflow analysis, therefore, the findings are "potential", i.e. they will contain false positives.

The pipeline functions as following:
1. Run `repos_crawler.js` with the specified criteria to get a list of projects.
2. Run `repos_cloner.js` to clone the repositories.
3. Run ESLint with the configuration from the `.eslintrc.js` file.
4. Run `directoriesToCSV.js` to produce an output file structure.
5. After manually verify the returned results and record them in the produced .odt file.
6. To obtain data for statistical analysis, run `confounders_authors.js` and `confounders_repos.js`.
