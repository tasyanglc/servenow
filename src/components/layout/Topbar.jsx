export default function Topbar({ onMenuClick }) {
  return <header className="z-30 flex h-16 shrink-0 items-center border-b border-slate-100 bg-white px-4 lg:hidden"><button onClick={onMenuClick} aria-label="Buka menu" className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-lg text-slate-700">☰</button></header>;
}
