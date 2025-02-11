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
