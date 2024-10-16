// --------------------------------save the data-----------------------------------

function saveData() {
    var title = document.getElementById('title').value;
    var title2 = document.getElementById('title2').value;
    var status = document.getElementById('status').value;
    var imageFile = document.getElementById('image-input').files[0];

    // Constructing the data object as JSON
    var data = {
        "title": title,
        "title2": title2,
        "status": status
    };

    // Convert the JSON data object to a string
    var jsonData = JSON.stringify(data);

    var formData = new FormData();
    formData.append('data', jsonData); // Appending the data parameter

    if (imageFile) {
        formData.append('uploadImageFile', imageFile);
    }

    var jwtToken = localStorage.getItem('jwtToken');

    if (!title || !title2 || !status) {
        alert('Please fill in all required fields.');
        return;
    }

    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    fetch('http://localhost:8181/ibg-infotech/auth/save-gallery', {
            method: 'POST',
            body: formData,
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
            console.log('Server response:', data);
            Swal.fire({
                icon: 'success',
                title: 'Saved!',
                text: 'Data has been saved successfully.',
            }).then((result) => {
                document.getElementById('title').value = '';
                document.getElementById('title2').value = '';
                document.getElementById('status').value = '';
                document.getElementById('image-input').value = '';
                window.location.href = 'footer-gallery.html';
                getData();
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




document.addEventListener('DOMContentLoaded', function() {
    imageData();
});


function imageData() {
    fetch('http://localhost:8181/ibg-infotech/auth/get-all-galleries', {
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
            // Assuming data is an array of objects, each object representing a footer item
            const footerItems = data.data;

            // Find the elements you want to update
            const anchorTag = document.getElementById('dynamicImageAnchor');
            const nameElement = document.getElementById('ping_now');
            const textElement = document.getElementById('text');
            const openHoursElement = document.getElementById('openHours');
            const footerTitleElement = document.getElementById('footerTitle');

            const firstFooterItem = footerItems[0];

            // Update the href and src attributes with the fetched data
            anchorTag.href = '#'; // Update href if needed
            anchorTag.querySelector('img').src = 'data:image/jpeg;base64,' + firstFooterItem.image;
            anchorTag.querySelector('img').alt = '';

            // Update additional fields
            nameElement.textContent = firstFooterItem.ping_now;
            textElement.textContent = firstFooterItem.text;
            // Remove HTML tags from openHours content
            openHoursElement.innerHTML = firstFooterItem.openHours; // Update openHours content with HTML
            openHoursElement.textContent = openHoursElement.innerText; // Remove HTML tags

            footerTitleElement.textContent = firstFooterItem.footer_title;
        })
        .catch(error => {
            console.error('Error fetching image data:', error);
        });
}

// Call fetchImageData() when the page loads
window.onload = function() {
    fetchImageData();
};




// -------------------------------get the data----------------------------------------------


var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);

function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/ibg-infotech/auth/get-all-galleries', {
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
        console.log('Error fetching data:', error);
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
            <td>${item.title}</td>
            <td>${item.title2}</td>
            <td>${item.status}</td>
            <td><img src="assets/Image/data:image/jpeg;base64,${item.upload_image}" width="100" height="100"></td>
            <td>
                <a class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i>Edit</a>
                <a class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i>Delete</a>
            </td>

        `;

            tableBody.appendChild(row);

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', function() {
                const id = editBtn.getAttribute('data-id');
                console.log("Edit button clicked for ID:" + id);

                fetch(`http://localhost:8181/ibg-infotech/auth/get-gallery/${id}`, {
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
                    window.location.href = `update-footer-gallery.html`;

                })

                .catch(error => {
                    console.error('Error fetching blog data:', error);
                });
            });

            const deleteBtn = row.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', () => {
                const id = deleteBtn.getAttribute('data-id');
                deleteGallery(id);
            });
        });

    } else {
        console.error('Data received is not an array:', data);
    }
}

// -------------------------------delete the data---------------------------------------



function deleteGallery(id) {

    var jwtToken = localStorage.getItem('jwtToken');

    if (!jwtToken) {
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'JWT token is missing. Please log in again.',
        });
        return;
    }


    fetch(`http://localhost:8181/ibg-infotech/auth/delete-gallery/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + jwtToken,
            },
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.text();
        })
        .then(data => {

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'footer Gallery has been deleted successfully.',
            }).then(() => {

                location.reload();
            });
        })
        .catch(error => {
            console.error('Error:', error);

            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to delete the footer Gallery. Please try again later.',
            });
        });
}


// ------------------------------------update the data-------------------------------------



function updateData() {
    var id = document.getElementById('id').value;
    var title = document.getElementById('title').value;
    var title2 = document.getElementById('title2').value;
    var status = document.getElementById('status').value;
    var imageFile = document.getElementById('image-input').files[0];
    var jwtToken = localStorage.getItem('jwtToken');


    if (!title || !title2 || !status) {
        alert('Please fill in all required fields.');
        return;
    }


    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    var data = {
        title: title,
        title2: title2,
        status: status
    };

    var formData = new FormData();
    formData.append('data', JSON.stringify(data));

    if (imageFile) {
        formData.append('uploadImageFile', imageFile);
    }


    fetch(`http://localhost:8181/ibg-infotech/auth/update-gallery/${id}`, {
        method: 'PUT',
        body: formData,
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
            console.log('Server response:', data);
            if (data.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Data has been updated successfully.',
                }).then((result) => {
                    window.location.href = 'footer-gallery.html';
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


// ---------------------------------------------------------------------------------------