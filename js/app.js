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
      dictionary = data.split(/\r?\n/);
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

  function createPassword(dictionary, numberOfWords, numberOfDigits) {
    var password = [];
    for (var i=0; i<numberOfWords; i++) {
      password.push( dictionary[Math.floor(Math.random() * dictionary.length)] );
    }
    return password.join('-');
  }

  function calculate() {
    // Get user inputs
    var numberOfWords = parseInt( $('input[name=number-of-words]:checked').val() );
    var numberOfDigits = parseInt( $('input[name=number-of-digits]:checked').val() );
    // Calculate bit strength
    var strengthInBits = calculateStrengthInBits(dictionary, numberOfWords, numberOfDigits);
    $strength.text(strengthInBits + 'bits');
    // Create some passwords
    $passwords.empty();
    for (var i=0; i<5; i++) {
      var password = createPassword(dictionary, numberOfWords, numberOfDigits);
      $('<li>').text(password).appendTo($passwords);
    }
  }

  // --------------- Initialise
  $('input:radio').change(calculate);
  $('.generateBtn').click(calculate);

  // --------------- Initialise
  loadDictionary();

});
