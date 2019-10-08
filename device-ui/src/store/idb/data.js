export default {
  populate(db) {

    console.log("Populating")
    
    //-------------

    db.settings.add({
      point:'000001',
      size:24,
      bindscan:1500,
      mockdelay:true,
      demoerror:true,
      printer:'192.168.1.40',
      meta_:{ updated:new Date() },
      sortplan:{
        '90001':'L1',
        '90010':'L10',
        '822133':'L101',
      },
      users:[
        'test.alm21.rpo1',
        'SCASTAGASIL',
        'SCASTALZHANOVA',
        'SCASTGALINA',
        'SCASTGULMIRA',
        'SCASTKALAMKAS',
        'SCASTNAZIPA',
        'SCASTDARYA',
        'SCASTRAUSHAN',
        'SCASTHASENOVA',
        'SCASTGULZIFA',
        'SCASTTLEYBAEVA'],
      bags:null,
      destinations:[
        '00000',
        '00001',
        '00001',
        '00002',
        '00003',
        '00004',
        '00005',
        '00006',
        '00007',
        '00008',
        '00009',
        '00010',
        '00011',
        '00012',
        '00013',
        '00014',
        '00015',
        '00016',
        '00017',
        '00018',
        '00019',
        '00020',
        '00021',
        '00022',
      ]
    })

  } // end of method
}
