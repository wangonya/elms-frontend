const url = `https://elmsystem.herokuapp.com/leaves`

// TODO: CHECK IF ADMIN FROM TOKEN. THIS IS INSECURE!!
if(localStorage.is_admin === 'true') {
    function getLeaves() {
        fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer ' + localStorage.token
            })
        }).then(response => response.json())
            .then(data => {
                if (data.msg === 'Token has expired') {
                    $.notify({
                        message: 'Your token has expired. Please login again'
                    }, {
                        type: 'danger'
                    })
                } else {
                    const col = [];
                    for (let i = 0; i < data.length; i++) {
                        for (let key in data[i]) {
                            if (col.indexOf(key) === -1) {
                                col.push(key);
                            }
                        }
                    }

                    const table = document.getElementById('table')
                    const header = table.createTHead()

                    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.
                    const thr = header.insertRow(-1);
                    for (let i = 0; i < col.length; i++) {
                        let th = document.createElement("th");
                        th.innerHTML = col[i];
                        thr.appendChild(th);
                    }

                    // ADD JSON DATA TO THE TABLE AS ROWS.
                    for (let i = 0; i < data.length; i++) {

                        const tr = table.insertRow(-1);

                        for (let j = 0; j < col.length; j++) {
                            let tabCell = tr.insertCell(-1);
                            tabCell.innerHTML = data[i][col[j]];
                        }

                        // get row data on click
                        tr.onclick = function () {
                            $('#respondLeave').modal('show')
                            localStorage.lid = $(this).children().closest("td:nth-child(1)").html()
                        }
                    }
                }
            })
    }
} else {
    window.location.replace('/dash')
}

getLeaves()

function validate() {
    const l_status = document.getElementById('l_status')
    const admin_remarks = document.getElementById('admin_remarks')
    if (l_status.value.length < 4)
    {
        $.notify({
            message: 'No response selected'
        },{
            type: 'danger'
        })
        l_status.focus()
        return false
    }

    if (admin_remarks.value.length < 5)
    {
        $.notify({
            message: 'Please enter your remarks. Must be at least 5 characters'
        },{
            type: 'danger'
        })
        admin_remarks.focus()
        return false
    }
    respondLeave()
}

function respondLeave() {
    const form = new FormData(document.getElementById('respond-form'))
    const respondUrl = `https://elmsystem.herokuapp.com/leaves/${localStorage.lid}`
    fetch(respondUrl, {
        method: "PATCH",
        body: form,
        headers: new Headers({
            'Authorization': 'Bearer '+localStorage.token
        })
    }).then(response => response.json())
        .then(data => {
            $.notify({
                message: 'Leave status updated'
            },{
                type: 'success'
            })
            document.getElementById('table').innerHTML = ''
            getLeaves()
            $('#respondLeave').modal('hide')
        })
}