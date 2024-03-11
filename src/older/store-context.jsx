import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

const DrawingContext = createContext()

export const DrawingProvider = (props) => {
//   const [hydraState, setHydraState] = createStore({
//     width: 400,
//     height: 400,
//     pixelDensity: 1,
//     code: 'osc().out()'
//     // fps:
//   })

  //   /* testing setting hydra code */
  //   // setInterval(() => {
  //   //   setDrawingState({ fillStyle: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})` })
  //   //   setHydraState({ code: 'osc().modulate(noise(2)).out()' })
  //   // }, 2000)

  //   setTimeout(() => {
  //     setHydraState({
  //       code: `
  //         s0.initCam()
  //         src(s0).color(-1, 1).out()
  //         `
  //     })
  //   }, 5000)

  // @todo: is it possible to pass all props together?
  const [drawingState, setDrawingState] = createStore({
    width: window.innerWidth,
    height: window.innerHeight,
    pixelDensity: 1,
    fillStyle: 'orange'
    // fps:
  })

  window.addEventListener('resize', (e) => {
    // setHydraState({ width: window.innerWidth, height: window.innerHeight })
    setDrawingState({ width: window.innerWidth, height: window.innerHeight })
  })

  // using this format in case we want to have more customized actions later on
  const drawingActions = {
    setDrawingState
  }

  const store = [drawingState, drawingActions]

  // console.log('width is', hydraState.)
  return (
      <DrawingContext.Provider value={{ store }}>
        {props.children}
      </DrawingContext.Provider>
  )
}

export function useDrawingStore () {
  return useContext(DrawingContext)
}
