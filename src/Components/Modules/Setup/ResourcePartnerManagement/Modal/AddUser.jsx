import { React, useState, useEffect } from "react";
import { sha256 } from "crypto-hash";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import moment from "moment";
import { Form, Modal } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { FaInfoCircle } from "react-icons/fa";
import { getSessionStorage, validatePassword, encryptStringData } from "Components/Common/Login/Auth/auth";
import { getMasterDataBinding, cscTrainingDataBinding, addNewUser } from "../Services/Methods";
import BizClass from "../../ResourcePartnerManagement/ResourcePartnerManagement.module.scss";

function AddUser({showfunc, updateResourceMgtUserData}) {
  const setAlertMessage = AlertMessage();

  const [isPopupVisible, setPopupVisible] = useState(false);
  const handleIconHoverPass = () => {
    setPopupVisible(true);
  };

  const handleIconUnhoverPass = () => {
    setPopupVisible(false);
  };

  const [userTypeOptions] = useState([
    { ID: 333, Value: "Resoure Partner" },
    { ID: 472, Value: "Trainer" },
  ]);

  const [formValues, setFormValues] = useState({
    txtDisplayName: "",
    txtLoginName: "",
    txtPassword: "",
    txtMobileNo: "",
    txtEmailID: "",
    txtResourcePartner: null,
    txtCenter: null,
  });

    const validateField = (name, value) => {
      let errorsMsg = "";
      if (name === "txtDisplayName") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Can not be empty";
        }
      }
      if (name === "txtLoginName") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Can not be empty";
        } else {
          const regex = new RegExp("^[a-zA-Z0-9_]*$");
          if (!regex.test(value)) {
            errorsMsg = "Not valid";
          }
        }
      }
      if (name === "txtPassword") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Can not be empty";
        } else if (value) {
          const ErrorPwd = validatePassword(value);
          if (ErrorPwd !== "") {
            errorsMsg = ErrorPwd;
          }
        }
      }
      if (name === "txtUserType") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Can not be empty";
        }
      }

      if (name === "txtResourcePartner") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Can not be empty";
        }
      }

      if (name === "txtCenter") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Can not be empty";
        }
      }
     
      if (name === "txtMobileNo") {
        if (!value || typeof value === "undefined") {
          errorsMsg = "Can not be empty";
        } else {
          const regex = new RegExp("^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-s./0-9]*$");
          if (!regex.test(value)) {
            errorsMsg = "Not valid";
          }
        }
      }
      if (name === "txtEmailID") {
        const regex = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        if (!regex.test(value)) {
          errorsMsg = "Email ID is not valid";
        }
      }
  
      return errorsMsg;
    };

  const [formValidationError, setFormValidationError] = useState({});
   const updateState = (name, value) => {
     debugger;
     setFormValues({ ...formValues, [name]: value });
     formValidationError[name] = validateField(name, value);

     if(name === "txtUserType") {
      setFormValues({
        ...formValues,
        txtUserType: value,
        txtResourcePartner: null,
        txtCenter: null,
      });
 
     }

   };

         const [resourcePartnerList, setresourcePartnerList] = useState([]);
         const [isLoadingresourcePartnerList, setIsLoadingresourcePartnerList] = useState(false);
         const getresourcePartnerData = async () => {
           debugger;
           try {
             setresourcePartnerList([]);
             setIsLoadingresourcePartnerList(true);
             const formdata = {
               filterID: 0,
               filterID1: 0,
               masterName: "RESRCE",
               searchText: "#ALL",
               searchCriteria: "AW",
             };
             const result = await getMasterDataBinding(formdata);
             setIsLoadingresourcePartnerList(false);
             if (result.response.responseCode === 1) {
               if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
                   setresourcePartnerList(result.response.responseData.masterdatabinding);
               } else {
                   setresourcePartnerList([]);
               }
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

         const [centerList, setcenterList] = useState([]);
         const [isLoadingcenterList, setIsLoadingcenterList] = useState(false);
         const getcenterByData = async () => {
           debugger;
           try {
            setcenterList([]);
             setIsLoadingcenterList(true);
             const formdata = {
              SPMODE: "CENTER",
              SPCenterID: 0,
             };
             const result = await cscTrainingDataBinding(formdata);
             setIsLoadingcenterList(false);
             if (result.response.responseCode === 1) {
               if (result.response.responseData && result.response.responseData.length > 0) {
                setcenterList(result.response.responseData);
               } else {
                setcenterList([]);
               }
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
         const handleValidation = () => {
          try {
            const errors = {};
            let formIsValid = true;
            errors["txtDisplayName"] = validateField("txtDisplayName", formValues.txtDisplayName);
            errors["txtLoginName"] = validateField("txtLoginName", formValues.txtLoginName);
            errors["txtPassword"] = validateField("txtPassword", formValues.txtPassword);
            errors["txtUserType"] = validateField("txtUserType", formValues.txtUserType);
            if( formValues && formValues.txtUserType && formValues.txtUserType.ID === 333 ) {
              errors["txtResourcePartner"] = validateField("txtResourcePartner", formValues.txtResourcePartner);
              }
            if( formValues && formValues.txtUserType && formValues.txtUserType.ID === 472 ) {
              errors["txtCenter"] = validateField("txtCenter", formValues.txtCenter);
            }
            errors["txtMobileNo"] = validateField("txtMobileNo", formValues.txtMobileNo);
            errors["txtEMailID"] = validateField("txtEMailID", formValues.txtEmailID);
      
            if (Object.values(errors).join("").toString()) {
              formIsValid = false;
            }
            setFormValidationError(errors);
            return formIsValid;
          } catch (error) {
            setAlertMessage({
              type: "error",
              message: "Something Went Wrong",
            });
            return false;
          }
        };
      
        const clearForm = () => {
          setFormValues({
            txtDisplayName: "",
            txtLoginName: "",
            txtPassword: "",
            txtMobileNo: "",
            txtEmailID: "",
            txtResourcePartner: null,
            txtCenter: null,
          });
        };      
   const [btnLoaderActive, setBtnLoaderActive] = useState(false);
   const handleSave = async (e) => {
     if (!handleValidation()) {
          return;
        }
        debugger;
        try {
          const encryptUserName = encryptStringData(formValues.txtLoginName ? formValues.txtLoginName : "");
          const hashPass = await sha256(formValues.txtPassword ? formValues.txtPassword : "");
          const formData = {
            userTypeID: formValues.txtUserType && formValues.txtUserType.ID ? formValues.txtUserType.ID : 0,
            centerMasterID: formValues.txtCenter && formValues.txtCenter.CenterMasterID ? formValues.txtCenter.CenterMasterID : 0,
            center: formValues.txtCenter && formValues.txtCenter.Center ? formValues.txtCenter.Center : "",
            resourcePartnerID: formValues.txtResourcePartner && formValues.txtResourcePartner.ResorcePartnerName ? formValues.txtResourcePartner.ResorcePartnerName : 0,
            mobileNumber: formValues.txtMobileNo ? formValues.txtMobileNo : "",
            emailAddress: formValues.txtEmailID ? formValues.txtEmailID : "",
            password: hashPass,
            userName: encryptUserName,
            name: formValues.txtDisplayName ? formValues.txtDisplayName : "",
          };
          setBtnLoaderActive(true);
          const result = await addNewUser(formData);
          const userData = getSessionStorage("user");
          if (result.response.responseCode === 1) {
            debugger;
            if (result.response && result.response.responseData) {
              const newlyAddedUser = [
                {
                  AppAccessID: result.response.responseData.data.AppAccessID,
                  UserDisplayName: formValues.txtDisplayName ? formValues.txtDisplayName : "",
                  AppAccessUserName: formValues.txtLoginName ? formValues.txtLoginName : "",
                  UserType: formValues.txtUserType && formValues.txtUserType.Value ? formValues.txtUserType.Value : "",
                  ActiveStatus: "Y",
                  EmailAddress: formValues.txtEmailID ? formValues.txtEmailID : "",
                  UserMobileNumber: formValues.txtMobileNo ? formValues.txtMobileNo : "",
                  ResourcePartnerName:  formValues.txtResourcePartner && formValues.txtResourcePartner.ResourcePartnerMasterID ? formValues.txtResourcePartner.ResourcePartnerMasterID : "",
                  Center: formValues.txtCenter && formValues.txtCenter.Center ? formValues.txtCenter.Center : "",
                  InsertUserID: userData ? userData.LoginID : 0,
                  InsertedTime: moment().utcOffset("+05:30").format("YYYY-MM-DDTHH:mm:ss"),
                  IsNewlyAdded: true,
                },
              ];
              updateResourceMgtUserData(newlyAddedUser);
            }
            setBtnLoaderActive(false);
            setAlertMessage({
              type: "success",
              message: result.response.responseMessage,
            });
            clearForm();
          } else {
            setBtnLoaderActive(false);
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
            getresourcePartnerData();
            getcenterByData();
           }, []);
 

  return (
    <>
      {isPopupVisible && (
        <div className={BizClass.PasswordPolicyDiv}>
          <h1 style={{ fontSize: "18px", textDecoration: "underline", paddingBottom: "8px" }}>Password Policy</h1>
          <p>1. The length of password should be minimum 8 characters or maximum 16 characters.</p>
          <p style={{ paddingBottom: "5px" }}>
            2. The password shall be case sensitive and should contain at least one each of the following characters with no space:
            <br />
          </p>
          <p style={{ paddingLeft: "10px" }}>
            1. Uppercase: A to Z
            <br />
            2. Lowercase: a to z
            <br />
            3. Digit: 0 to 9
            <br />
            4. Non-Alphanumeric: Special characters @ # $ % & * / \
          </p>
        </div>
      )}
      <Modal  varient="center" title="Add User" show={showfunc} right="0">
        <Modal.Body>
          <Form>
            <Form.Group column={2} controlwidth="280px">
              <Form.InputGroup label="Display Name" errorMsg={formValidationError["txtDisplayName"]} req="true">
                <Form.InputControl
                  control="input"
                  type="text"
                  maxLength="20"
                  autoComplete="off"
                  value={formValues.txtDisplayName}
                  name="txtDisplayName"
                  onChange={(e) => updateState("txtDisplayName", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="User Name" errorMsg={formValidationError["txtLoginName"]} req="true">
                <Form.InputControl
                  control="input"
                  type="text"
                  maxLength="10"
                  autoComplete="off"
                  value={formValues.txtLoginName}
                  name="txtLoginName"
                  onChange={(e) => updateState("txtLoginName", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="Password" errorMsg={formValidationError["txtPassword"]} req="true">
                <Form.InputControl
                  control="input"
                  type="password"
                  autoComplete="new-password"
                  value={formValues.txtPassword}
                  name="txtPassword"
                  onChange={(e) => updateState("txtPassword", e.target.value)}
                />
                <FaInfoCircle onMouseOver={() => handleIconHoverPass()} onMouseOut={() => handleIconUnhoverPass()} />
              </Form.InputGroup>
              <Form.InputGroup label="Email ID" errorMsg={formValidationError["txtEmailID"]} req="false">
                <Form.InputControl
                  control="input"
                  type="text"
                  autoComplete="off"
                  value={formValues.txtEmailID}
                  name="txtEmailID"
                  onChange={(e) => updateState("txtEmailID", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="Mobile No" errorMsg={formValidationError["txtMobileNo"]} req="true">
                <Form.InputControl
                  control="input"
                  type="text"
                  minLength="10"
                  maxLength="10"
                  autoComplete="off"
                  value={formValues.txtMobileNo}
                  name="txtMobileNo"
                  onChange={(e) => updateState("txtMobileNo", e.target.value)}
                />
              </Form.InputGroup>
              <Form.InputGroup label="User Type" errorMsg={formValidationError["txtUserType"]} req="true" >
                            <Form.InputControl
                              control="select"
                              name="txtUserType"
                              onChange={(e) => updateState("txtUserType", e)}
                              value={formValues.txtUserType}
                              options={userTypeOptions}
                              getOptionLabel={(option) => `${option.Value}`}
                              getOptionValue={(option) => `${option}`}
                            />
              </Form.InputGroup>
              {formValues && formValues.txtUserType && formValues.txtUserType.ID && formValues.txtUserType.ID === 333 ?
               <Form.InputGroup label="Resource Partner" errorMsg={formValidationError["txtResourcePartner"]} req="true" >
                            <Form.InputControl
                              control="select"
                              name="txtResourcePartner"
                              onChange={(e) => updateState("txtResourcePartner", e)}
                              value={formValues.txtResourcePartner}
                               loader={isLoadingresourcePartnerList ? <Loader /> : null}
                              options={resourcePartnerList}
                              getOptionLabel={(option) => `${option.ResorcePartnerName}`}
                              getOptionValue={(option) => `${option}`}
                            />
              </Form.InputGroup>  : null } 
              {formValues && formValues.txtUserType && formValues.txtUserType.ID && formValues.txtUserType.ID === 472 ?
              <Form.InputGroup label="Center" errorMsg={formValidationError["txtCenter"]} req="true" >
                            <Form.InputControl
                              control="select"
                              name="txtCenter"
                              onChange={(e) => updateState("txtCenter", e)}
                              value={formValues.txtCenter}
                              options={centerList}
                              loader={isLoadingcenterList ? <Loader /> : null}
                              getOptionLabel={(option) => `${option.Center}`}
                              getOptionValue={(option) => `${option}`}
                            />
              </Form.InputGroup>  : null }            
            </Form.Group>
       
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" onClick={(e) => handleSave(e)} varient="secondary" trigger={btnLoaderActive}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddUser;
