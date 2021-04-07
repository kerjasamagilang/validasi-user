module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const regEx = /^(?=^.{8,15}$)(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?!.*\s).*$/;
  const regExEmail = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  const regExChar = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/;

    const errors = {};
    // Validasi USERNAME
    if(username.trim() === ''){
      errors.username = 'Username tidak boleh kosong';
    } else if(username.length < 8){
      errors.username = 'username harus lebih dari 8'
    }

    // Validasi EMAIL
    if(email.trim() === ''){
      errors.email = 'email tidak boleh kosong';
    } else {
      if (!email.match(regExEmail)) {
        errors.email = 'Email anda tidak valid';
      }
    }

    // Validasi PASSWORD
    if(password === ''){
      errors.password = 'password tidak boleh kosong';
    } else if(password !== confirmPassword) {
        errors.confirmPassword = 'Password harus sesuia';
    } else if(password.length < 8){
        errors.password = 'password miniman 8'
    } else {
      if(!password.match(regExChar)){
        errors.password = 'Password harus mengandung huruf kecil, huruf besar, angka dan spesial karakter min8 max15'
      }
    }

    return {
      errors,
      valid: Object.keys(errors).length < 1 
    }
};

module.exports.validateLoginInput = ( username, password ) => {
  const errors = {};
  if(username.trim() === ''){
    errors.username = 'Username tidak boleh kosong';
  };
  if(password.trim() === ''){
    errors.password = 'Password tidak boleh kosong';
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1 
  }
}