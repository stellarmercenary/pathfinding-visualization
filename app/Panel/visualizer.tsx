import { useEffect, useRef } from "react";

export function VisualGenerating(prop: PanelState) {
    function getColor(type: CellState): string {
        switch (type) {
            case "wall":
                return "#ffffff"; // red-600
            case "path":
                return "#000000";
            case "visited":
                return "#000000"; // blue-600
            case "current":
                return "#60a5fa"; // blue-400
            case "empty":
                return "#ffffff00"; // transparent
            default:
                return "#ffffff00";
        }
    }
    const gen = prop.generators.find(
        (gen) => gen.id === prop.selectedGenerator
    );
    let bg = "#ffffff00";
    if (gen?.type === "destroyer") {
        bg = getColor("wall");
    } else if (gen?.type === "creator") {
        bg = getColor("path");
    }

    const canvas = useRef<HTMLCanvasElement>(null);
    // RENDER BG FUNCTION
    useEffect(() => {
        if (!canvas.current) return;
        canvas.current.width = prop.mazeSize.w * prop.cellSize;
        canvas.current.height = prop.mazeSize.h * prop.cellSize;

        const ctx = canvas.current.getContext("2d");
        if (!ctx) return;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
    }, []);
    // RENDER CELL FUNCTION
    const renderStep = (step: GeneratorStep | CrawlerStep) => {
        const cell = canvas.current?.getContext("2d");
        if (!cell) return;
        const { x, y } = step.cell;

        cell.fillStyle = getColor(step.type);
        cell.fillRect(
            x * prop.cellSize,
            y * prop.cellSize,
            prop.cellSize,
            prop.cellSize
        );
    };
    // UTILITY: NEXT(Shipper) : good
    useEffect(() => {
        prop.registerHandleNext(handleNext);
    }, []);
    // UTILITY: NEXT(Handler) : bad
    const handleNext = () => {
        const nextStep = Math.min(
            prop.currentStep + 1,
            prop.generatorRecord.length
        );

        console.log("function get Call");
        console.log("Paused: " + prop.paused);
        console.log("Canvas: " + canvas);
        console.log("Canvas.current: " + canvas.current);

        if (canvas.current) {
            const step = prop.generatorRecord[nextStep - 1];

            if (!step) return;
            const ctx = canvas.current.getContext("2d");

            if (!ctx) {
                console.log("no context");
                return;
            }
            console.log("get context: " + ctx);
            ctx.fillStyle = getColor(step.type);
            ctx.fillRect(
                step.cell.x * prop.cellSize,
                step.cell.y * prop.cellSize,
                prop.cellSize,
                prop.cellSize
            );
        }
    };
    // UTILITY: PREV(Handler) : bad
    const handlePrev = () => {
        const prevStep = Math.max(prop.currentStep - 1, 0);
        prop.setCurrentStep(prevStep);

        if (prop.paused && canvas.current) {
            const step = prop.generatorRecord[prevStep - 1];
            if (!step) return;
            const ctx = canvas.current.getContext("2d");
            if (!ctx) return;
            ctx.fillStyle = getColor(step.type);
            ctx.fillRect(
                step.cell.x * prop.cellSize,
                step.cell.y * prop.cellSize,
                prop.cellSize,
                prop.cellSize
            );
        }
    };
    // RECORD PLAYER
    useEffect(() => {
        // UTILITY: PAUSE: good
        if (prop.paused) return;
        if (prop.currentStep >= prop.generatorRecord.length) {
            prop.setMazeVisualized(true);
            prop.setWaiting(true);
            return;
        }
        // UTILITY: SKIP: good
        if (prop.skip) {
            for (
                let i = prop.currentStep;
                i < prop.generatorRecord.length;
                i++
            ) {
                renderStep(prop.generatorRecord[i]);
            }
            prop.setCurrentStep(prop.generatorRecord.length);
            return;
        }
        // RENDER
        const timeout = setTimeout(() => {
            renderStep(prop.generatorRecord[prop.currentStep]);
            prop.setCurrentStep(prop.currentStep + 1);
        }, prop.renderSpeed);

        return () => clearTimeout(timeout);
    }, [prop.currentStep, prop.paused, prop.skip]);

    return (
        <canvas
            className="relative"
            ref={canvas}
            style={{
                width: prop.cellSize * prop.mazeSize.w,
                height: prop.cellSize * prop.mazeSize.h,
                background: "",
            }}></canvas>
    );
}


