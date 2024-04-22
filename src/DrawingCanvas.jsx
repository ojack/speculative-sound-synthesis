import { onMount, mergeProps, createEffect } from 'solid-js'
import brushes from './brushes.js'
// import HydraCanvas from './HydraCanvas.jsx'
export default function DrawingCanvas (_props) {
  let canvas

  const props = mergeProps({ width: window.innerWidth, height: window.innerHeight, fillStyle: 'purple', onload: () => {}, currentBrush: 'pencil' }, _props)

  onMount(() => {
    props.onload(canvas)

    const ctx = canvas.getContext('2d')
    ctx.fillStyle = props.fillStyle

    let isDrawing = false

    let currentBrush = () => {}

    /* effects */
    createEffect(() => {
      ctx.fillStyle = props.fillStyle
    })

    createEffect(() => {
      console.log('setting brush', props.currentBrush)
      currentBrush = brushes[props.currentBrush]
    })

    /* pointer events */
    canvas.addEventListener('pointerdown', (e) => {
      isDrawing = true

      // const { offsetX, offsetY } = e
      // ctx.fillRect(offsetX, offsetY, 20, 20)
      currentBrush({ x: e.offsetX, y: e.offsetY, ctx })
      props.setStore('params', 'pointerdown', 'val', 1)
      props.setStore('params', 'x', 'val', e.offsetX)
      props.setStore('params', 'y', 'val', e.offsetY)
    })

    canvas.addEventListener('pointermove', (e) => {
      if (isDrawing) {
        // currentBrush(e)
        currentBrush({ x: e.offsetX, y: e.offsetY, ctx })
        // props.setStore('params', 0, 'val', e.offsetX)
        // props.setStore('params', 1, 'val', e.offsetY)
        props.setStore('params', 'x', 'val', e.offsetX)
        props.setStore('params', 'y', 'val', e.offsetY)
      }
    })

    canvas.addEventListener('pointerup', (e) => {
      isDrawing = false
      // props.setStore('params', 2, 'val', 0)
      props.setStore('params', 'pointerdown', 'val', 0)
    })
  })

  return <canvas
  // class="absolute"
  class="border border-black"
            ref={canvas}
            width={props.width}
            height={props.height}
             />
  // {/* <HydraCanvas class="absolute top-0 left-0" width={props.width} height={props.height} code={() => 'voronoi().out()'} s0={canvas} /> */}
}
