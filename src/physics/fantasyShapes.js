import { Bodies } from 'matter-js'
import { djembe, marimba, feedbackToy, marimbaDelay } from './dsp/faustInstruments.js'

/*
to do: best data structure for representing relationships, don't want to duplicate
*/
const circle = {
  create: ({ x = 100, y = 100 }) => Bodies.circle(x, y, 20 + Math.random() * 20, { label: 'circle' }),
  relationships: {
    circle: 'drum-collide',
    rect: 'marimba-ting'
  }
}

const rect = {
  create: ({ x = 100, y = 200 }) => Bodies.rectangle(x, y, 20 + Math.random() * 100, 20 + Math.random() * 100, { label: 'rect' }),
  relationships: {
    rect: 'marimba-delay',
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
  'rect-circle': {
    dsp: marimbaDelay
  },
  'marimba-delay': {
    dsp: marimbaDelay
  }
}

export { fantasyShapes, fantasyRelationships }
