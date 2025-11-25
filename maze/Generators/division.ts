export async function division({
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

    for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
            newMaze[y][x].type = "path";
        }
    }

    const randOdd = (min: number, max: number) => {
        let r = Math.floor(Math.random() * ((max - min) / 2 + 1)) * 2 + min;
        return r;
    };

    const divide = (
        xStart: number,
        yStart: number,
        xEnd: number,
        yEnd: number
    ) => {
        const areaWidth = xEnd - xStart + 1;
        const areaHeight = yEnd - yStart + 1;

        if (areaWidth < 3 || areaHeight < 3) return;

        const horizontal = areaWidth < areaHeight; 

        if (horizontal) {
            // horizontal
            const yWall = randOdd(yStart + 1, yEnd - 1);
            const xPass = randOdd(xStart, xEnd);

            for (let x = xStart; x <= xEnd; x++) {
                if (x !== xPass) {
                    newMaze[yWall][x].type = "wall";
                    logStep({ x, y: yWall }, "wall");
                }
            }

            divide(xStart, yStart, xEnd, yWall - 1);
            divide(xStart, yWall + 1, xEnd, yEnd);
        } else {
            // vertical
            const xWall = randOdd(xStart + 1, xEnd - 1);
            const yPass = randOdd(yStart, yEnd);

            for (let y = yStart; y <= yEnd; y++) {
                if (y !== yPass) {
                    newMaze[y][xWall].type = "wall";
                    logStep({ x: xWall, y }, "wall");
                }
            }

            divide(xStart, yStart, xWall - 1, yEnd);
            divide(xWall + 1, yStart, xEnd, yEnd);
        }
    };

    divide(0, 0, w - 1, h - 1);

    return [newMaze, newRecord];
}
