//8cebb2f15481443590e552bb5ddde767
//bd271607d3f84b67920c5db84ec202be
// redirct uri http%3A%2F%2F127.0.0.1%3A5500%2F
//playlist-read-private

// https://accounts.spotify.com/authorize?client_id=8cebb2f15481443590e552bb5ddde767&scopes=playlist-read-private&response_type=code&redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2F

// curl -H "Authorization: Basic OGNlYmIyZjE1NDgxNDQzNTkwZTU1MmJiNWRkZGU3Njc6YmQyNzE2MDdkM2Y4NGI2NzkyMGM1ZGI4NGVjMjAyYmU=" -d grant_type=authorization_code -d code=AQA1b92vqC6IHePuMppLN_5X720epURnR32Yuc0X4TBBu3leVNCX9TO8bErMxWnckKbnaBG4SI8KUB5p4Buntx13UJ1csowMBAqcBx1OXVkxGz8ILLdfh8ziIqwhzFIMFE2IkVaVLVY3OwjundR9JEY9zjQhwhk_lzE -d redirect_uri=http%3A%2F%2F127.0.0.1%3A5500%2F https://accounts.spotify.com/api/token

//8cebb2f15481443590e552bb5ddde767:bd271607d3f84b67920c5db84ec202be


const loginButton = document.getElementById("login-button");

loginButton.onclick = () => {
    fetch("https://api.spotify.com/v1/me/playlists", {
        headers: {
            "Authorization": "Bearer BQAB6zHdrocfrujbdmyNlWgofKPDDFAQOQDPaLUXF1ybxho7xrbsbmJv_5CocDi_fOV_rIMVyiwDPbRwn6O91l3P4s7IkPF9y5BoVM716MguvLr39C4maMDrHKENUq7n844SkqCNV81Wns2uHzVAt_U"
        }
    })
        .then(res => res.json())
        .then(res => res.items[1].tracks.href)
        .then(href => fetch(href, {
            headers: {
                "Authorization": "Bearer BQAB6zHdrocfrujbdmyNlWgofKPDDFAQOQDPaLUXF1ybxho7xrbsbmJv_5CocDi_fOV_rIMVyiwDPbRwn6O91l3P4s7IkPF9y5BoVM716MguvLr39C4maMDrHKENUq7n844SkqCNV81Wns2uHzVAt_U"
            }
        }))
        .then(res => res.json())
        .then(res => res.items.map(item => item.track.id).join(","))
        .then(trackIds => fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
            headers: {
                "Authorization": "Bearer BQAB6zHdrocfrujbdmyNlWgofKPDDFAQOQDPaLUXF1ybxho7xrbsbmJv_5CocDi_fOV_rIMVyiwDPbRwn6O91l3P4s7IkPF9y5BoVM716MguvLr39C4maMDrHKENUq7n844SkqCNV81Wns2uHzVAt_U"
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