<template>
  <q-card-section>
    <div class="condition-row"></div>
  </q-card-section>
</template>

<script>
export default {
  data() {
    return {
      conditions: [],
      tableOptions: ['cities_table'],
      columnsOptions: ['city'],
      containsOptions: ['any', 'all'],
      queryTypeOptions: ['SELECT'],
      clausesOptions: ['AND', 'OR'],
      lastConditionIndex: 0,
      lastGroupIndex: 0,
    };
  },
};
</script>

<style scoped>
.select-field {
  min-width: 150px;
  width: auto;
}
</style>
