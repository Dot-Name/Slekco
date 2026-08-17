// Small, dependency-free validators shared by every form in the app.
export const rules = {
  required: (label) => (v) => (v && String(v).trim() ? '' : `${label} is required.`),
  email: () => (v) => (/^\S+@\S+\.\S+$/.test(String(v).trim()) ? '' : 'Enter an email in the form name@domain.com.'),
  minLength: (n, label) => (v) =>
    String(v).trim().length >= n ? '' : `${label} needs at least ${n} characters.`,
  phone: () => (v) =>
    !v || /^[0-9+\-\s]{7,15}$/.test(String(v).trim()) ? '' : 'Use digits, spaces, + or - only.',
  postalCode: () => (v) => (/^\d{6}$/.test(String(v).trim()) ? '' : 'Indian PIN codes are 6 digits.'),
};

/** Runs a { field: [validators] } schema against values, returns { field: message }. */
export function validate(values, schema) {
  const errors = {};
  for (const [field, checks] of Object.entries(schema)) {
    for (const check of checks) {
      const message = check(values[field] ?? '');
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }
  return errors;
}
