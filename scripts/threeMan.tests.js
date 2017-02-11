window.threeManGame = window.threeManGame || {};

describe('The Three Man Game - ', function (){
  var game = new window.threeManGame.game();

	it('must exist - ', function(){
    expect(game !== undefined).toBe(true);
	});

  describe('has a rollDice function - ', function(){
    it('that is defined', function(){
      expect(game.rollDice !== undefined).toBe(true);
  	});
    it('that returns a number', function(){
      expect(game.rollDice() !== undefined).toBe(true);
      expect(game.rollDice()).toEqual(jasmine.any(Number));
  	});
    it('that returns a number between one and six', function(){
      expect(game.rollDice() > 0).toBe(true);
      expect(game.rollDice() < 7).toBe(true);
  	});
  });

  describe('has a isSuccessfulRoll function - ', function(){
    beforeEach(function() {
      game = new window.threeManGame.game();
      spyOn(game, 'isSuccessfulRoll').and.callThrough();
    });

    it('that is defined', function(){
      expect(game.isSuccessfulRoll).toBeDefined();
    });

    // it('that returns true when a 1 and a 1 are rolled', function(){
    //   var result = game.isSuccessfulRoll([1,1]);
    //   expect(game.rollResult.isSuccessful).toBe(true);
    //   expect(game.rollResult.message).toBe('Doubles ');
    //   expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,1]);
    // });
    it('that returns true when a 1 and a 2 are rolled', function(){
      var result = game.isSuccessfulRoll([1,2]);
      expect(game.rollResult.isSuccessful).toBe(true);
      expect(game.rollResult.message).toBe('Three Man x2 ');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,2]);
    });
    it('that returns true when a 1 and a 3 are rolled', function(){
      var result = game.isSuccessfulRoll([1,3]);
      expect(game.rollResult.isSuccessful).toBe(true);
      expect(game.rollResult.message).toBe('Three Man ');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,3]);
    });3
    it('that returns true when a 1 and a 4 are rolled', function(){
      var result = game.isSuccessfulRoll([1,4]);
      expect(game.rollResult.isSuccessful).toBe(true);
      expect(game.rollResult.message).toBe('Social ');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,4]);
    });
    it('that returns false when a 1 and a 5 are rolled', function(){
      var result = game.isSuccessfulRoll([1,5]);
      expect(game.rollResult.isSuccessful).toBe(false);
      expect(game.rollResult.message).toBe('');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,5]);
    });
    it('that returns true when a 1 and a 6 are rolled', function(){
      var result = game.isSuccessfulRoll([1,6]);
      expect(game.rollResult.isSuccessful).toBe(true);
      expect(game.rollResult.message).toBe('Seven to the Right ');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,6]);
    });
    it('that returns true when a 5 and a 6 are rolled', function(){
      var result = game.isSuccessfulRoll([5,6]);
      expect(game.rollResult.isSuccessful).toBe(true);
      expect(game.rollResult.message).toBe('Eleven to the Left ');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([5,6]);
    });

    it('that returns true when a 3 and a 4 are rolled', function(){
      var result = game.isSuccessfulRoll([3,4]);
      expect(game.rollResult.isSuccessful).toBe(true);
      expect(game.rollResult.message).toBe('Three Man Seven to the Right ');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([3,4]);
    });
  });

  describe('has a roll function - ', function(){
    beforeEach(function() {
      game = new window.threeManGame.game();
      spyOn(game, 'roll').and.callThrough();
      rollresults = [2,4]
      spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});
      game.roll(2);
    });

     it('that is defined', function(){
      expect(game.roll).toBeDefined();
  	});

    it('that passes in the number of dice to roll', function(){
      expect(game.roll).toHaveBeenCalledWith(2);
  	});

    it('that calls rollDice with 2 as the parameter', function(){
      expect(game.rollDice).toHaveBeenCalled();
      expect(game.rollDice).toHaveBeenCalledTimes(2);
  	});
  });

  describe('has a player object - ', function(){
    it('that is defined', function(){
      expect(game.player).toBeDefined();
    });
    it('that has a drinks property', function(){
      expect(game.player.drinks).toBeDefined();
    });
    it('that has an identity property', function(){
      expect(game.player.identity).toBeDefined();
    });
  });

  describe('has a game object - ', function(){
    it('that has an array of players', function(){
      expect(game.players).toBeDefined();
    });
    it('that has a currentPlayer property', function(){
      expect(game.currentPlayer).toBeDefined();
    });
  });

  describe('the game play - ', function(){
    beforeEach(function() {
      game = new window.threeManGame.game();
      game.currentPlayer(game.players()[0]);
      spyOn(game, 'isSuccessfulRoll').and.callThrough();
    });

    it('player rolls the dice and gets nothing', function(){
      rollresults = [2,4]
      spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});

      var result = game.isSuccessfulRoll([2,4]);
      expect(game.rollResult.isSuccessful).toBe(false);
      expect(game.rollResult.message).toBe('');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([2,4]);
      expect(game.currentPlayer).not.toBe(game.players()[0]);
    });

    it('player rolls the dice and gets a seven to the right, person to the right gets a drink', function(){
      rollresults = [6,1]
      spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});

      var result = game.isSuccessfulRoll([6,1]);
      expect(game.rollResult.isSuccessful).toBe(true);
      expect(game.rollResult.message).toBe('Seven to the Right ');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([6,1]);
      expect(game.currentPlayer()).toBe(game.players()[0]);
      expect(game.players()[1].drinks()).toBe(1);
    });

    it('player rolls the dice and gets an eleven to the left, person to the left gets a drink', function(){
      rollresults = [6,5]
      spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});

      var result = game.isSuccessfulRoll([6,5]);
      expect(game.rollResult.isSuccessful).toBe(true);
      expect(game.rollResult.message).toBe('Eleven to the Left ');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([6,5]);
      expect(game.currentPlayer()).toBe(game.players()[0]);
      expect(game.players()[2].drinks()).toBe(1);
    });

    it('player rolls the dice and gets a social, everyone gets a drink', function(){
      rollresults = [1,4]
      spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});

      var result = game.isSuccessfulRoll([1,4]);
      expect(game.rollResult.isSuccessful).toBe(true);
      expect(game.rollResult.message).toBe('Social ');
      expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,4]);
      expect(game.currentPlayer()).toBe(game.players()[0]);
      expect(game.players()[0].drinks()).toBe(1);
      expect(game.players()[1].drinks()).toBe(1);
      expect(game.players()[2].drinks()).toBe(1);
    });

    describe('three man rules - ', function(){
      it('player rolls the dice and gets a three man and no one has been declared three man', function(){
        rollresults = [1,3]
        spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});
        expect(game.chooseThreeMan).toBeDefined();
        expect(game.declaredThreeMan).toBeDefined();
        expect(game.declaredThreeMan()).toBe(null);
        spyOn(game, 'chooseThreeMan').and.callThrough();
        var result = game.isSuccessfulRoll([1,3]);
        expect(game.currentPlayer()).toBe(game.players()[0]);
        expect(game.chooseThreeMan).toHaveBeenCalled();
        expect(game.declaredThreeMan()).toBe(game.players()[1]);
        expect(game.players()[1].drinks()).toBe(1);
      });

      it('player rolls the dice and gets a three man while not being three man, the person who is threeman gets a drink', function(){
        rollresults = [1,3]
        spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});
        game.declaredThreeMan(game.players()[1]);
        var result = game.isSuccessfulRoll([1,3]);
        expect(game.rollResult.isSuccessful).toBe(true);
        expect(game.rollResult.message).toBe('Three Man ');
        expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,3]);
        expect(game.currentPlayer()).toBe(game.players()[0]);
        expect(game.players()[0].drinks()).toBe(0);
        expect(game.players()[1].drinks()).toBe(1);
      });

      it('player rolls the dice and gets two threes while not being three man, the person who is threeman gets two drinks for three man and seven for the doubles results', function(){
        rollresults = [3,3,5,2]
        spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});
        game.declaredThreeMan(game.players()[1]);
        var result = game.isSuccessfulRoll([3,3]);
        expect(game.rollResult.isSuccessful).toBe(true);
        expect(game.rollResult.message).toBe('Three Man Doubles ');
        expect(game.isSuccessfulRoll).toHaveBeenCalledWith([3,3]);
        expect(game.currentPlayer()).toBe(game.players()[0]);
        expect(game.players()[0].drinks()).toBe(0);
        //expect(game.players()[1].drinks()).toBe(2);
      });

      it('player rolls the dice and gets a one and a two while not being three man, the person who is threeman gets two drinks', function(){
        rollresults = [1,2]
        spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});
        game.declaredThreeMan(game.players()[1]);
        var result = game.isSuccessfulRoll([1,2]);
        expect(game.rollResult.isSuccessful).toBe(true);
        expect(game.rollResult.message).toBe('Three Man x2 ');
        expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,2]);
        expect(game.currentPlayer()).toBe(game.players()[0]);
        expect(game.players()[0].drinks()).toBe(0);
        expect(game.players()[1].drinks()).toBe(2);
      });

      it('player rolls the dice and gets a one and a two while not being three man and three man has not been chosen the roller gets two drinks', function(){
        rollresults = [1,2]
        spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});
        var result = game.isSuccessfulRoll([1,2]);
        expect(game.rollResult.isSuccessful).toBe(true);
        expect(game.rollResult.message).toBe('Three Man x2 ');
        expect(game.isSuccessfulRoll).toHaveBeenCalledWith([1,2]);
        expect(game.currentPlayer()).toBe(game.players()[0]);
        expect(game.players()[0].drinks()).toBe(2);
        expect(game.players()[1].drinks()).toBe(0);
      });

      it('player rolls the dice and gets a three man and is the the declared three man they choose a new three man', function(){
        rollresults = [1,3]
        game.declaredThreeMan(game.currentPlayer());
        spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});
        var result = game.isSuccessfulRoll([1,3]);
        expect(game.currentPlayer()).toBe(game.players()[0]);
        expect(game.declaredThreeMan()).toBe(game.players()[1]);
        expect(game.players()[1].drinks()).toBe(1);
      });
    });

    // describe('doubles rules - ', function(){
    //   it('player rolls the dice and gets a doubles, gives dice to a single opponent', function(){
    //     rollresults = [4,4]
    //     spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});
    //     expect(game.chooseDoublesTarget).toBeDefined();
    //     expect(game.doublesTarget).toBeDefined();
    //     spyOn(game, 'chooseDoublesTarget').and.callThrough();
    //     var result = game.isSuccessfulRoll([4,4]);
    //     expect(game.chooseDoublesTarget).toHaveBeenCalled();
    //     expect(game.doublesTarget()).toBe(game.players()[1]);
    //   });
    //   it ('player rolls doubles, gives dice to single opponent, they dont roll doubles, and drink sum', function() {
    //     rollresults = [4,4,6,1]
    //     spyOn(game, 'rollDice').and.callFake(function(){return rollresults.pop();});
    //     expect(game.chooseDoublesTarget).toBeDefined();
    //     expect(game.doublesTarget).toBeDefined();
    //     spyOn(game, 'chooseDoublesTarget').and.callThrough();
    //     var result = game.isSuccessfulRoll([4,4]);
    //     expect(game.chooseDoublesTarget).toHaveBeenCalled();
    //     expect(game.doublesTarget()).toBe(game.players()[1]);
    //     expect(game.doublesTarget().drinks()).toBe(7);
    //   });
    // });
    // it ('', function() {});
  });
});
