<template>
  <div>Ciao</div>
</template>

<script>
export default {
  name: "componentInside",
  props: {
    /**
     * prop foo in the componentInside.
     */
    foo: {
      type: String
    }
  },
  methods: {
    /**
     * no tag -- method1 desc
     * @param {Number} a first number
     */
    method1(a) {
      return a + 2;
    }
  }
};
</script>
