import { onMount, mergeProps, createEffect } from 'solid-js'

import Hydra from 'hydra-synth'

export default function HydraCanvas (_props) {
  let canvas
  const props = mergeProps({ width: window.innerWidth, height: window.innerHeight }, _props)

  onMount(() => {
    const h = new Hydra({ canvas, detectAudio: false, makeGlobal: false })

    const { synth } = h
    const { setResolution, noise } = synth

    createEffect(() => {
      setResolution(props.width, props.height)
    })

    noise().out()
  })

  return (<>
    <canvas ref={canvas} width={props.width} height={props.height}/>
    </>)
}
