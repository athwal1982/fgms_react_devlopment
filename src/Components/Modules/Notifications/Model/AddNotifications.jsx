import React, { useState, useEffect, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Form, Modal } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import { getMasterDataBinding, addNotificationMasterData} from "../Services/Methods";

function AddNotificationsModal({ openAddNotificationsModalClick, updateNotification }) {
     const setAlertMessage = AlertMessage();
     const fileRef = useRef(null);

     const[priorityList] = useState([{lable: "Low",value : 0},{lable: "High",value : 1}]);
      
      const [formValues, setFormValues] = useState({
        txtNotificationFor: null,
        txtNotificationType: null,
        txtNotificationDateTime: "",
        txtPriority: null,
        txtIsForAdmin: false,
        txtHeading: "",
        txtDocumentUpload: null,
        txtMessage: "",
      });
    
    const [formValidationError, setFormValidationError] = useState({});
    const updateState = (name, value) => {
        setFormValues({ ...formValues, [name]: value });
    };

      const [notificationForList, setNotificationForList] = useState([]);
      const [isLoadingNotificationForList, setIsLoadingNotificationForList] = useState(false);
      const getNotificationForData = async () => {
        debugger;
        try {
          setNotificationForList([]);
          setIsLoadingNotificationForList(true);
          const formdata = {
            filterID: 131,
            filterID1: 0,
            masterName: "COMMVAL",
            searchText: "#ALL",
            searchCriteria: "AW",
          };
          const result = await getMasterDataBinding(formdata);
          setIsLoadingNotificationForList(false);
          if (result.response.responseCode === 1) {
            if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
                setNotificationForList(result.response.responseData.masterdatabinding);
            } else {
                setNotificationForList([]);
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

      const [notificationTypeList, setNotificationTypeList] = useState([]);
      const [isLoadingNotificationTypeList, setIsLoadingNotificationTypeList] = useState(false);
      const getNotificationTypeData = async () => {
        debugger;
        try {
          setNotificationTypeList([]);
          setIsLoadingNotificationTypeList(true);
          const formdata = {
            filterID: 130,
            filterID1: 0,
            masterName: "COMMVAL",
            searchText: "#ALL",
            searchCriteria: "AW",
          };
          const result = await getMasterDataBinding(formdata);
          setIsLoadingNotificationTypeList(false);
          if (result.response.responseCode === 1) {
            if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
                setNotificationTypeList(result.response.responseData.masterdatabinding);
            } else {
                setNotificationTypeList([]);
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
        const handleResetFile = async () => {
          fileRef.current.value = null;
          setFormValues({
            ...formValues,
            txtDocumentUpload: null,
          });
        };
        
        const handleValidation = () => {
          const errors = {};
      
          let formIsValid = true;
          if (!formValues.txtNotificationFor || typeof formValues.txtNotificationFor === "undefined") {
            formIsValid = false;
            errors["txtNotificationFor"] = "Notification For is required!";
          }
      
          if (!formValues.txtNotificationType || typeof formValues.txtNotificationType === "undefined") {
            formIsValid = false;
            errors["txtNotificationType"] = "Notification Type is required!";
          }

          if (!formValues.txtNotificationDateTime || typeof formValues.txtNotificationDateTime === "undefined") {
            formIsValid = false;
            errors["txtNotificationDateTime"] = "Notification Date Time is required!";
          }

          if (!formValues.txtPriority || typeof formValues.txtPriority === "undefined") {
            formIsValid = false;
            errors["txtPriority"] = "Priority is required!";
          }

          if (!formValues.txtHeading || typeof formValues.txtHeading === "undefined") {
            formIsValid = false;
            errors["txtHeading"] = "Notification Heading is required!";
          }

          if (!formValues.txtMessage || typeof formValues.txtMessage === "undefined") {
            formIsValid = false;
            errors["txtMessage"] = "Notification Message is required!";
          }

      
          setFormValidationError(errors);
          return formIsValid;
        };
      
        const [btnloaderActive, setBtnloaderActive] = useState(false);
        const handleSave = async () => {
          try {
            if (!handleValidation()) {
              return;
            }
      
            setBtnloaderActive(true);
            const formData = {
              notificationType: formValues.txtNotificationType && formValues.txtNotificationType.CommonMasterValueID ? formValues.txtNotificationType.CommonMasterValueID : 0,
              notificationFor: formValues.txtNotificationFor && formValues.txtNotificationFor.CommonMasterValueID ? formValues.txtNotificationFor.CommonMasterValueID : 0,
              priorityFlag: formValues.txtPriority && formValues.txtPriority.value ? formValues.txtPriority.value : 0,
              notificationHeading: formValues.txtHeading ? formValues.txtHeading.toString() : "",
              notificationDateTime:formValues.txtNotificationDateTime ? dateToSpecificFormat(formValues.txtNotificationDateTime, "YYYY-MM-DD hh:mm") : "",
              isForAdmin:  formValues.txtIsForAdmin === true ? 1 : 0,
              description:  formValues.txtMessage ? formValues.txtMessage.toString() : "",
              fileUrl: "",
            };
            debugger;
            const result = await addNotificationMasterData(formData);
            setBtnloaderActive(false);
            if (result.response.responseCode === 1) {
              setAlertMessage({
                type: "success",
                message: result.response.responseMessage,
              });
      
              const addnotification = [
                {
                  NotificationMasterID: result.response.responseData.data && result.response.responseData.data.NotificationMasterID ? result.response.responseData.data.NotificationMasterID : 0,
                  NotificationType: formValues.txtNotificationType && formValues.txtNotificationType.CommonMasterValueID ? formValues.txtNotificationType.CommonMasterValueID : 0,
                  NotificationValueType: formValues.txtNotificationType && formValues.txtNotificationType.CommonMasterValue ? formValues.txtNotificationType.CommonMasterValue : "",
                  NotificationFor: formValues.txtNotificationFor && formValues.txtNotificationFor.CommonMasterValueID ? formValues.txtNotificationFor.CommonMasterValueID : 0,
                  NotificationValueFor: formValues.txtNotificationFor && formValues.txtNotificationFor.CommonMasterValue ? formValues.txtNotificationFor.CommonMasterValue : "",
                  PriorityFlag: formValues.txtPriority && formValues.txtPriority.Value === 0 ? "Low" : "High",
                  NotificationHeading: formValues.txtHeading ? formValues.txtHeading.toString() : "",
                  NotificationDateTime: formValues.txtNotificationDateTime ? dateToSpecificFormat(formValues.txtNotificationDateTime, "YYYY-MM-DDThh:mm:ss") : "",
                  IsForAdmin:  formValues.txtIsForAdmin === true ? "Yes" : No,
                  NotificationDescription:  formValues.txtMessage ? formValues.txtMessage.toString() : "",
                  fileUrl: "",
                  IsNewlyAdded: true,
                },
              ];
              updateNotification(addnotification);
              openAddNotificationsModalClick();
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
            getNotificationForData();
            getNotificationTypeData();
        }, []);
      

  return (
    <Modal  varient="center" title="Add Notification" show={openAddNotificationsModalClick} right="0">
      <Modal.Body>
        <Form>
          <Form.Group column="2" controlwidth="280px">
            <Form.InputGroup label="Notification For" req="true" errorMsg={formValidationError["txtNotificationFor"]}>
                         <Form.InputControl
                           control="select"
                           name="txtNotificationFor"
                           loader={isLoadingNotificationForList ? <Loader /> : null}
                           onChange={(e) => updateState("txtNotificationFor", e)}
                           value={formValues.txtNotificationFor}
                           options={notificationForList}
                           getOptionLabel={(option) => `${option.CommonMasterValue}`}
                           getOptionValue={(option) => `${option}`}
                         />
                       </Form.InputGroup>
                       <Form.InputGroup label="Notification Type" req="true" errorMsg={formValidationError["txtNotificationFor"]}>
                         <Form.InputControl
                           control="select"
                           name="txtNotificationType"
                           loader={isLoadingNotificationForList ? <Loader /> : null}
                           onChange={(e) => updateState("txtNotificationType", e)}
                           value={formValues.txtNotificationType}
                           options={notificationTypeList}
                           getOptionLabel={(option) => `${option.CommonMasterValue}`}
                           getOptionValue={(option) => `${option}`}
                         />
                       </Form.InputGroup>
                                        <Form.InputGroup label="Notification Date Time" req="true" errorMsg={formValidationError["txtNotificationDateTime"]}>
                                                     <Form.InputControl
                                                       control="input"
                                                       type="datetime-local"
                                                       name="txtNotificationDateTime"
                                                       value={formValues.txtNotificationDateTime}
                                                       onChange={(e) => updateState(e.target.name, e.target.value)}
                                                       min={dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD HH:MM")}
                                                       onKeyDown={(e) => e.preventDefault()}
                                                     />
                                                   </Form.InputGroup>  
                                                   <Form.InputGroup label="Priority" req="true" errorMsg={formValidationError["txtPriority"]}>
                                         <Form.InputControl
                                           control="select"
                                           name="txtPriority"
                                           onChange={(e) => updateState("txtPriority", e)}
                                           value={formValues.txtPriority}
                                           options={priorityList}
                                           getOptionLabel={(option) => `${option.lable}`}
                                           getOptionValue={(option) => `${option}`}
                                         />
                                         
                                       </Form.InputGroup>  
                                        <Form.InputGroup label="Is For Admin" LabelReq="true"  column={3} htmlFor="IsForAdmin_Check">
                                                     <Form.InputControl
                                                       checked={formValues.txtIsForAdmin}
                                                       name="txtIsForAdmin"
                                                       control="switch"
                                                       onChange={(e) => updateState(e.target.name, !formValues.txtIsForAdmin)}
                                                       id="IsForAdmin_Check"
                                                     />
                                                   </Form.InputGroup>
                                   <Form.InputGroup label="Notification Heading" column={3} req="true" errorMsg={formValidationError["txtHeading"]}>
                                                <Form.InputControl
                                                  control="input"
                                                  type="text"
                                                  name="txtHeading"
                                                  maxLength="100"
                                                  autoComplete="off"
                                                  value={formValues.txtHeading}
                                                  onChange={(e) => updateState(e.target.name, e.target.value)}
                                                />
                                              </Form.InputGroup>
                                    {formValues && formValues.txtNotificationType && formValues.txtNotificationType.CommonMasterValueID && formValues.txtNotificationType.CommonMasterValueID !== 130301 ? <><Form.InputGroup column={2} label="File" errorMsg={formValidationError["txtDocumentUpload"]}>
                                                        <Form.InputControl
                                                          control="input"
                                                          type="file"
                                                          accept="image/*,.pdf"
                                                          name="txtDocumentUpload"
                                                          onChange={(e) => updateState(e.target.name, e.target.files[0])}
                                                          ref={fileRef}
                                                        />
                                                      </Form.InputGroup>
                                                      <Form.InputGroup column={1}>
                                                        <Button type="button" varient="primary" onClick={() => handleResetFile()}>
                                                          {" "}
                                                          Reset File
                                                        </Button>
                                                      </Form.InputGroup> </>    : null}            
                                          
                                    <Form.InputGroup label="Notification Message" req="true" column={3} row={12} errorMsg={formValidationError["txtMessage"]}>
                                                         <Form.InputControl
                                                           control="textarea"
                                                           row="12"
                                                           maxLength="500"
                                                           name="txtMessage"
                                                           value={formValues.txtMessage}
                                                           onChange={(e) => updateState("txtMessage", e.target.value)}
                                                      
                                                         />
                                                       </Form.InputGroup>                                   
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" varient="secondary" trigger={btnloaderActive} onClick={() => handleSave()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddNotificationsModal;
