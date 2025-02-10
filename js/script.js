import { colors } from './colors.js';


initializeGame();
initializeData();
initializeNewPlayerForm();

function initializeGame() {
  if (gameExists()) {
    hideWelcomeShowPlayerForm();
  } else {
    setStartButtonAction();
  }
}

function setStartButtonAction() {
  const startButton = document.getElementById("start-button");
  startButton.addEventListener("click", function () {
    hideWelcomeShowPlayerForm()
  })
}

function hideWelcomeShowPlayerForm() {
  const welcomeBox = document.getElementById("welcome-box");
  const addPlayerBox = document.getElementById("add-player-section");
  welcomeBox.style.display = "none";
  addPlayerBox.style.display = "block"
}

function gameExists() {
    return getPlayers()?.length > 0
}

function initializeData() {
  if (!getPlayers()) {
    localStorage.setItem("players", "[]");
  }
}

function getPlayers() {

  return JSON.parse(localStorage.getItem("players"), function(k, v) {
    return (typeof v === "object" || isNaN(v)) ? v : parseInt(v, 10);
  });
}

function addNewPlayer(name, squareCount) {
  const players = getPlayers();
  if (playerExists(name, players)) {
    return console.log("player already exists");
  } else {
    const playerCount = players.length;
    players.push({ name: name, color: colors[playerCount], squareCount: squareCount });
    localStorage.setItem("players", JSON.stringify(players));
    const tableBody = document.getElementById("players-list-table-body")
    tableBody.innerHTML = ""

    players.forEach(player => {
      const tableRow = document.createElement("tr")
      const colorColumn = document.createElement("td")
      const nameColumn = document.createElement("td")
      const colorSquare = document.createElement("div")

      colorSquare.classList.add("w-6","h-6","rounded","border","border-gray-200",`bg-[${player.color}]`)
      colorColumn.classList.add("p-2")
      nameColumn.classList.add("p-2")
      colorColumn.appendChild(colorSquare)
      tableRow.appendChild(colorColumn)

      nameColumn.textContent = `${player.name}`
      tableRow.appendChild(nameColumn)
      tableBody.appendChild(tableRow)
    })

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
    const squareCount = formData.get("square-count");
    if (playerName) {
      addNewPlayer(playerName, squareCount);
      form.reset();
    }
  });
}

// const playersData = [
//     {
//         name: "AMD",
//         color: "#A1C4FC",  // Random color for AMD
//         numbers: [
//             [5, 6], [2, 2], [6, 4], [4, 8], [9, 1]
//         ]
//     },
//     {
//         name: "AP",
//         color: "#F5A9B8",  // Random color for AP
//         numbers: [
//             [8, 0], [9, 2], [6, 7], [9, 9], [3, 1]
//         ]
//     },
//     {
//         name: "CD",
//         color: "#FFB6C1",  // Random color for CD
//         numbers: [
//             [4, 3], [6, 0]
//         ]
//     },
//     {
//         name: "DJT",
//         color: "#C1B7B5",  // Random color for DJT
//         numbers: [
//             [8, 6], [2, 3], [3, 7], [4, 4], [6, 9]
//         ]
//     },
//     {
//         name: "DMO",
//         color: "#80C9F5",  // Random color for DMO
//         numbers: [
//             [8, 3], [0, 2], [7, 5], [0, 1]
//         ]
//     },
//     {
//         name: "Donna",
//         color: "#F3A7C5",  // Random color for Donna
//         numbers: [
//             [1, 8], [6, 1]
//         ]
//     },
//     {
//         name: "Ellyott",
//         color: "#A2D9CE",  // Random color for Ellyott
//         numbers: [
//             [2, 7], [1, 5]
//         ]
//     },
//     {
//         name: "Emily",
//         color: "#FF7E5F",  // Random color for Emily
//         numbers: [
//             [7, 6], [9, 4], [5, 4], [4, 5], [2, 9]
//         ]
//     },
//     {
//         name: "ETD",
//         color: "#6B8E23",  // Random color for ETD
//         numbers: [
//             [5, 2], [1, 7]
//         ]
//     },
//     {
//         name: "Hawkeye",
//         color: "#FFD700",  // Random color for Hawkeye
//         numbers: [
//             [3, 3], [8, 8]
//         ]
//     },
//     {
//         name: "Jay",
//         color: "#B0E0E6",  // Random color for Jay
//         numbers: [
//             [7, 0], [7, 8]
//         ]
//     },
//     {
//         name: "Kirk",
//         color: "#9ACD32",  // Random color for Kirk
//         numbers: [
//             [3, 0], [4, 7], [7, 4], [9, 5], [1, 1], [5, 1]
//         ]
//     },
//     {
//         name: "MaryJo",
//         color: "#FF6347",  // Random color for MaryJo
//         numbers: [
//             [6, 3], [9, 0], [1, 9], [0, 8]
//         ]
//     },
//     {
//         name: "Nis",
//         color: "#8A2BE2",  // Random color for Nis
//         numbers: [
//             [1, 3], [5, 3], [0, 7], [6, 5], [4, 9], [7, 1]
//         ]
//     },
//     {
//         name: "Otto",
//         color: "#FF1493",  // Random color for Otto
//         numbers: [
//             [0, 3], [7, 7]
//         ]
//     },
//     {
//         name: "Oz",
//         color: "#2E8B57",  // Random color for Oz
//         numbers: [
//             [8, 2], [6, 2], [9, 8]
//         ]
//     },
//     {
//         name: "PJ",
//         color: "#D2691E",  // Random color for PJ
//         numbers: [
//             [9, 6], [7, 3], [1, 0], [0, 4], [3, 5], [6, 8]
//         ]
//     },
//     {
//         name: "Rauls",
//         color: "#ADFF2F",  // Random color for Rauls
//         numbers: [
//             [1, 6], [2, 0], [3, 4], [8, 9], [2, 8], [5, 8]
//         ]
//     },
//     {
//         name: "Rog",
//         color: "#D3D3D3",  // Random color for Rog
//         numbers: [
//             [8, 4], [7, 9]
//         ]
//     },
//     {
//         name: "Sal",
//         color: "#F0E68C",  // Random color for Sal
//         numbers: [
//             [0, 6], [8, 7], [5, 7]
//         ]
//     },
//     {
//         name: "Skin",
//         color: "#CD5C5C",  // Random color for Skin
//         numbers: [
//             [4, 0], [1, 2], [0, 5], [3, 8]
//         ]
//     },
//     {
//         name: "SOD",
//         color: "#D8BFD8",  // Random color for SOD
//         numbers: [
//             [8, 5], [2, 5]
//         ]
//     },
//     {
//         name: "Stella",
//         color: "#FF4500",  // Random color for Stella
//         numbers: [
//             [9, 3], [5, 9]
//         ]
//     },
//     {
//         name: "Steph",
//         color: "#7FFF00",  // Random color for Steph
//         numbers: [
//             [6, 6], [3, 9]
//         ]
//     },
//     {
//         name: "SV",
//         color: "#B22222",  // Random color for SV
//         numbers: [
//             [4, 6], [3, 6], [0, 0], [4, 2], [7, 2], [1, 4], [2, 4], [5, 5], [8, 1], [2, 1]
//         ]
//     },
//     {
//         name: "Vick",
//         color: "#FF8C00",  // Random color for Vick
//         numbers: [
//             [3, 2], [0, 9]
//         ]
//     },
//     {
//         name: "Z",
//         color: "#00CED1",  // Random color for Z
//         numbers: [
//             [2, 6], [5, 0], [9, 7], [4, 1]
//         ]
//     }
// ];

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