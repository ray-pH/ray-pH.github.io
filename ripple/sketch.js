let damping = 0.999;
let buff =[], wave=[];
let col, row;

function setup(){
	createCanvas(500,500);
	pixelDensity(1);
	col = width; row = height;
	buff = new Array(col).fill(0).map(n => new Array(row).fill(0));
	wave = new Array(col).fill(0).map(n => new Array(row).fill(0));
}

function draw(){
	background(5);
	loadPixels();
	for(let i = 1; i < col-1; i++){
		for(let j = 1; j < row-1; j++){
			wave[i][j] = ( buff[i-1][j] + buff[i+1][j] +
						   buff[i][j-1] + buff[i][j+1])/2 -
						   wave[i][j];
			wave[i][j] *= damping;
			let index = (i+j*col)*4;
			pixels[index + 0] = wave[i][j];
      		pixels[index + 1] = wave[i][j];
      		pixels[index + 2] = wave[i][j];
		}
	}
	updatePixels();

	let temp = buff;
	buff = wave; wave = temp;
}

function mouseDragged(){
	buff[mouseX][mouseY] = 500;
}