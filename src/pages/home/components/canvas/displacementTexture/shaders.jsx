export const vertex = /* glsl */ `
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vRatio;

uniform float uTime;

void main() {
  vUv = uv;
  vPosition = position;

  vec4 newPos = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * newPos; //modelViewMatrix * vec4(position, 1.0);
}`

export const fragment = /* glsl */ `

varying vec2 vUv;
varying vec2 vRatio;
varying vec3 vPosition;

uniform float uTime;

uniform sampler2D uTrailTexture; 
uniform sampler2D uFBOTexture; 

void main() {
  vec2 newUv = vUv;

  vec4 trailTx = texture2D(uTrailTexture, newUv) * 0.01;
  vec2 plusUv = fract(vec2(newUv.x + trailTx.r, newUv.y + trailTx.r ));

  vec4 fboTx = texture2D(uFBOTexture, plusUv);
//   vec4 color = vec4(0.0, 1.0, 0.0, 1.0);

  gl_FragColor = fboTx;
}`