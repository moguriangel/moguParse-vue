<template>
  <div></div>
</template>

<script>
export default {
  name: "NoParsed",
  props: {
    /**
     * no parsed file
     */
    comProp: {
      type: Array,
      required: false,
      default: () => [],
      validation: () => ({})
    }
  }
};
</script>
