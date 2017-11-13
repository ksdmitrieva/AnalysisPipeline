"use strict";

module.exports = function (context) {

  return {
    "CallExpression": function (node) {
        if (((node.callee.name == 'trustAs') || ((node.callee.property) && (node.callee.property.name == 'trustAs')))
            || ((node.callee.name == 'trustAsHtml') || ((node.callee.property) && (node.callee.property.name == 'trustAsHtml')))) {
        context.report(node, "The function trustAs can be unsafe");
      }
    }
  };

}
