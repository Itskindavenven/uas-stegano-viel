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
      <p className="subtitle">Send your message securely by secretly hiding it!</p>
      <h2>Michelle Gravielle Benedicta Roring (120510220060) & Hibban Muhammad (120510220052)</h2>
      <br/>
      <div className="card-container">
        <Card title="Text to Audio" icon="audio" onAction={handleAction} />
        <Card title="Text to Image" icon="image" onAction={handleAction} />
        <Card title="Text to Video" icon="video" onAction={handleAction} />
      </div>
    </div>
  );
}

export default Home;
