import axios from 'axios'
/*************************************/

const baseURL = "https://track.kazpost.kz/api/v2/";
const deviceURL = "http://192.168.1.101";

export const $http = axios.create({
  baseURL: baseURL
})

export const $device = axios.create({
  baseURL: deviceURL,
  // withCredentials: true,
  // headers: {
  // //   Authorization: 'Bearer {token}'
  //   'Accept':'application/hal+json, application/json; q=0.5'
  // }
})


