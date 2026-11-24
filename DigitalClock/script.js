const clock = document.querySelector(".time");
setInterval(() => {
  let date = new Date();
  clock.innerText = date.toLocaleTimeString();
}, 1000);
