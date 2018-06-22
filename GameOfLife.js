var gameOfLife = new GameGrid();
var gameStopped = true;

function GameGrid(){
  this.grid = [];
}

GameGrid.prototype.getCellClassValue = function(stateNumberValue){
	// The class of the td element is used to control its color
	// to indicate alive or dead
	 if (stateNumberValue == 1) {
	 	// it's alive!
	 	return "alive";
	 } else {
	 	return "dead";
	 }
}

GameGrid.prototype.initializeGrid= function(rows, columns){
//function initializeGrid(rows, columns){
	this.grid = [];
	for (let r=0; r<rows; r++) {
	 let curColumn = [];
	 	for(let c=0; c<columns; c++) {
	 		curColumn.push(0);
	 	}
	 	this.grid.push(curColumn);
	}
}

GameGrid.prototype.flipGridValue= function(row, column){
	// Default make it die
	let newValue = 0;
	if(this.grid[row][column] == 0) {
		// Make it live
		newValue = 1;
	} 
	this.grid[row][column] = newValue;	
	return newValue;
}


GameGrid.prototype.getGrid= function(){
  return this.grid;
}

GameGrid.prototype.renderGrid= function(){

	//console.log(this.grid.length);
	let gameTableHTML = document.getElementById("gameTable");
	gameTableHTML.innerHTML = "";
	for (let r=0; r<this.grid.length; r++) {
		let rowElement = document.createElement("tr");
		//console.log(rowElement);
		gameTableHTML.appendChild(rowElement);
	 	for(let c=0; c<this.grid[r].length; c++) {
	 		let cellState = this.grid[r][c];
	 		let columnElement = document.createElement("td");

	 		//columnElement.innerHTML = cellState;

	 		// set the class of the td element to control its color
	 		// rather than having innerHTML of 0 or 1
	 		columnElement.setAttribute("class", this.getCellClassValue(cellState));
	 		
	 		let cellAtt = document.createAttribute("id");
	 		let cellId = "cell-" + r + "-" + c;
	 		cellAtt.value = cellId;
	 		columnElement.setAttributeNode(cellAtt);
	 		rowElement.appendChild(columnElement);

			document.getElementById(cellId).addEventListener("click", function(e){
				let clickedCellId = e.target.getAttribute("id");
				//console.log("you clicked " + clickedCellId);
				
				// determing row and column value based on id format "cell-r-c"
				let cellIdSegments = clickedCellId.split("-");
				let clickedCellRow = cellIdSegments[1];
				let clickedCellColumn = cellIdSegments[2];
				//console.log("row: " + clickedCellRow);
				//console.log("column: " + clickedCellColumn);

				//update grid
				let newGridValue = gameOfLife.flipGridValue(clickedCellRow, clickedCellColumn);

				//Change cell class		
				e.target.setAttribute("class", gameOfLife.getCellClassValue(newGridValue));
				
			}, false);
	 	}

	}
}

GameGrid.prototype.tickGeneration= function(){
	//Copy grid for reference
	let gridCopy = [];
	for (let r=0; r<this.grid.length; r++) {
		gridCopy.push(this.grid[r].slice());
	}

	//Track whether any live cells were found
	let lifeDiscovered = false;
	//Loop through reference grid and update game grid
	for (let r=0; r<gridCopy.length; r++) {
		for(let c=0; c<gridCopy[r].length; c++) {
			//calculate number of live neighbors
			let liveNeighbors = 0;
			// for nrp (neighbor row positions) -1 to 1 relative to current cell
			for (let nrp=r-1; nrp<=r+1; nrp++) {
				// if this row index is within the grid
				if(nrp >= 0 && nrp < gridCopy.length){
					// for ncp (neighbor column positions) -1 to 1 relative to current cell
					for(let ncp=c-1; ncp<=c+1; ncp++) {
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
		document.getElementById("gameStatusMessage").innerHTML = "Life is extinct.";
	}
}

function registerEvents(){
	document.gameSize.createGame.addEventListener("click",getSizeInputs,false);
	document.getElementById("startGame").addEventListener("click",startGame,false);
	document.getElementById("stopGame").addEventListener("click",stopGame,false);
}

function getSizeInputs(){
	let inputRows = document.gameSize.nRows.value;
	let inputColumns = document.gameSize.nColumns.value;
	gameOfLife.initializeGrid(inputRows,inputColumns);
//	console.log(grid);
	gameOfLife.renderGrid();

	document.getElementById("instruction2").removeAttribute("hidden");
	document.getElementById("startGame").removeAttribute("hidden");
	document.getElementById("stopGame").removeAttribute("hidden");
	document.getElementById("gameStatusMessage").innerHTML = "Start when ready.";
	//.removeAttribute("hidden");
}

function startGame(){
	gameStopped = false;
	document.getElementById("gameStatusMessage").innerHTML = "Running simulation.";
	// Make Stop button active
	document.getElementById("startGame").disabled = "disabled";
	document.getElementById("stopGame").disabled = false;
	runGame();
}

function runGame(){
	if(!gameStopped){
		gameOfLife.tickGeneration();
		setTimeout(runGame,1000);
	} else {
		// Make Start button active
		document.getElementById("startGame").disabled = false;
		document.getElementById("stopGame").disabled = "disabled";
	}
}

function stopGame(){
	gameStopped = true;
	document.getElementById("gameStatusMessage").innerHTML = "Game has been stopped.";
}