import React, { useState } from "react";
import {
  Editor,
  EditorTools,
  EditorUtils,
  ProseMirror,
} from "@progress/kendo-react-editor";
import mySchema from "./schema";
import "@progress/kendo-theme-default/dist/all.css";
import MyFontSizeTool from "./CustomTools/CustomFontSize";

const {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Subscript,
  Superscript,
  ForeColor,
  BackColor,
  CleanFormatting,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  OrderedList,
  UnorderedList,
  Undo,
  Redo,
  FontSize,
  FontName,
  FormatBlock,
  Link,
  Unlink,
  InsertImage,
  ViewHtml,
  InsertTable,
  InsertFile,
  SelectAll,
  Print,
  Pdf,
  AddRowBefore,
  AddRowAfter,
  AddColumnBefore,
  AddColumnAfter,
  DeleteRow,
  DeleteColumn,
  DeleteTable,
  MergeCells,
  SplitCell,
} = EditorTools;

const { EditorView, EditorState } = ProseMirror;

const EditorComponent = ({ onChange, name, value }) => {
  const [editorState, setEditorState] = useState(
    EditorUtils.createDocument(mySchema, value)
  );

  const onEditorStateChange = (event) => {
    setEditorState(event.value);
    onChange({ target: { name, value: event.html } });
  };

  const styles = `
    p {
        color: #53d2fa;
    }
    h1 {
        color:red;
    }
`;

  const onMount = (event) => {
    const { viewProps } = event;
    const { plugins } = viewProps.state;
    // Create a new document using the schema.
    const doc = EditorUtils.createDocument(mySchema, value);

    //custom style
    const iframeDocument = event.dom.ownerDocument;
    const style = iframeDocument.createElement("style");
    style.appendChild(iframeDocument.createTextNode(styles));
    iframeDocument.head.appendChild(style);

    // Return the custom EditorView object that will be used by Editor.
    return new EditorView(
      { mount: event.dom },
      {
        ...event.viewProps,
        state: EditorState.create({ doc, plugins }),
      }
    );
  };

  return (
    <Editor
      tools={[
        [Bold, Italic, Underline, Strikethrough],
        [Subscript, Superscript],
        ForeColor,
        BackColor,
        [CleanFormatting],
        [AlignLeft, AlignCenter, AlignRight, AlignJustify],
        [Indent, Outdent],
        [OrderedList, UnorderedList],
        FontSize,
        MyFontSizeTool,
        FontName,
        FormatBlock,
        [SelectAll],
        [Undo, Redo],
        [Link, Unlink, InsertImage, ViewHtml],
        [InsertTable, InsertFile],
        [Pdf, Print],
        [AddRowBefore, AddRowAfter, AddColumnBefore, AddColumnAfter],
        [DeleteRow, DeleteColumn, DeleteTable],
        [MergeCells, SplitCell],
      ]}
      contentStyle={{ height: 330 }}
      onMount={onMount}
      onChange={onEditorStateChange}
      value={editorState}
    />
  );
};

export default EditorComponent;
