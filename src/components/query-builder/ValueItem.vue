<template>
  <q-card-section horizontal>
    <p
      class="q-ma-md col-4 text-center center-vertically"
      style="max-width: 100px"
      v-if="vIndex === 0"
    >
      ARE
    </p>
    <q-select
      v-else
      :modelValue="valueCopy.logicalOperator"
      :options="logicalOperationOptions"
      outlined
      class="q-ma-md col-6"
      style="max-width: 100px"
      @update:model-value="(value) => updateValueProp('logicalOperator', value)"
    />
    <q-select
      :modelValue="valueCopy.contains"
      :options="containTypeOptions"
      label="Contains"
      outlined
      class="q-ma-md col-6"
      style="max-width: 300px"
      @update:model-value="(value) => updateValueProp('contains', value)"
    />

    <q-select
      class="q-ma-md col-6"
      style="max-width: 600px"
      :modelValue="valueCopy.input"
      use-input
      use-chips
      new-value-mode="add"
      multiple
      hide-dropdown-icon
      label="Value"
      outlined
      @update:model-value="(value) => updateValueProp('input', value)"
    />
    <q-btn @click="deleteValue" flat round icon="delete" color="negative" />
  </q-card-section>
</template>

<script>
import { ContainTypes, LogicalOperatorTypes } from '../../types/queryModel';

export default {
  props: {
    valueProp: Object,
    vIndex: Number,
  },
  computed: {
    logicalOperationOptions() {
      return Object.values(LogicalOperatorTypes);
    },
    containTypeOptions() {
      return Object.values(ContainTypes);
    },
  },
  data() {
    return {
      valueCopy: { ...this.valueProp },
    };
  },
  methods: {
    updateValueProp(key, value) {
      this.valueCopy[key] = value;
      this.$emit('update:value', this.valueCopy, this.vIndex);
    },

    deleteValue() {
      this.$emit('delete:value', this.vIndex);
    },
  },
};
</script>

<style scoped>
</style>
