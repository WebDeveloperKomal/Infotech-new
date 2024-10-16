document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('myForm');
    const successMessage = document.getElementById('successMessage');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission behavior

        // Your form submission logic goes here (e.g., AJAX request)

        // Display the success message
        successMessage.style.display = 'block';
    });
});