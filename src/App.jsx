import { Show, For } from 'solid-js'
import FaustEditor from './FaustEditor.jsx'
// import DrawingCanvas from './DrawingCanvas.jsx'
import MatterPhysics from './MatterPhysics.jsx'
import { createStore } from 'solid-js/store'
import { djembe, marimba, feedbackToy, marimbaDelay } from './dsp/faustInstruments.js'
import { fantasyRelationships, fantasyShapes } from './physics/fantasyShapes.js'

function App () {
  const shapeTypes = Object.keys(fantasyShapes)
  const relationshipTypes = Object.keys(fantasyRelationships)

  const relationships = {}
  relationshipTypes.forEach((type) => {
    relationships[type] = Object.assign({}, {
      params: {
        isColliding: { val: 0, min: 0, max: 1 },
        depth: { val: 0, min: 0, max: 3 },
        angle: { val: 0, min: -12, max: 12 },
        x: { val: 100, min: 0, max: 1000 },
        y: { val: 100, min: 0, max: 1000 },
        x0: { val: 100, min: 0, max: 1000 },
        y0: { val: 100, min: 0, max: 1000 },
        x1: { val: 100, min: 0, max: 1000 },
        y1: { val: 100, min: 0, max: 1000 },
        pointerdown: { val: 0, min: 0, max: 1 }
      }
    }, fantasyRelationships[type])
  })

  // use getters and setters for store? https://www.solidjs.com/docs/latest#getters
  const [store, setStore] = createStore({
    // paramCount: 3,
    // paramList: ['x', 'y', 'pointerdown'],
    // params: {
    //   /* mouse params */
    //   x: { val: 100, min: 0, max: 1000 },
    //   y: { val: 100, min: 0, max: 1000 },
    //   x0: { val: 100, min: 0, max: 1000 },
    //   y0: { val: 100, min: 0, max: 1000 },
    //   x1: { val: 100, min: 0, max: 1000 },
    //   y1: { val: 100, min: 0, max: 1000 },
    //   pointerdown: { val: 0, min: 0, max: 1 },
    //   /* collision params */
    //   isColliding: { val: 0, min: 0, max: 1 },
    //   depth: { val: 0, min: 0, max: 3 },
    //   angle: { val: 0, min: -12, max: 12 }
    //   // tangent: { val: 0, }
    // },
    shapeTypes,
    shapes: fantasyShapes,
    relationshipTypes,
    relationships,
    showLanding: true
  })

  function updateRelationship (pair, isColliding = false) {
    const { bodyA, bodyB } = pair
    const relationshipLabel = store.shapes[bodyA.label].relationships[bodyB.label]
    //  console.log('updating', pair, bodyA.label, bodyB.label, store.shapes[bodyA.label].relationships, relationshipLabel)

    setStore('relationships', relationshipLabel, 'params', 'isColliding', 'val', isColliding)
    setStore('relationships', relationshipLabel, 'params', 'depth', 'val', pair.collision.depth)
    setStore('relationships', relationshipLabel, 'params', 'angle', 'val', pair.bodyA.angle)

    // props.setStore('params', 'depth', 'val', pair.collision.depth)
    //   props.setStore('params', 'angle', 'val', pair.bodyA.angle)
  }

  return (
    <>
    <Show when={!store.showLanding} fallback={<div onClick={() => { setStore('showLanding', false) }}>start</div>}>
      <div class="w-full font-mono">
        {/* <DrawingCanvas params={store.params} width={600} height={600} setStore={setStore} /> */}
        <MatterPhysics width={600} height={600} updateRelationship={updateRelationship} setStore={setStore} store={store}/>
        <div class="" style={{ width: '1000px' }}>
        <For each={store.relationshipTypes}>{(type, i) =>
        <FaustEditor params={store.relationships[type].params} setStore={setStore} dsp={store.relationships[type].dsp}/>
      }</For>
          {/* <FaustEditor params={store.params} setStore={setStore} dsp={marimba}/> */}
          {/* <FaustEditor params={store.params} setStore={setStore} dsp={feedbackToy}/> */}

        </div>
      </div>
    </Show>
    </>
  )
}

export default App
