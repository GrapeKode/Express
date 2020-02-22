($(document).ready(() => {
  let res = $('#response');
  function Login( e ) {
    $.post(
      'http://localhost:3000/auth/login',
      $(this).serialize(),
      (data, textStatus, jQxhr) => {
        $.ajaxSetup({
          beforeSend: xhr => {
            xhr.setRequestHeader('X-AUTH', data.token)
          }
        });
        console.log(data);
        res.html(data.info['message']);
        //setTimeout(() => window.location.href = 'http://localhost:3000/views/home', 2500);
        //reqSetup( data.token, redirect('http://localhost:3000/views/home') )
      }
    ).fail((jQxhr, textStatus, errorThrown) => {
      alert(errorThrown);
      console.log(errorThrown);
      console.log(jQxhr);
      res.html(JSON.parse(jQxhr.responseText).error.message);
    });
    e.preventDefault();
  }

  let login = $('#loginForm');
  login.submit( Login );
}))