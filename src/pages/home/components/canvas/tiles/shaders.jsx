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

    newPos.z += sin(length(vRatio) * PI - PI/2.0) * -uDelta * 2.0;
    newPos.y += (sin(uv.x * PI/2.0) + cos(PI)) * uDelta * 0.6;

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
vec4 blendSoftLight(vec4 base, vec4 blend) {
    return mix(
        sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend), 
        2.0 * base * blend + base * base * (1.0 - 2.0 * blend), 
        step(base, vec4(0.05))
    );
}

vec2 barrelDistortion(vec2 coord, float amt) {
    vec2 cc = coord - 0.5;
    float dist = dot(cc, cc);
    return coord + cc * dist * amt;
}

float sat(float t) {
    return clamp(t, 0.0, 1.0);
}

float linterp(float t) {
    return sat(1.0 - abs( 2.0 * t - 1.0 ));
}

float remap(float t, float a, float b) {
    return sat((t - a) / (b - a));
}

vec4 spectrum_offset(float t) {
    vec4 ret;
    
    float lo = step(t, 0.5);
    float hi = 1.0 - lo;
    float w = linterp(remap(t, 1.0/6.0, 5.0/6.0 ));
    
    ret = vec4(lo, 1.0, hi, 1.0) * vec4(1.0 - w, w, 1.0 - w, 1.0);

    return pow(ret, vec4(1.0/2.2));
}

vec3 gammaCorrect(vec3 color, vec3 gamma){
    return pow(color, 1.0/gamma);
}

vec3 levelRange(vec3 color, vec3 minInput, vec3 maxInput){
    return min(max(color - minInput, vec3(0.0)) / (maxInput - minInput), vec3(1.0));
}

vec3 finalLevels(vec3 color, vec3 minInput, vec3 gamma, vec3 maxInput){
    return gammaCorrect(levelRange(color, minInput, maxInput), gamma);
}

void main() {
    vec2 newUv = vUv; // (gl_FragCoord.xy/uSize.xy * 0.5) + 0.25; 

    newUv = (vUv - vec2(0.5)) / vRatio + vec2(0.5);
    newUv.y += (1.0 - uDelta*0.3) * 0.02;

    int num_iter = 12;
    
    float max_distort = 0.52;
    float reci_num_iter_f = 1.0 / float(num_iter);

    vec4 sumcol = vec4(0.0);
    vec4 sumw = vec4(0.0);	

    for (int i = 0; i < num_iter; ++i) {

        float t = float(i) * reci_num_iter_f;
        vec4  w = spectrum_offset(t);

        sumw += w;
        sumcol += w * texture2D(uTexture, barrelDistortion(newUv, 0.46 * max_distort*t ));
    }

    vec3 rn = vec3(random(newUv, uTime));

    gl_FragColor     = sumcol / sumw; // blendSoftLight(sumcol / sumw, vec4(random(newUv, uTime)));

    gl_FragColor.rgb = mix(finalLevels(gl_FragColor.rgb, vec3(9.0 /255.0), vec3(0.85), vec3(237.0 /255.0)), rn, 0.1);
    gl_FragColor.a   = 1.0 - uAlpha;
}`