// import Quill from 'quill';
import Quill from 'quill';
import ImageResize from 'quill-image-resize-module-react';
import QuillBetterTable from 'quill-better-table'
import React, { useEffect } from 'react';
import 'quill/dist/quill.snow.css';
import 'quill-better-table/dist/quill-better-table.css';

export default function Editor(props) {
  const editorStyle = {
    borderRadius: '5px' 
  }
  useEffect(() => {
    // Quill.register('modules/imageResize', ImageResize);
    var options = {
      formats: [
        "bold", "font", "code", "italic", "link",
        "size", "strike", "script", "underline",
        "blockquote", "header", "indent", "list",
        "align", "direction", "code-block",
        "formula", "image", "video"
      ],
      modules: {
        toolbar: [
          [{ header: [1, 2, false] }],
          ['bold', 'italic', 'underline'],
          ['image', 'code-block'],
          [{ 'direction': 'rtl'}],
          [{ 'align': ['', 'center', 'right'] }],
        ],
        imageResize: { 
          modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]
        },
        keyboard: {
          bindings: QuillBetterTable.keyboardBindings
        },
        'better-table': {
          operationMenu: {
            items: {
              unmergeCells: {
                text: 'Another unmerge cells name'
              }
            }
          }
        },
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'  // or 'bubble'
    };
    console.log(Quill);
    Quill.register('modules/imageResize', ImageResize);
    Quill.register({
      'modules/better-table': QuillBetterTable
    }, true);
    let editor = new Quill(document.getElementById("editor-container"), options)
    props.setQuill(editor);
  }, [])
  return (
    <div id="editor-container" className="bg-dark text-light" style={editorStyle}></div>
  )
}