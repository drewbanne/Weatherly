// src/components/TopBar.tsx
import React, { useRef, useState } from "react";

type TopBarProps = {
  isDark: boolean;
  onToggleTheme: () => void;
};

export default function TopBar({ isDark, onToggleTheme }: TopBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [greeting, setGreeting] = useState("Hi, Drew! Good Morning");

  const handleSearch = () => {
    const q = inputRef.current?.value?.trim();
    if (q) {
      alert(`Searching weather for: ${q}`);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="top-container">
      <div className="top-left">
        <div
          className="greeting"
          contentEditable
          suppressContentEditableWarning
          onInput={(e) => setGreeting((e.target as HTMLElement).innerText)}
        >
          {greeting}
        </div>
        <div className="location-btn" id="locationBtn" onClick={() => alert("Search weather for Accra, Ghana")}>
          <img src="https://img.icons8.com/ios-filled/50/000000/marker.png" alt="location" />
          <span>Accra, Ghana</span>
        </div>
      </div>

      <div className="top-right">
        <div className="search-container">
          <input ref={inputRef} type="text" placeholder="Search your location" id="searchInput" />
          <button id="searchBtn" onClick={handleSearch}>Send</button>
        </div>

        <div className="toggle-btn" id="toggleBtn" onClick={onToggleTheme}>
          <div className="toggle-circle" id="toggleCircle" style={{ left: isDark ? 26 : 1 }} />
        </div>

        <div className="user-pic-container">
          <div
            className="user-pic"
            id="userPic"
            onClick={() => fileRef.current?.click()}
            style={{
              backgroundImage: avatarUrl ? `url(${avatarUrl})` : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            {!avatarUrl && <span>Click to add</span>}
          </div>
          <input
            ref={fileRef}
            type="file"
            id="uploadPic"
            style={{ display: "none" }}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setAvatarUrl(URL.createObjectURL(file));
            }}
          />
        </div>
      </div>
    </div>
  );
}
