export const vertex = /* glsl */ `
uniform vec2 uOffset;

varying vec2 vUv;

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
  float M_PI = 3.1415926535897932384626433832795;
  
  position.x = position.x + (sin(uv.y * M_PI) * offset.x);
  position.y = position.y - (sin(uv.x * M_PI) * offset.y);

  return position;
}

void main() {
  vUv = uv;
  
  vec3 newPosition = position;
  newPosition = deformationCurve(position, uv, uOffset * 0.85);

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`

export const fragment = /* glsl */ `
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uOffset;

varying vec2 vUv;

float random(vec2 co, float t) {
  return fract(sin(mod(dot(co.xy, vec2(12.9898, 78.233) + t), 3.14)) * 43758.5453);
}

void main() {
    vec2 newUv = vUv;

    vec4 tx = texture2D(uTexture, newUv);
    vec4 rn = vec4(random(newUv.xy, uTime));

    tx.rgb *= 0.95 - vec3(0.1); // abjusting contrast and brightness a little
  
    gl_FragColor = mix(tx, rn, 0.1);
}`