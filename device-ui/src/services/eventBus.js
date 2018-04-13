import Vue from 'vue';
export const EventBus = new Vue();

Object.defineProperties(Vue.prototype, {
  $bus: {
    get: function () {
      return EventBus
    }
  }
})

// // Import the EventBus.
// import { EventBus } from './event-bus.js';

// // Listen for the i-got-clicked event and its payload.
// EventBus.$on('i-got-clicked', clickCount => {
//   console.log(`Oh, that's nice. It's gotten ${clickCount} clicks! :)`)
// });

// // Stop listening.
// EventBus.$off('i-got-clicked', clickHandler);

// // Import the EventBus we just created.
// import { EventBus } from './event-bus.js';

// export default {
//   data() {
//     return {
//       clickCount: 0
//     }
//   },

//   methods: {
//     emitGlobalClickEvent() {
//       this.clickCount++;
//       // Send the event on a channel (i-got-clicked) with a payload (the click count.)
//       EventBus.$emit('i-got-clicked', this.clickCount);
//     }
//   }
// }