import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

function Home() {
  const navigate = useNavigate();

  const handleAction = (type, action) => {
    navigate(`/${action}/${type}`);  // Pass the action and type correctly
  };

  return (
    <div className="home">
      <h1 className="title">Steganography</h1>
      <p className="subtitle">Sembunyikan pesanmu dengan aman!</p>
      <li>
        Michelle Gravielle Benedicta Roring
      </li>
      <li>
        Hibban Muhammad
      </li>

      <ul></ul>

      <div className="card-container">
        <Card title="Text to Audio" icon="audio" onAction={handleAction} />
        <Card title="Text to Image" icon="image" onAction={handleAction} />
        <Card title="Text to Video" icon="video" onAction={handleAction} />
      </div>
    </div>
  );
}

export default Home;
