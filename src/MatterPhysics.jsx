import { onMount, mergeProps, createEffect } from 'solid-js'
import { Engine, Render, Runner, Events, Body, Bodies, Composite } from 'matter-js'
import _Mouse from './physics/Mouse.js'
import _MouseConstraint from './physics/MouseConstraint.js'

// import HydraCanvas from './HydraCanvas.jsx'
export default function DrawingCanvas (props) {
  let parent
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
      gravity: { x: 0, y: 0 }
    })

    // create a renderer
    const render = Render.create({
      element: parent,
      engine,
      options: {
        wireframes: false,
        background: 'yellow',
        showAngleIndicator: true,
        showCollisions: true,
        showVelocity: true,
        width: 600,
        height: 600
      }
    })

    // create two boxes and a ground
    const boxA = Bodies.rectangle(400, 200, 160, 100, { restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0, angle: 10 })
    const boxB = Bodies.rectangle(450, 50, 100, 100, { restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0 })

    Body.setVelocity(boxA, { x: 0, y: -10 })

    Composite.add(engine.world, [
      // walls
      Bodies.rectangle(300, -50, 600, 100, { isStatic: true, label: 'wall' }),
      Bodies.rectangle(300, 650, 600, 100, { isStatic: true, label: 'wall' }),
      Bodies.rectangle(650, 300, 100, 600, { isStatic: true, label: 'wall' }),
      Bodies.rectangle(-50, 300, 100, 600, { isStatic: true, label: 'wall' })

    ])
    // const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })

    // add all of the bodies to the world
    // Composite.add(engine.world, [boxA])

    Composite.add(engine.world, [boxA, boxB])

    // available events: https://brm.io/matter-js/docs/classes/Engine.html#events
    // https://brm.io/matter-js/docs/classes/Collision.html
    // maybe use tangent?
    Events.on(engine, 'collisionStart', function (event) {
      const pairs = event.pairs

      // console.log('COLLISION', pairs)
      props.setStore('params', 'isColliding', 'val', 1.0)

      for (let i = 0, j = pairs.length; i !== j; ++i) {
        const pair = pairs[i]
        // console.log('pairs', pair, pair.bodyA.angle)
        props.setStore('params', 'depth', 'val', pair.collision.depth)
        props.setStore('params', 'angle', 'val', pair.bodyA.angle)

        // if (pair.bodyA === collider) {
        //     pair.bodyB.render.strokeStyle = colorA;
        // } else if (pair.bodyB === collider) {
        //     pair.bodyA.render.strokeStyle = colorA;
        // }
      }

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
      props.setStore('params', 'isColliding', 'val', 0.0)
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
      if (mouseConstraint.constraint.bodyB === null) {
        // console.log('adding', mouse)
        shape = Bodies.rectangle(mouse.absolute.x, mouse.absolute.y, 50, 50, {
          render: { visible: true, fillStyle: '#f36' }
        })

        //   Bodies.re
        //   shape.render = fillStyle = '#f00'
        Composite.add(engine.world, shape)
        console.log('touches', mouse.touches)
        // if (mouse.touches.length > 0) render.options.background = 'blue'
      }
    })

    Events.on(mouseConstraint, 'mousemove', (e) => {
      // console.log('mousedown', mouseConstraint, mouseConstraint.constraint.bodyB)
      if (shape !== null && mouse.touches.length > 0) {
        console.log('touches', mouse.touches)
      }
    })

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
    let ongoingTouches = []

    function copyTouch ({ identifier, pageX, pageY }) {
      return { identifier, pageX, pageY }
    }

    function ongoingTouchIndexById (idToFind) {
      for (let i = 0; i < ongoingTouches.length; i++) {
        const id = ongoingTouches[i].identifier

        if (id === idToFind) {
          return i
        }
      }
      return -1 // not found
    }

    window.addEventListener('touchstart', (e) => {
      e.preventDefault()
      // const touches = e.changedTouches
      // console.log('touches', touches)

      // for (let i = 0; i < touches.length; i++) {
      //   ongoingTouches.push(copyTouch(touches[i]))
      // }

      ongoingTouches = e.touches
    })
    window.addEventListener('touchend', (e) => {
      e.preventDefault()
      // const touches = e.changedTouches

      // for (let i = 0; i < touches.length; i++) {
      //   const idx = ongoingTouchIndexById(touches[i].identifier)
      //   if (idx >= 0) ongoingTouches.splice(idx, 1) // remove it; we're done
      // }
      ongoingTouches = e.touches
    })
    window.addEventListener('touchcancel', (e) => {
      e.preventDefault()
      // const touches = e.changedTouches

      // for (let i = 0; i < touches.length; i++) {
      //   const idx = ongoingTouchIndexById(touches[i].identifier)
      //   if (idx >= 0) ongoingTouches.splice(idx, 1) // remove it; we're done
      // }
      ongoingTouches = e.touches
    })

    window.addEventListener('touchmove', (e) => {
      e.preventDefault()
      console.log('touche moves', e.touches)

      // const touches = e.changedTouches

      // for (let i = 0; i < touches.length; i++) {
      //   const idx = ongoingTouchIndexById(touches[i].identifier)
      //   if (idx >= 0) ongoingTouches.splice(idx, 1, copyTouch(touches[i]))
      // }
      ongoingTouches = e.touches
    })

    function run () {
      // Body.setVelocity(boxA, { x: 0, y: -2 })
      console.log(ongoingTouches)

      window.requestAnimationFrame(run)
      // props.setStore('params', 'x0', 'val', boxA.position.x)
      // props.setStore('params', 'y0', 'val', boxA.position.y)
      // props.setStore('params', 'x1', 'val', boxB.position.x)
      // props.setStore('params', 'y1', 'val', boxB.position.y)
      if (ongoingTouches.length <= 0) {
        render.options.background = 'yellow'
      } else if (ongoingTouches.length > 0) {
        render.options.background = 'pink'
      } else if (ongoingTouches.length > 1) {
        render.options.background = 'green'
      } else if (ongoingTouches.length > 2) {
        render.options.background = 'orange'
      }
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

  return <div
            ref={parent}
            style={{ width: `${props.width}px`, height: `${props.height}px` }}
              />
  // {/* <HydraCanvas class="absolute top-0 left-0" width={props.width} height={props.height} code={() => 'voronoi().out()'} s0={canvas} /> */}
}
