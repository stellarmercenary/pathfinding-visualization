export async function bfsMaze(
    maze: Cell[][],
    sx: number,
    sy: number,
    ex: number,
    ey: number
): Promise<CrawlerStep[]> {
    const h = maze.length;
    const w = maze[0].length;
    const visited = Array.from({ length: h }, () => Array(w).fill(false));
    const prev: ( { x: number; y: number } | null )[][] = Array.from({ length: h }, () => Array(w).fill(null));
    const record: CrawlerStep[] = [];

    const dirs = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    const queue: { x: number; y: number }[] = [];
    queue.push({ x: sx, y: sy });
    visited[sy][sx] = true;

    while (queue.length) {
        const { x, y } = queue.shift()!;
        record.push({ cell: { x, y }, type: "visited" });

        if (x === ex && y === ey) break;

        for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;

            if (
                nx >= 0 &&
                nx < w &&
                ny >= 0 &&
                ny < h &&
                !visited[ny][nx] &&
                maze[ny][nx].type !== "wall"
            ) {
                visited[ny][nx] = true;
                prev[ny][nx] = { x, y };
                queue.push({ x: nx, y: ny });
            }
        }
    }

    // reconstruct path
    const path: CrawlerStep[] = [];
    let cur: { x: number; y: number } | null = { x: ex, y: ey };
    while (cur) {
        path.unshift({ cell: { x: cur.x, y: cur.y }, type: "solution" });
        cur = prev[cur.y][cur.x];
    }

    return [...record, ...path];
}
