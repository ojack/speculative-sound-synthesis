import { onMount, mergeProps, createEffect } from 'solid-js'

export default function DrawingCanvas (_props) {
  let canvas
  const props = mergeProps({ width: window.innerWidth, height: window.innerHeight, fillStyle: 'pink' }, _props)

  onMount(() => {
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = props.fillStyle
    ctx.fillRect(20, 20, 10, 10)

    let isDrawing = false

    /* effects */
    createEffect(() => {
      ctx.fillStyle = props.fillStyle
    })

    /* pointer events */
    canvas.addEventListener('pointerdown', (e) => {
      isDrawing = true
      const { offsetX, offsetY } = e
      ctx.fillRect(offsetX, offsetY, 20, 20)
    })

    canvas.addEventListener('pointermove', (e) => {
      if (isDrawing) {
        const { offsetX, offsetY } = e
        ctx.fillRect(offsetX, offsetY, 20, 20)
      }
    })

    canvas.addEventListener('pointerup', (e) => {
      isDrawing = false
    })
  })

  return (<>
    <canvas ref={canvas} width={props.width} height={props.height}/>
    </>)
}
