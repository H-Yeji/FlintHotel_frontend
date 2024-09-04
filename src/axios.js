// import axios from 'axios';

// const instance = axios.create({
//   baseURL: 'http://localhost:8080',
//   headers: {
//     'Content-Type': 'application/json'
//   }
// })

// instance.interceptors.request.use(
//   config => {
//     let token = localStorage.getItem('employeetoken') || localStorage.getItem('membertoken')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   error => {
//     return Promise.reject(error)
//   }
// )

// instance.interceptors.response.use(
//     response => response,
//     async error => {
//         if(error.response && error.response.status === 401){
//           if(localStorage.getItem('employeetoken')!=null){
//               localStorage.removeItem('employeetoken')
//           } else if(localStorage.getItem('membertoken')!=null){
//               localStorage.removeItem('membertoken')
//           } else{
//               console.log('로그인하세요')
//           }
//         }
//         return Promise.reject(error)
//   }
// )


// export default instance