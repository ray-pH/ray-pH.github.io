// vim: set syntax=cpp:
export default `#version 300 es

precision highp float;

in vec3 v_normal;
flat in int v_discard;

out vec4 o_color;

const vec3 LIGHT_DIR = normalize(vec3(0.5, 0.5, 1.0));

void main(void) {
  if (v_discard == 1) {
    discard;
  } else {
    vec3 normal = normalize(v_normal);
    vec3 color = vec3(0.3, 0.3, 1.0) * max(0.0, dot(LIGHT_DIR, normal));
    o_color = vec4(color, 1.0);
  }
}
`;
