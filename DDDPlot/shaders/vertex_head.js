// vim: set syntax=cpp:
export default `#version 300 es

precision highp usampler2D;

out vec3 v_normal;
flat out int v_discard;

uniform usampler2D u_triTexture;
uniform mat4 u_mvpMatrix;
uniform mat4 u_normalMatrix;
uniform ivec3 u_cellNum;
uniform vec3 u_cellSize;
uniform float u_time;

mat2 rotate(float r) {
  float c = cos(r);
  float s = sin(r);
  return mat2(c, s, -s, c);
}

float sdBox(vec3 p, vec3 b) {
  p = abs(p) - b;
  return length(max(p, 0.0)) + min(max(p.x, max(p.y, p.z)), 0.0);
}

float sdSphere(vec3 p, float r) {
  return length(p) - r;
}

float sdTorus(vec3 p, vec2 t) {
  vec2 q = vec2(length(p.xy) - t.x, p.z);
  return length(q) - t.y;
}

`;
