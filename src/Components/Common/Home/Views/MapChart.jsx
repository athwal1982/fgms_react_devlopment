import React from "react";
import DatamapsIndia from "react-datamaps-india";

function onHoverTicketData(value) {
  debugger;
  console.log("anil");
  return (
    <div>
      <div>Open: {value.value.open ? value.value.open : 0}</div>
      <div>Resolved: {value.value.resolved ? value.value.resolved : 0}</div>
      {value.value.StateName ? <div>State: {value.value.StateName ? value.value.StateName : ""}</div> : ""}
    </div>
  );
}

function MapChart() {
  return (
    <div style={{ height: "85vh", fontSize: "1rem" }}>
      <DatamapsIndia
        regionData={{
          Chhattisgarh: {
            open: 12,
            resolved: 15,
            StateName: "Chhattisgarh",
          },
          Haryana: {
            open: 22,
            resolved: 10,
            StateName: "Haryana",
          },
          "Madhya Pradesh": {
            open: 22,
            resolved: 5,
            StateName: "Madhya Pradesh",
          },
          "West Bengal": {
            open: 52,
            resolved: 25,
            StateName: "West Bengal",
          },
          Odisha: {
            open: 42,
            resolved: 20,
            StateName: "Odisha",
          },
        }}
        hoverComponent={onHoverTicketData}
        mapLayout={{
          title: "",
          legendTitle: "",
          startColor: "#FFC1C1",
          endColor: "#FFC1C1",
          hoverTitle: "Count",
          noDataColor: "#d7ecf5",
          borderColor: "#7f8487",
          hoverBorderColor: "#7f8487",
          hoverColor: "#FFC1C1",
          height: 40,
          weight: 10,
        }}
      />
    </div>
  );
}
export default MapChart;
