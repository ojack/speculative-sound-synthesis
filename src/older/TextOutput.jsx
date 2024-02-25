import { count } from './shared-signal.js'

function TextOutput () {
  return (
        <div style={{ position: 'absolute' }}>
                {count()}
        </div>
  )
}

export default TextOutput
