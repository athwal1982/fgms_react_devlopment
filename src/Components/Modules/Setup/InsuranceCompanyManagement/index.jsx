import React, { useState } from "react";
import InsuranceCompanyManagement from "./Views/InsuranceCompanyManagement";
import InsuranceCompanyManagementLogics from "./Logic/Logic";
import AddInsuranceCompany from "./Views/Modal/AddInsuranceCompany/AddInsuranceCompany";
import EditInsuranceCompany from "./Views/Modal/EditInsuranceCompany/EditInsuranceCompany";

function InsuranceCompanyManagementPage() {
  const [addInsuranceCompanyModal, setAddInsuranceCompanyModal] = useState(false);
  const [editInsuranceCompanyModal, setEditInsuranceCompanyModal] = useState(false);
  const {
    isLoadingInsuranceCompanyDataList,
    insuranceCompanyDataList,
    onGridReady,
    updateInsuranceCompanyData,
    insuranceCompanyListItemSearch,
    onChangeInsuranceCompanyList,
    getInsuranceCompanyList,
  } = InsuranceCompanyManagementLogics();
  const toggleAddInsuranceCompanyModal = () => {
    setAddInsuranceCompanyModal(!addInsuranceCompanyModal);
  };
  const [seletedData, setSeletedData] = useState({});
  const toggleEditInsuranceCompanyModal = (data) => {
    setSeletedData(data);
    setEditInsuranceCompanyModal(!editInsuranceCompanyModal);
  };
  return (
    <>
      {addInsuranceCompanyModal ? (
        <AddInsuranceCompany showfunc={toggleAddInsuranceCompanyModal} updateInsuranceCompanyData={updateInsuranceCompanyData} />
      ) : null}
      {editInsuranceCompanyModal ? <EditInsuranceCompany showfunc={toggleEditInsuranceCompanyModal} seletedData={seletedData} /> : null}
      <InsuranceCompanyManagement
        isLoadingInsuranceCompanyDataList={isLoadingInsuranceCompanyDataList}
        insuranceCompanyDataList={insuranceCompanyDataList}
        onGridReady={onGridReady}
        toggleAddInsuranceCompanyModal={toggleAddInsuranceCompanyModal}
        onChangeInsuranceCompanyList={onChangeInsuranceCompanyList}
        insuranceCompanyListItemSearch={insuranceCompanyListItemSearch}
        getInsuranceCompanyList={getInsuranceCompanyList}
        toggleEditInsuranceCompanyModal={toggleEditInsuranceCompanyModal}
      />
    </>
  );
}

export default InsuranceCompanyManagementPage;
