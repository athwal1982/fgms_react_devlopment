import { useState } from "react";
import moment from "moment";
import { dateToSpecificFormat } from "Configration/Utilities/dateformat";

function TrainingReportLogic() {
  const [formValues, setFormValues] = useState({
    txtFromDate: dateToSpecificFormat(moment().subtract(1, "days"), "YYYY-MM-DD"),
    txtToDate: dateToSpecificFormat(moment().subtract(0, "days"), "YYYY-MM-DD"),
  });

  const [gridApi, setGridApi] = useState();
  const onGridReady = (params) => {
    console.log(params.api);
    setGridApi(params.api);
  };

  const updateState = (name, value) => {
    debugger;
    setFormValues({ ...formValues, [name]: value });
  };

  const onClickClearSearchFilter = () => {
    setFormValues({
      ...formValues,
      txtFromDate: "",
      txtToDate: "",
    });
  };
  const onSearch = () => {};
  const onSelect = () => {};
  const onExport = () => {};
  return {
    formValues,
    updateState,
    onGridReady,
    gridApi,
    onExport,
    onSelect,
    onSearch,
    onClickClearSearchFilter,
  };
}

export default TrainingReportLogic;
