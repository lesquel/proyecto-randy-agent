export const dynamic = 'force-static'

export default function InicioPage() {
  const features = [
    {
      title: 'Chat unificado',
      desc: 'Panel único para alternar agentes y mantener el flujo.'
    },
    {
      title: 'Modo offline',
      desc: 'Service Worker cachea recursos y página offline.'
    },
    {
      title: 'Multi-agente',
      desc: 'Especialistas en dominios clave listos para ayudarte.'
    },
    {
      title: 'Sesión local',
      desc: 'Tu identidad sólo vive en tu dispositivo (localStorage).'
    }
  ]
  return (
    <main className="relative mx-auto max-w-6xl px-6 py-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.15),transparent_60%),radial-gradient(circle_at_80%_70%,hsl(var(--accent)/0.25),transparent_55%)]" />
      <section className="mb-10 grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="from-primary text-balance bg-gradient-to-r via-teal-400 to-fuchsia-500 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
              Bienvenido a <span className="drop-shadow">Chat AI</span>
            </h1>
            <p className="text-muted-foreground max-w-prose text-sm leading-relaxed sm:text-base">
              Agentes de IA especializados (medicina, psicología, arquitectura,
              leyes, web y más) en una interfaz ligera y rápida. Instala la PWA
              y continúa incluso sin conexión.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/"
              className="from-primary text-primary-foreground focus:ring-primary group relative inline-flex items-center gap-2 overflow-hidden rounded-md bg-gradient-to-r via-indigo-500 to-fuchsia-500 px-5 py-2.5 text-sm font-medium shadow transition hover:scale-[1.02] focus:outline-none focus:ring-2"
            >
              <span className="relative z-10">Entrar al Chat</span>
              <span className="absolute inset-0 -z-0 bg-white opacity-0 transition group-hover:opacity-20" />
            </a>
            <a
              href="/register"
              className="hover:bg-accent hover:text-accent-foreground rounded-md border px-5 py-2.5 text-sm font-medium"
            >
              Crear sesión local
            </a>
          </div>
        </div>
        <div className="from-background/40 to-background/20 relative hidden min-h-[280px] rounded-xl border bg-gradient-to-br p-6 shadow-sm backdrop-blur-sm md:block">
          <div className="absolute inset-0 rounded-xl border border-white/5" />
          <div className="space-y-4 text-sm">
            <p className="text-primary/70 font-mono text-xs uppercase tracking-wider">
              Preview
            </p>
            <div className="grid gap-3 text-xs">
              <div className="bg-background/60 ring-border/50 rounded-md p-3 shadow-sm ring-1">
                <p className="font-semibold">Agente Medicina</p>
                <p className="text-muted-foreground">
                  Listo para responder consultas sanitarias generales.
                </p>
              </div>
              <div className="bg-background/60 ring-border/50 rounded-md p-3 shadow-sm ring-1">
                <p className="font-semibold">Agente Psicología</p>
                <p className="text-muted-foreground">
                  Apoyo conversacional empático y responsable.
                </p>
              </div>
              <div className="bg-background/60 ring-border/50 rounded-md p-3 shadow-sm ring-1">
                <p className="font-semibold">Agente WebDev</p>
                <p className="text-muted-foreground">
                  Soluciones de frontend/backend rápidas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-background/50 hover:border-primary/40 group relative overflow-hidden rounded-xl border p-4 shadow-sm backdrop-blur-sm transition hover:shadow-md"
          >
            <div className="from-primary/0 via-primary/0 to-primary/0 absolute inset-0 bg-gradient-to-br opacity-0 transition group-hover:opacity-10" />
            <h2 className="mb-1 font-semibold tracking-wide">{f.title}</h2>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </section>
    </main>
  )
}
