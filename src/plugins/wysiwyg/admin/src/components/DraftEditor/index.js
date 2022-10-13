import React, { useState, useRef, useEffect } from "react";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
  Modifier,
  BlockMapBuilder,
} from "draft-js";
import Mammoth from "mammoth";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import { Editor } from "react-draft-wysiwyg";
import "../../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { read, utils } from "xlsx";
import "./styles.css";

const WordImport = ({ saveEditor }) => {
  const inputRef = useRef(null);

  const handleOpenFileInput = () => {
    inputRef.current.click();
  };

  const handleFileSelect = (event) => {
    readFileInputEventAsArrayBuffer(event, (arrayBuffer) => {
      Mammoth.convertToHtml({ arrayBuffer: arrayBuffer })
        .then((res) => {
          saveEditor(res.value);
        })
        .done();
    });
  };

  const readFileInputEventAsArrayBuffer = (event, callback) => {
    const file = event.target.files[0];
    if (file != null) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const arrayBuffer = loadEvent.target.result;
        callback(arrayBuffer);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="rdw-history-wrapper">
      <div className="rdw-option-wrapper">
        <input
          onChange={handleFileSelect}
          type="file"
          ref={inputRef}
          defaultValue="Reset"
          value=""
          style={{ display: "none" }}
          // multiple={false}
        />
        <span onClick={handleOpenFileInput}> Import Word </span>
      </div>
    </div>
  );
};

const getRowsCols = (data) => {
  const arrays = data.map((el) => {
    const rows = utils.sheet_to_json(el, { header: 1 });
    return rows;
  });
  const code = arrays.map((el) => {
    var table_output = "<table>";

    for (var row = 0; row < el.length; row++) {
      table_output += "<tr>";

      for (var cell = 0; cell < el[row].length; cell++) {
        if (row == 0) {
          table_output += "<th>" + el[row][cell] + "</th>";
        } else {
          table_output += "<td>" + el[row][cell] + "</td>";
        }
      }

      table_output += "</tr>";
    }

    return (table_output += "</table>");
  });
  return code.join("");
};

const ExcelImport = ({ saveEditor }) => {
  const inputRef = useRef(null);

  const handleOpenFileInput = () => {
    inputRef.current.click();
  };

  const [state, setState] = useState([]);

  useEffect(() => {
    if (state.length > 0) {
      const elemArr = getRowsCols(state);
      saveEditor(elemArr);
    }
  }, [state]);

  const handleFileSelect = async (ev) => {
    setState([]);
    const file = await ev.target.files?.[0]?.arrayBuffer();
    const data = read(file);
    for (const [_, value] of Object.entries(data.Sheets)) {
      setState((oldValue) => [...oldValue, value]);
    }
  };

  return (
    <div className="rdw-history-wrapper">
      <div className="rdw-option-wrapper">
        <input
          onChange={handleFileSelect}
          type="file"
          ref={inputRef}
          defaultValue="Reset"
          value=""
          style={{ display: "none" }}
          // multiple={false}
        />
        <span onClick={handleOpenFileInput}> Import Excel </span>
      </div>
    </div>
  );
};

// TODO: ADD LOCALE && LOCALAZATION
// to read locale use useIntl() hook from 'react-intl' package
// https://github.com/jpuri/react-draft-wysiwyg/blob/master/src/i18n/en.js
// https://jpuri.github.io/react-draft-wysiwyg/#/docs
const EditorComponent = ({ onChange, name, value }) => {
  let editorDataState;

  if (value) {
    const contentDataState = ContentState.createFromBlockArray(
      htmlToDraft(value)
    );
    editorDataState = EditorState.createWithContent(contentDataState);
  } else {
    editorDataState = EditorState.createEmpty();
  }

  const [editorState, setEditorState] = useState(editorDataState);

  const onEditorStateChange = (editorStateData) => {
    setEditorState(editorStateData);
    const data = draftToHtml(convertToRaw(editorStateData.getCurrentContent()));
    onChange({ target: { name, value: data } });
  };

  const saveEditor = (el) => {
    const htmlContent = convertFromHTML(el);
    const currentContent = editorState.getCurrentContent(),
      currentSelection = editorState.getSelection();
    const htmlContentMap = BlockMapBuilder.createFromArray(
      htmlContent.contentBlocks
    );
    const newContent = Modifier.replaceWithFragment(
      currentContent,
      currentSelection,
      htmlContentMap
    );
    const newEditorState = EditorState.push(
      editorState,
      newContent,
      "insert-characters"
    );
    const data = draftToHtml(convertToRaw(newEditorState.getCurrentContent()));
    setEditorState(
      EditorState.forceSelection(newEditorState, newContent.getSelectionAfter())
    );
    onChange({ target: { name, value: data } });
  };

  return (
    <Editor
      editorState={editorState}
      onEditorStateChange={onEditorStateChange}
      toolbar={{
        options: [
          "inline",
          "blockType",
          "fontSize",
          "fontFamily",
          "list",
          "textAlign",
          "colorPicker",
          "link",
          "embedded",
          "image",
          "emoji",
          // "remove",
          "history",
        ],
      }}
      editorClassName="editor-styles"
      toolbarClassName="toolbar-styles"
      toolbarCustomButtons={[
        <WordImport saveEditor={saveEditor} />,
        <ExcelImport saveEditor={saveEditor} />,
      ]}
    />
  );
};

export default EditorComponent;
