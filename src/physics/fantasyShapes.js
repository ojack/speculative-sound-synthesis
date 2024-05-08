import { Bodies } from 'matter-js'
import { djembe, marimba, marimbaDelay } from './../dsp/faustInstruments.js'

/*
to do: best data structure for representing relationships, don't want to duplicate
*/
const circle = {
  create: ({ x = 100, y = 100 } = {}) => Bodies.circle(x, y, 20 + Math.random() * 20, { label: 'circle', restitution: 1, friction: 0, frictionAir: 0, frictionStatic: 0 }),
  relationships: {
    circle: 'marimba-delay',
    rect: 'marimba-ting'
  }
}

const rect = {
  create: ({ x = 100, y = 200 } = {}) => Bodies.rectangle(x, y, 20 + Math.random() * 500, 20 + Math.random() * 100, { label: 'rect', restitution: 0.99, friction: 0, frictionAir: 0, frictionStatic: 0, angle: 10 }),
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
