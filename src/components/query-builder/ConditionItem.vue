<template>
  <div>
    <q-card-section horizontal>
      <!-- Condition start -->
      <q-select
        v-if="cIndex > 0"
        :modelValue="conditionCopy.logicalOperator"
        @update:model-value="
          (value) => updateConditionProp('logicalOperator', value)
        "
        :options="logicalOperationOptions"
        outlined
        class="q-ma-md col-6"
        style="max-width: 100px"
      />
      <q-select
        :modelValue="conditionCopy.column"
        @update:model-value="(value) => updateConditionProp('column', value)"
        :options="columnsOptions"
        label="Where"
        outlined
        new-value-mode="add"
        use-input
        class="q-ma-md col-6"
        style="max-width: 300px"
      />
      <q-select
        :modelValue="conditionCopy.tableName"
        @update:model-value="(value) => updateConditionProp('tableName', value)"
        :options="tableNameOptions"
        label="In"
        outlined
        class="q-ma-md col-6"
        emit-value
        style="max-width: 300px"
      />
    </q-card-section>
    <!-- Groups-->
    <group-item
      v-for="(group, gIndex) in conditionCopy.groups"
      :key="gIndex"
      :style="{ 'margin-left': gIndex * 100 + 'px' }"
      :group="group"
      :gIndex="gIndex"
      @update:group="handleGroupUpdate"
      @add-group="handleAddGroup"
      @delete-group="handleDeleteGroup"
    >
    </group-item>
  </div>
</template>

<script>
import {
  fetchTableNames,
  fetchTableColumns,
} from '../../services/queryServices';
import { ContainTypes, LogicalOperatorTypes } from '../../types/queryModel';
import GroupItem from './GroupItem.vue';
const MAX_DEPTH = 3;

export default {
  props: {
    condition: Object, // The 'condition' prop from the parent
    cIndex: Number, // The 'cIndex' prop from the parent
  },

  data() {
    return {
      tableNameOptions: [],
      columnsOptions: [],
      conditionCopy: { ...this.condition },
      errorMessage: '',
    };
  },

  components: {
    GroupItem,
  },

  computed: {
    logicalOperationOptions() {
      return Object.values(LogicalOperatorTypes);
    },
    containTypeOptions() {
      return Object.values(ContainTypes);
    },
  },

  async created() {
    this.tableNameOptions = await fetchTableNames();
  },

  methods: {
    updateConditionProp(key, value) {
      this.conditionCopy[key] = value;
      if (key === 'tableName') this.updateColumnsFromTable(value);
      this.$emit('update:condition', this.conditionCopy, this.cIndex);
    },

    async updateColumnsFromTable(tableName) {
      this.columnsOptions = await fetchTableColumns(tableName);
    },

    handleAddGroup() {
      if (this.conditionCopy.groups.length === MAX_DEPTH) return;
      const newGroup = {
        values: [
          {
            contains: ContainTypes.ANY,
            logicalOperator: LogicalOperatorTypes.OR,
            input: [],
          },
        ],
        logicalOperator: LogicalOperatorTypes.OR,
      };

      this.conditionCopy.groups.push(newGroup);
      this.$emit('update:condition', this.conditionCopy, this.cIndex);
    },

    handleDeleteGroup(gIndex) {
      this.conditionCopy.groups.splice(gIndex, 1);

      if (this.conditionCopy.groups.length === 0) {
        this.$emit('delete-condition');
      } else {
        this.$emit('update:condition', this.conditionCopy, this.cIndex);
      }
    },

    handleGroupUpdate(updatedGroup, gIndex) {
      this.conditionCopy.groups.splice(gIndex, 1, updatedGroup);
      this.$emit('update:condition', this.conditionCopy, this.cIndex);
    },
  },
};
</script>

<style scoped>
</style>
