import { React,useEffect } from "react";
import success from "Framework/Assets/Images/success.png";
import callDisconnected from "Framework/Assets/Images/Call-Disconnected.png";
import { Button } from "Framework/Components/Widgets";
import { getSessionStorage } from "../Login/Auth/auth";
import "./ServiceSuccess.scss";

function ServiceSuccess({getSupportTicketNo,setServiceSuccessState}) {
  const servicesuccessData = getSessionStorage("servicesuccess");

  const CreateMoreBtnOnClick = () => {
    debugger;
    setServiceSuccessState("UNSUCCESS");
  };
  useEffect(() => {
   console.log("a");
  }, [setServiceSuccessState]);

  return (
    <div className="ServiceSuccessPage__Div">
      <div className="ServiceSuccessPage__ContentBox">
      {servicesuccessData && servicesuccessData === "TC" ?
        <h2>Success!</h2> : <h2>Unfortunately!</h2> }
        <p>
        {servicesuccessData && servicesuccessData === "TC"
            ? `Thanks, a ticket has been generated"
              with Ticket No. ${getSupportTicketNo}`
            : servicesuccessData === "CD"
             ? "Call is disconnected"
             :""
            }
        </p>
        {servicesuccessData && servicesuccessData === "TC" ? <>
        <p>if you want to Create more ticket then Click on Create More Button <Button onClick={() => CreateMoreBtnOnClick()}>Create More</Button> </p>
        <p>Otherwise Please Close The Tab, Please Ask for the feedback to the farmer</p></> : <><p>Please Close The Tab</p></> }
      </div>
      {servicesuccessData && servicesuccessData === "TC" ?
      <img src={success} alt="Success" /> : <img src={callDisconnected} alt="Call-Disconnected" />  }
      
      
    </div>
  );
}
export default ServiceSuccess;
