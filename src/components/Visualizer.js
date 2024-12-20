import React from "react";

function Visualizer({ type }) {
  return (
    <div className="visualizer">
      <p>{type === "encode" ? "Encoding in progress..." : "Decoding in progress..."}</p>
      <div className="progress-bar">
        <div className="progress"></div>
      </div>
    </div>
  );
}

export default Visualizer;
