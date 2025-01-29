import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getRegionalOfficeMasterListData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.RegionalManagement.GetRegionalOfficeMaster);
    return result;
  } catch (error) {
    console.log(error);
    return {
      response: [],
    };
  }
};

export const getRegionalStateAssignmentManage = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.RegionalManagement.GetRegionalStateAssignmentManage);
    return result;
  } catch (error) {
    console.log(error);
    return {
      response: [],
    };
  }
};
