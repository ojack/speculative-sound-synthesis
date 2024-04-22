/* locally-scoped canvas element for hydra. props include:
- code=code to run
- s0 -
*/

import { onMount, mergeProps, createEffect } from 'solid-js'

const createPixelReader = ({ gl, x = 0, y = 0 }) => {
  const pixels = new Uint8Array(4 * 1)
  return {
    x,
    y,
    get value () {
      // console.log('reading', this.x, this.y, gl)
      gl.readPixels(this.x, gl.canvas.height - this.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels)
      const r = pixels[0]
      const g = pixels[1]
      const b = pixels[2]
      const a = pixels[3]
      return { r, g, b, a }
    }
  }
}

export default function Pixelsynth (_props) {
  const props = mergeProps({ }, _props)

  let canvas, ctx
  let gl = null
  let regl = null

  onMount(() => {
    ctx = canvas.getContext('2d')
    ctx.fillStyle = 'green'
    ctx.fillRect(40, 0, 4, canvas.height)

    createEffect(() => {
      if (gl === null & props.ref !== null) {
        console.log('git hydra', props.ref)
        gl = props.ref.regl._gl
        regl = props.ref.regl
        // regl.attributes.preserveDrawingBuffer = true

        // oP.read = function (x = 0, y = 0, w = 1, h = 1) {
        //     return regl.read({
        //         framebuffer: this.fbos[this.pingPongIndex],
        //         x: x,
        //         y: y,
        //         width: w,
        //         height: h,
        //     });
        // };

        createPixelReaders()
      }
    })

    function createPixelReaders () {
      const readers = new Array(10).fill(0)
      const pixelReaders = readers.map((_, i) => createPixelReader({ gl, x: 40, y: i * canvas.height / readers.length, regl }))
      console.log('readers', pixelReaders)
      pixelReaders.forEach((p, i) => {
        ctx.fillRect(p.x, p.y, i * 2, i * 2)
      })
      console.log('gl', gl.canvas.height)
      setInterval(() => {
        pixelReaders.forEach((p, i) => {
          const color = p.value
          ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`
          // ctx.fillStyle =
          ctx.fillRect(p.x, p.y, i * 2, i * 2)
        })
      }, 1000)
    }
  })

  return (<>
    <canvas ref={canvas} width={props.width} height={props.height} class="pointer-events-none"/>
    </>)
}
