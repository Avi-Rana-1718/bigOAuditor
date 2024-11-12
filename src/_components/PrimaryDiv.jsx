export default function PrimaryDiv({children, title}) {
    return (
        <div className="bg-[#2b2b2b] text-[#BDBDBD] m-2.5 p-3 rounded">
            <h3 className="text-lg">{title}</h3>
            {children}
        </div>
    )
}