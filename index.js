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

const accessToken = getCookiekey("access_token")

if (!accessToken) {
    location.href = "login.html";
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

fetchPlaylist();

let spotifyAudioProps;

function setup(){
    createCanvas(innerWidth, innerHeight, WEBGL);
    angleMode(DEGREES) 
}

function draw(){
    if (!spotifyAudioProps){
        return;
    }

    background (30)
    noFill()
    stroke(255)
    rotate(20)
    rotate(frameCount/ 10)
    for( var i = 0; i < 20; i++) {
        var r = map
        beginShape()
        for (var j = 0; j < 360; j += 40) {
            var rad = i * 20
            var x = rad * cos(j)
            var y = rad *  sin(j)
            var z = sin(frameCount * 2) * spotifyAudioProps.loudness* (-3)
            vertex(x, y, z)
        }
        endShape(CLOSE)
    }
}

function startVisualizer(audioFeatureAvg){
    spotifyAudioProps = audioFeatureAvg
}

const spotifyObj = {
    acousticness: 0.5985,
    danceability: 0.528,
    energy: 0.444475,
    instrumentalness: 0.3020192,
    liveness: 0.136175,
    loudness: -11,
    speechiness: 0.080175,
    tempo: 118.94125,
    valence: 0.46515,
}

// startVisualizer(spotifyObj)