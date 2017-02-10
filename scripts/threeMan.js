(function(tmg) {
    tmg.game = function() {
        var self = this;
        self.table = ko.observable(
          {
            players: ko.observableArray(null),
            currentPlayer: ko.observable(null)
          }
        );

        self.declaredThreeMan = ko.observable(null);
        self.doublesTarget = ko.observable(null);

        var playerOne = {
          identity: 1,
          firstName: 'Player One',
          drinks: ko.observable(0),
          position: self.table().players().length
        };
        self.table().players().push(playerOne);

        var playerTwo = {
          identity: 2,
          firstName: 'Player B',
          drinks: ko.observable(0),
          position: self.table().players().length
        };
        self.table().players().push(playerTwo);

        var playerThree = {
          identity: 3,
          firstName: 'Player Gamma',
          drinks: ko.observable(0),
          position: self.table().players().length
        };
        self.table().players().push(playerThree);

        self.player = playerOne;

        self.table().currentPlayer(self.player);

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

          extendedMessage += self.table().currentPlayer().firstName + '<br/>';

          if(rolls.contains(3)) {
            isSuccessful = true;

            if (!self.threeManHasBeenChosen() || self.declaredThreeMan() === self.table().currentPlayer()) {
              self.chooseThreeMan();
              extendedMessage += 'chose ' + self.declaredThreeMan().firstName + ' as the new Three Man <br/>';
            }

            self.addDrinkToThreeMan();
            extendedMessage + 'gave Three Man a drink <br/>';

            if (rolls[0] === 3 && rolls[1] === 3) {
              self.addDrinkToThreeMan();
              extendedMessage + 'gave Three Man a drink <br/>';
            }

            message += 'Three Man ';
          }
          if(rolls.length === 2 && rolls[0] === rolls[1]) {
            isSuccessful = true;
            extendedMessage + 'rolled doubles <br/>';
            self.doublesTarget(self.chooseDoublesTarget());
            self.rollDoublesBattle();
            message += 'Doubles '
          }
          if(rolls.contains(1) && rolls.contains(2)) {
            isSuccessful = true;
            if (!self.threeManHasBeenChosen()) {
              self.addDrinkToThePlayer(self.table().currentPlayer());
              self.addDrinkToThePlayer(self.table().currentPlayer());
              extendedMessage + 'gave themsevles two drinks! <br/>';
            } else {
              self.addDrinkToThreeMan();
              self.addDrinkToThreeMan();
              extendedMessage + 'gave Three Man two drinks <br/>';
            }
            message += 'Three Man x2 '
          }
          if(rolls.contains(1) && rolls.contains(4)) {
            isSuccessful = true;
            self.addDrinkToEveryone();
            extendedMessage + 'gave the table a drink <br/>';
            message += 'Social '
          }
          if(rolls[0] + rolls[1] === 7) {
            isSuccessful = true;
            self.addDrinkToTheRight();
            extendedMessage + 'gave a drink to the right <br/>';
            message += 'Seven to the Right '
          }
          if(rolls[0] + rolls[1] === 11) {
            isSuccessful = true;
            self.addDrinkToTheLeft();
            extendedMessage + 'gave a drink to the left <br/>';
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
          var players = self.table().players(), currentPlayer = self.table().currentPlayer();
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
          if ( self.rollResult.isSuccessful) {
            $('#diceRollButton').addClass('btn-success').removeClass('btn-primary').removeClass('btn-danger');
            $('#rollResults').html(self.rollResult.message);
            $('#rollExtendedResults').html(self.rollResult.extendedMessage);
          }
          else {
            var currentPosition = self.table().currentPlayer().position;
            $('#'+self.table().currentPlayer().identity).removeClass('alert').removeClass('alert-success');

            if (currentPosition + 1 === self.table().players().length) {
              self.table().currentPlayer(self.table().players()[0]);
            }
            else {
              self.table().currentPlayer(self.table().players()[currentPosition+1]);
            }

            $('#'+self.table().currentPlayer().identity).addClass('alert').addClass('alert-success');
            $('#diceRollButton').addClass('btn-danger').removeClass('btn-primary').removeClass('btn-success');
            $('#rollResults').html("You rolled jack shit.");
          }

          $('#rollOne').attr('src','./images/dice-' + self.rollResult.rolls[0] +'.png');
          $('#rollTwo').attr('src','./images/dice-' + self.rollResult.rolls[1] +'.png');
        };

        self.findPlayerToTheLeft = function() {
          var players = self.table().players(), currentPlayer = self.table().currentPlayer();
          var currentPosition = currentPlayer.position;
          if (currentPosition - 1 < 0)
            return players[players.length - 1];
          else
            return players[currentPosition - 1];
        };

        self.findPlayerToTheRight = function() {
          var players = self.table().players(), currentPlayer = self.table().currentPlayer();
          var currentPosition = currentPlayer.position;

          if (currentPosition + 1 === players.length)
            return players[0];
          else
            return players[currentPosition + 1];
        };

        self.rollDoublesBattle = function(){
          var doublesHaveBeenRolled = true;
          var doublesMultiplier = 1;
          var doublesBattlers = [self.table().currentPlayer(), self.doublesTarget()]

          while (doublesHaveBeenRolled && doublesMultiplier < 5) {
            var rolls = [];
            for (var i = 0; i < 2; i++) {
              rolls.push(self.rollDice());
            }
            if(rolls.length === 2 && rolls[0] === rolls[1]) {
              doublesMultiplier++;
              // continue play here
              // increase multiplier
            } else {
              var drinkReceiver = doublesBattlers[doublesMultiplier % 2];
              drinkReceiver.drinks(drinkReceiver.drinks() + (rolls.sum() * doublesMultiplier))
              doublesHaveBeenRolled = false;
            }
          }
        };

        return self;
    };
})(window.threeManGame = window.threeManGame || {});
