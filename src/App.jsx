import FaustEditor from './FaustEditor.jsx'
import DrawingCanvas from './DrawingCanvas.jsx'
import { createStore } from 'solid-js/store'

function App () {
  const [store, setStore] = createStore({
    // paramCount: 3,
    paramList: ['x', 'y', 'pointerdown'],
    params: {
      x: { val: 100, min: 0, max: 1000 },
      y: { val: 100, min: 0, max: 1000 },
      pointerdown: { val: 0, min: 0, max: 1 }
    }
  })

  return (
    <div class="flex w-full font-mono">
            <DrawingCanvas params={store.params} width={600} height={600} setStore={setStore} />
      <div class="w-full">
      <FaustEditor params={store.params} paramCount={store.paramCount} setStore={setStore}/>
      </div>
</div>
  )
}

export default App
