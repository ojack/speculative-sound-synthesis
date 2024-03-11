import { createSignal, onMount } from 'solid-js'
// import { EditorView, lineNumbers } from '@codemirror/view'
import CreateHydraEditor from './cm6-editor/editor.js'

// import { hydraEditorTheme } from './hydra-cm6/theme.js'

export default function HydraEditor (props) {
  let editorRef

  const emit = (event, args) => {
    console.log('event', event, args)
    if (event === 'repl: eval') {
      props.setHydraState('code', args)
    }
  }

  onMount(() => {
    const editor = new CreateHydraEditor(editorRef, emit)
  })

  return <div class="w-96">
    <div class="h-96" ref={editorRef} />
    <div class="text-red-500 w-full">{props.errorMessage}</div>
</div>
}
