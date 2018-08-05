import axios from 'axios'
// import ion from 'ion-sound'
import Vue from 'vue'

/*************************************/

var baseURL = "http://smartsort.kazpost.kz/api/v1/"

if(localStorage.getItem("apiUrl") !== null){
  baseURL = localStorage.getItem("apiUrl");
}

var deviceURL = 'http://192.168.1.37/api/v1/leds';

if(localStorage.getItem("deviceip") !== null){
  deviceURL = localStorage.getItem("deviceip");
}

export const $http = axios.create({
  baseURL: baseURL
})

export const $device = axios.create({
  baseURL: deviceURL
})


    

export const $smartsort = {
  auth(user){
    return $http.get('auth?p_user='+user)
  },
  putToBag(barcode,depcode,user){
    return $http.get('sm_home.putToBag',{
      params:{p_wpi:barcode,p_depcode:depcode,p_cpilslogin:user }
    })
    // return $http.get('sm_home.putToBag')
  },
  closeBag(bag,weight,sendmeth,depcode,user){
    return $http.get('sm_home.closeBag',{
      params:{p_bag:bag,p_weight:weight,p_sendmeth:sendmeth,p_depcode:depcode,p_cpilslogin:user }
    })
    // return $http.get(`sm_home.closeBag`)
  },
  sortplan(point){
    return $http.get('sm_home.sortplan',{
      params:{p_depcode:point}
    });
  },
 /* findPlan(){
    let xmls=`<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.webserviceX.NET/">
          <soapenv:Header/>
          <soapenv:Body>
            <web:ConversionRate>
              <web:FromCurrency>INR</web:FromCurrency>
              <web:ToCurrency>USD</web:ToCurrency>
            </web:ConversionRate>
          </soapenv:Body>
        </soapenv:Envelope>`;

        $http.post('http://www.webservicex.com/CurrencyConvertor.asmx?wsdl',
         xmls,
         {headers:
           {'Content-Type': 'text/xml'}
         }).then(res=>{
           console.log(res);
         }).catch(err=>{console.log(err)});
  },*/
}


