<template>
  <q-card>
    <q-card-section align="left">
      <q-btn label="Add Value" @click="addValue" />
      <q-btn label="Add Group" @click="addGroup" />
    </q-card-section>
    <q-select
      v-if="gIndex > 0"
      :modelValue="group.logicalOperator"
      @update:model-value="handleLogicalOperatorChange"
      :options="logicalOperationOptions"
      outlined
      class="q-ma-md col-6"
      style="max-width: 100px"
    >
    </q-select>
    <!-- Values -->
    <value-item
      v-for="(value, vIndex) in group.values"
      :key="vIndex"
      :valueProp="value"
      :vIndex="vIndex"
      @update:value="handleValueUpdate"
      @delete:value="handleValueDelete"
    >
    </value-item>
  </q-card>
</template>

<script>
import { ContainTypes, LogicalOperatorTypes } from '../../types/queryModel';

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

  methods: {
    handleLogicalOperatorChange(value) {
      this.$emit(
        'update:group',
        { ...this.group, logicalOperator: value },
        this.gIndex
      );
    },

    handleValueUpdate(updatedValue, vIndex) {
      const newGroup = {
        ...this.group,
        values: this.group.values.map((value, index) =>
          index === vIndex ? updatedValue : value
        ),
      };

      this.$emit('update:group', newGroup, this.gIndex);
    },

    handleValueDelete(vIndex) {
      const newGroup = {
        ...this.group,
        values: this.group.values.filter((_, index) => index !== vIndex),
      };

      if (newGroup.values.length === 0) {
        this.$emit('delete-group');
      } else {
        this.$emit('update:group', newGroup, this.gIndex);
      }
    },

    addValue() {
      const newValue = {
        contains: ContainTypes.ANY,
        logicalOperator: LogicalOperatorTypes.OR,
        input: [],
      };

      const newGroup = {
        ...this.group,
        values: [...this.group.values, newValue],
      };

      this.$emit('update:group', newGroup, this.gIndex);
    },

    addGroup() {
      this.$emit('add-group');
    },
  },
};
</script>

<style scoped>
</style>
