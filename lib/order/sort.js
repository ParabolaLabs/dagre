let util = require("../util");

module.exports = sort;

function sort(entries, biasRight, g) {
  let parts = util.partition(entries, entry => {
    return Object.hasOwn(entry, "barycenter");
  });
  let sortable = parts.lhs,
    unsortable = parts.rhs.sort((a, b) => b.i - a.i),
    vs = [],
    sum = 0,
    weight = 0,
    vsIndex = 0;

  // Sort phantom nodes to the top
  sortable.sort((a, b) => {
    // Handle case where graph is not provided (for backward compatibility)
    if (!g) {
      return compareWithBias(!!biasRight)(a, b);
    }
    
    const aPhantom = a.vs.some(vId => {
      const node = g.node(vId);
      return node && node.phantom;
    });
    const bPhantom = b.vs.some(vId => {
      const node = g.node(vId);
      return node && node.phantom;
    });
    
    if (aPhantom && !bPhantom) return -1;
    if (!aPhantom && bPhantom) return 1;
    
    return compareWithBias(!!biasRight)(a, b);
  });

  vsIndex = consumeUnsortable(vs, unsortable, vsIndex);

  sortable.forEach(entry => {
    vsIndex += entry.vs.length;
    vs.push(entry.vs);
    sum += entry.barycenter * entry.weight;
    weight += entry.weight;
    vsIndex = consumeUnsortable(vs, unsortable, vsIndex);
  });

  let result = { vs: vs.flat(true) };
  if (weight) {
    result.barycenter = sum / weight;
    result.weight = weight;
  }
  return result;
}

function consumeUnsortable(vs, unsortable, index) {
  let last;
  while (unsortable.length && (last = unsortable[unsortable.length - 1]).i <= index) {
    unsortable.pop();
    vs.push(last.vs);
    index++;
  }
  return index;
}

function compareWithBias(bias) {
  return (entryV, entryW) => {
    if (entryV.barycenter < entryW.barycenter) {
      return -1;
    } else if (entryV.barycenter > entryW.barycenter) {
      return 1;
    }

    return !bias ? entryV.i - entryW.i : entryW.i - entryV.i;
  };
}
