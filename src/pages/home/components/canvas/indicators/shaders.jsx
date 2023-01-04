export const vertex = /* glsl */ `

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

export const fragment = /* glsl */ `
varying vec2 vUv;

uniform float uDistance;

void main() {
    vec3 white = vec3(1.0, 1.0, 1.0);
    float alpha = clamp(uDistance, 0.2, 1.0);

    gl_FragColor = vec4(white, 1.0);
}`