$(document).ready(function()
{
	/*
		canvas info
		- width: 960px
		- height: 540px
	*/

	/****** functions ******/
	/**** isometric functions ****/
	// get pixel coords from grid coords
	var getIsometricPoint = function(gridX, gridY)
	{
		/*
			gridX - grid x value
			gridY - grid y value

			returns:
			Array[0] = pixel x value
			Array[1] = pixel y value
		*/

		var posX = (gridX - gridY) * (perspectiveWidth / 2);
		var posY = (gridX + gridY) * (perspectiveHeight / 2);

		return [posX, posY];
	}

	// get grid coords from pixel coords
	var getGridPoint = function(posX, posY)
	{
		/*
			x - pixel x value
			x - pixel y value

			returns:
			Array[0] = grid x value
			Array[1] = grid y value
		*/

		posX -= gridOriginX;
		posY -= gridOriginY;

		var gridX = Math.floor((posY / perspectiveHeight) + ((posX / perspectiveWidth)));
		var gridY = Math.floor((posY / perspectiveHeight) - ((posX / perspectiveWidth)));

		return [gridX, gridY];
	}

	// get x value of corresponding y value
	var getIsometricX = function(x)
	{
		/*
			x - length

			returns:
			corresponding value to x
		*/

		isometricValue = x / Math.tan(perspectiveAngle * (Math.PI / 180));
		return isometricValue;
	}

	// get y value of corresponding x value
	var getIsometricY = function(x)
	{
		/*
			x - length

			returns:
			corresponding value to x
		*/

		isometricValue = Math.tan(perspectiveAngle * (Math.PI / 180)) * x;
		return isometricValue;
	}


	/**** drawing functions ****/
	// draws a horizontal line
	var drawLine = function(gridX, gridY, gridX2, gridY2, color, lineWidth)
	{
		/*
			gridX - x value on grid where line starts
			gridY - y value on grid where line starts
			gridX2 - x value on grid where line ends
			griY2 - y value on grid where line ends
			color - [optional] rgb color value of line; defaults to rgb(170, 170, 170)
			lineWidth - [optional] width of line, in pixels; defaults to 3
		*/

		context.beginPath();

		context.moveTo(gridOriginX + getIsometricPoint(gridX, gridY)[0], gridOriginY + getIsometricPoint(gridX, gridY)[1]);
		context.lineTo(gridOriginX + getIsometricPoint(gridX2, gridY2)[0], gridOriginY + getIsometricPoint(gridX2, gridY2)[1]);

		context.closePath();
		color = color || '170,170,170';
		context.strokeStyle = 'rgb(' + color + ')';
		lineWidth = lineWidth || 3;
		context.lineWidth = lineWidth;
		context.stroke();
	}

	var drawWall = function(gridX, gridY, gridX2, gridY2, height, color, fill, lineWidth)
	{
		/*
			gridX - x value on grid where line starts
			gridY - y value on grid where line starts
			gridX2 - x value on grid where line ends
			griY2 - y value on grid where line ends
			color - [optional] rgb color value of line; defaults to rgb(170, 170, 170)
			fill - [optional] boolean; fill shape with 40% opacity color
			lineWidth - [optional] width of line, in pixels; defaults to 3
		*/

		context.beginPath();

		context.moveTo(gridOriginX + getIsometricPoint(gridX, gridY)[0], gridOriginY + getIsometricPoint(gridX, gridY)[1]);
		context.lineTo(gridOriginX + getIsometricPoint(gridX2, gridY2)[0], gridOriginY + getIsometricPoint(gridX2, gridY2)[1]);
		context.lineTo(gridOriginX + getIsometricPoint(gridX2, gridY2)[0], gridOriginY + getIsometricPoint(gridX2, gridY2)[1] - gridSpacing);
		context.lineTo(gridOriginX + getIsometricPoint(gridX, gridY)[0], gridOriginY + getIsometricPoint(gridX, gridY)[1] - (height * gridSpacing));
		context.lineTo(gridOriginX + getIsometricPoint(gridX, gridY)[0], gridOriginY + getIsometricPoint(gridX, gridY)[1]);
		
		context.closePath();
		color = color || '170,170,170';
		context.strokeStyle = 'rgb(' + color + ')';
		lineWidth = lineWidth || 3;
		context.lineWidth = lineWidth;
		
		if(fill)
		{
			context.fillStyle = 'rgba(' + color + ', 0.4)';
			context.fill();
		}

		context.stroke();
	}

	// draws a rectangle
	var drawRect = function(gridX, gridY, gridX2, gridY2, color, fill, lineWidth)
	{
		/*
			gridX - x value on grid where rect starts
			gridY - y value on grid where rect starts
			gridX2 - x value on grid where rect ends
			griY2 - y value on grid where rect ends
			color - [optional] rgb color value of line; defaults to rgb(170, 170, 170)
			fill - [optional] boolean; fill shape with 40% opacity color
			lineWidth - [optional] width of rect, in pixels; defaults to 3
		*/

		context.beginPath();

		context.moveTo(gridOriginX + getIsometricPoint(gridX, gridY)[0], gridOriginY + getIsometricPoint(gridX, gridY)[1]);
		context.lineTo(gridOriginX + getIsometricPoint(gridX, gridY2)[0], gridOriginY + getIsometricPoint(gridX, gridY2)[1]);
		context.lineTo(gridOriginX + getIsometricPoint(gridX2, gridY2)[0], gridOriginY + getIsometricPoint(gridX2, gridY2)[1]);
		context.lineTo(gridOriginX + getIsometricPoint(gridX2, gridY)[0], gridOriginY + getIsometricPoint(gridX2, gridY)[1]);
		context.lineTo(gridOriginX + getIsometricPoint(gridX, gridY)[0], gridOriginY + getIsometricPoint(gridX, gridY)[1]);

		context.closePath();
		color = color || '170,170,170';
		context.strokeStyle = 'rgb(' + color + ')';
		lineWidth = lineWidth || 3;
		context.lineWidth = lineWidth;

		if(fill)
		{
			context.fillStyle = 'rgba(' + color + ', 0.4)';
			context.fill();
		}

		context.stroke();
	}

	// draws a grid
	var drawGrid = function(color, lineWidth)
	{
		/*
			color - [optional] rgb color value of line; defaults to rgb(170, 170, 170)
			lineWidth - [optional] width of grid, in pixels; defaults to 3
		*/

		context.beginPath();

		// left top-bottom
		for(var n = 0; (gridOriginY + getIsometricY(gridOriginX) + (n * perspectiveHeight)) < 960; n++)
		{
			context.moveTo(gridOriginX, gridOriginY + (n * perspectiveHeight));
			context.lineTo(0, gridOriginY + getIsometricY(gridOriginX) + (n * perspectiveHeight));
		}

		for(var n = 0; (gridOriginY + getIsometricY(gridOriginX) + (n * perspectiveHeight)) > 0; n--)
		{
			context.moveTo(gridOriginX, gridOriginY + (n * perspectiveHeight));
			context.lineTo(0, gridOriginY + getIsometricY(gridOriginX) + (n * perspectiveHeight));
		}

		// left bottom-top
		for(var n = 0; (gridOriginY - getIsometricY(gridOriginX) + (n * perspectiveHeight)) < 960; n++)
		{
			context.moveTo(0, gridOriginY + (n * perspectiveHeight) - getIsometricY(gridOriginX));
			context.lineTo(gridOriginX, gridOriginY + getIsometricY(gridOriginX) + (n * perspectiveHeight) - getIsometricY(gridOriginX));
		}

		for(var n = 0; (gridOriginY + (n * perspectiveHeight)) > 0; n--)
		{
			context.moveTo(0, gridOriginY + (n * perspectiveHeight) - getIsometricY(gridOriginX));
			context.lineTo(gridOriginX, gridOriginY + getIsometricY(gridOriginX) + (n * perspectiveHeight) - getIsometricY(gridOriginX));
		}

		// right top-bottom
		for(var n = 0; (gridOriginY + getIsometricY(gridOriginX) + (n * perspectiveHeight)) < 960; n++)
		{
			context.moveTo(gridOriginX, gridOriginY + (n * perspectiveHeight));
			context.lineTo(canvas.width(), gridOriginY + getIsometricY(canvas.width() - gridOriginX) + (n * perspectiveHeight));
		}

		for(var n = 0; (gridOriginY + getIsometricY(canvas.width() - gridOriginX) + (n * perspectiveHeight)) > 0; n--)
		{
			context.moveTo(gridOriginX, gridOriginY + (n * perspectiveHeight));
			context.lineTo(canvas.width(), gridOriginY + getIsometricY(canvas.width() - gridOriginX) + (n * perspectiveHeight));
		}

		// right bottom-top
		for(var n = 0; (gridOriginY - getIsometricY(canvas.width() - gridOriginX) + (n * perspectiveHeight)) < 960; n++)
		{
			context.moveTo(canvas.width(), gridOriginY + (n * perspectiveHeight) - getIsometricY(canvas.width() - gridOriginX));
			context.lineTo(gridOriginX, gridOriginY + getIsometricY(canvas.width() - gridOriginX) + (n * perspectiveHeight) - getIsometricY(canvas.width() - gridOriginX));
		}

		for(var n = 0; (gridOriginY + (n * perspectiveHeight)) > 0; n--)
		{
			context.moveTo(canvas.width(), gridOriginY + (n * perspectiveHeight) - getIsometricY(canvas.width() - gridOriginX));
			context.lineTo(gridOriginX, gridOriginY + getIsometricY(canvas.width() - gridOriginX) + (n * perspectiveHeight) - getIsometricY(canvas.width() - gridOriginX));
		}

		context.closePath();
		color = color || '170,170,170';
		context.strokeStyle = 'rgb(' + color + ')';
		lineWidth = lineWidth || 3;
		context.lineWidth = lineWidth;
		context.stroke();
	}


	/**** default functions ****/
	// clears canvas
	var clear = function()
	{
		context.clearRect(0, 0, canvas.width(), canvas.height());
	}

	// main rendering loop
	var gameLoop = function()
	{
		// clear canvas, draw grid
		clear();
		drawGrid('54,54,54');

		// draw grid cursor
		var gridPoint = getGridPoint(mouseLocX, mouseLocY);
		drawRect(gridPoint[0], gridPoint[1], gridPoint[0] + 1, gridPoint[1] + 1, '68,68,68');

		// draw objects
		drawRect(-10, -10, 10, 10, '85,85,85');
		drawWall(0, 0, 3, 0, 1, '67,125,26', true);
		drawWall(0, 0, 0, 3, 1, '67,125,26', true);

		loop = setTimeout(gameLoop, 20);
	}

	// set up canvas
	var canvas = $('canvas#space'), context = canvas.get(0).getContext("2d");

	// graphics variables
	var perspectiveAngle = 30;
	var gridSpacing = 50;
	var perspectiveHeight = (Math.sin(perspectiveAngle * (Math.PI / 180)) * gridSpacing) * 2;
	var perspectiveWidth = (Math.cos(perspectiveAngle * (Math.PI / 180)) * gridSpacing) * 2;

	var gridOriginX = canvas.width() / 2;	// pixel location of (0, 0)
	var gridOriginY = canvas.height() / 2;

	var originMovable = false;
	var mouseX, mouseY, mouseLocX, mouseLocY;

	/* game variables and arrays */
	
	/*var ship = function(x, y ,r)
	{
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.speed = speed;
	};*/

	// checks mouse click
	$('canvas#space').click(function(e)
	{
		if(originMovable)
		{
			originMovable = false;
		}
		else
		{
			originMovable = true;
			mouseX = e.offsetX - gridOriginX;
			mouseY = e.offsetY - gridOriginY;
		}
	});

	// checks mouse move
	$('canvas#space').mousemove(function(e)
	{
		// move origin on cmd down
		if(originMovable)
		{
			gridOriginX = e.offsetX - mouseX;
			gridOriginY = e.offsetY - mouseY;
		}

		mouseLocX = e.offsetX;
		mouseLocY = e.offsetY;
	});

	gameLoop();
});