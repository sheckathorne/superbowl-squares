import { colors } from "./colors.js";
initializeGame();
initializeNewPlayerForm();
function initializeGame() {
    if (gameExists()) {
        activateSection("add-player-parent");
        createPlayersTable(getPlayers(), "players-list");
    }
    else {
        activateSection("welcome-box");
        setStartButtonAction();
        initializeData();
    }
}
function setStartButtonAction() {
    const startButton = document.getElementById("start-button");
    startButton.addEventListener("click", function () {
        activateSection("add-player-parent");
    });
}
function activateSection(sectionId) {
    const SECTIONS = [
        { id: "welcome-box", style: "flex" },
        { id: "add-player-parent", style: "block" },
        { id: "game-board-parent", style: "block" },
    ];
    SECTIONS.forEach((section) => {
        const element = document.getElementById(section.id);
        element.style.display = section.id === sectionId ? section.style : "none";
    });
}
function gameExists() {
    return getPlayers()?.length > 0;
}
function initializeData() {
    const players = getPlayers();
    if (players?.length === 0 || !players) {
        localStorage.setItem("players", "[]");
        localStorage.setItem("registeredSquares", "0");
    }
}
function getPlayers() {
    const players = localStorage.getItem("players") || "[]";
    return JSON.parse(players, function (k, v) {
        return typeof v === "object" || isNaN(v) ? v : parseInt(v, 10);
    });
}
function getRegisteredSquaresCount() {
    const registeredSquaresCount = localStorage.getItem("registeredSquares") || "0";
    return parseInt(registeredSquaresCount);
}
function incrementRegisteredSquares(squareCount) {
    // Save the square count in local storage
    const newRegisteredSquareCount = getRegisteredSquaresCount() + squareCount;
    localStorage.setItem("registeredSquares", newRegisteredSquareCount.toString());
    // Update the 'max' attribute for the form item
    const squareCountInput = document.getElementById("square-count");
    const maxSquareCount = 100 - newRegisteredSquareCount;
    squareCountInput.setAttribute("max", maxSquareCount.toString());
    squareCountInput.setAttribute("placeholder", `Enter square count, up to ${maxSquareCount.toString()}`);
}
function setPlayers(players) {
    localStorage.setItem("players", JSON.stringify(players));
}
function addNewPlayer(name, squareCount) {
    const players = getPlayers();
    if (playerExists(name, players)) {
        return console.log("player already exists");
    }
    else {
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
function deletePlayer(playerId, tableRow) {
    const players = getPlayers();
    const removedPlayer = players.find((player) => player.id === playerId);
    const filteredPlayers = players
        .filter((player) => player.id !== playerId)
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
        const playersList = document.getElementById("players-list");
        playersList.innerHTML = "";
    }
    createPlayersTable(filteredPlayers, "players-list");
}
function createPlayersTable(players, elementId, forGame = false) {
    function createTableElement(elementType, classList) {
        const el = document.createElement(elementType);
        el.classList.add(...classList);
        return el;
    }
    function createDeleteButton(id, tableRow) {
        const deleteButtonColumn = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButtonColumn.classList.add("p-2", "text-center", "align-middle");
        deleteButton.classList.add("m-2", "px-4", "py-2", "bg-red-600", "text-white", "text-xs", "rounded-md", "hover:bg-red-700", "focus:outline-none", "focus:ring-2", "focus:ring-red-400");
        deleteButton.textContent = "Delete";
        deleteButton.setAttribute("data-id", id.toString());
        deleteButton.addEventListener("click", function (e) {
            const element = e.target;
            if (!(element instanceof HTMLButtonElement))
                return;
            const playerId = element.getAttribute("data-id");
            if (!playerId)
                return;
            deletePlayer(parseInt(playerId), tableRow);
        });
        deleteButtonColumn.appendChild(deleteButton);
        return deleteButtonColumn;
    }
    const playersList = document.getElementById(elementId);
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
    const tableBody = playersList.getElementsByTagName("tbody")[0];
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
        // debugger;
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
function createStartGameButton(playersList) {
    const button = document.createElement("button");
    const parentDiv = document.createElement("div");
    const hiddenDiv = document.createElement("div");
    const buttonClasses = "peer px-6 py-3 text-white text-lg font-bold bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg";
    const hiddenDivClasses = "hidden peer-hover:block absolute top-full left-0 mt-2 text-xs text-red-500 w-full";
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
function generateUniqueRandomNumbers(squareCount, numbers) {
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
        let [results, remainingNumbers] = generateUniqueRandomNumbers(player.squareCount, numbers);
        results.forEach((result) => {
            const coordinate = numberToGridCoordinate(result);
            player.squares.push(coordinate);
        });
        numbers = remainingNumbers;
    });
    localStorage.setItem("players", JSON.stringify(players));
}
function numberToGridCoordinate(num) {
    if (num < 0 || num > 99) {
        throw new Error("Number must be between 1 and 100");
    }
    const row = Math.floor(num / 10);
    const col = num % 10;
    return [col, row];
}
function initGrid() {
    assignNumbers();
    const gridContainer = document.createElement("div");
    gridContainer.classList.add("grid", "grid-cols-11", "gap-1");
    const grid = document.querySelector(".superbowl-grid");
    grid.appendChild(gridContainer);
    const playersData = getPlayers();
    for (let i = -1; i < 10; i++) {
        for (let j = -1; j < 10; j++) {
            const cell = document.createElement("div");
            cell.classList.add("w-10", "h-10", "border", "border-gray-400", "flex", "items-center", "justify-center");
            if (i === -1 && j >= 0) {
                cell.textContent = j.toString();
                cell.classList.add("font-bold");
                cell.classList.remove("border");
            }
            else if (i === -1 && j === -1) {
                cell.classList.remove("border");
            }
            else if (j === -1 && i >= 0) {
                cell.textContent = i.toString();
                cell.classList.add("font-bold");
                cell.classList.remove("border");
            }
            else {
                const player = playersData.find((player) => hasXandY(i, j, player.squares));
                if (player) {
                    cell.classList.add(`bg-[${player.color}]`);
                }
                cell.textContent = `${i},${j}`;
            }
            gridContainer.appendChild(cell);
        }
    }
    createPlayersTable(playersData, "game-board-player-list", true);
}
function hasXandY(x, y, numbers) {
    return numbers.some((pair) => pair[0] === x && pair[1] === y);
}
function playerExists(name, players) {
    if (players.find((player) => player.name.toLowerCase() == name.toLowerCase())) {
        return true;
    }
    else {
        return false;
    }
}
function resetPlayerInputForm(form) {
    form.reset();
    const playerName = document.getElementById("player-name");
    playerName.focus();
}
function initializeNewPlayerForm() {
    const form = document.querySelector("#add-player-form");
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
// initGrid();
// createPlayerList(playersData)
// fetchApiData();
// setInterval(fetchApiData, 30000);
//# sourceMappingURL=index.js.map