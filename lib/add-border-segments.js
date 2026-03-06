let util = require("./util");

module.exports = addBorderSegments;

function addBorderSegments(g) {
  function dfs(v) {
    let children = g.children(v);
    let node = g.node(v);
    if (children.length) {
      children.forEach(dfs);
    }

    if (Object.hasOwn(node, "minRank")) {
      node.borderLeft = [];
      node.borderRight = [];
      for (let rank = node.minRank, maxRank = node.maxRank + 1;
        rank < maxRank;
        ++rank) {
        addBorderNode(g, "borderLeft", "_bl", v, node, rank);
        addBorderNode(g, "borderRight", "_br", v, node, rank);
      }
    }
  }

  g.children().forEach(dfs);
}

function addBorderNode(g, prop, prefix, sg, sgNode, rank) {
  let dim = 0;
  let padKey = prop === "borderLeft" ? "_iPadLeft" : "_iPadRight";
  if (sgNode[padKey] !== undefined) {
    let gl = g.graph();
    dim = Math.max(0, sgNode[padKey] - (gl.nodesep + gl.edgesep) / 2);
  }
  let rd = ((g.graph() || {}).rankdir || "").toLowerCase();
  let swapDims = rd === "lr" || rd === "rl";
  let label = { width: swapDims ? 0 : dim, height: swapDims ? dim : 0, rank: rank, borderType: prop };
  let prev = sgNode[prop][rank - 1];
  let curr = util.addDummyNode(g, "border", label, prefix);
  sgNode[prop][rank] = curr;
  g.setParent(curr, sg);
  if (prev) {
    g.setEdge(prev, curr, { weight: 1 });
  }
}
