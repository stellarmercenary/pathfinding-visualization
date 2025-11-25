import { useEffect, useRef } from "react";

export function VisualCrawling(prop: PanelState) {
    const canvas = useRef<HTMLCanvasElement>(null);

    function getColor(type: CellState): string {
        switch (type) {
            case "wall":
                return "#ffffff"; // putih
            case "visited":
                return "#2563eb"; // biru
            case "solution":
                return "#FFA500"; // orange
            default:
                return "#00000000"; // transparent
        }
    }

    // render satu step
    const renderStep = (step: CrawlerStep) => {
        const ctx = canvas.current?.getContext("2d");
        if (!ctx) return;
        const { x, y } = step.cell;
        ctx.fillStyle = getColor(step.type);
        ctx.fillRect(
            x * prop.cellSize,
            y * prop.cellSize,
            prop.cellSize,
            prop.cellSize
        );
    };

    // INIT BACKGROUND: cuma wall, path/empty dikosongkan
    useEffect(() => {
        const c = canvas.current;
        if (!c) return;

        c.width = prop.mazeSize.w * prop.cellSize;
        c.height = prop.mazeSize.h * prop.cellSize;

        const ctx = c.getContext("2d");
        if (!ctx) return;

        for (let y = 0; y < prop.mazeSize.h; y++) {
            for (let x = 0; x < prop.mazeSize.w; x++) {
                if (prop.maze[y][x].type === "wall") {
                    ctx.fillStyle = "#ffffff"; // wall putih
                    ctx.fillRect(
                        x * prop.cellSize,
                        y * prop.cellSize,
                        prop.cellSize,
                        prop.cellSize
                    );
                } else {
                    ctx.clearRect(
                        x * prop.cellSize,
                        y * prop.cellSize,
                        prop.cellSize,
                        prop.cellSize
                    );
                }
            }
        }
        // reset step
        prop.setCurrentStep(0);
    }, [prop.maze, prop.mazeSize, prop.cellSize]);

    // ANIMASI
    useEffect(() => {
        if (prop.paused) return;
        if (prop.currentStep >= prop.crawlerRecord.length) {
            prop.setPathVisualized(true);
            prop.setWaiting(true);
            return;
        }

        const t = setTimeout(() => {
            renderStep(prop.crawlerRecord[prop.currentStep]);
            prop.setCurrentStep((s) => s + 1);
        }, prop.renderSpeed);

        return () => clearTimeout(t);
    }, [prop.currentStep, prop.paused, prop.renderSpeed, prop.crawlerRecord]);

    return (
        <div className="w-full h-full absolute top-0 left-0 flex-mid">
            <canvas
                ref={canvas}
                style={{
                    width: prop.mazeSize.w * prop.cellSize,
                    height: prop.mazeSize.h * prop.cellSize,
                }}
            />
        </div>
    );
}