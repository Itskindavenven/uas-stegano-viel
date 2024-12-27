import React from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";

function Home() {
  const navigate = useNavigate();

  const handleAction = (type, action) => {
    navigate(`/${action}/${type}`); 
  };

  return (
    <div className="home">
      <br/>
      <br/>
      <h1 className="title">Steganography</h1>
      <p className="subtitle">Send your message securely by secretly hiding it!</p>
      <br/>
      <br/>
      <div className="card-container">
        <Card title="Text to Audio" icon="audio" onAction={handleAction} />
        <Card title="Text to Image" icon="image" onAction={handleAction} />
        <Card title="Text to Video" icon="video" onAction={handleAction} />
      </div>
      <br/>
      <h2>Michelle Gravielle Benedicta Roring (120510220060) & Hibban Muhammad (120510220052)</h2>
    </div>
  );
}

export default Home;
