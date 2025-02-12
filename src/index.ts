import { colors } from "./colors.js";

interface Player {
  id: number
  name: string
  color: string
  squareCount: number
}

initializeGame();
initializeNewPlayerForm();

function initializeGame() {
  if (gameExists()) {
    hideWelcomeShowPlayerForm();
    createPlayersTable(getPlayers());
  } else {
    const playerParent = document.getElementById("add-player-parent") as HTMLElement;
    playerParent.style.display = "none";
    setStartButtonAction();
    initializeData();
  }
}

function setStartButtonAction(): void {
  const startButton = document.getElementById("start-button") as HTMLElement;
  startButton.addEventListener("click", function () {
    hideWelcomeShowPlayerForm();
  });
}

function hideWelcomeShowPlayerForm(): void {
  const welcomeBox = document.getElementById("welcome-box") as HTMLElement;
  const addPlayerBox = document.getElementById("add-player-parent") as HTMLElement;
  welcomeBox.style.display = "none";
  addPlayerBox.style.display = "block";
}

function gameExists(): boolean {
  return getPlayers()?.length > 0;
}

function initializeData(): void {
  const players = getPlayers();
  if (players?.length === 0 || !players) {
    console.log("initializing game...");
    localStorage.setItem("players", "[]");
    localStorage.setItem("registeredSquares", "0");
  }
}

function getPlayers(): Player[] {
  const players = localStorage.getItem("players") || "";
  return JSON.parse(players, function (k, v) {
    return typeof v === "object" || isNaN(v) ? v : parseInt(v, 10);
  });
}

function getRegisteredSquaresCount(): number {
  const registeredSquaresCount = localStorage.getItem("registeredSquares") || "0";
  return parseInt(registeredSquaresCount);
}

function incrementRegisteredSquares(squareCount: number): void {
  // Save the square count in local storage
  const newRegisteredSquareCount = getRegisteredSquaresCount() + squareCount;
  localStorage.setItem(
    "registeredSquares",
    newRegisteredSquareCount.toString(),
  );

  // Update the 'max' attribute for the form item
  const squareCountInput = document.getElementById("square-count") as HTMLElement;
  const maxSquareCount = 100 - newRegisteredSquareCount
  squareCountInput.setAttribute("max", maxSquareCount.toString());
}

function setPlayers(players: string) {
  localStorage.setItem("players", JSON.stringify(players));
}

function addNewPlayer(name: string, squareCount: number) {
  const players = getPlayers();

  if (playerExists(name, players)) {
    return console.log("player already exists");
  } else {
    const playerCount = players.length;
    players.push({
      id: playerCount,
      name: name,
      color: colors[playerCount],
      squareCount: squareCount,
    });

    setPlayers(players);
    incrementRegisteredSquares(squareCount);
    createPlayersTable(players);
  }
  return;
}

function deletePlayer(playerId: number, tableRow: HTMLElement) {
  const players = getPlayers();
  const removedPlayer = players.find((player: Player) => player.id === playerId);
  const filteredPlayers = players.filter((player: Player) => player.id !== playerId);

  setPlayers(filteredPlayers);
  incrementRegisteredSquares(-removedPlayer.squareCount);

  tableRow.remove();
  if (filteredPlayers.length === 0) {
    const playersList = document.getElementById("players-list") as HTMLElement;
    playersList.innerHTML = "";
  }
}

function createPlayersTable(players: Player[]) {
  function createTableElement(elementType: string, classList: string[]) {
    const el = document.createElement(elementType);
    el.classList.add(...classList);
    return el;
  }

  function createDeleteButton(id: number, tableRow: HTMLElement) {
    const deleteButtonColumn = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButtonColumn.classList.add("p-2", "text-center", "align-middle");
    deleteButton.classList.add(
      "m-2",
      "px-4",
      "py-1",
      "bg-red-500",
      "text-white",
      "text-sm",
      "rounded-md",
      "hover:bg-red-700",
      "focus:outline-none",
      "focus:ring-2",
      "focus:ring-red-400",
    );
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("data-id", id.toString());

    deleteButton.addEventListener("click", function (e) {
      const element = e.target as HTMLElement;
      if (!(element instanceof HTMLButtonElement)) return;

      const playerId = element.getAttribute("data-id");
      if (!playerId) return;

      deletePlayer(parseInt(playerId), tableRow);
    });

    deleteButtonColumn.appendChild(deleteButton);
    return deleteButtonColumn;
  }

  const playersList = document.getElementById("players-list") as HTMLElement;

  playersList.innerHTML =
    "<h1 class='block text-gray-800 text-lg font-bold mb-3'>Players Added</h1>" +
    "<table class='w-full max-w-lg border-collapse'><tbody id='players-list-table-body'></tbody>" +
    "<thead><tr>" +
    "<th class='p-2 text-left'>Square Color</th>" +
    "<th class='p-2 text-left'>Name</th>" +
    "<th class='p-2 text-center'>Square Count</th>" +
    "<th></th></tr></thead></table>";

  const tableBody = document.getElementById("players-list-table-body") as HTMLElement;

  players.forEach((player: Player) => {
    const tableRow = document.createElement("tr");

    const colorColumn = createTableElement("td", [
      "p-2",
      "text-left",
      "align-middle",
    ]);
    const nameColumn = createTableElement("td", [
      "p-2",
      "text-left",
      "align-middle",
    ]);
    const squareCountColumn = createTableElement("td", [
      "p-2",
      "text-center",
      "align-middle",
    ]);
    const colorSquare = createTableElement("div", [
      "w-6",
      "h-6",
      "rounded",
      "border",
      "border-gray-200",
      `bg-[${player.color}]`,
    ]);
    const deleteButtonColumn = createDeleteButton(player.id, tableRow);

    nameColumn.textContent = `${player.name}`;

    squareCountColumn.textContent = `${player.squareCount}`;

    colorColumn.appendChild(colorSquare);
    tableRow.appendChild(colorColumn);

    tableRow.appendChild(nameColumn);
    tableRow.appendChild(squareCountColumn);
    tableRow.appendChild(deleteButtonColumn);
    tableBody.appendChild(tableRow);
  });
}

function playerExists(name: string, players: Player[]) {
  if (
    players.find((player: Player) => player.name.toLowerCase() == name.toLowerCase())
  ) {
    return true;
  } else {
    return false;
  }
}

function initializeNewPlayerForm() {
  const form = document.querySelector("#add-player-form") as HTMLFormElement;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const playerName = String(formData.get("player-name")) || "";
    const squareCount = parseInt(String(formData.get("square-count")) || "0");
    if (playerName) {
      addNewPlayer(playerName, squareCount);
      // form.reset();
    }
  });
}
// function fetchApiData() {
//     fetch('https://api.example.com/data')
//         .then(response => response.json())
//         .then(data => console.log('API Data:', data))
//         .catch(error => console.error('Error fetching API:', error));
// }

// function initGrid () {
//     const gridContainer = document.createElement("div");
//     gridContainer.classList.add("grid", "grid-cols-11", "gap-1");
//     document.querySelector(".superbowl-grid").appendChild(gridContainer);

//     for (let i = -1; i < 10; i++) {
//         for (let j = -1; j < 10; j++) {
//             const cell = document.createElement("div");
//             cell.classList.add("w-10", "h-10", "border", "border-gray-400", "flex", "items-center", "justify-center");

//           if (i === -1 && j >= 0) {
//             cell.textContent = j;
//             cell.classList.add("font-bold");
//             cell.classList.remove("border");
//           } else if (i === -1 && j === -1) {
//             cell.classList.remove("border");
//           } else if (j === -1 && i >= 0) {
//             cell.textContent = i;
//             cell.classList.add("font-bold");
//             cell.classList.remove("border");
//           } else {
//             const player = playersData.find(player => hasXandY(i,j,player.numbers))
//             cell.classList.add(`bg-[${player.color}]`)
//             cell.textContent = `${i},${j}`
//           }

//             gridContainer.appendChild(cell);
//         }
//     }
//   }

//   function hasXandY(x, y, numbers) {
//       return numbers.some(pair => pair[0] === x && pair[1] === y);
//   }

// initGrid();
// createPlayerList(playersData)
// fetchApiData();
// setInterval(fetchApiData, 30000);
