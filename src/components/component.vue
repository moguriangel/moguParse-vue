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
     * props comment awesome.
     *
     */
    foo: {
      type: String
    },
    /**
     * dummy prop
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
     * no tag desc
     * @name uu
     * @param {Number} a param tag desc
     * @description desc tag desc
     * @see seeTag see tag desc
     * @public Sets the order
     * @version 1.0.5 version tag desc
     * @since since tag desc
     * @returns {string} return tag desc
     */
    test(a) {
      return a + 2;
    },
    /**
     * no tag desc
     * @name uu
     * @param {Number} a param tag desc
     * @description desc tag desc
     * @see seeTag see tag desc
     * @public Sets the order
     * @version 1.0.5 version tag desc
     * @since since tag desc
     * @returns {string} return tag desc
     */
    testA(a) {
      return a + 2;
    },
    /**
     * no tag desc
     * @name uu
     * @param {Number} a param tag desc
     * @param {String} cucu param tag desc
     * @description desc tag desc
     * @see seeTag see tag desc
     * @public Sets the order
     * @version 1.0.5 version tag desc
     * @since since tag desc
     * @returns {string} return tag desc
     */
    testB(a) {
      return a + 2;
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
     * @public Sets the order
     *
     * @description computed
     */
    computed1() {
      return "sono una computed";
    }
  },
  apollo: {
    session: {}
  }
};
</script>
