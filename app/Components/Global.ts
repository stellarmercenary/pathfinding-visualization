type Cell = {
    x: number;
    y: number;
    type: CellState;
};

interface WeightedGraphNode {
    x: number;
    y: number;
    neighbors: { id: string; weight: number }[];
}

type WeightedGraph = Record<string, WeightedGraphNode>;

type CellState = "empty" | "wall" | "path" | "visited" | "current" | "solution" | 'edge';

type GeneratorStep = {
    cell: { x: number; y: number };
    type: CellState;
};

type CrawlerStep = {
    cell: { x: number; y: number };
    type: CellState;
    cost?: number;
        from?: { x: number; y: number }; // edge info
};

type MazeSize = {
    w: number;
    h: number;
};

type AlgorithmSet = {
    id: number;
    name: string;
    desc: string;
    url: string;
    algorithm?: Function;
    type: string;
};

type GeneratorArray = Generator[];

interface PanelState {
    control: boolean;
    info: boolean;
    selectingGenerator: boolean;
    selectingCrawler: boolean;
    digging: boolean;
    crawling: boolean;
    pending: boolean;
    waiting: boolean;
    visualizingGen: boolean;
    visualizingCraw: boolean;
    paused: boolean;
    home: boolean;
    skip: boolean;
    mazeVisualized: boolean;
    pathVisualized: boolean;

    maze: Cell[][];
    mazeSize: { w: number; h: number };
    cellSize: number;
    renderSpeed: number;
    generatorRecord: GeneratorStep[];
    crawlerRecord: CrawlerStep[];
    selectedGenerator: number | null;
    selectedGenerator_Name: string;
    selectedCrawler: number | null;
    selectedCrawler_Name: string;
    currentStep: number;
    generators: AlgorithmSet[];
    crawlers: AlgorithmSet[];

    setControl: (v: boolean) => void;
    setInfo: (v: boolean) => void;
    setSelectingGenerator: (v: boolean) => void;
    setSelectingCrawler: (v: boolean) => void;
    setDigging: (v: boolean) => void;
    setCrawling: (v: boolean) => void;
    setPending: (v: boolean) => void;
    setWaiting: (v: boolean) => void;
    setVisualizingGen: (v: boolean) => void;
    setVisualizingCraw: (v: boolean) => void;
    setPaused: (v: boolean) => void;
    setHome: (v: boolean) => void;
    setSkip: (v: boolean) => void;
    setMazeVisualized: (v: boolean) => void;
    setPathVisualized: (v: boolean) => void;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>;

    setMaze: (maze: Cell[][]) => void;
    setMazeSize: (size: { w: number; h: number }) => void;
    setCellSize: (v: number) => void;
    setRenderSpeed: (v: number) => void;
    setGeneratorRecord: (record: GeneratorStep[]) => void;
    setCrawlerRecord: (record: CrawlerStep[]) => void;
    setSelectedGenerator: (id: number | null) => void;
    setSelectedCrawler: (id: number | null) => void;
    setSelectedGenerator_Name: (name: string) => void;
    setSelectedCrawler_Name: (name: string) => void;
    handleSelectGenerator: (id: number | null) => void;
    handleSelectCrawler: (id: number | null) => void;

    registerHandleNext: (fn: () => void) => void;
    handleNextFn: (() => void) | null;
    setHandleNextFn: React.Dispatch<React.SetStateAction<(() => void) | null>>;


     // graph & nodes
    graph: WeightedGraph | null;
    setGraph: (graph: WeightedGraph) => void;
    startId: string;
    setStartId: (id: string) => void;
    endId: string;
    setEndId: (id: string) => void;
}
