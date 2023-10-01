import { createStore, Commit } from 'vuex'; // Import Commit from vuex for type checking
import axios from 'axios';
import {
  ContainTypes,
  LogicalOperatorTypes,
  QueryResultItem,
  Condition,
  Value,
  Group,
} from '../pages/queryModel'; // Import your models

import { queryBuilder } from './queryBuilderHelper';

const MAX_DEPTH = 3;

interface RootState {
  conditions: Condition[];
  tableNameOptions: string[];
  columnsOptions: string[];
  queryResult: QueryResultItem[]; // Change the type as per your query result
  errorMessage: string;
  defaultContainType: ContainTypes;
  defaultLogicalOperator: LogicalOperatorTypes;
}

const store = createStore<RootState>({
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
    SET_CONDITION(
      state,
      { condition, cIndex }: { condition: Condition; cIndex: number }
    ) {
      state.conditions[cIndex] = condition;
    },
    SET_TABLE_NAME_OPTIONS(state, options: string[]) {
      state.tableNameOptions = options;
    },
    SET_COLUMNS_OPTIONS(state, options: string[]) {
      state.columnsOptions = options;
    },
    SET_QUERY_RESULT(state, result: any[]) {
      state.queryResult = result;
    },
    SET_ERROR_MESSAGE(state, message: string) {
      state.errorMessage = message;
    },

    ADD_CONDITION(state) {
      const newCondition: Condition = {
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
        columns: '',
        tableName: '',
      };
      state.conditions.push(newCondition);
    },

    ADD_GROUP(state, cIndex: number) {
      if (state.conditions[cIndex].depth === MAX_DEPTH) return;

      const newGroup: Group = {
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

    ADD_VALUE(state, { cIndex, gIndex }: { cIndex: number; gIndex: number }) {
      const newValue: Value = {
        contains: state.defaultContainType,
        logicalOperator: state.defaultLogicalOperator,
        input: [],
      };
      state.conditions[cIndex].groups[gIndex].values.push(newValue);
    },

    DELETE_VALUE(
      state,
      {
        cIndex,
        gIndex,
        vIndex,
      }: { cIndex: number; gIndex: number; vIndex: number }
    ) {
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
    async fetchTableColumns({ commit }: { commit: Commit }, tableName: string) {
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

    async executeQuery({
      commit,
      state,
    }: {
      commit: Commit;
      state: RootState;
    }) {
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

    async initializeData({ commit }: { commit: Commit }) {
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
    logicalOperationOptions: (state) => Object.values(LogicalOperatorTypes),
    containTypeOptions: () => Object.values(ContainTypes), // No need for 'state' here
  },
});

export default store;
