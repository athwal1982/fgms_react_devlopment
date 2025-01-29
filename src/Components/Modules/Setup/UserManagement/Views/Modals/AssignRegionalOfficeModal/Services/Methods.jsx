import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const UserRegionalAssignmentManage = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.UserRegionalAssignmentManage);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};
