function validate() {
    const uid = document.getElementById('uid')
    const password = document.getElementById('password')
    if (uid.value.length < 4)
    {
        $.notify({
            message: 'Please enter a valid username. Must be more than 4 characters'
        },{
            type: 'danger'
        })
        uid.focus()
        return false
    }

    if (password.value.length < 6)
    {
        $.notify({
            message: 'Please enter a valid password. Must be more than 6 characters'
        },{
            type: 'danger'
        })
        password.focus()
        return false
    }

    login()
}

function login() {
    const form = new FormData(document.getElementById('login-form'))
    const url = 'http://127.0.0.1:5000/login'

    fetch(url, {
        method: "POST",
        body: form
    }).then(response => response.json())
        .then(data => {
            if (data.status === 200) {
                window.location.replace('/dash')
                window.localStorage.token = data.token
                window.localStorage.is_admin = data.is_admin
            } else if(data.status === 401) {
                console.log('user exists')
                $.notify({
                    message: 'A user with that username exists. Please choose a different one.'
                },{
                    type: 'danger'
                })
            } else {
                console.log('something went wrong :(')
                $.notify({
                    message: 'Something went wrong. Please refresh the page or try again later.'
                },{
                    type: 'danger'
                })
            }
        })
}
