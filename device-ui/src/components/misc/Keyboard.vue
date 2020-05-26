<template lang="pug">
.keyboard {{keyText}}
</template>

<script>
import {$leds,$sound} from '@/store/api/http'
import { mapGetters, mapActions } from 'vuex'
      

var captureTM;


export default {
  name: 'Keyboard',
  data () {
    return {
      keyText:""
    }
  },
  created(){
    window.addEventListener('keydown',this.documentKeydown)
  },
  beforeDestroy(){
    window.removeEventListener('keydown',this.documentKeydown)
  },
  mounted(){
    // console.log('mouted qr',this.value);
    if(this.value) this.encode()
  },
  methods:{
    ...mapActions([
      '$setColor'
    ]), 
    documentKeydown(event){

      if(event.target.className.indexOf('nokeyboard') >= 0) return;

      if( event.keyCode >= 96 && event.keyCode <=105 ){ // only numpad and top numbers
        this.keyText += String.fromCharCode(event.keyCode-48);
      } else if( event.keyCode >= 65 && event.keyCode <=90 ){ // only alphanumerics
        this.keyText += String.fromCharCode(event.keyCode+(event.shiftKey?0:32));
      } else if( event.keyCode >= 48 && event.keyCode <=57 ) { // numbers
        this.keyText += String.fromCharCode(event.keyCode);
      } else if( event.keyCode == 110 || event.keyCode == 190 ) { // "."
        this.keyText += ".";
      }

      if(event.keyCode == 8 ){ // ????
        this.keyText = this.keyText.slice(0,-1)
      }


      console.debug('documentKeydown',this.keyText, event.keyCode, String.fromCharCode(event.keyCode));


      if (event.keyCode == 13){ // || this.keyText.length == 13 || this.keyText.length == 14 

        var firstLetter = this.keyText.substr(0,1);
        var color = 'R';


        if(this.keyText.length == 14) { //BARCODE with color Length
          var color = firstLetter;
          if( 'gb'.indexOf(color) >= 0){
            color = color.toUpperCase();
            // $leds.setColor(color);
            this.keyText = this.keyText.slice(1);
            console.debug('color change detected',this.keyText, color);
          }
        } 

        if (this.keyText.length == 13) { // ENTER or BARCODE Length
          console.debug('emitting 13 len key text',this.keyText, color);
        } else {
          this.$bus.$emit('keyboard:keydown:enter:'+firstLetter,this.keyText.slice(1),color);
        }

        //if(!isNaN(this.keyText)) {
        // if(this.keyText.length == 13 && event.keyCode == 13 ) return;// IF keyText length 13 and after pressed ENTER, skip it

        if(this.keyText != "") {
          this.$bus.$emit('keyboard:keydown:enter:'+this.keyText.length,this.keyText,color);
          this.$bus.$emit('keyboard:keydown:enter',this.keyText,color);
          this.keyText = ""
          event.preventDefault();
        }
      }

      window.clearTimeout(captureTM)
      captureTM = window.setTimeout(()=>{
        this.keyText = ""
        $sound.play('error_expire_keyboard');
      },1000)
    },
  }
}


</script>

<style lang="stylus">

.keyboard
  font-size 10rem
  line-height 10rem
  // margin-bottom -1rem
  letter-spacing -1rem
  opacity 0.1
  overflow hidden
  position absolute
  right 0
  bottom 0
  left 0
  z-index 1000
  
</style>
