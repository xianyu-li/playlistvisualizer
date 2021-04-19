//8cebb2f15481443590e552bb5ddde767
//bd271607d3f84b67920c5db84ec202be
// redirct uri http%3A%2F%2F127.0.0.1%3A5500%2F
//playlist-read-private

// https://accounts.spotify.com/authorize?client_id=8cebb2f15481443590e552bb5ddde767&scopes=playlist-read-private&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2F

// curl -H "Authorization: Basic OGNlYmIyZjE1NDgxNDQzNTkwZTU1MmJiNWRkZGU3Njc6YmQyNzE2MDdkM2Y4NGI2NzkyMGM1ZGI4NGVjMjAyYmU=" -d grant_type=authorization_code -d code=AQAcoPqHmmCBGl-nRlsTq4_tJiZQxQNvKeVtTSbBygLmBPG2Vvqpu7y1uBa0e85MV1KHHVClgbhsFVNPKXSLGan9hqECZvCoowvxJiWoLB2Ln9up0JfrlIQdCYuZJUIRssk2jN_cOcBUh__hn9lv8ChErTtoJqb37mY -d redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2F https://accounts.spotify.com/api/token

//8cebb2f15481443590e552bb5ddde767:bd271607d3f84b67920c5db84ec202be
const urlParams = new URLSearchParams(window.location.search);

const token = urlParams.get('code')
const loginButton = document.getElementById("login-button");

loginButton.onclick = function () {
    location.href = "https://accounts.spotify.com/authorize?client_id=8cebb2f15481443590e552bb5ddde767&scopes=playlist-read-private&response_type=code&redirect_uri=https%3A%2F%2Fxianyu-li.github.io%2Fplaylistvisualizer%2F"
}

const fetchPlaylistButton = document.getElementById("fetch-playlist-button");


fetchPlaylistButton.onclick = async () => {

    let accessToken = await fetch("https://accounts.spotify.com/api/token", {
        body: `grant_type=authorization_code&code=${token}&redirect_uri=https%3A%2F%2Fxianyu-li.github.io%2Fplaylistvisualizer%2F`,
        headers: {
            Authorization: "Basic OGNlYmIyZjE1NDgxNDQzNTkwZTU1MmJiNWRkZGU3Njc6YmQyNzE2MDdkM2Y4NGI2NzkyMGM1ZGI4NGVjMjAyYmU=",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })
        .then(res => res.json())
        .then(data => {

            return data.access_token;
        })
    console.log(accessToken)
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
            const acousticness = audioFeatures.reduce((acc, cv) => acc + cv.acousticness, 0) / audioFeatures.length;
            const danceability = audioFeatures.reduce((a, cv) => cv.danceability + a, 0) / audioFeatures.length;
            const energy = audioFeatures.reduce((a, cv) => cv.energy + a, 0) / audioFeatures.length;
            const instrumentalness = audioFeatures.reduce((a, cv) => cv.instrumentalness + a, 0) / audioFeatures.length;
            const liveness = audioFeatures.reduce((a, cv) => cv.liveness + a, 0) / audioFeatures.length;
            const loudness = audioFeatures.reduce((a, cv) => cv.loudness + a, 0) / audioFeatures.length;
            const speechiness = audioFeatures.reduce((a, cv) => cv.speechiness + a, 0) / audioFeatures.length;
            const tempo = audioFeatures.reduce((a, cv) => cv.tempo + a, 0) / audioFeatures.length;
            const valence = audioFeatures.reduce((a, cv) => cv.valence + a, 0) / audioFeatures.length;

            return {
                acousticness,
                danceability,
                energy,
                instrumentalness,
                liveness,
                loudness,
                speechiness,
                tempo,
                valence
            }
        })
        .then(audioFeatureAvg => console.log(audioFeatureAvg))
        .catch(err => console.log(err))
};