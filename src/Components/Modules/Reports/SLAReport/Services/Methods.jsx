import axios from "axios";
import APIVariables from "./OuterApiVariables";
import { setSessionStorage, getSessionStorage } from "Components/Common/Login/Auth/auth";

const API_ENDPOINT = "https://fgms.smartping.io/api/sla_call_report";
const LOGIN_API_URL = "https://fgms.smartping.io/api/login";

export const login = async (username, password) => {
  debugger;
  try {
    const response = await axios.post(
      LOGIN_API_URL,
      { user: username, pass: password },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    if (response.status === 200) {
      if (response.data) {
        return { responseCode: 1, responseData: response.data.access_token, responseMessage: response.status };
      }
      return { responseCode: 0, responseData: null, responseMessage: response.status };
    }
    return { responseCode: 0, responseData: null, responseMessage: response.status };
  } catch (error) {
    return {
      responseCode: 0,
      responseData: null,
      responseMessage: error.message,
    };
  }
  // A try {
  // A  const response = await axios.post(
  // A    LOGIN_API_URL,
  // A    { user: username, pass: password },
  // A    {
  // A      headers: {
  // A        "Content-Type": "application/json",
  // A        Accept: "application/json",
  // A      },
  // A    },
  // A  );
  // A  if (response.data && response.data.access_token) {
  // A    return response.data.access_token;
  // A  } else {
  // A    console.error("Token not found in the response");
  // A    throw new Error("Token not found in the response");
  // A  }
  // A} catch (error) {
  // A  console.error("Error during API call", error);
  // A  throw error;
  // A}
};

export const fetchSLAReport = async (startDate, endDate, report_type) => {
  debugger;
  try {
    const username = APIVariables.user;
    const password = APIVariables.pass;
    let result = "";
    if (getSessionStorage("SLAReport") === null) {
      result = await login(username, password);
      const validTillToken = new Date();
      validTillToken.setMinutes(validTillToken.getMinutes() + 60);
      setSessionStorage("SLAReport", { resultToken: result.responseData, validTillToken: validTillToken });
    } else {
      const resultSLAReport = getSessionStorage("SLAReport");
      if (resultSLAReport.validTillToken) {
        const date = new Date(resultSLAReport.validTillToken);
        const now = new Date();
        if (now > date) {
          sessionStorage.removeItem("SLAReport");
          result = await login(username, password);
        } else {
          const resultSLAReportSSrg = getSessionStorage("SLAReport");
          const access_token = resultSLAReportSSrg.resultToken;
          result = { responseCode: 1, responseData: access_token, responseMessage: "success" };
        }
      }
    }
    if (result.responseCode === 1) {
      const response = await axios.post(
        API_ENDPOINT,
        {
          startDate: `${startDate} `,
          endDate: `${endDate} `,
          report_type: `${report_type}`,
        },
        {
          headers: {
            Authorization: `Bearer ${result.responseData}`,
          },
        },
      );
      return { responseCode: 1, responseData: response.data, responseMessage: response.status };
    } else {
      return { responseCode: 0, responseData: null, responseMessage: response.status };
    }

    // A const username = APIVariables.user;
    // A const password = APIVariables.pass;
    // A const token = await login(username, password);

    // A const response = await axios.post(
    // A  API_ENDPOINT,
    // A  {
    // A    startDate: `${startDate} `,
    // A    endDate: `${endDate} `,
    // A    report_type: `${report_type}`,
    // A  },
    // A  {
    // A    headers: {
    // A      Authorization: `Bearer ${token}`,
    // A    },
    // A  },
    // A);
    // A return response;
  } catch (error) {
    return {
      responseCode: 0,
      responseData: null,
      responseMessage: error.message,
    };
  }
};
