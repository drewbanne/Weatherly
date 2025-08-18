// src/App.tsx
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HistoryList from "./components/HistoryList";

function App() {
  return (
    <main style={{ maxWidth: 1100, margin: "40px auto", padding: "0 16px", display: "grid", gap: 24 }}>
      {/* Top Bar */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 16,
        borderRadius: 16,
        background: "linear-gradient(135deg,#1E90FF,#00BFFF)",
        color: "#fff"
      }}>
        <h1 style={{ fontSize: 24, fontWeight: 800 }}>Weatherly</h1>
        <SearchBar />
      </header>

      {/* Main Grid */}
      <section style={{
        display: "grid",
        gridTemplateColumns: "1fr 0.7fr",
        gap: 24
      }}>
        <CurrentWeather />
        <HistoryList />
      </section>
    </main>
  );
}

export default App;
