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
      <h1 className="title">UAS CYBERSECUIRTY</h1>
      <div className="names">
        <p>Michelle Gravielle Benedicta Roring</p>
        <p>Hibban Muhammad</p>
      </div>
      <div className="card-container">
        {["image", "audio", "video"].map((type) => (
          <Card
            key={type}
            title={`Steganography ${type.toUpperCase()}`}
            onEncode={() => handleAction(type, "encode")}
            onDecode={() => handleAction(type, "decode")}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
