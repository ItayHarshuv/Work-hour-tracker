export default function Layout({ sidebar, children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:flex-row md:px-8">
        <aside className="md:w-[360px]">{sidebar}</aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
