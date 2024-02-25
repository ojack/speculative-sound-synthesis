import { createStore } from 'solid-js/store'
import HydraCanvas from './HydraCanvas.jsx'
import DrawingCanvas from './DrawingCanvas.jsx'

function App () {
  const [hydraState, setHydraState] = createStore({
    width: 400,
    height: 400,
    pixelDensity: 1
    // fps:
  })

  // @todo: is it possible to pass all props together?
  const [drawingState, setDrawingState] = createStore({
    width: window.innerWidth,
    height: window.innerHeight,
    pixelDensity: 1,
    fillStyle: 'orange'
    // fps:
  })

  setInterval(() => {
    setDrawingState({ fillStyle: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})` })
  }, 2000)

  window.addEventListener('resize', (e) => {
    // setHydraState({ width: window.innerWidth, height: window.innerHeight })
    setDrawingState({ width: window.innerWidth, height: window.innerHeight })
  })

  // console.log('width is', hydraState.)

  return (
    <>
      <HydraCanvas {...hydraState} />
      {/* <DrawingCanvas width={drawingState.width} height={drawingState.height} fillStyle={drawingState.fillStyle} /> */}
      <DrawingCanvas {...drawingState} />

      <p class="text-4xl text-green-700 text-center py-20">Hello Tailwind!</p>
    </>
  )
}

export default App
