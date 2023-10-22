export const BACKEND_URL =
  process.env.ENV !== "production"
    ? "http://localhost:3001/"
    : "https://mind-journal-production.up.railway.app/";
