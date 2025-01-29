import { React, useState } from "react";
import { Loader } from "Framework/Components/Widgets";
import { RiUser3Fill } from "react-icons/ri";
import { AiTwotoneLock } from "react-icons/ai";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import classNames from "classnames";
import { MdOutlineRefresh } from "react-icons/md";
import BizClass from "./login.module.scss";
import AddLoginLogics from "./Logic/Logic";
import ForgotPasswordModal from "./ForgotPasswordModal/ForgotPassword";

function Login() {
  const {
    formValues,
    updateState,
    handleLogin,
    SearchByHandleKeyDown,
    formValuesNcip,
    updateStateNcip,
    handleLoginNcip,
    SearchByHandleKeyDownNclip,
    captchaCode,
    createCaptcha,
    captchaCodeNcip,
    createCaptchaNcip,
    activeTab,
    handleTabClick,
    btnLoaderActive,
    btnLoaderActiveNcip,
    showHideLogin,
    isLoadingPage,
  } = AddLoginLogics();
  const [revealPassword, setRevealPassword] = useState(false);
  const [revealPasswordNclip, setRevealPasswordNclip] = useState(false);

  const togglePassword = () => {
    setRevealPassword(!revealPassword);
  };
  const togglePasswordNclip = () => {
    setRevealPasswordNclip(!revealPasswordNclip);
  };

  const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState({});
  const toggleForgotPasswordModal = () => {
    setForgotPasswordModal(!forgotPasswordModal);
    setSelectedUserData();
  };

  return showHideLogin === true ? (
    <>
      {forgotPasswordModal ? <ForgotPasswordModal showfunc={toggleForgotPasswordModal} selectedUserData={selectedUserData} /> : null}
      <div className={BizClass.Box}>
        <div className={BizClass.CenterBox}>
          <div className={BizClass.MainBox}>
            <div className={BizClass.BannerBox}>
              <div className={BizClass.LeftSideClientText}>
                <h4>Pradhan Mantri Fasal Bima Yojana</h4>
                <p>MINISTRY OF AGRICULTURE & FARMERS WELFARE</p>
              </div>
              <img src={`${process.env.PUBLIC_URL}favicon.svg`} alt="Banner" />
            </div>
            <div className={BizClass.Separator} />
            <div className={BizClass.ContentBox}>
              <div className={BizClass.ClientLogo}>
                <div className={BizClass.ClientText}>
                  <h4>Krishi Rakshak Portal & Helpline</h4>
                </div>
              </div>

              <form className={BizClass.SubBox}>
                <h3>Welcome</h3>
                <p>Please Log in to your Account</p>
                <div>
                  <div className={BizClass.LoginTab}>
                    <button
                      type="button"
                      className={activeTab === 0 ? BizClass.ActiveLoginTabButton : BizClass.LoginTabButton}
                      onClick={() => handleTabClick(0)}
                    >
                      KRPH
                    </button>
                    <button
                      type="button"
                      className={activeTab === 1 ? BizClass.ActiveLoginTabButton : BizClass.LoginTabButton}
                      onClick={() => handleTabClick(1)}
                    >
                      NCIP
                    </button>
                  </div>
                  <div>
                    {activeTab === 0 && (
                      <div className={BizClass.InputBox}>
                        <div className={BizClass.InputGroup}>
                          <label>UserName</label>
                          <RiUser3Fill className={BizClass.BoxIcon} />
                          <input
                            type="text"
                            name="txtLoginId"
                            maxLength="10"
                            value={formValues.txtLoginId}
                            onChange={(e) => updateState(e.target.name, e.target.value)}
                            placeholder="Login ID"
                            autoComplete="off"
                          />
                        </div>
                        <div className={BizClass.InputGroup}>
                          <label>Password</label>
                          <AiTwotoneLock className={BizClass.BoxIcon} />
                          <input
                            type={revealPassword ? "text" : "password"}
                            name="txtPassword"
                            value={formValues.txtPassword}
                            onKeyDown={(e) => SearchByHandleKeyDown(e)}
                            onChange={(e) => updateState(e.target.name, e.target.value)}
                            placeholder="6+ strong character"
                            autoComplete="off"
                          />
                          {revealPassword ? (
                            <VscEyeClosed className={BizClass.PassBoxIconClosed} onClick={() => togglePassword()} />
                          ) : (
                            <VscEye className={BizClass.PassBoxIcon} onClick={() => togglePassword()} />
                          )}
                        </div>
                        <div className={BizClass.container}>
                          <div className={BizClass.halfCaptcha}>
                            <div className={BizClass.captchaCss}>
                              <div id="captcha" />
                              <label />
                              <MdOutlineRefresh className={BizClass.RefreshCaptchaBoxIcon} onClick={() => createCaptcha()} />
                            </div>
                          </div>
                          <div className={BizClass.halfInput}>
                            <div className={BizClass.captchaInput}>
                              <input
                                type="text"
                                name="txtCaptchaVal"
                                maxLength="10"
                                value={formValues.txtCaptchaVal}
                                onChange={(e) => updateState(e.target.name, e.target.value)}
                                placeholder="Enter The Captcha"
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>
                        {/* <button type="button" onClick={() => handleLogin(captchaCode)}>
                          Login
                        </button> */}
                        <button
                          type="button"
                          className={classNames(BizClass.ButtonWithLoader, btnLoaderActive ? BizClass.loading : null)}
                          onClick={() => handleLogin(captchaCode)}
                        >
                          Login
                          <span className={BizClass.ButtonLoader} />
                        </button>
                        <span aria-hidden="true" className={BizClass.forgotpassCss} onClick={() => toggleForgotPasswordModal()}>
                          {" "}
                          Forgot Your Passord ?
                        </span>
                      </div>
                    )}
                    {activeTab === 1 && (
                      <div className={BizClass.InputBox}>
                        <div className={BizClass.InputGroup}>
                          <label>Mobile Number</label>
                          <RiUser3Fill className={BizClass.BoxIcon} />
                          <input
                            type="text"
                            name="txtmobileno"
                            maxLength="10"
                            value={formValuesNcip.txtmobileno}
                            onChange={(e) => updateStateNcip(e.target.name, e.target.value.replace(/\D/g, ""))}
                            placeholder="Mobile Number"
                            autoComplete="off"
                          />
                        </div>
                        <div className={BizClass.InputGroup}>
                          <label>Password</label>
                          <AiTwotoneLock className={BizClass.BoxIcon} />
                          <input
                            type={revealPasswordNclip ? "text" : "password"}
                            name="txtPasswordNcip"
                            value={formValuesNcip.txtPasswordNcip}
                            onKeyDown={(e) => SearchByHandleKeyDownNclip(e)}
                            onChange={(e) => updateStateNcip(e.target.name, e.target.value)}
                            placeholder="6+ strong character"
                            autoComplete="off"
                          />
                          {revealPasswordNclip ? (
                            <VscEyeClosed className={BizClass.PassBoxIconClosed} onClick={() => togglePasswordNclip()} />
                          ) : (
                            <VscEye className={BizClass.PassBoxIcon} onClick={() => togglePasswordNclip()} />
                          )}
                        </div>

                        <div className={BizClass.container}>
                          <div className={BizClass.halfCaptcha}>
                            <div className={BizClass.captchaCss}>
                              <div id="captchaNcip" />
                              <label />
                              <MdOutlineRefresh className={BizClass.RefreshCaptchaBoxIcon} onClick={() => createCaptchaNcip()} />
                            </div>
                          </div>
                          <div className={BizClass.halfInput}>
                            <div className={BizClass.captchaInput}>
                              <input
                                type="text"
                                name="txtCaptchaValNcip"
                                maxLength="10"
                                value={formValuesNcip.txtCaptchaValNcip}
                                onChange={(e) => updateStateNcip(e.target.name, e.target.value)}
                                placeholder="Enter The Captcha"
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        </div>

                        {/* <button type="button" onClick={() => handleLoginNcip(captchaCodeNcip)}>
                          Login
                        </button> */}
                        <button
                          type="button"
                          className={classNames(BizClass.ButtonWithLoader, btnLoaderActiveNcip ? BizClass.loading : null)}
                          onClick={() => handleLoginNcip(captchaCodeNcip)}
                        >
                          Login
                          <span className={BizClass.ButtonLoader} />
                        </button>
                        <div className={BizClass.divHeight} />
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className={BizClass.FooterBox}>
            <h4>© 2022 Ministry of Agriculture and Farmers Welfare. All rights reserved.</h4>
          </div>
        </div>
      </div>
    </>
  ) : isLoadingPage ? (
    <Loader />
  ) : null;
}

export default Login;
