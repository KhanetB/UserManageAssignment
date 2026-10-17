export function validateUser(req, res, next) {
  const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
  const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  const errors = {};
  if (!name) errors.name = 'Name is required.';
  else if (name.length > 100) errors.name = 'Name must be 100 characters or fewer.';

  if (!phone) errors.phone = 'Phone is required.';
  else if (phone.length > 20) errors.phone = 'Phone must be 20 characters or fewer.';

  if (!email) errors.email = 'Email is required.';
  else if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Please correct the form fields.', errors });
  }

  req.validatedUser = { name, phone, email };
  next();
}
