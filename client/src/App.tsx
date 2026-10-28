import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Command,
  Download,
  ExternalLink,
  Filter,
  Gamepad2,
  Heart,
  Library,
  Menu,
  MoreHorizontal,
  Play,
  Radio,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Store,
  Tag,
  X,
  Zap,
} from "lucide-react";
import { games, offerGames, platforms, type Game, type InstallState, type Platform } from "./data/games";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

const LOGO = "/manus-storage/WhatsAppImage2026-10-28at12.00.54AM_b5120da9.jpeg";
const TV_ICON = "/manus-storage/tv-skull-icon_2d62fd62.jpg";

type View = "library" | "store" | "offers";

type GameCardProps = {
  game: Game;
  onOpen: (game: Game) => void;
  onAction: (game: Game) => void;
};

const money = (value: number) => `$${value.toFixed(2)}`;

function PlatformBadge({ platform }: { platform: Platform }) {
  const label = platform === "Xbox / Microsoft" ? "XBOX / MS" : platform === "Epic Games" ? "EPIC" : "STEAM";
  return <span className={`platform-badge platform-${platform.toLowerCase().replace(/[^a-z]/g, "-")}`}>{label}</span>;
}

function StateBadge({ state }: { state: InstallState }) {
  if (state === "running") {
    return <span className="state-badge state-running"><span className="pulse-dot" />En ejecución</span>;
  }
  if (state === "installed") {
    return <span className="state-badge state-installed"><Check size={12} />Instalado</span>;
  }
  return <span className="state-badge state-not-installed"><Download size={12} />No instalado</span>;
}

function CoverArt({ game, large = false }: { game: Game; large?: boolean }) {
  return (
    <div className={`cover-art ${game.coverClass} ${large ? "cover-art-large" : ""}`} style={{ "--cover-accent": game.accent } as React.CSSProperties}>
      <div className="cover-scanlines" />
      <div className="cover-corner">DP // {game.year}</div>
      <div className="cover-glyph">{game.platform === "Steam" ? "S" : game.platform === "Epic Games" ? "E" : "X"}</div>
      <div className="cover-label">{game.coverLabel.split("\n").map((line) => <span key={line}>{line}</span>)}</div>
      <div className="cover-footer">{game.genre}</div>
    </div>
  );
}

function GameCard({ game, onOpen, onAction }: GameCardProps) {
  return (
    <article className="game-card group" onClick={() => onOpen(game)}>
      <div className="game-card-cover-wrap">
        <CoverArt game={game} />
        <button className="favorite-button" aria-label={`Añadir ${game.title} a favoritos`} onClick={(event) => { event.stopPropagation(); toast.success(`${game.title} guardado en favoritos`); }}>
          <Heart size={15} />
        </button>
        {game.discount && <span className="discount-chip">-{game.discount}%</span>}
      </div>
      <div className="game-card-body">
        <div className="game-card-heading">
          <div>
            <h3>{game.title}</h3>
            <p>{game.genre}</p>
          </div>
          <MoreHorizontal size={17} className="muted-icon" />
        </div>
        <div className="game-card-meta">
          <PlatformBadge platform={game.platform} />
          <StateBadge state={game.state} />
        </div>
        <div className="game-card-footer">
          <div className="card-price"><span>{money(game.price)}</span>{game.discount && <del>{money(game.originalPrice)}</del>}</div>
          <button className={`card-action ${game.state === "running" ? "card-action-running" : ""}`} onClick={(event) => { event.stopPropagation(); onAction(game); }}>
            {game.state === "running" ? <><Play size={14} fill="currentColor" /> Abrir</> : game.state === "installed" ? <><Play size={14} fill="currentColor" /> Jugar</> : <><Download size={14} /> Instalar</>}
          </button>
        </div>
      </div>
    </article>
  );
}

function ComparisonTable({ game, compact = false }: { game: Game; compact?: boolean }) {
  const best = Math.min(...game.comparison.map(row => row.price));
  return (
    <div className={`comparison-table ${compact ? "comparison-compact" : ""}`}>
      <div className="comparison-heading"><span>Comparativa de precios</span><span className="demo-label">DATOS DEMO</span></div>
      {game.comparison.map(row => (
        <div className={`comparison-row ${row.price === best ? "comparison-best" : ""}`} key={row.store}>
          <div className="comparison-store"><span className={`store-dot store-${row.store.toLowerCase().replace(/[^a-z]/g, "-")}`} />{row.store}</div>
          <div className="comparison-price">{money(row.price)} {row.discount && <small>-{row.discount}%</small>}</div>
          <div className="comparison-tag">{row.tag ?? (row.price === best ? "Mejor precio" : "")}</div>
        </div>
      ))}
    </div>
  );
}

function Brand({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`brand ${collapsed ? "brand-collapsed" : ""}`}>
      <div className="brand-mark"><img src={TV_ICON} alt="TV con calavera de Dead Pixels" /></div>
      {!collapsed && <div className="brand-wordmark"><img src={LOGO} alt="Dead Pixels" /><span>GAME LAUNCHER</span></div>}
    </div>
  );
}

function App() {
  const [view, setView] = useState<View>("library");
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<(typeof platforms)[number]>("Todas");
  const [installFilter, setInstallFilter] = useState<"all" | InstallState>("all");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [alertGame, setAlertGame] = useState<Game | null>(null);
  const [alertPrice, setAlertPrice] = useState("15.00");
  const [mobileMenu, setMobileMenu] = useState(false);

  const visibleGames = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return games.filter(game => {
      const matchesQuery = !normalized || [game.title, game.genre, game.platform].join(" ").toLowerCase().includes(normalized);
      const matchesPlatform = platform === "Todas" || game.platform === platform;
      const matchesState = installFilter === "all" || game.state === installFilter;
      return matchesQuery && matchesPlatform && matchesState;
    });
  }, [query, platform, installFilter]);

  const runAction = (game: Game) => {
    if (game.state === "not-installed") {
      toast(`Solicitud enviada a ${game.platform}`, { description: `La instalación de ${game.title} se delegaría al cliente oficial.` });
    } else {
      toast.success(game.state === "running" ? `${game.title} ya está en ejecución` : `Lanzando ${game.title}`, { description: "Acción demostrativa del launcher." });
    }
  };

  const setPage = (next: View) => {
    setView(next);
    setMobileMenu(false);
    setSelectedGame(null);
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>
        <Brand />
        <div className="sidebar-divider" />
        <div className="sidebar-kicker">CONTROL CENTER</div>
        <nav className="main-nav" aria-label="Navegación principal">
          <button className={`nav-item ${view === "library" ? "nav-item-active" : ""}`} onClick={() => setPage("library")}><Library size={18} /><span>Biblioteca</span><kbd>01</kbd></button>
          <button className={`nav-item ${view === "store" ? "nav-item-active" : ""}`} onClick={() => setPage("store")}><Store size={18} /><span>Tienda</span><kbd>02</kbd></button>
          <button className={`nav-item ${view === "offers" ? "nav-item-active" : ""}`} onClick={() => setPage("offers")}><Tag size={18} /><span>Ofertas</span><span className="nav-alert">8</span></button>
        </nav>
        <div className="sidebar-section">
          <div className="sidebar-kicker">SEÑALES</div>
          <button className="nav-item subtle" onClick={() => toast("Próximamente: wishlist unificada")}><Heart size={18} /><span>Lista de deseos</span></button>
          <button className="nav-item subtle" onClick={() => toast("Próximamente: conexiones oficiales")}><Radio size={18} /><span>Conexiones</span><span className="status-mini">3/3</span></button>
        </div>
        <div className="sidebar-bottom">
          <div className="sidebar-status"><span className="status-online" />Todos los sistemas nominales</div>
          <button className="nav-item subtle" onClick={() => toast("Configuración en construcción")}><Settings size={18} /><span>Configuración</span></button>
          <div className="profile-card"><div className="profile-avatar">DP</div><div><strong>Operador</strong><span>Modo local</span></div><ChevronDown size={15} /></div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu-button" onClick={() => setMobileMenu(value => !value)} aria-label="Abrir menú"><Menu size={20} /></button>
          <div className="breadcrumb"><span>DEAD PIXELS</span><span className="breadcrumb-separator">/</span><strong>{view === "library" ? "BIBLIOTECA" : view === "store" ? "TIENDA" : "OFERTAS"}</strong></div>
          <div className="topbar-actions">
            <div className="global-search"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar señal..." /><kbd><Command size={12} /> K</kbd></div>
            <button className="icon-button notification-button" aria-label="Notificaciones" onClick={() => toast("No hay nuevas notificaciones")}><Bell size={18} /><span /></button>
            <div className="topbar-divider" />
            <div className="sync-status"><span className="status-online" /><span>SYNC OK</span></div>
          </div>
        </header>

        <div className="content-wrap">
          {view === "library" && <LibraryView games={visibleGames} platform={platform} setPlatform={setPlatform} installFilter={installFilter} setInstallFilter={setInstallFilter} showFilters={showFilters} setShowFilters={setShowFilters} onOpen={setSelectedGame} onAction={runAction} />}
          {view === "store" && <StoreView games={visibleGames} query={query} onOpen={setSelectedGame} onAction={(game) => toast(`Abriendo ficha de ${game.title}`, { description: "Las compras reales se realizarán en la tienda oficial." })} />}
          {view === "offers" && <OffersView onOpen={setSelectedGame} onAlert={setAlertGame} />}
        </div>
      </main>

      {selectedGame && <GameDrawer game={selectedGame} onClose={() => setSelectedGame(null)} onAction={runAction} onAlert={() => setAlertGame(selectedGame)} />}
      {alertGame && <AlertDialog game={alertGame} price={alertPrice} setPrice={setAlertPrice} onClose={() => setAlertGame(null)} onSave={() => { toast.success(`Alerta activada para ${alertGame.title}`, { description: `Te avisaremos cuando baje de $${alertPrice}.` }); setAlertGame(null); }} />}
      <Toaster theme="dark" position="bottom-right" toastOptions={{ className: "dead-toast" }} />
    </div>
  );
}

function LibraryView({ games: filteredGames, platform, setPlatform, installFilter, setInstallFilter, showFilters, setShowFilters, onOpen, onAction }: { games: Game[]; platform: (typeof platforms)[number]; setPlatform: (platform: (typeof platforms)[number]) => void; installFilter: "all" | InstallState; setInstallFilter: (state: "all" | InstallState) => void; showFilters: boolean; setShowFilters: (show: boolean) => void; onOpen: (game: Game) => void; onAction: (game: Game) => void; }) {
  return (
    <>
      <section className="hero-section">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" /> SEÑAL PRINCIPAL <span className="live-pill">LIVE</span></div><h1>Tu biblioteca.<br /><em>Una sola señal.</em></h1><p>Todo tu catálogo, sin saltos de cliente. Encuentra, compara y entra al juego desde un mismo panel.</p><div className="hero-actions"><button className="primary-button" onClick={() => onOpen(games[0])}><Play size={16} fill="currentColor" /> Continuar partida</button><button className="ghost-button" onClick={() => document.getElementById("library-grid")?.scrollIntoView({ behavior: "smooth" })}>Ver biblioteca <ArrowUpRight size={16} /></button></div></div>
        <div className="hero-featured"><div className="featured-glow" /><CoverArt game={games[0]} large /><div className="featured-overlay"><div><span className="featured-label">EN CURSO · 32 MIN</span><h2>{games[0].title}</h2><p>{games[0].subtitle}</p></div><div className="featured-progress"><div className="progress-label"><span>Progreso de señal</span><span>68%</span></div><div className="progress-track"><span style={{ width: "68%" }} /></div></div></div></div>
      </section>
      <section className="stat-strip"><div className="stat-item"><div className="stat-icon red"><Gamepad2 size={17} /></div><div><strong>24</strong><span>Juegos totales</span></div></div><div className="stat-item"><div className="stat-icon green"><ShieldCheck size={17} /></div><div><strong>18</strong><span>Instalados</span></div></div><div className="stat-item"><div className="stat-icon yellow"><Zap size={17} /></div><div><strong>8</strong><span>Ofertas activas</span></div></div><div className="stat-item"><div className="stat-icon purple"><Clock3 size={17} /></div><div><strong>146h</strong><span>Tiempo jugado</span></div></div><div className="stat-item stat-sync"><span className="status-online" /><div><strong>Sync completo</strong><span>Última revisión hace 4 min</span></div></div></section>
      <section className="library-section" id="library-grid"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> CATÁLOGO UNIFICADO</div><h2>Tu biblioteca</h2></div><div className="section-actions"><button className={`filter-toggle ${showFilters ? "filter-toggle-active" : ""}`} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={15} /> Filtros</button><button className="icon-button" aria-label="Más opciones"><MoreHorizontal size={18} /></button></div></div>
        <div className="filter-row"><div className="platform-tabs">{platforms.map(item => <button key={item} className={platform === item ? "tab-active" : ""} onClick={() => setPlatform(item)}>{item === "Todas" ? "Todas" : item === "Xbox / Microsoft" ? "Xbox / MS" : item}</button>)}</div>{showFilters && <div className="state-select"><Filter size={14} /><select value={installFilter} onChange={(event) => setInstallFilter(event.target.value as "all" | InstallState)}><option value="all">Todos los estados</option><option value="installed">Instalados</option><option value="not-installed">No instalados</option><option value="running">En ejecución</option></select><ChevronDown size={14} /></div>}</div>
        <div className="library-layout"><div className="game-grid">{filteredGames.length ? filteredGames.map(game => <GameCard game={game} key={game.id} onOpen={onOpen} onAction={onAction} />) : <div className="empty-state"><Search size={22} /><h3>Señal no encontrada</h3><p>Prueba con otro nombre, género o plataforma.</p></div>}</div><aside className="activity-panel"><div className="panel-heading"><div><span className="panel-kicker">ACTIVIDAD</span><h3>Últimas señales</h3></div><button onClick={() => toast("Historial completo próximamente")}><MoreHorizontal size={17} /></button></div><div className="activity-list"><ActivityItem icon="signal" title="Signal Drift" text="Sesión iniciada" time="Ahora" /><ActivityItem icon="check" title="Hollow Circuit" text="Sincronizado" time="18 oct" /><ActivityItem icon="offer" title="Dead Frequency" text="Bajó 50%" time="16 oct" /><ActivityItem icon="download" title="Void Runner" text="Instalación lista" time="14 oct" /></div><div className="activity-footer"><span className="status-online" /> Conexión local estable</div></aside></div>
      </section>
    </>
  );
}

function ActivityItem({ icon, title, text, time }: { icon: string; title: string; text: string; time: string }) {
  return <div className="activity-item"><div className={`activity-icon activity-${icon}`}>{icon === "signal" ? <Play size={12} fill="currentColor" /> : icon === "check" ? <Check size={13} /> : icon === "offer" ? <Tag size={12} /> : <Download size={12} />}</div><div><strong>{title}</strong><span>{text}</span></div><time>{time}</time></div>;
}

function StoreView({ games: filteredGames, query, onOpen, onAction }: { games: Game[]; query: string; onOpen: (game: Game) => void; onAction: (game: Game) => void }) {
  return <>
    <section className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" /> RADAR DE PRECIOS</div><h1>La tienda, <em>sin ruido.</em></h1><p>Compara el precio del mismo juego entre plataformas antes de saltar a comprar.</p></div><div className="demo-notice"><AlertTriangle size={16} /><span><strong>Modo demostración</strong> · precios orientativos, no transacciones reales</span></div></section>
    <div className="store-toolbar"><div className="store-summary"><strong>{filteredGames.length} juegos</strong><span>comparados en 4 tiendas</span></div><div className="sort-control"><span>Ordenar por</span><button onClick={() => toast("Orden aplicado: mejor ahorro")}>Mejor ahorro <ChevronDown size={14} /></button></div></div>
    <section className="store-list">{filteredGames.map(game => <article className="store-row" key={game.id} onClick={() => onOpen(game)}><div className="store-game-identity"><CoverArt game={game} /><div><PlatformBadge platform={game.platform} /><h3>{game.title}</h3><p>{game.genre} · {game.year} · {game.rating}</p></div></div><div className="store-prices">{game.comparison.map(row => <div className="store-price" key={row.store}><span>{row.store.replace(" / Microsoft", "")}</span><strong>{money(row.price)}</strong>{row.price === Math.min(...game.comparison.map(price => price.price)) && <small>MEJOR</small>}</div>)}</div><div className="store-savings"><span>AHORRA HASTA</span><strong>{money(Math.max(...game.comparison.map(row => row.price)) - Math.min(...game.comparison.map(row => row.price)))}</strong><button onClick={(event) => { event.stopPropagation(); onAction(game); }}>Ver oferta <ExternalLink size={14} /></button></div></article>)}{!filteredGames.length && <div className="empty-state"><Search size={22} /><h3>{query ? "Sin resultados en el radar" : "No hay juegos para comparar"}</h3><p>Prueba otra búsqueda.</p></div>}</section>
    <div className="store-footnote"><ShieldCheck size={15} /> Los enlaces de compra reales se abrirán en la tienda oficial correspondiente. Eneba se muestra como marketplace separado.</div>
  </>;
}

function OffersView({ onOpen, onAlert }: { onOpen: (game: Game) => void; onAlert: (game: Game) => void }) {
  return <>
    <section className="page-intro offers-intro"><div><div className="eyebrow"><span className="eyebrow-line" /> CAZA LA PRÓXIMA OFERTA</div><h1>Ofertas que <em>sí importan.</em></h1><p>Seguimiento de precios en una sola señal. Marca un objetivo y deja que Dead Pixels vigile el descenso.</p></div><div className="offers-counter"><span className="counter-number">08</span><span>señales activas<br />esta semana</span></div></section>
    <section className="offers-layout"><div className="offers-main"><div className="section-heading"><div><span className="panel-kicker">DESCENSOS DESTACADOS</span><h2>La señal baja</h2></div><button className="filter-toggle" onClick={() => toast("Mostrando todas las ofertas demo")}>Ver todas <ArrowUpRight size={15} /></button></div><div className="offers-grid">{offerGames.map(game => <article className="offer-card" key={game.id} onClick={() => onOpen(game)}><div className="offer-cover"><CoverArt game={game} /><span className="offer-discount">-{game.discount}%</span></div><div className="offer-content"><div className="offer-topline"><PlatformBadge platform={game.platform} /><span>{game.comparison.find(row => row.price === Math.min(...game.comparison.map(item => item.price)))?.store} · mínimo</span></div><h3>{game.title}</h3><div className="offer-price"><strong>{money(Math.min(...game.comparison.map(row => row.price)))}</strong><del>{money(game.originalPrice)}</del></div><button onClick={(event) => { event.stopPropagation(); onAlert(game); }}><Bell size={14} /> Activar alerta</button></div></article>)}</div></div><aside className="alert-panel"><div className="alert-panel-head"><div className="alert-icon"><Bell size={17} /></div><div><span className="panel-kicker">MONITOR DE PRECIOS</span><h3>Tus alertas</h3></div></div><div className="alert-visual"><div className="radar-ring ring-one" /><div className="radar-ring ring-two" /><div className="radar-sweep" /><div className="radar-center"><Radio size={18} /></div></div><div className="alert-count"><strong>03</strong><span>alertas activas</span></div><div className="alert-list"><div><span className="alert-game-dot" /><span>Signal Drift</span><strong>$18.00</strong></div><div><span className="alert-game-dot purple" /><span>Dead Frequency</span><strong>$6.00</strong></div><div><span className="alert-game-dot yellow" /><span>Pixel Wasteland</span><strong>$20.00</strong></div></div><button className="outline-button" onClick={() => onAlert(offerGames[0])}>+ Nueva alerta de precio</button><p className="alert-disclaimer">Las alertas de esta versión son locales y demostrativas.</p></aside></section>
  </>;
}

function GameDrawer({ game, onClose, onAction, onAlert }: { game: Game; onClose: () => void; onAction: (game: Game) => void; onAlert: () => void }) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="game-drawer" onClick={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button><CoverArt game={game} large /><div className="drawer-content"><div className="drawer-kicker"><PlatformBadge platform={game.platform} /><StateBadge state={game.state} /></div><h2>{game.title}</h2><p className="drawer-subtitle">{game.subtitle}</p><p className="drawer-description">{game.description}</p><div className="drawer-stats"><div><span>VALORACIÓN</span><strong>{game.rating}</strong></div><div><span>TAMAÑO</span><strong>{game.size}</strong></div><div><span>AÑO</span><strong>{game.year}</strong></div></div><div className="drawer-actions"><button className="primary-button" onClick={() => onAction(game)}>{game.state === "not-installed" ? <><Download size={16} /> Instalar vía {game.platform === "Xbox / Microsoft" ? "Xbox" : game.platform.split(" ")[0]}</> : <><Play size={16} fill="currentColor" /> {game.state === "running" ? "Volver al juego" : "Jugar ahora"}</>}</button><button className="ghost-button" onClick={onAlert}><Bell size={15} /> Alertarme</button></div><ComparisonTable game={game} /><div className="drawer-note"><ShieldCheck size={14} /> Las acciones reales se delegan al cliente oficial. Sin contraseñas almacenadas.</div></div></aside></div>;
}

function AlertDialog({ game, price, setPrice, onClose, onSave }: { game: Game; price: string; setPrice: (value: string) => void; onClose: () => void; onSave: () => void }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="alert-dialog" onClick={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose} aria-label="Cerrar"><X size={18} /></button><div className="alert-dialog-icon"><Bell size={20} /></div><span className="panel-kicker">NUEVA ALERTA</span><h2>Vigilar {game.title}</h2><p>Te avisaremos cuando el mejor precio baje de tu objetivo.</p><label>Precio objetivo<input value={price} onChange={(event) => setPrice(event.target.value)} type="number" min="0" step="0.01" /><span>USD</span></label><div className="alert-dialog-preview"><span>Mejor precio actual</span><strong>{money(Math.min(...game.comparison.map(row => row.price)))}</strong></div><button className="primary-button full-width" onClick={onSave}><Bell size={15} /> Activar alerta local</button><small>Demo local · no requiere iniciar sesión</small></div></div>;
}

export default App;
