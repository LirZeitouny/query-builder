<template>
  <div>
    <q-card-section horizontal>
      <!-- Condition start -->
      <q-select
        v-if="cIndex > 0"
        :modelValue="condition.logicalOperator"
        @update:model-value="updateCondition('logicalOperator', $event)"
        :options="logicalOperationOptions"
        outlined
        class="q-ma-md col-6"
        style="max-width: 100px"
      />
      <q-select
        :modelValue="condition.column"
        @update:model-value="updateCondition('column', $event)"
        :options="columnsOptions"
        label="Where"
        outlined
        new-value-mode="add"
        use-input
        class="q-ma-md col-6"
        style="max-width: 300px"
      />
      <q-select
        :modelValue="condition.tableName"
        @update:model-value="handleTableNameUpdate($event)"
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
      v-for="(group, gIndex) in condition.groups"
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
    condition: Object,
    cIndex: Number,
  },

  data() {
    return {
      tableNameOptions: [],
      columnsOptions: [],
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
    updateCondition(key, value) {
      this.$emit(
        'update:condition',
        { ...this.condition, [key]: value },
        this.cIndex
      );
    },

    async handleTableNameUpdate(tableName) {
      this.columnsOptions = await fetchTableColumns(tableName);
      this.updateCondition('tableName', tableName);
    },

    handleAddGroup() {
      if (this.condition.groups.length === MAX_DEPTH) return;
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
      const newCondition = {
        ...this.condition,
        groups: [...this.condition.groups, newGroup],
      };
      this.$emit('update:condition', newCondition, this.cIndex);
    },

    handleDeleteGroup(gIndex) {
      const newCondition = {
        ...this.condition,
        groups: this.condition.groups.filter((_, index) => index !== gIndex),
      };

      if (newCondition.groups.length === 0) {
        this.$emit('delete-condition');
      } else {
        this.$emit('update:condition', newCondition, this.cIndex);
      }
    },

    handleGroupUpdate(updatedGroup, gIndex) {
      const newCondition = {
        ...this.condition,
        groups: this.condition.groups.map((group, index) =>
          index === gIndex ? updatedGroup : group
        ),
      };
      this.$emit('update:condition', newCondition, this.cIndex);
    },
  },
};
</script>

<style scoped>
</style>
