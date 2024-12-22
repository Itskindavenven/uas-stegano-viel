import React from 'react';
import { FaMusic, FaImage, FaVideo } from 'react-icons/fa';
import './Card.css';

function Card({ title, icon, onAction }) {
  return (
    <div className="card">
      <div className="icon-container">
        {icon === 'audio' && <FaMusic size={48} />}
        {icon === 'image' && <FaImage size={48} />}
        {icon === 'video' && <FaVideo size={48} />}
      </div>
      <h3 className="card-title">{title}</h3>
      <div className="button-container">
        <button onClick={() => onAction(icon, 'encode')} className="button encode-btn">Encode</button>
        <button onClick={() => onAction(icon, 'decode')} className="button decode-btn">Decode</button>
      </div>
    </div>
  );
}

export default Card;
