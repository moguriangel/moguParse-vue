/** 
 * @mixin
 * @customTag A custom tag
 */
export default {
  props: {
    /**
     * Defined in the mixin.
     */
    bar: {
      type: Number
    }
  },
  methods: {
    /**
     * Mixin
     * @description Mixin
     * @param {Number} a First number
     * @returns {string} Sum param + 2
     */
    method1(a) {
      return a + 2;
    }
  }
};
