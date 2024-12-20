import React from "react";

function Card({ title, onEncode, onDecode }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <button onClick={onEncode} className="button">Encode</button>
      <button onClick={onDecode} className="button">Decode</button>
    </div>
  );
}

export default Card;
