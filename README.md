# dagre - Directed graph renderer for JavaScript

A JavaScript library that makes it easy to lay out directed graphs on the client-side. The dagre layout engine is designed to be fast and flexible, allowing you to create complex layouts with minimal configuration.

## Features

- **Hierarchical layouts**: Automatically arrange nodes in layers to minimize edge crossings
- **Flexible positioning**: Support for different rank directions (TB, BT, LR, RL)
- **Node margins**: Individual control over top, bottom, left, and right margins for each node
- **Edge label support**: Automatic positioning of edge labels
- **Compound graphs**: Support for nested subgraphs
- **Customizable spacing**: Control node separation, edge separation, and rank separation

## Installation

```bash
npm install @dagrejs/dagre
```

## Quick Start

```javascript
const dagre = require('@dagrejs/dagre');

// Create a new directed graph
const g = new dagre.graphlib.Graph();

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
```

## Node Margins

You can specify individual margins for each node to control spacing more precisely:

```javascript
g.setNode("a", { 
  width: 100, 
  height: 50,
  margintop: 10,    // Top margin
  marginbottom: 15, // Bottom margin  
  marginleft: 20,   // Left margin
  marginright: 25   // Right margin
});
```

The margins are added to the effective size of the node for layout calculations:
- **Horizontal margins** (`marginleft`, `marginright`) affect node separation and X positioning
- **Vertical margins** (`margintop`, `marginbottom`) affect layer height and Y positioning

## Configuration

### Graph-level options

```javascript
g.setGraph({
  rankdir: "TB",     // TB, BT, LR, RL
  nodesep: 50,       // Separation between nodes
  edgesep: 20,       // Separation between edges  
  ranksep: 50,       // Separation between ranks
  marginx: 0,        // Graph margin X
  marginy: 0         // Graph margin Y
});
```

### Node-level options

```javascript
g.setNode("id", {
  width: 100,        // Node width
  height: 50,        // Node height
  margintop: 10,     // Top margin
  marginbottom: 15,  // Bottom margin
  marginleft: 20,    // Left margin  
  marginright: 25    // Right margin
});
```

### Edge-level options

```javascript
g.setEdge("v", "w", {
  minlen: 1,         // Minimum edge length
  weight: 1,         // Edge weight
  width: 0,          // Edge label width
  height: 0,         // Edge label height
  labeloffset: 10,   // Edge label offset
  labelpos: "r"      // Edge label position (l, c, r)
});
```

## API Reference

### Graph

- `setGraph(label)` - Set the graph label
- `graph()` - Get the graph label
- `setNode(v, label)` - Set node v's label
- `node(v)` - Get node v's label
- `setEdge(v, w, label)` - Set edge (v,w)'s label
- `edge(v, w)` - Get edge (v,w)'s label
- `nodes()` - Get all nodes
- `edges()` - Get all edges
- `children(v)` - Get children of node v
- `parent(v)` - Get parent of node v
- `setParent(v, parent)` - Set parent of node v

### Layout

- `layout(g)` - Calculate the layout for graph g

## License

MIT
