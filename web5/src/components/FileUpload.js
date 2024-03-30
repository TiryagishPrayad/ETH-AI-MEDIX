import React, { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, account, provider, goBack }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No patient record Selected");
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `e4696d2af9d9f7606898`,
            pinata_secret_api_key: `666c60a51ba10059756aca22834d8b98ae655d8c05bd766d0d29e0b337f3f9a1`,
            "Content-Type": "multipart/form-data",
          },
        });

        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        contract.add(ImgHash);
        setUploadSuccess(true);
        alert("Successfully Image Uploaded");
        setFileName("No Patient Record  Selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload image to Pinata");
      }
    }

    alert("Successfully Image Uploaded");
    setFileName(" No Patient Record Selected");
    setFile(null);
    setUploadSuccess(true);
  };

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  }; return (
    <div className="file-upload-container">
      <form className="form" onSubmit={handleSubmit}>
      
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile} 
        />
        <br></br>
        <span className="selected-file" style={{ color: "black" }}>
  Selected File: {fileName}
</span>

        <div className="buttons-container">
          <button type="submit" className="upload-button" disabled={!file}>
            Upload Patient Record 
          </button>
          
        {uploadSuccess && (
          <div className="upload-success-message">
            <div>
           <p>Your records are successfully uploaded</p>
           </div>
          </div>
        )}
        </div>

      </form>
    </div>
  );
};

export default FileUpload;
