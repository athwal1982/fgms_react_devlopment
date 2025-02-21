import { useState, useEffect } from "react";
import { sha256 } from "crypto-hash";
import bcrypt from "bcryptjs";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useNavigate } from "react-router-dom";
import { setSessionStorage, encryptStringData, decryptStringData } from "../Auth/auth";
import { authenticate, authenticateDiffUsersLogin, authenticateIntial, authenticateUserIDForCallingSolution } from "../Services/Methods";

function AddLoginLogics() {
  const setAlertMessage = AlertMessage();
  const pathUrl = window.location.href;
  const [showHideLogin, setShowHideLogin] = useState(false);
  const [isLoadingPage, setIsLoadingPage] = useState(false);

  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    txtLoginId: "",
    txtPassword: "",
    txtCaptchaVal: "",
  });

  const [formValuesNcip, setformValuesNcip] = useState({
    txtmobileno: "",
    txtPasswordNcip: "",
    txtCaptchaValNcip: "",
  });

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const [captchaCode, setCaptchaCode] = useState("");
  const createCaptcha = () => {
    debugger;
    // A clear the contents of captcha div first
    document.getElementById("captcha").innerHTML = "";
    const charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    const lengthOtp = 6;
    const captcha = [];
    for (let i = 0; i < lengthOtp; i += 1) {
      // A below code will not allow Repetition of Characters
      const index = Math.floor(Math.random() * charsArray.length + 1); // A get the next character from the array
      if (captcha.indexOf(charsArray[index]) === -1) captcha.push(charsArray[index]);
      else i -= 1;
    }
    const canv = document.createElement("canvas");
    canv.id = "captcha";
    canv.width = 140;
    canv.height = 38;
    const ctx = canv.getContext("2d");
    ctx.font = "20px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    // A storing captcha so that can validate you can save it somewhere else according to your specific requirements
    const code = captcha.join("");
    setCaptchaCode(code);
    document.getElementById("captcha").appendChild(canv); // A adds the canvas to the body element
  };

  const updateStateNcip = (name, value) => {
    setformValuesNcip({ ...formValuesNcip, [name]: value });
  };

  const [captchaCodeNcip, setCaptchaCodeNcip] = useState("");
  const createCaptchaNcip = () => {
    debugger;
    // A clear the contents of captcha div first
    document.getElementById("captchaNcip").innerHTML = "";
    const charsArray = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ@!#$%^&*";
    const lengthOtp = 6;
    const captcha = [];
    for (let i = 0; i < lengthOtp; i += 1) {
      // A below code will not allow Repetition of Characters
      const index = Math.floor(Math.random() * charsArray.length + 1); // A get the next character from the array
      if (captcha.indexOf(charsArray[index]) === -1) captcha.push(charsArray[index]);
      else i -= 1;
    }
    const canv = document.createElement("canvas");
    canv.id = "captchaNcip";
    canv.width = 140;
    canv.height = 38;
    const ctx = canv.getContext("2d");
    ctx.font = "20px Georgia";
    ctx.strokeText(captcha.join(""), 0, 30);
    // A storing captcha so that can validate you can save it somewhere else according to your specific requirements
    const code = captcha.join("");
    setCaptchaCodeNcip(code);
    document.getElementById("captchaNcip").appendChild(canv); // A adds the canvas to the body element
  };

  const [btnLoaderActive, setBtnLoaderActive] = useState(false);
  const handleLogin = async (captchaCode) => {
    debugger;
    try {
      if (formValues.txtLoginId === "") {
        setAlertMessage({
          type: "error",
          message: "User Name is required!",
        });
        return;
      }
      if (formValues.txtPassword === "") {
        setAlertMessage({
          type: "error",
          message: "Password is required!",
        });
        return;
      }
      if (formValues.txtCaptchaVal !== captchaCode) {
        setAlertMessage({
          type: "error",
          message: "Captcha did not match...",
        });
        return;
      }
      // A const encryptUserName = encryptStringData(formValues.txtLoginId ? formValues.txtLoginId : "");
      // A const hashPass = await sha256(formValues.txtPassword ? formValues.txtPassword : "");
      // A setBtnLoaderActive(true);
      // A const result = await authenticate(encryptUserName, hashPass);
      // A setBtnLoaderActive(false);
      // A if (result.responseCode === 1) {
      // A  if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
      // A    createCaptcha();
      // A    setAlertMessage({
      // A      type: "error",
      // A      message: "Token is missing in the response",
      // A    });
      // A    return;
      // A  }
      // A  const user = {
      // A    ...result.responseData,
      // A  };
      // A  setSessionStorage("user", user);
      // A  navigate("/home");
      // A } else {
      // A  createCaptcha();
      // A  setAlertMessage({
      // A    type: "error",
      // A    message: result.responseMessage,
      // A  });
      // A  setBtnLoaderActive(false);
      // A }

      const encryptUserName = encryptStringData(formValues.txtLoginId ? formValues.txtLoginId : "");
      const hashPass = await sha256(formValues.txtPassword ? formValues.txtPassword : "");
      setBtnLoaderActive(true);
      const resultSaltVal = await authenticateIntial(encryptUserName);
      if (resultSaltVal.responseCode === 1) {
        const salValue = resultSaltVal.responseData;
        const conctSaltAndHashPass = `${hashPass}_${salValue}`;
        const salt = await bcrypt.genSalt(10);
        const bcryptSaltSaltAndHashPass = await bcrypt.hash(conctSaltAndHashPass, salt);
        const result = await authenticate(encryptUserName, bcryptSaltSaltAndHashPass);
        setBtnLoaderActive(false);
        if (result.responseCode === 1) {
          if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
            createCaptcha();
            setAlertMessage({
              type: "error",
              message: "Token is missing in the response",
            });
            return;
          }
          const user = {
            ...result.responseData,
          };
          setSessionStorage("user", user);
          console.log(user);
          navigate("/welcome");
        } else {
          createCaptcha();
          setAlertMessage({
            type: "error",
            message: result.responseMessage,
          });
        }
      } else {
        setBtnLoaderActive(false);
        createCaptcha();
        setAlertMessage({
          type: "error",
          message: resultSaltVal.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setBtnLoaderActive(false);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [btnLoaderActiveNcip, setBtnLoaderActiveNcip] = useState(false);
  const handleLoginNcip = async (captchaCodeNcip) => {
    debugger;
    try {
      if (formValuesNcip.txtmobileno === "") {
        setAlertMessage({
          type: "error",
          message: "Mobile Number is required!",
        });
        return;
      }
      if (formValuesNcip.txtmobileno.length < 10) {
        setAlertMessage({
          type: "error",
          message: "Please enter 10 digit Mobile Number!",
        });
        return;
      }
      if (formValuesNcip.txtPasswordNcip === "") {
        setAlertMessage({
          type: "error",
          message: "Password is required!",
        });
        return;
      }
      if (formValuesNcip.txtCaptchaValNcip === "") {
        setAlertMessage({
          type: "error",
          message: "Captcha is required!",
        });
        return;
      }
      if (formValuesNcip.txtCaptchaValNcip !== captchaCodeNcip) {
        setAlertMessage({
          type: "error",
          message: "Captcha did not match...",
        });
        return;
      }
      const userName = formValuesNcip.txtmobileno ? formValuesNcip.txtmobileno : "";
      const encryptPassword = encryptStringData(formValuesNcip.txtPasswordNcip ? formValuesNcip.txtPasswordNcip : "");
      setBtnLoaderActiveNcip(true);
      const result = await authenticateDiffUsersLogin(userName, encryptPassword);
      setBtnLoaderActiveNcip(false);
      console.log(result, "result");
      if (result.responseCode === 1) {
        if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
          createCaptchaNcip();
          setAlertMessage({
            type: "error",
            message: "Token is missing in the response",
          });
          return;
        }
        const user = {
          ...result.responseData,
        };
        setSessionStorage("user", user);
        navigate("/welcome");
      } else {
        createCaptchaNcip();
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const SearchByHandleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };
  const SearchByHandleKeyDownNclip = (e) => {
    if (e.key === "Enter") {
      handleLoginNcip();
    }
  };

  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
    if (tabIndex === 0) {
      setFormValues({
        ...formValues,
        txtLoginId: "",
        txtPassword: "",
        txtCaptchaVal: "",
      });
      setTimeout(() => {
        createCaptcha();
      }, 500);
    } else {
      setformValuesNcip({
        ...formValuesNcip,
        txtmobileno: "",
        txtPasswordNcip: "",
        txtCaptchaValNcip: "",
      });
      setTimeout(() => {
        createCaptchaNcip();
      }, 500);
    }
  };

  const callKrphAllActivityPage = async () => {
    debugger;
    try {
      const urlSearchParams = new URLSearchParams(window.location.search);
      const params = Object.fromEntries(urlSearchParams.entries());
      // A console.log(encryptStringData(params && params.userName ? params.userName : "uN"));
      // A console.log(encryptStringData(params && params.userID ? params.userID : "uID"));
       console.log(encryptStringData(params && params.mobileNumber ? params.mobileNumber : "uMO"));
      // A console.log(encryptStringData(params && params.uniqueID ? params.uniqueID : "UNQEID"));
     
      // A const encptUN = decryptStringData(params && params.userName ? params.userName : "uN");
      const encptUID = decryptStringData(params && params.userID ? params.userID : "uID");
      const encptUMBLENO = decryptStringData(params && params.mobileNumber ? params.mobileNumber : "uMO");
      // A const encptUNQEID = decryptStringData(params && params.uniqueID ? params.uniqueID : "UNQEID");
      setIsLoadingPage(true);
      const result = await authenticateUserIDForCallingSolution(encptUMBLENO, encptUID);
      setIsLoadingPage(false);
      // A const user = {
      // A  AppAccessTypeID: 472,
      // A  AppAccessUID: "CCE_Admin",
      // A  BRHeadTypeID: 124001,
      // A  CompanyName: "CSC",
      // A  LoginID: 3,
      // A  SessionID: 1758,
      // A  rcode: 1,
      // A  rmessage: "SUCCESS",
      // A  token: {
      // A    Token:
      // A      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmVzSW4iOiIyMDI0LTExLTIwVDE5OjA5OjM5Ljk5M1oiLCJpYXQiOjE3MzIwOTM3NzkuOTkzLCJpZCI6MywidXNlcm5hbWUiOiJDQ0VfQWRtaW4ifQ.GIGeIZlbNwHm6W1xoWRwTKaC8p0aI3bDqjDQbsqNcgQ",
      // A    expirationTime: 1732095653.586,
      // A    validFrom: "2024-11-26T10:40:53.587Z",
      // A    validTo: "2024-11-26T22:40:53.586Z",
      // A  },
      // A};
      // AsetSessionStorage("user", user);
      // A navigate("/KrphAllActivities");
      if (result.responseCode === 1) {
        if (!(result.responseData.token && result.responseData.token.Token && result.responseData.token.expirationTime)) {
          setAlertMessage({
            type: "error",
            message: "Token is missing in the response",
          });
          return;
        }
        const user = {
          ...result.responseData,
        };
        setSessionStorage("user", user);
        navigate("/KrphAllActivities");
        // A navigate("/KrphAllActivitiesND"); 
      } else if (result.responseCode === 0) {
        setAlertMessage({
          type: "error",
          message: "User Name does not exist.",
        });
        setIsLoadingPage(false);
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
        setIsLoadingPage(false);
      }
    } catch (error) {
      console.log(error);
      setIsLoadingPage(false);
    }
  };

  useEffect(() => {
    if (pathUrl.indexOf("uniqueID") !== -1 && pathUrl.indexOf("userID") !== -1 && pathUrl.indexOf("mobileNumber") !== -1) {
      setShowHideLogin(false);
      callKrphAllActivityPage();
    } else {
      setShowHideLogin(true);
      setTimeout(() => {
        createCaptcha();
      }, 500);
    }
    // A createCaptcha();
  }, []);

  return {
    formValues,
    updateState,
    handleLogin,
    SearchByHandleKeyDown,
    formValuesNcip,
    updateStateNcip,
    handleLoginNcip,
    SearchByHandleKeyDownNclip,
    captchaCode,
    createCaptcha,
    captchaCodeNcip,
    createCaptchaNcip,
    activeTab,
    handleTabClick,
    btnLoaderActive,
    btnLoaderActiveNcip,
    showHideLogin,
    isLoadingPage,
  };
}

export default AddLoginLogics;
