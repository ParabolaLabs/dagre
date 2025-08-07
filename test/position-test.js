var expect = require("./chai").expect;
var position = require("../lib/position");
var Graph = require("@dagrejs/graphlib").Graph;

describe("position", () => {
  var g;

  beforeEach(() => {
    g = new Graph({ compound: true })
      .setGraph({
        ranksep: 50,
        nodesep: 50,
        edgesep: 10
      });
  });

  it("respects ranksep", () => {
    g.graph().ranksep = 1000;
    g.setNode("a", { width: 50, height: 100, rank: 0, order: 0 });
    g.setNode("b", { width: 50, height:  80, rank: 1, order: 0 });
    g.setEdge("a", "b");
    position(g);
    expect(g.node("b").y).to.equal(100 + 1000 + 80 / 2);
  });

  it("use the largest height in each rank with ranksep", () => {
    g.graph().ranksep = 1000;
    g.setNode("a", { width: 50, height: 100, rank: 0, order: 0 });
    g.setNode("b", { width: 50, height:  80, rank: 0, order: 1 });
    g.setNode("c", { width: 50, height:  90, rank: 1, order: 0 });
    g.setEdge("a", "c");
    position(g);
    expect(g.node("a").y).to.equal(100 / 2);
    expect(g.node("b").y).to.equal(100 / 2); // Note we used 100 and not 80 here
    expect(g.node("c").y).to.equal(100 + 1000 + 90 / 2);
  });

  it("respects nodesep", () => {
    g.graph().nodesep = 1000;
    g.setNode("a", { width: 50, height: 100, rank: 0, order: 0 });
    g.setNode("b", { width: 70, height:  80, rank: 0, order: 1 });
    position(g);
    expect(g.node("b").x).to.equal(g.node("a").x + 50 / 2 + 1000 + 70 / 2);
  });

  it("should not try to position the subgraph node itself", () => {
    g.setNode("a", { width: 50, height: 50, rank: 0, order: 0 });
    g.setNode("sg1", {});
    g.setParent("a", "sg1");
    position(g);
    expect(g.node("sg1")).to.not.have.property("x");
    expect(g.node("sg1")).to.not.have.property("y");
  });

  it("respects individual node margins", () => {
    g.graph().nodesep = 50;
    g.setNode("a", { width: 50, height: 100, rank: 0, order: 0, marginLeft: 10, marginRight: 20 });
    g.setNode("b", { width: 70, height: 80, rank: 0, order: 1, marginLeft: 15, marginRight: 25 });
    position(g);
    // Expected: a.x + a.width/2 + a.marginRight + nodesep + b.marginLeft + b.width/2 = b.x
    const expectedSeparation = 50/2 + 20 + 50 + 15 + 70/2;
    expect(g.node("b").x).to.equal(g.node("a").x + expectedSeparation);
  });

  it("respects vertical margins in layer height calculation", () => {
    g.graph().ranksep = 100;
    g.setNode("a", { width: 50, height: 100, rank: 0, order: 0, marginTop: 10, marginBottom: 20 });
    g.setNode("b", { width: 50, height: 80, rank: 1, order: 0, marginTop: 15, marginBottom: 25 });
    g.setEdge("a", "b");
    position(g);
    // Layer 0 height should be 100 + 10 + 20 = 130
    // Layer 1 height should be 80 + 15 + 25 = 120
    // a.y should be 130/2 = 65
    // prevY after layer 0 = 0 + 130 + 100 = 230
    // b.y should be 230 + 120/2 = 230 + 60 = 290
    expect(g.node("a").y).to.equal(65);
    expect(g.node("b").y).to.equal(290);
  });
});
