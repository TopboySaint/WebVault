import axios from "axios";

// Minimal axios instance (simplified as requested)
// Toggle between local and deployed by commenting/uncommenting lines below.
const instance = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "https://webvault-9uhh.onrender.com",
});

export default instance;
