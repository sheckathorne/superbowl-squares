import { colors } from "./colors.js";

initializeGame();
initializeNewPlayerForm();

function initializeGame() {
  if (gameExists()) {
    hideWelcomeShowPlayerForm();
    createPlayersTable(getPlayers());
  } else {
    document.getElementById("add-player-parent").style.display = "none";
    setStartButtonAction();
    initializeData();
  }
}

function setStartButtonAction() {
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", function () {
    hideWelcomeShowPlayerForm();
  });
}

function hideWelcomeShowPlayerForm() {
  const welcomeBox = document.getElementById("welcome-box");
  const addPlayerBox = document.getElementById("add-player-parent");
  welcomeBox.style.display = "none";
  addPlayerBox.style.display = "block";
}

function gameExists() {
  return getPlayers()?.length > 0;
}

function initializeData() {
  const players = getPlayers();
  if (players?.length === 0 || !players) {
    console.log("initializing game...");
    localStorage.setItem("players", "[]");
    localStorage.setItem("registeredSquares", "0");
  }
}

function getPlayers() {
  return JSON.parse(localStorage.getItem("players"), function (k, v) {
    return typeof v === "object" || isNaN(v) ? v : parseInt(v, 10);
  });
}

function getRegisteredSquaresCount() {
  const registeredSquaresCount = localStorage.getItem("registeredSquares");
  return parseInt(registeredSquaresCount);
}

function incrementRegisteredSquares(squareCount) {
  // Save the square count in local storage
  const newRegisteredSquareCount = getRegisteredSquaresCount() + squareCount;
  localStorage.setItem(
    "registeredSquares",
    newRegisteredSquareCount.toString(),
  );

  // Update the 'max' attribute for the form item
  const squareCountInput = document.getElementById("square-count");
  squareCountInput.setAttribute("max", 100 - newRegisteredSquareCount);
}

function setPlayers(players) {
  localStorage.setItem("players", JSON.stringify(players));
}

function addNewPlayer(name, squareCount) {
  const players = getPlayers();

  if (playerExists(name, players)) {
    return console.log("player already exists");
  } else {
    const playerCount = players.length;
    const registeredSquares = players.push({
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

function deletePlayer(playerId) {
  const players = getPlayers();
  const removedPlayer = players.find((player) => player.id === playerId);
  const filteredPlayers = players.filter((player) => player.id !== playerId);

  setPlayers(filteredPlayers);
  incrementRegisteredSquares(-removedPlayer.squareCount);
}

function createPlayersTable(players) {
  function createTableElement(elementType, classList) {
    const el = document.createElement(elementType);
    el.classList.add(...classList);
    return el;
  }

  function createDeleteButton(id, tableRow) {
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
    deleteButton.setAttribute("data-id", id);

    deleteButton.addEventListener("click", function (e) {
      const playerId = parseInt(e.target.getAttribute("data-id"));
      deletePlayer(playerId);
      tableRow.remove();
    });

    deleteButtonColumn.appendChild(deleteButton);
    return deleteButtonColumn;
  }

  const tableBody = document.getElementById("players-list-table-body");
  tableBody.innerHTML = "";
  tableBody.innerHTML =
    "" +
    "<thead><tr>" +
    "<th class='p-2 text-left'>Square Color</th>" +
    "<th class='p-2 text-left'>Name</th>" +
    "<th class='p-2 text-center'>Square Count</th>" +
    "<th></th></tr></thead>";

  players.forEach((player) => {
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
    const squareCount = parseInt(formData.get("square-count"));
    if (playerName) {
      addNewPlayer(playerName, squareCount);
      form.reset();
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
