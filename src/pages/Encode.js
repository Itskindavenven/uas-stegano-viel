import React, { useState } from "react";
import { FaPlay, FaFileCode, FaImage, FaCode, FaVideo, FaMicrophone } from "react-icons/fa";
import FileUpload from "../components/FileUpload";
import "./Encode.css";

function Encode() {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState("");
  const [encodedData, setEncodedData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [encodedImage, setEncodedImage] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);

    if (selectedFile.type.startsWith("image")) {
      setFileType("Image");
    } else if (selectedFile.type.startsWith("audio")) {
      setFileType("Audio");
    } else if (selectedFile.type.startsWith("video")) {
      setFileType("Video");
    } else {
      setFileType("");
    }
  };

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
  
  

  const encodeTextToAudio = (audioFile, textToEncode) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const audioData = new Uint8Array(reader.result);
        let binaryText = "";

        for (let i = 0; i < textToEncode.length; i++) {
          binaryText += textToEncode.charCodeAt(i).toString(2).padStart(8, "0");
        }
        binaryText += "00000000"; 
        
        for (let i = 0; i < audioData.length; i++) {
          if (i < binaryText.length) {
            audioData[i] = (audioData[i] & 0xfe) | parseInt(binaryText[i], 2);
          }
        }

        const encodedAudioBlob = new Blob([audioData], { type: audioFile.type });
        const encodedAudioUrl = URL.createObjectURL(encodedAudioBlob);
        resolve(encodedAudioUrl);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(audioFile);
    });
  };

  const encodeTextToVideo = (videoFile, textToEncode) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const videoData = new Uint8Array(reader.result);
        
        const textBytes = new TextEncoder().encode(textToEncode + "\0"); 
  
        const combinedData = new Uint8Array(videoData.length + textBytes.length);
        combinedData.set(videoData); 
        combinedData.set(textBytes, videoData.length); 
  
        const encodedVideoBlob = new Blob([combinedData], { type: videoFile.type });
        const encodedVideoUrl = URL.createObjectURL(encodedVideoBlob);
        resolve(encodedVideoUrl);
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(videoFile);
    });
  };

  const downloadFile = (dataUrl, fileName) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleEncode = async () => {
    if (!file || !text) {
      alert("Please upload a file and enter text!");
      return;
    }

    const fileExtension = file.name.split(".").pop().toLowerCase();

    // if (fileExtension === "png") {
    //   alert("PNG format is not supported for encoding.");
    //   return;
    // }

    setCurrentStep(1);

    setTimeout(() => {
      setCurrentStep(2);
    }, 1000);

    setTimeout(() => {
      setCurrentStep(3);
    }, 2000);

    setTimeout(async () => {
      let encoded;
      const fileName = `encoded_${file.name}`;

      if (["jpg", "jpeg", "png"].includes(fileExtension)) {
        encoded = await encodeTextToImage(file, text);
        downloadFile(encoded, fileName);
      } else if (["mp3", "wav"].includes(fileExtension)) {
        encoded = await encodeTextToAudio(file, text);
        downloadFile(encoded, fileName);
      } else if (["mp4", "mkv", "avi"].includes(fileExtension)) {
        encoded = await encodeTextToVideo(file, text);
        downloadFile(encoded, fileName);
      } else {
        alert("Unsupported file type!");
      }

      setEncodedData(encoded);
      setCurrentStep(4);
    }, 3000);
  };

  return (
    <div className="page p-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        Encode {fileType ? `${fileType}` : "Text into File"}
      </h1>

      <div className="upload-section grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="upload-card bg-white p-6 shadow-lg rounded-md">
          <FileUpload onFileSelect={handleFileSelect} />
          
          {file && (
            <div className="file-preview mt-4">
              {file.type.startsWith("image") && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full max-h-60 object-contain"
                />
              )}
              {file.type.startsWith("audio") && (
                <audio src={URL.createObjectURL(file)} controls className="w-full mt-4" />
              )}
              {file.type.startsWith("video") && (
                <video src={URL.createObjectURL(file)} controls className="w-full mt-4" />
              )}
            </div>
          )}
        </div>

        <div className="input-section bg-white p-6 shadow-lg rounded-md">
          <h3 className="text-xl font-semibold mb-4">Enter Text to Encode</h3>
          <textarea
            placeholder="Enter text to encode"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-4 border rounded-md h-32 mb-4"
          />
          <div className="button-container flex justify-center">
            <button
              onClick={handleEncode}
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600"
            >
              Encode
            </button>
          </div>
        </div>
      </div>

      {/* Visualization Section */}
      <div className="visualization mt-6 grid grid-cols-4 gap-4">
        <div className={`step ${currentStep >= 1 ? "active" : ""} flex flex-col items-center`}>
          <FaPlay size={50} />
          <p>Start</p>
        </div>

        <div className={`step ${currentStep >= 2 ? "active" : ""} flex flex-col items-center`}>
          <FaFileCode size={50} />
          <p>Convert Text to Binary</p>
        </div>

        <div className={`step ${currentStep >= 3 ? "active" : ""} flex flex-col items-center`}>
          <FaCode size={50} />
          <p>Binary to LSB</p>
        </div>

        <div className={`step ${currentStep >= 4 ? "active" : ""} flex flex-col items-center`}>
          <FaImage size={50} />
          <p>Final Result</p>
        </div>
      </div>

      {/* Encoded Data Section */}
      {encodedData && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold">Encoded Result:</h3>
          {file && file.name.endsWith(".mp4") && (
            <video src={encodedData} controls className="w-full mt-4" />
          )}
          {file && file.name.endsWith(".mp3") && (
            <audio src={encodedData} controls className="w-full mt-4" />
          )}
          {file && (file.name.endsWith(".jpg") || file.name.endsWith(".png")) && (
            <img src={encodedData} alt="Encoded" className="w-full max-h-60 object-contain mt-4" />
          )}
        </div>
      )}
    </div>
  );
}

export default Encode;
