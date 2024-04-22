import './../faust-web-component'

const faustCode = `
  import("stdfaust.lib");
  
  vol = hslider("volume [unit:dB]", -10, -96, 0, 0.1) : ba.db2linear : si.smoo;
  freq1 = hslider("freq1 [unit:Hz]", 1000, 20, 3000, 1);
  freq2 = hslider("freq2 [unit:Hz]", 200, 20, 3000, 1);
  
  process = vgroup("Oscillator", os.osc(freq1) * vol, os.osc(freq2) * vol);
  `

function Faust (props) {
  let faustEl

  // exposes parameters of faust code that can be set externally

  return (
        <div>
        <faust-widget ref={faustEl}>
          {faustCode}
        </faust-widget>
        </div>

  )
}

export default Faust
