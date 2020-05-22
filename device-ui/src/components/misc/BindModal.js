import Vue from 'vue'
import {$leds,$sound} from '@/store/api/http'

export const bindMixin = {
  methods:{
    calibrateStart(){
      this.bind.cursor = -1;
      $sound.play('bindstart');
      this.calibrateNext();
    },
    calibrateStop(){
      this.bind.cursor = null;
      this.bind.selectedBag = null;
      $sound.play('bindend');
      // $leds.lastLed = this.lastBag.led;
      this.clearAll();
      this.$clearSelected();
      this.$save();
    },
    calibrateMapBagBarcode(ppi){
      if(this.bind.selectedBag !== null && !this.bind.selectedBag.isErrorBag){
        console.debug('calibrateMapBagBarcode',ppi,this.bind.selectedBag);

        var i = this.bind.selectedBag;
        this.$remapPpi({i,ppi})
      }
    },
    calibrateMap(i){
      this.bind.selectedBag = i;
      Vue.set(this.bags[i],'led',this.bind.cursor);
      this.calibrateNext();
    },
    calibrateNext(){
      this.bind.cursor++;
      console.log('THOR',this.tabIndex);
      if(this.ledOn) {
        $leds.xon({status:'bind',color:'all',led:this.bind.cursor,thor:this.tabIndex});
        //$leds.on('bind',this.bind.cursor,this.tabIndex);
      }
    },
    /*wizardToggle(){
      console.log('wizardToggle');
      
      if(!this.bind.started) {
        this.bind.started = true
        this.wizardNext()
      } else {
        this.bind.started = false
        this.bind.cursor = null
        this.bind.unmappedIndx = null;
        window.clearInterval(this.bind.intrvl);
        this.$deselectBag();
      }
    },
    wizardNext(bagno){

      console.log('wizardNext',this.bind.cursor,bagno);

      // before next remap current index with new one
      if(bagno){
        this.$remapSelectedBag({bagno,led:this.bind.unmappedIndx});
      }

      if(this.bags.length > this.bind.cursor + 1){
        if(this.bind.cursor == null) 
          this.bind.cursor = 0
        else 
          this.bind.cursor++;

        this.$deselectBag();

        window.setTimeout(()=>{
          this.$selectBag({bagno:this.bags[this.bind.cursor].no});
        },200);

        // начианем мигание по очередное
        window.clearInterval(this.bind.intrvl);
        this.calcUnmappedLeds();
        this.bind.intrvl = window.setInterval(this.scanLeds,this.settings.bindscan||1500);

      } else {
        this.wizardToggle();
      }
    },
    calcUnmappedLeds(){
      this.bind.unmapped = this.bags.reduce(function(a, e, i) {
          if (e.led === null) a.push(i);
          return a;
      }, []);

      if(this.bind.unmapped.length == 0){
        if(confirm('All LEDs already calibrated, confirm reset?')){
          Object.entries(this.bags).forEach((item,i)=>{
            Vue.set(this.bags[i],'led',null)
          })
          console.log('bags reseted',this.bags);
        };
      }
      this.bind.unmappedIndx = -1;
    },
    scanLeds(){
      // if(this.bind.unmapped.length == this.bind.unmappedIndx) this.bind.unmappedIndx = 0
      if(this.bags.length-1 == this.bind.unmappedIndx) 
        this.bind.unmappedIndx = 0
      else 
        this.bind.unmappedIndx++;

      $leds.on('bind',this.bind.unmappedIndx);
    }*/
  }
}