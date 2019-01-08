/**
 * Checks if CSRF is configured in Sails.js apps
 * @author Ksenia Peguero
 */

//------------------------------------------------------------------------------
// Rule Definition
// This rule works for the Sails.js frameworks
// The rule checks if the 'csrf' property is set to true or to a configuration
// object. In both cases, the CSRF protection is enabled.
//------------------------------------------------------------------------------


module.exports = function(context) {

    "use strict";

    return {
      "AssignmentExpression:exit": function (node) {
        if ("property" in node.left) { // member assignment
          if (['='].indexOf(node.operator) !== -1) {
            if (node.left.property.name === 'csrf') {
              if ("value" in node.right && node.right.value === true) {
                console.log("CSRF assignment set to "+node.right.value);
                context.report(node, "CSRF is set to true");
              } else if ("properties" in node.right) {
                console.log("CSRF set to an object");
                for (var p of node.right.properties) {
                  console.log("Property: "+p.key.name);
                }
                context.report(node, "CSRF is set to an object");
              }
            }
          }
        }
      }
    };

};
