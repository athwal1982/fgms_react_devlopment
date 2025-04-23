import React, { useState, useEffect, useRef } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { Form, Modal } from "Framework/Components/Layout";
import { Button, Loader } from "Framework/Components/Widgets";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";
import moment from "moment";
import {getMasterDataBinding} from "../Services/Methods";

function AddNotificationsModal({ openAddNotificationsModalClick }) {
     const setAlertMessage = AlertMessage();
     const fileRef = useRef(null);

     const[priorityList] = useState([{lable: "Low",value : 1},{lable: "Medium",value : 2},{lable: "High",value : 3}]);
      
      const [btnloaderActive, setBtnloaderActive] = useState(false);
      const [formValues, setFormValues] = useState({
        txtNotificationFor: null,
        txtNotificationType: null,
        txtNotificationDateTime: "",
        txtResourcePartner: null,
        txtState: null,
        txtInsuranceCompany: null,
        txtCenter: null,
        txtPriority: null,
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

        const [selectedState, setSelectedState] = useState([]);
        const [isLoadingSelectedState, setIsLoadingSelectedState] = useState(false);
        const getState = async () => {
          debugger;
          try {
            setIsLoadingSelectedState(true);
            const formdata = {
              filterID: 0,
              filterID1: 0,
              masterName: "STATEMAS",
              searchText: "#ALL",
              searchCriteria: "AW",
            };
            const result = await getMasterDataBinding(formdata);
            console.log(result);
            setIsLoadingSelectedState(false);
            if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
              setSelectedState(result.response.responseData.masterdatabinding);
            } else {
              setSelectedState([]);
            }
          } catch (error) {
            console.log(error);
            setAlertMessage({
              type: "error",
              message: error,
            });
          }
        };
          const [insuranceCompanyList, setInsuranceCompanyList] = useState([]);
          const [isLoadingInsuranceCompanyList, setIsLoadingInsuranceCompanyList] = useState(false);
          const getInsuranceCompanyListData = async () => {
            try {
              setInsuranceCompanyList([]);
              const formdata = {
                filterID: 124003,
                filterID1: 0,
                masterName: "CMPLST",
                searchText: "#ALL",
                searchCriteria: "",
              };
              setIsLoadingInsuranceCompanyList(true);
              const result = await getMasterDataBinding(formdata);
              setIsLoadingInsuranceCompanyList(false);
              if (result.response.responseCode === 1) {
                if (result.response.responseData && result.response.responseData.masterdatabinding && result.response.responseData.masterdatabinding.length > 0) {
                  setInsuranceCompanyList(result.response.responseData.masterdatabinding);
                } else {
                  setInsuranceCompanyList([]);
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

        useEffect(() => {
            getNotificationForData();
            getNotificationTypeData();
            getState();
            getInsuranceCompanyListData();
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
                        <Form.InputGroup label="State" errorMsg={formValidationError["txtState"]} req="true">
                                         <Form.InputControl
                                           control="select"
                                           name="txtState"
                                           loader={isLoadingSelectedState ? <Loader /> : null}
                                           onChange={(e) => updateState("txtState", e)}
                                           value={formValues.txtState}
                                           options={selectedState}
                                           getOptionLabel={(option) => `${option.StateMasterName}`}
                                           getOptionValue={(option) => `${option}`}
                                         />
                                       </Form.InputGroup>
                                       <Form.InputGroup label="Insurance Company" errorMsg={formValidationError["txtInsuranceCompany"]} req="true">
                                         <Form.InputControl
                                           control="select"
                                           name="txtInsuranceCompany"
                                           loader={isLoadingInsuranceCompanyList ? <Loader /> : null}
                                           onChange={(e) => updateState("txtInsuranceCompany", e)}
                                           value={formValues.txtInsuranceCompany}
                                           options={insuranceCompanyList}
                                           getOptionLabel={(option) => `${option.CompanyName}`}
                                           getOptionValue={(option) => `${option}`}
                                         />
                                       </Form.InputGroup>
                                       <Form.InputGroup label="Resource Parner" errorMsg={formValidationError["txtResourcePartner"]} req="true">
                                         <Form.InputControl
                                           control="select"
                                           name="txtResourcePartner"
                                          // A loader={isLoadingResourcePartner ? <Loader /> : null}
                                           onChange={(e) => updateState("txtResourcePartner", e)}
                                           value={formValues.txtResourcePartner}
                                           options={[]}
                                           getOptionLabel={(option) => `${option.StateMasterName}`}
                                           getOptionValue={(option) => `${option}`}
                                         />
                                         
                                       </Form.InputGroup>    
                                       <Form.InputGroup label="Center" errorMsg={formValidationError["txtCenter"]} req="true">
                                         <Form.InputControl
                                           control="select"
                                           name="txtCenter"
                                           // A loader={isLoadingCenter ? <Loader /> : null}
                                           onChange={(e) => updateState("txtCenter", e)}
                                           value={formValues.txtCenter}
                                           options={[]}
                                           getOptionLabel={(option) => `${option.StateMasterName}`}
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
                                                   <Form.InputGroup label="Priority" req="true" errorMsg={formValidationError["txtCenter"]}>
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
                                        <Form.InputGroup label="Is For Admin" LabelReq="true"  column={3}htmlFor="IsForAdmin_Check">
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
        <Button type="button" varient="secondary" trigger={btnloaderActive}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddNotificationsModal;
