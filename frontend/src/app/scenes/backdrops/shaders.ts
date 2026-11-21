/* Fragment shaders for the page backdrops. One full-screen triangle each, opaque output in display (sRGB) space,
   so the canvas needs no alpha and the page behind it never has to be composited around "additive" pixels.
   Shared uniforms: uRes (px), uTime (s), uPtr (0..1, smoothed), uLight (0 dark .. 1 light), uFocus (0..1), uScroll. */

export type BackdropVariant = 'platform' | 'approach' | 'access';

const HEAD = /* glsl */ `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes; uniform float uTime, uLight, uFocus, uScroll; uniform vec2 uPtr;
float h21(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
vec2 h22(vec2 p){ p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3))); return fract(sin(p) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float v = 0., a = .5; for (int i = 0; i < 4; i++) { v += a * vnoise(p); p = p * 2.03 + vec2(17.1, 9.2); a *= .5; } return v; }
vec3 finish(vec3 c, vec2 fc){ return clamp(c, 0., 1.) + (h21(fc) - .5) / 255.; }   // dither: dark gradients band badly otherwise
`;

/* PLATFORM: a neural lattice. Voronoi cells drift; their borders are the "axons", their centres the "nodes", and a pulse
   leaves a wandering emitter and the pointer, lighting the borders as it passes. */
const PLATFORM = HEAD + /* glsl */ `
// x: distance to the nearest border, y: distance to the nearest site, z: site id hash
vec3 lattice(vec2 x, float t){
  vec2 n = floor(x), f = fract(x);
  float d1 = 8.; vec2 mr = vec2(0.); vec2 mg = vec2(0.);
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = vec2(float(i), float(j)); vec2 o = h22(n + g); o = .5 + .38 * sin(t + 6.2831 * o);
    vec2 r = g + o - f; float d = dot(r, r); if (d < d1) { d1 = d; mr = r; mg = g; }
  }
  float b = 8.;
  for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec2 g = mg + vec2(float(i), float(j)); vec2 o = h22(n + g); o = .5 + .38 * sin(t + 6.2831 * o);
    vec2 r = g + o - f;
    if (dot(mr - r, mr - r) > .00001) b = min(b, dot(.5 * (mr + r), normalize(r - mr)));
  }
  return vec3(b, sqrt(d1), h21(n + mg));
}
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  float t = uTime;
  vec2 par = (uPtr - .5) * vec2(1., -1.);
  vec3 dark = mix(vec3(.012, .02, .05), vec3(.02, .05, .12), uv.y);
  vec3 lite = mix(vec3(.93, .96, .995), vec3(.86, .91, .985), uv.y);
  vec3 col = mix(dark, lite, uLight);
  col += mix(vec3(.01, .05, .09), vec3(.0), uLight) * exp(-length(p - vec2(.18, .22)) * 1.6) * 2.4;     // a pool of light behind the headline

  vec3 lineCol = mix(vec3(.28, .74, 1.), vec3(.1, .3, .95), uLight);
  vec3 nodeCol = mix(vec3(.78, .96, 1.), vec3(.05, .2, .75), uLight);
  vec3 hotCol  = mix(vec3(.95, .38, .85), vec3(.75, .12, .6), uLight);
  vec2 emit = vec2(sin(t * .11) * .55, cos(t * .09) * .28) + vec2(.12, 0.);
  vec2 pe = (uPtr - .5) * vec2(uRes.x / uRes.y, -1.);

  for (int L = 0; L < 2; L++) {
    float fl = float(L);
    float sc = mix(4.2, 7.4, fl);
    vec2 q = (p + par * mix(.03, .075, fl) + vec2(0., uScroll * mix(.08, .16, fl))) * sc + fl * 7.3;
    vec3 v = lattice(q, t * mix(.16, .22, fl));
    float w = mix(.045, .03, fl);
    float edge = 1. - smoothstep(0., w, v.x);
    float node = exp(-v.y * v.y * mix(150., 230., fl));
    float ring = fract(length(p - emit) * .7 - t * .09);
    float pulse = smoothstep(.0, .05, ring) * (1. - smoothstep(.06, .22, ring));
    float pr = fract(length(p - pe) * 1.1 - t * .22);
    float ptrPulse = smoothstep(.0, .04, pr) * (1. - smoothstep(.05, .16, pr)) * (1. - smoothstep(0., .9, length(p - pe)));
    float lit = pulse + ptrPulse * 1.3;
    float fade = mix(1., .55, fl);
    float a = (edge * (.11 + 1.15 * lit) + node * (.14 + 1.2 * lit)) * fade;
    vec3 c = mix(lineCol, nodeCol, clamp(node * 1.6, 0., 1.));
    c = mix(c, hotCol, step(.9, v.z) * clamp(node * 2., 0., 1.));
    col = mix(col, c, clamp(a * mix(.5, .55, uLight), 0., 1.) * mix(1., .75, uLight)) + c * a * .15 * (1. - uLight);
  }
  float vig = 1. - smoothstep(.35, 1.25, length(uv - .5) * 1.5);
  col *= mix(.55 + .45 * vig, .9 + .1 * vig, uLight);
  gl_FragColor = vec4(finish(col, gl_FragCoord.xy), 1.);
}
`;

/* APPROACH: a signal-flow field. Contour lines of a warped noise field stream left to right; a light "stage beam"
   (uFocus, steered by the pipeline stepper on the page) brightens the part of the flow being talked about. */
const APPROACH = HEAD + /* glsl */ `
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  float t = uTime * .05;
  vec2 par = (uPtr - .5) * vec2(1., -1.);

  vec3 dark = mix(vec3(.02, .015, .06), vec3(.03, .03, .12), uv.y * .9 + .1 * uv.x);
  vec3 lite = mix(vec3(.96, .94, .995), vec3(.9, .9, .99), uv.y);
  vec3 col = mix(dark, lite, uLight);

  vec2 s = p * vec2(.8, 1.45) + par * .06 + vec2(0., uScroll * .12);
  vec2 q = vec2(fbm(s + vec2(0., t)), fbm(s + vec2(5.2, 1.3) - t));
  vec2 r = s + .62 * q;
  float f = fbm(r * 1.9 + vec2(-t * 3., 0.));
  float band = abs(fract(f * 13. - t * 2.) - .5);
  float line = 1. - smoothstep(.0, .06, band);
  float broad = 1. - smoothstep(.0, .2, band);

  float bx = (uFocus * 2. - 1.) * .72 * asp;
  float beam = exp(-pow(p.x - bx, 2.) * 6.5);
  float lane = smoothstep(.0, 1., 1. - abs(p.y) * 1.5);

  vec3 cA = mix(vec3(.5, .38, 1.), vec3(.3, .2, .85), uLight);
  vec3 cB = mix(vec3(.2, .82, 1.), vec3(.05, .45, .95), uLight);
  vec3 cC = mix(vec3(.98, .4, .78), vec3(.8, .15, .6), uLight);
  vec3 lc = mix(cA, cB, smoothstep(.2, .85, f));
  lc = mix(lc, cC, smoothstep(.65, 1., q.x) * .55);

  float a = line * (.14 + .9 * beam) * (.45 + .55 * lane) + broad * .04 * (.4 + beam);
  col = mix(col, lc, clamp(a, 0., 1.) * mix(.9, .7, uLight)) + lc * line * beam * .22 * (1. - uLight);
  col += mix(vec3(.06, .03, .16), vec3(.0), uLight) * beam * lane * .8;            // the beam's own glow

  float vig = 1. - smoothstep(.3, 1.3, length(uv - .5) * 1.5);
  col *= mix(.5 + .5 * vig, .9 + .1 * vig, uLight);
  gl_FragColor = vec4(finish(col, gl_FragCoord.xy), 1.);
}
`;

/* ACCESS: a secure gateway. A perspective floor grid runs to the horizon, a luminous ring stands on it like a doorway,
   with a bright arc circling it (the sign-in "handshake"), and stars above. */
const ACCESS = HEAD + /* glsl */ `
void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (gl_FragCoord.xy - .5 * uRes) / uRes.y;
  float t = uTime;
  vec2 par = (uPtr - .5) * vec2(1., -1.);
  float hz = -.08 + par.y * .02;
  p.x += par.x * .03;

  vec3 skyD = mix(vec3(.01, .05, .07), vec3(.005, .012, .03), smoothstep(hz, .55, p.y));
  vec3 skyL = mix(vec3(.9, .975, .965), vec3(.94, .965, .995), smoothstep(hz, .55, p.y));
  vec3 col = mix(skyD, skyL, uLight);
  float glowH = exp(-abs(p.y - hz) * 7.);
  col += mix(vec3(.02, .16, .15), vec3(.0), uLight) * glowH;
  col = mix(col, vec3(.7, .93, .88), uLight * glowH * .5);

  // stars (dark only)
  vec2 sg = floor(gl_FragCoord.xy / 3.);
  float st = step(.9965, h21(sg)) * smoothstep(hz, .3, p.y) * (.4 + .6 * sin(t * 1.3 + h21(sg + 3.) * 40.));
  col += vec3(.7, 1., .95) * st * (1. - uLight) * .8;

  vec3 gc = mix(vec3(.2, .95, .78), vec3(.02, .5, .44), uLight);
  // floor grid in perspective
  float y = p.y - hz;
  if (y < 0.) {
    float z = .32 / -y;
    vec2 g = vec2(p.x * z, z + t * .5);
    vec2 gd = abs(fract(g) - .5);
    float lineW = .028 + z * .0016;
    float gridV = 1. - smoothstep(0., lineW * 1.6, .5 - gd.x);
    float gridH = 1. - smoothstep(0., lineW * 1.6, .5 - gd.y);
    float grid = max(gridV, gridH) * exp(-z * .085) * smoothstep(0., .08, -y);
    col += gc * grid * .6 * (1. - uLight);
    col = mix(col, gc, grid * .5 * uLight);
  }

  // doorway ring: right of centre so the copy on the left stays calm
  vec2 c = vec2(.3 * asp * .55, .1 + par.y * .015);
  float R = .23;
  vec2 d = p - c;
  float rd = abs(length(d) - R);
  float ring = .0065 / (rd + .004);
  float ang = atan(d.y, d.x);
  float arc = smoothstep(.5, 1., sin(ang * 2. - t * .9) * .5 + .5);
  float inner = (1. - smoothstep(R * .15, R, length(d))) * .22;
  vec3 rc = mix(vec3(.45, 1., .86), vec3(.0, .5, .44), uLight);
  float rm = ring * (.5 + 1.1 * arc) + inner * (.5 + .5 * sin(t * .6));
  col += rc * rm * .8 * (1. - uLight);
  col = mix(col, rc, clamp(rm * .55, 0., 1.) * uLight);
  col += mix(vec3(.0, .1, .09), vec3(.0), uLight) * exp(-length(d) * 2.6);

  float vig = 1. - smoothstep(.3, 1.3, length(uv - .5) * 1.5);
  col *= mix(.55 + .45 * vig, .92 + .08 * vig, uLight);
  gl_FragColor = vec4(finish(col, gl_FragCoord.xy), 1.);
}
`;

export const SHADERS: Record<BackdropVariant, string> = { platform: PLATFORM, approach: APPROACH, access: ACCESS };
/** Fraction of the CSS-pixel resolution each backdrop renders at; they are soft by design, so this saves GPU for free. */
export const SCALE: Record<BackdropVariant, number> = { platform: 0.7, approach: 0.8, access: 0.9 };
