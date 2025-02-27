import React, { useState } from "react";
import "./NoResultFound.scss";

function NoRowsToShow(props) {
  const { Title, children, ...rest } = props;

  return (
    <React.Fragment>
      <td colSpan="24" style={{ textAlign: "center" }}>
        No Rows To Show
      </td>
    </React.Fragment>
  );
}

export default NoRowsToShow;
