import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMatch, useNavigate } from "react-router-dom";
import Logic from "./Logic/Logic";
import BizClass from "./TicketTabList.module.scss";

function TicketTabList() {
  const navigate = useNavigate();
  const { mactive, setmactive } = Logic();

  const setMenumactive = (Menu) => {
    setmactive(Menu);
    if (Menu !== "5") {
      navigate("/MyTicket", { state: Menu });
    } else {
      navigate("/ManageTicket");
    }
  };

  const match = useMatch({ path: "/MyTicket" });

  return (
    <div className={BizClass.Box} style={{ display: "none" }}>
      <ul>
        <li className={match && mactive === "1" ? BizClass.Active : null}>
          <button type="button" onClick={() => setMenumactive("1")}>
            Ticket <span>#1</span>
          </button>
          <IoCloseSharp />
        </li>
        <li className={match && mactive === "2" ? BizClass.Active : null}>
          <button type="button" onClick={() => setMenumactive("2")}>
            Ticket <span>#2</span>
          </button>
          <IoCloseSharp />
        </li>
        <li className={match && mactive === "3" ? BizClass.Active : null}>
          <button type="button" onClick={() => setMenumactive("3")}>
            Ticket <span>#3</span>
          </button>
          <IoCloseSharp />
        </li>
        <li className={match && mactive === "4" ? BizClass.Active : null}>
          <button type="button" onClick={() => setMenumactive("4")}>
            Ticket <span>#4</span>
          </button>
          <IoCloseSharp />
        </li>
      </ul>
    </div>
  );
}

export default TicketTabList;
