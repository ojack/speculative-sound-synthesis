/**
* The `Matter.Mouse` module contains methods for creating and manipulating mouse inputs.
*
* @class Mouse
*/
//
// const Mouse = {}

// export default Mouse

import { Common } from 'matter-js'

export default function Mouse () {
  /**
     * Creates a mouse input.
     * @method create
     * @param {HTMLElement} element
     * @return {mouse} A new mouse
     */
  const create = function (element) {
    const mouse = {}

    if (!element) {
      Common.log('Mouse.create: element was undefined, defaulting to document.body', 'warn')
    }

    mouse.element = element || document.body
    mouse.absolute = { x: 0, y: 0 }
    mouse.position = { x: 0, y: 0 }
    mouse.mousedownPosition = { x: 0, y: 0 }
    mouse.mouseupPosition = { x: 0, y: 0 }
    mouse.offset = { x: 0, y: 0 }
    mouse.scale = { x: 1, y: 1 }
    mouse.wheelDelta = 0
    mouse.button = -1
    mouse.pixelRatio = parseInt(mouse.element.getAttribute('data-pixel-ratio'), 10) || 1
    mouse.touches = []

    mouse.sourceEvents = {
      mousemove: null,
      mousedown: null,
      mouseup: null,
      mousewheel: null
    }

    mouse.mousemove = function (event) {
      const position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio)
      const touches = event.changedTouches

      if (touches) {
        mouse.button = 0
        event.preventDefault()
        // console.log(event.touches.length)
      }

      mouse.touches = event.touches

      mouse.absolute.x = position.x
      mouse.absolute.y = position.y
      mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
      mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
      mouse.sourceEvents.mousemove = event
    }

    mouse.mousedown = function (event) {
      const position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio)
      const touches = event.changedTouches

      if (touches) {
        mouse.button = 0
        event.preventDefault()
      } else {
        mouse.button = event.button
      }
      mouse.touches = event.touches

      mouse.absolute.x = position.x
      mouse.absolute.y = position.y
      mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
      mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
      mouse.mousedownPosition.x = mouse.position.x
      mouse.mousedownPosition.y = mouse.position.y
      mouse.sourceEvents.mousedown = event
    }

    mouse.mouseup = function (event) {
      const position = _getRelativeMousePosition(event, mouse.element, mouse.pixelRatio)
      const touches = event.changedTouches

      if (touches) {
        event.preventDefault()
      }
      mouse.touches = event.touches

      mouse.button = -1
      mouse.absolute.x = position.x
      mouse.absolute.y = position.y
      mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
      mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
      mouse.mouseupPosition.x = mouse.position.x
      mouse.mouseupPosition.y = mouse.position.y
      mouse.sourceEvents.mouseup = event
    }

    mouse.mousewheel = function (event) {
      mouse.wheelDelta = Math.max(-1, Math.min(1, event.wheelDelta || -event.detail))
      event.preventDefault()
      mouse.sourceEvents.mousewheel = event
    }

    setElement(mouse, mouse.element)

    return mouse
  }

  /**
     * Sets the element the mouse is bound to (and relative to).
     * @method setElement
     * @param {mouse} mouse
     * @param {HTMLElement} element
     */
  const setElement = function (mouse, element) {
    mouse.element = element

    element.addEventListener('mousemove', mouse.mousemove, { passive: true })
    element.addEventListener('mousedown', mouse.mousedown, { passive: true })
    element.addEventListener('mouseup', mouse.mouseup, { passive: true })

    element.addEventListener('wheel', mouse.mousewheel, { passive: false })

    element.addEventListener('touchmove', mouse.mousemove, { passive: false })
    element.addEventListener('touchstart', mouse.mousedown, { passive: false })
    element.addEventListener('touchend', mouse.mouseup, { passive: false })
  }

  /**
     * Clears all captured source events.
     * @method clearSourceEvents
     * @param {mouse} mouse
     */
  const clearSourceEvents = function (mouse) {
    mouse.sourceEvents.mousemove = null
    mouse.sourceEvents.mousedown = null
    mouse.sourceEvents.mouseup = null
    mouse.sourceEvents.mousewheel = null
    mouse.wheelDelta = 0
  }

  /**
     * Sets the mouse position offset.
     * @method setOffset
     * @param {mouse} mouse
     * @param {vector} offset
     */
  const setOffset = function (mouse, offset) {
    mouse.offset.x = offset.x
    mouse.offset.y = offset.y
    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
  }

  /**
     * Sets the mouse position scale.
     * @method setScale
     * @param {mouse} mouse
     * @param {vector} scale
     */
  const setScale = function (mouse, scale) {
    mouse.scale.x = scale.x
    mouse.scale.y = scale.y
    mouse.position.x = mouse.absolute.x * mouse.scale.x + mouse.offset.x
    mouse.position.y = mouse.absolute.y * mouse.scale.y + mouse.offset.y
  }

  /**
     * Gets the mouse position relative to an element given a screen pixel ratio.
     * @method _getRelativeMousePosition
     * @private
     * @param {} event
     * @param {} element
     * @param {number} pixelRatio
     * @return {}
     */
  const _getRelativeMousePosition = function (event, element, pixelRatio) {
    const elementBounds = element.getBoundingClientRect()
    const rootNode = (document.documentElement || document.body.parentNode || document.body)
    const scrollX = (window.pageXOffset !== undefined) ? window.pageXOffset : rootNode.scrollLeft
    const scrollY = (window.pageYOffset !== undefined) ? window.pageYOffset : rootNode.scrollTop
    const touches = event.changedTouches
    let x; let y

    if (touches) {
      x = touches[0].pageX - elementBounds.left - scrollX
      y = touches[0].pageY - elementBounds.top - scrollY
    } else {
      x = event.pageX - elementBounds.left - scrollX
      y = event.pageY - elementBounds.top - scrollY
    }

    return {
      x: x / (element.clientWidth / (element.width || element.clientWidth) * pixelRatio),
      y: y / (element.clientHeight / (element.height || element.clientHeight) * pixelRatio)
    }
  }

  return { create, _getRelativeMousePosition, setScale, setOffset, clearSourceEvents, setElement }
}
