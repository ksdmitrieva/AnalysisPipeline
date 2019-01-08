/**
 * Checks if the CSRF middleware is used with Lusca
 * @author Ksenia Peguero
 */

//------------------------------------------------------------------------------
// Rule Definition
// This rule works for Express and Koa frameworks. It checks if the lusca
// middleware is used and if it is configured to provide CSRF protection with
// the "csrf" property set to "true".
//------------------------------------------------------------------------------


module.exports = function(context) {

    "use strict";
    var lusca_var = "";

    return {
        "CallExpression": function(node) {
            var token = context.getTokens(node)[0],
                nodeType = token.type,
                nodeValue = token.value;

            if (node.callee.name === "require" && node.arguments[0].value === "lusca") {
                // Keep track of the lusca variable name
                lusca_var = node.parent.id.name
            }

            if ( lusca_var != "" && node.callee.name === lusca_var && node.arguments[0].properties) {
              for (const property of node.arguments[0].properties) {
                if (property.key.name === "csrf" && property.value.value === true) {
                  context.report(node, "CSRF protection with lusca");
                }
              }
            }
        }
    };
};
