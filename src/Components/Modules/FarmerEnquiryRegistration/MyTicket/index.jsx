import { useEffect, React } from "react";
import { PropTypes } from "prop-types";
import TicketCustomerDetail from "./Views/Layout/TicketCustomerDetail/TicketCustomerDetail";
import MyTicket from "./Views/MyTicket";
import ChatBox from "./Views/Layout/ChatBox/ChatBox";
import ChatList from "./Views/Layout/ChatList/ChatList";
import MyTicketLogics from "./Logic/Logic";

function MyTicketPage({ selectedData, showfunc }) {
  const {
    value,
    setValue,
    replyBoxCollapsed,
    setReplyBoxCollapsed,
    setTicketStatusBtn,
    getChatListDetailsData,
    ticketData,
    chatListDetails,
    isLoadingchatListDetails,
    handleSave,
    btnloaderActive,
    btnloaderCloseTicketActive,
    closeSupportTicketOnClick,
    formValuesTicketProperties,
    updateStateTicketProperties,
    ticketStatusList,
    isLoadingTicketStatusList,
    getTicketStatusListData,
    bankDropdownDataList,
    isLoadingBankDropdownDataList,
    getBankListData,
    btnloaderStatusTicketActive,
    updateStatusSupportTicketOnClick,
    wordcount,
    setWordcount,
    btnLoaderActive1,
  } = MyTicketLogics();

  useEffect(() => {
    getChatListDetailsData(selectedData, 1, 5);
    getTicketStatusListData();
    getBankListData();
  }, []);

  return (
    <MyTicket
      replyBoxCollapsed={replyBoxCollapsed}
      setReplyBoxCollapsed={setReplyBoxCollapsed}
      setTicketStatusBtn={setTicketStatusBtn}
      ticketData={ticketData}
      btnloaderCloseTicketActive={btnloaderCloseTicketActive}
      closeSupportTicketOnClick={closeSupportTicketOnClick}
      showfunc={showfunc}
    >
      <ChatList chatListDetails={chatListDetails} isLoadingchatListDetails={isLoadingchatListDetails} selectedData={selectedData}>
        <ChatBox
          replyBoxCollapsed={replyBoxCollapsed}
          value={value}
          setValue={setValue}
          handleSave={handleSave}
          btnloaderActive={btnloaderActive}
          ticketStatusList={ticketStatusList}
          isLoadingBankDropdownDataList={isLoadingBankDropdownDataList}
          formValuesTicketProperties={formValuesTicketProperties}
          updateStateTicketProperties={updateStateTicketProperties}
          wordcount={wordcount}
          setWordcount={setWordcount}
          btnLoaderActive1={btnLoaderActive1}
        />
      </ChatList>
      <TicketCustomerDetail
        ticketData={ticketData}
        ticketStatusList={ticketStatusList}
        isLoadingTicketStatusList={isLoadingTicketStatusList}
        bankDropdownDataList={bankDropdownDataList}
        isLoadingBankDropdownDataList={isLoadingBankDropdownDataList}
        formValuesTicketProperties={formValuesTicketProperties}
        updateStateTicketProperties={updateStateTicketProperties}
        btnloaderStatusTicketActive={btnloaderStatusTicketActive}
        updateStatusSupportTicketOnClick={updateStatusSupportTicketOnClick}
      />
    </MyTicket>
  );
}

export default MyTicketPage;

MyTicketPage.propTypes = {
  selectedData: PropTypes.object,
  showfunc: PropTypes.func.isRequired,
};
