// ----------------------------save the data------------------------------------

function saveData() {
    var saveData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        services: document.getElementById('services').value,
        text: document.getElementById('text').value
    };


    var jwtToken = localStorage.getItem('jwtToken');

    console.log('Request Data:', JSON.stringify(saveData));

    if (!saveData.name || !saveData.email || !saveData.phone || !saveData.services || !saveData.text) {
        alert('Please fill in all required fields.');
        return;
    }

    fetch('http://localhost:8181/ibg-infotech/auth/save-contact-us', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken,
        },
        body: JSON.stringify(saveData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);

            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Data has been saved successfully.',
            }).then((result) => {

                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('services').value = '';
                document.getElementById('text').value = '';
                window.location.href = 'Contact-Us.html';

            });
        })
        .catch(error => {
            console.error('Error:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save data. Please try again.',
            });
        });
}



// ----------------------------------------------------------------------------------------------



function saveData1() {
    var saveData1 = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        company: document.getElementById('company').value,
        text: document.getElementById('text').value
    };


    var jwtToken = localStorage.getItem('jwtToken');

    console.log('Request Data:', JSON.stringify(saveData1));

    if (!saveData1.name || !saveData1.email || !saveData1.phone || !saveData1.company || !saveData1.text) {
        alert('Please fill in all required fields.');
        return;
    }

    fetch('http://localhost:8181/ibg-infotech/auth/save-contact-us', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken,
        },
        body: JSON.stringify(saveData1)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);

            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Data has been saved successfully.',
            }).then((result) => {

                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                document.getElementById('phone').value = '';
                document.getElementById('company').value = '';
                document.getElementById('text').value = '';
                window.location.href = 'index.html';

            });
        })
        .catch(error => {
            console.error('Error:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save data. Please try again.',
            });
        });
}



// ------------------------------get all the data--------------------------------------

var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);


function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/ibg-infotech/auth/get-all-contact-us', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            populateTable(data.data);
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}


function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}



function populateTable(data) {
    const tableBody = document.getElementById('dataTableBody');
    tableBody.innerHTML = '';

    if (Array.isArray(data)) {
        data.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.email}</td>
                <td>${item.phone}</td>
                <td>${item.services}</td>
                <td>${item.text}</td>               
                <td>
                    <a class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i>Edit</a>
                    <a class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i>Delete</a>
                </td>
            `;
            tableBody.appendChild(row);

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', function () {
                const id = editBtn.getAttribute('data-id');
                console.log("Edit button clicked for ID: " + id);

                fetch(`http://localhost:8181/ibg-infotech/auth/get-contact-us/${id}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + jwtToken,
                    },
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {

                        localStorage.setItem('updateData', JSON.stringify(data.data));


                        window.location.href = 'update-contact.html';
                    })
                    .catch(error => {
                        console.error('Error fetching service data:', error);
                    });
            });


            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = deleteBtn.getAttribute('data-id');
                deleteService(id);
            });
        });
    } else {
        console.error('Data received is not an array:', data);
    }
}


// ----------------------------------------delete by id-----------------------------------------------


function deleteService(id) {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch(`http://localhost:8181/ibg-infotech/auth/delete-contact-us/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + jwtToken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Service has been deleted successfully.',
            }).then((result) => {

                getData();
            });
        })
        .catch(error => {
            console.error('Error deleting service:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete the service. Please try again later.',
            });
        });
}

// -----------------------------------update the data by id-------------------------------------------



function updateData() {
    var id = document.getElementById('id').value;
    var name = document.getElementById('name').value;
    var email = document.getElementById('email').value;
    var services = document.getElementById('services').value;
    var text = document.getElementById('text').value;
    var phone = document.getElementById('phone').value;
    var jwtToken = localStorage.getItem('jwtToken');


    if (!name || !text || !email || !phone) {
        alert('Please fill in all required fields.');
        return;
    }


    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }


    var data = {
        name: name,
        email: email,
        services: services,
        text: text,
        phone: phone
    };

    fetch(`http://localhost:8181/ibg-infotech/auth/update-contact-us/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + jwtToken,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
            if (data.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Data has been updated successfully.',
                }).then((result) => {

                    window.location.href = 'Contact-Us.html';
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Failed to update data. ' + data.error,
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update data. Please try again.',
            });
        });
}