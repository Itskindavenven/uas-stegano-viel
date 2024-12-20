import React, { useState } from "react";
import FileUpload from "../components/FileUpload";

function Enhance() {
  const [file, setFile] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);

  const enhanceImage = async (imageFile) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const image = new Image();

    return new Promise((resolve, reject) => {
      image.onload = () => {
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const imageData = ctx.getImageData(0, 0, image.width, image.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          // R Channel
          data[i] = Math.min(255, data[i] * 1.2); // Brighten Red Channel
          // G Channel
          data[i + 1] = Math.min(255, data[i + 1] * 1.2); // Brighten Green Channel
          // B Channel
          data[i + 2] = Math.min(255, data[i + 2] * 1.2); // Brighten Blue Channel
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };

      image.onerror = reject;
      image.src = URL.createObjectURL(imageFile);
    });
  };

  const handleEnhance = async () => {
    if (!file) {
      alert("Please upload a file to enhance!");
      return;
    }
    const enhanced = await enhanceImage(file);
    setEnhancedImage(enhanced);
  };

  return (
    <div className="page">
      <h1>Enhance Image</h1>
      <FileUpload onFileSelect={(file) => setFile(file)} />
      <button onClick={handleEnhance} className="button">
        Enhance
      </button>
      {enhancedImage && (
        <div>
          <h3>Enhanced Image:</h3>
          <img src={enhancedImage} alt="Enhanced" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default Enhance;
