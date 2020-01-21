import axios from 'axios'
import ion from 'ion-sound'
import Vue from 'vue'

/*************************************/

export var baseURL = "http://pls-test.post.kz/api/smart-shelves/"
export var deviceURL = 'http://192.168.10.10/';

export const $http = axios.create({
  baseURL: baseURL
})

// export const $device = axios.create({
//   baseURL: deviceURL
// })

export const $device = {
  axioses:null,
  size:24,
  init(ips,size,lastLed,callback){

    console.log('urls %o size:[%s] lastLed:[%s]',ips,size,lastLed);

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
  },
  get(url,params,tab,offAll){

    // console.log("====================",this.axioses,params,tab,offAll);

    if(params.params && ( params.params.led == "all" || params.params.led == "random" )){
      for(var i in this.axioses) 
        if(!(tab == i && offAll)) this.axioses[i](url,params);
    } else 
      return this.axioses[tab](url,params);
  },
  post(url,params,tab){
    return this.axioses[tab](url,params);
  }
};

var wpiReg = new RegExp("([A-Z]{2}[0-9]{9}[A-Z]{2})");

export const $smartsort = {
  auth(user,depcode){
    return $http.get('authorize',{
      params:{login:user,techindex:depcode}
    }).then((resp)=>{
      if(resp.data.result == 'error') return Promise.reject(resp.data.resultInfo);
      return resp;
    })
  },
  fetchDemoRPO(depcode){
    return $http.get('getRPO',{params:{techindex:depcode}}).then((resp)=>{
      console.log("geRPO error",resp.data);
      if(resp.data.result == 'error') return Promise.reject(resp.data.resultInfo);
      return resp;
    })
  },
  putToBag(barcode,depcode,user){

    if(!wpiReg.test(barcode)){
      return Promise.reject(`Неверный формат ШПИ ${barcode} !`);
    }

    return $http.get('findBagIndex',{
      params:{barcode:barcode,techindex:depcode,login:user }
    }).then((resp)=>{
      if(resp.data.result == 'error') return Promise.reject(resp.data.resultInfo);
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
  formBag(bag,barcodesArray,weight,sendmeth,depcode,user,plomba,bagType,taraType,comment){
    return $http.post('formBag',{
      "login": user,
      "techindex": depcode,
      "parentPostIndex": bag,
      "barcodeList": barcodesArray,
      "totalWeight": weight,
      "bagType": bagType,
      "taraType": taraType,
      "sendMethod": sendmeth,
      "plombaNum": plomba,
      "comment": comment
    }).then((resp)=>{
      if(resp.data.error) return Promise.reject(resp.data.resultInfo);
      if(!resp.data) return Promise.reject("CORS Доступ к серверу заблокирован! Проверьте настройки!");
      return resp;
    })
    // return $http.get(`sm_home.closeBag`)
  },
  formBagByPacklist(bag,packListArray,weight,sendmeth,depcode,user,plomba,bagType,taraType,comment){
    return $http.post('formBagByPacklist',{
      "login": user,
      "techindex": depcode,
      "parentPostIndex": bag,
      "packetList": packListArray,
      "totalWeight": weight,
      "bagType": bagType,
      "taraType": taraType,
      "sendMethod": sendmeth,
      "plombaNum": plomba,
      "comment": comment
    }).then((resp)=>{
      if(resp.data.error) return Promise.reject(resp.data.resultInfo);
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
      if(resp.data.error) return Promise.reject(resp.data.resultInfo);
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

export const $sounds = {
  search: new Audio(audioURL+"search.mp3"), // assign the audio file to its src
  search1: new Audio(audioURL+"search1.mp3"), // assign the audio file to its src
  push0: new Audio(audioURL+"push0.mp3"),
  push1: new Audio(audioURL+"push1.mp3"),
  push2: new Audio(audioURL+"push2.mp3"),
  push3: new Audio(audioURL+"push3.mp3"),
  push4: new Audio(audioURL+"push4.mp3"),
  
  forcepush: new Audio(audioURL+"pushcool.mp3"),
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
  deselectbag: new Audio(audioURL+"deselect.mp3"),  
  formb: new Audio(audioURL+"closebag.mp3"),
  formbagbypacklist: new Audio(audioURL+"closebag.mp3"),
  formbag: new Audio(audioURL+"closebag.mp3"),
  registerpoint: new Audio(audioURL+"registerpoint.mp3"),
  login: new Audio(audioURL+"login.mp3"),
  logout: new Audio(audioURL+"logout.mp3"),

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
      if(this.pushCntTheme == this.pushes().length) this.pushCntTheme = 0
      this.pushCnt = 0
      // this.pushcool.play();
    } else {
      this.pushCnt = this.pushCnt + 1
      this.pushes()[this.pushCntTheme].currentTime = 0;
      this.pushes()[this.pushCntTheme].play();
    }
  }
}

export const $leds = {
  thor:null,
  lastThor: null,
  lastLed:23,
  color:'r',
  pushLastLed(){
    setTimeout(()=>{
      console.debug('pushLastLed -->',this.lastLed, this.thor);
      this.thor = this.lastThor;
      this.push(this.lastLed);
    },1000)
  },
  search(user){
    // this.$ledon({color:'r',led:'random',duration:10,repeat:0});
  },
  forcepush(led){

  },
  push(led){
    this.$ledoff();
    this.$ledon({color:'r',led,duration:1000,repeat:300,pause:500});
  },
  test(led){
    this.$ledon({color:'r',led,duration:1000,repeat:50,pause:500});
  },
  pull(led){
    // this.$ledoff();
    // this.$ledon({color:'r',led,duration:100,repeat:3});
  },
  notfound(user){
    this.$ledon({color:'r',led:'all',duration:50,repeat:3,brightness:100});
    this.pushLastLed();
  },
  bindstart(){
    this.$ledon({color:'all',led:'all',duration:1000,brightness:100});
  },
  bindend(){
    this.$ledon({color:'all',led:'all',duration:100,repeat:3,brightness:100});
  },
  selectbag(led){
    this.$ledon({color:'all',led,duration:500,repeat:1000,autoOff:'all'});
  },
  formb(led){
    this.$ledon({color:'all',led,duration:100,repeat:3,autoOff:'all'});
  },
  formbag(led){
    this.$ledon({color:'all',led,duration:100,repeat:3,autoOff:'all'});
  },
  formbagbypacklist(led){
    this.$ledon({color:'all',led,duration:100,repeat:3,autoOff:'all'});
  },
  deselectbag(led){
    this.$ledon({color:'all',led,duration:100,repeat:3,autoOff:'all'});
  },
  printbag(data){
    // $device.post('/print',data);
    $device.post('/proxy',data);
  },
  printbagTest(){
    $device.get('/testprint');
  },
  bind(led){
    this.$ledon({color:'all',led,duration:5000,pause:100,repeat:0});
  },
  notplan(){
    this.$ledon({color:'r',led:'all',duration:50,repeat:3,brightness:100});
    this.pushLastLed();
  },
  notbind(){
    this.$ledon({color:'r',led:'all',duration:50,repeat:3,brightness:100});
    this.pushLastLed();
  },
  error(user){
    this.$ledon({color:'r',led:'all',duration:100,repeat:3,brightness:100});
    this.pushLastLed();
  },
  login(user){
     this.$ledon({color:'r',led:'all',duration:100,brightness:100,repeat:3});
  },
  logout(user){
     this.$ledon({color:'r',led:'all',duration:100,brightness:100,repeat:3});
  },
  registerpoint(msg){
    this.$ledon({color:'all',led:'all',duration:1000,brightness:100,repeat:3});
  },
  deletepoint(led){
    this.$ledon({color:'all',led,duration:100,repeat:3});
  },
  $ledon(params){
    // if(this.thor && this.thor > 0){
    //   // axios.get(`http://192.168.10.1${this.thor}/api/v1/leds`,{params})
    // } else {
      // $device.get(`/off`,{params:{led:'all'}},this.thor,{params});
      params.color = this.color;
      $device.get('/on',{params},this.thor);
    // }
  },
  setColor(color){
    this.color = color;
  },
  $ledoff(){
    $device.get(`/off`,{params:{led:'all'}},this.thor,true);
  },
  on(name,data,thor){
    
    this.thor = thor?thor:0;
    console.debug('ON',name,this.thor);
    try { 
      this[name](data);
  } catch(e){
      console.error("Name of led "+name,e);
  }
  }
}