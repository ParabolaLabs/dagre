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
    const maxHeight = layer.reduce((acc, v) => {
      const node = g.node(v);
      const height = node.height + (node.margintop || 0) + (node.marginbottom || 0);
      if (acc > height) {
        return acc;
      } else {
        return height;
      }
    }, 0);
    layer.forEach(v => {
      // const node = g.node(v);
      // const nodeHeight = node.height + (node.margintop || 0) + (node.marginbottom || 0);
      g.node(v).y = prevY + maxHeight / 2;
    });
    prevY += maxHeight + rankSep;
  });
}

