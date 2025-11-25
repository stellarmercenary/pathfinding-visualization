export async function prim({
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

    const newMaze = maze.map((row) => row.map((cell) => ({ ...cell })));
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

    newMaze[sy][sx].type = "path";
    logStep({ x: sx, y: sy }, "path");

    const walls: { x: number; y: number; px: number; py: number }[] = [];

    const addWalls = (x: number, y: number) => {
        const dirs = [
            [2, 0],
            [-2, 0],
            [0, 2],
            [0, -2],
        ];
        for (const [dx, dy] of dirs) {
            const nx = x + dx;
            const ny = y + dy;
            // sekarang include index 0 dan w-1/h-1
            if (nx >= 0 && nx < w && ny >= 0 && ny < h) {
                if (
                    newMaze[ny][nx].type === "wall" &&
                    !walls.some((w) => w.x === nx && w.y === ny)
                ) {
                    walls.push({ x: nx, y: ny, px: x, py: y });
                }
            }
        }
    };

    addWalls(sx, sy);

    while (walls.length) {
        const idx = Math.floor(Math.random() * walls.length);
        const { x, y, px, py } = walls[idx];

        const mx = Math.floor((x + px) / 2);
        const my = Math.floor((y + py) / 2);

        if (newMaze[y][x].type === "wall") {
            newMaze[y][x].type = "path";
            logStep({ x, y }, "path");

            newMaze[my][mx].type = "path";
            logStep({ x: mx, y: my }, "path");

            addWalls(x, y);
        }

        walls.splice(idx, 1);
    }

    // paksa pojok kiri atas
    newMaze[0][0].type = "path";
    logStep({ x: 0, y: 0 }, "path");

    // paksa pojok kanan bawah
    newMaze[h - 1][w - 1].type = "path";
    logStep({ x: w - 1, y: h - 1 }, "path");

    return [newMaze, newRecord];
}
