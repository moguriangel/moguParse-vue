<template>
  <div></div>
</template>

<script>
export default {
  name: "componentInside2",
  props: {
    /**
     * prop foo in the componentInside2.
     */
    bar: {
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
