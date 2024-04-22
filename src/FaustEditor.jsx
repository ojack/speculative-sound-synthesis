import './../faust-web-component'
import { createStore } from 'solid-js/store'
import { onMount, createEffect, For } from 'solid-js'

const faustCode = `
  import("stdfaust.lib");
  
  vol = hslider("volume [unit:dB]", -96, -96, 0, 0.1) : ba.db2linear : si.smoo;
  freq1 = hslider("freq1 [unit:Hz]", 1000, 20, 3000, 1);
  freq2 = hslider("freq2 [unit:Hz]", 200, 20, 3000, 1);
  
  process = vgroup("Oscillator", os.osc(freq1) * vol, os.osc(freq2) * vol);
  `

const faustFormant = `
declare name "Vocal FOF";
declare description "FOF vocal synthesizer.";
declare license "MIT";
declare copyright "(c)Mike Olsen, CCRMA (Stanford University)";

import("stdfaust.lib");

process = pm.SFFormantModelFofSmooth_ui<: _,_;

`

function Faust (props) {
  let faustEl

  // exposes parameters of faust code that can be set externally
  const [faustParams, setFaustParams] = createStore({
    sliders: []
  })

  //   const uiParams = new Array(props.paramCount).fill(0).map(() => _ => {})

  //   createEffect(() => {
  //     props.params.forEach((param) => {

  //     })
  //   })

  // createEffect(() => {
  //   const sliders = group.filter(item => item.type === 'hslider' || item.type === 'vslider')
  //   console.log('sliders are', sliders)
  //   sliders.forEach((slider, i) => {
  //     if (i < props.paramCount) {
  //       const { address, max, min } = slider
  //       // @todo: @bug: currently creates new effects everytime code is compiled, does not get rid of existing effects
  //       createEffect(() => {
  //         // @todo: use create memo to calculate values
  //         console.log(address, props.params[i].val)
  //         const val = props.params[i].val / (props.params[i].max - props.params[i].min) - props.params[i].min
  //         const newVal = min + val * (max - min)
  //         console.log(newVal)
  //         faustEl.node?.setParamValue(address, newVal)
  //       })
  //     }
  //   })
  // })

  createEffect(() => {
    console.log('faust sliders are', faustParams.sliders)
    faustParams.sliders.forEach((slider, i) => {
      if (i < props.paramCount) {
        const { address, max, min } = slider

        // @todo: how to change params when first loaded?
        createEffect(() => {
          // @todo: ???use create memo to calculate values
          // console.log(address, props.params[i].val)
          console.log('slider effect', faustParams.sliders)
          const val = props.params[i].val / (props.params[i].max - props.params[i].min) - props.params[i].min
          const newVal = min + val * (max - min)
          console.log(address, newVal)
          faustEl.node?.setParamValue(address, newVal)
        })
      }
    })
  })

  onMount(() => {
    console.log('loaded faustEl', faustEl)
    // createEffect(() => {
    //   console.log(props.params[0].val)
    // })
    faustEl.addEventListener('faust-code-compiled', (e) => {
      const ui = e.detail.ui
      if (ui.length > 0) {
        const group = ui[0].items
        const sliders = group.filter(item => item.type === 'hslider' || item.type === 'vslider')
        setFaustParams('sliders', sliders)
      }
    })
  })
  return (
        <div>
          <div class="flex">
            <For each={faustParams.sliders}>{(param, i) =>
              <div class="p-1">{param.label}</div>
            }</For>
          </div>
        <faust-editor ref={faustEl}>
          {faustCode}
        </faust-editor>
        </div>

  )
}

export default Faust
