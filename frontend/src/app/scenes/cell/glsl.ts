/* Shared GLSL for the living-cell scene. Colour maths is done in display space and
   decoded to linear inside packOut(), so the same shaders look right with or without
   the post-processing composer (which expects linear input). */

export const HEAD = /* glsl */ `
uniform float uTime, uLight, uPx, uAmp, uStretch, uHealth, uOpacity, uNuc, uScanOn, uScanY;
uniform float uStreams, uStrand, uConst, uHead, uFall, uFocus, uBokeh, uQuality, uExposure, uOrg, uBulb;
uniform vec3 uPoke;
uniform vec4 uRipple;
uniform vec2 uEnv, uRes;
const vec3 CYAN   = vec3(.133, .827, .933);
const vec3 VIOLET = vec3(.659, .333, .969);
const vec3 PINK   = vec3(.925, .282, .600);
const vec3 AMBER  = vec3(.984, .573, .235);
const vec3 SICK   = vec3(1.0, .27, .31);
// Dark theme only: how much neon plasma is lit (0 in light; uBulb stutters on like a bulb, then holds)
#define NEON ((1. - uLight) * uBulb)
const vec3 N_CYAN = vec3(0., .9, 1.);
const vec3 N_BLUE = vec3(.18, .45, 1.);
const vec3 N_VIO  = vec3(.58, .22, 1.);
const vec3 N_MAG  = vec3(1., .12, .82);
vec3 neonPal(float s){
  s = fract(s);
  vec3 c = mix(N_CYAN, N_BLUE, smoothstep(0., .25, s));
  c = mix(c, N_VIO, smoothstep(.25, .5, s));
  c = mix(c, N_MAG, smoothstep(.5, .78, s));
  return mix(c, N_CYAN, smoothstep(.78, 1., s));
}
`;

export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
mat3 rotAxis(vec3 axis, float angle){
  axis = normalize(axis);
  float s = sin(angle), c = cos(angle), oc = 1.0 - c;
  return mat3(
    oc * axis.x * axis.x + c,          oc * axis.x * axis.y - axis.z * s, oc * axis.z * axis.x + axis.y * s,
    oc * axis.x * axis.y + axis.z * s, oc * axis.y * axis.y + c,          oc * axis.y * axis.z - axis.x * s,
    oc * axis.z * axis.x - axis.y * s, oc * axis.y * axis.z + axis.x * s, oc * axis.z * axis.z + c);
}
`;

/* Studio-style environment so glossy parts reflect something: soft key, cyan rim, magenta kicker. */
export const ENV = /* glsl */ `
vec3 envColor(vec3 r){
  float ec = cos(uEnv.x), es = sin(uEnv.x);
  r.xz = mat2(ec, -es, es, ec) * r.xz;
  r.y += uEnv.y;
  r = normalize(r);
  float up = r.y * .5 + .5;
  vec3 col = mix(vec3(.015, .02, .05), vec3(.16, .24, .42), pow(clamp(up, 0., 1.), 2.2));
  col += vec3(1., .96, .92) * pow(max(dot(r, normalize(vec3(.5, .85, .35))), 0.), 22.) * 1.6;
  col += vec3(.25, .65, 1.) * pow(max(dot(r, normalize(vec3(-.85, .1, -.4))), 0.), 10.) * 1.1;
  col += vec3(1., .3, .7) * pow(max(dot(r, normalize(vec3(.25, -.6, .65))), 0.), 9.) * .8;
  return col;
}
`;

/* Premultiplied output. Dark theme: mostly additive glow. Light theme: tinted ink with real coverage. */
export const PACK = /* glsl */ `
bool badf(float x){ return (floatBitsToUint(x) & 0x7fffffffu) >= 0x7f800000u; }   // NaN or Inf
vec4 packWith(vec3 glow, float a, float exposure){
  // Safety net: one NaN pixel in the half-float buffer is smeared over the whole frame by Bloom, which showed as a one-frame blank.
  if (badf(glow.r) || badf(glow.g) || badf(glow.b) || badf(a)) return vec4(0.);
  vec3 g = pow(max(glow, vec3(0.)), vec3(2.2)) * exposure * mix(.62, 1., uLight);   // dark theme: every glow runs about a third dimmer
  float m = max(g.r, max(g.g, g.b));
  // dark theme: one layer can't push past ~1.2 per channel, so neon keeps its hue instead of burning to white
  vec3 gd = m > .75 ? g * (.75 + .45 * (1. - exp(-(m - .75) * 1.5))) / m : g;
  // occlusion follows emission: an unlit part must never darken the page into a black silhouette
  vec4 dk = vec4(gd, a * .22 * smoothstep(0., .1, m));
  vec4 lt = vec4(g * vec3(.55, .6, .72) * a, a * .78);
  return mix(dk, lt, uLight);
}
vec4 packOut(vec3 glow, float a){ return packWith(glow, a, uExposure); }
// story props (streams, strand, scan, constellation) stay legible when the rest is dimmed for copy
vec4 packStory(vec3 glow, float a){ return packWith(glow, a, pow(uExposure, .3)); }
`;

/* Membrane shape, shared by the membrane mesh and the cilia that grow out of it. */
export const MEMBRANE_FN = /* glsl */ `
const float RAD = 2.4;
float membraneDisp(vec3 d){
  // healthy: slow broad swell only. The two faster, finer octaves (a bump per second) come back as the cell gets sick (the Problem scene shakes)
  float sick = 1. - uHealth, t = uTime * .32, tf = uTime * mix(.1, .32, sick);
  float n = snoise(d * 1.35 + vec3(0., t, 0.)) * .55
          + snoise(d * 3.1 - vec3(tf * 1.3, 0., tf * .4)) * mix(.12, .22, sick)
          + snoise(d * 6.4 + tf * .7) * mix(.025, .07, sick);
  float poke = pow(max(dot(d, normalize(uPoke + vec3(1e-5))), 0.), 5.) * length(uPoke);
  float th = acos(clamp(dot(d, uRipple.xyz), -1., 1.));
  float rip = sin(th * 9. - uRipple.w * 9.) * exp(-uRipple.w * 1.5) * exp(-th) * .22 * step(0., uRipple.w);
  return n * uAmp + poke * .55 + rip;
}
vec3 membraneSurf(vec3 d){
  vec3 p = d * (RAD + membraneDisp(d));
  p.y *= 1. + uStretch;
  p.xz *= inversesqrt(1. + uStretch);
  return p;
}
`;

const FINISH = `
  #include <colorspace_fragment>
`;

export const vs = (body: string) => HEAD + NOISE + body;
export const fs = (body: string) => HEAD + NOISE + ENV + PACK + body;
export { FINISH };
