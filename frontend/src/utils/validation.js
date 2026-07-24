export function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

export function validatePersonalInfo(info) {
  const errors = {};
  if (!info.fullName?.trim()) errors.fullName = 'Full name is required';
  if (!info.email?.trim()) errors.email = 'Email is required';
  else if (!validateEmail(info.email)) errors.email = 'Invalid email format';
  return errors;
}

export function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return month ? `${months[parseInt(month, 10) - 1]} ${year}` : year;
}

export function getErrorMessage(error) {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data?.errors?.[0]?.msg) return error.response.data.errors[0].msg;
  return 'Something went wrong. Please try again.';
}
