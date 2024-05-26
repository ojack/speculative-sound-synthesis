import './../faust-web-component'
import { createStore } from 'solid-js/store'
import { onMount, createEffect, For } from 'solid-js'
import { Entries } from '@solid-primitives/keyed'

const faustCode = `
  import("stdfaust.lib");
  
  vol = hslider("volume [unit:dB][draw:pointerdown]", -96, -96, 0, 0.1) : ba.db2linear : si.smoo;
  freq1 = hslider("freq1 [unit:Hz][draw:x]", 1000, 20, 3000, 1);
  freq2 = hslider("freq2 [unit:Hz][draw:y]", 200, 20, 3000, 1);
  
  process = vgroup("Oscillator", os.osc(freq1) * vol, os.osc(freq2) * vol);`

const faustFormant = `
declare name "Vocal FOF";
declare description "FOF vocal synthesizer.";
declare license "MIT";
declare copyright "(c)Mike Olsen, CCRMA (Stanford University)";

import("stdfaust.lib");
 
process = pm.SFFormantModelFofSmooth_ui<: _,_;

`

const faustToy = `import("stdfaust.lib");

// parameters
x0 = hslider("x0",0.5,0,1,0.01) : si.smoo;
y0 = hslider("y0",0.5,0,1,0.01) : si.smoo;
y1 = hslider("y1",0,0,1,0.01) : si.smoo;
q = hslider("q[draw:x]",30,10,50,0.01) : si.smoo;
del = hslider("del[draw:y]",0.5,0.01,1,0.01) : si.smoo;
fb = hslider("fb[acc: 1 0 -10 0 10]",0.5,0,1,0.01) : si.smoo;

// mapping
impFreq = 2 + x0*20;
resFreq = y0*3000+300;

// simple echo effect
echo = +~(de.delay(65536,del*ma.SR)*fb);

// putting it together
process = os.lf_imptrain(impFreq) : fi.resonlp(resFreq,q,1) : echo : ef.cubicnl(y1,0)*0.95 <: _,_;`

// console.log('toy is ', faustToy)

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

  const map = (current, inMin, inMax, outMin, outMax) => ((current - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin

  createEffect(() => {
    console.log('faust sliders are', faustParams.sliders)
    faustParams.sliders.forEach((slider, i) => {
      // if (i < props.paramCount) {
      const drawParams = props.constellation.store.signalArray.filter((p) => p.faustParam === slider.label)
      //  console.log('DRAW PARAMS', drawParams)
      if (drawParams.length > 0) {
        const { address, max, min } = slider
        const { signalPath } = drawParams[0]
        // console.log('SIGNAL PATH', signalPath)
        createEffect(() => {
          // @todo: ???use create memo to calculate values
          // @todo: how to check whether parameter exists??
        //  console.log(props.constellation.store.signals[signalPath])
          const param = props.constellation.store.signals[signalPath]
          //  const
          const newVal = map(param, 0, 500, min, max)
          //  console.log(newVal)
          faustEl.node?.setParamValue(address, newVal)
        })
      }
      // if (slider.draw !== null) {
      //   const { address, max, min, draw } = slider

      //   // @todo: how to change params when first loaded?
      //   createEffect(() => {
      //     // @todo: ???use create memo to calculate values
      //     // @todo: how to check whether parameter exists??

      //     const param = props.params[draw]
      //     const newVal = map(param.val, param.min, param.max, min, max)
      //     faustEl.node?.setParamValue(address, newVal)
      //   })
      // }
    })
  })

  // createEffect(() => {
  //   console.log('BODY', props.constellation.store.bodies[0].position.x)
  //   // console.log('BODY', props.constellation.bodies[1].position.x)
  //   // console.log('BODY', props.constellation.bodies[2].position.x)

  //   console.log('BODY', props.constellation.bodies[0].angle)
  // })

  // console.log('EDITOR SIGNALS', props.constellation.store.signals)

  // createEffect(() => {
  //   console.log(' update', props.constellation.store.signals['red-circle.position.x'])
  // })

  onMount(() => {
    // console.log('loaded faustEl', faustEl)
    // createEffect(() => {
    //   console.log(props.params[0].val)
    // })
    function getNested (items) {
      return items.map((item) => {
        if (item.type === 'vgroup' || item.type === 'hgroup') {
          return getNested(item.items)
        } else if (item.type === 'hslider' || item.type === 'vslider') {
          return item
        } else {
          return []
        }
      })
    }
    faustEl.addEventListener('faust-code-compiled', (e) => {
      const ui = e.detail.ui
      if (ui.length > 0) {
        // const group = ui[0].items

        const nestedSliders = getNested(ui)
        const sliders = nestedSliders.flat(Infinity)
        // console.log('sliders are', nestedSliders, sliders)
        // const sliders = group.filter(item => item.type === 'hslider' || item.type === 'vslider')
        sliders.forEach((slider) => {
          slider.draw = null
          if (slider.meta) {
            const mapping = slider.meta.filter(m => 'draw' in m)
            slider.draw = mapping.length > 0 ? mapping[0].draw : null // @todo: what to do for default parameters
          }
          // console.log('meta', slider.meta, mapping, slider.draw)
          // if (slider.)
        })
        setFaustParams('sliders', sliders)
      }
    })

    faustEl.run()
  })
  return (
        <div>
          <div class ="flex flex-wrap">
          <For each={props.constellation.store.signalArray}>{(param, i) =>
              <div class="p-1 border text-xs" style={{ 'border-color': props.color }}>{param.faustParam}:{param.signalPath}:{props.constellation.store.signals[param.signalPath]} </div>
            }</For>

 </div>

        <faust-editor ref={faustEl} style={{ '--main-bg-color': props.backgroundColor, '--main-color': props.color }}>
      {props.dsp}
        </faust-editor>
        </div>

  )
}

export default Faust
