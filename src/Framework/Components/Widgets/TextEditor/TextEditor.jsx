// A import React from "react";
// A import { Editor } from "@tinymce/tinymce-react";
// A import { PropTypes } from "prop-types";
// A import LicenseKeys from "Configration/Utilities/LicenseManager/LicenseKeys.json";
// A import "./TextEditor.scss";

// A function TextEditor({ value, onChange, setWordcount, sizeLimit }) {
// A  const charCount = (editor) => editor.getContent({ format: "text" }).length;

// A   const handleInit = (value, editor) => {
// A     setWordcount(charCount(editor));
// A   };

// A   const handleUpdate = (value, editor) => {
// A     const cCount = charCount(editor);
// A     if (cCount <= sizeLimit) {
// A       onChange(value);
// A       if (cCount) {
// A         setWordcount(cCount);
// A       }
// A     }
// A   };

// A   const handleBeforeAddUndo = (evt, editor) => {
// A     if (charCount(editor) > sizeLimit) {
// A       evt.preventDefault();
// A     }
// A   };

// A   return (
// A     <Editor
// A       onInit={handleInit}
// A       apiKey={LicenseKeys.TinyTextEditor}
// A       value={value}
// A       onEditorChange={handleUpdate}
// A       onBeforeAddUndo={handleBeforeAddUndo}
// A       init={{
// A         height: 240,
// A         menubar: false,
// A         plugins: "wordcount",
// A         browser_spellcheck: true,
// A         toolbar:
// A           "undo redo | blocks | underline strikethrough " +
// A           "bold italic | alignleft aligncenter" +
// A           "alignright alignjustify | bullist numlist outdent indent | " +
// A           "removeformat",
// A         content_style:
// A           "body { font-family:font-weight: 500; font-size: 14px; margin: 10px; color: #11344d; } p { margin: 2px 0;font-weight: 500; }  * { margin: 2px 0; }",
// A       }}
// A     />
// A   );
// A }

// A export default TextEditor;

// A TextEditor.propTypes = {
// A   value: PropTypes.node.isRequired,
// A   onChange: PropTypes.func.isRequired,
// A   setWordcount: PropTypes.func.isRequired,
// A   sizeLimit: PropTypes.number.isRequired,
// A };

import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import PropTypes from "prop-types";
import "./TextEditor.scss";

const TextEditor = ({ value, onChange, setWordcount, sizeLimit }) => {
  const [isLimitExceeded, setIsLimitExceeded] = useState(false);

  const charCount = (content) => {
    return content.replace(/<\/?[^>]+(>|$)/g, "").length;
  };

  const handleInit = (editor) => {
    setWordcount(charCount(editor.getHTML()));
  };

  const handleUpdate = (content) => {
    const cCount = charCount(content);
    if (cCount <= sizeLimit) {
      onChange(content);
      setWordcount(cCount);
      setIsLimitExceeded(false);
    } else {
      setIsLimitExceeded(true);
    }
  };

  const handleKeyDown = (e) => {
    debugger;
    if (isLimitExceeded && e.key !== "Backspace" && e.key !== "Delete") {
      e.preventDefault();
    }
  };

  return (
    <ReactQuill
      theme="snow"
      value={value}
      onChange={handleUpdate}
      onInit={handleInit}
      onKeyDown={handleKeyDown}
      modules={{
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          [{ color: ["red", "#785412"] }],
          [{ background: ["red", "#785412"] }],
        ],
      }}
      formats={["header", "font", "bold", "italic", "underline", "strike", "blockquote", "list", "bullet", "script", "indent", "align", "color", "background"]}
      bounds=".ql-editor"
      style={{ height: "240px" }}
    />
  );
};

TextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  setWordcount: PropTypes.func.isRequired,
  sizeLimit: PropTypes.number.isRequired,
};

export default TextEditor;
