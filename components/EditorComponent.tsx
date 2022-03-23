import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import Paragraph from "@tiptap/extension-paragraph";
import History from "@tiptap/extension-history";

import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";
import { useEditorState } from "../context/AppContext";

import { Screenplay } from "./extensions/Screenplay";
import { exportToPDF } from "../src/converters/scriptio_to_pdf";

const EditorComponent = ({ setActiveTab }: any) => {
  const editorView = useEditor({
    extensions: [
      // default
      Document,
      Text,
      History,

      // scriptio
      Screenplay,
    ],

    // update active on caret update
    onSelectionUpdate({ editor, transaction }) {
      const currNode = transaction.curSelection.$anchor.path[3].attrs.class;
      setActiveTab(currNode);
    },

    content: '<p class="action">Ceci est un test, un test, un test</p>',
    autofocus: "end",
  });

  editorView?.setOptions({
    editorProps: {
      handleKeyDown(view: any, event: any) {
        const node = view.state.selection.$anchor.parent;
        const currNode = node.attrs.class;
        if (event.key === "Enter") {
          setTimeout(() => setActiveTab("action"), 20);
          if (currNode === "character" || currNode === "parenthetical") {
            clearTimeout();
            setTimeout(() => setActiveTab("dialogue"), 20);
          } else if (currNode === "dialogue" && node.content.size !== 0) {
            clearTimeout();
            setTimeout(() => setActiveTab("character"), 20);
          }
        } else if (event.key === "$") {
          exportToPDF("eiyho", "Hugo", editor?.getJSON()!);
        }

        return false;
      },
    },
  });

  const { editor, updateEditor } = useEditorState();

  useEffect(() => {
    updateEditor(editorView!);
  });

  return (
    <div id="editor">
      <EditorContent editor={editorView} />
    </div>
  );
};

export default EditorComponent;
