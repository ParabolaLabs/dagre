# Dagre - Directed Graph Layout

A JavaScript library that makes it easy to lay out directed graphs on the client-side. The dagre layout engine is designed to be fast and flexible, and can be used with any graphics library.

## Features

- **Hierarchical layouts**: Automatically positions nodes in layers
- **Compound graphs**: Support for parent-child relationships with automatic sizing
- **Customizable spacing**: Control node and edge spacing
- **Multiple rank directions**: Top-to-bottom, left-to-right, etc.
- **Padding support**: Add padding to parent nodes

## Installation

```bash
npm install dagre
```

## Basic Usage

```javascript
const dagre = require('dagre');

// Create a new directed graph
const g = new dagre.graphlib.Graph({ compound: true });

// Set an object for the graph label
g.setGraph({});

// Default to assigning a new object as a label for each new edge.
g.setDefaultEdgeLabel(() => ({}));

// Add nodes to the graph. The first argument is the node id.
// The second is metadata about the node. In this case we're going to
// add labels to each of our nodes.
g.setNode("kspacey",    { label: "Kevin Spacey",  width: 144, height: 100 });
g.setNode("swilliams",  { label: "Saul Williams", width: 160, height: 100 });
g.setNode("bpitt",      { label: "Brad Pitt",     width: 108, height: 100 });
g.setNode("hford",      { label: "Harrison Ford", width: 168, height: 100 });
g.setNode("lwilson",    { label: "Luke Wilson",   width: 144, height: 100 });
g.setNode("kbacon",     { label: "Kevin Bacon",   width: 121, height: 100 });

// Add edges to the graph.
g.setEdge("kspacey",   "swilliams");
g.setEdge("swilliams", "kbacon");
g.setEdge("bpitt",     "kbacon");
g.setEdge("hford",     "lwilson");
g.setEdge("lwilson",   "kbacon");

// Calculate the layout
dagre.layout(g);

// Each node now has:
// - x, y: the position of the node
// - width, height: the dimensions of the node
console.log(g.node("kspacey")); // { x: 100, y: 200, width: 144, height: 100 }
```

## Compound Graphs with Padding

Dagre supports compound graphs where nodes can have parent-child relationships. You can add padding to parent nodes to create visual separation:

```javascript
const g = new dagre.graphlib.Graph({ compound: true });

// Create parent nodes with padding
g.setNode("group1", { paddingTop: 20 });
g.setNode("group2", { paddingTop: 10 });

// Add child nodes
g.setNode("child1", { width: 50, height: 50 });
g.setNode("child2", { width: 50, height: 50 });
g.setNode("child3", { width: 50, height: 50 });

// Establish parent-child relationships
g.setParent("child1", "group1");
g.setParent("child2", "group1");
g.setParent("child3", "group2");

// Run layout
dagre.layout(g);

// Parent nodes will automatically size to contain their children
// and include the specified padding at the top
console.log(g.node("group1").height); // Will include padding
console.log(g.node("group2").height); // Will include padding
```

## Padding Behavior

When you add `paddingTop` to a parent node:

1. **Parent gets taller**: The parent's height increases by the padding amount
2. **Children stay in place**: Child nodes maintain their calculated positions
3. **Siblings get pushed down**: All nodes in subsequent ranks are pushed down by the padding amount
4. **Visual effect**: Creates space between the parent's top edge and its highest child

## Configuration Options

### Graph-level options:

- `rankdir`: Direction for rank nodes. Can be `TB`, `BT`, `LR`, or `RL`, where T = top, B = bottom, L = left, and R = right.
- `align`: Alignment for rank nodes. Can be `UL`, `UR`, `DL`, or `DR`, where U = up, D = down, L = left, and R = right.
- `nodesep`: Minimum separation between adjacent nodes in the same rank.
- `edgesep`: Minimum separation between adjacent edges in the same rank.
- `ranksep`: Minimum separation between adjacent nodes in adjacent ranks.
- `marginx`: Number of pixels that separate the outermost nodes in the same rank from the edges of the graph.
- `marginy`: Number of pixels that separate the outermost nodes in adjacent ranks from the edges of the graph.

### Node-level options:

- `width`: The width of the node
- `height`: The height of the node
- `paddingTop`: Additional padding at the top of parent nodes (compound graphs only)

### Edge-level options:

- `weight`: The weight to assign edges. Higher weight edges are generally made shorter and straighter than lower weight edges.
- `minlen`: The minimum edge length.
- `labelpos`: Where to place the label relative to the edge. Can be `l` (left), `c` (center), or `r` (right).

## License

MIT
