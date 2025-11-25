"use client";
import ControlPanel from "@/app/Panel/ControlPanel";
import InfoPanel from "@/app/Panel/InfoPanel";
import VisualPanel from "@/app/Panel/VisualPanel";
import { astar } from "@/maze/Crawler/aStar";
import { bfsMaze } from "@/maze/Crawler/bfs";
import { dfs } from "@/maze/Generators/dfs";
import { division } from "@/maze/Generators/division";
import { prim } from "@/maze/Generators/prim";
import { useEffect, useState } from "react";
import { dijkstra } from "@/maze/Crawler/djikstra";

export default function PanelLayout() {
    // STATE: panel
    const [control, setControl] = useState(true);
    const [info, setInfo] = useState(true);
    // STATE
    const [selectingGenerator, setSelectingGenerator] = useState(false);
    const [selectingCrawler, setSelectingCrawler] = useState(false);
    const [digging, setDigging] = useState(false);
    const [crawling, setCrawling] = useState(false);
    const [pending, setPending] = useState(false);
    const [waiting, setWaiting] = useState(false);
    const [visualizingGen, setVisualizingGen] = useState(false);
    const [visualizingCraw, setVisualizingCraw] = useState(false);
    const [paused, setPaused] = useState(false);
    const [home, setHome] = useState(true);
    const [skip, setSkip] = useState(false);
    const [mazeVisualized, setMazeVisualized] = useState(false);
    const [pathVisualized, setPathVisualized] = useState(false);
    // DATA: MAZE RECORD GRAF
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [maze, setMaze] = useState<Cell[][]>([]);
    const [startId, setStartId] = useState<string>('')
    const [endId, setEndId] = useState<string>('')
    const [mazeSize, setMazeSize] = useState<{
        w: number;
        h: number;
    }>({ w: 61, h: 31 });
    const [cellSize, setCellSize] = useState(10);
    const [renderSpeed, setRenderSpeed] = useState(1);
    const [generatorRecord, setGeneratorRecord] = useState<GeneratorStep[]>([]);
    const [crawlerRecord, setCrawlerRecord] = useState<CrawlerStep[]>([]);
    const [graph, setGraph] = useState<WeightedGraph | null>(null);
    // DATA: ALGORITMA
    const [selectedGenerator, setSelectedGenerator] = useState<number | null>(
        null
    );
    const [selectedGenerator_Name, setSelectedGenerator_Name] =
        useState("None");
    const [selectedCrawler, setSelectedCrawler] = useState<number | null>(null);
    const [selectedCrawler_Name, setSelectedCrawler_Name] = useState("None"); // DATA: MATRIKS
    const generators = [
        {
            id: 1,
            name: "DFS",
            desc: "Dig first search",
            url: "/dfs.jpeg",
            algorithm: dfs,
            type: "destroyer",
        },
        {
            id: 2,
            name: "Prim",
            desc: "Raiden Cantik",
            url: "/prim.jpeg",
            algorithm: prim,
            type: "destroyer",
        },
        {
            id: 3,
            name: "Division",
            desc: "Recursive Division",
            url: "/division.jpeg",
            algorithm: division,
            type: "creator",
        },
    ];
    const crawlers = [
        {
            id: 1,
            name: "BFS",
            desc: "don't use",
            url: "/bfs.jpeg",
            algorithm: bfsMaze,
            type: "x",
        },
        {
            id: 2,
            name: "A*",
            desc: "my istri",
            url: "/A.jpeg",
            algorithm: astar,
            type: "x",
        },
        {
            id: 3,
            name: "Dijkstra",
            desc: "Shortest path crawler",
            url: "/dijkstra.jpeg",
            algorithm: dijkstra,
            type: "x",
        },
    ];
    // FUNCTION: GET NAME
    const handleSelectCrawler = (id: number | null) => {
        setSelectedCrawler(id);
        const crawler = crawlers.find((g) => g.id === id);
        if (crawler) setSelectedCrawler_Name(crawler.name);
        else setSelectedCrawler_Name("None");
    };
    const handleSelectGenerator = (id: number | null) => {
        setSelectedGenerator(id);
        const generator = generators.find((g) => g.id === id);
        if (generator) setSelectedGenerator_Name(generator.name);
        else setSelectedGenerator_Name("None");
    };
    // FUNCTION: CONSTRAINT SPEED, SIZE
    useEffect(() => {
        if (renderSpeed <= 0) setRenderSpeed(1);
    }, [renderSpeed]);
    useEffect(() => {
        if (mazeSize && mazeSize.w != null && mazeSize.h != null) {
            setMazeSize((prev) => {
                if (!prev) return { w: 81, h: 41 };
                const newW = prev.w! % 2 === 0 ? prev.w! + 1 : prev.w;
                const newH = prev.h! % 2 === 0 ? prev.h! + 1 : prev.h;

                if (newW !== prev.w || newH !== prev.h)
                    return { w: newW, h: newH };
                return prev;
            });
        }
    }, [digging]);

    const [handleNextFn, setHandleNextFn] = useState<(() => void) | null>(null);

    function registerHandleNext(fn: () => void) {
        setHandleNextFn(() => fn);
    }

    const panelState: PanelState = {
        startId, 
        setStartId, 
        endId, 
        setEndId,
        graph, setGraph,
        mazeVisualized,
        setMazeVisualized,
        pathVisualized,
        setPathVisualized,
        handleNextFn,
        setHandleNextFn,
        registerHandleNext,
        skip,
        setSkip,
        currentStep,
        setCurrentStep,
        control,
        setControl,
        info,
        setInfo,
        selectingGenerator,
        setSelectingGenerator,
        selectingCrawler,
        setSelectingCrawler,
        digging,
        setDigging,
        crawling,
        setCrawling,
        pending,
        setPending,
        waiting,
        setWaiting,
        visualizingGen,
        setVisualizingGen,
        visualizingCraw,
        setVisualizingCraw,
        paused,
        setPaused,
        home,
        setHome,
        maze,
        setMaze,
        mazeSize,
        setMazeSize,
        cellSize,
        setCellSize,
        renderSpeed,
        setRenderSpeed,
        generatorRecord,
        setGeneratorRecord,
        crawlerRecord,
        setCrawlerRecord,
        selectedGenerator,
        setSelectedGenerator,
        selectedGenerator_Name,
        setSelectedGenerator_Name,
        selectedCrawler,
        setSelectedCrawler,
        selectedCrawler_Name,
        setSelectedCrawler_Name,
        generators,
        crawlers,
        handleSelectGenerator,
        handleSelectCrawler,
    };

    return (
        <div className="w-full h-full flex justify-between gap-2 p-4 relative">
            {/* LEFT */}
            {control && (
                <div className="w-[24%] h-full">
                    <ControlPanel {...panelState}></ControlPanel>
                </div>
            )}
            {/* RIGHT */}
            <div
                className={`flex flex-1 flex-col justify-between gap-2 ${
                    control ? "" : ""
                }`}>
                <VisualPanel {...panelState} />
                {info && <InfoPanel {...panelState}></InfoPanel>}
            </div>
        </div>
    );
}
