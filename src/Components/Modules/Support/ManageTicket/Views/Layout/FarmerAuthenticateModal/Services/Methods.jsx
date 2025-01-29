import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "../../../../Services/EndPoints";

export const checkFarmerByMobileNumber = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.ManageTicket.CheckFarmerByMobileNumber);
    if (result.responseCode === 1) {
      if (result.responseData && result.responseData.length > 0) {
        return { response: result };
      }
      return { response: result };
    }
    return { response: result };
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};

export const checkFarmerByAccountNumber = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.ManageTicket.CheckFarmerByAccountNumber);
    if (result.responseCode === 1) {
      if (result.responseData && result.responseData.length > 0) {
        return { response: result };
      }
      return { response: result };
    }
    return { response: result };
  } catch (error) {
    console.log(error);
    return { response: { responseCode: 0, responseData: null, responseMessage: error } };
  }
};
