import { Bodies, Body } from 'matter-js'
import { djembe, marimba, marimbaDelay } from './../dsp/faustInstruments.js'

/*
to do: best data structure for representing relationships, don't want to duplicate
*/
const circle = {
  create: ({ x = 100, y = 100 } = {}) => {
    const c = Bodies.circle(x, y, 20 + Math.random() * 20, { label: 'circle', restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0 })
    Body.setVelocity(c, { x: 5, y: 0 })
    return c
  },
  relationships: {
    circle: 'marimba-delay',
    rect: 'marimba-ting'
  }
}

const rect = {
  create: ({ x = 250, y = 250 } = {}) => Bodies.rectangle(x, y, 300 + Math.random() * 280, 20 + Math.random() * 40, { label: 'rect', restitution: 0.99, friction: 0, frictionAir: 0, frictionStatic: 0, angle: 10 }),
  relationships: {
    rect: 'drum-collide',
    circle: 'marimba-ting'
  }
}

const fantasyShapes = { circle, rect }

const fantasyRelationships = {
  'drum-collide': {
    dsp: djembe
  },
  'marimba-ting': {
    dsp: marimba
  },
  'marimba-delay': {
    dsp: marimbaDelay
  }
}

export { fantasyShapes, fantasyRelationships }
