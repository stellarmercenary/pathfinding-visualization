"use client";

export default function InfoPanel(prop: PanelState) {
    const booleanKeys = [
        "selectingGenerator",
        "selectingCrawler",
        "digging",
        "crawling",
        "pending",
        "waiting",
        "visualizingGen",
        "visualizingCraw",
        "paused",
        "home",
        "skip",
        "mazeVisualized",
        "pathVisualized",
    ] as const;
    return (
        <div className="border-panel w-full h-[24%] flex flex-col overflow-hidden">
            {/* HEADER */}
            <div className="std-head items-center justify-between px-4">
                <h1 className="font-bold text-xl">Log Panel</h1>
                <div className="flex gap-2 items-center">
                    <div className="h-5 w-5 border border-zinc-600 bg-zinc-950 flex-mid hover:bg-zinc-600"></div>
                    <div
                        className="h-5 w-5 border border-zinc-600 bg-red-950 flex-mid hover:bg-red-600"
                        onClick={() => prop.setInfo(false)}></div>
                </div>
            </div>
            {/* SCROLLABLE INFO */}
            <div className="flex-1 overflow-auto">
                <div className="w-full h-full flex px-10 bg-black flex-col gap-[0.5px]">
                    {/* STATUS */}
                    {booleanKeys.map((key) => {
                        const val = prop[key];
                        if (val) return <p key={key}>{key}</p>;
                        return null;
                    })}
                    {prop.maze.length !== 0 && <p>maze: Generated</p>}
                    
                    {prop.selectedGenerator !== null  &&(
                        <p>Selected Generator: {prop.selectedGenerator_Name}</p>
                    )}
                    {prop.selectedCrawler !== null && (
                        <p>Selected Crawler: {prop.selectedCrawler_Name}</p>
                    )}
                </div>
            </div>
        </div>
    );
}
