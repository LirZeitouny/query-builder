import { createApp } from 'vue';
import { createStore } from 'vuex';
import axios from 'axios';
import { ContainTypes, LogicalOperatorTypes } from '../pages/queryModel';
import { queryBuilder } from './queryBuilderHelper'; // Replace with the actual path to your query builder file

const app = createApp();

app.use(createStore());

const MAX_DEPTH = 3;
const store = createStore({
  state: {
    conditions: [],
    tableNameOptions: [],
    columnsOptions: [],
    queryResult: [],
    errorMessage: '',
    defaultContainType: ContainTypes.ANY,
    defaultLogicalOperator: LogicalOperatorTypes.OR,
  },

  mutations: {
    // Mutations for updating state go here
    SET_CONDITION(state, conditionParams) {
      const { condition, cIndex } = conditionParams;
      state.conditions[cIndex] = condition;
    },
    SET_TABLE_NAME_OPTIONS(state, options) {
      state.tableNameOptions = options;
    },
    SET_COLUMNS_OPTIONS(state, options) {
      state.columnsOptions = options;
    },
    SET_QUERY_RESULT(state, result) {
      state.queryResult = result;
    },
    SET_ERROR_MESSAGE(state, message) {
      state.errorMessage = message;
    },

    ADD_CONDITION(state) {
      const newCondition = {
        groups: [
          {
            values: [
              {
                contains: state.defaultContainType,
                logicalOperator: state.defaultLogicalOperator,
                input: [],
              },
            ],
            logicalOperator: state.defaultLogicalOperator,
          },
        ],
        depth: 1,
        logicalOperator: state.defaultLogicalOperator,
        column: '',
        tableName: '',
      };
      state.conditions.push(newCondition);
    },

    ADD_GROUP(state, cIndex) {
      if (state.conditions[cIndex].depth === MAX_DEPTH) return;

      const newGroup = {
        values: [
          {
            contains: state.defaultContainType,
            logicalOperator: state.defaultLogicalOperator,
            input: [],
          },
        ],
        logicalOperator: state.defaultLogicalOperator,
      };

      state.conditions[cIndex]?.groups.push(newGroup);
      state.conditions[cIndex].depth++;
    },

    ADD_VALUE(state, Indexes) {
      const { cIndex, gIndex } = Indexes;
      const newValue = {
        contains: state.defaultContainType,
        logicalOperator: state.defaultLogicalOperator,
        input: [],
      };
      console.log(cIndex, gIndex);
      state.conditions[cIndex].groups[gIndex].values.push(newValue);
    },

    DELETE_VALUE(state, Indexes) {
      const { cIndex, gIndex, vIndex } = Indexes;
      state.conditions[cIndex].groups[gIndex].values.splice(vIndex, 1);
      if (state.conditions[cIndex].groups[gIndex].values.length === 0) {
        state.conditions[cIndex].groups.splice(gIndex, 1);
        state.conditions[cIndex].depth--;
      }
      if (state.conditions[cIndex].groups.length === 0)
        state.conditions.splice(cIndex, 1);
    },
  },

  actions: {
    async fetchTableColumns({ commit }, tableName) {
      try {
        const response = await axios.get(`/api/columns?tableName=${tableName}`);

        if (response.status !== 200) {
          throw new Error('Failed to fetch table information');
        }

        commit('SET_COLUMNS_OPTIONS', response.data);
        commit('SET_ERROR_MESSAGE', '');
      } catch (error) {
        commit(
          'SET_ERROR_MESSAGE',
          'Error fetching table information. Please try again.'
        );
        console.error('Error fetching table information:', error);
      }
    },

    // Execute the query based on the conditions in the store
    async executeQuery({ commit, state }) {
      let query = '';
      state.conditions.forEach((condition, index) => {
        const conditionLogicalOperator =
          index === state.conditions.length - 1
            ? ''
            : condition.logicalOperator;
        query += queryBuilder(condition) + conditionLogicalOperator + ' ';
      });

      console.log('Executing query:', query);

      if (!query) {
        commit('SET_ERROR_MESSAGE', 'Missing Query.');
      }

      try {
        const response = await axios.post('/api/custom-query', {
          query,
        });

        if (response.status !== 200) {
          commit('SET_ERROR_MESSAGE', 'Error executing query.');
          throw new Error('Failed to execute your query');
        }

        commit('SET_QUERY_RESULT', response.data);
        commit('SET_ERROR_MESSAGE', '');
      } catch (error) {
        commit('SET_ERROR_MESSAGE', 'Error executing query. Please try again.');
        console.error('Error executing query:', error);
      }
    },

    async initializeData({ commit }) {
      commit('ADD_CONDITION');
      try {
        const response = await axios.get('/api/tables');

        if (response.status !== 200) {
          throw new Error('Failed to fetch tables name.');
        }

        commit('SET_TABLE_NAME_OPTIONS', response.data);
      } catch (error) {
        commit(
          'SET_ERROR_MESSAGE',
          'Error fetching tables names. Please try again.'
        );

        console.error('Error fetching tables names:', error);
      }
    },
  },

  getters: {
    // Getters for computed properties go here
    logicalOperationOptions: (state) => Object.values(LogicalOperatorTypes),
    containTypeOptions: (state) => Object.values(ContainTypes),
  },
});

export default store;
