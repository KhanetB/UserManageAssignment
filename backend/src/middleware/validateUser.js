export function validateUser(req, res, next) {
  const firstName = typeof req.body.firstName === 'string' ? req.body.firstName.trim() : '';
  const lastName = typeof req.body.lastName === 'string' ? req.body.lastName.trim() : '';
  const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  const errors = {};
  if (!firstName) errors.firstName = 'First name is required.';
  else if (firstName.length > 100) errors.firstName = 'First name must be 100 characters or fewer.';

  if (!lastName) errors.lastName = 'Last name is required.';
  else if (lastName.length > 100) errors.lastName = 'Last name must be 100 characters or fewer.';

  if (!phone) errors.phone = 'Phone is required.';
  else if (phone.length > 20) errors.phone = 'Phone must be 20 characters or fewer.';

  if (!email) errors.email = 'Email is required.';
  else if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Please correct the form fields.', errors });
  }

  req.validatedUser = { firstName, lastName, phone, email };
  next();
}
