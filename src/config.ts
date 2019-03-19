export const config = {
  server: {
    baseUrl: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : ''
  }
};
