import Vue from 'vue'
import tjson from 'vue-tjson2html'

Vue.filter('json2html', function (value, fmt) {
  return tjson(value, fmt)
})

Vue.filter('kg', function (value) {
	if(value) value = (Number(value) / 1000).toFixed(3);
	return value
})

Vue.directive('focus', {
    inserted: function (el) {
        el.focus()
    }
})

const PAD_WIDTH_CHARS = 37;

Vue.filter('rpad', function (value,r,width=PAD_WIDTH_CHARS) {
  return (String(value).padEnd(width-String(r).length) + r).substring(0,width)
})
Vue.filter('cols', function (value,r,col1=20,col2=17) {
  return String(r).padStart(col1).substring(0,col1) + String(value).padStart(col2).substring(0,col2)
})
Vue.filter('lpad', function (value,r,width=PAD_WIDTH_CHARS) {
  return (String(r).padEnd(width-String(value).length) + value).substring(0,width)
})

Vue.filter('pad', function (value,width=PAD_WIDTH_CHARS) {
  return String(value).padEnd(width).substring(0,width)
})

Vue.filter('padcenter', function (value,width=PAD_WIDTH_CHARS) {
  var strLen = String(value).length
  var len = width - strLen
  if(len > 0 ) len = Math.floor(len / 2) + strLen

  return String(value).padStart(len).padEnd(width).substring(0,width)
})


