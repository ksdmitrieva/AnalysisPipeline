/**
 * Checks if JWT middleware is used in any server-side framework
 * @author Ksenia Peguero
 */

//------------------------------------------------------------------------------
// Rule Definition
// The rule works for Express, Koa, Hapi, and Sails applications. It checks
// if any of the listed JWT middlewares are used by the application. Note that
// it checks for the generic "jsonwebtoken" middleware, as well as framework-
// specific middlewares, such as "express-jwt" or "koa-jwt".
//------------------------------------------------------------------------------


module.exports = function(context) {

    "use strict";
    var jwt_libs = ["jsonwebtoken", "express-jwt", "koa-jwt", "hapi-auth-jwt2", "hapi-auth-jwt", "passport-jwt"]

    return {
        "CallExpression": function(node) {
            var token = context.getTokens(node)[0],
                nodeType = token.type,
                nodeValue = token.value;

            if (node.callee.name === "require" && jwt_libs.includes(node.arguments[0].value)) {
                // Keep track of found CSRF
                console.log("require jwt found "+node.arguments[0].value);
                context.report(node, "JWT implementation with "+node.arguments[0].value);
            }

        }
    };

};
