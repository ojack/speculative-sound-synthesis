# ~plink ~plank ~plunk

## running
1. Clone the repo (make sure to recurse submodules)
```shell
git clone --recurse-submodules git@github.com:ojack/speculative-sound-synthesis.git
```

2. install libraries
```shell
npm install
```

3. build local copy of faust-web-component
```shell
# change fo component directory
cd faust-web-component
# install dependencies
npm install

# build
npm run build
```

4. run app in dev mode
return to `speculative-sound-synthesis` root directory
```shell
npm run dev
```

## Editing worlds 
The current world configuration is contained in `/src/phantasy-world/basic.js`. Edit this file to change the shapes that appear on the screen/

## (deprecated)

## available drawing parameters
- x: x position of initial touch point
- y: y position of initial touch point
- pointerdown: 0 when no touch points are detected, 1 when one or more touch points

## mapping audio parameters to drawing parameters
Use existing faust syntax to map audio parameters directly to drawing ui parameters. Uses the syntax defined at https://faustdoc.grame.fr/manual/syntax/#ui-label-metadata for adding metadata to a faust UI element. Metadata parameters use the 'draw' key to indicate that they should be controlled by a specific drawing parameter, such as X postion or Y position, etc. 

```C
import("stdfaust.lib");
  
vol = hslider("volume [unit:dB][draw:pointerdown]", -96, -96, 0, 0.1) : ba.db2linear : si.smoo;
freq1 = hslider("freq1 [unit:Hz][draw:x]", 1000, 20, 3000, 1);
freq2 = hslider("freq2 [unit:Hz][draw:y]", 200, 20, 3000, 1);
  
process = vgroup("Oscillator", os.osc(freq1) * vol, os.osc(freq2) * vol);
```
