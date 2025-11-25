export function Button({label} : {label: string}) {
    return <button className="min-w-24 h-6 px-2 border border-white text-sm"><p>{label}</p></button>
}
export function ButtonDisable({label} : {label: string}) {
    return <button className="min-w-24 h-6 px-2 border border-zinc-100 text-sm text-zinc-500"><p>{label}</p></button>
}
export function ButtonDrop({label} : {label: string}) {
    return (
        <button className="min-w-24 h-6 px-2 border border-white hover:bg-white text-black text-sm"><p>{label}</p></button>
    )
}
export function ButtonX({label, event} : {label: string; event: () => void}) {
    return <button onClick={event} className="min-w-24 h-6 px-2 border border-white hover:bg-white hover:text-black text-sm"><h6>{label}</h6></button>
}
export function ButtonXsmall({label, event} : {label: string; event: () => void}) {
    return <button onClick={event} className="min-w-12 h-6 px-1 border border-white hover:bg-white hover:text-black text-sm"><h6>{label}</h6></button>
}
export function ButtonXX({label, event, isActive} : {label: string; event: () => void; isActive: boolean}) {
    return <button onClick={event} className={`${isActive? 'bg-linear-to-br from-blue-500 to-purple-600': ''} min-w-24 h-6 px-2 border border-white hover:bg-white hover:text-black text-sm`}><h6>{label}</h6></button>
}