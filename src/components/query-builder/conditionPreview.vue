<template>
  <q-card bordered>
    <q-card-section horizontal>
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
    <q-card-section
      v-for="(group, gIndex) in condition.groups"
      :key="gIndex"
      :style="{ 'margin-left': gIndex * 40 + 'px' }"
    >
      <q-select
        v-model="group.logicalOperator"
        :options="logicalOperationOptions"
        outlined
        label="condition"
        class="q-ma-md col-6"
        style="max-width: 300px"
      >
      </q-select>
      <ValuePreview
        v-for="(value, vIndex) in group.values"
        :key="vIndex"
        :valueProp="value"
        :vIndex="vIndex"
      >
      </ValuePreview>
    </q-card-section>
    <q-card-section align="left">
      <q-btn label="Add Value" @click="addValue" />
      <q-btn label="Add Group" @click="addGroup" />
    </q-card-section>
  </q-card>
</template>

<script>
import { Contain, LogicalOperatorTypes } from '../models';
import ValuePreview from './valuePreview.vue';

export default {
  props: {
    conditionProp: {
      type: Object,
      required: true,
    },
  },

  components: {
    ValuePreview,
  },

  data() {
    return {
      condition: {
        groups: this.conditionProp.groups,
        depth: 0,
      },

      lastGroupIndex: null,
    };
  },

  computed: {
    logicalOperationOptions() {
      return Object.values(LogicalOperatorTypes);
    },
  },

  methods: {
    addGroup() {
      if (this.condition.depth == 3) return;

      const newGroup = {
        values: [],
        logicalOperator: LogicalOperatorTypes.OR,
        depth: 0,
      };

      this.condition.groups.push(newGroup);
      this.lastGroupIndex = this.condition.groups.length - 1;
      this.condition.depth++;
      this.addValue();
    },

    addValue() {
      if (this.lastGroupIndex !== null) {
        const newValue = {
          contains: Contain.ANY,
          input: [],
          logicalOperator: LogicalOperatorTypes.OR,
        };

        this.condition.groups[this.lastGroupIndex].values.push(newValue);
      }
    },
  },
};
</script>

<style>
</style>
<style>
</style>
