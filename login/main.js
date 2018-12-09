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
    const form = new FormData(document.getElementById('login-form'));
    const url = 'http://127.0.0.1:5000/login';

    fetch(url, {
        method: "POST",
        body: form
    }).then(response => {
        if (response.status === 200) {
            console.log('success')
            window.location.replace("/dash")
        } else if(response.status === 401) {
            console.log('wrong credentials')
            $.notify({
                message: 'You either entered wrong credentials or that user does not exist. Please check your info and try again'
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
