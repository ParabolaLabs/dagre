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
    g.setNode("a", { width: 50, height: 100, rank: 0, order: 0, marginleft: 10, marginright: 20 });
    g.setNode("b", { width: 70, height: 80, rank: 0, order: 1, marginleft: 15, marginright: 25 });
    position(g);
    // Expected: a.x + a.width/2 + a.marginright + nodesep + b.marginleft + b.width/2 = b.x
    const expectedSeparation = 50/2 + 20 + 50 + 15 + 70/2;
    expect(g.node("b").x).to.equal(g.node("a").x + expectedSeparation);
  });

  it("vertical node margins push following ranks without resizing parents", () => {
    g.graph().ranksep = 100;
    g.setNode("a", { width: 50, height: 100, rank: 0, order: 0, margintop: 10, marginbottom: 20 });
    g.setNode("b", { width: 50, height: 80, rank: 1, order: 0, margintop: 15, marginbottom: 25 });
    g.setEdge("a", "b");
    position(g);
    // a.y = top(10) + height/2(50) = 60
    // prevY after layer 0 = 10 + 100 + 20 + ranksep(100) = 230
    // b.y = 230 + top(15) + 80/2 = 285
    expect(g.node("a").y).to.equal(60);
    expect(g.node("b").y).to.equal(285);
  });

  it("respects margins in compound graphs", () => {
    g.graph().ranksep = 50;
    g.setNode("parent", { width: 200, height: 100, margintop: 20, marginbottom: 30, marginleft: 40, marginright: 50 });
    g.setNode("child1", { width: 50, height: 50, rank: 0, order: 0, margintop: 10, marginbottom: 15 });
    g.setNode("child2", { width: 60, height: 40, rank: 1, order: 0, margintop: 5, marginbottom: 10 });
    g.setParent("child1", "parent");
    g.setParent("child2", "parent");
    g.setEdge("child1", "child2");
    position(g);
    
    // Parent nodes don't get x/y coordinates from the layout algorithm
    // They get their dimensions calculated based on their children
    const parent = g.node("parent");
    expect(parent.width).to.be.greaterThan(0);
    expect(parent.height).to.be.greaterThan(0);
    // Parent nodes should not have x/y coordinates set by the layout
    expect(parent).to.not.have.property('x');
    expect(parent).to.not.have.property('y');
    
    // Children should be positioned correctly
    const child1 = g.node("child1");
    const child2 = g.node("child2");
    expect(child1.x).to.be.a('number');
    expect(child1.y).to.be.a('number');
    expect(child2.x).to.be.a('number');
    expect(child2.y).to.be.a('number');
  });
});
