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
          WB.parseCMD("/statuses/user_timeline.json", function(data){
            var $posts = $('#posts')
            data["statuses"].forEach(function (value) {
              if (value.reposts_count >= repostSetting) {
                $posts.append(
                  $('<tr>')
                  .data('id', value.id)
                  .append(
                    $('<td><button class="btn btn-danger">删除</button></td>')
                  )
                  .append(
                    $('<td>').append(
                      $('<span class="badge">').text(value.reposts_count)
                    )
                  )
                  .append(
                    $('<td>').text(value.text)
                  )
                );
              }
            });
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

  $('#posts').on('click', 'button', function () {
    var $tr = $(this).parent('tr');
    WB2.anyWhere(function(WB){
      WB.parseCMD('/statuses/destroy.json', function(data) {
        $tr.fadeOut();
      }, {
        'id': $tr.data('id')
      });
    });
  });
})();