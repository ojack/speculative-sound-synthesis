import { Bodies, Body } from 'matter-js'
import { createEffect, createSignal } from 'solid-js'
import { createStore, reconcile } from 'solid-js/store'
// using existing classes as stores: https://github.com/solidjs/solid/discussions/1474

// eaxh constellation has its own store which is used in both dsp code and physics
function createBody (options, paths) {
  let body = null
  const { shape, width, height, x, y } = options
  options.plugin = {}
  if (options.isSensor) {
    options.plugin.wrap = {
      min: {
        x: 0,
        y: 0
      },
      max: {
        x: 500,
        y: 500
      }
    }
  }

  options.plugin.signals = paths
  // options.plugin.isColliding = false // add more details

  if (shape === 'circle') {
    // return Bodies[options.shape](b.x, b.y, b.width, options)
    // { label: 'circle', restitution: 1, friction: 0.0, frictionAir: 0.0, frictionStatic: 0 }
    // return Bodies.circle(100, 100, 20 + Math.random() * 20, options)
    // const { type, ...shapeOptions } = options // removes type parameter
    // const { label, angle, friction, frictionAir, frictionStatic, isSensor, restitution, render, type, x, y, width, height } = options
    body = Bodies[shape](x, y, width, options)
  } else {
    body = Bodies[shape](x, y, width, height, options)
  }

  if (options.velocity) {
    const velocity = Object.assign({}, { x: 0, y: 0 }, options.velocity)
    console.log('setting veloctiry', velocity)
    Body.setVelocity(body, velocity)
  }
  //   const [positionStore] = createStore(body.position)
  //   body.position = positionStore

  //   const handler3 = {
  //     // get (target, prop, receiver) {
  //     //   console.log('accessing', prop)
  //     //   return Reflect.get(...arguments)
  //     // }
  //   }

  //   const proxy3 = new Proxy(body, handler3)

  // make body into reactive
  //   const [store, setStore] = createStore(body)
  //   createEffect(() => {
  //     console.log('position changed', store.position.x)
  //   })
  //   console.log('body', body)
  //   window.setBodyStore = setStore
  body.isColliding = 0
  return body
}

export const createConstellationStore = (_constellation) => {
  const { label, dsp, bodyDefaults, signalMap, bodies } = _constellation

  const paths = Object.values(signalMap).map((p, i) => ({ path: p.split('.'), index: i }))
  console.log('paths!', paths)
  const bodyObjects = _constellation.bodies.map(bodyParams => createBody(Object.assign({}, bodyDefaults, bodyParams), paths.filter(b => b.path[0] === bodyParams.label)))
  const signals = {}
  // tracked properties
  const signalArray = Object.entries(signalMap).map(([faustParam, signalPath], i) => ({ faustParam, signalPath }))
  //   console.log('SIGNALS ARE', signals)

  const constellation = { label, dsp, bodies, signals, signalArray }
  const [store, setStore] = createStore(constellation)
  const [bodyStore, setBodyStoreOrigin] = createStore(bodies)
  // trigger an update when anything is changed
  // https://github.com/solidjs/solid/discussions/829
  const [triggerUpdate, setTriggerUpdating] = createSignal(1)
  const setBodyStore = (...args) => {
    setTriggerUpdating((v) => v + 1)
    console.log('updating', args)
    setBodyStoreOrigin(...args)
  }

  const renderProps = ['fillStyle', 'fill', 'lineWidth', 'opacity', 'visible', 'strokeStyle']
  createEffect(() => {
    console.log('body length has changed', bodyStore.length)
    bodyStore.forEach((body, i) => {
      createEffect(() => {
        // Object.keys(body)
        console.log('rendering has changed', Object.keys(body.render))
        // console.log('friction has changed', body.friction)
        console.log('width has changed', body.width, i, bodyObjects[i])
        // bodyObjects[i].width = body.width
        Body.set(bodyObjects[i], { width: body.width })
        // Body.set(bodyObjects[i], { render: { fillStyle: 'orange' } })
      })
    //   renderProps.forEach(prop => {
    //     createEffect(() => {
    //       bodyObjects[i].render[prop] = body.render[prop]
    //     })
    //   })
    })
  })

  //    createEffect(() => {
  //        bodyStore.forEach((body, i) => {
  //             createEffect(() => {
  //                 console.log('body has changed', body)
  //             })
  //         })
  //       })
  //       console.log('updating', args)

  window.setBodyStore = setBodyStore
  window.reconcile = reconcile
  // reconcile: https://github.com/solidjs/solid/blob/b5a379f889e8f7a208bc223b908a0fdcf353d944/packages/solid/store/src/server.ts#L112

  console.log('STORE IS', store)
  return {
    store,
    setStore,
    bodyObjects
  }
}

const resolvePath = (object, path, defaultValue = 0) => path.reduce((o, p) => {
  // console.log(o, p)
  return o ? o[p] : defaultValue
}, object)

// for some reason couldnt figure out how to map over object using <For> so using an array instead
export const updateSignals = function (body, setStore) {
  let newVal
  if (body.plugin.signals) {
    body.plugin.signals.forEach((signalPath) => {
    // console.log('resolving', signalPath)

      newVal = resolvePath(body, signalPath.path.slice(1)).toFixed(2)
      setStore('signals', signalPath.path.join('.'), newVal)
    //  setStore('signalArray')
      // setStore{'signalArray'}
      // console.log('new val of', signalPath, 'is', newVal)
    })
  }
//   if (body.label === 'red-circle') {
//   //  newVal = body.position
//     console.log(body.position.x, newVal)
//     // newVal = body.position.x
//   }
  // console.log(body.position.x, newVal)
}
