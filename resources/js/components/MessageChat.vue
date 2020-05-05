axios.get("https://app.nextpaw.com/graph-api")
.then(response => {this.results = response.data.results}).then(data => {
localStorage.setItem('token', token);
location.href = '/';

localStorage.getItem('token')
})
