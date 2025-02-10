const colors = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#FF4500",
  "#1E90FF",
  "#32CD32",
  "#DC143C",
  "#FF69B4",
  "#4B0082",
  "#20B2AA",
  "#DAA520",
  "#2E8B57",
  "#A0522D",
  "#C71585",
  "#F4A460",
  "#7B68EE",
  "#D2691E",
  "#FF7F50",
  "#6495ED",
  "#7FFF00",
  "#FF6347",
  "#40E0D0",
  "#EE82EE",
  "#F0E68C",
  "#FF1493",
  "#00BFFF",
  "#CD5C5C",
  "#4169E1",
  "#FA8072",
  "#FF8C00",
  "#00FF7F",
  "#DB7093",
  "#00FA9A",
  "#F5DEB3",
  "#87CEEB",
  "#00FF5F",
  "#32CD32",
  "#DC143C",
  "#FF69B4",
  "#4B0082",
  "#20B2AA",
  "#DAA520",
  "#2E8B57",
  "#A0522D",
  "#C71585",
  "#F4A460",
  "#7B68EE",
  "#D2691E",
  "#FF7F50",
  "#6495ED",
  "#7FFF00",
  "#FF6347",
  "#40E0D0",
  "#EE82EE",
  "#F0E68C",
  "#FF1493",
  "#00BFFF",
  "#CD5C5C",
  "#4169E1",
  "#FA8072",
  "#FF8C00",
  "#00FF7F",
  "#DB7093",
  "#00FA9A",
  "#F5DEB3",
  "#87CEEB",
  "#00FF5F",
  "#FF4500",
  "#00CED1",
  "#1E90FF",
  "#32CD32",
  "#DC143C",
  "#FF69B4",
  "#4B0082",
  "#20B2AA",
  "#DAA520",
  "#2E8B57",
  "#A0522D",
  "#C71585",
  "#F4A460",
];

function initializeData() {
  if (!getPlayers()) {
    localStorage.setItem("players", "[]");
  }
}

function getPlayers() {
  return JSON.parse(localStorage.getItem("players"));
}

function addNewPlayer(name) {
  const players = getPlayers();
  if (playerExists(name, players)) {
    return console.log("player already exists");
  } else {
    const playerCount = players.length;
    players.push({ name: name, color: colors[playerCount] });
    localStorage.setItem("players", JSON.stringify(players));
  }
  return;
}

function playerExists(name, players) {
  if (
    players.find((player) => player.name.toLowerCase() == name.toLowerCase())
  ) {
    return true;
  } else {
    return false;
  }
}

function initializeNewPlayerForm() {
  const form = document.querySelector("#add-player-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const playerName = formData.get("player-name");
    if (playerName) {
      addNewPlayer(playerName);
      form.reset(); // Optional: clear the form after adding
    }
    console.log("this is the form data", formData.get("player-name"));
  });
}

initializeData();
initializeNewPlayerForm();
const players = getPlayers();
console.log(players);
