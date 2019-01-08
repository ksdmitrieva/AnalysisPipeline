module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    // "extends": "eslint:recommended", //uncomment this to check if ESLint finds anything at all
    "parser": "babel-eslint",
    "plugins": [ ],
    "rules": {
      "linebreak-style": 0,
        "detect-csrf-protection": [
            "error",
            "always"
        ],
        "detect-csrf-lusca": [
            "error",
            "always"
        ],
        "detect-jwt": [
            "error",
            "always"
        ],
        "detect-csrf-sails": [
            "error",
            "always"
        ]

    }
};
