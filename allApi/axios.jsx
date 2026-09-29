import axios from "axios";

//  if (typeof window !== "undefined") {
//       // Access window object here
//       const hostname = window.location.hostname;
//       // Perform actions with the window object
//        if (hostname.startsWith("www")) {
//     baseURL = "https://www.gohoardings.com/api/";
//   } else {
//     baseURL = "https://gohoardings.com/api/";
//   }
//     }

const baseURL = "/api/";

const instance = axios.create({ baseURL: baseURL });
instance.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export default instance;
