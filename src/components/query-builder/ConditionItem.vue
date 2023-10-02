<template>
  <div>
    <q-card-section horizontal>
      <!-- Condition start -->
      <q-select
        v-if="cIndex > 0"
        :modelValue="conditionCopy.logicalOperator"
        @update:model-value="updateLogicalOperator"
        :options="logicalOperationOptions"
        outlined
        class="q-ma-md col-6"
        style="max-width: 100px"
      />
      <q-select
        :modelValue="conditionCopy.column"
        @update:model-value="updateColumn"
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
        @update:model-value="updateTableName"
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
import axios from 'axios';
import { ContainTypes, LogicalOperatorTypes } from '../../pages/queryModel';
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
    this.fetchTableNames();
  },

  methods: {
    updateLogicalOperator(value) {
      this.conditionCopy.logicalOperator = value;
      this.$emit('update:condition', this.conditionCopy, this.cIndex);
    },
    updateColumn(value) {
      this.conditionCopy.column = value;
      this.$emit('update:condition', this.conditionCopy, this.cIndex);
    },

    async updateTableName(value) {
      this.conditionCopy.tableName = value;
      await this.fetchTableColumns();
      this.$emit('update:condition', this.conditionCopy, this.cIndex);
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

    async fetchTableColumns() {
      if (!this.conditionCopy.tableName) {
        this.errorMessage =
          'Could not fetch tables columns from your database. Missing name. Please try again.';
        return;
      }

      try {
        const response = await axios.get(
          `/api/columns?tableName=${this.conditionCopy.tableName}`
        );

        if (response.status !== 200) {
          this.errorMessage = 'Failed to fetch table information';
          throw new Error('Failed to fetch table information');
        }

        this.columnsOptions = response.data;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage =
          'Error fetching table information. Please try again.';
        console.error('Error fetching table information:', error);
      }
    },

    async fetchTableNames() {
      try {
        const response = await axios.get('/api/tables');

        if (response.status !== 200) {
          this.errorMessage = 'Failed to fetch table names';
          throw new Error('Failed to fetch tables name.');
        }
        this.tableNameOptions = response.data;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Error fetching tables names. Please try again.';
        console.error('Error fetching tables names:', error);
      }
    },
  },
};
</script>

<style scoped>
</style>
