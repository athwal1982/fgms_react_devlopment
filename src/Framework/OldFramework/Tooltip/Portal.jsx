import ReactDOM from "react-dom";

function Portal(props) {
  return ReactDOM.createPortal(props.children, document.getElementById("BizNextSpiralComponents"));
}

export default Portal;
