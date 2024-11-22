export default function Footer() {
    return (
        <footer className="p-3">
            <div className="flex justify-between">
                <h2 className="text-lg">BigO<span className="text-[#C5CC5A]">Auditor</span></h2>
                <span>Build by <a href="https://avirana.com" className="text-[#C5CC5A] hover:underline">Avi Rana<i class="fa-solid fa-square-arrow-up-right"></i></a></span>
            </div>
            <small className="text-[#888]">
                Build for the <a className="text-[#8a8f4a] hover:underline" href="https://developer.chrome.com/blog/ai-challenge">Google Chrome Built-in AI Challenge</a> using Chrome build-in AI APIs.<br />Check the <a href="https://github.com/Avi-Rana-1718/bigOAuditor" className="underline">Github</a>
            </small>
        </footer>
    )
}