const loginButton = document.getElementById("login-button");
const redirect_uri = "https://xianyu-li.github.io/playlistvisualizer/authorization.html";

loginButton.onclick = function () {
    location.href = `https://accounts.spotify.com/authorize?client_id=8cebb2f15481443590e552bb5ddde767&scopes=playlist-read-private&response_type=code&redirect_uri=${redirect_uri}`;
}

function setup(){
	createCanvas(windowWidth, windowHeight);
    colorMode(HSL);
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

function draw(){
    translate(windowWidth / 2, windowHeight / 2);
    background("black");


    mapMouseX = map(mouseX, 0, width, 1, 50);
	mapMouseY = map(mouseY, 0, height, 2, 6);

    pieces = 30;
	radius = 100;

    for (i = 0; i < pieces; i += 0.1) {
        rotate(TWO_PI / (pieces / 2));
        noFill();


        push();
        stroke("red");
        strokeWeight(0.2);
        rotate(frameCount * i /1000 )
        polygon(25 + i / 2, 25 - i * 2, 25 * i, 7);
        pop();
    }
}

function polygon(x, y, radius, npoints) {
	var angle = TWO_PI/ npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a);
		var sy = y + sin(a) * radius;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}