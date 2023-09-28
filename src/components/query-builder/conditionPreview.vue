<template>
  <q-card bordered>
    <q-card-section style="display: flex" horizontal>
      <!--         <q-select
          v-model="selectedQueryType"
          :options="queryTypeOptions"
          label="Query Type"
          outlined
          style="min-width: 150px"
        /> -->
      <q-select
        v-model="selectedTable"
        :options="tableOptions"
        multiple
        label="Table Name"
        outlined
        style="min-width: 150px"
      />

      <q-select
        v-model="selectedColumns"
        :options="columnsOptions"
        multiple
        label="Columns"
        outlined
        style="min-width: 150px"
      />
    </q-card-section>
    <GroupPreview
      v-for="(group, gIndex) in condition.groups"
      :key="gIndex"
    ></GroupPreview>
    <ValuePreview v-for="(valuw, vIndex) in condition.values" :key="vIndex">
    </ValuePreview>
    <q-card-section align="left">
      <q-btn label="Add Value" @click="addValue" />
      <q-btn label="Add Group" @click="addGroup" />
    </q-card-section>
  </q-card>
</template>

<script>
import ValuePreview from './valuePreview.vue';
import GroupPreview from './groupPreview.vue';
import { Contain, LogicalOperator } from '../models';

export default {
  props: {
    conditionProp: {
      type: Object,
      required: true,
    },
  },

  components: {
    ValuePreview,
    GroupPreview,
  },

  data() {
    return {
      condition: { groups: conditionProp.groups, values: conditionProp.values },
    };
  },

  methods: {
    addGroup() {
      let newGroup = {
        values: [],
        logicalOperator: LogicalOperator.OR,
        depth: 0,
      };

      lastConditionIndex &&
        this.conditions[this.lastConditionIndex].groups.push(newGroup);
    },

    addValue() {
      let newValue = {
        contains: Contain.ANY,
        input: [],
        logicalOperator: LogicalOperator.OR,
      };

      lastGroupIndex &&
        this.conditions[this.lastConditionIndex].groups[
          this.lastGroupIndex
        ].push(newValue);
    },
  },
};
</script>

<style></style>
