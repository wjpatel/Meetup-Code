var gameOfLife = new GameGrid();
var gameStopped = true;

function GameGrid(){
  this.grid = [];
}

GameGrid.prototype.initializeGrid= function(rows, columns){
//function initializeGrid(rows, columns){
	this.grid = [];
	var r;
	for (r=0; r<rows; r++) {
	 var curColumn = [];
	 	var c;
	 	for(c=0; c<columns; c++) {
	 		curColumn.push(0);
	 	}
	 	this.grid.push(curColumn);
	}
}

GameGrid.prototype.flipGridValue= function(row, column){
	if(this.grid[row][column] == 0) {
		this.grid[row][column] = 1;	
	} else {
		this.grid[row][column] = 0;
	}
	this.renderGrid();
}


GameGrid.prototype.getGrid= function(){
  return this.grid;
}

GameGrid.prototype.renderGrid= function(){

	//console.log(this.grid.length);
	var gameTableHTML = document.getElementById("gameTable");
	gameTableHTML.innerHTML = "";
	for (r=0; r<this.grid.length; r++) {
		var rowElement = document.createElement("tr");
		//console.log(rowElement);
		gameTableHTML.appendChild(rowElement);
	 	var c;
	 	for(c=0; c<this.grid[r].length; c++) {
	 		var cellState = this.grid[r][c];
	 		var columnElement = document.createElement("td");

	 		//columnElement.innerHTML = cellState;

	 		// set the class of the td element to control its color
	 		// rather than having innerHTML of 0 or 1
	 		var cellClass = "dead";
	 		if (cellState == 1) {
	 			// it's alive!
	 			cellClass = "alive";
	 		}
	 		columnElement.setAttribute("class", cellClass);
	 		
	 		var cellAtt = document.createAttribute("id");
	 		var cellId = "cell-" + r + "-" + c;
	 		cellAtt.value = cellId;
	 		columnElement.setAttributeNode(cellAtt);
	 		rowElement.appendChild(columnElement);

			document.getElementById(cellId).addEventListener("click", function(e){
				var clickedCellId = e.target.getAttribute("id");
				//console.log("you clicked " + clickedCellId);
				
				// determing row and column value based on id format "cell-r-c"
				var cellIdSegments = clickedCellId.split("-");
				var clickedCellRow = cellIdSegments[1];
				var clickedCellColumn = cellIdSegments[2];
				//console.log("row: " + clickedCellRow);
				//console.log("column: " + clickedCellColumn);

				//update grid
				gameOfLife.flipGridValue(clickedCellRow, clickedCellColumn);
			}, false);
	 	}

	}
}

GameGrid.prototype.tickGeneration= function(){
	//Copy grid for reference
	var gridCopy = [];
	for (r=0; r<this.grid.length; r++) {
		gridCopy.push(this.grid[r].slice());
	}

	//Track whether any live cells were found
	var lifeDiscovered = false;
	//Loop through reference grid and update game grid
	for (r=0; r<gridCopy.length; r++) {
		for(c=0; c<gridCopy[r].length; c++) {
			//calculate number of live neighbors
			var liveNeighbors = 0;
			// for nrp (neighbor row positions) -1 to 1 relative to current cell
			for (nrp=r-1; nrp<=r+1; nrp++) {
				// if this row index is within the grid
				if(nrp >= 0 && nrp < gridCopy.length){
					// for ncp (neighbor column positions) -1 to 1 relative to current cell
					for(ncp=c-1; ncp<=c+1; ncp++) {
						// if this column index is within the grid and 
						if(ncp >= 0 && ncp < gridCopy[r].length){
							// it is not the current cell being evalutated
							if(nrp != r || ncp != c){
								liveNeighbors += gridCopy[nrp][ncp];
							}
								//gridCopy[r-1][c-1]
								//+ gridCopy[r-1][c]
								//+ gridCopy[r-1][c+1]
								//+ gridCopy[r][c-1]
								//+ gridCopy[r][c+1]
								//+ gridCopy[r+1][c-1]
								//+ gridCopy[r+1][c]
								//+ gridCopy[r+1][c+1];
						}
					}
				}
			}
			//console.log("live neighbors of cell " + r + "," + c + " = " + liveNeighbors);

			
			if(this.grid[r][c] == 1) {
				//This cell is alive
				if(liveNeighbors < 2 || liveNeighbors > 3){
					//Any live cell with fewer than two live neighbors dies, as if by under population.
					//Any live cell with more than three live neighbors dies, as if by overpopulation.
					this.grid[r][c] = 0;
				} 
				
				//Any live cell with two or three live neighbors lives on to the next generation.
				
			} else {
				//This cell is dead
				if(liveNeighbors == 3){
					//Any dead cell with exactly three live neighbors becomes a live cell, 
					//as if by reproduction.
					this.grid[r][c] = 1;
				}
			}
		}
		// Check if this row has any living cells
		if(this.grid[r].includes(1)){
			lifeDiscovered = true;
		}
	}
	this.renderGrid();
	// Stop game if no living cells found
	if(!lifeDiscovered){
		gameStopped = true;
		document.getElementById("endOfGameMessage").innerHTML = "Life is extinct.";
	}
}

function registerEvents(){
	document.gameSize.createGame.addEventListener("click",getSizeInputs,false);
	document.getElementById("startGame").addEventListener("click",startGame,false);
	document.getElementById("stopGame").addEventListener("click",stopGame,false);
}

function getSizeInputs(){
	var inputRows = document.gameSize.nRows.value;
	var inputColumns = document.gameSize.nColumns.value;
	gameOfLife.initializeGrid(inputRows,inputColumns);
//	console.log(grid);
	gameOfLife.renderGrid();
}

function startGame(){
	gameStopped = false;
	document.getElementById("endOfGameMessage").innerHTML = " ";
	runGame();
}

function runGame(){
	if(!gameStopped){
		gameOfLife.tickGeneration();
		setTimeout(runGame,1000);
	}
}

function stopGame(){
	gameStopped = true;
}