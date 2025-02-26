import React from "react";
import ImportantInstructionsImage from "../../../assets/Important_Instructions_Banner.jpeg";
import "./ImportantInstructions.scss";
function ImportantInstructions() {
    return (
        <div className="ContainerPnlInstructions">
          <img src={ImportantInstructionsImage} style={{width:"954px", height:"610px"}} />
        </div>
      );
};

export default ImportantInstructions;