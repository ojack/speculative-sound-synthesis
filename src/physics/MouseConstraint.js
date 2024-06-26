/**
* The `Matter.MouseConstraint` module contains methods for creating mouse constraints.
* Mouse constraints are used for allowing user interaction, providing the ability to move bodies via the mouse or touch.
*
* See the included usage [examples](https://github.com/liabru/matter-js/tree/master/examples).
*
* @class MouseConstraint
*/
import { Vertices, Sleeping, Mouse, Events, Detector, Constraint, Common, Bounds, Composite } from 'matter-js'

export default function MouseConstraint () {
  /**
     * Creates a new mouse constraint.
     * All properties have default values, and many are pre-calculated automatically based on other properties.
     * See the properties section below for detailed information on what you can pass via the `options` object.
     * @method create
     * @param {engine} engine
     * @param {} options
     * @return {MouseConstraint} A new MouseConstraint
     */
  const create = function (engine, options) {
    let mouse = (engine ? engine.mouse : null) || (options ? options.mouse : null)

    if (!mouse) {
      if (engine && engine.render && engine.render.canvas) {
        mouse = Mouse.create(engine.render.canvas)
      } else if (options && options.element) {
        mouse = Mouse.create(options.element)
      } else {
        mouse = Mouse.create()
        Common.warn('MouseConstraint.create: options.mouse was undefined, options.element was undefined, may not function as expected')
      }
    }

    const constraint = Constraint.create({
      label: 'Mouse Constraint',
      pointA: mouse.position,
      pointB: { x: 0, y: 0 },
      length: 0.01,
      stiffness: 0.1,
      angularStiffness: 1,
      render: {
        strokeStyle: '#90EE90',
        lineWidth: 3
      }
    })

    const defaults = {
      type: 'mouseConstraint',
      mouse,
      element: null,
      body: null,
      constraint,
      collisionFilter: {
        category: 0x0001,
        mask: 0xFFFFFFFF,
        group: 0
      }
    }

    const mouseConstraint = Common.extend(defaults, options)

    Events.on(engine, 'beforeUpdate', function () {
      const allBodies = Composite.allBodies(engine.world)
      update(mouseConstraint, allBodies)
      _triggerEvents(mouseConstraint)
    })

    return mouseConstraint
  }

  /**
     * Updates the given mouse constraint.
     * @private
     * @method update
     * @param {MouseConstraint} mouseConstraint
     * @param {body[]} bodies
     */
  const update = function (mouseConstraint, bodies) {
    const mouse = mouseConstraint.mouse
    const constraint = mouseConstraint.constraint
    let body = mouseConstraint.body

    if (mouse.button === 0) {
      if (!constraint.bodyB) {
        for (let i = 0; i < bodies.length; i++) {
          body = bodies[i]
          if (Bounds.contains(body.bounds, mouse.position) &&
                            Detector.canCollide(body.collisionFilter, mouseConstraint.collisionFilter)) {
            for (let j = body.parts.length > 1 ? 1 : 0; j < body.parts.length; j++) {
              const part = body.parts[j]
              if (Vertices.contains(part.vertices, mouse.position)) {
                constraint.pointA = mouse.position
                constraint.bodyB = mouseConstraint.body = body
                constraint.pointB = { x: mouse.position.x - body.position.x, y: mouse.position.y - body.position.y }
                constraint.angleB = body.angle

                Sleeping.set(body, false)
                Events.trigger(mouseConstraint, 'startdrag', { mouse, body })

                break
              }
            }
          }
        }
      } else {
        Sleeping.set(constraint.bodyB, false)
        constraint.pointA = mouse.position
      }
    } else {
      constraint.bodyB = mouseConstraint.body = null
      constraint.pointB = null

      if (body) { Events.trigger(mouseConstraint, 'enddrag', { mouse, body }) }
    }
  }

  /**
     * Triggers mouse constraint events.
     * @method _triggerEvents
     * @private
     * @param {mouse} mouseConstraint
     */
  const _triggerEvents = function (mouseConstraint) {
    const mouse = mouseConstraint.mouse
    const mouseEvents = mouse.sourceEvents

    if (mouseEvents.mousemove) { Events.trigger(mouseConstraint, 'mousemove', { mouse }) }

    if (mouseEvents.mousedown) { Events.trigger(mouseConstraint, 'mousedown', { mouse }) }

    if (mouseEvents.mouseup) { Events.trigger(mouseConstraint, 'mouseup', { mouse }) }

    // reset the mouse state ready for the next step
    Mouse.clearSourceEvents(mouse)
  }

  /*
    *
    *  Events Documentation
    *
    */

  /**
    * Fired when the mouse has moved (or a touch moves) during the last step
    *
    * @event mousemove
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

  /**
    * Fired when the mouse is down (or a touch has started) during the last step
    *
    * @event mousedown
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

  /**
    * Fired when the mouse is up (or a touch has ended) during the last step
    *
    * @event mouseup
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

  /**
    * Fired when the user starts dragging a body
    *
    * @event startdrag
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {body} event.body The body being dragged
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

  /**
    * Fired when the user ends dragging a body
    *
    * @event enddrag
    * @param {} event An event object
    * @param {mouse} event.mouse The engine's mouse instance
    * @param {body} event.body The body that has stopped being dragged
    * @param {} event.source The source object of the event
    * @param {} event.name The name of the event
    */

  /*
    *
    *  Properties Documentation
    *
    */

  /**
     * A `String` denoting the type of object.
     *
     * @property type
     * @type string
     * @default "constraint"
     * @readOnly
     */

  /**
     * The `Mouse` instance in use. If not supplied in `MouseConstraint.create`, one will be created.
     *
     * @property mouse
     * @type mouse
     * @default mouse
     */

  /**
     * The `Body` that is currently being moved by the user, or `null` if no body.
     *
     * @property body
     * @type body
     * @default null
     */

  /**
     * The `Constraint` object that is used to move the body during interaction.
     *
     * @property constraint
     * @type constraint
     */

  /**
     * An `Object` that specifies the collision filter properties.
     * The collision filter allows the user to define which types of body this mouse constraint can interact with.
     * See `body.collisionFilter` for more information.
     *
     * @property collisionFilter
     * @type object
     */

  return { create, update, _triggerEvents }
}
