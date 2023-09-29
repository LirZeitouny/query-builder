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
            v-model="selectedColumns"
            :options="columnsOptions"
            multiple
            label="Where"
            outlined
            class="q-ma-md col-6"
            style="max-width: 300px"
          />
          <q-select
            v-model="selectedTable"
            :options="tableOptions"
            label="In"
            outlined
            class="q-ma-md col-6"
            style="max-width: 300px"
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
            <q-label
              class="q-ma-md col-4 text-center center-vertically"
              style="max-width: 100px"
              v-if="vIndex == 0"
              >ARE</q-label
            >
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

            <q-input
              class="q-ma-md col-6"
              style="max-width: 600px"
              v-model="value.input"
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
import { ContainTypes, LogicalOperatorTypes } from '../components/models';

export default {
  data() {
    return {
      conditions: [],
      lastConditionIndex: null,
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

  methods: {
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

    executeQuery() {
      // Construct and execute the query based on the conditions
      // You can i~mplement the query execution logic here
    },
  },
};
</script>

<style scoped>
/* Add your custom CSS styles here */
</style>
