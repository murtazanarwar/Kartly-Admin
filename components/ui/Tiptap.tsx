'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

const Tiptap = ({...props}) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Product Description</p>',
  })

  return <EditorContent 
            editor={editor}
        />
}

export default Tiptap