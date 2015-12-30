var renderer;
var stage;
var width;
var height;

var logoTexture = null;
var logoSprite  = null;

var color = '#e8a20d';
var scrollingText =   "Episode I\n\n"
					+ "THE   PHANTOM   MENACE\n\n"
					+ "Turmoil     has     engulfed    the\n"
					+ "Galactic Republic. The taxation\n"
					+ "of trade routes to outlying star\n"
					+ "systems is in dispute.                \n\n"
					+ "Hoping  to  resolve  the  matter\n"
					+ "with   a   blockade    of    deadly\n"
					+ "battleships,  the  greedy  Trade\n"
					+ "Federation   has    stopped    all\n"
					+ "shipping   to   the  small  planet\n"
					+ "of Naboo.                                       \n\n"
					+ "While   the    Congress    of   the\n"
					+ "Republic     endlessly    debates\n"
					+ "this  alarming  chain of  events,\n"
					+ "the   Supreme   Chancellor   has\n"
					+ "secretly  dispatched   two   Jedi\n"
					+ "Knights,     the     guardians    of\n"
					+ "peace     and     justice    in    the\n"
					+ "galaxy, to  settle the  conflict....";
					
var textSprite  = null;

var logoBaseWidth   = 1000;
var logoBaseHeight  = 428;
var pixelRatio  = 1;
var screenRatio = 1;

function init() {
	renderer = PIXI.autoDetectRenderer(800, 600, {
		backgroundColor : 0x4080a0,
        transparent : true
	});
	document.body.appendChild(renderer.view);	
	
	stage = new PIXI.Container();
};

function resizeStage() {
	pixelRatio  = (window.devicePixelRatio ? window.devicePixelRatio : window.screen.deviceXDPI / window.screen.logicalXDPI) || 1;
	pixelRatio  = (window.devicePixelRatio ? window.devicePixelRatio : window.screen.deviceXDPI / window.screen.logicalXDPI) || 1;
	width       = window.innerWidth  * pixelRatio;
	height      = window.innerHeight * pixelRatio;
	
	if (width > height) {
		screenRatio = width / height;
	} else {
		screenRatio = height / width;
	}

	renderer.resize(width, height);
	renderer.view.style.width  = width  / pixelRatio + 'px';
	renderer.view.style.height = height / pixelRatio + 'px';
};

function animate(time) {
    requestAnimationFrame(animate);
	TWEEN.update(time);
    renderer.render(stage);
};

function createStarWarsLogo() {
	var scale = width / logoBaseWidth;
	var logo = new Logo(scale);
	logo.draw();
	logoTexture = PIXI.Texture.fromCanvas(logo.canvas);
	logo.destroy();
		
	logoSprite = new PIXI.Sprite(logoTexture);
	logoSprite.anchor.x = 0.5;
	logoSprite.anchor.y = 0.5;
	logoSprite.position.x = width  / 2;
	logoSprite.position.y = height / 2;
	logoSprite.scale.x = logoSprite.scale.y = 1.33;

	stage.addChild(logoSprite);
};

function createScrollingText() {
	var style = {
		font : Math.floor(width / 9) + 'px myFont',
		fill : color,
		align : 'center'
	};	
	
	textSprite = new PIXI.Text(scrollingText, style);
	textSprite.anchor.x = 0.5;
	textSprite.anchor.y = 0;
	textSprite.position.x = width / 2;
	textSprite.position.y = height;
	
	stage.addChild(textSprite);
};

function animateStarWarsLogo(callback) {
	var scale1 = 0.05;
	var scale2 = 0.048;
	
	var f = {
		scale : logoSprite.scale.x
	}
	var t = {
		scale : scale1
	}
	
	var tween = new TWEEN.Tween(f)
		.to(t, 5000)
		.easing(TWEEN.Easing.Quadratic.Out)
		.onUpdate(function() {
			logoSprite.scale.x = f.scale;
			logoSprite.scale.y = f.scale;
		})
		.start();

	var f2 = {
		scale : scale1,
		alpha : 1
	}
	var t2 = {
		scale : scale2,
		alpha : 0
	}
	
	var tween2 = new TWEEN.Tween(f2)
		.to(t2, 500)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate(function() {
			logoSprite.scale.x = f2.scale;
			logoSprite.scale.y = f2.scale;
			logoSprite.alpha   = f2.alpha;
		})
		.onComplete(function() {
			if (callback) {
				callback.call();
			}
		})
		
		tween.chain(tween2);
		tween.start();		
};

function animateScrollingText() {
	var f = {
		posY : height
	}
	var t = {
		posY : 0 - textSprite.height
	}
	
	var tween = new TWEEN.Tween(f)
		.to(t, 50000)
		.easing(TWEEN.Easing.Linear.None)
		.repeat( Infinity )
		.onUpdate(function() {
			textSprite.position.y = f.posY;
		})
		.start();	
};

function setCanvasPerspective(a, b) {
	var str = "perspective(" + a + "px)" + " rotateX(" + b + "deg)";
	
	renderer.view.style.transform       = str;
	renderer.view.style.webkitTransform = str;
	renderer.view.style.MozTransform    = str;
	renderer.view.style.msTransform     = str;
	renderer.view.style.OTransform      = str;
};

function loadFont(fntUrl, fntName) {
	var font = new Font();
	font.fontFamily = fntName;
	
	font.onload = function() {
		console.log('Font loaded');
		onAssetsLoaded();
	};
	font.onerror = function(msg) { 
		console.log(msg);
		onAssetsLoaded();		
	};
	
	font.src = fntUrl;	
};

function onAssetsLoaded() {
	createStarWarsLogo();
	createScrollingText();
	
	animate();
	
	animateStarWarsLogo(function() {
		setCanvasPerspective(screenRatio, screenRatio / ( (width > height) ? (height / width)  : (width / height ) ) / 50 * screenRatio );
		animateScrollingText();
	});	
};

window.onload = function() {
	init();
	resizeStage();
	setCanvasPerspective(0, 0);	
	
	loadFont('assets/fonts/leaguegothic.ttf', 'myFont');
}