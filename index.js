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
}
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

const GR = (1 + Math.sqrt(5)) / 2;

function draw(){

    var H = map(spotifyAudioProps.valence, 0.0, 1.0, 0, 341)
    var S = map(spotifyAudioProps.valence, 0.0, 1.0, 14, 100)
    var L = map(spotifyAudioProps.valence, 0.0, 1.0, 12, 95)



    background("black");
    translate(windowWidth / 2, windowHeight / 2);

    var loudness = map(spotifyAudioProps.loudness, 0, -60, 1, 100)
    var danceability = map(spotifyAudioProps.danceability, 0.0, 1.0, 0.01, 0.05 )
    var energy = map(spotifyAudioProps.energy, 0.0, 1.0, 1, 40)



	mapMouseX = map(mouseX, 0, width, 1, 10);
	mapMouseXbass = map(mouseX, 0, width, 1, 5);
	mapMouseY = map(mouseY, 0, height, 2, 6);

	pieces = 30;
	radius = 100;


    for (i = 0; i < pieces; i += 0.1) {
		rotate(TWO_PI / (pieces / 2));

		noFill();
        
        //energy
		push();
		stroke("red");
        if(spotifyAudioProps.valence > 0.5){

        }
		rotate(-frameCount * energy/i*0.002);
		strokeWeight(0.5);
		square(-mapMouseX + i, -mapMouseX - i, energy * i, 3);
		pop();


        //loudness
        push();
        stroke(H,S,L);
        strokeWeight(0.2);
        rotate(frameCount * i /1000 )
        polygon(mapMouseX + i / 2, mapMouseY - i * 2, loudness * i, 7);
        pop();


		/*----------  TREMBLE  ----------*/
		// push();
		// stroke("blue");
		// strokeWeight(0.6);
		// scale(mouseX * 0.0005);
		// rotate((mouseX * 0.002));
		// polygon(mapMouse + i / 2, mapMouse - i / 2, mapMouse * i / 600, 3);
		// pop();

        //danceability
        push();
		stroke("pink");
		strokeWeight(5);
		rotate(-frameCount * danceability);
		point(-100 , radius / 2);
		point(200 , TWO_PI / 2);
		point(400 , TWO_PI / 2);
		point(800 , radius / 2);
        stroke("green");
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

function startVisualizer(audioFeatureAvg){
    spotifyAudioProps = audioFeatureAvg
}

// const spotifyObj = {
//     acousticness: 0.5985,
//     danceability: 0,
//     energy:0,
//     instrumentalness: 0.3020192,
//     liveness: 0.136175,
//     loudness: 60,
//     speechiness: 0.080175,
//     tempo: 118.94125,
//     valence: .4,
// }

const accessToken = getCookiekey("access_token")

if (!accessToken) {
    location.href = "login.html";
}
let spotifyAudioProps;
fetchPlaylist();

// startVisualizer(spotifyObj)