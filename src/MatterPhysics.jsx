import { onMount, mergeProps, createEffect } from 'solid-js'
import { createStore, unwrap } from 'solid-js/store'

import { wrapToBounds } from './physics/matter-wrap.js'
import { updateSignals } from './stores/constellation.js'
import { Engine, Render, Runner, Events, Body, Bodies, Composite, World, use } from 'matter-js'
import _Mouse from './physics/Mouse.js'
import _MouseConstraint from './physics/MouseConstraint.js'
// use('matter-wrap')

// import HydraCanvas from './HydraCanvas.jsx'
export default function MatterPhysics (props) {
  let parent, canvas
  const Mouse = _Mouse()
  const MouseConstraint = _MouseConstraint()

  console.log('MOUSE IS', MouseConstraint, MouseConstraint.create)
  onMount(() => {
    // module aliases
    // const Engine = Matter.Engine
    // const Render = Matter.Render
    // const Runner = Matter.Runner
    // const Bodies = Matter.Bodies
    // const Composite = Matter.Composite

    // create an engine
    const engine = Engine.create({
      // gravity: { x: 0, y: 0 }
      gravity: unwrap(props.gravity)
    })

    createEffect(() => {
      engine.gravity = props.gravity
    })

    // create a renderer
    const render = Render.create({
      // element: parent,
      canvas,
      engine,
      options: {
        wireframes: false,
        // background: props.backgroundColor,
        background: 'rgba(0, 0, 0, 0)',
        showAngleIndicator: true,
        showCollisions: true,
        showSeparations: true,
        showVelocity: true,
        width: props.width,
        height: props.height
        // canvas
      }
    })

    window.render = render

    // add walls
    const w = props.width
    const h = props.height
    const thick = 100
    Composite.add(engine.world, [
      // walls
      Bodies.rectangle(w / 2, -thick / 2, w, thick, { isStatic: true, label: 'rect' }),
      Bodies.rectangle(w / 2, h + thick / 2, w, thick, { isStatic: true, label: 'rect' }),
      Bodies.rectangle(w + thick / 2, h / 2, thick, h, { isStatic: true, label: 'rect' }),
      Bodies.rectangle(-thick / 2, h / 2, thick, h, { isStatic: true, label: 'rect' })

    ])

    // // OLDER add one of each type
    // const bodies = props.shapeTypes.map((type) => {
    //   const body = props.shapes[type].create()
    //   // Body.setVelocity(body, { x: 0, y: -10 })
    //   return body
    // })

    // // bodies.push(props.shapes.circle.create())

    // // create two boxes and a ground
    // // const boxA = Bodies.rectangle(400, 200, 160, 100, { restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0, angle: 10 })
    // // const boxB = Bodies.rectangle(450, 50, 100, 100, { restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0 })

    // // Body.setVelocity(boxA, { x: 0, y: -10 })

    // // const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

    // // add all of the bodies to the world
    // // Composite.add(engine.world, [boxA])

    // // Composite.add(engine.world, [boxA, boxB])
    // Composite.add(engine.world, bodies)

    // add constellations
    const bodyConstellations = props.constellations.map((c) => {
      const composite = Composite.create()
      Composite.add(composite, c.bodyObjects)
      // Composite.add(engine.world, constellation)

      return composite
    }
    )

    // console.log('CREATED composites', bodyConstellations)
    Composite.add(engine.world, bodyConstellations)

    let currentPairs = []
    // available events: https://brm.io/matter-js/docs/classes/Engine.html#events
    // https://brm.io/matter-js/docs/classes/Collision.html
    // maybe use tangent?
    Events.on(engine, 'collisionStart', function (event) {
      const pairs = event.pairs

      // console.log('COLLISION', pairs)
      for (let i = 0, j = pairs.length; i !== j; ++i) {
        // props.updateRelationship(pairs[i], true)
        pairs[i].bodyA.isColliding = 1
        pairs[i].bodyB.isColliding = 1
        // console.log('collision', event.pairs[i], event.pairs[i].isActive)
        currentPairs.push(pairs[i])
      }
      // currentPairs = pairs
      // currentPairs.concat(pairs)
      // console.log(currentPairs, pairs)
      //   props.setStore('params', 'isColliding', 'val', 1.0)

      // for (let i = 0, j = pairs.length; i !== j; ++i) {
      //   const pair = pairs[i]
      //   // console.log('pairs', pair, pair.bodyA.angle)
      //   props.setStore('params', 'depth', 'val', pair.collision.depth)
      //   props.setStore('params', 'angle', 'val', pair.bodyA.angle)

      //   // if (pair.bodyA === collider) {
      //   //     pair.bodyB.render.strokeStyle = colorA;
      //   // } else if (pair.bodyB === collider) {
      //   //     pair.bodyA.render.strokeStyle = colorA;
      //   // }
      // }

      // for (var i = 0, j = pairs.length; i != j; ++i) {
      //     var pair = pairs[i];

      //     if (pair.bodyA === collider) {
      //         pair.bodyB.render.strokeStyle = colorA;
      //     } else if (pair.bodyB === collider) {
      //         pair.bodyA.render.strokeStyle = colorA;
      //     }
      // }
    })

    Events.on(engine, 'collisionEnd', function (event) {
      // props.setStore('params', 'isColliding', 'val', 0.0)
      const pairs = event.pairs
      for (let i = 0, j = pairs.length; i !== j; ++i) {
        // props.updateRelationship(event.pairs[i], false)
        pairs[i].bodyA.isColliding = 0
        pairs[i].bodyB.isColliding = 0
        // console.log('ending', event.pairs[i], event.pairs[i].isActive)
      }
      currentPairs = currentPairs.filter(pair => pair.isActive)
      // console.log(currentPairs)
    })

    const mouse = Mouse.create(render.canvas)
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: {
        stiffness: 0.9,
        render: {
          visible: false
        }
      }
    })

    // Events.on(mouseConstraint, 'startdrag', (e) => { console.log('drag started', e) })

    // let isAddingShape = true
    let shape = null
    Events.on(mouseConstraint, 'mousedown', (e) => {
      // console.log('mousedown', mouseConstraint, mouseConstraint.constraint.bodyB)
      // If not grabbing an existing object, add a new object
      console.log('BRUSH', props.currentBrush)
      if (props.currentBrush !== 'eraser') {
        if (mouseConstraint.constraint.bodyB === null) {
          // console.log('adding', mouse)
          const { x, y } = mouse.absolute
          shape = props.shapes[props.currentBrush].create({ x, y })
          // shape = Bodies.rectangle(mouse.absolute.x, mouse.absolute.y, 50, 50, {
          //   render: { visible: true, fillStyle: '#f36' },
          //   label: 'circle'
          // })

          //   Bodies.re
          //   shape.render = fillStyle = '#f00'
          Composite.add(engine.world, shape)
          // console.log('touches', mouse.touches)
          // if (mouse.touches.length > 0) render.options.background = 'blue'
        }
      } else {
        if (mouseConstraint.constraint.bodyB !== null) {
          // if ()
          console.log('removing', mouseConstraint.constraint.bodyB)
          Composite.remove(engine.world, mouseConstraint.constraint.bodyB)
        }
      }
    })

    // Events.on(mouseConstraint, 'mousemove', (e) => {
    //   // console.log('mousedown', mouseConstraint, mouseConstraint.constraint.bodyB)
    //   // if (shape !== null && mouse.touches.length > 0) {
    //   //   console.log('touches', mouse.touches)
    //   // }
    // })

    Events.on(mouseConstraint, 'mouseup', (e) => {
      shape = null
      // render.options.background = 'yellow'
    })

    Composite.add(engine.world, mouseConstraint)
    // run the renderer
    Render.run(render)
    render.mouse = mouse

    // // // create runner
    // const runner = Runner.create()

    // // run the engine
    // Runner.run(runner, engine)

    // const
    window.engine = engine

    const min = render.bounds.min
    const max = render.bounds.max
    function run () {
      // Body.setVelocity(boxA, { x: 0, y: -2 })
      // console.log(ongoingTouches)

      props.constellations.forEach(c => {
        c.bodyObjects.forEach(body => {
          wrapToBounds(body, { min, max })
          updateSignals(body, c.setStore)
        })
      })
      window.requestAnimationFrame(run)
      // console.log(currentPairs)

      for (let i = 0; i < currentPairs.length; i++) {
        props.updateRelationship(currentPairs[i], true)
      }
      // props.setStore('params', 'x0', 'val', boxA.position.x)
      // props.setStore('params', 'y0', 'val', boxA.position.y)
      // props.setStore('params', 'x1', 'val', boxB.position.x)
      // props.setStore('params', 'y1', 'val', boxB.position.y)

      Engine.update(engine, 1000 / 60)
      // console.log(boxA.position)
    }

    run()

    // parent.addEventListener('pointerdown', (e) => {
    //   const shape = Bodies.rectangle(e.clientX, e.clientY, 200, 200, {
    //     render: { visible: true, fillStyle: '#f00' }
    //   })

    //   //   Bodies.re
    //   //   shape.render = fillStyle = '#f00'
    //   Composite.add(engine.world, shape)
    // })
  })

  return <div ref={parent} style={{ border: `solid 1px ${props.color}` }}>
    <canvas
            ref={canvas}
            class=""
            style={{ width: `${props.width}px`, height: `${props.height}px`, border: 'none' }}
            />
              </div>
  // {/* <HydraCanvas class="absolute top-0 left-0" width={props.width} height={props.height} code={() => 'voronoi().out()'} s0={canvas} /> */}
}
