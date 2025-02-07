import React from "react";
import ImportantInstructionsImage from "../../../assets/Important_Instructions_Banner.png";
import "./ImportantInstructions.scss";
function ImportantInstructions() {
    return (
        <div className="ContainerPnlInstructions">
          <img src={ImportantInstructionsImage} />
        </div>
      );
};

export default ImportantInstructions;