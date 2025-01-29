import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./Endpoints";

export const addUserRegionalOfficeMaster = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.RegionalManagement.AddRegionalOfficeMaster);
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

export const GetMasterDataBinding = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.RegionalManagement.GetMasterDataBinding);
    if (result.responseCode === 1) {
      if (result.responseData && result.responseData.masterdatabinding) {
        return { response: result.responseData.masterdatabinding };
      }
      return { response: [] };
    }
    return { response: [] };
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};
