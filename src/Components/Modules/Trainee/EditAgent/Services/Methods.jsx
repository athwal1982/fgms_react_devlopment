import { ApiCalling } from "../../../../../Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./Endpoint";

export const setUpdateUser = async (formData) => {
  debugger;
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Common.UpdateUser);
    if (result.responseCode === 1) {
      if (result.responseData) {
        return { response: result };
      }
      return { response: result };
    }
    return { response: result };
  } catch (error) {
    console.log(error);
    return {
      response: { responseCode: 0, responseData: null, responseMessage: error },
    };
  }
};

export const getAllRegion = async (formData) => {
  debugger;
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.Common.GetRegion);
    if (result.responseCode === 1) {
      if (result.responseData) {
        return { response: result };
      }
      return { response: result };
    }
    return { response: result };
  } catch (error) {
    console.log(error);
    return {
      response: { responseCode: 0, responseData: null, responseMessage: error },
    };
  }
};
