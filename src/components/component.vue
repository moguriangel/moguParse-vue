<template>
  <div></div>
</template>

<script>
export default {
  name: "FantasticoComponente",
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
     * @public
     * test component
     * @param {Number} a first number
     */
    test(a) {
      return a + 2;
    }
  }
};
</script>
