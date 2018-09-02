import Vue from 'vue'

export const bindMixin = {
  methods:{
    wizardToggle(){
      console.log('wizardToggle');
      
      if(!this.bind.started) {
        this.bind.started = true
        this.wizardNext()
      } else {
        this.bind.started = false
        this.bind.cursor = null
        this.$deselectBag();
      }
    },
    wizardNext(bagno){

      console.log('wizardNext',this.bind.cursor,bagno);

      // before next remap current index with new one
      if(bagno){
        this.$remapSelectedBag({bagno});
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

      } else {
        this.wizardToggle();
      }
    },
  }
}