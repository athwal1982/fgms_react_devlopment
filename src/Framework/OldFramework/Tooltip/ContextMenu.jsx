import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Portal from "./Portal";

const StyledTooltip = styled.span`
  position: fixed;
  top: ${(p) => p.posRef.current.y}px;
  left: ${(p) => p.posRef.current.x}px;
  z-index: ${(p) => p.show};
  opacity: ${(p) => p.show};
`;
const position = (p) => ({
  current: p,
  negate() {
    if (this.current === "left") return "right";
    if (this.current === "right") return "left";
    if (this.current === "top") return "bottom";
    if (this.current === "bottom") return "top";
  },
  isHorizontal() {
    return this.current === "left" || this.current === "right";
  },
  isVertical() {
    return this.current === "top" || this.current === "bottom";
  },
});

const point = () => ({
  x: null,
  y: null,
  reset(p) {
    this.x = p.x;
    this.y = p.y;
  },
  restrictRect(rect) {
    if (this.x < rect.l) this.x = rect.l;
    else if (this.x > rect.r) this.x = rect.r;
    if (this.y < rect.t) this.y = rect.t;
    else if (this.y > rect.b) this.y = rect.b;
  },
});

const getPoint = (el, tt, placement, space) => {
  let recurCount = 0;
  const pt = point();
  const bdys = {
    l: space,
    t: space,
    r: document.body.clientWidth - (tt.clientWidth + space),
    b: window.innerHeight - (tt.clientHeight + space),
  };
  const elRect = el.getBoundingClientRect();

  return (function recursive(placement) {
    recurCount++;
    const pos = position(placement);
    switch (pos.current) {
      default:
        pt.x = elRect.right + space;
        pt.y = elRect.top / 1.2;
        break;
    }

    if (recurCount < 3)
      if ((pos.isHorizontal() && (pt.x < bdys.l || pt.x > bdys.r)) || (pos.isVertical() && (pt.y < bdys.t || pt.y > bdys.b))) {
        pt.reset(recursive(pos.negate()));
      }

    pt.restrictRect(bdys);

    return pt;
  })(placement);
};

function ContextMenu({ placement = "left", space = 10, Close = true, children }) {
  const [show, setShow] = useState(0);
  const posRef = useRef({ x: 10000, y: 100000 });
  const tooltipRef = useRef();
  const tooltipRefV2 = useRef();

  function useOnClickOutside(tooltipRef, tooltipRefV2, handler) {
    useEffect(() => {
      const listener = (event) => {
        if (!tooltipRef.current || tooltipRef.current.contains(event.target)) {
          return;
        }
        if (!tooltipRefV2.current || tooltipRefV2.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [tooltipRef, tooltipRefV2, handler]);
  }

  useOnClickOutside(tooltipRef, tooltipRefV2, () => {
    setShow(0);
  });

  const handleMOver = (e) => {
    setShow(1);
    posRef.current = getPoint(e.currentTarget, tooltipRef.current, placement, space);
  };

  return (
    <React.Fragment>
      {React.cloneElement(children[0], {
        onClick: handleMOver,
        ref: tooltipRef,
      })}
      {show ? (
        <Portal>
          <StyledTooltip ref={tooltipRefV2} posRef={posRef} show={show}>
            <div className={"DynBiz_ContextMenu"} style={{ position: "initial" }}>
              {children.map((x, i) => {
                {
                  return <div onClick={() => setShow(0)}>{children[i + 1]}</div>;
                }
              })}
            </div>
          </StyledTooltip>
        </Portal>
      ) : null}
    </React.Fragment>
  );
}

export default ContextMenu;
