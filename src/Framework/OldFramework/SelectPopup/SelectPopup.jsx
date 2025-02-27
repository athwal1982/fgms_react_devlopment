import React, { useState, useEffect, useRef } from "react";
import BizClass from "./DynBiz_SelectPopup.module.scss";
import { FaTimes } from "react-icons/fa";
import Draggable from "react-draggable";

function SelectPopup(props) {
  const { varient = "top", PopupTitle, children, SearchBox, ...rest } = props;
  const [isModalAnimOpen, setModalAnimOpen] = useState(false);

  const keyDownHander = (e) => {
    if (e.shiftKey && e.keyCode == 27) {
      props.togglepopup();
    }
  };

  const toggleModalAnimOpen = () => {
    setModalAnimOpen(true);
    setTimeout(() => {
      setModalAnimOpen(false);
    }, 100);
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDownHander, false);
  }, []);

  return (
    <React.Fragment>
      <div onClick={toggleModalAnimOpen} className={isModalAnimOpen ? `${BizClass.overlay}` : `${BizClass.overlay} ${BizClass.AnimOn}`}></div>
      <Draggable handle="#handle">
        <div className={BizClass.toppopup}>
          <header id="handle" className={BizClass.Header}>
            <h2>{PopupTitle}</h2>
            <a className={BizClass.HeaderCloseBtn} onClick={() => props.togglepopup()}>
              <FaTimes className={BizClass.Icon} />
            </a>
          </header>
          <form className={BizClass.FormTagContent} {...rest}>
            <React.Fragment>{props.children}</React.Fragment>
          </form>
        </div>
      </Draggable>
    </React.Fragment>
  );
}

export default SelectPopup;

export const SelectPopupContent = (props) => {
  const { children, ...rest } = props;
  const [search, setSearch] = useState({
    cursor: 0,
    result: [],
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
  }, []);

  useEffect(() => {
    const mappedData = props.children.map((data, i) => {
      return {
        ...data,
        ref: React.createRef(),
      };
    });
    setSearch({
      ...search,
      result: mappedData,
    });
  }, []);

  const handleKeyDown = (e) => {
    const { cursor, result } = search;
    if (e.keyCode === 38 && cursor > 0) {
      e.preventDefault();
      setSearch({
        ...search,
        cursor: search.cursor - 1,
      });
      const selectedData = search.result[search.cursor - 1];
      if (selectedData && selectedData.ref.current)
        selectedData.ref.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
    } else if (e.keyCode === 40 && cursor < result.length - 1) {
      e.preventDefault();
      setSearch({
        ...search,
        cursor: search.cursor + 1,
      });
      const selectedData = search.result[search.cursor + 1];
      if (selectedData && selectedData.ref.current)
        selectedData.ref.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
    } else if (e.keyCode === 13) {
      e.preventDefault();
      props.togglepopup();
    }
  };

  return (
    <div className={BizClass.AddressBox} {...rest}>
      {props.children}
    </div>
  );
};

export const SelectAddressCard = (props) => {
  const { children, AddressTitle, AddressBody, onClick, Focusref, ...rest } = props;

  // const firstChildRef = useRef();

  // useEffect(() => {
  //   if (firstChildRef.current) {
  //     firstChildRef.current.focus()
  //   }
  // }, [])

  return (
    <React.Fragment>
      <div className={BizClass.AddressMainBox}>
        <input onClick={onClick} type="radio" name="DynBiz_RadioClick" {...rest} />
        <div className={BizClass.AddressCard}>
          <h4>{AddressTitle}</h4>
          <p>{`${AddressBody}`}</p>
        </div>
      </div>
    </React.Fragment>
  );
};
