import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import baseUrl from './baseUrl';


// Create a new Axios instance
// const axiosInstance = axios.create({
//     baseURL: baseUrl
// });

// // Add a request interceptor
// axiosInstance.interceptors.request.use(
//     function (config) {
//         // Do something before request is sent
//         const token = JSON.parse(AsyncStorage.getItem('userData'));
//         console.log('check_out', token);
//         // Assuming the token is stored in localStorage
//         if (token) {
//         console.log('from_local_storage_token', token);
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     },
//     function (error) {
//         console.log('from_axios_error', error);
//         // Do something with request error
//         return Promise.reject(error);
//     }
// );

// Create an instance of axios
// const axiosInstance = axios.create({
//   baseURL: baseUrl
// });

// // Add a request interceptor
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     try {
//       // Retrieve the token from AsyncStorage
//       const token = await AsyncStorage.getItem('userData');
//       const bearerToken = await JSON.parse(token);
//       // Log the request method and URL
//       console.log(`${config.method} ${config.url}`);
      
//       // Log the token
//       console.log('check_out', token);
      
//       // If token exists, add it to the request headers
//       if (token) {
//         console.log('from_local_storage_token', bearerToken);
//         config.headers.authorization = `Bearer ${bearerToken}`;
//       }
      
//       // Log token, method, and URL
//       console.log(`token ${token}, ${config.method}, ${config.url}`);
//     } catch (error) {
//       console.error('Error retrieving token:', error);
//     }

//     // Important: request interceptors must return the request.
//     return config;
//   },
//   (error) => {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

// axiosInstance.interceptors.request.use(req => {
//     const token = JSON.parse(AsyncStorage.getItem('userData'));
//     //         console.log('check_out', token);
//     //         // Assuming the token is stored in localStorage
//     console.log(`${req.method} ${req.url}`);
//     console.log('check_out', token);
//     if (token) {
//         console.log('from_local_storage_token', token);
//         config.headers.authorization = `Bearer ${token}`;
//     }
//     console.log(`token ${token}, ${req.method}, ${req.url}`);
//     // Important: request interceptors **must** return the request.
//     return req;
// });

// const retrieveAndParseItem = async () => {
//     try {
//       const jsonString = await AsyncStorage.getItem('token');
//       console.log('token_from_new', jsonString);
//         return jsonString;
//     } catch (error) {
//       // Error retrieving data or parsing JSON
//       console.error('Error retrieving or parsing item:', error);
//       return null;
//     }
//   };

const makeRequest = async (method, url, data) => {
    const jsonString = await AsyncStorage.getItem('token');
    console.log('credentials', url, data);
    try {
      const response = await axios({
        method: method,
        url: `${baseUrl}/${url}`, // Your API base URL + endpoint
        headers: {
          'authorization': jsonString ? `Bearer ${jsonString}`: 'empty',
          'Content-Type': 'application/json' // Adjust content type as needed
        },
        data: data ? data : {}
      });
      return response.data;
    } catch (error) {
        console.log('error', error);
      throw error.response ? error.response.data : error.message;
    }
  };

export default makeRequest;