import Vue from 'vue'
import VueIdb from 'vue-idb'

Vue.use(VueIdb)

/*import {API_ROOT} from '../../settings'
import VueResource from 'vue-resource'
Vue.use(VueResource)
export const LedgerResource = Vue.resource(API_ROOT + 'ledger{/id}')*/

// const idb = new VueIdb({
export default new VueIdb({
  version: 1,
  database: 'sortrack',
  schemas: [ // Indexes ( not columns )
    { settings: 'id,meta_.updated' },
  ],
  options: {
    settings: { type: 'list', primary: 'id', label: 'id',updated_at:'meta_.updated' },
  },
  /*Zapis: {
    orders: {
      // all: () => LedgerResource.get(),
      add: (obj) => {
        console.log('db sync firebase.push',obj);
        // return new Promise((resolve, reject) => { 
        //   $fdb.ref('sales/' + obj.uuid).push(obj,()=>{
        //     resolve({data:obj})
        //   })
        // })
        $fdb.ref('sales/' + obj.uuid).push(obj)
        return Promise.resolve({data:obj})
        
      },
      update: (obj) => { 
        $fdb.ref('sales/' + obj.uuid).update(obj)
        return Promise.resolve({data:obj})
      },
      // remove: (id) => LedgerResource.delete(id),
    },
    contacts: {
      all: () => {
        // var contcatRef = $fdb.ref('contacts')
        //     contcatRef.on('child_added',function(snap) {
        //       console.log("added:", snap.val);
        //     })

        return new Promise((resolve, reject) => { 
          $fdb.ref('contacts').orderByChild('name').once('value', (snapshot) => {
            let cachedContacts = []
            console.log('contacts snapshot',snapshot);
            snapshot.forEach((catSnapchot) => {
              let cachedCat = catSnapchot.val()
              // cachedCat['.key'] = catSnapchot.key
              cachedContacts.push(cachedCat)
              console.log('contacts loading',cachedCat);
            })
            resolve({data:cachedContacts})
          })
        })
        
      },
      add: (obj) => {
        $fdb.ref('contacts/' + obj.code_).push(obj)
        return Promise.resolve({data:obj})
      },
      update: (obj) => { 
        $fdb.ref('contacts/' + obj.code_).update(obj)
        return Promise.resolve({data:obj})
      },
      remove: (obj) => { 
        $fdb.ref('contacts/' + obj.code_).remove(obj)
        return Promise.resolve({data:obj})
      },
    }
  }*/
})



// export default idb