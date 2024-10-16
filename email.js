

function saveData() {
    var email = document.getElementById('emailInput').value;

    fetch('http://localhost:8181/ibg-infotech/auth/subscribe?email=' + encodeURIComponent(email), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
                title: 'Subscribed!',
                text: 'You have subscribed successfully.',
            }).then((result) => {
                document.getElementById('emailInput').value = '';
                // window.location.href = 'index.html'; 
                // Redirect to index.html after successful subscription
            });
        })
        .catch(error => {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to subscribe. Please try again.',
            });
        });
}