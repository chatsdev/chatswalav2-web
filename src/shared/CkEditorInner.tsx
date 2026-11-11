/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import type { DecoupledEditor as DecoupledEditorType } from "@ckeditor/ckeditor5-editor-decoupled";
import "ckeditor5/ckeditor5.css";

type EditorModules = {
  CKEditor: any;
  DecoupledEditor: typeof DecoupledEditorType;
  plugins: any[];
};

const CKEditorInner = ({ value, onChange, onReady, placeholder, minHeight = "560px" }: any) => {
  const { t } = useTranslation();
  const [editor, setEditor] = useState<EditorModules | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([import("@ckeditor/ckeditor5-react"), import("ckeditor5")]).then(
      ([
        { CKEditor },
        {
          DecoupledEditor,
          Essentials,
          Paragraph,
          Bold,
          Italic,
          Heading,
          Link,
          List,
          BlockQuote,
          Table,
          TableToolbar,
          Alignment,
          FontColor,
          FontBackgroundColor,
          Strikethrough,
          Underline
        },
      ]) => {
        setEditor({
          CKEditor,
          DecoupledEditor: DecoupledEditor as unknown as typeof DecoupledEditorType,
          plugins: [
            Essentials,
            Paragraph,
            Bold,
            Italic,
            Heading,
            Link,
            List,
            BlockQuote,
            Table,
            TableToolbar,
            Alignment,
            FontColor,
            FontBackgroundColor,
            Strikethrough,
            Underline
          ],
        });
      }
    );
  }, []);

  const { CKEditor, DecoupledEditor, plugins } = editor || {};

  return (
    <div 
      className="flex flex-col w-full rounded-lg overflow-hidden border border-gray-100 dark:border-(--card-border-color) bg-white dark:bg-(--card-color)"
      style={{ "--ck-min-height": minHeight } as React.CSSProperties}
    >
      {editor ? (
        <>
          <div ref={toolbarRef} className="ck-toolbar-container border-b border-gray-100 dark:border-(--card-border-color) bg-gray-50/50 dark:bg-(--dark-sidebar) p-1" />
          <div className="flex-1 flex flex-col" ref={editorRef}>
            <CKEditor
              editor={DecoupledEditor as any}
              data={value}
              onReady={(editorInstance: any) => {
                if (onReady) onReady(editorInstance);
                if (toolbarRef.current && editorInstance.ui.view.toolbar?.element) {
                  toolbarRef.current.innerHTML = "";
                  toolbarRef.current.appendChild(editorInstance.ui.view.toolbar.element);
                }
              }}
              onChange={(_event: any, editorInstance: any) => {
                const data = editorInstance.getData();
                onChange(data);
              }}
              config={{
                licenseKey: "GPL",
                plugins: plugins,
                placeholder: placeholder || t("start_typing_content", { defaultValue: "Start typing..." }),
                toolbar: [
                  "heading", "|",
                  "bold", "italic", "strikethrough", "underline", "fontColor", "fontBackgroundColor", "|",
                  "link", "|",
                  "bulletedList", "numberedList", "|",
                  "blockQuote", "insertTable", "|",
                  "alignment", "|",
                  "undo", "redo",
                ],
              }}
            />
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center min-h-[160px] text-gray-400 text-xs font-medium animate-pulse">
          {t("loading_editor", { defaultValue: "Loading editor" })}...
        </div>
      )}
    </div>
  );
};

export default CKEditorInner;
