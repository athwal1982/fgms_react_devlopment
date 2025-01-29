import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getIsuranceCompanyListData = async (formData) => {
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.InsuranceCompanyManagement.GetInsuranceMaster);
    return result;
  } catch (error) {
    console.log(error);
    return {
      response: [],
    };
  }
};
