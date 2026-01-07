export const mapHttpError = (err, fallbackMessage) => {
  if (err.response) {
    const data = err.response;
    if (data?.message) return data.message;
    return fallbackMessage;
  }

  if (err.request) {
    return 'Cannot connect to server. Please check your internet connection.';
  }

  return err.message || fallbackMessage;
};
