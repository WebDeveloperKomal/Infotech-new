function saveContactForm1() {

    var contactform = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phoneNumber: document.getElementById('phoneNumber').value,
        company: document.getElementById('company').value,
        message: document.getElementById('message').value
    }


    console.log(JSON.stringify(contactform));

    if (contactform != null) {
        alert("message sent successfully!")
    }


    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');


    fetch("http://localhost:8080/add-form", {
        method: 'POST',
        body: JSON.stringify(contactform),
        headers: headers,
    })


        .then(response => response.status)
        .then(status => {console.log(status)})
        .catch(error => console.error('Error:', error));

}

// -------------------------------------------------------------------------------------------


