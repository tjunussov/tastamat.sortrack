/*************************************/

export const mqttLEDMixin = {
  methods: {
    $search(user){
      this.$ledOn({color:'110000',duration:200,repeat:1,led:['all']})
    },
    $found(user,led){
      this.$ledOn({color:'ff0000',duration:1000,repeat:10,led:[led]})
    },
    $notFound(user){
      this.$ledOn({color:'ff0000',duration:100,repeat:3,led:['all']});
    },
    $bindStart(led){
      this.$ledOn({color:'ff0000',duration:2000,led:[led]})
    },
    $bind(led){
      this.$ledOn({color:'ff0000',duration:2000,led:[led]});
    },
    $error(user){
      this.$ledOn({color:'ff0000',duration:100,repeat:3,led:['all']});
    },
    $login(user){
       this.$ledOn({color:'ff0000',duration:2000,led:['all']})
    },
    $ledOn(msg){
      this.$mqtt.publish('sortrack/off','stop');
      this.$mqtt.publish('sortrack/on',JSON.stringify(msg));
    },
    $ledOff(msg){
      this.$mqtt.publish('sortrack/off','stop');
    }
  }
}


