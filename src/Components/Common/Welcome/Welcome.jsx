import { React, useEffect } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { FaHeadphones } from "react-icons/fa";
import { getSessionStorage, setSessionStorage } from "../../Common/Login/Auth/auth";
import { ticketDataBindingData } from "./Service/Methods";
import "./Welcome.scss";

function Welcome() {
  const setAlertMessage = AlertMessage();
  const getticketDataBindingData = async () => {
    debugger;
    try {
      if (getSessionStorage("ticketDataBindingSsnStrg") === null) {
        const result = await ticketDataBindingData({});
        if (result.response.responseCode === 1) {
          if (result.response.responseData) {
            console.log(result.response.responseData);
            setSessionStorage("ticketDataBindingSsnStrg", result.response.responseData);
          } else {
            setSessionStorage("ticketDataBindingSsnStrg", null);
          }
        } else {
          setAlertMessage({
            type: "error",
            message: result.response.responseMessage,
          });
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };
  useEffect(() => {
    getticketDataBindingData();
  }, []);
  return (
    <div className="Welcome_Div">
      Welcome to KRISHI RAKSHAK PORTAL & HELPLINE <FaHeadphones /> 14447
      <img src={`${process.env.PUBLIC_URL}welcome.png`} alt="Welcome" />
    </div>
  );
}
export default Welcome;
