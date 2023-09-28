<template>
  <q-page>
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Create Custom Query</q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-card
      >{{ condition }}
      <q-card-section v-for="(condition, cIndex) in conditions" :key="cIndex">
        <ConditionPreview :conditionProp="condition"> </ConditionPreview>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Add Condition" @click="addCondition" color="primary" />
        <q-btn label="Execute Query" @click="executeQuery" color="primary" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import ConditionPreview from '../components/query-builder/conditionPreview.vue';

export default {
  components: {
    ConditionPreview,
  },

  data() {
    return {
      conditions: [],
      lastConditionIndex: null,
      lastGroupIndex: null,
    };
  },

  mounted() {
    let firstCondition = {
      groups: [],
      values: [],
    };

    this.lastConditionIndex = 0;
    this.conditions.push(firstCondition);
  },

  methods: {
    addCondition() {
      this.conditions.push({
        groups: [],
        values: [],
      });
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
