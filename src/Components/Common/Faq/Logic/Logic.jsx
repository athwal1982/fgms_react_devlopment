import { useState } from "react";

function FaqLogics() {
  const [openPdfFlie, setopenPdfFlie] = useState("");

  const openPMFBYFaqPdfFile = (fileName) => {
    if (fileName === "English") {
      setopenPdfFlie("1");
    } else if (fileName === "Hindi") {
      setopenPdfFlie("2");
    }
  };

  return {
    openPdfFlie,
    openPMFBYFaqPdfFile,
  };
}
export default FaqLogics;
