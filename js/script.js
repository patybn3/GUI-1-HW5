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

  function findWord() {
    let word = "";
    let wordScore = 0;
    let doubleWordScore = false;
  
    gameBoard.forEach((slot, index) => {
      if (slot.tile !== "tileX") {
        const letter = findLetter(slot.tile);
        word += letter;
        let letterScore = findScore(slot.tile);
  
        // Check if the tile is on a double letter score
        if (index === 2 || index === 8) {
          letterScore *= 2;
        }
  
        wordScore += letterScore;
  
        // Check if the tile is on a double word score
        if (index === 6 || index === 12) {
          doubleWordScore = true;
        }
      }
    });
  
    // Apply double word score if applicable
    if (doubleWordScore) {
      wordScore *= 2;
    }
  
    // Update total score and display it
    totalScore += wordScore;
    $("#score").html(totalScore);
    $("#validationMessage").html(word || "____");
  }
  
  function findScore(tileId) {
    const letter = findLetter(tileId);
    const piece = scrabblePieces.find(piece => piece.letter === letter);
    return piece ? piece.value : 0;
  }
  
  function findLetter(tileId) {
    const tile = gameTiles.find(tile => tile.id === tileId);
    return tile ? tile.letter : "";
  }
  
  function findBoardPosition(dropId) {
    return gameBoard.findIndex(slot => slot.id === dropId);
  }
  
  function findTilePosition(tileId) {
    const slot = gameBoard.find(slot => slot.tile === tileId);
    return slot ? slot.id : -1;
  }
  
  function loadScrabblePieces() {
    const baseUrl = "graphics_data/Scrabble_Tile_";
  
    for (let i = 0; i < 7; i++) {
      let randomNum;
      let letter;
  
      do {
        randomNum = getRandomInt(0, scrabblePieces.length - 1);
        letter = scrabblePieces[randomNum].letter;
      } while (scrabblePieces[randomNum].amount === 0);
  
      scrabblePieces[randomNum].amount--;
  
      const pieceHtml = `<img class="tile" id="tile${i}" src="${baseUrl}${letter}.jpg" alt="${letter}">`;
      $("#rackTiles").append(pieceHtml);
  
      $(`#tile${i}`).css({
        "position": "absolute",
        "left": (50 * i) + "px",
        "top": "0px"
      }).draggable();
  
      gameTiles[i].letter = letter;
    }
  }
  
  function loadDroppableTargets() {
    const imgUrl = "graohics_data/Scrabble_Blank.png";
    
    // for (let i = 0; i < 15; i++) {
    const dropHtml = `<img class="droppable" id="drop${i}" src="${imgUrl}" alt="Drop Zone">`;
    $("#scrabbleBoard").append(dropHtml);
  
      $(`#drop${i}`).css({
        
      }).droppable({
        drop: function (event, ui) {
          const draggableId = ui.draggable.attr("id");
          const droppableId = $(this).attr("id");
  
          console.log(`Tile: ${draggableId} - dropped on ${droppableId}`);
  
          gameBoard[findBoardPosition(droppableId)].tile = draggableId;
          findWord();
        },
        out: function (event, ui) {
          const draggableId = ui.draggable.attr("id");
          const droppableId = $(this).attr("id");
  
          if (draggableId !== gameBoard[findBoardPosition(droppableId)].tile) {
            console.log("FALSE ALARM DETECTED.");
            return;
          }
  
          console.log(`Tile: ${draggableId} - removed from ${droppableId}`);
          gameBoard[findBoardPosition(droppableId)].tile = "tileX";
          findWord();
        }
      });
    // }
  }
  
  function submitWord() {
    // Functionality to submit the word
    console.log("Word submitted");
  }
  
  function resetBoard() {
    // Functionality to reset the board
    console.log("Board reset");
  }
  
  function getNewTiles() {
    // Functionality to get new tiles
    console.log("New tiles generated");
  }
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  