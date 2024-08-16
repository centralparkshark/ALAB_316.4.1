const errorDisplay = document.getElementById("errorDisplay")
const loginForm = document.getElementById("login")
const regForm = document.getElementById("registration")

loginForm.addEventListener('submit', loginUser)
regForm.addEventListener('submit', registerUser)

function registerUser(e) {
    e.preventDefault();
    if (checkIfUserExists(e.target.elements.username.value.toLowerCase())) {
        generateError(e.target.elements.username, "Username taken.")
    } else {
        errorDisplay.innerText = ''
        errorDisplay.style.display = "none";
        let formInputs =  e.target.elements;
        let user =  {username: formInputs.username,
                    email: formInputs.email,
                    password: formInputs.password,
                    passwordCheck: formInputs.passwordCheck}
        let userData =  {username: formInputs.username.value.toLowerCase(),
                        email: formInputs.email.value.toLowerCase(),
                        password: formInputs.password.value}
        
        if (usernameValid(user.username) &&
            emailValid(user.email) &&
            passwordValid(user.password, user.username) &&
            passwordMatch(user.password, user.passwordCheck)) 
        {
            saveUser(userData)
            successRegister(user.username.value)
            e.currentTarget.reset();
        } 
    }
}

function loginUser(e) {
    e.preventDefault()
    let username = e.target.elements.username.value.toLowerCase();
    let password = e.target.elements.password.value;
   
    if(checkIfUserExists(username)) {
        errorDisplay.innerText = ''
        errorDisplay.style.display = "none";
        e.target.elements.username.style.color = "black"
        // check if password right
        const storedUserList = JSON.parse(localStorage.getItem('userList')) || [];
        for (user in storedUserList) {
            if (storedUserList[user].username == username) {
                if (storedUserList[user].password == password) {
                    //e.currentTarget.submit();
                    successLogin(username, e.target.elements.persist.checked);
                    e.currentTarget.reset();
                } else {
                    generateError(e.target.elements.password, "Incorrect password")
                    return false;
                }
            }  
        }
    } else {
        generateError(e.target.elements.username, "User does not exist.")
    }
}

function usernameValid(username) {
    username.style.color = "black"
    // The username must contain at least two unique characters.
    for (letter in username.value) {
        if (username.value[letter] != username.value[0]) {
            return true;
        } 
    }
    generateError(username, "Username must contain at least two unique values.")
}

function emailValid(email) {
    email.style.color = "black"
    // The email must be a valid email address.
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (re.test(email.value.trim())) {
        // The email must not be from the domain "example.com."
        if (!email.value.includes("example.com")) {
            return true;
        } else { 
            generateError(email, "Not a valid email.")
        }
    } else {
        generateError(email, "Not a valid email.")
    }
    
    
}

function passwordValid(password, username) {
    password.style.color = "black"
    // Passwords cannot contain the word "password" (uppercase, lowercase, or mixed).
    if (!password.value.toLowerCase().includes("password")) {
        // Passwords cannot contain the username.
        if (!password.value.includes(username.value)) {
            return true;
        } else {
            generateError(password, "Password cannot contain your username.")
        }
    } else { 
        generateError(password, "Password cannot contain the word 'password'")
    }

}

function passwordMatch(pass, pass2) {
    pass2.style.color = "black"
    // Both passwords must match.
    if (pass.value == pass2.value) {
        return true;
    } else {
        generateError(pass2, "Passwords must match.")
    }
}

function generateError(input, msg) {
    input.style.color = "red"
    let msgEl = document.createElement('p')
    msgEl.innerText = msg
    errorDisplay.append(msgEl)
    errorDisplay.style.display = "inline"
}

function saveUser(user) {
    const storedUserList = JSON.parse(localStorage.getItem('userList')) || [];
    storedUserList.push(user);
    localStorage.setItem('userList', JSON.stringify(storedUserList));
}

function checkIfUserExists(username) {
    const storedUserList = JSON.parse(localStorage.getItem('userList')) || [];
    for (user in storedUserList) {
        if (storedUserList[user].username == username.toLowerCase()) {
            return true;
        }  
    }
    return false;
}

function successLogin(username, persist) {
    const main = document.getElementById("main")
    if (persist) {
        main.innerHTML = `Successful login, ${username}. You will stay logged in.`
    } else {
        main.innerHTML = `Successful login, ${username}.`
    }
}

function successRegister(username) {
    const main = document.getElementById("main")
    main.innerHTML = `You have successfully registered ${username}!`
}