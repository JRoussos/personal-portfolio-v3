export const vertex = /* glsl */ `
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;
varying vec3 vPosition;
varying vec2 vRatio;

uniform vec2 uSize;
uniform float uDelta;
uniform float uTime;
uniform float uAlpha;

uniform float uDistance;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

void main() {
  vUv = uv;
  vPosition = position;

//   vPosition = rotate(vPosition, vec3(0.0, 0.0, 1.0), sin(vPosition.) uDelta * 0.005);
  vec4 newPos = modelViewMatrix * vec4(vPosition, 1.0);

//   float dist = distance(vUv, vec2(0.5));
//   newPos.x += sin(PI + PI/2.0) * -uDelta;
//   newPos.y -= (uv.x * PI/2.0) * uDelta * 0.006;

//   newPos.y *= 1.0 + abs(uDelta)*0.02;//sin(dist*2.0 - uTime) * cos(1.0 - uDelta * 0.5);
    // newPos.y += uDistance * 10.0;

  gl_Position = projectionMatrix * newPos; //modelViewMatrix * vec4(position, 1.0);
}`

export const fragment = /* glsl */ `
#define PI 3.1415926535897932384626433832795

varying vec2 vUv;
varying vec2 vRatio;
varying vec3 vPosition;

uniform float uDelta;
uniform float uAlpha;

uniform vec2 uSize;

void main() {
  vec2 newUv = vUv;

  gl_FragColor = vec4( vec3(1.0), uAlpha);
}`