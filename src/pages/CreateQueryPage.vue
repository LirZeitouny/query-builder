<template>
  <q-page>
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Create Custom Query</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-card flat>
      <div v-for="(condition, cIndex) in conditions" :key="cIndex">
        <q-card-section horizontal>
          <!-- Condition start -->
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
              :options="ContainTypeOptions"
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
  </q-page>
</template>

<script>
import axios from 'axios';
import { ContainTypes, LogicalOperatorTypes } from './queryModel';

export default {
  data() {
    return {
      conditions: [],
      tableNameOptions: [],
      columnsOptions: [],
    };
  },

  mounted() {
    this.addCondition(0);
  },

  computed: {
    logicalOperationOptions() {
      return Object.values(LogicalOperatorTypes);
    },

    ContainTypeOptions() {
      return Object.values(ContainTypes);
    },
  },

  created() {
    this.fetchTableNames();
  },

  methods: {
    async fetchTableColumns(tableName) {
      try {
        const response = await axios.get(`/api/columns?tableName=${tableName}`);

        if (response.status !== 200) {
          throw new Error('Failed to fetch table information');
        }

        this.columnsOptions = response.data;
      } catch (error) {
        console.error('Error fetching table information:', error);
      }
    },

    async fetchTableNames() {
      try {
        const response = await axios.get('/api/tables');
        this.tableNameOptions = response.data;
      } catch (error) {
        console.error('Error fetching table names:', error);
      }
    },

    addGroup(cIndex, gIndex) {
      if (this.conditions[cIndex].depth == 3) return;

      const newGroup = {
        values: [],
        logicalOperator: LogicalOperatorTypes.OR,
      };

      this.conditions[cIndex].groups.splice(gIndex + 1, 0, newGroup);
      this.conditions[cIndex].depth++;
      this.addValue(cIndex, gIndex + 1);
    },

    addValue(cIndex, gIndex) {
      const newValue = {
        contains: ContainTypes.ANY,
        input: [],
        logicalOperator: LogicalOperatorTypes.OR,
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

    addCondition(cIndex = 0) {
      const firstCondition = {
        groups: [],
        depth: 0,
      };

      this.conditions.splice(cIndex, 0, firstCondition);
      this.addGroup(cIndex, -1);
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
              value.contains === ContainTypes.ANY ? 'OR ' : 'AND ';
            if (iIndex == value.input.length - 1) containsOperator = '';

            res += `${condition.column} LIKE '%${input}%' ${containsOperator}`;
          });

          res += ')';

          let valuesLogicalOperator =
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

    executeQuery() {
      let query = '';
      this.conditions.forEach(
        (condition) => (query += this.queryBuilder(condition))
      );
      console.log(query);
    },
  },
};
</script>

<style scoped>
/* Add your custom CSS styles here */
</style>
