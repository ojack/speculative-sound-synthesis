import { createStore } from 'solid-js/store'

export function createDrawingStore () {
// @todo: is it possible to pass all props together?
  const toolbarWidth = 100

  const width = Math.min(600, window.innerWidth - toolbarWidth)
  const height = 600
  const [drawingState, setDrawingState] = createStore({
    width,
    height,
    pixelDensity: 1,
    fillStyle: 'green',
    backgroundColor: '#111111',
    rectWidth: 100,
    currentBrush: 'pencil',
    toolbarWidth
  // fps:
  })

  const [hydraState, setHydraState] = createStore({
    // width: 400,
    // height: 400,
    // pixelDensity: 1,
    width,
    height,
    code: 'osc().out()',
    s0: null,
    errorMessage: 'test error',
    ref: null
    // fps:
  })

  // const actions = { setDrawingState, setHydraState }

  // const hue = 30
  // setInterval(() => {
  //   hue += 2
  //   // console.log(hue)
  //   // setDrawingState({ fillStyle: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})` })
  //   setDrawingState({ fillStyle: `hsl(${hue}, 100%, 50%)` })
  //   // setHydraState({ code: 'osc().modulate(noise(2)).out()' })
  // }, 10)

  // window.addEventListener('resize', (e) => {
  // // setHydraState({ width: window.innerWidth, height: window.innerHeight })
  //   setDrawingState({ width: window.innerWidth - toolbarWidth, height: window.innerHeight })
  // })
  return ({ drawingState, setDrawingState, hydraState, setHydraState })
}
