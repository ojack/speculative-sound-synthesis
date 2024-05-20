import { For } from 'solid-js'
// import { BiSolidEraser } from 'solid-icons/bi'
// import { BsPencil } from 'solid-icons/bs'

import './icons/kidpix.css'

const colorPalette = ['green', 'red', 'black', 'white']

// const kidpixIcons = ['pencil', 'line', 'rect', 'circle', 'large-pencil', 'spray', 'fill', 'eraser', 'letter', 'stamp', 'move', 'undo']

const kidpixIcons = ['circle', 'rect', 'line', 'eraser']

const hydraEffects = [
  // 'src(o0).modulate(noise(4, 0.2).color(1, 0).pixelate(5, 5), -0.01, 1.01).layer(src(s0)).out()',
  // 'src(o0).scrollY(-0.001).saturate(1.1).modulateHue(src(o0).hue(() => time*0.02), 2).layer(src(s0), 0.08).out()',
  // 'src(o0).scale(1, 1.01, 1, [0.2, 0.8].smooth().fast(0.3), 0.5).add(src(s0), 0.1).out()',
  // 'src(o0).blend(o0, 0.9).modulate(noise(4, 0.2).color(1, 0).pixelate(5, 5), -0.01, 1.01).modulate(noise(5, 0.01).color(0,1), 0.01).layer(src(s0)).out()'
]
export default function Toolbar (props) {
  const { setDrawingStore, setHydraState } = props
  console.log('PROPS ARE', props.backgroundColor, props.color)

  const baseButtonStyle = 'hover:bg-gray-200 font-bold inline-flex items-center border'

  const unselectedStyle = ''
  const selectedStyle = 'bg-gray-400 text-black'

  const setBackground = (e) => setDrawingStore('backgroundColor', e.target.value)

  const setRectWidth = (e) => setDrawingStore('rectWidth', e.target.value)

  const setBrush = (type) => setDrawingStore('currentBrush', type)

  const setFillColor = c => setDrawingStore('fillStyle', c)

  const setHydraCode = (code) => setHydraState('code', code)

  // const kidpixIconEls = kidpixIcons.map(id => <button onClick={[setBrush, id]} class={`border bg-white hover:bg-gray-100 kid-pix kid-pix--${id}`} />)
  // style={{ 'background-color': props.backgroundColor, 'border-color': props.color, color: props.color }}
  const Button = (_props) => <button onClick={_props.onClick} style={{ 'background-color': props.backgroundColor, 'border-color': props.color }} class={`${_props.class} ${baseButtonStyle} ${_props.selected ? selectedStyle : unselectedStyle}`}>{_props.children} </button>

  return <div class="flex flex-row justify-start">
        <For each={kidpixIcons}>
          {id => <Button class={`kid-pix border-x-2 border-y- kid-pix--${id}`} onClick={[setBrush, id]} selected={props.currentBrush === id}/>}
        </For>
        {/* <input onInput={setBackground} type="color" id="head" name="head" value={props.backgroundColor} />
        <input onInput={setRectWidth} type="range" id="rectWidth" name="volume" min="5" max="200" value={props.rectWidth}/> */}
        {/* <For each={colorPalette}>
          {(color) => <Button onClick={[setFillColor, color]} selected={props.fillStyle === color && props.isErasing === false}><div class="w-full h-full" style={{ 'background-color': color }} /></Button>}
        </For> */}
        {/* <For each={hydraEffects}>{(code, i) => <Button onClick={[setHydraCode, code]} ><div class="w-full h-full" />{i}</Button>}</For> */}

    </div>
}
