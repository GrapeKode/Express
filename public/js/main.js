($(document).ready(() => {
  let res = $('#response');

  function reqSetup( token, next ) {
    $.ajaxSetup({
      beforeSend: xhr => {
        xhr.setRequestHeader('X-AUTH', token)
      }
    })
    next()
  }

  function redirect( url ) {
    window.location.href = url;
  }

  function currentUser() {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/current-user',
      // data: { signature: token },
      processData: false,
      success: (data, textStatus, jQxhr) => {
        console.log(data);
        let html =  "<br>Email:" + data.user['email'] +
                    "<br>Admin:" + data.user['isAdmin'];
        res.html(html);
      },
      error: (jQxhr, textStatus, error) => {
        alert(error);
        console.log(error);
        console.log(jQxhr);
        res.html(error)
      }
    })
    //e.preventDefault();
  }

  function limitUsers( limit ) {
    $.ajax({
      type: 'GET',
      url: 'http://localhost:3000/api/user?limit=' + limit,
      //data: { signature: token },
      success: (data, textStatus, jQxhr) => {
        console.log(data);
        res.append("<br><hr>" + JSON.stringify(data.users));
      },
      error: (jQxhr, textStatus, error) => {
        alert(error);
        console.log(error);
        console.log(jQxhr);
        res.html(error)
      }
    })
    //e.preventDefault();
  }

  let limitForm = $('#limitForm'),
      login = $('.login'),
      user = $('.user'),
      limit = $('.limit'),
      create = $('.create');

  login.on('click', () => {
    window.location.href = 'http://localhost:3000/views/login'
  })

  user.on('click', () => {
    let token = '';
    
    reqSetup( token, currentUser() )
  })

}))