function register() {
    const form = new FormData(document.getElementById('register-form'))
    const url = 'http://127.0.0.1:5000/register'

    fetch(url, {
        method: "POST",
        body: form
    }).then(response => {
        if (response.status === 201) {
            console.log('success')
            $.notify({
                message: 'Registration successful. You can now go to the login page and sign in.'
            },{
                type: 'success'
            })
        } else if(response.status === 400) {
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
