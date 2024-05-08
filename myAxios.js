export default {
  get(url) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const response = { data: { /* Response data */ } };
        resolve(response);
      }, 1000);
    });
  },
  // Add other methods like post, put, delete if needed
};
