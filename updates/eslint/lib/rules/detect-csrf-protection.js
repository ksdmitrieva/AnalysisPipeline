/**
 * Checks if CSRF middleware is used in Express and Koa applications
 * @author Ksenia Peguero
 */

//------------------------------------------------------------------------------
// Rule Definition
// This rule works for Express and Koa frameworks
// It looks for require() statements that call middleware listed in the
// csrf_libs array. The result returns which library is used.
// It is understandable that the library should also be assigned to the app
// as a middleware or to particular routes. However, this rule does not validate
// that. Therefore, a quick manual check is required.
//------------------------------------------------------------------------------


module.exports = function(context) {

    "use strict";
    var csrf_libs = ["csurf", "csrf", "alt-XSRF", "koa-csrf", "crumb"]

    return {
        "CallExpression": function(node) {
            var token = context.getTokens(node)[0],
                nodeType = token.type,
                nodeValue = token.value;

            if (node.callee.name === "require" && csrf_libs.includes(node.arguments[0].value)) {
                context.report(node, "CSRF protection with "+node.arguments[0].value);
            }
        }
    };

};
