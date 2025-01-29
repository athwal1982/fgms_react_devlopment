import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const GetUserInsCompAssignManage = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.GetUserInsuranceAssignManage);
    return result;
  } catch (error) {
    console.log(error);
    return { response: [] };
  }
};
