import React, { useState, useEffect } from "react";
import { FaPlay, FaArrowDown, FaFileAlt, FaCheck } from "react-icons/fa";
import FileUpload from "../components/FileUpload";
import "./Decode.css";

function Decode() {
  const [file, setFile] = useState(null);
  const [decodedText, setDecodedText] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [fileType, setFileType] = useState(""); 

  useEffect(() => {
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (["jpg", "png"].includes(fileExtension)) {
        setFileType("Image");
      } else if (["mp3"].includes(fileExtension)) {
        setFileType("Audio");
      } else if (["mp4"].includes(fileExtension)) {
        setFileType("Video");
      } else {
        setFileType(""); 
      }
    }
  }, [file]);

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
        const chars = binaryText.match(/.{8}/g)?.map((byte) => {
          return String.fromCharCode(parseInt(byte, 2));
        });
  
        if (chars) {
          const text = chars.join("").split("\0")[0];
  
          resolve(text);
        } else {
          reject("No readable text found in the image.");
        }
      };
  
      image.onerror = reject;
      image.src = URL.createObjectURL(imageFile);
    });
  };
  
  
  const processImage = async (file) => {
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
  

  const decodeTextFromAudio = (audioFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const audioData = new Uint8Array(reader.result);
        let binaryText = "";

        for (let i = 0; i < audioData.length; i++) {
          binaryText += (audioData[i] & 1).toString();
        }

        const chars = binaryText.match(/.{8}/g).map((byte) => {
          return String.fromCharCode(parseInt(byte, 2));
        });

        const text = chars.join("").split("\0")[0];
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(audioFile);
    });
  };

  const decodeTextFromVideo = (videoFile) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const videoData = new Uint8Array(reader.result);
        
        let textStartIndex = videoData.lastIndexOf(0); 
        if (textStartIndex === -1) {
          reject("No encoded text found in the video.");
          return;
        }

        const textBytes = videoData.slice(textStartIndex + 1); 
        const text = new TextDecoder().decode(textBytes);
        resolve(text);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(videoFile);
    });
  };

  const handleDecode = async () => {
    if (!file) {
      alert("Please upload a file to decode!");
      return;
    }
  
    const fileExtension = file.name.split(".").pop().toLowerCase();
    
    if (fileExtension === "png") {
      alert("PNG files are not supported for decoding. Please upload a different file.");
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
      let decoded;
      if (fileExtension === "jpg" || fileExtension === "png") {
        decoded = await decodeTextFromImage(file);
      } else if (fileExtension === "mp3") {
        decoded = await decodeTextFromAudio(file);
      } else if (fileExtension === "mp4") {
        decoded = await decodeTextFromVideo(file);
      }
  
      setDecodedText(decoded || "No text decoded");
      setCurrentStep(4);
    }, 3000);
  };
  

  return (
    <div className="decode-page">
      <h1 className="page-title">
        {fileType ? `Decode ${fileType}` : "Decode Text from File"}
      </h1>

      <div className="main-container">
        <div className="card upload-card">
          <div className="upload-section">
            <FileUpload onFileSelect={(file) => setFile(file)} />
          </div>
          <div className="button-container">
            <button onClick={handleDecode}>Decode</button>
          </div>
        </div>

        <div className="card decoded-text-card">
          {decodedText && (
            <div className="decoded-text">
              <h3>Decoded Text:</h3>
              <textarea value={decodedText} readOnly className="textarea" />
            </div>
          )}
        </div>
      </div>

      <div className="steps-container">
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
    </div>
  );
}

export default Decode;
