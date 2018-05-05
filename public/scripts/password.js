const signUpP = document.getElementById('signUpPassword');
const lowerCaseLetters = /[a-z]/g;
const numbers = /[0-9]/g;
const upperCaseLetters = /[A-Z]/g;

// When the user clicks on the password field, show the message box
signUpP.onfocus = () => {
    document.getElementById('passwordReqs').style.display = 'block';
};

// When the user clicks outside of the password field, hide the message box
signUpP.onblur = () => {
    document.getElementById('passwordReqs').style.display = 'none';
    signUpP.classList.remove('badInputField');
};

// When the user starts to type something inside the password field
signUpP.onkeyup = () => {
    if ((signUpP.value.match(lowerCaseLetters))
        && (signUpP.value.match(upperCaseLetters))
        && (signUpP.value.match(numbers)) && (signUpP.value.length >= 8)) {
        signUpP.classList.remove('badInputField');
    } else {
        signUpP.classList.add('badInputField');
    }
};


const signUpU = document.getElementById('signUpUsername');

// When the user clicks on the username field, show the message box
signUpU.onfocus = () => {
    document.getElementById('usernameReqs').style.display = 'block';
};

// When the user clicks outside of the username field, hide the message box
signUpU.onblur = () => {
    document.getElementById('usernameReqs').style.display = 'none';
    signUpU.classList.remove('badInputField');
};

// When the user starts to type something inside the username field
signUpU.onkeyup = () => {
    if (((signUpU.value.match(lowerCaseLetters))
        || (signUpU.value.match(upperCaseLetters))
        || (signUpU.value.match(numbers)))
        && (signUpU.value.length >= 5)
        && (signUpU.value.length <= 20)) {
        signUpU.classList.remove('badInputField');
    } else {
        signUpU.classList.add('badInputField');
    }
};


// Adding tooltips to the sign up areas
document.getElementById('signUpUsername').addEventListener('focusout', () => {
    document.getElementById('signUpUsernameReqs').classList.toggle('toolTipHide');
});

document.getElementById('signUpUsername').addEventListener('focus', () => {
    document.getElementById('signUpUsernameReqs').classList.toggle('toolTipHide');
});

document.getElementById('signUpPassword').addEventListener('focusout', () => {
    document.getElementById('signUpPasswordReqs').classList.toggle('toolTipHide');
});

document.getElementById('signUpPassword').addEventListener('focus', () => {
    document.getElementById('signUpPasswordReqs').classList.toggle('toolTipHide');
});

$('#signUpModal').on('shown.bs.modal', () => {
    $('#signUpUsername').trigger('focus');
});
