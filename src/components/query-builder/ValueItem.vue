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
      ג
      :modelValue="valueProp.logicalOperator"
      :options="logicalOperationOptions"
      outlined
      class="q-ma-md col-6"
      style="max-width: 100px"
      @update:model-value="updateValueProp('logicalOperator', $event)"
    />
    <q-select
      :modelValue="valueProp.contains"
      :options="containTypeOptions"
      label="Contains"
      outlined
      class="q-ma-md col-6"
      style="max-width: 300px"
      @update:model-value="updateValueProp('contains', $event)"
    />

    <q-select
      class="q-ma-md col-6"
      style="max-width: 600px"
      :modelValue="valueProp.input"
      use-input
      new-value-mode="add"
      multiple
      hide-dropdown-icon
      label="Value"
      outlined
      @update:model-value="updateValueProp('input', $event)"
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

  methods: {
    updateValueProp(key, value) {
      this.$emit(
        'update:value',
        { ...this.valueProp, [key]: value },
        this.vIndex
      );
    },

    deleteValue() {
      this.$emit('delete:value', this.vIndex);
    },
  },
};
</script>

<style scoped>
</style>
