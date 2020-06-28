<template>
  <div></div>
</template>

<script>
export default {
  name: "componentInMixinFolder",
  methods: {
    /**
     * no tag -- What are you doing in a mixin folder?
     * @description This should not be your place, bad bad component
     * @param {Number} a first number
     */
    method1(a) {
      return a + 2;
    }
  }
};
</script>
