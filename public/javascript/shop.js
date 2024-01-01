const play = document.getElementById("play");
const submit = document.getElementById("submit");
var flag = false;
var all_trivia = document.getElementsByTagName("label");
var all_radio = document.getElementsByClassName("triv");

for (var i = 0; i < all_radio.length; i++) {
  all_radio[i].style.display = "none";
}

play.addEventListener("click", () => {
  let trivia;
  fetch("http://localhost:4000/trivia")
    .then(res => res.json())
    .then(data => {
      trivia = JSON.parse(data);
      flag = true;
      document.getElementById("question").innerText = trivia.question;
      for (var i = 0; i < all_trivia.length; i++) {
        all_trivia[i].innerText = trivia.answers[i];
      }
      hideOrBlock("block");
      document.getElementById("message").innerText = "";
      runTimer();
    });
});

submit.addEventListener("click", submitFunc);

function submitFunc() {
  var ans = {num: null};
  for (var i = 0; i <= all_radio.length; i++) {
    if (all_radio[i].checked === true) {
      ans.num = i + 1;
      break;
    }
  }
  fetch("http://localhost:4000/answer", {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(ans),
  }).then(res => res.json())
  .then(data => {
    obj = JSON.parse(data);
    document.getElementById("message").innerText = obj.message;
    document.getElementById("balance").innerText = "Your account balance: " + obj.amount;
    pause();
    for (var i = 0; i < all_radio.length; i++) {
      all_radio[i].checked = false;
    }
    hideOrBlock("none");
  });
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [array[i], array[j]] = [array[j], array[i]]; 
  }

  return array;
}

function runTimer() {
  var sec = 29;
  timer = setInterval(() => {
    if (sec === 0) {
      var flag = false;
      for (var i = 0; i < all_radio.length && flag === false; i++) {
        if (all_radio[i].checked === true) {
          flag = true;
          submitFunc();
        }
      }
      if (flag === false) {
        document.getElementById("timer").innerText = "Time is up!";
        clearInterval(timer);
        hideOrBlock("none");
      }
    } else if (sec < 10) {
      document.getElementById("timer").innerText = "00:0" + sec;
    } else {
      document.getElementById("timer").innerText = "00:" + sec;
    }
    sec--;
  }, 1000)
}

function pause() {
  clearInterval(timer);
  document.getElementById("timer").innerText = "00:30";
}

function hideOrBlock(which) {
  document.getElementById("question").style.display = which;
  for (var i = 0; i < all_trivia.length; i++) {
    all_trivia[i].style.display = which;
    all_radio[i].style.display = which;
    submit.style.display = which;
  }
}