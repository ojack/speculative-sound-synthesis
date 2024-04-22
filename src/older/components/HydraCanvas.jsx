/* eslint no-unused-vars: "off" */
/* eslint no-eval: "off" */

/* locally-scoped canvas element for hydra. props include:
- code=code to run
- s0 - source for s0
*/

import { onMount, mergeProps, createEffect } from 'solid-js'
import Hydra from 'hydra-synth'

export default function HydraCanvas (_props) {
  let canvas, hydra
  const props = mergeProps({ width: window.innerWidth, height: window.innerHeight }, _props)

  onMount(() => {
    /* set up this instance of hydra */
    const hydra = new Hydra({ canvas, detectAudio: false, makeGlobal: true })

    const { synth, loadScript } = hydra
    window.synth = synth
    window.hydra = hydra

    props.setHydraState('ref', hydra)
    /* adding to local scope to be used later */
    // const { src, osc, gradient, solid, shape, voronoi, noise, s0, s1, s2, s3, o0, o1, o2, o3, render, setFunction, speed, setResolution, update, fps } = synth

    createEffect(() => {
      // console.log('updating hydra resolution')
      setResolution(props.width, props.height)
    })

    createEffect(() => {
      console.log('props.s0', props.s0, props.s0.nodeName)
      // console.log('hydra source', props.s0)
      if (props.s0.nodeName === 'CANVAS') {
        console.log('initializing')
        props.setHydraState('code', `s0.init({ src: props.s0 })
        src(o0).modulateScale(noise(4, 0.2), -0.02, 1.01).layer(src(s0)).out()`)
      }
      // src(o0).modulateScale(noise(4, 0.2), -0.02, 1.01).layer(src(s0)).out()

      // src(s0).out()
    })

    function reportError (err) {
      props.setHydraState('errorMessage', err.message)
    }

    /* Execute code. hacky way to run 'global'ish hydra code only within the scope of this instance */
    createEffect(() => {
      props.setHydraState('errorMessage', '')

      const jsString = `(async() => {
        ${props.code}
    }).apply(null, null).catch(${reportError})`

      try {
        eval(jsString)
        // window.eval(jsString) // use this way in order to eval in 'window' ctx, only works with makeGlobal=true
      } catch (err) {
        reportError(err)
      }
    })
  })

  return (<>
    <canvas ref={canvas} width={props.width} height={props.height}/>
    </>)
}
