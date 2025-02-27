import axios from "axios";
import APIVariables from "./OuterApiVariables";

export const fetchCallingDashboardlogin = async () => {
  debugger;
  try {
    const LOGIN_API_URL = "https://fgms.smartping.io/api/login";
    const response = await axios.post(
      LOGIN_API_URL,
      { user: APIVariables.user, pass: APIVariables.pass },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );
    if (response.status === 200) {
      if (response.data) {
        return { responseCode: 1, responseData: response.data, responseMessage: response.status };
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
};

export const fetchCallingDashboardlogOut = async (token) => {
  debugger;
  try {
    const LOGOUT_API_URL = "https://fgms.smartping.io/api/logout";
    const response = await axios.post(
      LOGOUT_API_URL,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    if (response.status === 200) {
      return { responseCode: 1, responseData: [], responseMessage: response.status };
    }
    return { responseCode: 0, responseData: null, responseMessage: response.status };
  } catch (error) {
    return {
      responseCode: 0,
      responseData: null,
      responseMessage: error.message,
    };
  }
};
