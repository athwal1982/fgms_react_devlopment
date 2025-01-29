import React, { useState, useEffect, useMemo } from "react";
import { AlertMessage } from "Framework/Components/Widgets/Notification/NotificationProvider";
import { setSessionStorage, getSessionStorage } from "Components/Common/Login/Auth/auth";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { AiFillHome, AiFillSetting } from "react-icons/ai";
import { FaTicketAlt, FaQuestionCircle } from "react-icons/fa";
import { GiFarmer } from "react-icons/gi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BsCalculator } from "react-icons/bs";
import { MdOutlineDisabledByDefault } from "react-icons/md";
import { HiOutlineDocumentReport, HiPhotograph } from "react-icons/hi";
import { FiLogOut } from "react-icons/fi";
import BizClass from "./Sidebar.module.scss";
import { getUserRightData } from "../../Modules/Setup/MenuManagement/Services/Methods";
import { logout } from "../../Common/Login/Services/Methods";
import { fetchCallingDashboardlogin, fetchCallingDashboardlogOut } from "./Services/Methods";

function Sidebar() {
  const navigate = useNavigate();
  const userData = getSessionStorage("user");
  const [collapsed, setCollapsed] = useState(true);
  const [subMenuList, setSubMenuList] = useState([]);
  const [menuNodes, setMenuNodes] = useState([]);
  const [activeMenuId, setActiveMenuId] = useState("1");
  const [activeSubMenuId, setActiveSubMenuId] = useState("0");

  const setAlertMessage = AlertMessage();

  const getUserRightDataList = async (pUserID, pMenuMasterID, pMenu, pType) => {
    try {
      const formdata = {
        userID: pUserID,
        menuMasterID: pMenuMasterID,
      };
      const result = await getUserRightData(formdata);
      if (result.response.responseCode === 1) {
        if (result.response.responseData && result.response.responseData.UserProfileRight.length > 0) {
          setSessionStorage("UserRights", result.response.responseData.UserProfileRight);
          if (pType === "Menu") {
            navigate(pMenu.url && pMenu.url);
          } else if (pType === "SubMenu") {
            navigate(pMenu.url);
          }
        } else {
          setSessionStorage("UserRights", []);
          if (pType === "Menu") {
            navigate(pMenu.url && pMenu.url);
          } else if (pType === "SubMenu") {
            navigate(pMenu.url);
          }
        }
      } else {
        setSessionStorage("UserRights", []);
        if (pType === "Menu") {
          navigate(pMenu.url && pMenu.url);
        } else if (pType === "SubMenu") {
          navigate(pMenu.url);
        }
      }
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const getCallingdashboard = async () => {
    let fgmsDashboardUrl = "https://fgms.smartping.io/admin/dashboard";
    if(getSessionStorage("callingDashboard") === null) {
      const result = await fetchCallingDashboardlogin();
      if (result.responseCode === 1) {
        const validTillToken = new Date();
        validTillToken.setMinutes(validTillToken.getMinutes() + 60);
        setSessionStorage("callingDashboard",{resultToken: result.responseData.access_token,validTillToken : validTillToken});
        window.open(fgmsDashboardUrl + `?token=${result.responseData.access_token}`, "_blank");
      } else {
        setAlertMessage({
          type: "error",
          message: result.responseMessage,
        });
      }
    } else {
      const resultCallingDashboard = getSessionStorage("callingDashboard");
      if (resultCallingDashboard.validTillToken) {
        const date = new Date(resultCallingDashboard.validTillToken);
        const now = new Date();
        if (now > date) {
          sessionStorage.removeItem("callingDashboard");
          const result = await fetchCallingDashboardlogOut(resultCallingDashboard.resultToken);
          if (result.responseCode === 1) {
            getCallingdashboard();
          } else {
            setAlertMessage({
              type: "error",
              message: result.responseMessage,
            });
          }
          
        } else {
          window.open(fgmsDashboardUrl + `?token=${resultCallingDashboard.resultToken}`, "_blank");
        }
      }
    }
    
  };

  const toggleMenu = (menu) => {
    setActiveMenuId(menu.menuid);
    if (menu.submenu && menu.submenu.length > 0) {
      setSubMenuList(menu.submenu);
      setCollapsed(false);
    } else {
      setSubMenuList([]);
      setCollapsed(true);
      setActiveSubMenuId("0");
      if(menu.name === "Calling Dashboard") {
        getCallingdashboard();
      } else {
        getUserRightDataList(userData && userData.LoginID ? userData.LoginID : 0, menu.menuMasterID, menu, "Menu");
      }
    }
  };

  const onClickSubMenu = (submenu) => {
    setActiveSubMenuId(submenu.submenuid);
    setCollapsed(true);
    getUserRightDataList(userData && userData.LoginID ? userData.LoginID : 0, submenu.menuMasterID, submenu, "SubMenu");
  };

  const onHomeMenuClick = () => {
    navigate("/welcome");
    setCollapsed(true);
    setActiveMenuId("1");
    setActiveSubMenuId("0");
  };

  const [menus, setMenues] = useState();
  useMemo(async () => {
    const user = getSessionStorage("user");
    setMenues(user.userMenuMaster);
  }, []);

  let menuNodesData = [];

  useEffect(() => {
    if (menus) {
      menuNodesData = [];
      const parent = menus.filter((x) => x.UnderMenuID === 0);
      console.log(parent, "parent");
      parent.forEach((m, i) => {
        const newView = { id: i + 1, name: m.MenuName, url: m.ReactURL, menuMasterID: m.MenuMasterID, submenu: [] };
        menus.forEach((menu, j) => {
          if (menu.UnderMenuID === m.MenuMasterID) {
            newView.submenu.push({
              id: `${i + 1}-${j + 1}`,
              name: menu.MenuName,
              url: menu.ReactURL,
              menuMasterID: menu.MenuMasterID,
            });
          }
        });
        menuNodesData.push(newView);
      });
      setMenuNodes(menuNodesData);
    }
  }, [menus]);

  useEffect(() => {
    if (menuNodes) {
      console.log(menuNodes, "menuNodes");
    }
  }, [menuNodes]);

  const menuIconWithSwitch = (parameter) => {
    switch (parameter) {
      case "Dashboard":
        return <HiPhotograph />;
      case "Ticket":
        return <FaTicketAlt />;
      case "Setup":
        return <AiFillSetting />;
      case "Enquiry":
        return <GiFarmer />;
      case "Notification":
        return <IoIosNotificationsOutline />;
      case "Premium Calculator":
        return <BsCalculator />;
      case "FAQ":
        return <FaQuestionCircle />;
      case "Report":
        return <HiOutlineDocumentReport />;
      case "Calling Dashboard":
          return <HiPhotograph />;
      case "SLA Dashboard":
            return <HiPhotograph />;
      case "Offline Intimation":
              return <FaTicketAlt />;   
      case "Billing Dashboard":
                return <HiPhotograph />;                  
      default:
        return <MdOutlineDisabledByDefault />;
    }
  };

  const signOut = async () => {
    debugger;
    try {
      await logout(userData.LoginID ? userData.LoginID : 0, userData.SessionID ? userData.SessionID : 0);
      sessionStorage.clear();
      navigate("/");
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error,
      });
    }
  };

  const [loginUser, setLoginUser] = useState();
  useEffect(() => {
    setLoginUser(userData.UserDisplayName);
  }, []);

  return (
    <div className={BizClass.Box}>
      <div className={BizClass.MainBox}>
        <div className={BizClass.ClientLogo}>
          <button type="button" onClick={() => onHomeMenuClick()}>
            <img src="https://pmfby.amnex.co.in/krph/public/img/favicon.svg" alt="Client Logo" />
          </button>
        </div>
        <ul>
          {menuNodes &&
            menuNodes.map((data) => {
              return (
                <li key={data.id}>
                  <button type="button" className={activeMenuId === data.id ? BizClass.Active : null} onClick={() => toggleMenu(data)}>
                    {menuIconWithSwitch(data.name)}
                    <span>{data.name}</span>
                  </button>
                </li>
              );
            })}
        </ul>
        <button
          type="button"
          className={BizClass.LogoutBox}
          onClick={() => signOut()}
          title={`UserName : ${loginUser},
Company : ${
            userData.BRHeadTypeID.toString() === "124003"
              ? userData.CompanyName
              : userData.BRHeadTypeID.toString() === "124001" || userData.BRHeadTypeID.toString() === "124002"
              ? userData.UserCompanyType
              : null
          }`}
        >
          <FiLogOut />
        </button>
      </div>
      {collapsed === false && subMenuList && subMenuList.length > 0 ? (
        <>
          <div className={collapsed === false ? BizClass.SubBox : classNames(BizClass.SubBox, BizClass.CollapsedBar)}>
            <ul>
              {subMenuList.map((data) => {
                return (
                  <li key={data.id}>
                    <button type="button" className={activeSubMenuId === data.id ? BizClass.Active : null} onClick={() => onClickSubMenu(data)}>
                      {data.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
          <div role="presentation" className={BizClass.BackDrop} onClick={() => setCollapsed(true)} onKeyDown={() => setCollapsed(true)} />
        </>
      ) : null}
    </div>
  );
}

export default Sidebar;
