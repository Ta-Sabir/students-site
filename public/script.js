const body = document.querySelector("body"),
  sidebar = body.querySelector("nav"),
  toggle = body.querySelector(".toggle"),
  searchBtn = body.querySelector(".search-box"),
  modeSwitch = body.querySelector(".toggle-switch"),
  modeText = body.querySelector(".mode-text");


const isDarkMode = localStorage.getItem("darkMode") === "true";

if (isDarkMode) {
  body.classList.add("dark");
  modeText.innerText = "الوضع الليلي";
} else {
  body.classList.remove("dark");
  modeText.innerText = "الوضع العادي";
}

toggle.addEventListener("click", () => {
  sidebar.classList.toggle("close");
});

searchBtn.addEventListener("click", () => {
  sidebar.classList.remove("close");
});

modeSwitch.addEventListener("click", () => {
  body.classList.toggle("dark");
  const isDarkMode = body.classList.contains("dark");
  localStorage.setItem("darkMode", isDarkMode.toString());

  if (isDarkMode) {
    modeText.innerText = "الوضع الليلي";
  } else {
    modeText.innerText = "الوضع العادي";
  }
});
