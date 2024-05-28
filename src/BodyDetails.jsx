import { createStore } from 'solid-js/store'
import { For } from 'solid-js'

const [editableParam] = createStore(['friction', 'frictionAir', 'frictionStatic', 'density', 'restitution'])
export default function BodyDetails (props) {
  return <div>
        <div>{props.label}</div>
        <For each={editableParam}>
            {(param) => <div>{param}: {props[param]}</div>}
        </For>
    </div>
}
