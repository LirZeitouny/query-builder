<template>
  <q-card>
    <q-card-section align="left">
      <q-btn label="Add Value" @click="addValue" />
      <q-btn label="Add Group" @click="addGroup" />
    </q-card-section>
    <q-select
      v-if="gIndex > 0"
      :modelValue="groupCopy.logicalOperator"
      @update:model-value="emitLogicalOperatorChange"
      :options="logicalOperationOptions"
      outlined
      class="q-ma-md col-6"
      style="max-width: 100px"
    >
    </q-select>
    <!-- Values -->
    <value-item
      v-for="(value, vIndex) in groupCopy.values"
      :key="vIndex"
      :valueProp="value"
      :vIndex="vIndex"
      @update:value="handleValueChange"
      @delete:value="handleValueDelete"
    >
    </value-item>
  </q-card>
</template>

<script>
import { ContainTypes, LogicalOperatorTypes } from '../../pages/queryModel';

import ValueItem from './ValueItem.vue';
export default {
  props: {
    group: Object,
    gIndex: Number,
  },

  components: {
    ValueItem,
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
      groupCopy: { ...this.group },
    };
  },

  methods: {
    emitLogicalOperatorChange(value) {
      this.groupCopy.logicalOperator = value;
      this.$emit('update:group', { ...this.groupCopy }, this.gIndex);
    },

    handleValueChange(updatedValue, vIndex) {
      this.groupCopy.values.splice(vIndex, 1, updatedValue);

      this.$emit('update:group', this.groupCopy, this.gIndex);
    },

    handleValueDelete(vIndex) {
      this.groupCopy.values.splice(vIndex, 1);

      if (this.groupCopy.values.length === 0) {
        this.$emit('delete-group');
      } else {
        this.$emit('update:group', this.groupCopy, this.gIndex);
      }
    },

    addValue() {
      const newValue = {
        contains: ContainTypes.ANY,
        logicalOperator: LogicalOperatorTypes.OR,
        input: [],
      };
      this.groupCopy.values.push(newValue);
      this.$emit('update:group', this.groupCopy, this.gIndex);
    },

    addGroup() {
      this.$emit('add-group');
    },
  },
};
</script>

<style scoped>
</style>
