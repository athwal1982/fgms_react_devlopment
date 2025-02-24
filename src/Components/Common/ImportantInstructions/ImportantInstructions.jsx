import React from "react";
import ImportantInstructionsImage from "../../../assets/Important_Instructions_Banner.jpeg";
import "./ImportantInstructions.scss";
function ImportantInstructions() {
    return (
        <div className="ContainerPnlInstructions">
          <a href="https://drive.google.com/file/d/1u6Ro8SrGrUw4FtHt_h3pUn_1chWuuPDd/view?usp=sharing" target="_blank" style={{cursor : "pointer"}}>
          <img src={ImportantInstructionsImage} style={{width:"954px", height:"610px"}} />
          </a>
        </div>
      );
};

export default ImportantInstructions;