function saveContactUsForm() {

    var contactUsForm = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phoneNumber: document.getElementById("phoneNumber").value,
        services: document.getElementById("services").value,
        message: document.getElementById("message").value,

    }

    console.log(JSON.stringify(contactUsForm));

    if (contactUsForm != null) {
        alert("Send mesage successfully!")
    }

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');


    fetch("http://localhost:8080/contact-us", {
        method: 'POST',
        body: JSON.stringify(contactUsForm),
        headers: headers,
    })

        .then(response => response.json())
        .then(json => console.log(json))
        .catch(error => console.error('Error:', error));

}



// ************************************************************************



// function saveContactUsForm() {
//     var name = document.getElementById("name").value;
//     var email = document.getElementById("email").value;
//     var phoneNumber = document.getElementById("phoneNumber").value;
//     var services = document.getElementById("services").value;
//     var message = document.getElementById("message").value;

//     // Basic validation checks
//     if (name === "") {
//         alert("Please enter your name");
//         return;
//     }

//     if (email === "") {
//         alert("Please enter your email");
//         return;
//     } else if (!isValidEmail(email)) {
//         alert("Please enter a valid email address");
//         return;
//     }

//     if (services === "") {
//         alert("Please select a service");
//         return;
//     }

//     if (message === "") {
//         alert("Please enter your message");
//         return;
//     }

//     var contactUsForm = {
//         name: name,
//         email: email,
//         phoneNumber: phoneNumber,
//         services: services,
//         message: message,
//     }

//     console.log(JSON.stringify(contactUsForm));

//     let headers = new Headers();
//     headers.append('Content-Type', 'application/json');
//     headers.append('Accept', 'application/json');


//     fetch("http://localhost:8080/contact-us", {
//         method: 'POST',
//         body: JSON.stringify(contactUsForm),
//         headers: headers,
//     })

//         .then(response => response.json())
//         .then(json => console.log(json))
//         .catch(error => console.error('Error:', error));

// }

// function isValidEmail(email) {
//     // Basic email validation regex, you can improve it
//     var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
// }





