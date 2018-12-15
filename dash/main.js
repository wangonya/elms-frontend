document.getElementById('uid').innerHTML = localStorage.uid

const url = `http://127.0.0.1:5000/leaves/${localStorage.uid}`

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
                }
            }
        }
    })
