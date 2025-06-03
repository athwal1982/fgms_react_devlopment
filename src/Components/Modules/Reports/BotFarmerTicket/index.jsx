import React from "react";
import BotFarmerTicket from "./Views/BotFarmerTicket";
import BotFarmerTicketLogic from "./Logic/Logic";

function BotFarmerTicketPage() {
  const {
    formValues,
    updateState,
    onGridReady,
    getBotFarmerTicketDataList,
    exportClick,
    onClickClearSearchFilter,
    filteredBotFarmerTicketDataList,
    isLoadingBotFarmerTicketDataList,
    onChangeBotFarmerTicketDataList,
    yearList
  } = BotFarmerTicketLogic();

  return (
    <BotFarmerTicket
      formValues={formValues}
      updateState={updateState}
      onGridReady={onGridReady}
      onClickClearSearchFilter={onClickClearSearchFilter}
      getBotFarmerTicketDataList={getBotFarmerTicketDataList}
      filteredBotFarmerTicketDataList={filteredBotFarmerTicketDataList}
      isLoadingBotFarmerTicketDataList={isLoadingBotFarmerTicketDataList}
      onChangeBotFarmerTicketDataList={onChangeBotFarmerTicketDataList}
      exportClick={exportClick}
      yearList={yearList}
    />
  );
}

export default BotFarmerTicketPage;
