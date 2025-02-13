import { colors } from "./colors.js";

interface Player {
  id: number;
  name: string;
  color: string;
  squareCount: number;
  squares: [number, number][];
}

initializeGame();
initializeNewPlayerForm();

function initializeGame() {
  if (gameExists()) {
    activateSection("add-player-parent");
    createPlayersTable(getPlayers(), "players-list");
  } else {
    activateSection("welcome-box");
    setStartButtonAction();
    initializeData();
  }
}

function setStartButtonAction(): void {
  const startButton = document.getElementById("start-button") as HTMLElement;
  startButton.addEventListener("click", function () {
    activateSection("add-player-parent");
  });
}

function activateSection(sectionId: string): void {
  const SECTIONS = [
    { id: "welcome-box", style: "flex" },
    { id: "add-player-parent", style: "block" },
    { id: "game-board-parent", style: "block" },
  ];

  SECTIONS.forEach((section) => {
    const element = document.getElementById(section.id) as HTMLElement;
    element.style.display = section.id === sectionId ? section.style : "none";
  });
}

function gameExists(): boolean {
  return getPlayers()?.length > 0;
}

function initializeData(): void {
  const players = getPlayers();
  if (players?.length === 0 || !players) {
    localStorage.setItem("players", "[]");
    localStorage.setItem("registeredSquares", "0");
  }
}

function getPlayers(): Player[] {
  const players = localStorage.getItem("players") || "[]";
  return JSON.parse(players, function (k, v) {
    return typeof v === "object" || isNaN(v) ? v : parseInt(v, 10);
  });
}

function getRegisteredSquaresCount(): number {
  const registeredSquaresCount =
    localStorage.getItem("registeredSquares") || "0";
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
  const squareCountInput = document.getElementById(
    "square-count",
  ) as HTMLElement;
  const maxSquareCount = 100 - newRegisteredSquareCount;
  squareCountInput.setAttribute("max", maxSquareCount.toString());
  squareCountInput.setAttribute(
    "placeholder",
    `Enter square count, up to ${maxSquareCount.toString()}`,
  );
}

function setPlayers(players: Player[]) {
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
      squares: [],
    });

    setPlayers(players);
    incrementRegisteredSquares(squareCount);
    createPlayersTable(players, "players-list");
  }
  return;
}

function deletePlayer(playerId: number, tableRow: HTMLElement) {
  const players = getPlayers();
  const removedPlayer = players.find(
    (player: Player) => player.id === playerId,
  );
  const filteredPlayers = players
    .filter((player: Player) => player.id !== playerId)
    .map((player, i) => {
      return {
        ...player,
        id: i,
        color: colors[i],
      };
    });
  const squareCountIncrement = removedPlayer ? -removedPlayer.squareCount : 0;

  setPlayers(filteredPlayers);
  incrementRegisteredSquares(squareCountIncrement);

  tableRow.remove();
  if (filteredPlayers.length === 0) {
    const playersList = document.getElementById("players-list") as HTMLElement;
    playersList.innerHTML = "";
  }
  createPlayersTable(filteredPlayers, "players-list");
}

function createPlayersTable(
  players: Player[],
  elementId: string,
  forGame = false,
) {
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
      "py-2",
      "bg-red-600",
      "text-white",
      "text-xs",
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

  const playersList = document.getElementById(elementId) as HTMLElement;
  const title = !forGame
    ? "<h1 class='block text-gray-800 text-lg font-bold mb-3'>Players Added</h1>"
    : "";

  playersList.innerHTML =
    title +
    "<table class='w-full max-w-lg border-collapse mb-4'><tbody></tbody>" +
    "<thead><tr>" +
    "<th class='p-2 text-left'>Color</th>" +
    "<th class='p-2 text-left'>Name</th>" +
    "<th class='p-2 text-center'>Squares</th>" +
    "<th></th></tr></thead></table>";

  const tableBody = playersList.getElementsByTagName("tbody")[0] as HTMLElement;

  players.forEach((player: Player) => {
    const tableRow = document.createElement("tr");

    if (forGame) {
      const tableRowClasses = `hover:bg-blue-50 cursor-pointer`;
      tableRow.classList.add(...tableRowClasses.split(" "));

      tableRow.addEventListener("mouseover", function () {
        player.squares.forEach((square) => {
          const sq = document.getElementById(
            JSON.stringify(square),
          ) as HTMLElement;
          const sqClasses = "border-4 border-red-400";
          sq.classList.add(...sqClasses.split(" "));
        });
      });

      tableRow.addEventListener("mouseleave", function () {
        player.squares.forEach((square) => {
          const sq = document.getElementById(
            JSON.stringify(square),
          ) as HTMLElement;
          const sqClasses = "border-4 border-red-400";
          sq.classList.remove(...sqClasses.split(" "));
        });
      });
    }

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

    nameColumn.textContent = `${player.name}`;
    squareCountColumn.textContent = `${player.squareCount}`;

    colorColumn.appendChild(colorSquare);
    tableRow.appendChild(colorColumn);
    tableRow.appendChild(nameColumn);
    tableRow.appendChild(squareCountColumn);
    if (!forGame) {
      const deleteButtonColumn = createDeleteButton(player.id, tableRow);
      tableRow.appendChild(deleteButtonColumn);
    }
    tableBody.appendChild(tableRow);
  });
  if (!forGame) {
    createStartGameButton(playersList);
  }
}

function createStartGameButton(playersList: HTMLElement): void {
  const button = document.createElement("button");
  const parentDiv = document.createElement("div");
  const hiddenDiv = document.createElement("div");

  const buttonClasses =
    "peer px-6 py-3 text-white text-lg font-bold bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg";
  const hiddenDivClasses =
    "hidden peer-hover:block absolute top-full left-0 mt-2 text-xs text-red-500 w-full";
  const divClasses = "relative";

  button.classList.add(...buttonClasses.split(" "));
  hiddenDiv.classList.add(...hiddenDivClasses.split(" "));
  parentDiv.classList.add(...divClasses.split(" "));

  button.textContent = "Begin Game";
  hiddenDiv.textContent =
    "Once the game begins, random squares will be assigned and no changes will be allowed. Click to continue.";

  button.addEventListener("click", function () {
    initGrid();
    activateSection("game-board-parent");
  });

  parentDiv.appendChild(button);
  parentDiv.appendChild(hiddenDiv);
  playersList.appendChild(parentDiv);
}

function generateUniqueRandomNumbers(squareCount: number, numbers: number[]) {
  let results = [];
  for (let i = 0; i < squareCount; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    const selectedNumber = numbers.splice(randomIndex, 1)[0];
    results.push(selectedNumber);
  }

  return [results, numbers];
}

function assignNumbers() {
  let numbers = [...Array(100).keys()];
  const players = getPlayers();
  players.forEach((player) => {
    let [results, remainingNumbers] = generateUniqueRandomNumbers(
      player.squareCount,
      numbers,
    );
    results.forEach((result) => {
      const coordinate = numberToGridCoordinate(result);
      player.squares.push(coordinate);
    });
    numbers = remainingNumbers;
  });
  localStorage.setItem("players", JSON.stringify(players));
}

function numberToGridCoordinate(num: number): [number, number] {
  if (num < 0 || num > 99) {
    throw new Error("Number must be between 1 and 100");
  }

  const row = Math.floor(num / 10);
  const col = num % 10;

  return [col, row];
}

function initGrid(): void {
  assignNumbers();

  const gridContainer = document.createElement("div");
  gridContainer.classList.add("grid", "grid-cols-11", "gap-1");
  const grid = document.querySelector(".superbowl-grid") as HTMLElement;
  grid.appendChild(gridContainer);
  const playersData = getPlayers();

  for (let i = -1; i < 10; i++) {
    for (let j = -1; j < 10; j++) {
      const cell = document.createElement("div");
      cell.classList.add(
        "w-10",
        "h-10",
        "border",
        "border-gray-400",
        "flex",
        "items-center",
        "justify-center",
      );

      if (i === -1 && j >= 0) {
        cell.textContent = j.toString();
        cell.classList.add("font-bold");
        cell.classList.remove("border");
      } else if (i === -1 && j === -1) {
        cell.classList.remove("border");
      } else if (j === -1 && i >= 0) {
        cell.textContent = i.toString();
        cell.classList.add("font-bold");
        cell.classList.remove("border");
      } else {
        const player = playersData.find((player) =>
          hasXandY(i, j, player.squares),
        );

        cell.id = `[${i},${j}]`;

        if (player) {
          cell.classList.add(`bg-[${player.color}]`);
          cell.textContent = `${player.name.substring(0, 1)}`;
        }
      }
      gridContainer.appendChild(cell);
    }
  }

  createPlayersTable(playersData, "game-board-player-list", true);
}

function hasXandY(x: number, y: number, numbers: [number, number][]): boolean {
  return numbers.some((pair) => pair[0] === x && pair[1] === y);
}

function playerExists(name: string, players: Player[]) {
  if (
    players.find(
      (player: Player) => player.name.toLowerCase() == name.toLowerCase(),
    )
  ) {
    return true;
  } else {
    return false;
  }
}

function resetPlayerInputForm(form: HTMLFormElement): void {
  form.reset();
  const playerName = document.getElementById("player-name") as HTMLInputElement;
  playerName.focus();
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
      resetPlayerInputForm(form);
    }
  });
}
// function fetchApiData() {
//     fetch('https://api.example.com/data')
//         .then(response => response.json())
//         .then(data => console.log('API Data:', data))
//         .catch(error => console.error('Error fetching API:', error));
// }

// bg-[#FF0000],bg-[#00FF00],bg-[#0000FF],bg-[#FFFF00],bg-[#FF00FF],bg-[#00FFFF],bg-[#FFA500],bg-[#FF4500],bg-[#1E90FF],bg-[#32CD32],bg-[#DC143C],bg-[#FF69B4],bg-[#4B0082],bg-[#20B2AA],bg-[#DAA520],bg-[#2E8B57],bg-[#A0522D],bg-[#C71585],bg-[#F4A460],bg-[#7B68EE],bg-[#D2691E],bg-[#FF7F50],bg-[#6495ED],bg-[#7FFF00],bg-[#FF6347],bg-[#40E0D0],bg-[#EE82EE],bg-[#F0E68C],bg-[#FF1493],bg-[#00BFFF],bg-[#CD5C5C],bg-[#4169E1],bg-[#FA8072],bg-[#FF8C00],bg-[#00FF7F],bg-[#DB7093],bg-[#00FA9A],bg-[#F5DEB3],bg-[#87CEEB],bg-[#00FF5F],bg-[#32CD32],bg-[#DC143C],bg-[#FF69B4],bg-[#4B0082],bg-[#20B2AA],bg-[#DAA520],bg-[#2E8B57],bg-[#A0522D],bg-[#C71585],bg-[#F4A460],bg-[#7B68EE],bg-[#D2691E],bg-[#FF7F50],bg-[#6495ED],bg-[#7FFF00],bg-[#FF6347],bg-[#40E0D0],bg-[#EE82EE],bg-[#F0E68C],bg-[#FF1493],bg-[#00BFFF],bg-[#CD5C5C],bg-[#4169E1],bg-[#FA8072],bg-[#FF8C00],bg-[#00FF7F],bg-[#DB7093],bg-[#00FA9A],bg-[#F5DEB3],bg-[#87CEEB],bg-[#00FF5F],bg-[#FF4500],bg-[#00CED1],bg-[#1E90FF],bg-[#32CD32],bg-[#DC143C],bg-[#FF69B4],bg-[#4B0082],bg-[#20B2AA],bg-[#DAA520],bg-[#2E8B57],bg-[#A0522D],bg-[#C71585],bg-[#F4A460]
