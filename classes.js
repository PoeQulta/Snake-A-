function RandInt(start,end)
	{
		m = 0x80000000;
		a = 5;
		c = 123;
		var range = end - start;
		state = (a * state + c) % m;
		var float = state / (m - 1); 
		return start + Math.floor(float*range);
	}
class Fruit
{
	constructor(snake,gridSize)
	{
		this.gridSize = gridSize;
		this.location = [RandInt(0,gridNum-1),RandInt(0,gridNum-1)];
		var location = this.location;
		while(snake.bits.map(function(o){  return (o[0] == location[0] && o[1] == location[1])}).includes(true))
		{
			console.log(snake.bits.map(function(o){  return (o[0] == location[0] && o[1] == location[1])}).includes(true));
			this.location = [RandInt(0,gridNum-1),RandInt(0,gridNum-1)];
			location = this.location;
		}

		ctx.fillStyle = "#03cc00";
		ctx.beginPath();
		ctx.rect(this.location[0]*this.gridSize,this.location[1]*this.gridSize,this.gridSize,this.gridSize);
		ctx.fill();
	}
	drawSelf()
	{
		ctx.fillStyle = "#03cc00";
		ctx.beginPath();
		ctx.rect(this.location[0]*this.gridSize,this.location[1]*this.gridSize,this.gridSize,this.gridSize);
		ctx.fill();
	}

}
class Snake
{
	constructor(gridSize)
	{
		this.size = 1;
		this.bits = [[3,3],[3,4],[3,5]];
		this.direction = [0,-1];
		this.prevDir = [0,-1];
		this.gridSize = gridSize;
		this.oldBit = [];
	}
	move(fruit)
	{

		var direction = this.direction;
		var newBit = this.bits[0].map(function (num,id){return (num+direction[id])>=0? (num+direction[id])%gridNum:gridNum+(num+direction[id])%gridNum});
		if (this.bits.map(function(o){  return (o[0] == newBit[0] && o[1] == newBit[1])}).includes(true))
		{
			location.reload();
		}
		else
		{
			if (newBit[0] != fruit.location[0] || newBit[1] != fruit.location[1])
				this.oldBit = this.bits.pop();
			else
				fruit = new Fruit(this,gridSize);
			this.bits.unshift(newBit);
			return fruit;
		}
	}
	drawSelf()
	{
		ctx.fillStyle = "#028a00";
		for (var i = this.bits.length - 1; i >= 0; i--) 
		{
			var thisBit = this.bits[i];
			ctx.beginPath();
			ctx.rect(thisBit[0]*this.gridSize,thisBit[1]*this.gridSize,this.gridSize,this.gridSize);
			ctx.fill();
		}
	}
	updateSelf()
	{
		ctx.fillStyle = "#2e2e2e";
		ctx.beginPath();
		ctx.rect(this.oldBit[0]*this.gridSize,this.oldBit[1]*this.gridSize,this.gridSize,this.gridSize);
		ctx.fill();
		ctx.fillStyle = "#171717";
		ctx.beginPath();
		ctx.rect((this.oldBit[0]*this.gridSize)+2,(this.oldBit[1]*this.gridSize)+2,this.gridSize-4,this.gridSize-4);
		ctx.fill();
		ctx.fillStyle = "#028a00";
		ctx.beginPath();
		ctx.rect(this.bits[0][0]*this.gridSize,this.bits[0][1]*this.gridSize,this.gridSize,this.gridSize);
		ctx.fill();

	}
}
class Edge
{
	constructor(nodeOne,nodeTwo,weight=1)
	{
		this.nodeOne = nodeOne;
		this.nodeTwo = nodeTwo;
		weight = weight;
	}
}
class Node
{
	constructor(coordinates,parent,goal)
	{
		this.coordinates = coordinates;
		this.goal = goal;
		this.parent = parent;
		this.successors = [];
		var deltaX = Math.abs(goal[0]-this.coordinates[0])
		deltaX = deltaX>0.5*gridNum? gridNum-deltaX:deltaX;
		var deltaY = Math.abs(goal[1]-this.coordinates[1])
		deltaY = deltaY>0.5*gridNum? gridNum-deltaY:deltaY;
		this.h = deltaX+deltaY;
		this.g = parent.g + 1;
		this.f = this.h + this.g;
	}
	getSuccessors(blockedCoords)
	{
		
		this.successors = [];
		var coordinates = this.coordinates;
		var childrenCoords = [[coordinates[0]+1>gridNum-1? 0:coordinates[0]+1,coordinates[1]],
		[coordinates[0],coordinates[1]+1>gridNum-1? 0:coordinates[1]+1],
		[coordinates[0]-1<0? gridNum:coordinates[0]-1,coordinates[1]],
		[coordinates[0],coordinates[1]-1<0? gridNum:coordinates[1]-1]]
		for (var i = childrenCoords.length - 1; i >= 0; i--) {
			var coords = childrenCoords[i];
			var node = new Node(coords,this,this.goal);
			if (blockedCoords.find(o => o[0] == node.coordinates[0] && o[1] == node.coordinates[1]) != undefined)
				node.f = Infinity;
			this.successors.push(node);
		}
		//console.log(this.successors);
	}
}
class A_Star
{
	constructor(start,end)
	{
		var StartNode = new Node(start,{g:-1},end);
		this.openList = [StartNode];
		this.closedList = [];
		this.goal = end;
	}
	FindPath(blockedCoords)
	{
		var currNode
		var minimumF
		while(this.openList.length !=0)
		{
			minimumF = Math.min(...this.openList.map(node => node.f));
			currNode = this.openList.find(node => node.f == minimumF);
			currNode.getSuccessors(blockedCoords);
			
			for (var i = currNode.successors.length - 1; i >= 0; i--) 
			{
				var node = currNode.successors[i];
				if (node.coordinates[0] == this.goal[0] &&node.coordinates[1] == this.goal[1])
					return this.getNextMove(node);
				else
				{
					var openDuplicate = this.openList.find(o => o.coordinates[0] == node.coordinates[0] && o.coordinates[1] == node.coordinates[1]);
					openDuplicate = (openDuplicate!=null && openDuplicate.f<node.f);
					var closedDuplicate = this.closedList.find(o => o.coordinates[0] == node.coordinates[0] && o.coordinates[1] == node.coordinates[1]);
					closedDuplicate = (closedDuplicate!=null && closedDuplicate.f<node.f);
					if(!openDuplicate && !closedDuplicate)
					{
						this.openList.push(node);
					}
				}
			}
			this.closedList.push(currNode);
			this.openList.splice(this.openList.indexOf(currNode),1);
		}
		return null;
	}
	getNextMove(node)
	{
		while (true)
		{
			var parent = node.parent;
			if (parent.parent.g == -1)
				return node;
			else
				node = node.parent;
		}
	}
}