export default {
  populate(db) {

    console.log("Populating")
    
    //-------------

    db.settings.add({
      id:1,
      depcode:null,
      size:24,
      bindscan:1500,
      mockdelay:true,
      demoerror:true,
      isDemo:false,
      isLedOn:true,
      isWindowsPrint:true,
      isPrintProxy:false,
      isRotate:true,
      isAutoPrint:false,
      user:null,
      // apiUrl:'https://pls-test.post.kz/api/smart-shelves/',
      apiUrl:'/api/polki/',
      printer:'192.168.1.40',
      broker:'192.168.10.1',
      leds:["192.168.10.10","192.168.10.10","192.168.10.10"],
      meta_:{ updated:new Date() },
      sortplan:null,
      users:[
        'test.alm21.rpo1',
        'test.ast17.sc1',
        'test',
        'aza',
        'tima',
        'zarina'
      ],
      bags:null
    })

  } // end of method
}
