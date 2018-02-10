var game = function() {

  // private methods/properties
  var private = {};

  private.PLAYGROUND_WIDTH = 600;
  private.PLAYGROUND_HEIGHT = 400;

  private.status = -1;
  var get = function(key) {
    return private[key];
	};

	var set = function(key, val) {
    private[key] = val;
  };

// public methods/properties
  return {
  init: function() {
    $("#pause").hide();
    $("#playground").playground({
    height: get('PLAYGROUND_HEIGHT'),
		width: get('PLAYGROUND_WIDTH'),
		refreshRate: 30
  });

	$.playground().addSprite('playerLeft', {
    animation: new $.gameQuery.Animation({
      imageURL:"./blank.gif" }),
      width: 10,
      height: 50
    });
	$.playground().addSprite('playerRight', {
	  animation: new $.gameQuery.Animation({
      imageURL:"./blank.gif" }),
			width: 10,
			height: 50
    });
    this.initBall();
		this.initPlayers();

		$('#playerLeft').get(0).gameQuery.score = 0;
		$('#playerRight').get(0).gameQuery.score = 0;

		var classObj = this;
		$.playground().registerCallback(function() {

    var status = get('status');

		if (status > 0) {
		// game is running
      $("#ball").collision('.player').each(function(){
        $("#ball").get(0).gameQuery.velX = -$('#ball').get(0).gameQuery.velX;
      });
    classObj.renderBall();
  }
		}, 30);},

		initBall: function() {
		$('#ball').remove();
    $.playground().addSprite('ball', {
      animation: new $.gameQuery.Animation({
        imageURL:"./blank.gif"
							}),
							width: 10,
							height: 10
						});

						// how fast should the ball move (just variables, used in renderBall() funtion)
						$('#ball').get(0).gameQuery.velX = 3;
						$('#ball').get(0).gameQuery.velY = 4;

						// set the ball to center at the beginning
						$('#ball').xy(get('PLAYGROUND_WIDTH')/2, get('PLAYGROUND_HEIGHT')/2);
					},
					initPlayers: function() {
						var playerLeft = $('#playerLeft');
						playerLeft.addClass('player');
						playerLeft.xy(10, get('PLAYGROUND_HEIGHT')/2-playerLeft.height());

						var playerRight = $('#playerRight');
						playerRight.addClass('player');
						playerRight.xy(get('PLAYGROUND_WIDTH')-20, get('PLAYGROUND_HEIGHT')/2-playerRight.height());
					},
					renderBall: function() {

						var ballPosition = $('#ball').xy();

						ballPosition.x += $('#ball').get(0).gameQuery.velX;
						ballPosition.y += $('#ball').get(0).gameQuery.velY;

						if (ballPosition.y <= 0 || ballPosition.y+$('#ball').height() >= get('PLAYGROUND_HEIGHT')) {
							$('#ball').get(0).gameQuery.velY = -$('#ball').get(0).gameQuery.velY;
						}

						$('#ball').xy(ballPosition.x, ballPosition.y);

						if (ballPosition.x <= 0) {
							$('#playerRight').get(0).gameQuery.score++;
							this.restart();
						}

						if (ballPosition.x+$('#ball').width() >= get('PLAYGROUND_WIDTH')) {
							$('#playerLeft').get(0).gameQuery.score++;
							this.restart();
						}

					},
					renderScores: function() {
						$('#scoreLeft').text( $('#playerLeft').get(0).gameQuery.score );
						$('#scoreRight').text( $('#playerRight').get(0).gameQuery.score );
					},
					movePlayer: function(player, dir){
						if (get('status') == 1) {
							var pos = $(player).position();
							var newPos = pos.top + dir;
							if (newPos > 0 && newPos+$(player).height() < get('PLAYGROUND_HEIGHT')) {
								// move the player if within gamearea
								$(player).y(newPos);
							}
						}
					},
					keyDownHandler: function(evt) {
						// console.log(evt);
						var thisObj = this;
						switch(evt.keyCode) {
							case 13:
								if (get('status') == -1) {
									this.start();
								} else {
									this.pause();
								}
								break;
							case 38:
								if (! this.moveRightInt) {
									this.moveRightInt = window.setInterval( function() { thisObj.movePlayer('#playerRight', -4); }, 20);
								}
								break;
							case 40:
								if (! this.moveRightInt) {
									this.moveRightInt = window.setInterval( function() { thisObj.movePlayer('#playerRight', 4); }, 20);
								}
								break;
							case 81:
								if (! this.moveLeftInt) {
									this.moveLeftInt = window.setInterval( function() { thisObj.movePlayer('#playerLeft', -4); }, 20);
								}
								break;
							case 65:
								if (! this.moveLeftInt) {
									this.moveLeftInt = window.setInterval( function() { thisObj.movePlayer('#playerLeft', 4); }, 20);
								}
								break;
						}
					},
					keyUpHandler: function(evt) {
						switch(evt.keyCode) {
							case 38:
							case 40:
								window.clearInterval(this.moveRightInt);
								this.moveRightInt = null;
								break;
							case 81:
							case 65:
								window.clearInterval(this.moveLeftInt);
								this.moveLeftInt = null;
						}

					},
					restart: function() {
						this.pause();
						this.renderScores();
						this.initBall();
						this.initPlayers();
					},
					start: function() {
						if (get('status') == -1) {
							set('status', 1);
							$.playground().startGame(function(){
								$("#welcome").remove();
							});
						}
					},
					pause: function() {
						var status = get('status');
						if (status == 1) {
							status = 0;
							$("#pause").show();
						} else if (status == 0) {
							status = 1;
							$("#pause").hide();
						}
						set('status', status);
					}
				};

			}();


			$(function(){
				game.init();

				$('#welcome span').click(function(){
					game.start();
				});

				$(document).keydown(function(evt){
					game.keyDownHandler(evt);
				});
				$(document).keyup(function(evt){
					game.keyUpHandler(evt);
				});
			});
