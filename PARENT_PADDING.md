# Parent Node Padding in Dagre

This feature adds configurable padding to parent nodes in compound graphs, allowing space for text or other content to be placed above child nodes within the parent boundaries.

## How it Works

The parent padding feature works by:

1. **Adding Phantom Nodes**: After the ranking phase, phantom nodes are added to each parent node at the minimum rank of its children.

2. **Ordering**: During the ordering phase, phantom nodes are placed at the top of their parent's children list, ensuring they appear above other nodes.

3. **Height Adjustment**: When phantom nodes are removed in post-processing, their height is added to the parent node's height to maintain proper spacing.

4. **Cleanup**: Phantom nodes are completely removed from the final graph, ensuring they don't interfere with rendering.

## Usage

### Basic Usage

```javascript
const { Graph } = require("@dagrejs/graphlib");
const dagre = require("dagre");

const g = new Graph({ compound: true });

// Set parent padding height (optional, defaults to 20)
g.setGraph({
  parentPaddingHeight: 30
});

// Add nodes and set parent-child relationships
g.setNode("parent", { width: 200, height: 300 });
g.setNode("child1", { width: 50, height: 100 });
g.setNode("child2", { width: 75, height: 200 });

g.setParent("child1", "parent");
g.setParent("child2", "parent");

// Run layout
dagre.layout(g);

// Parent height will be increased by the padding amount
console.log("Parent height:", g.node("parent").height);
```

### Configuration

The padding height can be configured through the graph options:

```javascript
g.setGraph({
  parentPaddingHeight: 50  // Custom padding height
});
```

If not specified, the default padding height is 20 pixels.

## Implementation Details

### Files Modified

1. **`lib/layout.js`**:
   - Added `addParentPadding()` function
   - Added `removeParentPadding()` function
   - Integrated functions into the layout pipeline
   - Updated `updateInputGraph()` to skip phantom nodes

2. **`lib/order/sort-subgraph.js`**:
   - Modified `sortSubgraph()` to handle phantom padding nodes
   - Ensures phantom nodes are placed at the top of their parent's children

### Layout Pipeline Integration

The parent padding functions are integrated into the layout pipeline:

1. `addParentPadding()` runs after `rank()` but before `injectEdgeLabelProxies()`
2. `removeParentPadding()` runs after `position()` but before `positionSelfEdges()`

This ensures that:
- Phantom nodes are added after ranks are assigned
- Phantom nodes participate in the ordering phase
- Phantom nodes are removed before final coordinate assignment

### Phantom Node Properties

Phantom nodes have the following properties:
- `dummy: "parent-padding"` - Identifies them as padding nodes
- `parentNode` - References their parent node
- `paddingIndex` - Ordering index (always 0 for single phantom nodes)
- `rank` - Assigned to the minimum rank of parent's children
- `height` - Configurable padding height
- `width: 0` - No horizontal space

## Testing

The feature includes comprehensive tests:

- Basic compound graph with parent padding
- Nested compound graphs with multiple levels
- Verification that non-compound graphs are unaffected
- Confirmation that phantom nodes are properly cleaned up

## Benefits

1. **Space for Text**: Allows text to be placed above child nodes within parent boundaries
2. **Configurable**: Padding height can be adjusted per graph
3. **Non-intrusive**: Doesn't affect existing layouts or non-compound graphs
4. **Clean**: Phantom nodes are completely removed from the final result
5. **LTR Compatible**: Works well with left-to-right layouts as specified

## Limitations

- Currently only supports vertical padding (top of parent)
- Phantom nodes are placed at the minimum rank of children
- Single phantom node per parent (could be extended for multiple ranks) 