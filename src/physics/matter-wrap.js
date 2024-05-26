import { Body } from 'matter-js'

export function wrapToBounds (body, { min = 0, max = 500 } = {}) {
  if (body.plugin.wrap) {
    // console.log(body, body.bounds, min, max)
    const objectBounds = body.bounds
    let x = null
    let y = null

    // if (typeof min.x !== 'undefined' && typeof bounds.max.x !== 'undefined') {
    if (objectBounds.min.x > max.x) {
      x = min.x - objectBounds.max.x
    } else if (objectBounds.max.x < min.x) {
      x = max.x - objectBounds.min.x
    }
    // }

    // if (typeof min.y !== 'undefined' && typeof max.y !== 'undefined') {
    if (objectBounds.min.y > max.y) {
      y = min.y - objectBounds.max.y
    } else if (objectBounds.max.y < min.y) {
      y = max.y - objectBounds.min.y
    }
    // }

    if (x !== null || y !== null) {
      Body.translate(body, {
        x: x || 0,
        y: y || 0
      })
    }
    // console.log('should wrap', body)
    // if*
  }
}
