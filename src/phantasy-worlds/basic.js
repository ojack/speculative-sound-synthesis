/*
example world file for my physics phantasy
available parameters: for agent with label 0: x0 (position in X), y0, vx0, vy0 (velocity), ax0, ay0 (acceleration), speed0, angle0, angularVelocity0
isColliding0  (whether is colliding with ANY body ?? in family or more generally? )

@todo:
- parameter mappings are inferred from dsp code, however, they can be overwritten using javascript
- specify which things appear as buttons
*/

const world = {
  ecosystem: {
    color: 'white',
    backgroundColor: 'black',
    gravity: { x: 0, y: 0 },
    bodyDefaults: { friction: 0.2, frictionAir: 0.1, frictionStatic: 0.4, restitution: 0.4, render: { fillStyle: 'red' } } // default parameters applied to a body
  },
  constellations: [{ // a constellation is a set of bodies or agents that relate to each other
    name: 'swinging oscillators',
    dsp: `import("stdfaust.lib");

    f1 = hslider("f1[draw:x0]", 10, 10, 100, 0.1);
    f2 = hslider("f2[draw:x1]", 10, 10, 400, 0.1);
    f3 = hslider("f3[draw:y0]", 100, 10, 400, 0.1);
    f4 = hslider("f4[draw:y1]", 100, 4, 100, 0.1);
    
    process = os.osc(os.osc(f4)*f3+os.osc(f1)*f2)  <: _, _;`,
    bodies: [
      { label: '0', render: { fillStyle: 'red' }, type: 'circle', width: 30, height: 30 },
      { label: '1', render: { fillStyle: 'green' }, type: 'circle', width: 40, height: 40 },
      { label: '2', render: { fillStyle: 'purple' }, type: 'rectangle', angle: 30, width: 300, height: 15, isSensor: true }
    ]
  }]
}

export default world

// { label: 'rect', restitution: 0.99, friction: 0, frictionAir: 0, frictionStatic: 0, angle: 10, render: { lineWidth: 4, strokeStyle: 'green' } }
