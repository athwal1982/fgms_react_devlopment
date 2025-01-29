import React, { useState } from "react";

const Toggleswitch = () => {
  const [isToggled, setIsToggled] = useState(true);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  return (
    <div className="toggle-container" onClick={handleToggle}>
      <span className={isToggled ? "active" : ""}>Generate Ticket</span>
      <span className={isToggled ? "" : "active"}>Premium Calculator</span>
    </div>
  );
};

export default Toggleswitch;
