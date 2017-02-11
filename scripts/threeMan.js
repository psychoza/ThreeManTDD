(function(tmg) {
    tmg.game = function() {
        var self = this;
        self.players = ko.observableArray(null);
        self.currentPlayer = ko.observable(null);
        self.declaredThreeMan = ko.observable(null);
        self.doublesTarget = ko.observable(null);

        var playerOne = {
          identity: 1,
          firstName: 'Player One',
          drinks: ko.observable(0),
          position: self.players().length
        };
        self.players().push(playerOne);

        var playerTwo = {
          identity: 2,
          firstName: 'Player B',
          drinks: ko.observable(0),
          position: self.players().length
        };
        self.players().push(playerTwo);

        var playerThree = {
          identity: 3,
          firstName: 'Player Gamma',
          drinks: ko.observable(0),
          position: self.players().length
        };
        self.players().push(playerThree);

        self.player = playerOne;

        self.currentPlayer(self.player);

        self.roll = function(){
          var rolls = [];
          for (var i = 0; i < 2; i++) {
            rolls.push(self.rollDice());
          }

          self.isSuccessfulRoll(rolls);
          return rolls;
        };

        self.rollDice = function(){
          return Math.floor(Math.random() * 6) + 1;
        };

        self.isSuccessfulRoll = function(rolls) {
          var result = {}, isSuccessful = false, message = '', extendedMessage = '';
          result.rolls = rolls;

          extendedMessage += self.currentPlayer().firstName + '<br/>';

          if(rolls.contains(3)) {
            isSuccessful = true;

            if (!self.threeManHasBeenChosen() || self.declaredThreeMan() === self.currentPlayer()) {
              self.chooseThreeMan();
              extendedMessage += 'chose ' + self.declaredThreeMan().firstName + ' as the new Three Man <br/>';
            }

            self.addDrinkToThreeMan();
            extendedMessage += 'Gave Three Man a drink <br/>';

            if (rolls[0] === 3 && rolls[1] === 3) {
              self.addDrinkToThreeMan();
              extendedMessage += 'Gave Three Man a drink <br/>';
            }

            message += 'Three Man ';
          }
          if(rolls.length === 2 && rolls[0] === rolls[1]) {
            isSuccessful = true;
            extendedMessage += 'Rolled doubles <br/>';
            self.doublesTarget(self.chooseDoublesTarget());
            self.rollDoublesBattle(extendedMessage);
            message += 'Doubles '
          }
          if(rolls.contains(1) && rolls.contains(2)) {
            isSuccessful = true;
            if (!self.threeManHasBeenChosen()) {
              self.addDrinkToThePlayer(self.currentPlayer());
              self.addDrinkToThePlayer(self.currentPlayer());
              extendedMessage += 'Gave themselves two drinks! <br/>';
            } else {
              self.addDrinkToThreeMan();
              self.addDrinkToThreeMan();
              extendedMessage += 'Gave Three Man two drinks <br/>';
            }
            message += 'Three Man x2 '
          }
          if(rolls.contains(1) && rolls.contains(4)) {
            isSuccessful = true;
            self.addDrinkToEveryone();
            extendedMessage += 'Gave the table a drink <br/>';
            message += 'Social '
          }
          if(rolls[0] + rolls[1] === 7) {
            isSuccessful = true;
            self.addDrinkToTheRight();
            extendedMessage += 'Gave a drink to the right <br/>';
            message += 'Seven to the Right '
          }
          if(rolls[0] + rolls[1] === 11) {
            isSuccessful = true;
            self.addDrinkToTheLeft();
            extendedMessage += 'Gave a drink to the left <br/>';
            message += 'Eleven to the Left '
          }
          result.isSuccessful = isSuccessful;
          result.message = message;
          result.extendedMessage = extendedMessage;
          self.rollResult = result;
          self.updateUI();
        };

        self.addDrinkToThePlayer = function(player){
          player.drinks(player.drinks() + 1);
        };

        self.addDrinkToTheRight = function() {
          var playerToTheRight = self.findPlayerToTheRight();
          playerToTheRight.drinks(playerToTheRight.drinks() + 1);
        };

        self.addDrinkToTheLeft = function() {
          var playerToTheLeft = self.findPlayerToTheLeft();
          playerToTheLeft.drinks(playerToTheLeft.drinks() + 1);
        };

        self.addDrinkToEveryone = function() {
          var players = self.players(), currentPlayer = self.currentPlayer();
          for (var i = 0; i < players.length; i++) {
            players[i].drinks(players[i].drinks() + 1);
          }
        };

        self.addDrinkToThreeMan = function() {
          self.declaredThreeMan().drinks(self.declaredThreeMan().drinks() + 1);
        };

        self.threeManHasBeenChosen = function() {
          return self.declaredThreeMan() !== null;
        };

        self.chooseThreeMan = function() {
          var d = $.Deferred();
          // open model
          // store the "d"
          // d.resolve();
          self.declaredThreeMan(self.findPlayerToTheRight());
          d.resolve();
          return d;
        };

        self.chooseDoublesTarget = function() {
          var d = $.Deferred();
          return self.findPlayerToTheRight();
          d.resolve();
          return d;
        };

        self.updateUI = function() {

          $('#rollTwo').attr('src','./images/dice-' + self.rollResult.rolls[1] +'.png');
          var buttonHtml = '<img id="rollOne" src="./images/dice-' + self.rollResult.rolls[0] +'.png">&nbsp;<img id="rollTwo" src="./images/dice-' + self.rollResult.rolls[1] +'.png">&nbsp;';
          if ( self.rollResult.isSuccessful) {
            $('#diceRollButton').addClass('btn-success').removeClass('btn-primary').removeClass('btn-danger');
            $('#diceRollButton').html(buttonHtml + self.rollResult.message);
            $('#rollExtendedResults').html(self.rollResult.extendedMessage);
          }
          else {
            var currentPosition = self.currentPlayer().position;
            $('#'+self.currentPlayer().identity).removeClass('alert').removeClass('alert-success');

            if (currentPosition + 1 === self.players().length) {
              self.currentPlayer(self.players()[0]);
            }
            else {
              self.currentPlayer(self.players()[currentPosition+1]);
            }

            $('#'+self.currentPlayer().identity).addClass('alert').addClass('alert-success');
            $('#diceRollButton').addClass('btn-danger').removeClass('btn-primary').removeClass('btn-success');
            $('#rollExtendedResults').html(self.rollResult.extendedMessage + 'Passed the dice');
            $('#diceRollButton').html(buttonHtml + 'You rolled jack shit.');
          }
        };

        self.findPlayerToTheLeft = function() {
          var players = self.players(), currentPlayer = self.currentPlayer();
          var currentPosition = currentPlayer.position;
          if (currentPosition - 1 < 0)
            return players[players.length - 1];
          else
            return players[currentPosition - 1];
        };

        self.findPlayerToTheRight = function() {
          var players = self.players(), currentPlayer = self.currentPlayer();
          var currentPosition = currentPlayer.position;

          if (currentPosition + 1 === players.length)
            return players[0];
          else
            return players[currentPosition + 1];
        };

        self.rollDoublesBattle = function(extendedMessage){
          var doublesHaveBeenRolled = true;
          var doublesMultiplier = 1;
          var doublesBattlers = [self.currentPlayer(), self.doublesTarget()]
          var drinkReceiver;
          while (doublesHaveBeenRolled && doublesMultiplier < 5) {
            drinkReceiver = doublesBattlers[doublesMultiplier % 2];
            var rolls = [];
            for (var i = 0; i < 2; i++) {
              rolls.push(self.rollDice());
            }
            if(rolls.length === 2 && rolls[0] === rolls[1]) {
              doublesMultiplier++;
              // continue play here
              // increase multiplier
              extendedMessage += drinkReceiver + 'rolled doubles back! (' + rolls[0] + ' ' + rolls[1] + ')<br/>';
            } else {
              drinkReceiver.drinks(drinkReceiver.drinks() + (rolls.sum() * doublesMultiplier))
              extendedMessage += drinkReceiver + 'rolled ' + rolls[0] + ' and ' + rolls[1] + ' getting them ' + (rolls.sum() * doublesMultiplier) + 'drinks!<br/>';
              doublesHaveBeenRolled = false;
            }
          }
        };

        return self;
    };
})(window.threeManGame = window.threeManGame || {});
