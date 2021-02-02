import axios from "axios";

const baseURL = process.env.BACKEND_URL;
const instance = axios.create({
  baseURL: baseURL
});

const checkCurrentUser = async() =>{
  let result = axios.get('/me');
  return result;
}

// instance.interceptors.request.use((request) => {
//   const username = localStorage.getItem("username");
//   const useremail = localStorage.getItem("useremail");
//   if (!baseURL && !username && !useremail) window.location = '/login'
//   return request;
// })

instance.interceptors.response.use((response) => {
  debugger
  return response;
}, async (error) => {
    let result = await checkCurrentUser();
     console.log(result)
     debugger
    if (401 === error.response.status) {
    } else {
      return Promise.reject(error);
    }
  }
)

export default instance