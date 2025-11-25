export function Card({
    id,
    name,
    desc,
    url,
    type,
    handleSelectedCard,
    selectedCard,
}: AlgorithmSet & {
    handleSelectedCard: () => void;
    selectedCard: number | null;
}) {
    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                handleSelectedCard();
            }}
            className={`${
                selectedCard == id
                    ? "border-4 border-white"
                    : "border-4 border-transparent"
            } w-40 h-60 p-2 flex items-start flex-col bg-linear-to-br from-blue-400 to-purple-400`}>
            <div className="w-full h-30 border overflow-hidden">
                <img src={url} alt={name} className="object-cover object-ce" />
            </div>
            <h1 className="text-xl font-black text-white">{name}</h1>
            <div className="flex flex-col justify-between flex-1">
                <p>{desc}</p>
                <p>{`Type: ${type}`}</p>
            </div>
        </div>
    );
}

export function CardDisplay(prop: {
    algoId: number | null;
    algorithm: {
        id: number;
        name: string;
        desc: string;
        url: string;
        algorithm?: Function;
    }[];
}) {
    const algo = prop.algorithm.find((g) => g.id === prop.algoId) ?? null;
    if (!algo) {
        return null;
    }
    const name = algo.name;
    const desc = algo.desc;
    const url = algo.url;

    return (
        <div
            className={`border-transparent w-20 h-30 p-1 flex items-center flex-col bg-linear-to-br from-blue-400 to-purple-400`}>
            <div className="w-full h-full border overflow-hidden bg-black">
                <img
                    src={algo.url}
                    alt={algo.name}
                    className="object-cover w-full h-full"
                />
            </div>
        </div>
    );
}
