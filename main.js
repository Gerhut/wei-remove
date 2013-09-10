(function () {
  var APP_KEY = '3401047418'
    , token;

  $('#countLabel').click(function () {
    $('#countInput').val(
      $('#countLabel').hide().text()
    ).show().focus();
  });
  $('#countInput').blur(function () {
    $('#countLabel').text(
      $('#countInput').hide().val()
    ).show();
  })

  if (location.search.substring(0,6) !== '?code=') {
    $('<button class="btn btn-primary">')
      .text('微博登录')
      .click(function () {
        location.href = 'https://api.weibo.com/oauth2/authorize'
          + '?client_id=' + APP_KEY
          + '&response_type=code'
          + '&redirect_uri=http://gerhut.github.io/wei-remove/';
      })
      .appendTo('#login');
  } else {
    token = location.search.substring(6, 32);
    $.getJSON('https://api.weibo.com/2/account/get_uid.json')
      .done(function (data) {
        $('#login').text(data);
      });
  }
})();