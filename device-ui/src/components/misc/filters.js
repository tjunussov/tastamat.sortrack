import Vue from 'vue'
import tjson from 'vue-tjson2html'

Vue.filter('json2html', function (value, fmt) {
  return tjson(value, fmt)
})


Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
})