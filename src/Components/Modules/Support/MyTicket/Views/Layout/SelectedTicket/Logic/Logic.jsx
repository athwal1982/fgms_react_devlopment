import { useState } from "react";

function Logic() {
  const [mactive, setmactive] = useState("1");

  return {
    mactive,
    setmactive,
  };
}

export default Logic;
