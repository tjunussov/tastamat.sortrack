// import axios from 'axios'
import {$http,$device} from '@/store/api/http'
import MockAdapter from 'axios-mock-adapter'
import Vue from 'vue'


var plan = {
    "result": "success",
    "techindex": "055990",
    "parentPostIndexes": [
        {
            "nameRu": "УОДП-8 г.Алматы",
            "techindex": "800508",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-35",
            "techindex": "050035",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-30",
            "techindex": "050030",
            "isOfficial": false
        },
        {
            "nameRu": "УОиДП №6 г.Алматы",
            "techindex": "800506",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-63",
            "techindex": "050063",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-18",
            "techindex": "050018",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-31",
            "techindex": "050031",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-32",
            "techindex": "050032",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-56",
            "techindex": "050056",
            "isOfficial": false
        },
        {
            "nameRu": "УДОП-3 г.Алматы",
            "techindex": "800503",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-7",
            "techindex": "050007",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-23",
            "techindex": "050023",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-47",
            "techindex": "050047",
            "isOfficial": false
        },
        {
            "nameRu": "УОДП-9 г.Алматы",
            "techindex": "800509",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-40",
            "techindex": "050040",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-19",
            "techindex": "050019",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-46",
            "techindex": "050046",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-5",
            "techindex": "050005",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-8",
            "techindex": "050008",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-17",
            "techindex": "050017",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-52",
            "techindex": "050052",
            "isOfficial": false
        },
        {
            "nameRu": "УДОП 2 г.Алматы",
            "techindex": "800502",
            "isOfficial": false
        },
        {
            "nameRu": "УОиДП-5 г.Алматы",
            "techindex": "800505",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-28",
            "techindex": "050028",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-53",
            "techindex": "050053",
            "isOfficial": false
        },
        {
            "nameRu": "Центр по выдаче почтовых отправлений г.Алматы",
            "techindex": "800510",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-27",
            "techindex": "050027",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-64",
            "techindex": "050064",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-71",
            "techindex": "050071",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-36",
            "techindex": "050036",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-65",
            "techindex": "050065",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-67",
            "techindex": "050067",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-69",
            "techindex": "050069",
            "isOfficial": false
        },
        {
            "nameRu": "УОиДП-7 г.Алматы",
            "techindex": "800507",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-58",
            "techindex": "050058",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-26",
            "techindex": "050026",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-70",
            "techindex": "050070",
            "isOfficial": false
        },
        {
            "nameRu": "УДОП-4 г.Алматы",
            "techindex": "800504",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-9",
            "techindex": "050009",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-6",
            "techindex": "050006",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-38",
            "techindex": "050038",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-62",
            "techindex": "050062",
            "isOfficial": false
        },
        {
            "nameRu": "УД и ПП Алматински почтамт",
            "techindex": "800519",
            "isOfficial": false
        },
        {
            "nameRu": "Алматы-44",
            "techindex": "050044",
            "isOfficial": false
        }
    ]
};

var barcodes = {
    "result": "success",
    "mails": [
        "RN057495927KZ",
        "RN056452942KZ",
        "VS051508534KZ",
        "VS051510422KZ",
        "VS051524435KZ",
        "RN056453157KZ",
        "RN056454461KZ",
        "RN056448982KZ",
        "RN056826874KZ",
        "RN057495900KZ",
        "RN052056946KZ",
        "RN056827605KZ",
        "RN057497137KZ",
        "RN056424456KZ",
        "BP050108725KZ",
        "RN053293249KZ",
        "BP050108901KZ",
        "RN057497168KZ",
        "BP050108760KZ",
        "RN057478314KZ",
        "RN057478623KZ",
        "RN057497239KZ",
        "RN057478376KZ",
        "RN056453072KZ",
        "BP050110410KZ",
        "BP050110162KZ",
        "RN057495799KZ",
        "RR131616464CN",
        "RN056423963KZ",
        "RN051966353KZ",
        "RN052055702KZ",
        "RN056105188KZ",
        "RN056815655KZ",
        "RN056815647KZ",
        "RN052054605KZ",
        "RN056817166KZ",
        "RN056817121KZ",
        "RN052054741KZ",
        "BP050023715KZ",
        "CO053968175KZ",
        "RN053295647KZ",
        "RN052055693KZ",
        "RN052055716KZ",
        "RN052055747KZ",
        "RN052055755KZ",
        "RN052055764KZ",
        "RN052055778KZ",
        "RN053297166KZ",
        "RN052055818KZ",
        "RN052055821KZ",
        "BP050107265KZ",
        "BP050107248KZ",
        "BP050104683KZ",
        "RN051966375KZ",
        "RN051966384KZ",
        "RN051966415KZ",
        "RN051966424KZ",
        "RN051966438KZ",
        "RN056816262KZ",
        "BP050092804KZ",
        "BP050092818KZ",
        "RN051966557KZ",
        "RN053295678KZ",
        "RN053295664KZ",
        "RN057475556KZ",
        "RN057475542KZ",
        "RN057475573KZ",
        "RN057475560KZ",
        "RN056456825KZ",
        "RN053416552KZ",
        "RN056456839KZ",
        "RN053295602KZ",
        "RN056805874KZ",
        "RN055763532KZ",
        "RN056456900KZ",
        "RN051966565KZ",
        "RN051966574KZ",
        "RC053358877KZ",
        "RN056816395KZ",
        "RN056805959KZ",
        "RN053295695KZ",
        "RN053295545KZ",
        "RN056457026KZ",
        "RN056457012KZ",
        "RN056456961KZ",
        "RN056457088KZ",
        "RN056457074KZ",
        "RN053416455KZ",
        "BP050092835KZ",
        "BP050092821KZ",
        "BP050096307KZ",
        "BP050096315KZ",
        "BP050096324KZ",
        "BP050096338KZ",
        "RN052055035KZ",
        "RN056457216KZ",
        "RN056457202KZ",
        "RN056457247KZ",
        "RN056457233KZ",
        "RN056457295KZ"
    ]
};

  
//INFO! dont remove delay respnose, it doesnt workk if removed
export const mock = new MockAdapter($http,{delayResponse:50}) 
// export const mock = new MockAdapter($http)


.onGet('authorize').reply((cfg)=>{

    console.log('authorize',cfg.params);

    if(cfg.params.login == 'test.alm21.rpo1')
        return [200,{"result": "success","name": "Мырзанова Гульмира"}];
    else
        return [200,{"result": "error","resultInfo": "user by login not found"}];
})
.onGet('getRPO').reply(200,barcodes)
.onAny('listBagIndexes').reply(200,plan)
.onAny('findBagIndex').reply(async (cfg)=>{

  var req = cfg.params;
  
  var p = Math.floor(plan.parentPostIndexes.length * Math.random())

  console.debug('findBagIndex',req, p);

  var resp = 
    {
        "result": "success",
        "parentPostIndex": plan.parentPostIndexes[p].techindex,
        "postIndex": Math.ceil(Math.random()*10000),
        "postIndexTitle": "Алматы-"+Math.ceil(Math.random()*10),
        "mailInfo": {
            "mailCategory": "1",
            "mailId": req.barcode,
            "toFullName": "КАЗ НПУ ИМ АБАЯ ",
            "toStreet": "ПР ДОСТЫК 13 Г АЛМАТЫ ",
            "mailStatus": "Registered",
            "mailType2": "P101",
            "storagePaymentPaid": false,
            "returnPaymentPaid": false,
            "selfPaymentPaid": false,
            "notices": 0
        }
    }


  if(Vue.prototype.$store.getters.config.mockdelay){
    var sleepTime = (Math.random()*1000);
    console.debug('DelayingResponse',sleepTime);
    await sleep(sleepTime);
  }

  if((Math.random()*100) < 95)
    return [200,resp];
  else {
    return [200,{result:"error",resultInfo:"Отправление "+req.barcode+" не найдено!"}]
  }

}).onAny('formBag').reply((cfg)=>{
  return [200,{
    "result": "success",
    "packetListNo": "B201910072104795",
    "labelListNo": "G201910072104795",
    "actualWeight": 10,
    "workerName": "Мырзанова Гульмира",
    "fromDepartment": "АФ АО «Казпочта» «Алматинский почтамт»",
    "toDepartment": "Алматы-9",
    "route": "Наземный",
    "date": "Mon Oct 07 21:38:49 ALMT 2019",
    "count": 1
}]}
)
.onAny().reply((cfg)=>{

  var req = cfg.params;
  console.debug("Mock any",req);

  return [500,{error:"Mock no rule found"}]

})


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// export const mockDevice = new MockAdapter($device).onAny().reply((cfg)=>{
//   console.debug('led',cfg.params?cfg.params.led:cfg.params);
//   return [200,null];
// })


