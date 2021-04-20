const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('code');
const redirect_uri = "https://xianyu-li.github.io/playlistvisualizer/authorization.html";

if (token) {
    fetch("https://accounts.spotify.com/api/token", {
        body: `grant_type=authorization_code&code=${token}&redirect_uri=${redirect_uri}`,
        headers: {
            Authorization: "Basic OGNlYmIyZjE1NDgxNDQzNTkwZTU1MmJiNWRkZGU3Njc6YmQyNzE2MDdkM2Y4NGI2NzkyMGM1ZGI4NGVjMjAyYmU=",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    })
        .then(res => res.json())
        .then(data => {
            document.cookie = `access_token=${data.access_token}`;
            console.log(data.access_token)
            // location.href = "https://xianyu-li.github.io/playlistvisualizer"
            location.href = "https://xianyu-li.github.io/playlistvisualizer/"
        })
        .catch(err => {
            console.log(err);
            // location.href = "login.html";
        })
} else {
    location.href = "login.html";
}
