/**
 * 
 * @assigment Homework 5 GUI 1 - UML
 * Professor: Wenjin Zhou, UMass Lowell Computer Science, wenjin_zhou@uml.edu - Summer 1 2024
 * @file script.js
 * @description This is a scrabble game
 * @version
 * @date start 2024-06-28
 * @author Patricia Antlitz
 * @version 1.0
 * 
 * Copyright (c) 2024 by Patricia Antlitz
 * 
 */

$(document).ready(() => {
    let scrabblePieces = [];
    let droppedTiles = [];
    let submittedWords = [];
    let validWords = 0;
    let invalidWords = 0;
    let totalScore = 0;
    let score = 0;

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

    // Load scrabble pieces data from JSON file
    $.getJSON("graphics_data/pieces.json", (data) => {
        console.log("Loading scrabble pieces data...");
        scrabblePieces = data.pieces;
        initializeGame();
    }).fail(() => {
        console.error("Failed to load scrabble pieces data from JSON.");
    });

    // Button handlers
    $('#submitWord').click(handleWordSubmission);
    $('#resetBoard').click(resetBoard);
    $('#newTiles').click(getNewTiles);

    function initializeGame() {
        loadScrabblePieces();
        loadDroppableTargets();
    }

    function loadScrabblePieces() {
        const baseUrl = "graphics_data/Scrabble_Tiles/Scrabble_Tile_";
        $("#rackTiles").empty(); // Clear any existing tiles

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
                "width": "70px",
                "height": "100%"
            }).draggable();

            gameTiles[i].letter = letter;
        }
    }

    function loadDroppableTargets() {
        const imgUrl = "graphics_data/Scrabble_Blank.png";
        
        for (let i = 0; i < 15; i++) {
            const dropHtml = `<img class="droppable" id="drop${i}" src="${imgUrl}" alt="Drop Zone">`;
            $("#scrabbleBoard").append(dropHtml);

            $(`#drop${i}`).css({
                "position": "relative",
                "left": 0,
                "top": -125 + "px"
            }).droppable({
                drop: function (event, ui) {
                    const draggableId = ui.draggable.attr("id");
                    const droppableId = $(this).attr("id");

                    console.log(`Tile: ${draggableId} - dropped on ${droppableId}`);

                    gameBoard[findBoardPosition(droppableId)].tile = draggableId;
                    findWord();
                    droppedTiles.push({ id: draggableId, letter: findLetter(draggableId), value: findScore(draggableId) });
                    updateScore();
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
                    droppedTiles = droppedTiles.filter(tile => tile.id !== draggableId);
                    findWord();
                    updateScore();
                }
            });
        }
    }

    function findLetter(tileId) {
        for (var i = 0; i < 7; i++) {
            if (gameTiles[i].id == tileId) {
                return gameTiles[i].letter;
            }
        }
        return -1;
    }

    function findBoardPosition(tileId) {
        for (let i = 0; i < 15; i++) {
            if (gameBoard[i].id == tileId) {
                return i;
            }
        }
        return -1;
    }

    function findTilePosition(tileId) {
        for (let i = 0; i < 15; i++) {
            if (gameBoard[i].tile == tileId) {
                return gameBoard[i].id;
            }
        }
        return -1;
    }

    function findScore(tileId) {
        let letter = findLetter(tileId);
        let score = 0;

        for (let i = 0; i < scrabblePieces.length; i++) {
            let obj = scrabblePieces[i];

            if (obj.letter == letter) {
                score = obj.value;

                score += (score * doubleLetter(tileId));
                return score;
            }
        }
        return 0; // Return 0 instead of -1 for better score calculation
    }

    function doubleLetter(tileId) {
        let dropID = findTilePosition(tileId);

        if (dropID == "drop6" || dropID == "drop8") {
            return 1;
        }

        return 0;
    }

    function findWord() {
        let word = "";
        for (let i = 0; i < 15; i++) {
            if (gameBoard[i].tile != "tileX") {
                word += findLetter(gameBoard[i].tile);
            }
        }

        $("#validationMessage").html(word || "____");
    }

    function calculateScore() {
        let wordScore = 0;
        let isDoubleWordScore = false; // Flag to track if we need to double the score
    
        droppedTiles.forEach(tile => {
            wordScore += tile.value;
    
            // doesnt work
            // Check if the tile is on a double word score position (2 or 12)
            if (tile.boardPosition === 2 || tile.boardPosition === 12) {
                isDoubleWordScore = true;
            }
        });
        // Apply the double word score if applicable
        if (isDoubleWordScore) {
            wordScore *= 2;
        }
    
        return wordScore;
    }    

    function updateScore() {
        score = calculateScore();
        $("#score").text(score);
    }

    function validateWord(word) {
        return $.ajax({
            url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
            method: 'GET'
        }).then(function() {
            return true; // The word exists
        }).catch(function() {
            return false; // The word does not exist
        });
    }
    
// Function to handle word submission
function handleWordSubmission() {
    const word = droppedTiles.map(tile => tile.letter).join('');

    // Validate the word using the online dictionary
    validateWord(word).then(isValid => {
        let wordScore = calculateScore();

        $("#validationMessage").text(isValid ? "Valid Word" : "Invalid Word");

        // Record the word submission
        submittedWords.push({ word, isValid, score: wordScore });
        updateSubmittedWordsTable();

        if (isValid) {
            validWords++;
            totalScore += wordScore;
        } else {
            invalidWords++;
        }

        updateGameSummaryTable();
        clearBoard();
        loadScrabblePieces(); // Load new tiles for the next turn
    });
}
   

    function updateSubmittedWordsTable() {
        const tableBody = $("#submittedWords");
        tableBody.empty();

        submittedWords.forEach(entry => {
            const row = $("<tr>");
            row.append($("<td>").text(entry.word));
            row.append($("<td>").text(entry.isValid ? "Yes" : "No"));
            row.append($("<td>").text(entry.score));
            tableBody.append(row);
        });
    }

    function updateGameSummaryTable() {
        const summaryBody = $("#gameSummary");
        summaryBody.empty();

        const row = $("<tr>");
        row.append($("<td>").text(validWords));
        row.append($("<td>").text(invalidWords));
        row.append($("<td>").text(totalScore));
        summaryBody.append(row);
    }

    function clearBoard() {
        droppedTiles = [];
        $(".board .tile").remove();
        updateScore();
        resetValidationMessage();
    }

    function resetValidationMessage() {
        $("#validationMessage").text('');
    }

    function getNewTiles() {
        loadScrabblePieces();
        droppedTiles = [];
        clearBoard();
    }

    function resetBoard() {
        clearBoard();
        submittedWords = [];
        validWords = 0;
        invalidWords = 0;
        totalScore = 0;
        loadScrabblePieces();
        updateSubmittedWordsTable();
        updateGameSummaryTable();
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
});
