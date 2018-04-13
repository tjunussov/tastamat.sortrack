import Vue from 'vue'
import VueIdb from 'vue-idb'
// import VueIdb from 'E:\\Dev\\GitHub\\vue-idb-master'

Vue.use(VueIdb)

/*import {API_ROOT} from '../../settings'
import VueResource from 'vue-resource'
Vue.use(VueResource)
export const LedgerResource = Vue.resource(API_ROOT + 'ledger{/id}')*/

// const idb = new VueIdb({
export default new VueIdb({
  version: 1,
  database: 'check.kz',
  schemas: [ // Indexes ( not columns )
    { config: 'version,meta_.updated' },
    { group: 'uuid,name,code_,meta_.parent,type_,meta_.updated' },
    { app: 'name,code_,meta_.parent,type_,meta_.updated' },

    { audit: 'meta_.created, meta_.parent,type_' },    

    { sales: 'uuid,no,meta_.code,meta_.created,meta_.accounted,meta_.parent,meta_.updated' },
    { items: 'name,type_,sku,meta_.parent,meta_.updated,meta_.favmenu' },
    { contacts: 'name,code_,meta_.parent,type_,meta_.updated' },
  ],
  options: {
    config: { type: 'list', primary: 'version', label: 'version',updated_at:'meta_.updated' },
    group: { type: 'list', primary: 'uuid', label: 'name',updated_at:'meta_.updated' },
    app: { type: 'list', primary: 'name', label: 'name',updated_at:'meta_.updated' },

    audit: { type: 'list', primary: 'meta_.created', label: 'meta_.created',updated_at:'meta_.created' },

    orders: { type: 'biglist', primary: 'uuid', label: 'no',updated_at:'meta_.updated' },
    items: { type: 'biglist', primary: 'name', label: 'name',updated_at:'meta_.updated' },
    contacts: { type: 'biglist', primary: 'code_', label: 'code_',updated_at:'meta_.updated' },
  },
  apis: {
    sales: {
      // all: () => LedgerResource.get(),
      /*add: (obj) => {
        console.log('db sync axios.post','');
        return Promise.resolve(obj)
      }*/
      // update: (obj) => LedgerResource.update(obj),
      // remove: (id) => LedgerResource.delete(id),
    }
  }
})



// export default idb