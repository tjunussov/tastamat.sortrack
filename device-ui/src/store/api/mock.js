// import axios from 'axios'
import {$http,$device} from '@/store/api/http'
import MockAdapter from 'axios-mock-adapter'

export const mock = new MockAdapter($http,{delayResponse:500 })

/*.onGet('/RB508027382SG').reply(200,
  {"trackid":"RB508027382SG","timestamp":"21:56:29 06.04.2018","direction":"IMPORT","status_code":"D","status":"Вручено","x_status_code":"S_ISS","x_status":"Вручено","sender":{"country":"Сингапур","name":"1","address":"1","x_postindex":null},"origin":{"date":"01.04.2018","x_dep_id":"18907","city":"Алматы","dep_name":"Участок по обработке международной почты г. Алматы","postindex":"220096"},"receiver":{"name":"Junnussov T","address":"Astana Saryarka  15","country":"Казахстан","x_postindex":null},"last":{"date":"05.04.2018","x_dep_id":"19465","city":"","dep_name":"Постамат пр. Сарыарка, д. 15, БЦ ИСКЕР","address":"Астана область, г. Астана, пр. Сарыарка, д.15","postindex":"900109"},"delivery":{"date":"05.04.2018","time":"15:41","period_fact":"4","x_period":null,"x_dep_id":"19465","city":"","dep_name":"Постамат пр. Сарыарка, д. 15, БЦ ИСКЕР","address":"Астана область, г. Астана, пр. Сарыарка, д.15","gps":["",""],"phone":"","postindex":"900104"},"storage_period":"","package_type":"Мелкий пакет","category":"Заказное","delivery_method":"Авиа","dispute":"","weight":"менее 1"}
)*/
.onGet('/auth').reply((cfg)=>{
    var resp = JSON.parse(cfg.data)
    return [200,resp];
})
.onGet('/putToBag').reply(200,{
    "user":"ASEL"
  }
)
.onAny('/closeBag').reply((cfg)=>{
    var resp = JSON.parse(cfg.data)
    console.log('mock closeBag',resp);
    if(resp.count > 0)
      return [200,resp];
    else
      return [400,{error:"Мешок пустой!"}]

})
.onGet('/sortplan_json').reply(200,{
    "user":"ASEL"
  }
)
.onGet('/RR000000001KZ').reply(200,{
    "trackid":"RR000000001KZ",
    "status":"Впути",
    "sender":{"country":"Казахстан","name":"ИП Айгерим","address":"г.Тараз ул.Лермнотово 50"},
    "next":{"x_dep_id":"19465","dep_name":"Сарыарка ГОПС 1","address":"Астана область, г. Астана, пр. Сарыарка, д.15","postindex":"010021"},
  }
)
.onGet('/RR000000002KZ').reply(200,{
    "trackid":"RR000000002KZ",
    "status":"Впути",
    "sender":{"country":"Казахстан","name":"ИП Айгерим","address":"г.Тараз ул.Лермнотово 50"},
    "next":{"x_dep_id":"19465","dep_name":"Сарыарка ГОПС 2","address":"Астана область, г. Астана, пр. Акыртас, д.15","postindex":"010022"},
  }
).onGet('/RR000000003KZ').reply(200,{
    "trackid":"RR000000003KZ",
    "status":"Впути",
    "sender":{"country":"Казахстан","name":"ИП Айгерим","address":"г.Тараз ул.Лермнотово 50"},
    "next":{"x_dep_id":"19465","dep_name":"Сарыарка ГОПС 3","address":"Астана область, г. Астана, пр. Сейфулина, д.15","postindex":"010023"},
  }
).onGet('/RR000000004KZ').reply(200,{
    "trackid":"RR000000004KZ",
    "status":"Впути",
    "sender":{"country":"Казахстан","name":"ИП Азамат","address":"г.Караганда ул.Петрова 8"},
    "next":{"x_dep_id":"19465","dep_name":"Есильский ГОПС 1","address":"Астана область, г. Астана, пр. Есиль, д.85","postindex":"010024"},
  }
).onGet('/RR000000005KZ').reply(200,{
    "trackid":"RR000000005KZ",
    "status":"Впути",
    "sender":{"country":"Казахстан","name":"ИП Азамат","address":"г.Караганда ул.Петрова 8"},
    "next":{"x_dep_id":"19465","dep_name":"Есильский ГОПС 2","address":"Астана область, г. Астана, пр. Есиль, д.9","postindex":"010025"},
  }
).onGet('/RR000000006KZ').reply(200,{
    "trackid":"RR000000006KZ",
    "status":"Впути",
    "sender":{"country":"Казахстан","name":"ИП Азамат","address":"г.Караганда ул.Петрова 8"},
    "next":{"x_dep_id":"19465","dep_name":"Алматинский ГОПС 1","address":"Астана область, г. Астана, пр. Момышулы, д.1","postindex":"010026"},
  }
)

.onAny('/api/v1/AP005470227KZ').reply(200,{
trackid: "AP005470227KZ",
timestamp: "11:45:47 05.08.2018",
version: "v1",
status_code: "S_ISSSC",
reg_date: "22.06.2018",
sender: "ШЕЙНЬМАН РУСЛАН АДАМОВИЧ",
sender_address: "Акмолинская Щучинск Кокчетавская 28",
recipient_name: "ИП ЕСБАЕВ Д.Д.",
recipient_address: "Алматинская область пос. Заречный ул. Акбулак д. 21",
recepient_name_real: "Ганн.Е.А",
recipient_postcode: "040003",
dlv_date: "03.08.2018",
dlv_dep_name: "ГОПС-6 г.Щучинск",
dep_name: "Талдыкорган - 3",
dlv_postindex: "021706",
post_type: "4",
dispute: "",
x_status: "Вручено из СЦ",
x_post_type_name: "Посылка",
x_direction: "LOCAL",
x_num_place: "",
x_num_stlg: "",
x_extra_info: "6,725"
})

.onAny('sm_home.sortplan').reply(200,{
  "depcode":"200088",
  "ver":1,
  "date":"21.07.2018 18:26",
  "plan":{
    "M51":"800319",
    "M53":"800613",
    "M54":"850144",
    // "M55":"800808","M58":"160097","M63":"801011","M68":"801331","M70":"801416","M71":"801113","M72":"800719","M73":"770054","M74":"220081","M75":"801215","M76":"120515","M77":"800218","M84":"801519","M87":"800416","M88":"040299","M89":"041599","M90":"041099","M91":"041199","M92":"041799","M93":"040599","M94":"040199","M95":"040399","M96":"041299","M97":"040899","M98":"041399","M99":"041899","M100":"041499","M102":"040999","M103":"041699","M105":"040699","M107":"040799","M162":"040628",
    "M300":"010000",
  }
})
.onAny('sm_home.putToBag').reply((cfg)=>{
  
  var resp = {
    p_wpi: "GZ227933372KZ",
    p_cpilslogin: "SCNEVGENIA",
    p_depcode: "220000",
    toIndex: "130099",
    next: {
      bag: {
        bid: "913038989",
        bdepid: "18907",
        barcode: "B201807180001912",
        created: "18.07.18 11:09:14",
        user: "SCNEVGENIA"
      },
      bagIndex: "800319",
      bagNo: "M51"
    },
    addDetailPREGMAIL: {
    mlcntq: "4",
    wghtv: "0"
    }
  };

  if((Math.random()*10) > 8) resp.error = "Мешок уже закрыт";

  if((Math.random()*100) > 10)
    return [200,resp];
  else {
    return [400,{error:"Отправление RB508027382SG не найдено!"}]
  }

}).onAny('sm_home.closeBag').reply(200,
{
  closeBag: {
    p_bag: "801331",
    p_depcode: "",
    p_weight: "1",
    p_sendmeth: "1",
    p_cpilslogin: "SCNEVGENIA",
    bag: {
      barcode: "B201807180001912",
      todepindex: "130001",
      bdepid: "18907",
      bid: "913038989"
    }
  },
  cli_info: /*{
    BARCODE: "G201807180001235",
    TSFL: "",
    EMSFL: "0",
    BARCODETOSTR: "B188023542560494560155515212032164551@",
    SNDMETH_NAME: "Наземный",
    BAGTYPE_NAME: "Мешок \"Сақтандыру\"",
    CUSTOMCARGO: "",
    SEAL: "",
    OWN_NUMBER: "",
    FR_DEP_NAME: "Участок мжд. почты г.Алматы [220096]",
    TO_DEP_NAME: "Актау-1 [130001]",
    WGT_KG: "1",
    WGT_GR: "000",
    F51FL: "",
    NDSTMAIL: ""
  },*/
  `<CLIINFO><BAGTYPE_NAME>Мешок "Сақтандыру"</BAGTYPE_NAME>
   <BARCODE>G201807180001235</BARCODE>
   <BARCODETOSTR>B188023542560494560155515212032164551@</BARCODETOSTR>
   <CUSTOMCARGO />
   <EMSFL>0</EMSFL>
   <F51FL />
   <FR_DEP_NAME>Участок мжд. почты г.Алматы [220096]</FR_DEP_NAME>
   <NDSTMAIL />
   <OWN_NUMBER />
   <SEAL />
   <SNDMETH_NAME>Наземный</SNDMETH_NAME>
   <TO_DEP_NAME>Актау-1 [130001]</TO_DEP_NAME>
   <TSFL />
   <WGT_GR>000</WGT_GR>
   <WGT_KG>1</WGT_KG></CLIINFO>`,
  UBAGBARCODE: "G201807180001235"
}  
)
.onAny().reply((cfg)=>{

  var resp = {
    "trackid":"RB508027382SG",
    "timestamp":"21:56:29 06.04.2018",
    "direction":"IMPORT","status_code":"D",
    "status":"Вручено",
    "x_status_code":"S_ISS",
    "x_status":"Вручено",
    "sender":{"country":"Сингапур","name":"1","address":"1","x_postindex":null},
    "next":{"bagNo":'00'+Math.floor((Math.random()*10)),"toIndex":0,"x_dep_id":"19465","dep_name":"Сарыарка ГОПС 1","address":"Астана область, г. Астана, пр. Сарыарка, д.99","postindex":"010021"},
    "origin":{"date":"01.04.2018","x_dep_id":"18907","city":"Алматы","dep_name":"Участок по обработке международной почты г. Алматы","postindex":"220096"},
    "receiver":{"name":"Junnussov T","address":"Astana Saryarka  15","country":"Казахстан","x_postindex":null},
    "last":{"date":"05.04.2018","x_dep_id":"19465","city":"","dep_name":"Постамат пр. Сарыарка, д. 15, БЦ ИСКЕР","address":"Астана область, г. Астана, пр. Сарыарка, д.15","postindex":"900109"},
    "delivery":{"date":"05.04.2018","time":"15:41","period_fact":"4","x_period":null,
    "x_dep_id":"19465",
    // "city":"",
    "dep_name":"Постамат пр. Сарыарка, д. 15, БЦ ИСКЕР",
    "address":"Астана область, г. Астана, пр. Сарыарка, д.15",
    // "gps":["",""],
    // "phone":"",
    "postindex":"900104"},
    "storage_period":"",
    "package_type":"Мелкий пакет",
    "category":"Заказное",
    "delivery_method":"Авиа",
    "dispute":"",
    "weight":"менее 1"
  };

  if((Math.random()*100) > 10)
    return [200,resp];
  else {
    return [400,{error:"Отправление RB508027382SG не найдено!"}]
  }
})


export const mockDevice = new MockAdapter($device).onAny().reply((cfg)=>{
  console.log(cfg);
  return [200,null];
})


