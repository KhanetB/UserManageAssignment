export function validateUser(req, res, next) {
  const firstname = typeof req.body.firstname === 'string' ? req.body.firstname.trim() : '';
  const lastname = typeof req.body.lastname === 'string' ? req.body.lastname.trim() : '';
  const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : '';
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  const errors = {};
  if (!firstname) errors.firstname = 'First name is required.';
  else if (firstname.length > 100) errors.firstname = 'First name must be 100 characters or fewer.';

  if (!lastname) errors.lastname = 'Last name is required.';
  else if (lastname.length > 100) errors.lastname = 'Last name must be 100 characters or fewer.';
  
  if (!phone) errors.phone = 'Phone is required.';
  else if (phone.length > 20) errors.phone = 'Phone must be 20 characters or fewer.';

  if (!email) errors.email = 'Email is required.';
  else if (email.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (Object.keys(errors).length) {
    return res.status(400).json({ message: 'Please correct the form fields.', errors });
  }

  req.validatedUser = { firstname, lastname, phone, email };
  next();
}
