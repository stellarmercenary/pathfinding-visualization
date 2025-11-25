export async function dijkstra({
  graph,
  startId,
  endId,
}: {
  graph: WeightedGraph;
  startId: string;
  endId: string;
}): Promise<CrawlerStep[]> {
  const visited = new Set<string>();
  const dist: Record<string, number> = {};
  const prev: Record<string, string | null> = {};
  const record: CrawlerStep[] = [];

  for (const id in graph) {
    dist[id] = Infinity;
    prev[id] = null;
  }
  dist[startId] = 0;

  const queue = Object.keys(graph);

  while (queue.length) {
    queue.sort((a, b) => dist[a] - dist[b]);
    const u = queue.shift()!;
    if (dist[u] === Infinity) break;
    visited.add(u);
    record.push({ cell: { x: graph[u].x, y: graph[u].y }, type: "visited" });
    if (u === endId) break;

    for (const { id: v, weight } of graph[u].neighbors) {
      if (visited.has(v)) continue;
      const alt = dist[u] + weight;
      if (alt < dist[v]) {
        dist[v] = alt;
        prev[v] = u;
      }
    }
  }

  // reconstruct path dengan edge info
  let curr: string | null = endId;
  const path: CrawlerStep[] = [];
  while (curr && prev[curr]) {
    const from: string = prev[curr]!; // <-- type-safe
    path.unshift({
      cell: { x: graph[curr].x, y: graph[curr].y },
      type: "path",
      from: { x: graph[from].x, y: graph[from].y }, // edge info
    });
    curr = from;
  }

  return [...record, ...path];
}