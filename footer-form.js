// -----------------------------save the data--------------------------------------

function saveData() {
    var formData = new FormData();
    formData.append('pingNow', document.getElementById('ping_now').value);
    formData.append('text', document.getElementById('text').value);
    formData.append('openHours', document.getElementById('open_hours').value);
    formData.append('footer_title', document.getElementById('footer_title').value);

    var imageFile = document.getElementById('image-input').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    var jwtToken = localStorage.getItem('jwtToken');

    if (!formData.get('pingNow')) {
        alert('Please fill in the Ping Now field.');
        return;
    }

    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }

    fetch('http://localhost:8181/ibg-infotech/auth/save-footer', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': 'Bearer ' + jwtToken,
            },
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Server response:', data);
            if (data.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Saved!',
                    text: 'Footer data has been saved successfully.',
                }).then((result) => {
                    window.location.href = 'Footer.html';
                });
            } else {
                throw new Error(data.error || 'Unknown error occurred.');
            }
        })
        .catch(error => {
            console.error('Error:', error.message);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to save footer data. Please try again.',
            });
        });
}



document.addEventListener('DOMContentLoaded', function() {
    fetchImageData();
    fetchData();
});

// Function to fetch image data from the server API
function fetchData() {
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
            const imagesData = data.data; // Assuming data is an array of image objects

            // Loop through the fetched images and update the src attributes
            imagesData.forEach((imageData, index) => {
                const imageId = index + 1; // Update the id accordingly
                const imageSrc = 'data:image/jpeg;base64,' + imageData.upload_image;

                // Update the src attribute of the corresponding image
                const imageElement = document.getElementById(`image-${imageId}`);
                if (imageElement) {
                    imageElement.src = imageSrc;
                }
            });
        })
        .catch(error => {
            console.error('Error fetching image data:', error);
        });
}

// Call fetchImageData() when the page loads
window.onload = function() {
    fetchData();
};



function fetchImageData() {
    fetch('http://localhost:8181/ibg-infotech/auth/get-all-footer', {
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


// ------------------------------get all the data-------------------------------------

var jwtToken = localStorage.getItem('jwtToken');

document.addEventListener('DOMContentLoaded', getData);


function getData() {
    var jwtToken = localStorage.getItem('jwtToken');

    fetch('http://localhost:8181/ibg-infotech/auth/get-all-footer', {
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
                <td><img src="assets/Image/data:image/jpeg;base64,${item.image}" width="100" height="100"></td>
                <td>
                    <a class="edit-btn" data-id="${item.id}"><i class="ti-pencil"></i>Edit</a>
                    <a class="delete-btn" data-id="${item.id}"><i class="ti-trash"></i>Delete</a>
                </td>
            `;
            tableBody.appendChild(row);

            const editBtn = row.querySelector('.edit-btn');
            editBtn.addEventListener('click', function() {
                const id = editBtn.getAttribute('data-id');
                console.log("Edit button clicked for ID: " + id);

                fetch(`http://localhost:8181/ibg-infotech/auth/get-home-footer/${id}`, {
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

                        localStorage.setItem('updateData', JSON.stringify(data));

                        window.location.href = 'Update-footer.html';
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

    fetch(`http://localhost:8181/ibg-infotech/auth/delete-footer/${id}`, {
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
    var ping_now = document.getElementById('ping_now').value;
    var text = document.getElementById('text').value;
    var open_hours = document.getElementById('open_hours').value;
    var footer_title = document.getElementById('footer_title').value;
    var imageFile = document.getElementById('image-input').files[0];
    var jwtToken = localStorage.getItem('jwtToken');


    if (!ping_now || !text || !open_hours || !footer_title) {
        alert('Please fill in all required fields.');
        return;
    }


    if (!jwtToken) {
        alert('JWT token is missing. Please log in again.');
        return;
    }


    var formData = new FormData();
    formData.append('ping_now', ping_now);
    formData.append('text', text);
    formData.append('open_hours', open_hours);
    formData.append('footer_title', footer_title);
    if (imageFile) {
        formData.append('image', imageFile);
    }


    fetch(`http://localhost:8181/ibg-infotech/auth/update-home-footer/${id}`, {
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

                    window.location.href = 'Footer.html';
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