export default {
  populate(db) {

    console.log("Populating")
    
    //-------------

    db.audit.add({
      meta_:{
        created:new Date(),
        parent:null,
        owner:"Александр Влад",
        group:"1",
      },
      type_:"items",
      cmd:"update",
      note:"Change Price",
      old:1000,
      new:1500
    })

    //-------------

    db.items.add({
      sku:"89494654654",
      name:"Coca Cola",
      price:180,
      quantity:1,
      inventory:1000,
      type_:"product",
      meta_:{favmenu:0,created:new Date(), icon:"fa-spoon"}
    })
    db.items.add({
      name:"Кофе",
      price:490,
      quantity:1,
      inventory:36,
      type_:"product",
      meta_:{favmenu:1}
    })
    db.items.add({
      name:"Спрайт",
      price:200,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:2}
    })
    db.items.add({
      name:"Торт",
      price:2000,
      quantity:1,
      inventory:22,
      type_:"product",
      meta_:{favmenu:3}
    })
    db.items.add({
      name:"Чизи",
      price:300,
      quantity:1,
      inventory:15,
      type_:"product",
      meta_:{favmenu:4}
    })
    db.items.add({
      name:"Напиток",
      price:400,
      quantity:1,
      inventory:10,
      type_:"product",
      meta_:{favmenu:5}
    })
    db.items.add({
      name:"Массаж",
      price:3000,
      quantity:1,
      inventory:24,
      type_:"group",
      meta_:{favmenu:6}
    })
    db.items.add({
      name:"Мастер",
      price:100,
      quantity:1,
      inventory:24,
      type_:"resource",
      meta_:{favmenu:7}
    })
    db.items.add({
      name:"Комната",
      price:100,
      quantity:1,
      inventory:24,
      type_:"resource",
      meta_:{favmenu:8}
    })
    db.items.add({
      name:"Хлеб",
      price:120,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:9}
    })
    db.items.add({
      name:"Вода",
      price:100,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:10}
    })
    db.items.add({
      name:"Мука",
      price:100,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:11}
    })
    db.items.add({
      name:"Сметана",
      price:120,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:12}
    })
    db.items.add({
      name:"Футболка",
      price:1000,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:13}
    })
    db.items.add({
      name:"Рубашка",
      price:1000,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:14}
    })
    db.items.add({
      name:"Майка",
      price:900,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:15}
    })
    db.items.add({
      name:"Салат Морковный",
      price:500,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:16}
    })
    db.items.add({
      name:"Салат Венегрет",
      price:120,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:17}
    })
    db.items.add({
      name:"Салат Ачучук",
      price:1000,
      quantity:1,
      inventory:5,
      type_:"product",
      meta_:{favmenu:18}
    })
    db.items.add({
      name:"Скидка",
      price:0,
      quantity:1,
      inventory:null,
      type_:"modifier",
      meta_:{favmenu:19}
    })

    db.items.add({name:"Наличные",price:0,sku:"01",type_:"money",meta_:{code:"CASH",created:new Date(),basket:0, icon:"fa-money"}})
    db.items.add({name:"Карточка",price:0,sku:"02",type_:"money",meta_:{code:"CARD",created:new Date(),basket:1, icon:"fa-credit-card"}})
    db.items.add({name:"Сенiм",price:0,sku:"01",type_:"money",meta_:{code:"SENIM",created:new Date(),basket:2, icon:"fa-stumbleupon"}})

    db.contacts.add({
      name:"Анна Федотова",
      code_:"77953564412",
      meta_:{tag:["clients"],created:new Date()}
    })

    db.contacts.add({
      name:"Тинькоф Александр",
      code_:"77957772516",
      meta_:{tag:["clients"],created:new Date()}
    })

    db.config.add({
      version:"0.1a",
      code:"demo",
      host:"demo.kassa.ga",
      workMode:"demo",
      lastCheck:{no:0,result:0},
      currentGroupIndex:0,
      currentKKMIndex:0,
      currentUserKey:null,
      apps:[
        {
          name:"POS Qazkom",
          meta_:{ registered:new Date() },
        },
        {
          name:"ОФД Телеком",
          meta_:{ registered:new Date()},
        },
        {
          name:"ОФД Блокчейн",
          meta_:{ registered:new Date() },
        },
        {
          name:"WebKassa",
          meta_:{ registered:new Date() },
        },
        {
          name:"Telegram",
          meta_:{ registered:new Date() },
        },
        {
          name:"KazInfoTech",
          meta_:{ registered:new Date() },
        },
        {
          name:"Klik",
          meta_:{ registered:new Date() },
        },
        {
          name:"SENIM",
          meta_:{ registered:new Date()},
        },
        {
          name:"mVISA",
          meta_:{ registered:new Date()},
        },
        {
          name:"EMail",
          meta_:{ registered:new Date()},
        }
      ]
    })

    db.app.add({
      name:"Qazkom POS",
      contract:"4821963149",
      meta_:{ installed:new Date() },
      config:{ ECRnumber:"01" }
    })

    db.app.add({
      name:"ОФД Телеком",
      contract:"4821963149",
      meta_:{ installed:new Date() },
      message:"Требует Оплаты",
      enabled:false,
      config:{ token:"DS54648sasd" }
    })

    db.app.add({
      name:"ОФД Блокчейн",
      contract:"4821963149",
      meta_:{ installed:new Date() },
      message:"Требует Оплаты",
      enabled:true
    })

    db.app.add({
      name:"mVISA",
      contract:"4821963149",
      meta_:{ installed:new Date() },
      enabled:true,
      config:{ 
        merchantId:"4821963149", 
        merchantName:"Corner Store",
        city:"Bangalore",
        country:"IN" }
    })

    db.app.add({
      name:"SENIM",
      contract:"4821963149",
      meta_:{ installed:new Date() },
      enabled:true
    })


    
          

    db.group.add({
      uuid:"1",
      code_:"lubimchik",
      name:"ЛЮБИМЧИК",
      meta_:{
        created:new Date(),
        updated:new Date(),
        parent:null
      },
      businessType:"Торговая точка",
      paymentPlan:"Pro",
      timezone:"GMT+6",
      serviceDealer:"Медиана",
      disableObfuscateSaleNumber:false,
      notifications:{
        zReportEmail:"test@gmail.com"
      },
      kassa:{
        roundingType:"None",
        diquantityEntryMode:"%",
        defaultPayments:['Наличные','Банковская Карта'],
        disableManualEntry:false,
        allowPurchases:true,
        allowBarter:true,
        allowPrecheck:true,
        autoDownloadCheck:false,
        autoSendCheck:false,
        autoDayClose:{
          closer:"Иванов И",
          closeTime:"23:00",
          autoCashWithdrawall:true,
          disabled:false,
        },
        allowExtraCharge:{
          name:"Наценка",
          value:"3%",
          onTotal:true,
          enabled:false
        },
        legal:{
          bin:"871121351099",
          address:"г.Астана, ул.1, д.2, оф.3",
          nds:"yes",
          name:"ИП \"Иванов И.И.\"",
        },
        kkms:[
          {
            znk:"SWK00031019",
            name:"POS1 Фронт офис",
            disabled:false,
            legal:{
              ink:"655855115287",
              rnk:"655855115287",
              rnk_date:"20.10.2017"
            }
          },
          {
            znk:"SWK00031020",
            name:"POS2 Куръер",
            disabled:false,
            legal:{
              ink:"655855115288",
              rnk:"655855115288",
              rnk_date:"20.10.2017"
            }
          }
        ]
      },
      security:{
        anonymousLogin:true,
        autoCreateUser:true,
        adminsDefaultPIN:"1509442", // 1234
        usersDefaultPIN:"",
        users:{
          "Александр Влад":{pin:"1509442", role:"admin"},
          "Кузнецова Анна":{pin:""},
          "Онисимова Светлана":{pin:""},
          "Пономарев Станислав":{pin:""}
        }
      }
    })
  } // end of method
}
