import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import Portal from "./Portal";

const StyledTooltip = styled.span.attrs((p) => ({}))`
  position: fixed;
  display: inline-block;
  top: ${(p) => (p.show ? p.posRef.current.y : 1000000000)}px;
  left: ${(p) => (p.show ? p.posRef.current.x : 1000000000)}px;
  z-index: ${(p) => (p.show ? 99999 : -99999)};
  opacity: ${(p) => p.show};
  transition-property: transform, opacity !important;
  transition-duration: 0.06s !important;
  transition-timing-function: cubic-bezier(0, 0, 0.2, 1) !important;
  transition-delay: ${(p) => (p.show ? p.delay : 0.02)}s !important;
  transform-origin: ${(p) => position(p.placment).negate()};
  transform: scale(${(p) => (p.show ? 1 : 0.7)});
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
      case "left":
        pt.x = elRect.left - (tt.offsetWidth + space);
        pt.y = elRect.top + (el.offsetHeight - tt.offsetHeight) / 2;
        break;
      case "right":
        pt.x = elRect.right + space;
        pt.y = elRect.top + (el.offsetHeight - tt.offsetHeight) / 2;
        break;
      case "top":
        pt.x = elRect.right + 6;
        pt.y = elRect.top - tt.offsetHeight + 10;
        break;
      default:
        pt.x = elRect.right + 6;
        pt.y = elRect.bottom - 10;
    }

    if (recurCount < 3)
      if ((pos.isHorizontal() && (pt.x < bdys.l || pt.x > bdys.r)) || (pos.isVertical() && (pt.y < bdys.t || pt.y > bdys.b))) {
        pt.reset(recursive(pos.negate()));
      }
    pt.restrictRect(bdys);
    return pt;
  })(placement);
};

function ContextMenu({ placement = "bottom", space = 6, children }) {
  const [show, setShow] = useState(0);
  const posRef = useRef({ x: 0, y: 0 });
  const tooltipRefMain = useRef();
  const tooltipRefSub = useRef();

  const handleMOver = (e) => {
    setShow(1);
    posRef.current = getPoint(e.currentTarget, tooltipRefSub.current, placement, space);
  };

  function useOnClickOutside(tooltipRefMain, tooltipRefSub, handler) {
    useEffect(() => {
      const listener = (event) => {
        if (!tooltipRefMain.current || tooltipRefMain.current.contains(event.target)) {
          return;
        }
        if (!tooltipRefSub.current || tooltipRefSub.current.contains(event.target)) {
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
    }, [tooltipRefMain, tooltipRefSub, handler]);
  }

  useOnClickOutside(tooltipRefMain, tooltipRefSub, () => {
    setShow(0);
  });

  return (
    <React.Fragment>
      {children
        ? React.cloneElement(children[0], {
            onClick: handleMOver,
            ref: tooltipRefMain,
          })
        : null}
      <Portal>
        <StyledTooltip ref={tooltipRefSub} posRef={posRef} show={show}>
          <div className={"DynBiz_ContextMenu"} style={{ position: "initial" }}>
            {children.map((x, i) => {
              {
                return (
                  <div key={i} onClick={() => setShow(0)}>
                    {children[i + 1]}
                  </div>
                );
              }
            })}
          </div>
        </StyledTooltip>
      </Portal>
    </React.Fragment>
  );
}

export default ContextMenu;
