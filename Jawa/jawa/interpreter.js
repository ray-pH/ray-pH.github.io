// var variables = {};
// var output    = "";

const dataType = {
    NUMBER    : "number",
    STRING    : "string",
    STATEMENT : "statement"
    // NUMBER : "ꦮꦶꦭꦔꦤ꧀",
    // STRING : "ꦠꦸꦭꦶꦱꦤ꧀"
}

const compType = {
    GREATER : "greater than",
    LESS    : "less than",
    EQUAL   : "equal to",
    NOT     : "is not"
}

const opType = {
    VAR_DECLARE : "Declare variable",
    VAR_SET     : "Set value for variable",
    VAR_SETDEC  : "Declare and set variable",
    VAR_OPERATE : "Operate on variable",
    VAR_PRINT   : "Print value of variable",
    LOOP_START  : "Beginning of a loop",
    LOOP_END    : "End of a loop",
    LOOP_BREAK  : "Break out of loop"
}

const varOpType = {
    SET : "set",
    ADD : "add",
    SUB : "sub",
    MUL : "mul",
    DIV : "div",
    MOD : "mod"
}

const angka = [
    ["0", "꧐"], ["1", "꧑"], ["2", "꧒"],
    ["3", "꧓"], ["4", "꧔"], ["5", "꧕"],
    ["6", "꧖"], ["7", "꧗"], ["8", "꧘"],
    ["9", "꧙"]
];
var angka_to_number_regex = [];
var number_to_angka_regex = [];
for (var i in angka){
    var a = angka[i];
    angka_to_number_regex.push([RegExp( a[1], "g" ),a[0]]);
    number_to_angka_regex.push([RegExp( a[0], "g" ),a[1]]);
}
function angka_to_number(input){
    var res = input;
    for (var i in angka_to_number_regex){
        var pair = angka_to_number_regex[i];
        res = res.replace(pair[0],pair[1]);
    }
    return res;
}
function number_to_angka(input){
    var res = input;
    for (var i in number_to_angka_regex){
        var pair = number_to_angka_regex[i];
        res = res.replace(pair[0],pair[1]);
    }
    return res;
}


function isNumber(str){
    return (/^꧇.+꧇$/g).test(str);
}
function isString(str){
    return (/^꧊.*꧊$/g).test(str);
}

function parseLine(line){
    line = line.replace(/^[\t\s]+/g, "");
    // variable declaration
    if ((/^(ꦮꦺꦴꦤ꧀ꦠꦼꦤ꧀|ꦲꦤ).*꧈(ꦤꦶꦏꦸ|ꦲꦶꦏꦸ)/g).test(line)) {
        var declength = 0;
        if ((/^ꦮꦺꦴꦤ꧀ꦠꦼꦤ꧀/g).test(line)) { declength = 9;
        }else{ declength = 2; }
        var expr = line.substr(declength).split("꧈");
        var name = expr[0].replace(/\s/g, "");
        var type = "";
        switch (expr[1].substr(4)){ //both work
            case "ꦮꦶꦭꦔꦤ꧀":
                type = dataType.NUMBER;
                break;
            case "ꦠꦸꦭꦶꦱꦤ꧀":
                type = dataType.STRING;
                break;
            case "ꦏꦠꦿꦔꦤ꧀":
                type = dataType.STATEMENT;
                break;
        }
        return [opType.VAR_DECLARE,name,type];
    } 

    // variable initialization or set by value
    else if ( (/^(ꦒꦤ꧀ꦠꦶ|ꦒꦤ꧀ꦠꦺꦴꦱ꧀).+ꦢꦢꦶ/g).test(line) ) {
        var initlength = 0;
        if ((/^ꦒꦤ꧀ꦠꦶ/g).test(line)) { initlength = 5;
        }else{ initlength = 8; }
        var expr  = line.substr(initlength).split("ꦢꦢꦶ");
        var name  = expr[0].replace(/\s/g, "");
        var value = expr[1];
        return  [opType.VAR_SET, name, value];
    }

    // do operation on variable
    else if ( (/^ꦒꦤ꧀ꦠꦶ.+꧈/g).test(line) ) {
        var expr      = line.substr(5).split("꧈");
        var name      = expr[0].replace(/\s/g, "");
        var tooperate = expr[1];
        var operation;  var operand;
        if ((/^ꦠꦩ꧀ꦧꦃ/g).test(tooperate)){ //add
            operation = varOpType.ADD;
            operand   = tooperate.substr(5);
        }
        else if ((/^ꦏꦸꦫꦔꦶ/g).test(tooperate)){ //sub
            operation = varOpType.SUB;
            operand   = tooperate.substr(5);
        }
        else if ((/^ꦥꦝꦏ꧀ꦏꦺ/g).test(tooperate)){ //set
            operation = varOpType.SET;
            operand   = tooperate.substr(6);
        }
        else if ((/^ꦥꦶꦁ/g).test(tooperate)){ //sub
            operation = varOpType.MUL;
            operand   = tooperate.substr(3);
        }
        else if ((/^ꦥꦫ/g).test(tooperate)){ //sub
            operation = varOpType.DIV;
            operand   = tooperate.substr(2);
        }
        else if ((/^ꦠꦸꦫꦲꦺꦪꦺꦤ꧀ꦢꦶꦥꦫ/g).test(tooperate)){ //modulo
            operation = varOpType.MOD;
            operand   = tooperate.substr(13);
        }
        return  [opType.VAR_OPERATE, name, [operation, operand]];
    }

    else if ( (/^ꦠꦸꦭꦶꦱ꧀/g).test(line) ) {
        var name  = line.substr(6);
        return  [opType.VAR_PRINT, name, ""];
    }

    else if ( (/^(ꦒ|ꦧ)ꦫꦶꦱ꧀ꦲꦚꦂ$/g).test(line) ) {
        return [opType.VAR_PRINT, "newline"];
    }

    else if ( (/^ꦤꦭꦶꦏꦠꦏ꧀ꦱꦶꦃ/g).test(line) ){
        var stat = line.substr(10);
        return [opType.LOOP_START, stat];
    }

    else if ( (/^ꦢꦶꦭꦏꦺꦴ(ꦏ꧀ꦲꦏꦺ|ꦏ꧀ꦏꦺ|ꦤꦶ)$/g).test(line) ){
        return [opType.LOOP_END];
    }

    else if ( (/^ꦫꦩ꧀ꦥꦸꦁ$/g).test(line) ){
        return [opType.LOOP_BREAK];
    }

    else {
        throw "cannot parse " + line;
    }
};

function evalStatement(varname){
    var state = undefined;
    var variable = variables[varname];
    var t1,t2,v1,v2;
    var v1n = variable[1];
    var v2n = variable[3];
    var comp_type = variable[2];

    if (comp_type == compType.NOT) {
        return !(evalStatement(variable[3]));
    }

    if (isNumber(v1n)) { 
        t1 = dataType.NUMBER; 
        v1 = Number(angka_to_number(v1n.substr(1,v1n.length-2)));
    }
    else if (isString(v1n)) { 
        t1 = dataType.STRING; 
        v1 = v1n;
    }
    else { 
        t1 = variables[v1n][0];
        v1 = variables[v1n][1];
    }
    if (isNumber(v2n)) { 
        t2 = dataType.NUMBER; 
        v2 = Number(angka_to_number(v2n.substr(1,v2n.length-2)));
    }
    else if (isString(v2n)) { 
        t2 = dataType.STRING; 
        v2 = v2n;
    }
    else { 
        t2 = variables[v2n][0];
        v2 = variables[v2n][1];
    }

    if (t1 != t2){
        throw "comparison of different types";
    }
    if (comp_type == compType.GREATER){
        state = v1 > v2;
    }
    else if (comp_type == compType.LESS){
        state = v1 < v2;
    }
    else if (comp_type == compType.EQUAL){
        state = v1 == v2;
    }

    return state;
}

function findLoopExit(current_pointer, instructions){
    var instruction_length = instructions.length;
    var depth = 0;
    for (var i = current_pointer+1; i<instruction_length; i++){
        var type = instructions[i][0];
        if (type == opType.LOOP_START){
            depth += 1;
        }
        else if (type == opType.LOOP_END){
            if(depth == 0){
                return i;
            }else{
                depth -= 1;
            }
        }
    }
    throw "loop have no exit point at pointer " + current_pointer;
    return instructions_length;
}

function evalInstruction(expr, variables, loops, pointer, instructions, output){
    var op    = expr[0];
    var name  = expr[1];
    var value = expr[2];

    var change_pointer = false;

    switch (op) {
        case opType.VAR_DECLARE :
            if (value == dataType.NUMBER){
                variables[name] = [dataType.NUMBER, 0];
            }else if (value == dataType.STRING){
                variables[name] = [dataType.STRING, ""];
            }else if (value == dataType.STATEMENT){
                variables[name] = [dataType.STATEMENT, "", compType.EQUAL, ""];
            }
            break;

        case opType.VAR_SET :
            var variable = variables[name];
            var type = variable[0];
            if (type == dataType.NUMBER){
                if(!isNumber(value)){
                    throw "data type not matching of "+values+" and "+name;
                }
                var angka = value.substr(1, value.length-2);
                var num   = Number(angka_to_number(angka));
                variables[name] = [type, num];
            }else if (type == dataType.STRING){
                if(!isString(value)){
                    throw "data type not matching of "+values+" and "+name;
                }
                var str = value.substr(1, value.length-2);
                variables[name] = [type, str];
            }else if (type == dataType.STATEMENT){
                // var bool = value=="ꦧꦼꦤꦼꦂ";
                var comparison = compType.EQUAL;
                var to_compare;
                if ( (/.+ꦭꦸꦮꦶꦃꦱꦏ.+/g).test(value) ){
                    comparison = compType.GREATER;
                    to_compare = value.split("ꦭꦸꦮꦶꦃꦱꦏ");
                }
                else if ( (/.+ꦏꦸꦫꦁꦱꦏ.+/g).test(value) ){
                    comparison = compType.LESS;
                    to_compare = value.split("ꦏꦸꦫꦁꦱꦏ");
                }
                else if ( (/.+ꦥꦝꦏꦫꦺꦴ.+/g).test(value) ){
                    comparison = compType.EQUAL;
                    to_compare = value.split("ꦥꦝꦏꦫꦺꦴ");
                }
                else if ( (/ꦲꦺꦴꦫ.+/g).test(value) ){
                    comparison = compType.NOT;
                    to_compare = value.split("ꦲꦺꦴꦫ");
                }
                else {
                    throw "unknown comparison type in " + value;
                }
                variables[name] = [type, to_compare[0], 
                                   comparison, to_compare[1]];
            }
            break;

        case opType.VAR_OPERATE :
            var initial_variable = variables[name];
            var initial_value    = initial_variable[1];
            var variable_type    = initial_variable[0];
            if (initial_variable == undefined){
                throw "error undefined variable : " + name;
            }
            var operation = value[0];
            var operand   = value[1];
            var operand_val;
            if ( isNumber(operand)){
                operand_val = angka_to_number(operand.substr(1,operand.length-2));
            }else{
                var operand_variable = variables[operand];
                if (operand_variable == undefined){
                    throw "undefined variable to operate : " + operand;
                }
                operand_val = operand_variable[1];
            }
            var operation_result = 0;
            switch (operation){
                case varOpType.ADD:
                    if (variable_type == dataType.NUMBER){
                       operation_result = Number(initial_value) 
                                        + Number(operand_val);
                    }else if (variable_type == dataType.STRING){
                       operation_result = initial_value 
                                        + operand_val;
                    }else{
                        throw "undefined variable type : " + variable_type;
                    }
                    break;
                case varOpType.SUB:
                    operation_result = initial_value - operand_val;
                    break;
                case varOpType.SET:
                    if (variable_type == dataType.STATEMENT){
                        variables[name] = [variable_type,
                                            operand_variable[1],
                                            operand_variable[2],
                                            operand_variable[3]];
                    }else{
                        operation_result = operand_val;
                    }
                    break;
                case varOpType.MUL:
                    operation_result = initial_value * operand_val;
                    break;
                case varOpType.DIV:
                    operation_result = initial_value / operand_val;
                    break;
                case varOpType.MOD:
                    operation_result = initial_value % operand_val;
                    break;
                default:
                    throw "undefined operand : " + operation;
                    break;
            }
            if (variable_type != dataType.STATEMENT){
                variables[name] = [variable_type, operation_result]
            }
            break;

        case opType.VAR_PRINT :
            if (name == "newline"){
                output = output + "\n";
            }
            else if ( isString(name)){
                output = output + name.substr(1,name.length-2);
            }
            else if (isNumber(name)){
                output = output 
                       + Number(angka_to_number(
                            name.substr(1,name.length-2)));
            }
            else{
                var variable = variables[name];
                if (variable[0] == dataType.STATEMENT){
                    output = output + evalStatement(name);
                }else{
                    output = output + variable[1];
                }
            }
            break;

        case opType.LOOP_START :
            var statement_variable = variables[name];
            if (statement_variable == undefined){
                throw "unknown statement variable" + name;
                break;
            }
            var stat = evalStatement(name);
            loops.push([pointer, name]);
            if(!stat){
                change_pointer = true;
                pointer = findLoopExit(pointer,instructions)+1;
                loops.pop();
            };
            break;

        case opType.LOOP_END :
            if (loops.length < 1){
                throw "loop end point exist without start point";
                break;
            }
            change_pointer = true;
            pointer = loops.pop()[0];
            break;

        case opType.LOOP_BREAK :
            change_pointer = true;
            pointer = findLoopExit(pointer,instructions)+1;
            loops.pop();
            break;

        default:
            throw "cannot evaluate "+op;
    }

    return [variables,loops,output,change_pointer,pointer];
}

function interpret(variables,output,input){
    var raw    = input.replace(/[\n\r]/gm, "") // remove newline
                      .split("꧉")              // split by delim
                      .filter(Boolean);        // filter out emptystring
    var instructions = [];
    var loops = [];
    try{
        for (var i in raw){
            instructions.push(parseLine(raw[i]));
        }
    }catch (err) {
        throw "on statement " +String(Number(i)+1)+" : "+err;
    }
    console.log(instructions); 

    var pointer = 0;
    var instruction_length = instructions.length;
    // var i = 0;
    try{
        while (pointer < instruction_length){
            var evaluated = evalInstruction(instructions[pointer],
                                            variables,loops,pointer,
                                            instructions,output);
            variables = evaluated[0];
            loops     = evaluated[1];
            output    = evaluated[2];
            change_pointer = evaluated[3];
            if(change_pointer){
                pointer = evaluated[4];
            }else{
               pointer = pointer+1;
            }
            // console.log(pointer);
            // console.log(variables);
            // i = i+1;
            // if(i>100){break;}
        }
    }catch (err) {
        throw "on statement " +String(Number(i)+1)+" : "+err;
    }



    // console.log(raw);      //debug purposes
    
    return [variables,output];
};

var variables = {}; //debug purposes
function runCode(input){
    // var variables = {}; //comment for debug only
    variables = {};
    //default boolean
    variables["ꦧꦼꦤꦼꦂ"] = [dataType.STATEMENT, "꧇꧐꧇", compType.EQUAL, "꧇꧐꧇"];
    variables["ꦱꦭꦃ"] = [dataType.STATEMENT, "꧇꧐꧇", compType.EQUAL, "꧇꧑꧇"];
    var blocks    = {};
    var output    = "";
    var interpreted;
    try {
        interpreted = interpret(variables,output,input);
        variables = interpreted[0];
        output    = interpreted[1];
    }catch(err){
        output = "Error\n" + err;
    }
    console.log(variables);
    // console.log(output);
    return output;
}
