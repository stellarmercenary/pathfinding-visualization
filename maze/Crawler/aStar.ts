export async function astar({
  graph,
  startId,
  endId,
}: {
  graph: WeightedGraph;
  startId: string;
  endId: string;
}): Promise<CrawlerStep[]> {
  const visited = new Set<string>();
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const record: CrawlerStep[] = [];

  const heuristic = (a: {x:number,y:number}, b:{x:number,y:number}) =>
    Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan

  for (const id in graph) {
    gScore[id] = Infinity;
    fScore[id] = Infinity;
    prev[id] = null;
  }
  gScore[startId] = 0;
  fScore[startId] = heuristic(graph[startId], graph[endId]);

  const queue = Object.keys(graph);

  while (queue.length) {
    queue.sort((a, b) => fScore[a] - fScore[b]);
    const u = queue.shift()!;
    if (gScore[u] === Infinity) break;
    visited.add(u);
    record.push({ cell: { x: graph[u].x, y: graph[u].y }, type: "visited" });
    if (u === endId) break;

    for (const { id: v, weight } of graph[u].neighbors) {
      if (visited.has(v)) continue;
      const tentativeG = gScore[u] + weight;
      if (tentativeG < gScore[v]) {
        gScore[v] = tentativeG;
        fScore[v] = tentativeG + heuristic(graph[v], graph[endId]);
        prev[v] = u;
      }
    }
  }

  // reconstruct path
  let curr: string | null = endId;
  const path: CrawlerStep[] = [];
  while (curr) {
    path.unshift({ cell: { x: graph[curr].x, y: graph[curr].y }, type: "path" });
    curr = prev[curr];
  }

  return [...record, ...path];
}
