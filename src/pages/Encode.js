import React, { useState } from "react";
import { FaPlay, FaFileCode, FaImage, FaCode } from "react-icons/fa";
import FileUpload from "../components/FileUpload";
import "./Encode.css";

function Encode() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [encodedImage, setEncodedImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const encodeTextToImage = async (imageFile, textToEncode) => {
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

        const binaryText = textToEncode
          .split("")
          .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
          .join("") + "00000000";

        let textIndex = 0;
        for (let i = 0; i < data.length; i++) {
          if (textIndex < binaryText.length) {
            data[i] = (data[i] & 0xfe) | parseInt(binaryText[textIndex], 2);
            textIndex++;
          }
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL());
      };

      image.onerror = reject;
      image.src = URL.createObjectURL(imageFile);
    });
  };

  const handleEncode = async () => {
    if (!file || !text) {
      alert("Please upload a file and enter text!");
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
      const encoded = await encodeTextToImage(file, text);
      setEncodedImage(encoded);
      setCurrentStep(4);
    }, 3000);
  };

  return (
    <div className="page">
      <h1>Encode Text into Image</h1>
      <FileUpload onFileSelect={(file) => setFile(file)} />

      <div className="visualization">
        <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
          <FaPlay size={50} />
          <p>Start</p>
        </div>

        <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
          <FaFileCode size={50} />
          <p>Convert Text to Binary</p>
        </div>

        <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
          <FaCode size={50} />
          <p>Binary to LSB</p>
        </div>

        <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
          <FaImage size={50} />
          <p>Final Image</p>
        </div>
      </div>

      <textarea
        placeholder="Enter text to encode"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="textarea"
      />
      <div className="button-container">
        <button onClick={handleEncode}>Encode</button>
      </div>

      {encodedImage && (
        <div>
          <h3>Encoded Image:</h3>
          <img src={encodedImage} alt="Encoded" style={{ maxWidth: "100%" }} />
        </div>
      )}
    </div>
  );
}

export default Encode;
