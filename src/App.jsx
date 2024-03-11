import HydraCanvas from './components/HydraCanvas.jsx'
import DrawingCanvas from './components/DrawingCanvas.jsx'
import { createDrawingStore } from './store.js'
import Toolbar from './components/Toolbar.jsx'
import HydraEditor from './components/HydraEditor.jsx'

function App () {
  const { drawingState, setDrawingState, hydraState, setHydraState } = createDrawingStore()

  // set drawing canvas as input to hydra
  const updateHydraSource = (canvas) => {
    console.log('loaded canvas!', canvas)
    setHydraState('s0', canvas)
  }

  return (
    <div style={{ 'background-color': drawingState.backgroundColor }}>
      <div class="flex" >
      <div class="border-2 border-white" >
          <div class="">
            <HydraCanvas {...hydraState} setHydraState={setHydraState} />
          </div>
          {/* <DrawingCanvas width={drawingState.width} height={drawingState.height} fillStyle={drawingState.fillStyle} /> */}
          <div class="top-0 left-0 absolute"> <DrawingCanvas {...drawingState} setDrawingState={setDrawingState} onload={updateHydraSource}/></div>
      </div>
      <div style={{ width: `${drawingState.toolbarWidth}px` }}>
      <HydraEditor setHydraState={setHydraState} errorMessage={hydraState.errorMessage}/>
        <Toolbar {...drawingState} setDrawingState={setDrawingState} setHydraState={setHydraState}/>
      </div>

      </div>
      {/* <div>
        <h1 class="text-4xl text-green-700 text-center py-20">little solid drawing tool</h1>
      </div> */}
    </div>

  )
}

export default App
