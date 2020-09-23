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

const validateCheckMessageInput = (req, res, next) => {
  const errors = {};
  const { messageId } = req.body;
  if (messageId === '' || !messageId || messageId.trim().length === 0) {
    errors.message = 'You are yet to input a message id';
  }
  if (Object.entries(errors).length === 0) {
    next();
  } else {
    return res.status(400).json({
      message: errors.message
    });
  }
}

export { validateMessageInput, validateCheckMessageInput };
