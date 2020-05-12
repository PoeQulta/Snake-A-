function update()
{
	var nextMove = (moveList!=null)? moveList[0]:null;
	if (nextMove!=null)
	{
		var moveX = nextMove.coordinates[0]-snake.bits[0][0];
		var moveY = nextMove.coordinates[1]-snake.bits[0][1];
		moveX = moveX>gridNum-1? -1:moveX%gridNum 
		moveY = moveY>gridNum-1? -1:moveY%gridNum 
		var direction = [moveX,moveY];
		if (direction[0]!=0 || direction[1]!=0)
			snake.direction = direction;
	}

	if (snake.bits.length == gridNum*gridNum)
		console.log("exceded Grid");
	snake.move(fruit);
	snake.updateSelf();
	if (snake.bits[0][0] == fruit.location[0] && snake.bits[0][1] == fruit.location[1])
		fruitEaten();
	if (moveList!=null)
		moveList.shift();
}
function fruitEaten()
{
	fruit = new Fruit(snake,gridSize);
	pathAI = new A_Star(snake.bits[0],fruit.location,snake);
	fruit.drawSelf();
	moveList = pathAI.FindPath();
	console.log(moveList);
}
function DrawGrid(lineThickness=4)
{
	ctx.fillStyle = "#171717";
	ctx.beginPath();
	ctx.rect(0,0,800,800);
	ctx.fill();
	ctx.strokeStyle = "#2e2e2e";
	ctx.lineWidth = lineThickness;
	/*
	for (var x = canvas.width; x >= 0; x-=gridSize)
	{
		ctx.moveTo(x,0);
		ctx.lineTo(x,800);
		ctx.stroke();
	}
	for (var y = canvas.height; y >= 0; y-=gridSize)
	{
		ctx.moveTo(0,y);
		ctx.lineTo(800,y);
		ctx.stroke();
	}
	*/
}
function onPress(event)
{
	if(event.keyCode == 65 && snake.direction[0] !=1)
		snake.direction = [-1,0]
	
	if(event.keyCode == 68 && snake.direction[0] !=-1)
		snake.direction = [1,0]

	if(event.keyCode == 87 && snake.direction[1] !=1)
		snake.direction = [0,-1]

	if(event.keyCode == 83 && snake.direction[1] !=-1)
		snake.direction = [0,1]
	
}
var canvas = document.createElement('canvas');
var gridNum = 16;
var gridSize=800/gridNum;
canvas.width = canvas.height = 800;
var ctx = canvas.getContext('2d');
var speed = 100;
var holder = document.getElementById("canvasContainer");
holder.appendChild(canvas);
var snake = new Snake(gridSize);
DrawGrid();
document.addEventListener('keydown',onPress);
snake.drawSelf();
var state = Math.floor(Math.random()*(0x80000000-1))
var fruit = new Fruit(snake,gridSize);
var graph = [];
var pathAI = new A_Star(snake.bits[0],fruit.location,snake);
var moveList = pathAI.FindPath();
var timer = setInterval(update,speed);
//console.log(new Node([5,5],{g:-1},[10,10]));
