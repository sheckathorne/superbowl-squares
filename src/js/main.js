import { colors, nflTeams } from '../ts/data';
initializeGame();
initializeNewPlayerForm();
initializeTeamsForm();
function initializeGame() {
    if (gameHasStarted()) {
        clearGrid();
        initGrid();
        activateSection('game-board-parent');
    }
    else if (playersExist() || teamsSelected()) {
        const registeredSquares = parseInt(localStorage.getItem('registeredSquares') || '0');
        const maxSquares = 100 - registeredSquares;
        setSquareCountInputMaxAttribute(maxSquares);
        activateSection('add-player-parent');
        if (playersExist()) {
            createPlayersTable(getPlayers(), 'players-list');
        }
    }
    else {
        activateSection('welcome-box');
        setStartButtonAction();
        initializeData();
    }
}
function clearGrid() {
    const grid = document.querySelector('.superbowl-grid');
    const button = document.getElementById('reset-game-button');
    const playersList = document.getElementById('players-list');
    debugger;
    grid.innerHTML = '';
    playersList.innerHTML = '';
    button.remove();
}
function initTeamSelect() {
    const elements = ['home-team', 'away-team'];
    function getOtherElement(el) {
        const otherElementId = elements.filter((element) => element !== el.id)[0];
        const otherElement = document.getElementById(otherElementId);
        return otherElement;
    }
    function populateTeamSelect(el) {
        const elements = ['home-team', 'away-team'];
        el.innerHTML = '';
        const defaultOption = document.createElement('option');
        defaultOption.text = '-- Select a Team --';
        defaultOption.value = '';
        el.appendChild(defaultOption);
        nflTeams
            .filter((team) => {
            return team.id.toString() !== getOtherElement(el).value;
        })
            .sort((a, b) => a.name > b.name ? 1 : b.name > a.name ? -1 : 0)
            .forEach((team) => {
            const option = document.createElement('option');
            option.value = team.id.toString();
            option.text = team.name;
            el.appendChild(option);
        });
    }
    const selectElements = document.querySelectorAll('.team-select');
    selectElements.forEach((el) => {
        populateTeamSelect(el);
        el.addEventListener('change', function () {
            const otherElement = getOtherElement(el);
            const otherValue = otherElement.value;
            populateTeamSelect(getOtherElement(el));
            otherElement.value = otherValue;
        });
    });
}
function teamsSelected() {
    const teams = getTeams();
    return teams.length > 0;
}
function setSquareCountInputMaxAttribute(maxSquareCountNumber) {
    const squareCountInput = document.getElementById('square-count');
    squareCountInput.setAttribute('max', maxSquareCountNumber.toString());
    squareCountInput.setAttribute('placeholder', `Enter square count, up to ${maxSquareCountNumber.toString()}`);
}
function setStartButtonAction() {
    const startButton = document.getElementById('start-button');
    startButton.addEventListener('click', function () {
        activateSection('add-teams-parent');
    });
}
function activateSection(sectionId) {
    const SECTIONS = [
        { id: 'welcome-box', style: 'flex' },
        { id: 'add-player-parent', style: 'block' },
        { id: 'add-teams-parent', style: 'block' },
        { id: 'game-board-parent', style: 'block' },
    ];
    SECTIONS.forEach((section) => {
        const element = document.getElementById(section.id);
        element.style.display = section.id === sectionId ? section.style : 'none';
    });
}
function playersExist() {
    return getPlayers()?.length > 0;
}
function gameHasStarted() {
    const players = getPlayers();
    if (players) {
        for (const player of players) {
            if (player.squares.length > 0) {
                return true;
            }
        }
    }
    return false;
}
function initializeData() {
    const players = getPlayers();
    if (players?.length === 0 || !players) {
        localStorage.setItem('players', '[]');
        localStorage.setItem('teams', '[]');
        localStorage.setItem('registeredSquares', '0');
    }
    initTeamSelect();
}
function getPlayers() {
    const players = localStorage.getItem('players') || '[]';
    return JSON.parse(players, function (k, v) {
        return typeof v === 'object' || isNaN(v) ? v : parseInt(v, 10);
    });
}
function getTeams() {
    const players = localStorage.getItem('teams') || '[]';
    return JSON.parse(players, function (k, v) {
        return typeof v === 'object' || isNaN(v) ? v : parseInt(v, 10);
    });
}
function getRegisteredSquaresCount() {
    const registeredSquaresCount = localStorage.getItem('registeredSquares') || '0';
    return parseInt(registeredSquaresCount);
}
function incrementRegisteredSquares(squareCount) {
    const newRegisteredSquareCount = getRegisteredSquaresCount() + squareCount;
    localStorage.setItem('registeredSquares', newRegisteredSquareCount.toString());
    const maxSquareCount = 100 - newRegisteredSquareCount;
    setSquareCountInputMaxAttribute(maxSquareCount);
}
function setPlayers(players) {
    localStorage.setItem('players', JSON.stringify(players));
}
function setTeams(teams) {
    localStorage.setItem('teams', JSON.stringify(teams));
}
function addNewPlayer(name, squareCount) {
    const players = getPlayers();
    if (playerExists(name, players)) {
        return console.log('player already exists');
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
        createPlayersTable(players, 'players-list');
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
        const playersList = document.getElementById('players-list');
        const beginButton = document.getElementById('begin-game-parent');
        playersList.innerHTML = '';
        beginButton.remove();
    }
    if (filteredPlayers.length > 0) {
        createPlayersTable(filteredPlayers, 'players-list');
    }
}
function createPlayersTable(players, elementId, forGame = false) {
    function createTableElement(elementType, classList) {
        const el = document.createElement(elementType);
        el.classList.add(...classList);
        return el;
    }
    function createDeleteButton(id, tableRow) {
        const deleteButtonColumn = document.createElement('td');
        const deleteButton = document.createElement('button');
        deleteButtonColumn.classList.add('p-2', 'text-center', 'align-middle');
        deleteButton.classList.add('m-2', 'px-4', 'py-2', 'bg-red-600', 'text-white', 'text-xs', 'cursor-pointer', 'rounded-md', 'hover:bg-red-700', 'focus:outline-none', 'focus:ring-2', 'focus:ring-red-400');
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('data-id', id.toString());
        deleteButton.addEventListener('click', function (e) {
            const element = e.target;
            if (!(element instanceof HTMLButtonElement))
                return;
            const playerId = element.getAttribute('data-id');
            if (!playerId)
                return;
            deletePlayer(parseInt(playerId), tableRow);
        });
        deleteButtonColumn.appendChild(deleteButton);
        return deleteButtonColumn;
    }
    const playersList = document.getElementById(elementId);
    const title = !forGame
        ? "<h1 class='block text-gray-800 text-lg font-bold mt-6 mb-3'>Players Added</h1>"
        : '';
    playersList.innerHTML =
        title +
            "<table class='w-full max-w-lg border-collapse mb-4'><tbody></tbody>" +
            '<thead><tr>' +
            "<th class='p-2 text-left md:text-base text-sm'>Color</th>" +
            "<th class='p-2 text-left md:text-base text-sm'>Name</th>" +
            "<th class='p-2 text-center md:text-base text-sm'>Squares</th>" +
            '<th></th></tr></thead></table>';
    const tableBody = playersList.getElementsByTagName('tbody')[0];
    players.forEach((player) => {
        const tableRow = document.createElement('tr');
        if (forGame) {
            const tableRowClasses = `hover:bg-blue-50 cursor-pointer`;
            tableRow.classList.add(...tableRowClasses.split(' '));
            const sqClasses = 'border-4 border-gray-900';
            tableRow.addEventListener('mouseover', function () {
                player.squares.forEach((square) => {
                    const sq = document.getElementById(JSON.stringify(square));
                    sq.classList.add(...sqClasses.split(' '));
                });
            });
            tableRow.addEventListener('mouseleave', function () {
                player.squares.forEach((square) => {
                    const sq = document.getElementById(JSON.stringify(square));
                    sq.classList.remove(...sqClasses.split(' '));
                });
            });
        }
        const colorColumn = createTableElement('td', [
            'p-2',
            'text-left',
            'align-middle',
            'md:text-base',
            'text-xs',
        ]);
        const nameColumn = createTableElement('td', [
            'p-2',
            'text-left',
            'align-middle',
            'md:text-base',
            'text-xs',
        ]);
        const squareCountColumn = createTableElement('td', [
            'p-2',
            'text-center',
            'align-middle',
            'md:text-base',
            'text-xs',
        ]);
        const colorSquare = createTableElement('div', [
            'w-4',
            'h-4',
            'md:w-6',
            'md:h-6',
            'rounded',
            'border',
            'border-gray-200',
            `bg-[${player.color}BF]`,
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
function createStartGameButton(playersList) {
    const button = document.createElement('button');
    const parentDiv = document.createElement('div');
    const hiddenDiv = document.createElement('div');
    const buttonClasses = 'peer px-6 py-3 text-white text-lg font-bold bg-green-500 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-lg cursor-pointer';
    const hiddenDivClasses = 'hidden peer-hover:block absolute top-full left-0 mt-2 text-xs text-red-500 w-full';
    const divClasses = 'relative';
    button.classList.add(...buttonClasses.split(' '));
    hiddenDiv.classList.add(...hiddenDivClasses.split(' '));
    parentDiv.classList.add(...divClasses.split(' '));
    parentDiv.id = 'begin-game-parent';
    button.textContent = 'Begin Game';
    hiddenDiv.textContent =
        'Once the game begins, random squares will be assigned and no changes will be allowed. Click to continue.';
    button.addEventListener('click', function () {
        assignNumbers();
        initGrid();
        activateSection('game-board-parent');
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
        player.squares = [];
        let [results, remainingNumbers] = generateUniqueRandomNumbers(player.squareCount, numbers);
        results.forEach((result) => {
            const coordinate = numberToGridCoordinate(result);
            player.squares.push(coordinate);
        });
        numbers = remainingNumbers;
    });
    localStorage.setItem('players', JSON.stringify(players));
}
function numberToGridCoordinate(num) {
    if (num < 0 || num > 99) {
        throw new Error('Number must be between 1 and 100');
    }
    const row = Math.floor(num / 10);
    const col = num % 10;
    return [col, row];
}
function initGrid() {
    const gridContainer = document.createElement('div');
    gridContainer.classList.add('grid', 'grid-cols-11', 'gap-1', 'aspect-square', 'px-2');
    const grid = document.querySelector('.superbowl-grid');
    grid.appendChild(gridContainer);
    const playersData = getPlayers();
    for (let i = -1; i < 10; i++) {
        for (let j = -1; j < 10; j++) {
            const cell = document.createElement('div');
            cell.classList.add('w-[20px]', 'h-[20px]', 'md:size-8', 'border', 'border-gray-400', 'flex', 'items-center', 'justify-center', 'aspect-square', 'text-xs');
            if (i === -1 && j >= 0) {
                cell.textContent = j.toString();
                cell.classList.add('font-bold');
                cell.classList.remove('border');
            }
            else if (i === -1 && j === -1) {
                cell.classList.remove('border');
            }
            else if (j === -1 && i >= 0) {
                cell.textContent = i.toString();
                cell.classList.add('font-bold');
                cell.classList.remove('border');
            }
            else {
                const player = playersData.find((player) => hasXandY(i, j, player.squares));
                cell.id = `[${i},${j}]`;
                if (player) {
                    cell.classList.add(`bg-[${player.color}BF]`);
                    cell.textContent = `${player.name.substring(0, 1)}`;
                }
            }
            gridContainer.appendChild(cell);
        }
    }
    setTeamNamesOnGrid();
    createPlayersTable(playersData, 'game-board-player-list', true);
    createResetButton();
}
function createResetButton() {
    const parentElement = document.getElementById('game-board-white-square');
    const button = document.createElement('button');
    const buttonClasses = 'peer px-6 py-3 text-white text-lg font-bold bg-red-500 rounded-lg hover:bg-red-600 transition-colors duration-200 shadow-lg cursor-pointer';
    button.classList.add(...buttonClasses.split(' '));
    button.textContent = 'Reset Game';
    button.id = 'reset-game-button';
    button.addEventListener('click', function () {
        resetGame();
    });
    parentElement.appendChild(button);
}
function resetGame() {
    localStorage.clear();
    clearGrid();
    initializeGame();
}
function setTeamNamesOnGrid() {
    const sides = ['home', 'away'];
    const teams = getTeams();
    const imageSize = 'w-8 h-8';
    sides.forEach((side) => {
        const sideLabel = document.getElementById(`${side}-team-label`);
        const teamName = teams.find((team) => team.side === side)?.name ?? '';
        const logoSrc = teams.find((team) => team.side === side)?.logoUrl ?? '';
        if (teamName && logoSrc) {
            sideLabel.innerHTML = '';
            const img = document.createElement('img');
            img.src = logoSrc;
            img.classList.add(...imageSize.split(' '));
            sideLabel.appendChild(img);
            const div = document.createElement('div');
            div.innerHTML = teamName;
            sideLabel.appendChild(div);
        }
    });
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
    const playerName = document.getElementById('player-name');
    playerName.focus();
}
function initializeNewPlayerForm() {
    const form = document.getElementById('add-player-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const playerName = String(formData.get('player-name')) || '';
        const squareCount = parseInt(String(formData.get('square-count')) || '0');
        if (playerName) {
            addNewPlayer(playerName, squareCount);
            resetPlayerInputForm(form);
        }
    });
    document
        .getElementById('back-to-teams')
        ?.addEventListener('click', function () {
        activateSection('add-teams-parent');
    });
}
function initializeTeamsForm() {
    const form = document.getElementById('add-teams-form');
    if (teamsSelected()) {
        const teams = getTeams();
        const sides = ['home', 'away'];
        initTeamSelect();
        sides.forEach((side) => {
            const teamSelect = form.elements.namedItem(`${side}-team`);
            teamSelect.value =
                teams.find((team) => team.side === side)?.id?.toString() ?? '';
        });
    }
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const homeTeam = form.querySelector('#home-team');
        if (homeTeam.value.length === 0) {
            homeTeam.reportValidity();
            return;
        }
        const awayTeam = form.querySelector('#away-team');
        if (awayTeam.value.length === 0) {
            awayTeam.reportValidity();
            return;
        }
        let teams = [];
        const formData = new FormData(form);
        const selectedTeams = [
            { side: 'home', id: String(formData.get('home-team')) || '0' },
            { side: 'away', id: String(formData.get('away-team')) || '0' },
        ];
        selectedTeams.forEach((selectedTeam) => {
            const team = nflTeams.find((team) => team.id === parseInt(selectedTeam.id));
            if (team) {
                teams.push({ ...team, side: selectedTeam.side });
            }
        });
        setTeams(teams);
        activateSection('add-player-parent');
    });
}
//# sourceMappingURL=main.js.map