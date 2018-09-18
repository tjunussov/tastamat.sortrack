import axios from 'axios'
import ion from 'ion-sound'
import Vue from 'vue'

/*************************************/

export var baseURL = "http://smartsort.kazpost.kz/api/v1/"

if(localStorage.getItem("apiUrl") !== null){
  baseURL = localStorage.getItem("apiUrl");
}

export var deviceURL = 'http://192.168.10.10/api/v1/leds';

if(localStorage.getItem("deviceip") !== null){
  deviceURL = localStorage.getItem("deviceip");
}

export const $http = axios.create({
  baseURL: baseURL
})


export const $device = axios.create({
  baseURL: deviceURL
})


// ion.sound({
//     sounds: [
//         {
//             name: "search1"
//         },
//         {
//             name: "found",
//             volume: 0.2
//         },
//         {
//             name: "notfound",
//             // volume: 0.3,
//             // preload: false
//         }
//     ],
//     volume: 0.5,
//     path: "/static/audio/",
//     preload: true
// });

const audioFolder = '/static/audio/supermariobros/'

var search = new Audio();
    search.src = audioFolder+"search.mp3"; // assign the audio file to its src

var search1 = new Audio();
    search1.src = audioFolder+"search1.mp3"; // assign the audio file to its src

var push0 = new Audio();
    push0.src = audioFolder+"push0.mp3";

var push1 = new Audio();
    push1.src = audioFolder+"push1.mp3";

var push2 = new Audio();
    push2.src = audioFolder+"push2.mp3";

var push3 = new Audio();
    push3.src = audioFolder+"push3.mp3";

var push4 = new Audio();
    push4.src = audioFolder+"push4.mp3";

var pushcool = new Audio();
    pushcool.src = audioFolder+"pushcool.mp3";

var pull = new Audio();
    pull.src = audioFolder+"pull.mp3";

var notfound = new Audio();
    notfound.src = audioFolder+"notfound.mp3";

var error = new Audio();
    error.src = audioFolder+"error.mp3";
    
var bindStart = new Audio();
    bindStart.src = audioFolder+"bindstart.mp3";

var bindEnd = new Audio();
    bindEnd.src = audioFolder+"bindend.mp3";

var notBind = new Audio();
    notBind.src = audioFolder+"notbound.mp3";
    
var notPlan = new Audio();
    notPlan.src = audioFolder+"notfoundplan.mp3";

var bind = new Audio();
    bind.src = audioFolder+"bind.mp3";

var closeBag = new Audio();
    closeBag.src = audioFolder+"closebag.mp3";

var registerPoint = new Audio();
    registerPoint.src = audioFolder+"registerpoint.mp3";

var auth = new Audio();
    auth.src = audioFolder+"auth.mp3";

    
var pushCnt = 0;
var pushCntTheme = 0;
var pushes = [push0,push1,push2,push3,push4];
    

export const deviceLEDMixin = {
  methods: {
    $search(user){
      this.$ledon('color=220000&led=all&duration=10&repeat=10000');
      search1.currentTime = 0;
      search1.play();
    },
    $push(user,led){
      this.$ledon(`color=r&led=${led}&duration=1000&repeat=50&pause=500`);
      search1.pause();

      if(pushCnt == 10) {
        pushCntTheme = pushCntTheme + 1
        if(pushCntTheme > pushes.length) pushCntTheme = 0
        pushCnt = 0
        pushcool.play();
      } else {
        pushCnt = pushCnt + 1
        console.log(pushCntTheme,pushes.length)
        pushes[pushCntTheme].currentTime = 0;
        pushes[pushCntTheme].play();
      }
    },
    $pull(user,led){
      this.$ledon(`color=r&led=${led}&duration=100&repeat=3`);
      pull.currentTime = 0;
      pull.play();
    },
    $notFound(user){
      this.$ledon('color=r&led=all&duration=50&repeat=3');
      search1.pause();
      notfound.play();
    },
    $bindStart(){
      this.$ledon('color=all&led=all&duration=1000');
      bindStart.currentTime = 0;
      bindStart.play();
    },
    $bindEnd(){
      this.$ledon('color=all&led=all&duration=100&repeat=3');
      bindEnd.play();
    },
    $closeBag(led){
      this.$ledon(`color=all&led=${led}&duration=100&repeat=50`);
      closeBag.currentTime = 0;
      closeBag.play();
    },
    $printBag(data){
      console.log('printBag',data)
      $device.post('/print',data);
    },
    $bind(led){
      this.$ledon(`color=all&led=${led}&duration=1000&repeat=1000&pause=100`);
      bind.currentTime = 0;
      bind.play()
    },
    $notPlan(){
      this.$ledon('color=r&led=all&duration=50&repeat=3');
      notPlan.currentTime = 0;
      notPlan.play()
    },
    $notBind(){
      this.$ledon('color=r&led=all&duration=50&repeat=3');
      notBind.currentTime = 0;
      notBind.play()
    },
    $error(user){
      this.$ledon('color=r&led=all&duration=50&repeat=3');
      search1.pause();
      error.currentTime = 0;
      error.play();
    },
    $auth(user){
       this.$ledon('color=r&led=all&duration=1000');
       auth.currentTime = 0;
       auth.play();
    },
    $registerPoint(msg){
      this.$ledon('color=all&led=all&duration=1000');
      registerPoint.currentTime = 0;
      registerPoint.play();
    },
    $deletePoint(led){
      this.$ledon(`color=all&led=${led}&duration=100&effect=right`);
    },
    $ledon(param){
      if (typeof param === 'object') param = Object.entries(param).map(e => e.join('=')).join('&');
      $device.get('/on'+param);
    },
    $ledoff(){
      $device.get(`/off`);
    }
  }
};

export const $smartsort = {
  auth(user){
    return $http.get('auth?p_user='+user)
  },
  putToBag(barcode,depcode,user){
    return $http.get('sm_home.putToBag',{
      params:{p_wpi:barcode,p_depcode:depcode,p_cpilslogin:user }
    }).then((resp)=>{
      if(resp.data.error) return Promise.reject(resp.data.error);
      return resp;
    }).catch((error)=>{
      if(error.response && error.response.data.error) 
        throw error.response.data.error
      else if(error.message == 'Network Error')
        return Promise.reject('Проблема с сетью, '+baseURL+' сервис недоступен');
      else throw error
    })
    // return $http.get('sm_home.putToBag')
  },
  closeBag(bag,weight,sendmeth,depcode,user){
    return $http.get('sm_home.closeBag',{
      params:{p_bag:bag,p_weight:weight,p_sendmeth:sendmeth,p_depcode:depcode,p_cpilslogin:user }
    }).then((resp)=>{
      if(resp.data.error) return Promise.reject(resp.data.error);
      return resp;
    })
    // return $http.get(`sm_home.closeBag`)
  },
  sortplan(depcode){
    return $http.get('sm_home.sortplan',{
      params:{p_depcode:depcode}
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



var audioURL = '/static/audio/supermariobros/';

export const $sounds = {
  search: new Audio(audioURL+"search.mp3"), // assign the audio file to its src
  search1: new Audio(audioURL+"search1.mp3"), // assign the audio file to its src
  push0: new Audio(audioURL+"push0.mp3"),
  push1: new Audio(audioURL+"push1.mp3"),
  push2: new Audio(audioURL+"push2.mp3"),
  push3: new Audio(audioURL+"push3.mp3"),
  push4: new Audio(audioURL+"push4.mp3"),
  
  pushcool: new Audio(audioURL+"pushcool.mp3"),
  pull: new Audio(audioURL+"pull.mp3"),
  notfound: new Audio(audioURL+"notfound.mp3"),
  error: new Audio(audioURL+"error.mp3"),
  bindstart: new Audio(audioURL+"bindstart.mp3"),
  bindend: new Audio(audioURL+"bindend.mp3"),
  notbound: new Audio(audioURL+"notbound.mp3"),
  notfoundplan: new Audio(audioURL+"notfoundplan.mp3"),
  bind: new Audio(audioURL+"bind.mp3"),
  selectbag: new Audio(audioURL+"bind.mp3"),
  deselectbag: new Audio(audioURL+"auth.mp3"),  
  closebag: new Audio(audioURL+"closebag.mp3"),
  registerpoint: new Audio(audioURL+"registerpoint.mp3"),
  auth: new Audio(audioURL+"auth.mp3"),

  play(snd){
    if(snd == 'push')
      this.playPush()
    else {
      this[snd].currentTime = 0
      this[snd].play();
    }
  },
  pushes(){ return [this.push0,this.push1,this.push2,this.push3,this.push4]},
  pushCnt:0,
  pushCntTheme:0,
  playPush(){
    if(this.pushCnt == 5) {
      this.pushCntTheme = this.pushCntTheme + 1
      if(this.pushCntTheme > this.pushes().length) this.pushCntTheme = 0
      this.pushCnt = 0
      this.pushcool.play();
    } else {
      this.pushCnt = this.pushCnt + 1
      this.pushes()[this.pushCntTheme].currentTime = 0;
      this.pushes()[this.pushCntTheme].play();
    }
  }
}

export const $leds = {
  search(user){
    this.$ledon({color:'220000',led:'all',duration:10,repeat:10000});
  },
  push(led){
    this.$ledon({color:'r',led,duration:1000,repeat:50,pause:500});
  },
  pull(led){
    this.$ledon({color:'r',led,duration:100,repeat:3});
  },
  notfound(user){
    this.$ledon({color:'r',led:'all',duration:50,repeat:3});
  },
  bindstart(){
    this.$ledon({color:'all',led:'all',duration:1000});
  },
  bindend(){
    this.$ledon({color:'all',led:'all',duration:100,repeat:3});
  },
  selectbag(led){
    this.$ledon({color:'all',led,duration:500,repeat:1000});
  },
  closebag(led){
    this.$ledon({color:'all',led,duration:100,repeat:3});
  },
  deselectbag(led){
    this.$ledon({color:'all',led,duration:100,repeat:1});
  },
  printbag(data){
    $device.post('/print',data);
  },
  printbagTest(){
    $device.get('/testprint');
  },
  bind(led){
    this.$ledon({color:'all',led,duration:5000,repeat:1});
  },
  notplan(){
    this.$ledon({color:'r',led:'all',duration:50,repeat:3});
  },
  notbind(){
    this.$ledon({color:'r',led:'all',duration:50,repeat:3});
  },
  error(user){
    this.$ledon({color:'r',led:'all',duration:50,repeat:3});
  },
  auth(user){
     this.$ledon({color:'r',led:'all',duration:1000});
  },
  registerpoint(msg){
    this.$ledon({color:'all',led:'all',duration:1000});
  },
  deletepoint(led){
    this.$ledon({color:'all',led,duration:100,effect:'right'});
  },
  $ledon(params){
    $device.get('/on',{params});
  },
  $ledoff(){
    $device.get(`/off`);
  },
  on(name,data){
    // console.log(name);
    try { 
      this[name](data);
  } catch(e){
      console.error("Name of led "+name,e);
  }
  }
}