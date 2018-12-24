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

    register()
}

function register() {
    const form = new FormData(document.getElementById('register-form'))
    const url = 'https://elmsystem.herokuapp.com/register'

    fetch(url, {
        method: "POST",
        body: form
    }).then(response => response.json())
        .then(data => {
            if (data.status === 201) {
                console.log('success')
                $.notify({
                    message: 'Registration successful. You can now go to the login page and sign in.'
                },{
                    type: 'success'
                })
            } else if(data.status === 400) {
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
