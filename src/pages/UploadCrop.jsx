import React, { useState } from "react";
import "../css/UploadCrop.css";

const UploadCrop = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState(localStorage.getItem("language" || "English"));
  const handleChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile)); 
    }
  };

  const analyzeCrop = async () => {
    if (!file) return alert("Please upload an image first!");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("language", language);

    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      const response = await fetch("https://farmhelpbackend.onrender.com/analyze-crop", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to fetch crop analysis");
      }

      const data = await response.json();
      setAnalysis(data.analysis || "No analysis received.");
    } catch (error) {
      console.error("Error:", error);
      setAnalysis("Error analyzing crop image.");
    } finally {
      setIsLoading(false); 
    }
  };
  const formatText = (text) => {
    const lines = text.split("\n");
    const formattedLines = [];
    let listItems = [];

    lines.forEach((line, index) => {
        line = line.replace(/^\*\s+/, "- ");
        line = line.replace(/:\*\s?/g, ":");
        if (/^\*\*\d+\.\s(.*?)\*\*/.test(line)) {
            if (listItems.length) {
                formattedLines.push(<ul key={`list-${index}`}>{listItems}</ul>);
                listItems = [];
            }
            formattedLines.push(<h2 key={index} className="blue">{line.replace(/\*\*(.*?)\*\*/g, "$1")}</h2>);
        } else if (/\* *(.*?)\*/.test(line)) {
            const formattedLine = line.replace(/\*\*(.*?)\*:?/g, (_, match) => `<b class='blue'>${match}</b>`);
            formattedLines.push(
                <p key={index} dangerouslySetInnerHTML={{ __html: formattedLine }} />
            );
        } 
        else if (/^[*]\s+/.test(line)) {
            listItems.push(<li key={index}>{line.replace(/^[*]\s */, ' ')}</li>);
        } else {
            if (listItems.length) {
                formattedLines.push(<ul key={`list-${index}`}>{listItems}</ul>);
                listItems = [];
            }
            formattedLines.push(<p key={index}>{line}</p>);
        }
    });
    if (listItems.length) {
        formattedLines.push(<ul key="last-list">{listItems}</ul>);
    }

    return formattedLines;
};
  
    

  return (
    <div className="uploadCrop-page">
    <div className="uploadCrop-box">
      <h1>Upload Crop Image (.JPEG/.JPG)</h1>
      <input type="file" className="input" onChange={handleChange} accept="image/jpeg, image/jpg" />
      
      {preview && <img src={preview} alt="Uploaded Crop" className="image" height={200} width={200} />}
      {file && 
      <div className="button-container">
        <button onClick={analyzeCrop} disabled={isLoading} className="button">
          {isLoading ? "Analyzing..." : "Analyze Crop"}
        </button>
        
      </div>
    }
    </div>
    <div>{analysis && formatText(analysis)}</div>
    </div>
  );
};

export default UploadCrop;
