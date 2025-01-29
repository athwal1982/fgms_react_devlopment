import React, { useState } from "react";
import { Box, Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { styled } from "@mui/material/styles";
import callinfo from "./../../../assets/img/call-info.png";
import usercheck from "../../../assets/img/user-check.png";
import farmerinfo from "../../../assets/img/farmer-info.png";
import farmericon from "../../../assets/img/farmer-icon.png";
import ticketicon from "../../../assets/img/ticket-info.png";

const steps = ["Caller Information", "Farmer Authentication", "Insuarance Details", "Farmer Ticket Summary", "Ticket Creation"];

// Custom StepConnector with dynamic styling
const CustomStepConnector = styled(StepConnector)(({ theme, active }) => ({
  [".MuiStepConnector-line"]: {
    borderColor: active ? "red" : theme.palette.divider,
    borderWidth: active ? 2 : 1,
  },
}));

function Formsteps({ setCurrentcomponent }) {
  const [activeStep, setActiveStep] = useState(0);
  const handleStepClick = (index) => {
    setActiveStep(index);
    setCurrentcomponent(index);
  };

  const icons = [
    <img src={callinfo} alt="Caller Info" className="step-icon" />,
    <img src={usercheck} alt="Caller Info" className="step-icon" />,
    <img src={farmerinfo} alt="Caller Info" className="step-icon" />,
    <img src={farmericon} alt="Caller Info" className="step-icon" />,
    <img src={ticketicon} alt="Caller Info" className="step-icon" />,
  ];

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div style={{ width: "100%", textAlign: "center", position: "relative" }}>
              <Stepper activeStep={activeStep} alternativeLabel nonLinear connector={<CustomStepConnector active={true} />}>
                {steps.map((label, index) => (
                  <Step key={label} className={activeStep === index ? "active" : ""} onClick={() => handleStepClick(index)}>
                    <StepLabel
                      icon={icons[index]}
                      sx={{
                        color: activeStep === index ? "blue" : "gray",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      {label}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Formsteps;
