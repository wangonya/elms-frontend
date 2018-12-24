document.getElementById('uid').innerHTML = localStorage.uid
document.getElementById('u_id').value = localStorage.uid

const url = `https://elmsystem.herokuapp.com/leaves/${localStorage.uid}`

if(localStorage.uid !== undefined) {
    function getLeaves() {
        fetch(url, {
            headers: new Headers({
                'Authorization': 'Bearer '+localStorage.token
            })
        }).then(response => response.json())
            .then(data => {
                if(data.msg === 'Token has expired') {
                    $.notify({
                        message: 'Your token has expired. Please login again'
                    },{
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

                    const table = document.getElementById('user-table')
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
                            // search tables and add class to leave status
                            $("td:nth-child(8):contains('approved')").addClass("text-success")
                            $("td:nth-child(8):contains('denied')").addClass("text-warning")
                            $("td:nth-child(8):contains('cancelled')").addClass("text-danger")
                            $("td:nth-child(8):contains('pending')").addClass("text-info")
                            $("td:nth-child(8):contains('withdrawn')").addClass("text-muted")
                        }

                        // get row data on click
                        tr.onclick = function () {
                            $('#editLeave').modal('show')
                            localStorage.lid = $(this).children().closest("td:nth-child(1)").html()
                            const editStatus = $(this).children().closest("td:nth-child(8)").html()
                            document.getElementById('editStatus').innerHTML = editStatus

                            if(editStatus === 'pending') {
                                document.getElementById('editButton').innerHTML = ''
                                document.getElementById('editIcon').innerHTML = '<i class="nc-icon nc-watch-time"></i>'
                                document.getElementById('editButton').innerHTML = '<button class="btn btn-info" type="button" onclick="withdrawLeave()">Withdraw Application</button>'
                            } else if (editStatus === 'cancelled') {
                                document.getElementById('editButton').innerHTML = ''
                                document.getElementById('editIcon').innerHTML = '<i class="nc-icon nc-simple-remove"></i>'
                            } else if (editStatus === 'denied') {
                                document.getElementById('editButton').innerHTML = ''
                                document.getElementById('editIcon').innerHTML = '<i class="nc-icon nc-simple-remove"></i>'
                            } else if (editStatus === 'withdrawn') {
                                document.getElementById('editButton').innerHTML = ''
                                document.getElementById('editIcon').innerHTML = '<i class="nc-icon nc-refresh-02"></i>'
                            } else if (editStatus === 'approved') {
                                document.getElementById('editButton').innerHTML = ''
                                document.getElementById('editIcon').innerHTML = '<i class="nc-icon nc-check-2"></i>'
                                document.getElementById('editButton').innerHTML = '<button class="btn btn-danger" type="button" onclick="cancelLeave()">Cancel Leave</button>'
                            }
                        }
                    }
                }
            })
    }
} else {
    window.location.replace('/login')
}

getLeaves()

function validate() {
    const l_from = document.getElementById('l_from')
    const l_to = document.getElementById('l_to')
    const l_type = document.getElementById('l_type')
    const l_details = document.getElementById('l_details')
    if (l_from.value.length < 8)
    {
        $.notify({
            message: 'Please enter a valid from date'
        },{
            type: 'danger'
        })
        l_from.focus()
        return false
    }

    if (l_to.value.length < 8)
    {
        $.notify({
            message: 'Please enter a valid to date'
        },{
            type: 'danger'
        })
        l_to.focus()
        return false
    }

    if (l_type.value.length < 4)
    {
        $.notify({
            message: 'Please enter a type value'
        },{
            type: 'danger'
        })
        l_type.focus()
        return false
    }

    if (l_details.value.length < 10)
    {
        $.notify({
            message: 'Please enter leave details. Must be at least 10 characters'
        },{
            type: 'danger'
        })
        l_details.focus()
        return false
    }

    apply()
}

function apply() {
    const form = new FormData(document.getElementById('apply-form'))
    const url = 'https://elmsystem.herokuapp.com/leaves'

    fetch(url, {
        method: "POST",
        body: form,
        headers: new Headers({
            'Authorization': 'Bearer '+localStorage.token
        })
    }).then(response => response.json())
        .then(data => {
            if (data.message.includes('pending')) {
                $.notify({
                    message: data.message
                },{
                    type: 'warning'
                })
                $('#applyLeave').modal('hide')
            } else if(data.msg === 'Missing Authorization Header' || data.msg === 'Token has expired') {
                console.log(data)
                $.notify({
                    message: 'Please login to apply for leave'
                },{
                    type: 'danger'
                })
                $('#applyLeave').modal('hide')
            } else if(data.message.includes('An error occurred while inserting the data.')) {
                console.log(data)
                $.notify({
                    message: 'An error occurred while inserting the data. Please contact the admin.'
                },{
                    type: 'danger'
                })
                $('#applyLeave').modal('hide')
            } else {
                console.log(data)
                $.notify({
                    message: data.message
                },{
                    type: 'success'
                })
                document.getElementById('user-table').innerHTML = ''
                getLeaves()
                $('#applyLeave').modal('hide')
            }
        })
}

const withdrawUrl = `https://elmsystem.herokuapp.com/leaves/${localStorage.lid}/withdraw`
const cancelUrl = `https://elmsystem.herokuapp.com/leaves/${localStorage.lid}/cancel`

function withdrawLeave() {
    fetch(withdrawUrl, {
        method: "PATCH",
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
            document.getElementById('user-table').innerHTML = ''
            $('#editLeave').modal('hide')
            getLeaves()
        })
}

function cancelLeave() {
    fetch(cancelUrl, {
        method: "PATCH",
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
            document.getElementById('user-table').innerHTML = ''
            $('#editLeave').modal('hide')
            getLeaves()
        })
}