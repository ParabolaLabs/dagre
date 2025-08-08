const expect = require('./chai').expect;
const graphlibDot = require('graphlib-dot');
const dagre = require('..');

const DOT = `digraph {
    subgraph cluster_0 {
        b[margintop=100];
        label="Subgraph A";
        a -> b;
        b -> c;
        c -> d;
    }

    subgraph cluster_1 {
        label="Subgraph B";
        marginleft=100
        a -> f;
        f -> c;
    }
}`;
const DOT_NO_MARGIN = DOT.replace('marginleft=100', 'marginleft=0');

describe('dot integration', () => {
  it('applies node and parent margins correctly', () => {
    const g = graphlibDot.read(DOT);
    // minimal sizes for nodes to be non-zero
    g.nodes().forEach(v => {
      const n = g.node(v) || {};
      if (!n.width) n.width = 50;
      if (!n.height) n.height = 50;
      g.setNode(v, n);
    });

    // Ensure intended cluster membership for parser gaps
    if (g.hasNode('cluster_0')) {
      ['a','b','c','d'].forEach(n => { if (g.hasNode(n)) g.setParent(n, 'cluster_0'); });
    }
    if (g.hasNode('cluster_1')) {
      ['f'].forEach(n => { if (g.hasNode(n)) g.setParent(n, 'cluster_1'); });
    }

    dagre.layout(g);

    const cluster1 = g.node('cluster_1');
    const a = g.node('a');
    const f = g.node('f');

    // Compare to a graph with no parent margin
    const g2 = graphlibDot.read(DOT_NO_MARGIN);
    g2.nodes().forEach(v => {
      const n = g2.node(v) || {};
      if (!n.width) n.width = 50;
      if (!n.height) n.height = 50;
      g2.setNode(v, n);
    });
    if (g2.hasNode('cluster_0')) {
      ['a','b','c','d'].forEach(n => { if (g2.hasNode(n)) g2.setParent(n, 'cluster_0'); });
    }
    if (g2.hasNode('cluster_1')) {
      ['f'].forEach(n => { if (g2.hasNode(n)) g2.setParent(n, 'cluster_1'); });
    }
    dagre.layout(g2);
    const cluster1b = g2.node('cluster_1');

    // cluster_1 should be shifted right with margin vs no-margin, but width should be stable
    expect(cluster1.x).to.be.greaterThan(cluster1b.x);
    expect(cluster1.width).to.be.closeTo(cluster1b.width, 1e-6);
  });
});