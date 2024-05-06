import { Show } from 'solid-js'
import FaustEditor from './FaustEditor.jsx'
// import DrawingCanvas from './DrawingCanvas.jsx'
import MatterPhysics from './MatterPhysics.jsx'
import { createStore } from 'solid-js/store'
import { djembe, marimba, feedbackToy, marimbaDelay } from './dsp/faustInstruments.js'

function App () {
  const [store, setStore] = createStore({
    // paramCount: 3,
    // paramList: ['x', 'y', 'pointerdown'],
    params: {
      /* mouse params */
      x: { val: 100, min: 0, max: 1000 },
      y: { val: 100, min: 0, max: 1000 },
      x0: { val: 100, min: 0, max: 1000 },
      y0: { val: 100, min: 0, max: 1000 },
      x1: { val: 100, min: 0, max: 1000 },
      y1: { val: 100, min: 0, max: 1000 },
      pointerdown: { val: 0, min: 0, max: 1 },
      /* collision params */
      isColliding: { val: 0, min: 0, max: 1 },
      depth: { val: 0, min: 0, max: 3 },
      angle: { val: 0, min: -12, max: 12 }
      // tangent: { val: 0, }
    },
    showLanding: true
  })

  return (
    <>
    <Show when={!store.showLanding} fallback={<div onClick={() => { setStore('showLanding', false) }}>start</div>}>
      <div class="w-full font-mono">
        {/* <DrawingCanvas params={store.params} width={600} height={600} setStore={setStore} /> */}
        <MatterPhysics width={600} height={600} setStore={setStore}/>
        <div class="" style={{ width: '1000px' }}>
          <FaustEditor params={store.params} setStore={setStore} dsp={marimba}/>
          {/* <FaustEditor params={store.params} setStore={setStore} dsp={feedbackToy}/> */}

        </div>
      </div>
    </Show>
    </>
  )
}

export default App
