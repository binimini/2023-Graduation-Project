import {
  drawSelection,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
} from "@codemirror/view";
import { history } from "@codemirror/history";
import { indentOnInput } from "@codemirror/language";
import { highlightActiveLineGutter, lineNumbers } from "@codemirror/gutter";
import { highlightSelectionMatches } from "@codemirror/search";
import { defaultHighlightStyle } from "@codemirror/highlight";
import { basicSetup, EditorView } from "codemirror";
import { markdownKeymap } from "@codemirror/lang-markdown";
import { EditorState, Compartment } from "@codemirror/state";
import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/stream-parser";

import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { liveCodeContentSetter } from "@/store/liveCode";

interface PropType {
  updateHandler: any;
}

const useCodeMirror = ({ updateHandler }: PropType) => {
  const [view, setView] = useState<EditorView | null>(null);
  const [, setliveCodeSetter] = useRecoilState(liveCodeContentSetter);

  const editorRef = useRef();

  const language = new Compartment();
  const extensions = [
    // basicSetup,
    // language.of(python()),
    // keymap.of(markdownKeymap),
    // updateHandler,
    // // lineNumbers(),
    // // highlightActiveLineGutter(),
    // // highlightSpecialChars(),
    // // history(),
    // // drawSelection(),
    // // EditorState.allowMultipleSelections.of(true),
    // // indentOnInput(),
    // // defaultHighlightStyle.fallback,
    // // highlightActiveLine(),
    // // highlightSelectionMatches(),
  ];
  const state = EditorState.create({
    doc: "",
    extensions,
  });

  useEffect(() => {
    if (!view) {
      const view = new EditorView({
        state,
        parent: editorRef.current,
      });
      setView(view);
    }

    setliveCodeSetter({
      func: (code: string) => {
        console.log(code);
        console.log(view);

        view.dispatch({
          changes: [{ from: 0, to: view.state.doc.length, insert: code }],
        });
      },
    });
  }, [view]);

  return { view, editorRef, setView };
};

export default useCodeMirror;
