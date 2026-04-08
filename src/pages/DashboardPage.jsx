import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";

// Dummy show data
const SHOWS = [
  { id: 1, title: "Stranger Things", genre: "Sci-Fi · Horror", color: "#1a1a3e" },
  { id: 2, title: "The Crown",        genre: "Drama · History",  color: "#1a2e1a" },
  { id: 3, title: "Ozark",            genre: "Crime · Drama",    color: "#1e1e10" },
  { id: 4, title: "Narcos",           genre: "Crime · Thriller", color: "#2e1a10" },
  { id: 5, title: "Dark",             genre: "Sci-Fi · Mystery", color: "#10101e" },
  { id: 6, title: "Squid Game",       genre: "Action · Thriller",color: "#2e1020" },
];

function ShowCard({ show }) {
  return (
    <div className="show-card" style={{ "--card-bg": show.color }}>
      <div className="card-inner">
        <p className="show-title">{show.title}</p>
        <p className="show-genre">{show.genre}</p>
      </div>
      <button className="play-btn">▶</button>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const raw = sessionStorage.getItem("user");
  const user = raw ? JSON.parse(raw) : { name: "Guest" };

  function handleLogout() {
    sessionStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div className="dash-root">
      {/* Nav */}
      <nav className="dash-nav">
        <span className="brand">NETFLIX</span>
        <div className="nav-right">
          <span className="nav-name">Hi, {user.name} 👋</span>
          <button onClick={handleLogout} className="logout-btn">Sign Out</button>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">✦ Top Pick for You</div>
        <h1 className="hero-title">Stranger Things</h1>
        <p className="hero-desc">
          When a boy vanishes, a small town uncovers a mystery involving
          secret experiments, terrifying supernatural forces, and one
          strange little girl.
        </p>
        <div className="hero-actions">
          <button className="btn-play">▶  Play</button>
          <button className="btn-info">ⓘ  More Info</button>
        </div>
      </section>

      {/* Grid */}
      <section className="show-section">
        <h2 className="section-title">Continue Watching</h2>
        <div className="show-grid">
          {SHOWS.map((s) => <ShowCard key={s.id} show={s} />)}
        </div>
      </section>
    </div>
  );
}
