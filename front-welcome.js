const buttons = document.getElementsByTagName("button");
const base_url = "http://localhost:4000/";

for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", (event) => {
    const str = event.target.innerText;
    if (str === "Login") {

      fetch(base_url + "login").then(function(response) {
        return response
      }).then(function(data) {
        console.log(data);
        area.textContent = data;
      }).catch(function(err) {
        console.log('Fetch Error :-S', err);
      });

    } else if (str === "Register") {

      fetch(base_url + "register").then(function(response) {
        return response.json();
      }).then(function(data) {
        console.log(data);
      }).catch(function(err) {
        console.log('Fetch Error :-S', err);
      });

    }
  });
}