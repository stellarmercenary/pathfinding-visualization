"use client";
import { ButtonXX } from "@/app/Components/Button";

export default function ControlPanel(prop: PanelState) {
    return (
        <div className="border-panel w-full h-full flex flex-col">
            {/* CONTROL PANEL */}
            <div className="std-head items-center justify-between px-4">
                <h1 className="font-bold text-xl">CONTROL PANEL</h1>
                <div
                    className="h-5 w-5 border border-zinc-600 bg-red-950 flex-mid hover:bg-red-600"
                    onClick={() => prop.setControl(false)}></div>
            </div>
            <div className="w-full flex flex-col gap-2">
                {/* SETTINGS */}
                <div className="std-head-1 px-4">
                    <h2>Settings:</h2>
                </div>
                <div className="w-full pl-8 pr-4 flex flex-col gap-2">
                    <div className="flex justify-between">
                        {/* GENERATOR */}
                        <p>Generator:</p>
                        
                                <ButtonXX
                                    isActive={prop.selectingGenerator}
                                    event={() => {
                                        prop.setSelectingGenerator(
                                            !prop.selectingGenerator
                                        );
                                        prop.setSelectingCrawler(false);
                                        prop.setHome(false);

                                    }}
                                    label={
                                        prop.selectedGenerator_Name
                                    }></ButtonXX>
                            
                    </div>
                    <div className="flex justify-between">
                        {/* CRAWLER */}
                        <p>Crawler:</p>
                        {/* ACTIVE */}
                                <ButtonXX
                                    isActive={prop.selectingCrawler}
                                    event={() => {
                                        prop.setSelectingCrawler(
                                            !prop.selectingCrawler
                                        );
                                        prop.setSelectingGenerator(false);
                                    }}
                                    label={
                                        prop.selectedCrawler_Name
                                    }></ButtonXX>
                            
                    </div>
                    {/* SET MAZE SIZE */}
                    <div className="flex flex-col justify-between">
                        <p>Maze Size:</p>
                        <div className="w-full px-4 flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                                <p>W-</p>
                                <input
                                    className="w-12 h-6 flex items-center px-1 bg-black text-white border border-zinc-800"
                                    type="number"
                                    min={21}
                                    max={89}
                                    value={prop.mazeSize.w ?? ""}
                                    onChange={(e) =>
                                        prop.setMazeSize({
                                            ...prop.mazeSize,
                                            w: +e.target.value,
                                        })
                                    }
                                />
                                <div
                                    className="border-white  border w-6 h-6"
                                    onClick={() =>
                                        prop.setMazeSize({
                                            ...prop.mazeSize,
                                            w: 61,
                                        })
                                    }></div>
                            </div>

                            <div className="flex items-center gap-1">
                                <p>H-</p>{" "}
                                <input
                                    className="w-12 h-6 flex items-center px-1 bg-black text-white border border-zinc-800"
                                    type="number"
                                    min={13}
                                    max={37}
                                    value={prop.mazeSize.h ?? ""}
                                    onChange={(e) =>
                                        prop.setMazeSize({
                                            ...prop.mazeSize,
                                            h: +e.target.value,
                                        })
                                    }
                                />
                                <div
                                    className="border-white border w-6 h-6"
                                    onClick={() =>
                                        prop.setMazeSize({
                                            ...prop.mazeSize,
                                            h: 31,
                                        })
                                    }></div>
                            </div>
                        </div>
                    </div>
                    {/* SET CELL SIZE */}
                    <div className="flex justify-between">
                        <p>{`Cell Size(px):`}</p>
                        <div className="flex gap-4">
                            <input
                                type="number"
                                className="w-12 h-6 flex items-center px-1 bg-black text-white border border-zinc-800"
                                value={prop.cellSize ?? ""}
                                max={10}
                                onChange={(e) =>
                                    prop.setCellSize(+e.target.value)
                                }
                            />
                        </div>
                    </div>
                    {/* SET CELL SPEED */}
                    <div className="flex gap-4 justify-between">
                        <p>{`Speed(ms):`}</p>
                        <div className="flex items-center gap-1">
                            <input
                                type="number"
                                value={prop.renderSpeed ?? ""}
                                className="w-12 h-6 flex items-center px-1 bg-black text-white border border-zinc-800"
                                onChange={(e) =>
                                    prop.setRenderSpeed(+e.target.value)
                                }
                            />
                        </div>
                    </div>
                    {/* SET COLOR */}
                    <div className="flex justify-between">
                        <p>Color:</p>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1">
                                <p>PATH</p>{" "}
                                <div className="bg-black h-4 w-4 border border-zinc-600"></div>
                            </div>
                            <div className="flex items-center gap-1">
                                <p>WALL</p>{" "}
                                <div className="bg-white h-4 w-4 border border-zinc-600"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
