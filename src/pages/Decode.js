import React, { useState } from "react";
import { FaPlay, FaArrowDown, FaFileAlt, FaCheck } from "react-icons/fa";
import FileUpload from "../components/FileUpload";
import "./Decode.css";

function Decode() {
  const [file, setFile] = useState(null);
  const [decodedText, setDecodedText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const decodeTextFromImage = async (imageFile) => {
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

        let binaryText = "";
        for (let i = 0; i < data.length; i++) {
          binaryText += (data[i] & 1).toString();
        }

        const chars = binaryText.match(/.{8}/g).map((byte) => {
          return String.fromCharCode(parseInt(byte, 2));
        });

        const text = chars.join("").split("\0")[0];
        resolve(text);
      };

      image.onerror = reject;
      image.src = URL.createObjectURL(imageFile);
    });
  };

  const handleDecode = async () => {
    if (!file) {
      alert("Please upload a file to decode!");
      return;
    }

    setCurrentStep(1);

    setTimeout(() => {
      setCurrentStep(2);
    }, 1000);

    setTimeout(() => {
      setCurrentStep(3);
    }, 2000);

    setTimeout(async () => {
      const decoded = await decodeTextFromImage(file);
      setDecodedText(decoded);
      setCurrentStep(4);
    }, 3000);
  };

  return (
    <div className="page">
      <h1>Decode Text from Image</h1>
      <FileUpload onFileSelect={(file) => setFile(file)} />

      <div className="visualization">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
          <FaPlay size={40} color="#4CAF50" />
          <p>Start</p>
        </div>

        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
          <FaArrowDown size={40} color="#FF9800" />
          <p>Extract LSB</p>
        </div>

        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
          <FaFileAlt size={40} color="#2196F3" />
          <p>Convert Binary to Text</p>
        </div>

        <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
          <FaCheck size={40} color="#4CAF50" />
          <p>Display Decoded Text</p>
        </div>
      </div>

      <button onClick={handleDecode}>Decode</button>

      {decodedText && (
        <div>
          <h3>Decoded Text:</h3>
          <textarea value={decodedText} readOnly className="textarea" />
        </div>
      )}
    </div>
  );
}

export default Decode;
