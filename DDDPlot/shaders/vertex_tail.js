// vim: set syntax=cpp:
export default `

vec3 getNormal(vec3 p) {
  float e = 0.01;
  return normalize(vec3(
    getDistance(p + vec3(e, 0.0, 0.0)) - getDistance(p - vec3(e, 0.0, 0.0)),
    getDistance(p + vec3(0.0, e, 0.0)) - getDistance(p - vec3(0.0, e, 0.0)),
    getDistance(p + vec3(0.0, 0.0, e)) - getDistance(p - vec3(0.0, 0.0, e))
  ));
}

vec3 interpolate(vec3 p0, vec3 p1, float v0, float v1) {
  return mix(p0, p1, -v0 / (v1 - v0));
}

void main(void) {
  int cellId = gl_VertexID / 15;
  int vertexId = gl_VertexID % 15;

  ivec3 cellIdx = ivec3(
    cellId % u_cellNum.x, (cellId % (u_cellNum.x * u_cellNum.y)) / u_cellNum.x, cellId / (u_cellNum.x * u_cellNum.y));
  vec3 cellCorner = (0.5 * vec3(u_cellNum) - vec3(cellIdx)) * u_cellSize;

  vec3 c0 = cellCorner;
  vec3 c1 = cellCorner + u_cellSize * vec3(1.0, 0.0, 0.0);
  vec3 c2 = cellCorner + u_cellSize * vec3(1.0, 1.0, 0.0);
  vec3 c3 = cellCorner + u_cellSize * vec3(0.0, 1.0, 0.0);
  vec3 c4 = cellCorner + u_cellSize * vec3(0.0, 0.0, 1.0);
  vec3 c5 = cellCorner + u_cellSize * vec3(1.0, 0.0, 1.0);
  vec3 c6 = cellCorner + u_cellSize * vec3(1.0, 1.0, 1.0);
  vec3 c7 = cellCorner + u_cellSize * vec3(0.0, 1.0, 1.0);

  float v0 = getDistance(c0);
  float v1 = getDistance(c1);
  float v2 = getDistance(c2);
  float v3 = getDistance(c3);
  float v4 = getDistance(c4);
  float v5 = getDistance(c5);
  float v6 = getDistance(c6);
  float v7 = getDistance(c7);

  int cubeIdx = 0;
  if (v0 < 0.0) cubeIdx |= 1;
  if (v1 < 0.0) cubeIdx |= 2;
  if (v2 < 0.0) cubeIdx |= 4;
  if (v3 < 0.0) cubeIdx |= 8;
  if (v4 < 0.0) cubeIdx |= 16;
  if (v5 < 0.0) cubeIdx |= 32;
  if (v6 < 0.0) cubeIdx |= 64;
  if (v7 < 0.0) cubeIdx |= 128;

  int tri = int(texelFetch(u_triTexture, ivec2(cubeIdx * 16 + vertexId, 0), 0).x);
  if (tri == -1) {
    gl_Position = vec4(vec3(0.0), 1.0);
    v_discard = 1;
  } else {
    vec3 position;
    if (tri == 0) {
      position = interpolate(c0, c1, v0, v1);
    } else if (tri == 1) {
      position = interpolate(c1, c2, v1, v2);
    } else if (tri == 2) {
      position = interpolate(c2, c3, v2, v3);
    } else if (tri == 3) {
      position = interpolate(c3, c0, v3, v0);
    } else if (tri == 4) {
      position = interpolate(c4, c5, v4, v5);
    } else if (tri == 5) {
      position = interpolate(c5, c6, v5, v6);
    } else if (tri == 6) {
      position = interpolate(c6, c7, v6, v7);
    } else if (tri == 7) {
      position = interpolate(c7, c4, v7, v4);
    } else if (tri == 8) {
      position = interpolate(c0, c4, v0, v4);
    } else if (tri == 9) {
      position = interpolate(c1, c5, v1, v5);
    } else if (tri == 10) {
      position = interpolate(c2, c6, v2, v6);
    } else if (tri == 11) {
      position = interpolate(c3, c7, v3, v7);
    }
    gl_Position = u_mvpMatrix * vec4(position, 1.0);
    v_normal = (u_normalMatrix * vec4(getNormal(position), 0.0)).xyz;
    v_discard = 0;
  }
}

`;
