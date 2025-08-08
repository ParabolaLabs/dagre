"use strict";

let util = require("../util");
let positionX = require("./bk").positionX;

module.exports = position;

function position(g) {
  g = util.asNonCompoundGraph(g);

  positionY(g);
  Object.entries(positionX(g)).forEach(([v, x]) => g.node(v).x = x);
}

function positionY(g) {
  let layering = util.buildLayerMatrix(g);
  let rankSep = g.graph().ranksep;
  let prevY = 0;
  layering.forEach(layer => {
    let maxInner = 0;
    let maxTop = 0;
    let maxBottom = 0;
    layer.forEach(v => {
      const node = g.node(v);
      maxTop = Math.max(maxTop, node.margintop || 0);
      maxBottom = Math.max(maxBottom, node.marginbottom || 0);
      maxInner = Math.max(maxInner, node.height);
    });
    layer.forEach(v => {
      g.node(v).y = prevY + maxTop + maxInner / 2;
    });
    prevY += maxTop + maxInner + maxBottom + rankSep;
  });
}

