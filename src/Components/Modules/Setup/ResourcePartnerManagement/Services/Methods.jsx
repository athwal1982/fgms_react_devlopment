import { ApiCalling } from "Services/Utilities/ApiCalling/ApiCalling";
import APIEndpoints from "./EndPoints";

export const getUserListData = async (formData) => {
  debugger;
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.GetUser);
    if (result.responseCode === 1) {
      if (result.responseData) {
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

export const userUpdateActiveStatus = async (formData) => {
  debugger;
  try {
    const requestData = {
      main: {
        ...formData,
      },
    };
    const result = await ApiCalling(requestData, APIEndpoints.UserManagement.UserUpdateActiveStatus);
    if (result.responseCode === 1) {
      if (result.responseData) {
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

export const addNewUser = async (formData) => {
    try {
      const requestData = {
        main: {
          ...formData,
        },
      };
      const result = await ApiCalling(requestData, APIEndpoints.UserManagement.AddNewUser);
      console.log(result);
      return { response: result };
    } catch (error) {
      console.log(error);
      return { response: [] };
    }
  };

  export const getMasterDataBinding = async (formData) => {
    debugger;
    try {
      const requestData = {
        main: {
          ...formData,
        },
      };
      const result = await ApiCalling(requestData, APIEndpoints.ResourcePartnerManagement.GetMasterDataBindingList);
      if (result.responseCode === 1) {
        if (result.responseData) {
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