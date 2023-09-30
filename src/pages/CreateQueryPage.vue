<template>
  <q-page>
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Create Custom Query</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-banner v-if="errorMessage" color="negative">
      {{ errorMessage }}
      <q-btn flat round dense icon="close" @click="errorMessage = ''" />
    </q-banner>
    <q-card flat>
      <div v-for="(condition, cIndex) in conditions" :key="cIndex">
        <q-card-section horizontal>
          <!-- Condition start -->
          <q-select
            v-if="cIndex > 0"
            v-model="condition.logicalOperator"
            :options="logicalOperationOptions"
            outlined
            class="q-ma-md col-6"
            style="max-width: 100px"
          />
          <q-select
            v-model="condition.column"
            :options="columnsOptions"
            label="Where"
            outlined
            new-value-mode="add"
            use-input
            class="q-ma-md col-6"
            style="max-width: 300px"
          />
          <q-select
            v-model="condition.tableName"
            :options="tableNameOptions"
            label="In"
            outlined
            class="q-ma-md col-6"
            style="max-width: 300px"
            @update:model-value="fetchTableColumns(condition.tableName)"
          />
        </q-card-section>
        <!-- Groups-->
        <q-card
          v-for="(group, gIndex) in condition.groups"
          :key="gIndex"
          :style="{ 'margin-left': gIndex * 100 + 'px' }"
        >
          <q-card-section align="left">
            <q-btn label="Add Value" @click="addValue(cIndex, gIndex)" />
            <q-btn label="Add Group" @click="addGroup(cIndex, gIndex)" />
          </q-card-section>
          <q-select
            v-if="gIndex > 0"
            v-model="group.logicalOperator"
            :options="logicalOperationOptions"
            outlined
            class="q-ma-md col-6"
            style="max-width: 100px"
          >
          </q-select>
          <!-- Values -->
          <q-card-section
            v-for="(value, vIndex) in group.values"
            :key="vIndex"
            horizontal
          >
            <p
              class="q-ma-md col-4 text-center center-vertically"
              style="max-width: 100px"
              v-if="vIndex == 0"
            >
              ARE
            </p>
            <q-select
              v-else
              v-model="value.logicalOperator"
              :options="logicalOperationOptions"
              outlined
              class="q-ma-md col-6"
              style="max-width: 100px"
            />
            <q-select
              v-model="value.contains"
              :options="containTypeOptions"
              label="Contains"
              outlined
              class="q-ma-md col-6"
              style="max-width: 300px"
            />

            <q-select
              class="q-ma-md col-6"
              style="max-width: 600px"
              v-model="value.input"
              use-input
              use-chips
              new-value-mode="add"
              multiple
              hide-dropdown-icon
              label="Value"
              outlined
            />
            <q-btn
              @click="deleteValue(cIndex, gIndex, vIndex)"
              flat
              round
              icon="delete"
              color="negative"
            />
          </q-card-section>
        </q-card>
      </div>
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
</template>

<script>
import axios from 'axios';
import { ContainTypes, LogicalOperatorTypes } from './queryModel';
const MAX_DEPTH = 3;
export default {
  data() {
    return {
      conditions: [],
      tableNameOptions: [],
      columnsOptions: [],
      queryResult: [],
      errorMessage: '',
    };
  },

  mounted() {
    this.addCondition(0);
  },

  props: {
    defaultContainType: {
      type: String,
      default: ContainTypes.ANY,
    },
    defaultLogicalOperator: {
      type: String,
      default: LogicalOperatorTypes.OR,
    },
  },

  computed: {
    logicalOperationOptions() {
      return Object.values(LogicalOperatorTypes);
    },

    containTypeOptions() {
      return Object.values(ContainTypes);
    },
  },

  created() {
    this.fetchTableNames();
  },

  methods: {
    async fetchTableColumns(tableName) {
      if (!tableName) {
        this.errorMessage =
          'Could not fetch tables columns from you database. Missing name. Please try again.';
      }

      try {
        const response = await axios.get(`/api/columns?tableName=${tableName}`);

        if (response.status !== 200) {
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
          throw new Error('Failed to fetch tables name.');
        }
        this.tableNameOptions = response.data;
      } catch (error) {
        this.errorMessage = 'Error fetching tables names. Please try again.';
        console.error('Error fetching tables names:', error);
      }
    },

    addGroup(cIndex, gIndex) {
      if (this.conditions[cIndex].depth === MAX_DEPTH) return;

      const newGroup = {
        values: [],
        logicalOperator: this.defaultLogicalOperator,
      };

      this.conditions[cIndex].groups.splice(gIndex + 1, 0, newGroup);
      this.conditions[cIndex].depth++;
      this.addValue(cIndex, gIndex + 1);
    },

    addValue(cIndex, gIndex) {
      const newValue = {
        contains: this.defaultContainType,
        logicalOperator: this.defaultLogicalOperator,
        input: [],
      };

      this.conditions[cIndex].groups[gIndex].values.push(newValue);
    },

    deleteValue(cIndex, gIndex, vIndex) {
      this.conditions[cIndex].groups[gIndex].values.splice(vIndex, 1);
      if (this.conditions[cIndex].groups[gIndex].values.length === 0) {
        this.conditions[cIndex].groups.splice(gIndex, 1);
        this.conditions[cIndex].depth--;
      }
      if (this.conditions[cIndex].groups.length === 0)
        this.conditions.splice(cIndex, 1);
    },

    addCondition() {
      const newCondition = {
        groups: [],
        depth: 0,
        logicalOperator: this.defaultLogicalOperator,
      };

      const index =
        this.conditions.length == 0 ? 0 : this.conditions.length - 1;
      this.conditions.splice(index, 0, newCondition);
      this.addGroup(index, -1);
    },

    queryBuilder(condition) {
      let res = 'SELECT * ';
      res += `FROM ${condition.tableName} `;
      res += 'WHERE ';

      condition.groups.forEach((group, gIndex) => {
        res += ' (';
        group.values.forEach((value, vIndex) => {
          res += '(';
          value.input.forEach((input, iIndex) => {
            let containsOperator =
              value.contains === this.defaultContainType ? 'OR ' : 'AND ';
            if (iIndex == value.input.length - 1) containsOperator = '';

            res += `${condition.column} LIKE '%${input}%' ${containsOperator}`;
          });

          res += ')';

          const valuesLogicalOperator =
            vIndex === group.values.length - 1 ? '' : value.logicalOperator;
          res += valuesLogicalOperator;

          console.log(valuesLogicalOperator);
        });
        res += ') ';

        let groupsLogicalOperator =
          gIndex === condition.groups.length - 1 ? '' : group.logicalOperator;
        res += groupsLogicalOperator;
      });

      return res.replace(/\s+/g, ' '); //removing duplicate spaces
    },

    async executeQuery() {
      let query = '';
      this.conditions.forEach((condition, index) => {
        const conditionLogicalOperatoe =
          index === this.conditions.length - 1 ? '' : condition.logicalOperator;
        query += this.queryBuilder(condition) + conditionLogicalOperatoe + ' ';
      });

      console.log('Executing query:', query);

      if (!query) {
        this.errorMessage = 'Missing Query.';
      }

      try {
        const response = await axios.post('/api/custom-query', {
          query,
        });

        if (response.status !== 200) {
          this.errorMessage = 'Error executing query.';
          throw new Error('Failed to execute your query');
        }

        this.queryResult = response.data;
        this.errorMessage = '';
      } catch (error) {
        this.errorMessage = 'Error executing query. Please try again.';
        console.error('Error executing query:', error);
      }
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
  },
};
</script>

<style scoped>
/* Add your custom CSS styles here */
</style>
