$(document).ready(() => {
    // Load scrabble pieces data from JSON file
    $.getJSON("graphics_data/pieces.json", (data) => {
      console.log("Loading scrabble pieces data...");
      scrabblePieces = data.pieces;
      initializeGame();
    }).fail(() => {
      console.error("Failed to load scrabble pieces data from JSON.");
    });
  });