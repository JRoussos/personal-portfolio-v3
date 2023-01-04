export const vertex = /* glsl */ `
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vRatio;

uniform vec2 uSize;
uniform float uDelta;
uniform float uTime;
uniform float uHover;

void main() {
  vUv = uv;
  vPosition = position;

  float VIEWPORT_ASPECT_RATIO = uSize.x/uSize.y;
  float IMAGE_ASPECT_RATIO = 2.0;
  
  vRatio = vec2(1.0);

  if (IMAGE_ASPECT_RATIO > VIEWPORT_ASPECT_RATIO) {
    vRatio = vec2(IMAGE_ASPECT_RATIO /VIEWPORT_ASPECT_RATIO, 1.0);
  }
  
  if (VIEWPORT_ASPECT_RATIO > IMAGE_ASPECT_RATIO) {
    vRatio = vec2(1.0, VIEWPORT_ASPECT_RATIO /IMAGE_ASPECT_RATIO);
  }

  vec4 newPos = modelViewMatrix * vec4(position, 1.0);

  newPos.z += sin(length(vRatio) * PI + PI/2.0) * -uDelta;
  newPos.y -= (sin(uv.x * PI/2.0) + cos(PI)) * uDelta * 0.6;

  float dist = distance(vUv, vec2(0.5));
  newPos.y += sin(dist*2.0 - uTime) * cos(1.0 - uDelta * 0.5);

  gl_Position = projectionMatrix * newPos; //modelViewMatrix * vec4(position, 1.0);
}`

export const fragment = /* glsl */ `
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;
varying vec2 vRatio;
varying vec3 vPosition;

uniform float uTime;
uniform float uDelta;
uniform float uAlpha;

uniform vec2 uSize;

uniform sampler2D uTexture; 

vec2 mirrored(vec2 v) {
  vec2 m = mod(v, 2.0);
  return mix(m, 2.0 - m, step(1.0, m));
}

float random(vec2 co, float t) {
  return fract(sin(mod(dot(co.xy, vec2(12.9898, 78.233) + t), PI)) * 43758.5453);
}

// https://github.com/mattdesl/glsl-blend-soft-light
vec3 blendSoftLight(vec3 base, vec3 blend) {
    return mix(
        sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend), 
        2.0 * base * blend + base * base * (1.0 - 2.0 * blend), 
        step(base, vec3(0.5))
    );
}

float luma(vec3 color) {
  return dot(color, vec3(0.299, 0.587, 0.114));
}

void main() {
  vec2 newUv = vUv;

  newUv = (vUv - vec2(0.5)) / vRatio + vec2(0.5);
  newUv.y += (1.0 - uDelta*0.3) * 0.02;

  vec3 tx = texture2D(uTexture, mirrored(newUv)).rgb;
  vec3 rn = vec3(random(newUv, uTime));

  float luminance = luma(tx);
  vec3 gray = vec3(luminance);
  vec3 difference = tx - gray;

  difference *= 1.8 * (1.0 - abs(uDelta) * 0.04);
  vec3 saturation = clamp(gray + difference, 0.0, 1.0);
  
  float response = smoothstep(0.05, 0.5, luminance);

  vec3 color = blendSoftLight(mix(tx, saturation, 0.5), rn);
  color = mix(color, tx, 0.5);

  gl_FragColor = vec4( color, 1.0 - uAlpha); //mix(tx, rn, 0.16);
//   gl_FragColor.a = 1.0 - uAlpha;
}`