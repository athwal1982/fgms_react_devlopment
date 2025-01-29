import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { useEffect, useState } from "react";
import { addUserProfile } from "../Services/Methods";
import { getBrHeadTypeData } from "../../../../../UserManagement/Views/Modals/AddUser/Services/Methods";

function AddUserProfileLogics() {
  const setAlertMessage = AlertMessage();
  const [btnloaderActive, setBtnloaderActive] = useState(false);
  const [formValues, setFormValues] = useState({
    txtProfileName: "",
    txtProfileDescription: "",
    txtBRHeadType: null,
    txtActiveStatus: true,
  });

  const updateState = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const clearForm = () => {
    setFormValues({
      txtCompanyMaster: null,
      txtProfileName: "",
      txtProfileDescription: "",
      txtBRHeadType: null,
      txtActiveStatus: "Y",
    });
  };

  const [BrHeadType, setBrHeadType] = useState([]);
  const [isLoadingBrHeadType, setIsLoadingBrHeadtype] = useState(false);
  const getBrHeadType = async () => {
    debugger;
    try {
      setIsLoadingBrHeadtype(true);
      const formData = {
        filterID: "124",
        filterID1: 0,
        masterName: "COMMVAL",
        searchText: "#ALL",
        searchCriteria: "AW",
      };
      const result = await getBrHeadTypeData(formData);
      console.log(result);
      setIsLoadingBrHeadtype(false);
      setBrHeadType(result.response);
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [formValidationError, setFormValidationError] = useState({});

  const handleValidation = () => {
    const errors = {};

    let formIsValid = true;
    if (!formValues.txtProfileName || typeof formValues.txtProfileName === "undefined") {
      formIsValid = false;
      errors["txtProfileName"] = "Profile Name is required!";
    }

    if (!formValues.txtBRHeadType || typeof formValues.txtBRHeadType === "undefined") {
      formIsValid = false;
      errors["txtBRHeadType"] = "BR HeadType is required!";
    }

    setFormValidationError(errors);
    return formIsValid;
  };

  const handleSave = async (e, updateProfileMgmt, showfunc) => {
    try {
      if (e) e.preventDefault();
      if (!handleValidation()) {
        return;
      }
      debugger;

      setBtnloaderActive(true);
      const formData = {
        userProfileID: 0,
        profileName: formValues.txtProfileName.toString(),
        profileDescription: formValues.txtProfileDescription.toString(),
        brHeadTypeID: formValues.txtBRHeadType && formValues.txtBRHeadType.CommonMasterValueID ? formValues.txtBRHeadType.CommonMasterValueID : 0,
        activeStatus: formValues.txtActiveStatus === true ? "Y" : "N",
      };
      const result = await addUserProfile(formData);
      setBtnloaderActive(false);
      if (result.response.responseCode === 1) {
        setAlertMessage({
          type: "success",
          message: result.response.responseMessage,
        });

        const addprofile = [
          {
            UserProfileID: result.response.responseData.UserProfileID ? result.response.responseData.UserProfileID : 0,
            ProfileName: formValues.txtProfileName.toString(),
            ProfileDescription: formValues.txtProfileDescription.toString(),
            ActiveStatus: formValues.txtActiveStatus,
            IsNewlyAdded: true,
          },
        ];
        updateProfileMgmt(addprofile);
        showfunc();
        clearForm();
      } else {
        setAlertMessage({
          type: "error",
          message: result.response.responseMessage,
        });
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  useEffect(() => {
    getBrHeadType();
  }, []);

  return {
    formValues,
    setFormValues,
    updateState,
    btnloaderActive,
    setBtnloaderActive,
    handleSave,
    formValidationError,
    BrHeadType,
    isLoadingBrHeadType,
  };
}

export default AddUserProfileLogics;
