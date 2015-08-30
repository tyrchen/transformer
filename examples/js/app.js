$(document).ready(function() {
  $('#login').on('click', function(e) {
    var email = document.getElementById('email');
    var gid = document.getElementById;
    console.log('Email is ' + email.value);
    console.log($('#password').val());
    console.log($('input[name="rememberMe"]').val());
    console.log(gid('exampleInputFile'));
  });
});
