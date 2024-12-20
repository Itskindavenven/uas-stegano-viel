import React from "react";

function FileUpload({ onFileSelect }) {
  return (
    <div className="file-upload">
      <label>
        Upload File:
        <input type="file" onChange={(e) => onFileSelect(e.target.files[0])} />
      </label>
    </div>
  );
}

export default FileUpload;
