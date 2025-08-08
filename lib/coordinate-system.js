"use strict";

module.exports = {
  adjust: adjust,
  undo: undo
};

function adjust(g) {
  let rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === "lr" || rankDir === "rl") {
    swapWidthHeight(g);
  }
}

function undo(g) {
  let rankDir = g.graph().rankdir.toLowerCase();
  if (rankDir === "bt" || rankDir === "rl") {
    reverseY(g);
  }

  if (rankDir === "lr" || rankDir === "rl") {
    swapXY(g);
    swapWidthHeight(g);
  }
}

function swapWidthHeight(g) {
  g.nodes().forEach(v => swapWidthHeightOne(g.node(v)));
  g.edges().forEach(e => swapWidthHeightOne(g.edge(e)));
}

function swapWidthHeightOne(attrs) {
  let w = attrs.width;
  attrs.width = attrs.height;
  attrs.height = w;
  // Also swap margins to keep them aligned with the swapped dimension
  if (attrs) {
    const ml = attrs.marginleft; const mr = attrs.marginright;
    const mt = attrs.margintop;  const mb = attrs.marginbottom;
    if (ml !== undefined || mr !== undefined || mt !== undefined || mb !== undefined) {
      attrs.marginleft = mt;
      attrs.marginright = mb;
      attrs.margintop = ml;
      attrs.marginbottom = mr;
    }
  }
}

function reverseY(g) {
  g.nodes().forEach(v => reverseYOne(g.node(v)));

  g.edges().forEach(e => {
    let edge = g.edge(e);
    edge.points.forEach(reverseYOne);
    if (Object.hasOwn(edge, "y")) {
      reverseYOne(edge);
    }
  });
}

function reverseYOne(attrs) {
  attrs.y = -attrs.y;
}

function swapXY(g) {
  g.nodes().forEach(v => swapXYOne(g.node(v)));

  g.edges().forEach(e => {
    let edge = g.edge(e);
    edge.points.forEach(swapXYOne);
    if (Object.hasOwn(edge, "x")) {
      swapXYOne(edge);
    }
  });
}

function swapXYOne(attrs) {
  let x = attrs.x;
  attrs.x = attrs.y;
  attrs.y = x;
}
