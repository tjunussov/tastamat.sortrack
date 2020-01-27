<template lang="pug">
pre.text-primary#printSection.mb-0.yarlik( :class="{'rotate':config.isRotate}")
  template(v-if="config.isWindowsPrint")
    //- div ══════════════════════════════════════════════
    div
      b ВИД ЗАДЕЛКИ       
      span {{mapSpr(response.bagType,bagTypes)}}
    div
      b G НАКЛАДНАЯ       
      span {{response.labelListNo}}
    div(v-if="response.packetListNo")
      b Б НАКЛАДНАЯ       
      span {{response.packetListNo}}
    //- div
    //-   b НОМЕР ЗАДЕЛКИ     
    //-   span {{response.labelListNo}}
    div
      b ПЛОМБА            
      span {{response.plombaNum}}
    div
      b СПОСОБ ПЕРЕСЫЛКИ  
      span {{mapSpr(response.sendMethod,sendmethTypes)}}  
      b     ВИД ТАРЫ 
      span {{mapSpr(response.taraType,taraTypes)}}
    //- div 
    //-   b ТИП 
    //-   span {{response.cli_info.BAGTYPE_NAME}}
    div
      b ОТКУДА 
      span [{{response.fromTechindex}}] {{response.fromDepartment}}
    div
      b КУДА   
      span [{{response.toTechindex}}] {{response.toDepartment}}
    div
      b ВЕС ТАРЫ 
      span {{response.actualWeight | kg }}кг
      b   ВЕС НЕТТО 
      span {{response.totalWeight | kg }}кг
      b   КОЛ-ВО 
      span {{response.count}} 
    div ═══════════════════════════════════════════════
    div
      b ДАТА 
      span {{response.date.substr(0,10)}}  
      b СОЗДАЛ 
      span {{response.workerName}}
    div(v-if="response.comment")
      b КОММЕНТАРИЙ 
      span {{response.comment}}
    div ═══════════════════════════════════════════════
    .barcode.ml-4 {{encode(response.labelListNo)}}
    h5          {{response.labelListNo}}
    //- div ════════════════════════════════════════════════
    
    //- div
    //-   | 
    //-   |
    //-   b     ©2019 Powered by SORTRACK®, KAZPOST INC"
  template(v-else)
      | N
      | q720
      | j555
      | l8,C,001
      | X0,40,4,710,640
      | 
      | A20,60,0,5,1,1,N,"{{response.route}}"
      | A20,120,0,4,1,1,N,"KYDA"
      | A300,120,0,4,1,1,N,"{{response.toDepartment}}"
      | 
      | A20,150,0,4,1,1,N,"OT"
      | A300,150,0,4,1,1,N,"{{response.fromDepartment}}"
      | 
      | A20,180,0,4,1,1,N,"BEC {{response.actualWeight}}"
      | A300,180,0,4,1,1,N,"{{response.count}} Kolvo"
      | 
      | A20,210,0,4,1,1,N,""
      | 
      | B20,240,0,1,2,2,100,B,"{{response.packetListNo}}"
      | 
      | A20,480,0,4,1,1,N,"COTPYDHNK"
      | A300,480,0,4,1,1,N,"{{response.workerName}}"
      | A380,480,0,4,1,1,N,"_______________"
      | 
      | A20,510,0,1,1,1,N,"© 2018 Powered by SORTRACK®, KAZPOST INC"
      | P1
      | N              
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import cyr from 'cyrillic-to-translit-js'
import Encoder from 'code-128-encoder'
var code128= new Encoder()



export default {
  name: 'YarlikPrintTemplate',
  props: ['isCloseModalOpen'],
  computed:{
    ...mapGetters({
        response: 'getCloseResponse',
        config:'getConfig',
    }),
  },
  data () {
    return {
      sendmethTypes:{"1":"Наземный","2":"Авиа"},
      sendmeth:2,
      plomba:null,
      bagTypes:{
        "20":"Мешок Сактандыру",
        "2":"Заказная корреспонденция",
        "12":"Правительственная письменная коррeспонденция",
        "19":"Письменная корреспонденция",
        "18":"Порожняя тара",
        "15":"Мешок с отправлениями EMS",
        "13":"Мешок с международной письменной корреспонденцией",
        "3":"Постпакет внутренний",
        "1":"Группа РПО"
      },
      taraTypes:{"1":"Мешок","2":"Ящик"},
      bagType:2,
      taraType:1,
      // comment:null
    }
  },
  methods:{
    encode(val){
      return code128.encode(val)
    },
    mapSpr(val,spr){
      if(val) return spr[val];
    },
    print(){
      if(this.config.isPrintProxy){
        var text = document.getElementById('printSection').innerText;
          text = cyr().transform(text);
          text = text.replace('қ','k')
          $leds.printbag(text);
      } else {
        this.$print();
      }
    },
    printTest(){
      $leds.printbagTest();
      this.clear();
    }
  }
}



</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
    
.content * 
  display block

#mclosebag 
  .circle
    position absolute
    font-size 11px
    margin-left -20px
    padding 2px 4px
    
  pre 
    overflow-x hidden

.hide
  display none
  
  
</style>
