// import axios from 'axios'
import {$http} from '@/store/api/http'
import MockAdapter from 'axios-mock-adapter'

let mock = new MockAdapter($http,{delayResponse:1000 })
/*.onGet('/RB508027382SG').reply(200,
  {"trackid":"RB508027382SG","timestamp":"21:56:29 06.04.2018","direction":"IMPORT","status_code":"D","status":"Вручено","x_status_code":"S_ISS","x_status":"Вручено","sender":{"country":"Сингапур","name":"1","address":"1","x_postindex":null},"origin":{"date":"01.04.2018","x_dep_id":"18907","city":"Алматы","dep_name":"Участок по обработке международной почты г. Алматы","postindex":"220096"},"receiver":{"name":"Junnussov T","address":"Astana Saryarka  15","country":"Казахстан","x_postindex":null},"last":{"date":"05.04.2018","x_dep_id":"19465","city":"","dep_name":"Постамат пр. Сарыарка, д. 15, БЦ ИСКЕР","address":"Астана область, г. Астана, пр. Сарыарка, д.15","postindex":"900109"},"delivery":{"date":"05.04.2018","time":"15:41","period_fact":"4","x_period":null,"x_dep_id":"19465","city":"","dep_name":"Постамат пр. Сарыарка, д. 15, БЦ ИСКЕР","address":"Астана область, г. Астана, пр. Сарыарка, д.15","gps":["",""],"phone":"","postindex":"900104"},"storage_period":"","package_type":"Мелкий пакет","category":"Заказное","delivery_method":"Авиа","dispute":"","weight":"менее 1"}
)*/
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
.onAny().reply((cfg)=>{

  var resp = {
    "trackid":"RB508027382SG",
    "timestamp":"21:56:29 06.04.2018",
    "direction":"IMPORT","status_code":"D",
    "status":"Вручено",
    "x_status_code":"S_ISS",
    "x_status":"Вручено",
    "sender":{"country":"Сингапур","name":"1","address":"1","x_postindex":null},
    "origin":{"date":"01.04.2018","x_dep_id":"18907","city":"Алматы","dep_name":"Участок по обработке международной почты г. Алматы","postindex":"220096"},
    "receiver":{"name":"Junnussov T","address":"Astana Saryarka  15","country":"Казахстан","x_postindex":null},
    "last":{"date":"05.04.2018","x_dep_id":"19465","city":"","dep_name":"Постамат пр. Сарыарка, д. 15, БЦ ИСКЕР","address":"Астана область, г. Астана, пр. Сарыарка, д.15","postindex":"900109"},
    "delivery":{"date":"05.04.2018","time":"15:41","period_fact":"4","x_period":null,
    "next":{"x_dep_id":"19465","dep_name":"Сарыарка ГОПС 1","address":"Астана область, г. Астана, пр. Сарыарка, д.99","postindex":"010099"},
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
    return [400,{error:"Превышено время ожидания запроса!"}]
  }
})