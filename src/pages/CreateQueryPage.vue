<template>
  <div>
    <q-page>
      <q-header>
        <q-toolbar>
          <q-toolbar-title>Create Custom Query</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <q-banner v-if="errorMessage" color="negative">
        <q-btn flat round dense icon="close" @click="errorMessage = ''" />
      </q-banner>
      <q-card flat>
        <condition-item
          v-for="(condition, cIndex) in conditions"
          :key="cIndex"
          :condition="condition"
          :cIndex="cIndex"
          @update:condition="handleConditionUpdate"
          @delete-condition="handleDeleteCondition"
        >
        </condition-item>
        <q-card-actions align="right">
          <q-btn label="Add Condition" @click="addCondition" color="primary" />
          <q-btn label="Execute Query" @click="executeQuery" color="primary" />
        </q-card-actions>
      </q-card>
      <q-card>
        <q-table
          v-if="queryResult.length"
          :rows="queryResult"
          :columns="getColumns(queryResult)"
          row-key="ID"
        ></q-table>
      </q-card>
    </q-page>
  </div>
</template>

<script>
import ConditionItem from '../components/query-builder/ConditionItem.vue';
import { ContainTypes, LogicalOperatorTypes } from '../types/queryModel';
import { executeCustomQuery } from '../services/queryServices';

export default {
  components: { ConditionItem },

  data() {
    return {
      conditions: [],
      tableNameOptions: [],
      columnsOptions: [],
      queryResult: [],
      errorMessage: '',
    };
  },
  created() {
    this.addCondition();
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
    addCondition() {
      const newCondition = {
        groups: [
          {
            values: [
              {
                contains: ContainTypes.ANY,
                logicalOperator: LogicalOperatorTypes.OR,
                input: [],
              },
            ],
            logicalOperator: LogicalOperatorTypes.OR,
          },
        ],
        depth: 0,
        logicalOperator: LogicalOperatorTypes.OR,
      };

      const index =
        this.conditions.length === 0 ? 0 : this.conditions.length - 1;
      this.conditions.splice(index, 0, newCondition);
    },

    handleDeleteCondition(cIndex) {
      this.conditions.splice(cIndex, 1);
    },

    getColumns(data) {
      if (!data.length) return [];

      const keys = Object.keys(data[0]);

      const columns = keys.map((key) => ({
        name: key,
        required: true,
        label: key,
        align: 'left',
        field: key,
        sortable: true,
      }));

      return columns;
    },

    handleConditionUpdate(updatedCondition, cIndex) {
      this.conditions.splice(cIndex, 1, updatedCondition);
    },

    async executeQuery() {
      const query = this.buildQuery(this.conditions);
      console.log('Executing query:', query);

      if (!query) {
        this.errorMessage = 'Missing Query.';
        return;
      }

      try {
        const queryResult = await executeCustomQuery(query);

        if (queryResult.error) {
          this.errorMessage = 'Error executing query.';
          console.error('Error executing query:', queryResult.error);
        } else {
          this.queryResult = queryResult.data;
          this.errorMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'Error executing query. Please try again.';
        console.error('Error executing query:', error);
      }
    },

    conditionBuilder(condition) {
      let res = 'SELECT * ';
      res += `FROM ${condition.tableName} `;
      res += 'WHERE ';

      condition.groups.forEach((group, gIndex) => {
        res += ' (';
        group.values.forEach((value, vIndex) => {
          res += '(';
          value.input.forEach((input, iIndex) => {
            let containsOperator =
              value.contains === ContainTypes.ANY ? 'OR ' : 'AND ';
            if (iIndex == value.input.length - 1) containsOperator = '';

            res += `${condition.column} LIKE '%${input}%' ${containsOperator}`;
          });

          res += ')';

          const valuesLogicalOperator =
            vIndex === group.values.length - 1 ? '' : value.logicalOperator;
          res += valuesLogicalOperator;
        });
        res += ') ';

        let groupsLogicalOperator =
          gIndex === condition.groups.length - 1 ? '' : group.logicalOperator;
        res += groupsLogicalOperator;
      });

      return res.replace(/\s+/g, ' '); //removing duplicate spaces
    },

    buildQuery() {
      let query = '';
      this.conditions.forEach((condition, index) => {
        const conditionLogicalOperator =
          index === this.conditions.length - 1 ? '' : condition.logicalOperator;
        query +=
          this.conditionBuilder(condition) + conditionLogicalOperator + ' ';
      });

      return query;
    },
  },
};
</script>

<style scoped>
</style>
