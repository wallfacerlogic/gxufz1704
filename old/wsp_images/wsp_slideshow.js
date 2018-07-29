// RocketCake Slideshow implementation
// (c) by Nikolaus Gebhardt / Ambiera e.U.
// parameters:
// imageArr: Array of urls to the images to be shown
function wsp_slideshow(elementid, imageArr, animationMode, timeForFrame, timeForFade, adjustMode)
{
	var maindiv = document.getElementById(elementid);
	if (!maindiv)
		return;
				
	// dummy image for keeping aspect ratio of slideshow in height=auto mode
	
	if (imageArr.length > 0)
	{
		var dummyelem = document.createElement('img');
		dummyelem.src = imageArr[0];
		dummyelem.style.position = 'relative';
		dummyelem.style.display = 'block';
		dummyelem.style.width = '100%'; 
		try { dummyelem.style.opacity = "0.0"; } catch(e) {} // hide
		maindiv.appendChild(dummyelem);	
	}
		
	// load and place images
	
	this.images = new Array();
	
	for (var i=0; i<imageArr.length; ++i)
	{
		var imgelem = document.createElement('img');
		imgelem.src = imageArr[i];
		imgelem.style.position = 'absolute';
		imgelem.style.top = '0';
		imgelem.style.left = '0';
		
		switch(adjustMode)
		{
		case null:
			break;
		case 'width':
			imgelem.style.width = '100%'; 
			break;
		case 'height':
			imgelem.style.height = '100%'; 
			break;
		}
			
		imgelem.style.display = i == 0 ? 'block' : 'none';
		maindiv.appendChild(imgelem);
		
		this.images.push(imgelem);
	}
	
	// start timer to fade in and out images
	
	if (imageArr.length < 2)
		return;
	if (timeForFrame == null)
		timeForFrame = 1000;
		
	if (timeForFade == null)
		timeForFade = timeForFrame * 0.25;
	if (timeForFade > timeForFrame * 0.5)
		timeForFade = timeForFrame * 0.5;
		
	this.timeForFrame = timeForFrame;
	this.timeForFade = timeForFade;
	this.currentFrame = 0;
	this.lastShownFrame = -1;
	this.thisFrameBegin = this.getTimeMs();
	this.animationMode = animationMode;
	
	var me = this;
	mytimeout = setInterval(function(){ me.onFrame(); }, 50);
}


wsp_slideshow.prototype.calculateFade = function(now)
{
	// calculate animation values
	
	var fadeintime = now - this.thisFrameBegin;
	
	var currentImageAlpha = 1.0;
	var lastImageAlpha = 1.0;
		
	if (this.animationMode != 'none' && fadeintime >= 0 && fadeintime <= this.timeForFade)
	{		
		if (fadeintime != 0)
			currentImageAlpha = fadeintime / this.timeForFade;
		else
			currentImageAlpha = 0;
			
		lastImageAlpha = 1.0 - currentImageAlpha;		
	}
	else
	{
		lastImageAlpha = 0;
		currentImageAlpha = 1;
	}
	
	// now do animation
	
	if (this.animationMode == 'slide')
	{
		// animation mode: slide
		
		this.images[this.currentFrame].style.left = 100 - Math.floor(currentImageAlpha * 100) + "%";
		if (this.lastShownFrame != -1)
			this.images[this.lastShownFrame].style.left = 0 - Math.floor(currentImageAlpha * 100) + "%";
	}
	else
	{
		// animation mode: fade or nothing
		
		this.setAlpha(currentImageAlpha, this.images[this.currentFrame]);
	
		if (this.lastShownFrame != -1)
			this.setAlpha(lastImageAlpha, this.images[this.lastShownFrame]);
	}
}


wsp_slideshow.prototype.onFrame = function()
{
	var now = this.getTimeMs();
	var delta = now - this.thisFrameBegin;
	if (delta > this.timeForFrame)
	{
		// switch to next frame
		this.thisFrameBegin = now;
		this.gotoNextFrame();
	}
	else
		this.calculateFade(now);
}	

wsp_slideshow.prototype.setAlpha = function(alpha, img)
{
	img.style.filter="Alpha(Opacity="+(alpha*100)+")";
	img.style.MozOpacity = alpha;
	img.style.opacity = alpha;
}


wsp_slideshow.prototype.getTimeMs = function()
{
	return (new Date()).getTime();
}

wsp_slideshow.prototype.gotoNextFrame = function()
{
	if (this.lastShownFrame != -1)
		this.images[this.lastShownFrame].style.display = 'none';
		
	this.lastShownFrame = this.currentFrame;
	++this.currentFrame;
	if (this.currentFrame >= this.images.length)
		this.currentFrame = 0;
		
	this.images[this.currentFrame].style.display = 'block';
	this.images[this.lastShownFrame].style.display = 'block';
	this.thisFrameBegin = this.getTimeMs();
	this.calculateFade(this.thisFrameBegin);
}

wsp_slideshow.prototype.gotoPreviousFrame = function()
{
	if (this.lastShownFrame != -1)
		this.images[this.lastShownFrame].style.display = 'none';
		
	this.lastShownFrame = this.currentFrame;
	--this.currentFrame;
	if (this.currentFrame < 0)
		this.currentFrame = this.images.length - 1;
		
	this.images[this.currentFrame].style.display = 'block';
	this.images[this.lastShownFrame].style.display = 'block';
	this.thisFrameBegin = this.getTimeMs();
	this.calculateFade(this.thisFrameBegin);
}
