/*
example world file for my physics phantasy
available parameters: for agent with label 0: x0 (position in X), y0, vx0, vy0 (velocity), ax0, ay0 (acceleration), speed0, angle0, angularVelocity0
isColliding0  (whether is colliding with ANY body ?? in family or more generally? )

@todo:
- parameter mappings are inferred from dsp code, however, they can be overwritten using javascript
- how to specify mappings within javascript? parameter map: {f1: ax0, f2: ay0 }
- specify which things appear as buttons
- how to define x and y
- flag whether to continously track bodies, or only track when colliding
*/

// draw:0:velocity:x

const world = {
  settings: {
    color: 'pink',
    backgroundColor: 'black',
    gravity: { x: 0, y: 0 }
  },
  constellations: [{ // a constellation is a set of bodies or agents that relate to each other
    label: 'swinging oscillators',
    bodyDefaults: { friction: 0.02, frictionAir: 0.0, frictionStatic: 0.4, restitution: 0.8, render: { fillStyle: 'red' } }, // default parameters applied to a body
    dsp: `import("stdfaust.lib");

    f1 = hslider("f1[draw:x0]", 10, 10, 100, 0.1);
    f2 = hslider("f2[draw:x1]", 10, 10, 400, 0.1);
    f3 = hslider("f3[draw:y0]", 100, 10, 400, 0.1);
    f4 = hslider("f4[draw:y1]", 100, 4, 100, 0.1);
    
    process = os.osc(os.osc(f4)*f3+os.osc(f1)*f2)  <: _, _;`,
    bodies: [
      { label: 'red-circle', render: { fillStyle: 'red' }, shape: 'circle', width: 30, height: 30, x: 40, y: 100 },
      { label: 'green-circle', render: { fillStyle: 'green' }, shape: 'circle', width: 40, height: 40, x: 200, y: 100 },
      { label: 'purple-rect', render: { fillStyle: 'purple' }, shape: 'rectangle', friction: 0, frictionAir: 0.015, angle: 60, width: 300, height: 15, isSensor: true, x: 40, y: 300 }
    ], // use labels or array index to access bodies
    signalMap: { // map from physics parameters to dsp parameters
      gate: 'red-circle.isColliding',
      f1: 'red-circle.position.x',
      f2: 'red-circle.position.y',
      f3: 'green-circle.position.x',
      f4: 'purple-rect.position.y'
    }
  }
  // , {
  //   label: 'plink',
  //   dsp: `import("stdfaust.lib");

  //   process = pm.marimba(freq,strikePosition,strikeCutoff, strikeSharpness,gain,gate)*outGain
  //   with{
  //       freq = hslider("v:marimba/h:[0]midi/[0]freq[style:knob][draw:x1]",60,50,800,0.01);
  //       gain = hslider("v:marimba/h:[0]midi/[2]gain[style:knob][draw:depth]",1,0.1,2.0,0.01);
  //       strikePosition = hslider("v:marimba/h:[1]otherParams/[0]strikePosition
  //       [midi:ctrl 1][style:knob]",0.5,0,1,0.01);
  //       strikeCutoff= 7000;
  //       strikeSharpness = hslider("v:marimba/h:[1]otherParams/[1]strikeSharpness[style:knob]",0.5,0.01,5,0.01);
  //       outGain = hslider("v:marimba/h:[1]otherParams/[2]outGain
  //       [style:knob]",0.8,0,1,0.01);
  //       //gate = button("v:marimba/[3]gate");
  //       gate = hslider("v:marimba/[1]gate[draw:isColliding]", 0.0, 0.0, 1.0, 1.0);
  //   } <:  dm.freeverb_demo;`
  // }
  ]
}

export default world

// { label: 'rect', restitution: 0.99, friction: 0, frictionAir: 0, frictionStatic: 0, angle: 10, render: { lineWidth: 4, strokeStyle: 'green' } }
