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
      <ConditionItem
        v-for="(condition, cIndex) in conditions"
        :key="cIndex"
        :cIndex="cIndex"
      />
      <q-card-actions align="right">
        <q-btn
          label="Add Condition"
          @click="this.$store.commit('ADD_CONDITION', cIndex)"
          color="primary"
        />
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
import ConditionItem from '../components/query-builder/ConditionItem.vue';
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState({
      conditions: (state) => state.conditions,
      tableNameOptions: (state) => state.tableNameOptions,
      columnsOptions: (state) => state.columnsOptions,
      queryResult: (state) => state.queryResult,
      errorMessage: (state) => state.errorMessage,
      defaultContainType: (state) => state.defaultContainType,
      defaultLogicalOperator: (state) => state.defaultLogicalOperator,
    }),
  },

  components: {
    ConditionItem,
  },

  methods: {
    ...mapActions(['executeQuery', 'initializeData']),

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
