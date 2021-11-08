import FRAGMENT_SHADER_SOURCE from '../shaders/fragment.js';
import VERTEX_SHADER_HEAD from '../shaders/vertex_head.js';
import VERTEX_SHADER_TAIL from '../shaders/vertex_tail.js';
import { parseMathGLSL } from './parser.js';
import { TRI_TABLE } from './tritable.js';
// let inp = 'y*y - 2.0 = -z*z';
let inp = '1.0 = 0.0';

let frameNum = 0;
let onee = true;

(function() {

    // const program = createProgramFromSource(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
    // console.log(parseMathGLSL(inp));
    let parsedGLSL = parseMathGLSL(inp);
    let VERTEX_SHADER_SOURCE = VERTEX_SHADER_HEAD + parsedGLSL + VERTEX_SHADER_TAIL;

    function createShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(gl.getShaderInfoLog(shader) + source);
        }
        return shader;
    }

    function createProgramFromSource(gl, vertexShaderSource, fragmentShaderSource) {
        const program = gl.createProgram();
        gl.attachShader(program, createShader(gl, vertexShaderSource, gl.VERTEX_SHADER));
        gl.attachShader(program, createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER));
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(gl.getProgramInfoLog(program));
        }
        return program;
    }

    function getUniformLocations(gl, program, keys) {
        const locations = {};
        keys.forEach(key => {
            locations[key] = gl.getUniformLocation(program, key);
        });
        return locations;
    }

    function setUniformTexture(gl, index, texture, location) {
        gl.activeTexture(gl.TEXTURE0 + index);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(location, index);
    }


    function createTriTexture(gl) {
        const triTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, triTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.R32UI, 4096, 1, 0, gl.RED_INTEGER, gl.UNSIGNED_INT, TRI_TABLE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.bindTexture(gl.TEXTURE_2D, null);
        return triTexture;
    }

    // const stats = new Stats();
    // document.body.appendChild(stats.dom);

    const parameters = {
        translation: { x: 0.0, y: 0.0, z: 0.0 },
        rotation: { x: 0.0, y: .0, z: 0.0 },
        scale: { x: 1.0, y: 1.0, z: 1.0},
    };

    const gui = new dat.GUI();
    const transFolder = gui.addFolder('translation');
    transFolder.add(parameters.translation, 'x', -10.0, 10.0).step(0.01);
    transFolder.add(parameters.translation, 'y', -10.0, 10.0).step(0.01);
    transFolder.add(parameters.translation, 'z', -10.0, 10.0).step(0.01);
    const rotFolder = gui.addFolder('rotation');
    rotFolder.add(parameters.rotation, 'x', -180.0, 180.0).step(0.1);
    rotFolder.add(parameters.rotation, 'y', -180.0, 180.0).step(0.1);
    rotFolder.add(parameters.rotation, 'z', -180.0, 180.0).step(0.1);
    const scaleFolder = gui.addFolder('scale');
    scaleFolder.add(parameters.scale, 'x', 0.01, 2.0).step(0.01);
    scaleFolder.add(parameters.scale, 'y', 0.01, 2.0).step(0.01);
    scaleFolder.add(parameters.scale, 'z', 0.01, 2.0).step(0.01);

    // let functionsStr = {
        // fun1: 'x*x + z*z = 1.0',
    // };
    const functionGui = new dat.GUI();
    const funArr = [
        'x*x + z*z = 1.0',
    ];

    let toPlot = false;
    let addF;
    function addFunction(){
        funArr.push('');
        functionGui.add(funArr, funArr.length-1);
    };
    const addFun = { 
        plot : function(){
            toPlot = true;
        },
        add  : function(){ 
            console.log("clicked");
            addFunction();
            functionGui.remove(addF);
            addF = functionGui.add(addFun,'add').name('+ Add Function');
        },
    };
    functionGui.domElement.id = 'funcGui';
    functionGui.add(addFun,'plot').name(' Plot ');
    functionGui.add(funArr, 0);
    addF = functionGui.add(addFun,'add').name('+ Add Function');

    const canvas = document.getElementById('canvas');
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const gl = canvas.getContext('webgl2');
    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.enable(gl.DEPTH_TEST);

    let program = createProgramFromSource(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
    let uniforms = getUniformLocations(gl, program, ['u_triTexture', 'u_mvpMatrix', 'u_normalMatrix', 'u_cellNum', 'u_cellSize', 'u_time']);

    const marchingSpace = new Vector3(10.0, 10.0, 10.0);
    const cellNum = new Vector3(50, 50, 50);
    const cellSize = new Vector3(marchingSpace.x / cellNum.x, marchingSpace.y / cellNum.y, marchingSpace.z / cellNum.z);
    const vertexNum = cellNum.x * cellNum.y * cellNum.z * 15;

    const triTexture = createTriTexture(gl);

    const viewMatrix = Matrix4.inverse(Matrix4.lookAt(new Vector3(0.0, 0.0, 15.0), Vector3.zero, new Vector3(0.0, 1.0, 0.0)));
    const projectionMatrix = Matrix4.perspective(canvas.width / canvas.height, 60, 0.01, 100.0);
    const vpMatrix = Matrix4.mul(viewMatrix, projectionMatrix);

    const DEGREE_TO_RADIAN = Math.PI / 180.0;

    const startTime = performance.now();
    const render = () => {
        // stats.update();

        const currentTime = performance.now();
        const elapsedTime = (currentTime - startTime) * 0.001;

        const transMatrix = Matrix4.translate(parameters.translation.x, parameters.translation.y, parameters.translation.z);
        const rotMatrix = Matrix4.rotateXYZ(DEGREE_TO_RADIAN * parameters.rotation.x, DEGREE_TO_RADIAN * parameters.rotation.y, DEGREE_TO_RADIAN * parameters.rotation.z);
        const scaleMatrix = Matrix4.scale(parameters.scale.x, parameters.scale.y, parameters.scale.z);

        const modelMatrix = Matrix4.mul(Matrix4.mul(scaleMatrix, rotMatrix), transMatrix);
        const normalMatrix = Matrix4.transpose(Matrix4.inverse(modelMatrix));
        const mvpMatrix = Matrix4.mul(modelMatrix, vpMatrix);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0.0, 0.0, canvas.width, canvas.height);

        if (toPlot){
            parsedGLSL = parseMathGLSL(funArr[0]);
            VERTEX_SHADER_SOURCE = VERTEX_SHADER_HEAD + parsedGLSL + VERTEX_SHADER_TAIL;
            try{
                program = createProgramFromSource(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);
                uniforms = getUniformLocations(gl, program, 
                    ['u_triTexture', 'u_mvpMatrix', 'u_normalMatrix', 'u_cellNum', 'u_cellSize', 'u_time']);
            } catch(err){
                console.log('unposible');
            }
            toPlot = false;
        }
        // if (frameNum > 100){
        //     let vtx = onee ? VERTEX_SHADER_SOURCE : VERTEX_SHADER_SOURCE2;
        //     program = createProgramFromSource(gl, vtx, FRAGMENT_SHADER_SOURCE);
        //     uniforms = getUniformLocations(gl, program, ['u_triTexture', 'u_mvpMatrix', 'u_normalMatrix', 'u_cellNum', 'u_cellSize', 'u_time']);
        //     frameNum = 0;
        //     onee = !onee;
        // }
        // frameNum += 1;
        gl.useProgram(program);
        setUniformTexture(gl, 1, triTexture, uniforms['u_triTexture']);
        gl.uniformMatrix4fv(uniforms['u_mvpMatrix'], false, mvpMatrix.elements);
        gl.uniformMatrix4fv(uniforms['u_normalMatrix'], false, normalMatrix.elements);
        gl.uniform3i(uniforms['u_cellNum'], cellNum.x, cellNum.y, cellNum.z);
        gl.uniform3f(uniforms['u_cellSize'], cellSize.x, cellSize.y, cellSize.z);
        gl.uniform1f(uniforms['u_time'], elapsedTime);

        gl.drawArrays(gl.TRIANGLES, 0, vertexNum);

        requestAnimationFrame(render);
    };
    render();
}());
