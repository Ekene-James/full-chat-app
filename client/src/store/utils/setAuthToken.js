import axios from "axios";
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common["AUTHORIZATION"] = `Bearer ${token}`;
   
  } else {
    delete axios.defaults.headers.common["AUTHORIZATION"];
    
  }
};
export default setAuthToken;
