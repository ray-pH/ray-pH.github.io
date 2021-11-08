const nol = `
float getDistance(vec3 p) {
    // p.xy *= rotate(u_time * 0.65);
    // p.xz *= rotate(u_time * 0.85);

    float d0 = sdBox(p, vec3(2.0, 2.5, 3.0));
    float d1 = sdSphere(p, 3.0);
    float d2 = sdTorus(p, vec2(3.0, 1.0));
    // return d2;
    return (p.x*p.x + p.z*p.z - 1.0);
}
`;

const funcHead = 
`float getDistance(vec3 p){
`;
const funcTail = 
`
}
`;

function replaceCoord(str){
    return str.replace(/x/g,'p.x')
              .replace(/y/g,'p.y')
              .replace(/z/g,'p.z');
}

function parseSide(str){
    return replaceCoord(str);
}

function parseMathGLSL(mathStr){
    let [lhs, rhs] = mathStr.split("=");
    lhs = parseSide(lhs.trim());
    rhs = parseSide(rhs.trim());
    let resultStr =  lhs + '-(' + rhs + ')';
    return funcHead 
        + '    return '
        + resultStr
        + ';'
        + funcTail
    ;
}

// let inp = 'x*x - 1 = -z*z';
// console.log('---');
// console.log(funcHead);
// console.log(funcTail);
// console.log(parseMathGLSL(inp));
export { parseMathGLSL };
