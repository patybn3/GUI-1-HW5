//populate the data from pieces.json
let scrabblePieces = [];
let totalScore = 0;

const gameTiles = [
    { "id": "tile0", "letter": "" },
    { "id": "tile1", "letter": "" },
    { "id": "tile2", "letter": "" },
    { "id": "tile3", "letter": "" },
    { "id": "tile4", "letter": "" },
    { "id": "tile5", "letter": "" },
    { "id": "tile6", "letter": "" }
  ];
  
  const gameBoard = [
    { "id": "drop0", "tile": "tileX" },
    { "id": "drop1", "tile": "tileX" },
    { "id": "drop2", "tile": "tileX" },
    { "id": "drop3", "tile": "tileX" },
    { "id": "drop4", "tile": "tileX" },
    { "id": "drop5", "tile": "tileX" },
    { "id": "drop6", "tile": "tileX" },
    { "id": "drop7", "tile": "tileX" },
    { "id": "drop8", "tile": "tileX" },
    { "id": "drop9", "tile": "tileX" },
    { "id": "drop10", "tile": "tileX" },
    { "id": "drop11", "tile": "tileX" },
    { "id": "drop12", "tile": "tileX" },
    { "id": "drop13", "tile": "tileX" },
    { "id": "drop14", "tile": "tileX" }
  ];

$(document).ready(() => {
    // Load scrabble pieces data from JSON file
    $.getJSON("graphics_data/pieces.json", (data) => {
      console.log("Loading scrabble pieces data...");
      scrabblePieces = data.pieces;
      initializeGame();
    }).fail(() => {
      console.error("Failed to load scrabble pieces data from JSON.");
    });

    $('#submitWord').click(submitWord);
    $('#resetBoard').click(resetBoard);
    $('#newTiles').click(getNewTimes);
  });

  function initializeGame() {
    laodScrabblePieces();
    loadDroppableTargets();
  }

  function laodScrabblePieces(){};

  function loadDroppableTargets(){};