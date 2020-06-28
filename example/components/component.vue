<template>
  <div></div>
</template>

<script>
import mixin from "./mixin.js";

export default {
  name: "myAwesomeComponent",
  mixins: [mixin],
  props: {
    /**
     * foo prop comment.
     *
     */
    foo: {
      type: String
    },
    /**
     * bar prop comment
     */
    bar: {
      type: Array,
      required: false,
      default: () => [],
      validation: () => ({})
    }
  },
  data() {
    return {
      data1: "ciao",
      data2: 34
    };
  },
  methods: {
    /**
     * no tag -- sum param + 2
     * @name method1
     * @param {Number} a numerb param for method1
     * @description sum param + 2
     * @see seeTag some link https://www.google.com
     * @version 1.0.5 version tag desc
     * @since since tag desc
     * @returns {Number} Method1 return a number
     */
    method1(a) {
      return a + 2;
    },
    /**
     * no tag -- sum param a + param b
     * @name method2
     * @param {Number} a First number to sum
     * @param {Number} b Second number to sum
     * @description sum param a + param b
     * @returns {Number} Method2 return a number
     */
    method2(a, b) {
      return a + b;
    },
    /**
     * no tag desc
     * @name method3
     * @description "Some text" returned
     * @returns {string} Method3 return a string
     */
    method3() {
      return "Some text";
    }
  },
  mounted() {
    /**
     * mounted
     */
    const mount = 33;
  },
  computed: {
    /**
     * no tag desc
     *
     * @description Just some jsdoc inside a computed prop
     */
    computed1() {
      return "I'm a computed!";
    }
  }
};
</script>
