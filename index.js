//8cebb2f15481443590e552bb5ddde767
//bd271607d3f84b67920c5db84ec202be
// redirct uri http%3A%2F%2F127.0.0.1%3A5500%2F
//playlist-read-private

// https://accounts.spotify.com/authorize?client_id=8cebb2f15481443590e552bb5ddde767&scopes=playlist-read-private&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2F

// curl -H "Authorization: Basic OGNlYmIyZjE1NDgxNDQzNTkwZTU1MmJiNWRkZGU3Njc6YmQyNzE2MDdkM2Y4NGI2NzkyMGM1ZGI4NGVjMjAyYmU=" -d grant_type=authorization_code -d code=AQAcoPqHmmCBGl-nRlsTq4_tJiZQxQNvKeVtTSbBygLmBPG2Vvqpu7y1uBa0e85MV1KHHVClgbhsFVNPKXSLGan9hqECZvCoowvxJiWoLB2Ln9up0JfrlIQdCYuZJUIRssk2jN_cOcBUh__hn9lv8ChErTtoJqb37mY -d redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2F https://accounts.spotify.com/api/token

//8cebb2f15481443590e552bb5ddde767:bd271607d3f84b67920c5db84ec202be

function getCookiekey(key) {
    let result = ""

    if (document.cookie) {
        result = document.cookie.split(";")
            .find(row => row.startsWith(`${key}=`))
            .split("=")[1];
    }
    return result;
}


function fetchPlaylist(){
    fetch("https://api.spotify.com/v1/playlists/2gm7y7824ov5NxoKNLwtUv", {
        headers: {
            "Authorization": `Bearer ${accessToken}`
        }
    })
        .then(res => res.json())
        .then(res => res.tracks.items.map(item => item.track.id).join(","))
        .then(trackIds => fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        }))
        .then(res => res.json())
        .then(aF => {
            const audioFeatures = aF.audio_features.filter(item => item !== null);
            // const acousticness = audioFeatures.reduce((acc, cv) => acc + cv.acousticness, 0) / audioFeatures.length;
            const danceability = audioFeatures.reduce((a, cv) => cv.danceability + a, 0) / audioFeatures.length;
            const energy = audioFeatures.reduce((a, cv) => cv.energy + a, 0) / audioFeatures.length;
            // const instrumentalness = audioFeatures.reduce((a, cv) => cv.instrumentalness + a, 0) / audioFeatures.length;
            // const liveness = audioFeatures.reduce((a, cv) => cv.liveness + a, 0) / audioFeatures.length;
            const loudness = audioFeatures.reduce((a, cv) => cv.loudness + a, 0) / audioFeatures.length;
            // const speechiness = audioFeatures.reduce((a, cv) => cv.speechiness + a, 0) / audioFeatures.length;
            // const tempo = audioFeatures.reduce((a, cv) => cv.tempo + a, 0) / audioFeatures.length;
            const valence = audioFeatures.reduce((a, cv) => cv.valence + a, 0) / audioFeatures.length;

            const spotifyVari = document.getElementById("spotify-vari")
            const spotifyText = document.createElement("div")
            spotifyText.textContent = `Danceability: ${danceability.toFixed(3)}\nEnergy: ${energy.toFixed(3)}\nLoudness: ${loudness.toFixed(3)}\nValence: ${valence.toFixed(3)}`
            spotifyVari.appendChild(spotifyText)
             

            return {
                // acousticness,
                danceability,
                energy,
                // instrumentalness,
                // liveness,
                loudness,
                // speechiness,
                // tempo,
                valence
            }
        })
        .then(audioFeatureAvg => startVisualizer(audioFeatureAvg))
        .catch(err => {
            console.log(err);
            location.href = "login.html";
        })
}

function setup(){
	createCanvas(windowWidth, windowHeight);
    colorMode(HSL);
    if(spotifyAudioProps?.valence > 0.5){
        dH = random(180,360);
        dS = random (50,100);
        dL = random (50, 90);
        eH = random(180,360);
        eS = random (50,100);
        eL = random (50, 90);
        lH = random(180,360);
        lS = random (50,100);
        lL = random (50, 90);
        bH = random(180,360);
        bS = random (50,100);
        bL = random (50, 90);
    } else {
        dH = random(0,179);
        dS = random (0,49);
        dL = random (0, 49);
        eH = random(0,179);
        eS = random (0,49);
        eL = random (0, 49);
        lH = random(0,179);
        lS = random (0,49);
        lL = random (0, 49);
        bH = random(0,179);
        bS = random (0,49);
        bL = random (0, 49);
        
    }
    
}
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

const GR = (1 + Math.sqrt(5)) / 2;

function draw(){
    let v = spotifyAudioProps ? spotifyAudioProps.valence : 100
    var H = map(v, 0.0, 1.0, 1, 341);
    var S = map(v, 0.0, 1.0, 14, 100);
    var L = map(v, 0.0, 1.0, 12, 95);

 
    background(bH,bS,bL);
    translate(windowWidth / 2, windowHeight / 2);

    var loudness = map(spotifyAudioProps?.loudness, 0, -60, 1, 30);
    var danceability = map(spotifyAudioProps?.danceability, 0.0, 1.0, 0.01, 0.1 );
    var energy = map(spotifyAudioProps?.energy, 0.0, 1.0, 1, 30);

 dH = random(180,360);
        dS = random (50,100);
        dL = random (50, 90);

	mapMouseX = map(mouseX, 0, width, 1, 150);
	mapMouseXbass = map(mouseX, 0, width, 1, 5);
	mapMouseY = map(mouseY, 0, height, 2, 6);

	pieces = 30;
	radius = 100;


    for (i = 0; i < pieces; i += 0.1) {
		rotate(TWO_PI / (pieces / 2));

		noFill();
        

        //loudness
        push();
        stroke(lH,lS,lL);
        strokeWeight(0.2);
        rotate(frameCount * i /1000 )
        polygon(mapMouseX + i / 2, mapMouseY - i * 2, loudness * i, 7);
        pop();

         //energy
		push();
        stroke(eH,eS,eL)
		rotate(-frameCount * energy/i*0.002);
		strokeWeight(0.5);
		polygon(-mapMouseX + i, -mapMouseY - i, energy * i , 3);
		pop();

        //danceability
        push();
		stroke(H,S,L);
		strokeWeight(5);
		rotate(-frameCount * danceability);
		point(-100 , radius / 2);
		point(200 , TWO_PI / 2);
		point(400 , TWO_PI / 2);
		point(800 , radius / 2);

		pop();
	}
   
}
function polygon(x, y, radius, npoints) {
	var angle = TWO_PI/ npoints;
	beginShape();
	for (var a = 0; a < TWO_PI; a += angle) {
		var sx = x + cos(a) * radius;
		var sy = y + sin(a)  ;
		vertex(sx, sy);
	}
	endShape(CLOSE);
}

function startVisualizer(audioFeatureAvg){
    spotifyAudioProps = audioFeatureAvg
    console.log(audioFeatureAvg)
}

testing
const spotifyObj = {
    danceability: 0,
    energy:.5,
    loudness: -40,
    valence: 1,
}

//max settings
// const spotifyObj = {
//     danceability: 1,
//     energy: 1,
//     loudness: -60,
//     valence: 1,
// }

//min settings
// const spotifyObj = {
//     danceability: 0,
//     energy: 0,
//     loudness: -00,
//     valence: 0,
// }

const accessToken = getCookiekey("access_token")

if (!accessToken) {
    location.href = "login.html";
}
let spotifyAudioProps;
fetchPlaylist();

startVisualizer(spotifyObj)