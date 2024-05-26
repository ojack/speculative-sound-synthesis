import { Show, For } from 'solid-js'
import FaustEditor from './FaustEditor.jsx'
// import DrawingCanvas from './DrawingCanvas.jsx'
import MatterPhysics from './MatterPhysics.jsx'
import { createStore } from 'solid-js/store'
import { fantasyRelationships, fantasyShapes } from './physics/fantasyShapes.js'
import { createConstellationStore } from './stores/constellation.js'
import world from './phantasy-worlds/basic.js'
import Toolbar from './Toolbar.jsx'

function App () {
  const shapeTypes = Object.keys(fantasyShapes)
  const relationshipTypes = Object.keys(fantasyRelationships)

  // older
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
    shapeTypes,
    shapes: fantasyShapes,
    relationshipTypes,
    relationships,
    showLanding: false
  })

  // world.constellations.forEach(constellation => {
  //   constellation.bodies.forEach(body => {
  //     body.params = {
  //       angle: { val: 0, min: 0, max: Math.PI * 2 },
  //       velocity: {
  //         x: { val: 0, min: -10, max: 10 },
  //         y: { val: 0, min: -10, max: 10 }
  //       },
  //       position: {
  //         x: { val: 0, min: 0, max: 1000 },
  //         y: { val: 0, min: 0, max: 10000 }
  //       }
  //     }
  //   })
  // })

  // const [constellationStore, setConstellationStore] = createStore({ constellations: world.constellations })

  const constellations = world.constellations.map((c) => createConstellationStore(c))

  console.log('CONSTELLATIONS', constellations)

  const drawingSettings = Object.assign({}, {
    width: Math.min(window.innerWidth, 600),
    height: 600,
    currentBrush: 'circle',
    backgroundColor: 'black',
    color: 'white'
  }, world.settings)

  const [drawingStore, setDrawingStore] = createStore(drawingSettings)

  window.setDrawingStore = setDrawingStore

  function updateRelationship (pair) {
    // const { bodyA, bodyB } = pair
    // const isColliding = pair.isActive
    // const relationshipLabel = store.shapes[bodyA.label].relationships[bodyB.label]
    // // console.log('updating', pair, bodyA.label, bodyB.label, store.shapes[bodyA.label].relationships, relationshipLabel)
    // // console.log(relationshipLabel, bodyA.label, bodyB.label, relationshipTypes)
    // setStore('relationships', relationshipLabel, 'params', 'isColliding', 'val', isColliding)
    // setStore('relationships', relationshipLabel, 'params', 'depth', 'val', pair.collision.depth)
    // setStore('relationships', relationshipLabel, 'params', 'angle', 'val', pair.bodyA.angle)
    // setStore('relationships', relationshipLabel, 'params', 'x0', 'val', pair.bodyA.position.x)
    // setStore('relationships', relationshipLabel, 'params', 'x1', 'val', pair.bodyB.position.x)
    // setStore('relationships', relationshipLabel, 'params', 'y0', 'val', pair.bodyA.position.y)
    // setStore('relationships', relationshipLabel, 'params', 'y1', 'val', pair.bodyB.position.y)
  }

  return (
    <>
    <Show when={!store.showLanding} fallback={<div onClick={() => { setStore('showLanding', false) }}>start</div>}>
      <div class="w-full font-mono flex" style={{ 'background-color': drawingStore.backgroundColor, color: drawingStore.color }}>
        {/* <DrawingCanvas params={store.params} width={600} height={600} setStore={setStore} /> */}
        <div class="felx flex-col">
        <MatterPhysics {...drawingStore} {...store} updateRelationship={updateRelationship} setStore={setStore} constellations={constellations} />
        <Toolbar {...drawingStore} setDrawingStore={setDrawingStore} />
        </div>
        <div class="overflow-x-scroll" style={{ }}>
          {/* <For each={store.relationshipTypes}>{(type, i) =>
          <FaustEditor {...drawingStore} params={store.relationships[type].params} setStore={setStore} dsp={store.relationships[type].dsp} />
        }</For> */}
         <For each={constellations}>{(constellation, i) =>
          <FaustEditor {...drawingStore} params={[]} setStore={setStore} dsp={constellation.store.dsp} constellation={constellation}/>
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
