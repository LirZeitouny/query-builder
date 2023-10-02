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
      @update:model-value="updateLogicalOperator"
    />
    <q-select
      :modelValue="valueCopy.contains"
      :options="containTypeOptions"
      label="Contains"
      outlined
      class="q-ma-md col-6"
      style="max-width: 300px"
      @update:model-value="updateContains"
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
      @update:model-value="updateInput"
    />
    <q-btn @click="deleteValue" flat round icon="delete" color="negative" />
  </q-card-section>
</template>

<script>
import { ContainTypes, LogicalOperatorTypes } from '../../pages/queryModel';

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
    updateLogicalOperator(value) {
      this.valueCopy.logicalOperator = value;
      this.$emit('update:value', this.valueCopy, this.vIndex);
    },

    updateContains(value) {
      this.valueCopy.contains = value;
      this.$emit('update:value', this.valueCopy, this.vIndex);
    },
    updateInput(value) {
      this.valueCopy.input = value;
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
