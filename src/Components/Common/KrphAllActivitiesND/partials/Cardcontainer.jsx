import React from "react";

const Cardcontainer = ({ children }) => {
  return (
    <div className="container my-3">
      <div className="row">
        <div className="col-md-12">
          <div className="card csc-form-cards">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Cardcontainer;
