module.exports.fantasySheltersSignupValidation = function({ firstname, lastname , email, password }){
    
    let validated = true;
    let displayMessage = {};
    if(firstname.trim().length === 0){
         validated = false;
         displayMessage.firstname = "Please enter your first name"
    }
    
    if(lastname.trim().length === 0){
         validated = false;
         displayMessage.lastname = "Please enter your last name"
    }

    //regexForEmail is taken from stack overflow
    const regexForEmail = /@/g;
    const matchEmail = email.match(regexForEmail);
    
    if(email.trim().length === 0){
    validated = false;
    displayMessage.email = "Please enter a email"
    }

    else if(!matchEmail){
     validated = false;
     displayMessage.email = 'Please enter a valid email'
    }
   
 
    //regexForPswd is taken from stackoverflow
    const regexForPswd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    const matchPswd = password.match(regexForPswd);
    if(!matchPswd){
         validated = false;
         displayMessage.password = 'Please enter a password that is between 8 to 12 characters and contains at least one lowercase letter, uppercase letter, number and a symbol.'
       
    }
    if(password.trim().length === 0){
         validated = false;
         displayMessage.password = "Please enter a password"
    }

    return {
         validated, displayMessage
    };
}

module.exports.fantasySheltersLoginValidation = function({email,password}){
   let validated = true;
   let displayMessage = {}; 
   const regexEmail = /@/g;
   const emailMatched = email.match(regexEmail);
   const regexForPswd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
   const pswdMatched = password.match(regexForPswd);
   

if(email.trim().length === 0){
    validated = false;
    displayMessage.email = "Please enter email address"
}
else if(!emailMatched){
     validated = false;
     displayMessage.email = 'Please enter a valid email'
}

if(password.trim().length === 0){
    validated = false;
    displayMessage.password = "Please enter your password"
}

else if(!pswdMatched){
     validated = false;
     displayMessage.password = 'Please enter a password that is between 8 to 12 characters and contains at least one lowercase letter, uppercase letter, number and a symbol.'  
}

return {
     validated, displayMessage
};

}