import { Graph as ImportedGraph, Node as GraphNode, Edge as GraphEdge } from '@dagrejs/graphlib';

// --- Graphlib Exports (Public API of dagre.graphlib) ---

export namespace graphlib {
  export { ImportedGraph as Graph };

  export namespace json {
    function read(graph: any): Graph;
    function write(graph: Graph): any;
  }

  export namespace alg {
    function components(graph: Graph): string[][];
    function dijkstra(graph: Graph, source: string, weightFn?: WeightFn, edgeFn?: EdgeFn): any;
    function dijkstraAll(graph: Graph, weightFn?: WeightFn, edgeFn?: EdgeFn): any;
    function findCycles(graph: Graph): string[][];
    function floydWarshall(graph: Graph, weightFn?: WeightFn, edgeFn?: EdgeFn): any;
    function isAcyclic(graph: Graph): boolean;
    function postorder(graph: Graph, nodeNames: string | string[]): string[];
    function preorder(graph: Graph, nodeNames: string | string[]): string[];
    function prim<T>(graph: Graph<T>, weightFn?: WeightFn): Graph<T>;
    function tarjam(graph: Graph): string[][];
    function topsort(graph: Graph): string[];
  }
}

export interface Label {
  label?: string;
  width?: number;
  height?: number;
  minRank?: number;
  maxRank?: number;
  borderLeft?: string[];
  borderRight?: string[];
  [key: string]: any;
}
export type WeightFn = (edge: Edge) => number;
export type EdgeFn = (outNodeName: string) => GraphEdge[];

export interface GraphLabel {
  width?: number | undefined;
  height?: number | undefined;
  compound?: boolean | undefined;
  rankdir?: string | undefined;
  align?: string | undefined;
  nodesep?: number | undefined;
  edgesep?: number | undefined;
  ranksep?: number | undefined;
  marginx?: number | undefined;
  marginy?: number | undefined;
  acyclicer?: string | undefined;
  ranker?: string | undefined;
  /** Within-rank alignment along the rank axis. Controls how nodes of different sizes are positioned within the same rank. Default: "center". */
  rankalign?: 'top' | 'center' | 'bottom' | undefined;
  /** Cross-rank alignment along the perpendicular axis. Controls the BK algorithm's reference point so that connected nodes of different sizes align by their top edge, center, or bottom edge. Default: "center". */
  crossrankalign?: 'top' | 'center' | 'bottom' | undefined;
}

export interface NodeConfig {
  width?: number | undefined;
  height?: number | undefined;
  /** Minimum padding (in screen pixels) between the top edge of a compound node and its children. Values below the implicit gap (ranksep/2 for TB/BT, (nodesep+edgesep)/2 for LR/RL) are clamped. */
  paddingTop?: number | undefined;
  /** Minimum padding (in screen pixels) between the bottom edge of a compound node and its children. */
  paddingBottom?: number | undefined;
  /** Minimum padding (in screen pixels) between the left edge of a compound node and its children. */
  paddingLeft?: number | undefined;
  /** Minimum padding (in screen pixels) between the right edge of a compound node and its children. */
  paddingRight?: number | undefined;
}

export interface EdgeConfig {
  minlen?: number | undefined;
  weight?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  labelpos?: 'l' | 'c' | 'r' | undefined;
  labeloffest?: number | undefined;
}

export interface LayoutConfig {
  customOrder?: (graph: graphlib.Graph, order: (graph: graphlib.Graph, opts: configUnion) => void) => void;
  disableOptimalOrderHeuristic?: boolean;
}

type configUnion = GraphLabel & NodeConfig & EdgeConfig & LayoutConfig;

export function layout(graph: graphlib.Graph, layout?: configUnion): void;

export interface Edge {
  v: string;
  w: string;
  name?: string | undefined;
}

export interface GraphEdge {
  points: Array<{ x: number; y: number }>;
  [key: string]: any;
}

export type Node<T = {}> = T & {
  x: number;
  y: number;
  width: number;
  height: number;
  class?: string | undefined;
  label?: string | undefined;
  /** @deprecated Not used by dagre layout. Only used by dagre-d3 renderer for cosmetic box inflation. */
  padding?: number | undefined;
  /** @deprecated Not used by dagre layout. Only used by dagre-d3 renderer for cosmetic box inflation. */
  paddingX?: number | undefined;
  /** @deprecated Not used by dagre layout. Only used by dagre-d3 renderer for cosmetic box inflation. */
  paddingY?: number | undefined;
  /** Minimum padding between the top edge of a compound node and its children (layout-affecting). */
  paddingTop?: number | undefined;
  /** Minimum padding between the bottom edge of a compound node and its children (layout-affecting). */
  paddingBottom?: number | undefined;
  /** Minimum padding between the left edge of a compound node and its children (layout-affecting). */
  paddingLeft?: number | undefined;
  /** Minimum padding between the right edge of a compound node and its children (layout-affecting). */
  paddingRight?: number | undefined;
  rank?: number | undefined;
  rx?: number | undefined;
  ry?: number | undefined;
  shape?: string | undefined;
};
