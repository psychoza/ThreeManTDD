window.threeManGame = window.threeManGame || {};

describe('The Three Man Game - ', function (){
  var game = new window.threeManGame.game();

	it('must exist - ', function(){
    expect(game !== undefined).toBe(true);
	});

  it('must have a roll method - ', function(){
    expect(game.roll).toBeDefined();
  });

  // it ('', function() {});
});
