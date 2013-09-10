(function () {
  $('#countLabel').click(function () {
    $('#countInput').val(
      $('#countLabel').hide().text()
    ).show().focus();
  });
  $('#countInput').blur(function () {
    $('#countLabel').text(
      $('#countInput').hide().val()
    ).show();
  });

  $('#loginButton').click(function () {
    var repostSetting = parseInt($('#countLabel').text(), 10);
    if (isNaN(repostSetting)) repostSetting = 500;
    $('#countLabel').replaceWith(repostSetting);
    WB2.login(function () {
      WB2.anyWhere(function(WB){
        var uid;
        function loadWeibo(page) {
          WB.parseCMD("/statuses/user_timeline/ids.json", function(data){
            WB.parseCMD("/statuses/count.json", function(data) {
              var $posts = $('#posts')
              data.forEach(function (value) {
                if (value.reposts >= repostSetting) {
                  WB.parseCMD("/statuses/show.json", function(data) {
                    $posts.append(
                      $('<p>')
                      .append(
                        $('<button class="btn btn-danger">删除</button>')
                      )
                      .append($('<span class="badge">').text(data.reposts_count))
                      .append(data.text)
                    );
                  }, {
                    id: value.id
                  }, { 'method': 'GET' });
                }
              });
            }, {
              ids: data["statuses"].join(',')
            }, { 'method': 'GET' });
            if (data["statuses"].length === 100) {
              setTimeout(loadWeibo, 1, page + 1);
            }
          }, {
            'uid': uid,
            'count': 100,
            'page': page,
            'feature': 1
          }, { 'method': 'GET' });
        }

        WB.parseCMD("/account/get_uid.json", function(data){
          uid = data['uid'];
          WB.parseCMD("/users/show.json", function(data){
            $('#login').empty()
            .addClass('media')
            .append(
              $('<img class="media-object pull-left">')
              .attr('src', data['profile_image_url'])
            ).append(
              $('<div class="media-body">')
              .append(
                $('<h4 class="media-heading">')
                .text(data['screen_name'])
              )
            );
          }, { 'uid': data.uid }, { 'method': 'GET' });
          loadWeibo(1);
        },{},{ 'method': 'GET' });
      });
    });
  });
})();