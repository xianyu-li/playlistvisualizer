const loginButton = document.getElementById("login-button");
const redirect_uri = "https%3A%2F%2Fxianyu-li.github.io%2Fplaylistvisualizer%2Fauthorization.html";

loginButton.onclick = function () {
    location.href = `https://accounts.spotify.com/authorize?client_id=8cebb2f15481443590e552bb5ddde767&scopes=playlist-read-private&response_type=code&redirect_uri=${redirect_uri}`;
}
