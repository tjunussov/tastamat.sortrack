import axios from 'axios'
import ion from 'ion-sound'
import Vue from 'vue'

/*************************************/

// export var baseURL = "http://pls-test.post.kz/api/smart-shelves/"
export var baseURL = "/api/polki/"
// export var deviceURL = 'http://192.168.10.10/';

export const $http = axios.create({
  baseURL: baseURL
})

// export const $device = axios.create({
//   baseURL: deviceURL
// })


var wpiReg = new RegExp("([A-Z]{2}[0-9]{9}[A-Z]{2})");

export const $smartsort = {
  auth(user,depcode){
    return $http.get('authorize',{
      params:{login:user,techindex:depcode}
    }).then((resp)=>{
      if(resp.data.error || resp.data.result == 'error') return Promise.reject(resp.data.resultInfo);
      return resp;
    })
  },
  fetchDemoRPO(depcode){
    return $http.get('getRPO',{params:{techindex:depcode}}).then((resp)=>{
      console.log("fetchDemoRPO",resp.data);
      if(resp.data.error || resp.data.result == 'error') return Promise.reject(resp.data.resultInfo);
      return resp;
    }).catch((error)=>{
      if(error.message == 'Network Error')
        return Promise.reject('Проблема с сетью, '+baseURL+' сервис недоступен');
      else 
        return Promise.reject(error.data?error.data:(error.response?error.response.data:error));
        // throw new Error(error.data?error.data:error)
    })
  },
  putToBag(barcode,depcode,user){

    if(!wpiReg.test(barcode)){
      return Promise.reject(`Неверный формат ШПИ ${barcode} !`);
    }

    return $http.get('findBagIndex',{
      params:{barcode:barcode,techindex:depcode,login:user }
    }).then((resp)=>{
      if(resp.data.error || resp.data.result == 'error' || resp.data.result == 'warning') return Promise.reject(resp.data.resultInfo);
      if(!resp.data.parentPostIndex) return Promise.reject('ParentPostIndex not found in response for barcode '+barcode);
      return resp;
    }).catch((error)=>{
      if(error.message == 'Network Error')
        return Promise.reject('Проблема с сетью, '+baseURL+' сервис недоступен');
      else 
        return Promise.reject(error.response?error.response.data:(error.data?error.data:error));
        // throw new Error(error.data?error.data:error)
    })
    // return $http.get('sm_home.putToBag')
  },
  forcePutToBag(barcode,depcode,user){

    if(!wpiReg.test(barcode)){
      return Promise.reject({resultInfo:`Неверный формат ШПИ ${barcode} !`,result:"error"});
    }

    return $http.get('findBagIndex',{
      params:{barcode:barcode,techindex:depcode,login:user }
    }).then((resp)=>{
      if(resp.data.error || resp.data.result == 'error') return Promise.reject(resp.data);
      return resp;
    }).catch((error)=>{
      if(error.message == 'Network Error')
        return Promise.reject('Проблема с сетью, '+baseURL+' сервис недоступен');
      else 
        return Promise.reject(error.data?error.data:error);
        // throw new Error(error.data?error.data:error)
    })
    // return $http.get('sm_home.putToBag')
  },
  formBag(bag,barcodesArray,totalWeight,sendmeth,depcode,user,plomba,bagType,taraType,comment){
    return $http.post('formBag',{
      "login": user,
      "techindex": depcode,
      "parentPostIndex": bag,
      "barcodeList": barcodesArray,
      "totalWeight": totalWeight,
      "bagType": bagType,
      "taraType": taraType,
      "sendMethod": sendmeth,
      "plombaNum": plomba,
      "comment": comment
    }).then((resp)=>{
      if(resp.data.error || resp.data.result == "error") return Promise.reject(resp.data.resultInfo);
      if(!resp.data) return Promise.reject("CORS Доступ к серверу заблокирован! Проверьте настройки!");
      return resp;
    })
    // return $http.get(`sm_home.closeBag`)
  },
  formBagByPacklist(bag,packListArray,totalWeight,sendmeth,depcode,user,plomba,bagType,taraType,comment){
    return $http.post('formBagByPacklist',{
      "login": user,
      "techindex": depcode,
      "parentPostIndex": bag,
      "packetList": packListArray,
      "totalWeight": totalWeight,
      "bagType": bagType,
      "taraType": taraType,
      "sendMethod": sendmeth,
      "plombaNum": plomba,
      "comment": comment
    }).then((resp)=>{
      if(resp.data.error || resp.data.result == "error") return Promise.reject(resp.data.resultInfo);
      if(!resp.data) return Promise.reject("CORS Доступ к серверу заблокирован! Проверьте настройки!");
      return resp;
    })
    // return $http.get(`sm_home.closeBag`)
  },
  formB(bag,barcodeList,count,totalWeight,depcode,user){
    return $http.post('formPacketList',{
      "login": user,
      "techindex": depcode,
      "parentPostIndex": bag,
      "barcodeList": barcodeList,
      "count": count,
      "totalWeight": totalWeight,
      "comment": ""
    }).then((resp)=>{
      if(resp.data.error || resp.data.result == "error") return Promise.reject(resp.data.resultInfo);
      if(!resp.data) return Promise.reject("CORS Доступ к серверу заблокирован! Проверьте настройки!");
      return resp;
    })

  },
  sortplan(depcode){
    return $http.get('listBagIndexes',{
      params:{techindex:depcode}
    }).then((resp)=>{
      if(resp.data.result == 'error') return Promise.reject(resp.data.parentPostIndexes);
      return resp;
    });
  },
}

var audioURL = 'static/audio/supermariobros/';

export const $sound = {
  snd:{},
  init(){
    Object.entries($leds.templates).forEach((file)=>{
      this.snd[file[0]] = new Audio(`${audioURL}${file[1].sound?file[1].sound:file[0]}.mp3`);
      console.debug('snd',file[0], this.snd[file[0]])
    });
    // pushes
    this.snd.pushes = [...new Array(5)];
    this.snd.pushes.forEach((k,i)=>{
      this.snd.pushes[i] = new Audio(`${audioURL}/push${i}.mp3`);
    });
  },
  play(snd){
    if(snd == 'push')
      this.playPush()
    else {
      // console.log(snd,this.snd[snd]);
      this.snd[snd].currentTime = 0
      this.snd[snd].play();
    }
  },
  pushCnt:0,
  pushCntTheme:0,
  playPush(){
    if(this.pushCnt == 5) {
      this.pushCntTheme = this.pushCntTheme + 1
      if(this.pushCntTheme == this.snd.pushes.length) this.pushCntTheme = 0
      this.pushCnt = 0
      this.snd.pushcool.play();
    } else {
      this.pushCnt = this.pushCnt + 1
      this.snd.pushes[this.pushCntTheme].currentTime = 0;
      this.snd.pushes[this.pushCntTheme].play();
    }
  }
}


export const $leds = {
  thor:0,
  lastThor: null,
  lastLed:23,
  color:'r',
  printbag(data){
    // $device.post('/print',data);
    $device.post('/proxy',data);
  },
  printbagTest(){
    $device.get('/testprint');
  },
  templates:{
    // test:             {color:'r',duration:1000,repeat:50,pause:500},
    search:             {color:'r',duration:1000,repeat:300,pause:500},
    push:             {color:'r',duration:1000,repeat:300,pause:500,sound:'push0'},
    forcepush:        {color:'r',duration:1000,repeat:300,pause:500},
    pull:             {color:'r',duration:100,repeat:3},

    error_notfound:   {color:'r',led:'all',duration:50,repeat:3,brightness:100},
    error_notplan:    {color:'r',led:'all',duration:50,repeat:3,brightness:100},
    error_expire_keyboard: {color:'r',led:'all',duration:50,repeat:3,brightness:100,sound:'error_notplan'},
    error_notbind:    {color:'r',led:'all',duration:50,repeat:3,brightness:100},
    error:            {color:'r',led:'all',duration:100,repeat:3,brightness:100},

    selectbag:        {color:'all',duration:500,repeat:1000,autoOff:'all'},
    deselectbag:      {color:'all',duration:100,repeat:3,autoOff:'all'},

    formb:            {color:'all',duration:100,repeat:3,autoOff:'all',sound:'closebag'},
    formbag:          {color:'all',duration:100,repeat:3,autoOff:'all',sound:'closebag'},
    formbagbypacklist:{color:'all',duration:100,repeat:3,autoOff:'all',sound:'closebag'},
    
    bind:             {color:'all',duration:5000,pause:100,repeat:0},
    bindstart:        {color:'all',led:'all',duration:1000,brightness:100},
    bindend:          {color:'all',led:'all',duration:100,repeat:3,brightness:100},
    
    login:            {color:'r',led:'all',duration:100,brightness:100,repeat:3},
    logout:           {color:'r',led:'all',duration:100,brightness:100,repeat:3},
    
    registerpoint:    {color:'all',led:'all',duration:1000,brightness:100,repeat:3},
    deletepoint:      {color:'all',duration:100,repeat:3,sound:'registerpoint'}
  },
  xon({status,color,led,thor}){ //'push',bag.color,bag.led,getters.thor

    console.debug('LED ON',status,color,led,thor);
    var params = this.templates[status];
    params.led = led;
    params.color = color.toLowerCase();

    $device.get('/on',{params},thor);
    // $sound.play(status);
  },
  xoff(color){
    console.debug('LED OFF',color);
    color = color?color.toLowerCase():'all';
    $device.get(`/off`,{params:{led:'all',color}});
  },
}

export const $device = {
  axioses:[],
  size:24,
  lastThorColors:{},
  init(ips,isLedOn,size,lastLed,callback){

    console.log('urls %o size:[%s] lastLed:[%s] isLedOn:[%s]',ips,size,lastLed,isLedOn);

    this.size = size;
    this.axioses = [];

    for(var i in ips){
      
      if(ips[i] == "") continue;

      console.log('==>',ips[i])

      var a = axios.create({
        baseURL:'http://'+ips[i],
        timeout:1000
      });

      a.interceptors.response.use(function (response) {
        return response;
      },callback);

      this.axioses.push(a);

      // lastThor set
      $leds.lastThor = this.axioses.length -1;
    }

     $sound.init();


     // if ledIsLed true, disabling mock of leds
    if(!isLedOn) this.onInit(this.axioses);

  },
  onInit(a){
    console.debug('not overloaded onInit',a)
  },
  get(url,params,thor){

    // console.log("====================",this.axioses,params,tab,offAll);

    if(params.params && ( params.params.led == "all" || params.params.led == "random" )){
      for(var i in this.axioses) 
        this.axioses[i](url,params);
    } else {
      this.resetColors(params.params,thor);
      return this.axioses[thor](url,params);
    }
  },
  post(url,params,thor){
    return this.axioses[thor](url,params);
  },
  resetColors(params,thor){
    var last = this.lastThorColors[params.color];

    if(last != null && last.thor != thor){
      this.axioses[last.thor]('/off',{params:{color:params.color,led:last.led}});
    }
    this.lastThorColors[params.color] = {thor,led:params.led};
  }
};
