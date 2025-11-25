export function mazeToWeightedGraph(maze: Cell[][]): WeightedGraph {
    const h = maze.length;
    const w = maze[0].length;
    const graph: WeightedGraph = {};
    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    const isNode = (x: number, y: number) => {
        if (maze[y][x].type !== "path") return false;
        const open = dirs.reduce((acc, [dx, dy]) => {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < w && ny < h && maze[ny][nx].type === "path") acc++;
            return acc;
        }, 0);
        return open !== 2;
    };

    const visited = new Set<string>();
    const start = { x: 0, y: 0 };
    const end = { x: w - 1, y: h - 1 };

    function addEdge(a: string, b: string, weight: number) {
        if (!graph[a]) graph[a] = { x: +a.split("-")[0], y: +a.split("-")[1], neighbors: [] };
        if (!graph[b]) graph[b] = { x: +b.split("-")[0], y: +b.split("-")[1], neighbors: [] };

        // Pastikan tidak duplikat
        if (!graph[a].neighbors.some(n => n.id === b)) graph[a].neighbors.push({ id: b, weight });
        if (!graph[b].neighbors.some(n => n.id === a)) graph[b].neighbors.push({ id: a, weight });
    }

    function dfs(x: number, y: number) {
        const id = `${x}-${y}`;
        if (visited.has(id)) return;
        visited.add(id);

        if (maze[y][x].type !== "path") return;

        if (!graph[id]) graph[id] = { x, y, neighbors: [] };

        for (const [dx, dy] of dirs) {
            let nx = x + dx, ny = y + dy, dist = 1;
            while (nx >= 0 && ny >= 0 && nx < w && ny < h && maze[ny][nx].type === "path") {
                if (isNode(nx, ny) || (nx === end.x && ny === end.y) || (nx === start.x && ny === start.y)) {
                    const nid = `${nx}-${ny}`;
                    addEdge(id, nid, dist);
                    break;
                }
                nx += dx;
                ny += dy;
                dist++;
            }
        }

        // traverse neighbors
        for (const [dx, dy] of dirs) {
            const nx = x + dx, ny = y + dy;
            if (nx >= 0 && ny >= 0 && nx < w && ny < h && maze[ny][nx].type === "path") {
                dfs(nx, ny);
            }
        }
    }

    dfs(start.x, start.y);
    return graph;
}
