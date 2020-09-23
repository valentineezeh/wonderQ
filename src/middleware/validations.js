// Validate message input by an authenticated user of userType producer
const validateMessageInput = (req, res, next) => {
  const errors = {};
  const { message } = req.body;
  if (message === '' || !message || message.trim().length === 0) {
    errors.message = 'You are yet to input a message';
  }
  if (Object.entries(errors).length === 0) {
    next();
  } else {
    return res.status(400).json({
      message: errors.message
    });
  }
};

// Function to check that validity of an email inputted by a user
const validateEmail = (email) => {
  const checkEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return checkEmail.test(String(email).toLowerCase());
};

// Validate login input from user
const validateLoginInput = (req, res, next) => {
  const errors = {}
  const { email, password } = req.body;
  if (email === '' || !email || email.trim().length === 0 ) {
    errors.email = 'You are yet to input your email';
  }
  if (password === '' || !password || password.trim().length === 0 ) {
    errors.password = 'You are yet to input your email';
  }
  if (!validateEmail(email.trim())) {
    errors.email = 'Invalid email format';
  }
  if (Object.entries(errors).length === 0) {
    next();
  } else {
    return res.status(400).json({
      data: errors
    });
  }
};

export { validateMessageInput, validateLoginInput };
