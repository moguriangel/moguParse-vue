<template>
  <div>Ciao</div>
</template>

<script>
export default {
  name: "",
  props: {
    /**
     * Defined in the component.
     */
    foo: {
      type: String
    }
  },
  methods: {
    /**
     * test comp2
     * @public
     * @see goggle
     * @param {Number} a first number
     */
    test1(a) {
      return a + 2;
    }
  }
};
</script>
