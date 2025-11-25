"use client";
import { Button, ButtonDisable, ButtonX } from "@/app/Components/Button";
import { Card, CardDisplay } from "@/app/Components/Card";
import { mazeToWeightedGraph } from "@/app/Components/mazeToGraph";
import { VisualGenerating } from "@/app/Panel/visualizer";
import { VisualCrawling } from "@/app/Panel/visualizerCraw";
import { useEffect, useState } from "react";
import { bfsMaze } from "@/maze/Crawler/bfs";

export default function VisualPanel(prop: PanelState) {
    const [canGenerate, setCanGenerate] = useState(false);
    // CAN_GENERATE
    useEffect(() => {
        if (
            prop.mazeSize !== null &&
            prop.cellSize !== null &&
            prop.selectedGenerator !== null &&
            !prop.visualizingGen &&
            !prop.crawling &&
            !prop.digging &&
            !prop.selectingCrawler &&
            !prop.selectingGenerator
        ) {
            setCanGenerate(true);
        } else {
            setCanGenerate(false);
        }
    }, [
        prop.mazeSize,
        prop.cellSize,
        prop.selectedCrawler,
        prop.selectedGenerator,
        prop.digging,
        prop.crawling,
        prop.selectingCrawler,
        prop.selectingGenerator,
    ]);
const handleCrawlbfs = async () => {
    if (!prop.selectedCrawler || !prop.maze.length) return;

    prop.setCrawling(true);

    const maze = prop.maze;
    const startX = 0;
    const startY = 0;
    const endX = prop.mazeSize.w - 1;
    const endY = prop.mazeSize.h - 1;

    // jalankan BFS dengan solution
    const record = await bfsMaze(maze, startX, startY, endX, endY);

    prop.setCrawlerRecord(record);
    prop.setCrawling(false);
    prop.setPathVisualized(true);
};


    // Djikstra
    const handleCrawlDijkstra = async () => {
        if (!prop.selectedCrawler || !prop.maze.length) return;

        prop.setCrawling(true);

        // convert maze ke weighted graph
        const graph = mazeToWeightedGraph(prop.maze);
        prop.setGraph(graph);
        console.log(prop.graph);

        // tentukan start dan end
        const startId = "0-0";
        const endId = `${prop.mazeSize.w - 1}-${prop.mazeSize.h - 1}`;
        prop.setStartId(startId);
        prop.setEndId(endId);

        const dist: Record<string, number> = {};
        const prev: Record<string, string | null> = {};
        const record: CrawlerStep[] = [];

        // init dist dan prev
        for (const id in graph) {
            dist[id] = Infinity;
            prev[id] = null;
        }
        if (!graph[startId] || !graph[endId]) {
            console.warn("Start or End node missing in graph");
            prop.setCrawling(false);
            return;
        }
        dist[startId] = 0;

        const queue: string[] = Object.keys(graph);

        while (queue.length) {
            queue.sort((a, b) => dist[a] - dist[b]);
            const u = queue.shift()!;
            if (dist[u] === Infinity) break;
            record.push({
                cell: { x: graph[u].x, y: graph[u].y },
                type: "visited",
                cost: dist[u],
            });
            if (u === endId) break;

            for (const { id: v, weight } of graph[u].neighbors) {
                if (!graph[v]) continue;
                const alt = dist[u] + weight;
                if (alt < dist[v]) {
                    dist[v] = alt;
                    prev[v] = u;
                }
            }
        }

        // rekonstruksi path
        const path: CrawlerStep[] = [];
        let u: string | null = endId;
        while (u && prev[u] !== null) {
            if (!graph[u]) break; // amanin crash
            path.unshift({
                cell: { x: graph[u].x, y: graph[u].y },
                type: "solution",
                cost: dist[u],
            });
            u = prev[u];
        }

        record.push(...path);
        prop.setCrawlerRecord(record);
        prop.setCrawling(false);
        prop.setPathVisualized(true);
    };
    const handleCrawlAstar = async () => {
    if (!prop.selectedCrawler || !prop.maze.length) return;

    prop.setCrawling(true);

    // convert maze ke weighted graph
    const graph = mazeToWeightedGraph(prop.maze);
    prop.setGraph(graph);

    // tentukan start dan end
    const startId = "0-0";
    const endId = `${prop.mazeSize.w - 1}-${prop.mazeSize.h - 1}`;
    prop.setStartId(startId);
    prop.setEndId(endId);

    const gScore: Record<string, number> = {};
    const fScore: Record<string, number> = {};
    const prev: Record<string, string | null> = {};
    const record: CrawlerStep[] = [];

    const heuristic = (a: { x: number; y: number }, b: { x: number; y: number }) =>
        Math.abs(a.x - b.x) + Math.abs(a.y - b.y); // Manhattan

    for (const id in graph) {
        gScore[id] = Infinity;
        fScore[id] = Infinity;
        prev[id] = null;
    }
    if (!graph[startId] || !graph[endId]) {
        console.warn("Start or End node missing in graph");
        prop.setCrawling(false);
        return;
    }
    gScore[startId] = 0;
    fScore[startId] = heuristic(graph[startId], graph[endId]);

    const queue: string[] = Object.keys(graph);

    while (queue.length) {
        queue.sort((a, b) => fScore[a] - fScore[b]);
        const u = queue.shift()!;
        if (gScore[u] === Infinity) break;

        record.push({
            cell: { x: graph[u].x, y: graph[u].y },
            type: "visited",
            cost: gScore[u],
        });
        if (u === endId) break;

        for (const { id: v, weight } of graph[u].neighbors) {
            if (!graph[v]) continue;
            const tentativeG = gScore[u] + weight;
            if (tentativeG < gScore[v]) {
                gScore[v] = tentativeG;
                fScore[v] = tentativeG + heuristic(graph[v], graph[endId]);
                prev[v] = u;
            }
        }
    }

    // rekonstruksi path
    const path: CrawlerStep[] = [];
    let u: string | null = endId;
    while (u) {
        if (!graph[u]) break;
        path.unshift({
            cell: { x: graph[u].x, y: graph[u].y },
            type: "solution",
            cost: gScore[u],
        });
        u = prev[u];
    }

    record.push(...path);
    prop.setCrawlerRecord(record);
    prop.setCrawling(false);
    prop.setPathVisualized(true);
};


    useEffect(() => {
        console.log(prop.graph);
    }, [prop.graph]);
    // GENERATE MAZE, RECORD
    const handleGenerateMaze = async () => {
        // SWITCH STATE

        prop.setDigging(true);
        const emptyRecord: GeneratorStep[] = [];

        // RESET MAZE& RECORD
        const newMaze: Cell[][] = [];
        for (let y = 0; y < (prop.mazeSize.h || 0); y++) {
            const row: Cell[] = [];
            for (let x = 0; x < (prop.mazeSize.w || 0); x++) {
                row.push({ x, y, type: "wall" });
            }
            newMaze.push(row);
        }
        prop.setMaze(newMaze);

        // GET AND RUN GENERATOR
        const generatorObj = prop.generators.find(
            (g) => g.id === prop.selectedGenerator
        );
        if (!generatorObj || !generatorObj.algorithm) return;
        const algorithm = generatorObj.algorithm;
        const [generatedMaze, record] = await algorithm({
            maze: newMaze,
            mazeSize: prop.mazeSize,
            record: emptyRecord,
        });
        // Update state
        const prevgraph = mazeToWeightedGraph(generatedMaze);
        console.log(prevgraph)
        prop.setMaze(generatedMaze);
        prop.setGeneratorRecord(record);
        prop.setDigging(false);
        prop.setWaiting(true);
        return;
    };
    // Restart
    const handleRestart = () => {
        prop.setVisualizingGen(false);
        prop.setVisualizingCraw(false);
        prop.setWaiting(false);
        prop.setSelectedCrawler(null);
        prop.setSelectedCrawler_Name("None");
        prop.setSelectedGenerator(null);
        prop.setSelectedGenerator_Name("None");
        prop.setMaze([]);
        prop.setCrawlerRecord([]);
        prop.setGeneratorRecord([]);
        prop.setCurrentStep(0);
        prop.setPaused(false);
        prop.setSkip(false);
        prop.setMazeVisualized(false);
        prop.setPathVisualized(false);
        prop.setWaiting(false);
    };

    return (
        <div
            onClick={() => {
                if (prop.selectingGenerator) prop.setSelectedGenerator(null);
                if (prop.selectingCrawler) prop.setSelectedCrawler(null);
            }}
            className="flex-1 border-panel flex flex-col justify-between">
            {/* HEADER */}
            <div className="std-head items-center gap-4 justify-between px-4">
                <div className="flex gap-2">
                    {!prop.control && (
                        <ButtonX
                            label="Show Control Panel"
                            event={() => prop.setControl(true)}></ButtonX>
                    )}
                    {!prop.info && (
                        <ButtonX
                            label="Show Info Panel"
                            event={() => prop.setInfo(true)}></ButtonX>
                    )}
                </div>

                <div className="">
                    <Button label="Maze"></Button>
                </div>
            </div>
            {/* DISPLAY */}
            <div className="flex-1 bg-black flex flex-col justify-center items-center relative">
                {/* STATE: SELECT GEN*/}
                {prop.selectingGenerator && (
                    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center gap-10 z-50 bg-black">
                        {prop.generators.map((card, idx) => (
                            <Card
                                key={idx}
                                url={card.url}
                                id={card.id}
                                type={card.type}
                                handleSelectedCard={() =>
                                    prop.handleSelectGenerator(card.id)
                                }
                                name={card.name}
                                desc={card.desc}
                                selectedCard={prop.selectedGenerator}></Card>
                        ))}
                    </div>
                )}
                {/* STATE: SELECT CRAW*/}
                {prop.selectingCrawler && (
                    <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center gap-10 z-50 bg-black">
                        {prop.crawlers.map((card) => (
                            <Card
                                url={card.url}
                                key={card.id}
                                id={card.id}
                                type={card.type}
                                handleSelectedCard={() =>
                                    prop.handleSelectCrawler(card.id)
                                }
                                name={card.name}
                                desc={card.desc}
                                selectedCard={prop.selectedCrawler}></Card>
                        ))}
                    </div>
                )}
                {/* STATE: WAITING Instructions*/}
                {prop.waiting &&
                    !prop.visualizingGen &&
                    !prop.visualizingCraw && (
                        <div className="flex-mid flex-col">
                            <div className="flex-col">
                                {prop.maze.map((row, rowid) => (
                                <div
                                    key={rowid}
                                    className="w-full flex justify-center">
                                    {row.map((item, itemid) => (
                                        <div
                                            key={itemid}
                                            className={`w-2.5 h-2.5 ${
                                                item.type === "wall"
                                                    ? "bg-white"
                                                    : "bg-black"
                                            }`}></div>
                                    ))}
                                </div>
                            ))}
                            </div>
                        </div>
                    )}

                {/* STATE: RENDER GEN */}
                {prop.visualizingGen && (
                    <>
                        <VisualGenerating {...prop}></VisualGenerating>
                    </>
                )}
                {(prop.visualizingGen || prop.visualizingCraw) && (
                    <div className="w-full h-full flex-mid absolute top-0 left-0">
                        <div
                            style={{
                                width: prop.mazeSize.w * prop.cellSize,
                                height: prop.mazeSize.h * prop.cellSize,
                            }}
                            className="border border-white"></div>
                    </div>
                )}
                {/* STATE: RENDER CRAW*/}
                {prop.visualizingCraw && (
                    <>
                        <VisualCrawling {...prop}></VisualCrawling>
                    </>
                )}

                {/* DEFAULT SEMENTARA */}
                {!prop.selectingCrawler &&
                    !prop.selectingGenerator &&
                    !prop.visualizingGen &&
                    !prop.waiting &&
                    !prop.visualizingGen &&
                    !prop.visualizingCraw && (
                        <div className="flex justify-center items-center flex-col w-full h-full">
                            <div className="flex-mid gap-4">
                                <div
                                    style={{
                                        width: prop.mazeSize.w * prop.cellSize,
                                        height: prop.mazeSize.h * prop.cellSize,
                                    }}
                                    className="border border-white flex-mid gap-4">
                                    <CardDisplay
                                        algoId={prop.selectedGenerator}
                                        algorithm={
                                            prop.generators
                                        }></CardDisplay>
                                    <CardDisplay
                                        algoId={prop.selectedCrawler}
                                        algorithm={prop.crawlers}></CardDisplay>
                                </div>
                            </div>
                        </div>
                    )}
            </div>

            {/* BUTTON: SELECTING GEN -> SELECT */}
            {prop.selectingGenerator && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="std-head justify-center items-center gap-2 px-4">
                    <ButtonX
                        event={() => {
                            prop.setSelectingGenerator(false);
                            prop.setSelectedGenerator(null);
                            prop.setSelectedGenerator_Name("None");
                        }}
                        label="CENCEL"></ButtonX>
                    <ButtonX
                        event={() => prop.setSelectingGenerator(false)}
                        label="SELECT"></ButtonX>
                </div>
            )}
            {/* BUTTON: SELECTING CRAW -> SELECT */}
            {prop.selectingCrawler && (
                <div
                    onClick={(e) => e.stopPropagation()}
                    className="std-head justify-center items-center gap-2 px-4">
                    <ButtonX
                        event={() => {
                            prop.setSelectingCrawler(false);
                            prop.setSelectedCrawler(null);
                            prop.setSelectedCrawler_Name("None");
                        }}
                        label="CENCEL"></ButtonX>
                    <ButtonX
                        event={() => prop.setSelectingCrawler(false)}
                        label="SELECT"></ButtonX>
                </div>
            )}
            {/* BUTTON: RESTART, [PREV, PAUSE, NEXT], SKIP */}
            {(prop.visualizingGen || prop.visualizingCraw) && !prop.waiting && (
                <div className="std-head justify-between items-center gap-2 px-4">
                    <div>
                        <ButtonX
                            event={() => handleRestart()}
                            label="RESTART"></ButtonX>
                    </div>
                    {!prop.paused && (
                        <div className="flex gap-2">
                            <ButtonDisable label="PREV"></ButtonDisable>
                            <ButtonX
                                event={() => {
                                    prop.setPaused(true);
                                }}
                                label="PAUSE"></ButtonX>
                            <ButtonDisable label="NEXT"></ButtonDisable>
                        </div>
                    )}
                    {prop.paused && (
                        <div className="flex gap-2">
                            <ButtonX
                                event={() => {
                                    console.log("clicked");
                                }}
                                label="PREV"></ButtonX>
                            <ButtonX
                                event={() => prop.setPaused(false)}
                                label="PLAY"></ButtonX>
                            <ButtonX
                                event={() => {
                                    prop.handleNextFn?.();
                                    console.log(
                                        "NEXT_CLICKED: " + prop.handleNextFn
                                    );
                                }}
                                label="NEXT"
                            />
                        </div>
                    )}
                    <div>
                        <ButtonX
                            event={() => {
                                prop.setSkip(true);
                                prop.setPaused(false);

                                prop.setWaiting(true);
                                prop.setCurrentStep(0);
                                prop.setMazeVisualized(false);
                            }}
                            label="SKIP"></ButtonX>
                    </div>
                </div>
            )}
            {/* BUTTON: CAN GENERATE */}
            {canGenerate &&
                !prop.waiting &&
                !prop.visualizingGen &&
                !prop.visualizingCraw && (
                    <div className="std-head justify-between items-center gap-2 px-4">
                        <div className="w-full flex-mid text-xl">
                            <ButtonX
                                event={() => handleGenerateMaze()}
                                label="GENERATE MAZE"></ButtonX>
                        </div>
                    </div>
                )}
            {/* BUTTON: CAN'T GENERATE */}
            {!canGenerate &&
                !prop.visualizingGen &&
                !prop.visualizingCraw &&
                !prop.selectingCrawler &&
                !prop.selectingGenerator && (
                    <div className="std-head justify-between items-center gap-2 px-4">
                        <div className="w-full flex-mid text-xl">
                            <ButtonDisable label="GENERATE"></ButtonDisable>
                        </div>
                    </div>
                )}
            {/* BUTTON: Waiting -> Visualizing */}
            {prop.waiting &&
                !prop.selectingCrawler &&
                !prop.selectingGenerator && (
                    <div className="std-head flex-mid gap-4">
                        <div>
                            <ButtonX
                                event={() => handleRestart()}
                                label="RESTART"></ButtonX>
                        </div>
                        {!prop.mazeVisualized && (
                            <ButtonX
                                event={() => {
                                    handleGenerateMaze();
                                }}
                                label="CHANGE"></ButtonX>
                        )}
                        {!prop.mazeVisualized && (
                            <ButtonX
                                event={() => {
                                    prop.setVisualizingGen(true);
                                    prop.setVisualizingCraw(false);

                                    prop.setWaiting(false);
                                }}
                                label="VISUALIZE"></ButtonX>
                        )}
                        {prop.selectedCrawler !== null &&
                            prop.maze.length !== 0 && (
                                <ButtonX
                                    event={async () => {
                                        prop.setVisualizingCraw(true);
                                        prop.setWaiting(false);
                                        await handleCrawlDijkstra();
                                    }}
                                    label="Djikstra"></ButtonX>
                            )}
                        {prop.selectedCrawler !== null &&
                            prop.maze.length !== 0 && (
                                <ButtonX
                                    event={async () => {
                                        prop.setVisualizingCraw(true);
                                        prop.setWaiting(false);
                                        await handleCrawlAstar();
                                    }}
                                    label="AStar"></ButtonX>
                            )}
                        {prop.selectedCrawler !== null &&
                            prop.maze.length !== 0 && (
                                <ButtonX
                                    event={async () => {
                                        prop.setVisualizingCraw(true);
                                        prop.setWaiting(false);
                                        await handleCrawlbfs();
                                    }}
                                    label="bfs"></ButtonX>
                            )}
                    </div>
                )}
        </div>
    );
}
