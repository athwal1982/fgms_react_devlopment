import React from "react";
import { PageBar } from "Framework/Components/Layout";
import PropTypes from "prop-types";
import BizClass from "./Faq.module.scss";
import FaqLogics from "./Logic/Logic";

function Faq() {
  const { openPdfFlie, openPMFBYFaqPdfFile } = FaqLogics();

  return (
    <div className={BizClass.PageStart}>
      <PageBar>
        <PageBar.Button onClick={() => openPMFBYFaqPdfFile("English")}>PMFBY-FAQ-English</PageBar.Button>
        <PageBar.Button onClick={() => openPMFBYFaqPdfFile("Hindi")}>PMFBY-FAQ-Hindi</PageBar.Button>
      </PageBar>

      <div>
        {openPdfFlie === "1" ? (
          <object data={`${process.env.PUBLIC_URL}PMFBY-FAQ-English.pdf`} type="application/pdf" width="100%" height="100%" aria-labelledby="label1" />
        ) : openPdfFlie === "2" ? (
          <object data={`${process.env.PUBLIC_URL}PMFBY-FAQ-Hindi.pdf`} type="application/pdf" width="100%" height="100%" aria-labelledby="label1" />
        ) : null}
      </div>
    </div>
  );
}

export default Faq;

Faq.propTypes = {
  openPdfFlie: PropTypes.string,
  openPMFBYFaqPdfFile: PropTypes.func.isRequired,
};
