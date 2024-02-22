const items = document.getElementsByClassName("items");
const buttons_add = document.getElementsByClassName("add");
const amounts_chosen = document.getElementsByClassName("amount_chosen");
const amounts_avail = document.getElementsByClassName("amount_available");
const buttons_dec = document.getElementsByClassName("dec");
const purchase = document.getElementById("purchase");

for (var i = 0; i < buttons_add.length; i++) {
  buttons_add[i].className += " " + items[i].innerText;
  buttons_dec[i].className += " " + items[i].innerText;
}

for (var i = 0; i < buttons_add.length; i++) { // Client's options to purchase items
  buttons_add[i].addEventListener("click", (event) => {
    classes = event.target.classList;
    for (var j = 0; j < items.length; j++) {
      if (classes[1] === items[j].innerText) {
        if (parseInt(amounts_chosen[j].innerText.substring(15)) < parseInt(amounts_avail[j].innerText.substring(18))) {
          amounts_chosen[j].innerText = "Amount chosen: " + (parseInt(amounts_chosen[j].innerText.substring(15)) + 1);
        } else {

        }
        break;
      }
    }
  });
}

for (var i = 0; i < buttons_dec.length; i++) {
  buttons_dec[i].addEventListener("click", (event) => {
    classes = event.target.classList;
    for (var j = 0; j < items.length; j++) {
      if (classes[1] === items[j].innerText) {
        if (parseInt(amounts_chosen[j].innerText.substring(15)) > 0) {
          amounts_chosen[j].innerText = "Amount chosen: " + (parseInt(amounts_chosen[j].innerText.substring(15)) - 1);
        } else {

        }
        break;
      }
    }
  });
}

purchase.addEventListener("click", () => { // Request to validate purchase
  var chosen = {items: []};
  for (var i = 0; i < items.length; i++) {
    chosen.items.push(parseInt(amounts_chosen[i].innerText.substring(15)));
  }
  fetch("http://localhost:4000/purchase", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(chosen),
  }).then(res => res.json())
    .then(data => {
      console.log(data);
      obj = JSON.parse(data);
      document.getElementById("balance").innerText = "Your account balance: " + obj.balance;
      for (var i = 0; i < amounts_avail.length; i++) {
        amounts_avail[i].innerText = "Amount available: " + obj.amounts[i];
        amounts_chosen[i].innerText = "Amount available: 0";
      }
      alert(obj.message);
    })
});