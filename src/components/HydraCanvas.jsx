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
    const hydra = new Hydra({ canvas, detectAudio: false, makeGlobal: false })

    const { synth } = hydra
    /* adding to local scope to be used later */
    const { src, osc, gradient, shape, voronoi, noise, s0, s1, s2, s3, o0, o1, o2, o3, render, setFunction, speed, setResolution, update, fps } = synth

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

    // window._reportError = (err) => {
    //   console.log('REPORTED ERROR', err)
    // }

    function reportError (err) {
      console.log('REPORTED ERROR', err)
      props.setHydraState('errorMessage', err.message)
      // props.setHydraState('errorMessage', 'hellooo ')
    }

    const runCode = (str) => {
      try {
        eval(`${str}()`)
        // window.eval(jsString)
      } catch (err) {
        // why is this throwing errors but still working?
        reportError(err)
      }
    }

    // function reportError (err) {
    //   props.setHydraState('errorMessage', err)
    // }

    /* hacky way to run 'global'ish hydra code only within the scope of this instance */
    createEffect(() => {
      const info = {
        isError: false,
        codeString: '',
        errorMessage: ''
      }
      props.setHydraState('errorMessage', '')

      // const s = `() => {
      //   ${props.code}
      // }`
      const jsString = `(async() => {
        ${props.code}
    })().catch(${(err) => { reportError(err) }})`
      // info.codeString = jsString
      console.log('string is', jsString)
      try {
        eval(`${jsString}()`)
        // window.eval(jsString)
      } catch (err) {
        // why is this throwing errors but still working?
        reportError(err)
      }
      // if (info.errorMessage.length > 0) info.isError = true
      // eval(`(${s})()`)
    })

    // noise().out()
    // src(s0).layer(src(s0)).out()
  })

  return (<>
    <canvas ref={canvas} width={props.width} height={props.height}/>
    </>)
}
