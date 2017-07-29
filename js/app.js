$(function() {

  var $loading = $('.loading');
  var $results = $('.results');
  var $strength = $results.find('.strength');
  var $passwords = $results.find('.passwords');
  var dictionary = []; // array of string

  function loadDictionary() {
    $loading.show();
    $results.hide();
    $.get('dictionary/words.txt', function(data) {
      dictionary = data.split(/\r?\n/).filter(function(word) {
        return word.length; // Removes empty lines
      });
      calculate();
      $loading.hide();
      $results.show();
    });
  };

  function calculateStrengthInBits(dictionary, numberOfWords, numberOfDigits) {
    var combinations = 1;
    // When adding a number, there are {numberOfWords + 1} possible positions
    combinations = numberOfDigits ? (numberOfWords + 1) : 1;
    // When adding a number, there are {10^numberOfDigits} possible numbers
    combinations *= Math.pow(10, numberOfDigits);
    // For each word there are {dictionary.length}
    combinations *= Math.pow(dictionary.length, numberOfWords);
    // Return strength in bits
    console.log(combinations, dictionary.length, numberOfWords);
    return Math.log(combinations) / Math.log(2);
  }

  // Returns a random integer in the domain [0, upperLimit)
  function randomInt(upperLimit) {
    return Math.floor(Math.random() * upperLimit);
  }

  function createPassword(dictionary, numberOfWords, numberOfDigits) {
    var password = [];
    // Words
    for (var i=0; i<numberOfWords; i++) {
      password.push( dictionary[randomInt(dictionary.length)] );
    }
    // Inject a number if required
    if (numberOfDigits) {
      var position = randomInt(password.length + 1);
      console.log(position);

      var number = randomInt(Math.pow(10, numberOfDigits));
      password.splice(position, 0, number);
    }
    // Join
    return password.join('-');
  }

  function calculate() {
    // Get user inputs
    var numberOfWords = parseInt( $('input[name=number-of-words]:checked').val() );
    var numberOfDigits = parseInt( $('input[name=number-of-digits]:checked').val() );
    // Calculate bit strength
    var strengthInBits = calculateStrengthInBits(dictionary, numberOfWords, numberOfDigits);
    $strength.text(strengthInBits.toFixed(1) + ' bits');
    // Create some passwords
    $passwords.empty();
    for (var i=0; i<5; i++) {
      var password = createPassword(dictionary, numberOfWords, numberOfDigits);
      $('<li>').text(password).appendTo($passwords);
    }
  }

  // --------------- Initialise: attach event listeners and load dictionary
  $('input:radio').change(calculate);
  $('.generateBtn').click(calculate);
  loadDictionary();

});
