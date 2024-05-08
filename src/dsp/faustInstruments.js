const marimba = `import("stdfaust.lib");

process = pm.marimba(freq,strikePosition,strikeCutoff, strikeSharpness,gain,gate)*outGain
with{
    freq = hslider("v:marimba/h:[0]midi/[0]freq[style:knob][draw:angle]",60,50,400,0.01);
    gain = hslider("v:marimba/h:[0]midi/[2]gain[style:knob][draw:depth]",1,0.1,2.0,0.01);
    strikePosition = hslider("v:marimba/h:[1]otherParams/[0]strikePosition
    [midi:ctrl 1][style:knob]",0.5,0,1,0.01);
    strikeCutoff= 7000;
    strikeSharpness = hslider("v:marimba/h:[1]otherParams/[1]strikeSharpness[style:knob]",0.5,0.01,5,0.01);
    outGain = hslider("v:marimba/h:[1]otherParams/[2]outGain
    [style:knob]",1,0,1,0.01);
    //gate = button("v:marimba/[3]gate");
    gate = hslider("v:marimba/[1]gate[draw:isColliding]", 0.0, 0.0, 1.0, 1.0);
} <: _,_;`

const marimbaDelay = `import("stdfaust.lib");
del = hslider("del[draw:y]",0.1,0.01,1,0.01) : si.smoo;
fb = hslider("fb[acc: 1 0 -10 0 10]",0.5,0,1,0.01) : si.smoo;
y1 = hslider("y1",0.1,0,1,0.01) : si.smoo;

echo = +~(de.delay(65536,del*ma.SR)*fb);

process = pm.marimba(freq,strikePosition,strikeCutoff, strikeSharpness,gain,gate)*outGain
with{
    freq = hslider("v:marimba/h:[0]midi/[0]freq[style:knob][draw:angle]",60,50,400,0.01);
    gain = hslider("v:marimba/h:[0]midi/[2]gain[style:knob][draw:depth]",1,0.1,2.0,0.01);
    strikePosition = hslider("v:marimba/h:[1]otherParams/[0]strikePosition
    [midi:ctrl 1][style:knob]",0.5,0,1,0.01);
    strikeCutoff= 7000;
    strikeSharpness = hslider("v:marimba/h:[1]otherParams/[1]strikeSharpness[style:knob]",0.5,0.01,5,0.01);
    outGain = hslider("v:marimba/h:[1]otherParams/[2]outGain
    [style:knob]",1,0,1,0.01);
    //gate = button("v:marimba/[3]gate");
    gate = hslider("v:marimba/[1]gate[draw:isColliding]", 0.0, 0.0, 1.0, 1.0);
} : echo : ef.cubicnl(y1,0)*0.99 <: _,_;`

const djembe = `import("stdfaust.lib");

process = pm.djembe(freq,strikePosition,strikeSharpness,gain,gate)*outGain
with{
    freq = hslider("v:djembe/h:[0]midi/[0]freq[style:knob][draw:angle]",60,50,100,0.01);
    gain = hslider("v:djembe/h:[0]midi/[2]gain[style:knob][draw:depth]",1,0.1,2.0,0.01);
    strikePosition = hslider("v:djembe/h:[1]otherParams/[0]strikePosition
    [midi:ctrl 1][style:knob]",0.5,0,1,0.01);
    strikeSharpness = hslider("v:djembe/h:[1]otherParams/[1]strikeSharpness[style:knob]",0.5,0.01,5,0.01);
    outGain = hslider("v:djembe/h:[1]otherParams/[2]outGain
    [style:knob]",1,0,1,0.01);
    //gate = button("v:djembe/[3]gate");
    gate = hslider("v:djembe/[1]gate[draw:isColliding]", 0.0, 0.0, 1.0, 1.0);
} <: _,_;`

const feedbackToy = `import("stdfaust.lib");

// parameters
x0 = hslider("x0",0.5,0,1,0.01) : si.smoo;
y0 = hslider("y0",0.5,0,1,0.01) : si.smoo;
y1 = hslider("y1",0,0,1,0.01) : si.smoo;
q = hslider("q[draw:x]",30,10,50,0.01) : si.smoo;
del = hslider("del[draw:y]",0.5,0.01,1,0.01) : si.smoo;
fb = hslider("fb[acc: 1 0 -10 0 10]",0.5,0,1,0.01) : si.smoo;

// mapping
impFreq = 2 + x0*20;
resFreq = y0*3000+300;

// simple echo effect
echo = +~(de.delay(65536,del*ma.SR)*fb);

// putting it together
process = os.lf_imptrain(impFreq) : fi.resonlp(resFreq,q,1) : echo : ef.cubicnl(y1,0)*0.95 <: _,_;`

const chime = `// Chime instrument in Faust using modal synthesis

import("stdfaust.lib");

// Use "sliders" to add parameters to control the instrument
freq = hslider("freq[draw:x1]", 500, 50, 2000, 0.001);
noiseAmt = hslider("noise", 0, 0, 1, 0.0001);
preamp = hslider("preamp", 1, 0, 1, 0.0001);
lp1 = hslider("lp1", 400, 100, 10000, 0.0001);
hp1 = hslider("hp1", 500, 50, 10000, 0.0001);

rev_st = re.zita_rev1_stereo(0, 200, 6000, 5, 3, 44100);
filters = fi.lowpass(1, lp1)*preamp : fi.highpass(5, hp1);
loop1 = + ~ (@(1.283 : ba.sec2samp) * -0.6);
loop2 = + ~ (@(0.937 : ba.sec2samp) * -0.5);
delmix(dry, del1, del2) = dry*0.6+del1, dry*0.12+del2;
del = _ <: _, loop1, loop2 : delmix;
mixer(rev1, rev2, del1, del2) = del1*0.2+rev1, del2*0.2+rev2;

// process = filters : del <: rev_st,_,_ : mixer : co.limiter_1176_R4_stereo;

// Exciter: a filtered oscillator
exc = no.pink_noise * noiseAmt * 0.5;

// Modal body
body = exc <:
	pm.modeFilter(freq, 1.2, 0.1),
	pm.modeFilter(freq*2.778, 1.2, 0.1),
	pm.modeFilter(freq*5.18, 1.2, 0.1),
	pm.modeFilter(freq*8.163, 1.2, 0.1),
	pm.modeFilter(freq*11.66, 1.2, 0.1),
	pm.modeFilter(freq*15.638, 1.2, 0.1),
	pm.modeFilter(freq*20, 1.2, 0.1)
:> filters : del <: rev_st,_,_ : mixer : co.limiter_1176_R4_stereo;

process = body;`

const resonantDrone = `// "Resodrone" synthesizer in Faust

import("stdfaust.lib");

// Use "sliders" to add parameters to control the instrument
lp1 = hslider("lp1", 100, 50, 800, 0.001);
f1 = hslider("f1[draw:y0]", 100, 30, 330, 0.0001);
f2 = hslider("f2[draw:x1]", 123, 30, 330, 0.0001);
f3 = hslider("f3[draw:x0]", 87, 30, 330, 0.0001);
pulseAmt = hslider("pulse[draw:isColliding]", 0.0, 0, 1, 0.0001);
noiseAmt = hslider("noise", 0.076, 0, 1, 0.0001);

// Convert frequency to delay line length in samples
freq2len(f) = 1.0 / f : ba.sec2samp;

// Exciter: filtered oscillators
noise = no.noise * 0.3 * noiseAmt : fi.lowpass(2, lp1);
pulse = os.sawtooth(f1) * 4 * pulseAmt : fi.lowpass(1, 500);
no2 = no.sparse_noise(5) * 0.2 : fi.resonbp(15000+2000*os.osc(0.3), 5, 1);
srcs = noise + pulse + no2;
exc = srcs : fi.highpass(1, 300) : fi.bandstop(1, 2500, 9000) : fi.lowpass(2, 11000);

// Series of comb filters (feedback delay lines)
loop(f) = + ~ (de.fdelay2(9000, freq2len(f)) : _*0.8);
res = loop(f1 - 1 + 2*no.lfnoise0(1)) : loop(f2) : loop(f3);

preamp = hslider("preamp", 1, 0, 1, 0.0001);
lp2 = hslider("lp2", 15000, 100, 15000, 0.0001);

rev_st = re.zita_rev1_stereo(0, 200, 6000, 10, 20, 44100);

// Extreme compressor
comp = *(5) : co.limiter_1176_R4_mono : *(0.5);

process = exc : res : comp : _*preamp : fi.lowpass(1, lp2) <: rev_st;`

export { djembe, feedbackToy, marimba, marimbaDelay, resonantDrone }
