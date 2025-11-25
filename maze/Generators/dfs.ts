export async function dfs({
    maze,
    mazeSize,
    record,
}: {
    maze: Cell[][];
    mazeSize: { w: number | null; h: number | null };
    record: GeneratorStep[];
}): Promise<[Cell[][], GeneratorStep[]]> {
    const w = mazeSize.w || 0;
    const h = mazeSize.h || 0;

    const newMaze = maze.map(row => row.map(cell => ({ ...cell })));
    const newRecord = [...record];

    const logStep = (cell: { x: number; y: number }, type: CellState) => {
        newRecord.push({ cell, type });
    };

    // set semua jadi wall
    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) newMaze[y][x].type = "wall";
    }

    const randEven = (max: number) => {
        if (max <= 2) return 0;
        let r = Math.floor(Math.random() * (max - 1)) + 1;
        if (r % 2 !== 0) r--;
        return r < 0 ? 0 : r;
    };

    const sx = randEven(w - 2);
    const sy = randEven(h - 2);

    const stack: { x: number; y: number }[] = [];
    newMaze[sy][sx].type = "path";
    logStep({ x: sx, y: sy }, "path");
    stack.push({ x: sx, y: sy });

    const dirs = [
        [2, 0],
        [-2, 0],
        [0, 2],
        [0, -2],
    ];

    while (stack.length) {
        const current = stack[stack.length - 1];
        const { x, y } = current;

        const neighbors: { x: number; y: number; mx: number; my: number }[] = [];

        for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            const mx = x + dx / 2;
            const my = y + dy / 2;

            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                if (newMaze[ny][nx].type === "wall") {
                    neighbors.push({
                        x: nx,
                        y: ny,
                        mx: Math.floor(mx),
                        my: Math.floor(my),
                    });
                }
            }
        }

        if (neighbors.length) {
            const next = neighbors[Math.floor(Math.random() * neighbors.length)];

            // buka jalur
            newMaze[next.my][next.mx].type = "path";
            logStep({ x: next.mx, y: next.my }, "path");

            newMaze[next.y][next.x].type = "path";
            logStep({ x: next.x, y: next.y }, "path");

            stack.push({ x: next.x, y: next.y });
        } else {
            // backtrack tapi tetap catat posisi sekarang sebagai visited untuk visualizer
            const back = stack.pop()!;
            logStep({ x: back.x, y: back.y }, "visited");
        }
    }

    // paksa pojok kiri atas
    newMaze[0][0].type = "path";
    logStep({ x: 0, y: 0 }, "path");

    // paksa pojok kanan bawah
    newMaze[h - 1][w - 1].type = "path";
    logStep({ x: w - 1, y: h - 1 }, "path");

    return [newMaze, newRecord];
}
