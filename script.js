$(document).ready(function() {
    // Initialize the circular progress bar
    var bar = new ProgressBar.Circle('#gpa-container', {
        color: '#E0E2E6',
        strokeWidth: 8,
        trailWidth: 8,
        easing: 'easeInOut',
        duration: 1000,
        text: {
            autoStyleContainer: false
        },
        from: { color: '#FF0000', width: 8 },
        to: { color: '#1E1F4A', width: 8 },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = (circle.value() * 4).toFixed(2);
            if (value === 0) {
                circle.setText('0.00');
            } else {
                circle.setText(value);
            }

            // Set text color to black and add "GPA" label
            circle.text.style.color = '#000000';
            circle.text.style.textAlign= "center";
            var textNode = document.createElement('div');
            textNode.innerHTML = 'GPA';
            textNode.style.fontSize = '1.8rem';
            textNode.style.fontWeight = '700';
            textNode.style.color = '#000000';
            textNode.style.textAlign = 'center'
            circle.text.appendChild(textNode);
        }
    });
    bar.text.style.fontFamily = '"colfax", sans-serif';
    bar.text.style.fontSize = '2rem';

    var requiredBar = new ProgressBar.Circle('#required-gpa-container', {
        color: '#E0E2E6',
        strokeWidth: 8,
        trailWidth: 8,
        easing: 'easeInOut',
        duration: 1000,
        text: {
            autoStyleContainer: false
        },
        from: { color: '#FF0000', width: 8 },
        to: { color: '#1E1F4A', width: 8 },
        step: function(state, circle) {
            circle.path.setAttribute('stroke', state.color);
            circle.path.setAttribute('stroke-width', state.width);

            var value = (circle.value() * 4).toFixed(2);
            if (value === 0) {
                circle.setText('0.00');
            } else {
                circle.setText(value);
            }
            circle.text.style.textAlign= "center";
            // Set text color to black and add "Required GPA" label
            circle.text.style.color = '#000000';
            circle.text.innerHTML = value + '<div style="font-size: 1.1rem; color: #000000; font-weight:700;">Required GPA</div>';
        }
    });
    requiredBar.text.style.fontFamily = '"colfax", sans-serif';
    requiredBar.text.style.fontSize = '2rem';

    // Function to add a new course input row
    $('#add-course').click(function() {
        $('#course-container').append(`
        <div class="course">
            <div class="course-input">
                <input type="text" class="course-name" placeholder="Course">
                <!-- <input type="number" class="course-gpa" placeholder="GPA" step="0.01" min="0" max="4"> -->
                <select class="course-gpa">
                    <option selected="selected" disabled="disabled" hidden="hidden">GPA</option>
                    <option value="4.00">4.00</option>
                    <option value="3.66">3.66</option>
                    <option value="3.33">3.33</option>
                    <option value="3.00">3.00</option>
                    <option value="2.66">2.66</option>
                    <option value="2.33">2.33</option>
                    <option value="2.00">2.00</option>
                    <option value="1.66">1.66</option>
                    <option value="1.33">1.33</option>
                    <option value="1.00">1.00</option>
                    <option value="0.00">0.00</option>
                  </select>
                <input type="number" class="course-credits" placeholder="Credit Hours" min="0">
            </div>
            <div class="remove-course"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="grey"><path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg></div>
        </div>
        `);
    });

    $(document).on('change', '.course-gpa', function() {
        if ($(this).val() !== "") {
            $(this).css('color', 'black');
        } else {
            $(this).css('color', 'grey');
        }
    });

    // Function to remove a course input row
    $(document).on('click', '.remove-course', function() {
        $(this).closest('.course').remove();
        calculateGPA();
    });

    // Function to calculate GPA
    $(document).on('input', '.course-gpa, .course-credits', function() {
        calculateGPA();
    });

    $('.course-credits').on('input', function() {
        let credits = parseFloat($(this).val());
        if (credits <= 0) {
            alert('Please enter a value greater than 0');
            $(this).val('');
        }
    });

    function calculateGPA() {
        let totalPoints = 0;
        let totalCredits = 0;
    
        $('.course').each(function() {
            let gpa = parseFloat($(this).find('.course-gpa').val());
            let credits = parseFloat($(this).find('.course-credits').val());
    
            if (!isNaN(gpa) && !isNaN(credits)) {
                totalPoints += gpa * credits;
                totalCredits += credits;
            }
        });
    
        let gpaResult = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
        $('#gpa-result').text(gpaResult);
        bar.animate(gpaResult / 4); // Assuming 4 is the maximum GPA
    
        // Update GPA instructions
        if (totalCredits > 0) {
        let remarks = '';
        if (gpaResult >= 3.5) {
            remarks = 'Excellent';
        } else if (gpaResult >= 3.0) {
            remarks = 'Very Good';
        } else if (gpaResult >= 2.5) {
            remarks = 'Good';
        } else if (gpaResult >= 2.0) {
            remarks = 'Satisfactory';
        } else if (gpaResult >= 1.5) {
            remarks = 'Pass';
        } else if (gpaResult >= 1.0) {
            remarks = 'Low Pass';
        } else {
            remarks = 'Fail';
        }
    
        $('.gpa-instruction').html(`
            <p class="text mb-1">Based on COMSATS' GPA policy, this calculator lets you enter course details, GPA, and credits for instant results.</p>
            <p class="result mb-1">Detailed Result</p>
            <p class="text mb-1">Total Credit Hours: ${totalCredits}</p>
            <p class="text mb-1">Total Points: ${totalPoints.toFixed(2)}</p>
            <p class="text mb-1">GPA: ${gpaResult}</p>
            <hr>
            <p class="text mt-1">${remarks}</p>
        `);
        }else{
        $('.gpa-instruction').html(`
            <p class="text mb-1">Based on COMSATS' GPA policy, this calculator lets you enter course details, GPA, and credits for instant results.</p>
            <p class="result mb-1">Detailed Result</p>
            <p class="text mb-1">Total Credit Hours: 0</p>
            <p class="text mb-1">Total Points: 0.00</p>
            <p class="text mb-1">GPA: 0.00</p>
            <hr>
            <p class="text mt-1"></p>
        `)
        }
    }
    


    function showErrorMessage(inputId, message) {
        $(`#${inputId}-error`).text(message).css('color', 'red');
    }

    function clearErrorMessage(inputId) {
        $(`#${inputId}-error`).text('');
    }

    function validateField(fieldId, min, max) {
        let value = parseFloat($(`#${fieldId}`).val());
        if(fieldId === 'current-cgpa' || fieldId === 'target-gpa'){
        if (value === null || (value >= min && value <= max)) {
            clearErrorMessage(fieldId);
            return true;
        } else {
            showErrorMessage(fieldId, `Please enter a valid value between ${min} and ${max}.`);
            return false;
        }
    } else{
        if (isNaN(value) || value <= min) {
            showErrorMessage(fieldId, `Please enter a value greater than ${min}`);
            return false;
        } else {
            clearErrorMessage(fieldId);
            return true;
        }
    }
    }

    function validateInputs() {
        let isCurrentCGPAValid = validateField('current-cgpa', 0, 4);
        let isCurrentCreditsValid = validateField('current-credits', 0, Infinity);
        let isTargetGPAValid = validateField('target-gpa', 0, 4);
        let isTargetCreditsValid = validateField('target-credits', 0, Infinity);

        return isCurrentCGPAValid && isCurrentCreditsValid && isTargetGPAValid && isTargetCreditsValid;
    }

    function calculateRequiredGPA() {
        let currentCGPA = parseFloat($('#current-cgpa').val());
        let currentCredits = parseFloat($('#current-credits').val());
        let targetGPA = parseFloat($('#target-gpa').val());
        let targetCredits = parseFloat($('#target-credits').val());

        let totalCurrentPoints = currentCGPA * currentCredits;
        let totalTargetPoints = targetGPA * (currentCredits + targetCredits);
        let requiredGPA = ((totalTargetPoints - totalCurrentPoints) / targetCredits).toFixed(2);

        if (requiredGPA > 4) {
            $('#required-gpa-result').text("Not Possible");
            requiredBar.set(1); // Fill the bar to 100%
            requiredBar.text.style.color = '#FF0000'; // Change text color to red
            requiredBar.text.innerHTML = 'Not Possible';

            // Update Required GPA instructions for "Not Possible"
            $('.required-gpa-instruction').html(`
                <p class="text mb-1">Determine the minimum GPA needed in future courses to raise or maintain your desired GPA level.</p>
                <p class="result mb-1">Detailed Result</p>
                <p class="text mb-1">Desired GPA: ${targetGPA}</p>
                <p class="text mb-1">Current CGPA: ${currentCGPA}</p>
                <p class="text mb-1">Additional Credits: ${targetCredits}</p>
                <p class="text mb-1" style="color:#FF0000;">Required GPA: Not Possible</p>
                <hr>
                <p class="text mt-1" style="color:#FF0000;">Achieving the desired GPA is not possible with the given credits.</p>
            `);
        } else if (requiredGPA <= 0) {
            $('#required-gpa-result').text("0");
            requiredBar.set(0); // Fill the bar to 0%
            requiredBar.text.style.color = '#000000'; // Change text color to black
            requiredBar.text.innerHTML = '0';

            // Update Required GPA instructions for "0"
            $('.required-gpa-instruction').html(`
                <p class="text mb-1">Determine the minimum GPA needed in future courses to raise or maintain your desired GPA level.</p>
                <p class="result mb-1">Detailed Result</p>
                <p class="text mb-1">Desired GPA: ${targetGPA}</p>
                <p class="text mb-1">Current CGPA: ${currentCGPA}</p>
                <p class="text mb-1">Additional Credits: ${targetCredits}</p>
                <p class="text mb-1">Required GPA: 0</p>
                <hr>
                <p class="text mt-1" style="color:#FF0000;">You do not need any GPA to achieve the desired GPA.</p>
            `);
        } else {
            $('#required-gpa-result').text(requiredGPA);
            requiredBar.animate(requiredGPA / 4);

            // Update Required GPA instructions
            let remarks = '';
            if (requiredGPA >= 3.5) {
                remarks = 'You need an Excellent performance';
            } else if (requiredGPA >= 3.0) {
                remarks = 'You need a Very Good performance';
            } else if (requiredGPA >= 2.5) {
                remarks = 'You need a Good performance';
            } else if (requiredGPA >= 2.0) {
                remarks = 'You need a Satisfactory performance';
            } else if (requiredGPA >= 1.5) {
                remarks = 'You need a Pass performance';
            } else if (requiredGPA >= 1.0) {
                remarks = 'You need a Low Pass performance';
            } else {
                remarks = 'You need a Fail performance';
            }

            $('.required-gpa-instruction').html(`
                <p class="text mb-1">Determine the minimum GPA needed in future courses to raise or maintain your desired GPA level.</p>
                <p class="result mb-1">Detailed Result</p>
                <p class="text mb-1">Desired GPA: ${targetGPA}</p>
                <p class="text mb-1">Current CGPA: ${currentCGPA}</p>
                <p class="text mb-1">Additional Credits: ${targetCredits}</p>
                <p class="text mb-1">Required GPA: ${requiredGPA}</p>
                <hr>
                <p class="text mt-1">${remarks}</p>
            `);
        }
    }

    // Add input event listeners for real-time validation
    $('#current-cgpa, #current-credits, #target-gpa, #target-credits').on('input', function() {
        validateField(this.id, this.min, this.max);
    });

    $('#calculate-required-gpa').click(function() {
        if (validateInputs()) {
            calculateRequiredGPA(); }
        // } else {
        //     alert("Please enter valid values in the fields.");
        // }
    });

// Function to show GPA Calculator and scroll to top
function showGPACalculator() {
    $('#gpa-calculator').show();
    $('#cgpa-calculator').hide();
    $('#calculator-type').val('gpa'); // Update select field value
    $('html, body').animate({
        scrollTop: $('#gpa-calculator').offset().top - 20 // Scroll to GPA calculator
    }, 500);
}

// Function to show CGPA Calculator and scroll to it
function showCGPACalculator() {
    $('#gpa-calculator').hide();
    $('#cgpa-calculator').show();
    $('#calculator-type').val('cgpa'); // Update select field value
    $('html, body').animate({
        scrollTop: $('#cgpa-calculator').offset().top - 20 // Scroll to CGPA calculator
    }, 500);
}


// Event handler for clicking on GPA Calculator link
$('#gpa-link').click(function() {
    showGPACalculator();
});

// Event handler for clicking on CGPA Calculator link
$('#cgpa-link').click(function() {
    showCGPACalculator();
});

// Event handler for changing calculator type from select field
$('#calculator-type').change(function() {
    var selectedCalculator = $(this).val();
    
    if (selectedCalculator === 'gpa') {
        showGPACalculator();
    } else if (selectedCalculator === 'cgpa') {
        showCGPACalculator();
    }
});
     

    $('.fb').click(function() {
        $('#feedbackDialog').show();
    });

    // Close dialog when close button is clicked
    $('#closeDialogBtn').click(function() {
        $('#feedbackDialog').hide();
    });
    $('#closeDialogSuccessBtn').click(function() {
        $('#feedbackResult').hide();
    });

    // Handle form submission
    $('#feedbackForm').submit(function(e) {
        e.preventDefault();
        // Get form values
        var fullname = $('#fullname').val();
        var email = $('#email').val();
        var message = $('#message').val();

        // Validate form fields (you can add more validation as needed)
        if (fullname.trim() === '' || email.trim() === '' || message.trim() === '') {
            alert('Please fill in all fields');
            return;
        }

        // Send email using EmailJS
        emailjs.send("service_teiwvjf", "template_z38nehr", {
            name: fullname,
            email: email,
            message: message
        },"i_sIGUfnwlsJYGhnH").then(function(response) {
            $('#feedbackForm')[0].reset(); // Reset form after successful submission
            $('#feedbackDialog').hide();
            $('#feedbackResult').show();
        }, function(error) {
            console.log('Error sending email:', error);
            alert('Error sending feedback. Please try again later.');
        });
    });
});