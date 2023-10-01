<template>
  <div>
    <q-card-section horizontal>
      <!-- Condition start -->
      <q-select
        v-if="cIndex > 0"
        v-model="condition.logicalOperator"
        :options="logicalOperationOptions"
        outlined
        class="q-ma-md col-6"
        style="max-width: 100px"
        @update:model-value="
          this.$store.commit('SET_CONDITION', { cIndex, condition })
        "
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
        @update:model-value="
          this.$store.commit('SET_CONDITION', { cIndex, condition })
        "
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
        <q-btn
          label="Add Value"
          @click="() => this.$store.commit('ADD_VALUE', { cIndex, gIndex })"
        />
        <q-btn
          label="Add Group"
          @click="() => this.$store.commit('ADD_GROUP', gIndex)"
        />
      </q-card-section>
      <q-select
        v-if="gIndex > 0"
        v-model="group.logicalOperator"
        :options="logicalOperationOptions"
        outlined
        class="q-ma-md col-6"
        style="max-width: 100px"
        @update:model-value="
          this.$store.commit('SET_CONDITION', { cIndex, condition })
        "
      >
      </q-select>
      <!-- Values -->
      <q-card-section
        v-for="(value, vIndex) in group.values"
        :key="vIndex"
        horizontal
        @update:model-value="
          this.$store.commit('SET_CONDITION', { cIndex, condition })
        "
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
          @update:model-value="
            this.$store.commit('SET_CONDITION', { cIndex, condition })
          "
        />
        <q-select
          v-model="value.contains"
          :options="containTypeOptions"
          label="Contains"
          outlined
          class="q-ma-md col-6"
          style="max-width: 300px"
          @update:model-value="
            this.$store.commit('SET_CONDITION', { cIndex, condition })
          "
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
          @update:model-value="
            this.$store.commit('SET_CONDITION', { cIndex, condition })
          "
        />
        <q-btn
          @click="
            this.$store.commit('DELETE_VALUE', { cIndex, gIndex, vIndex })
          "
          flat
          round
          icon="delete"
          color="negative"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ContainTypes, LogicalOperatorTypes } from '../../pages/queryModel';
import { mapState, mapActions } from 'vuex';

export default {
  props: {
    cIndex: {
      type: Number,
      required: true,
    },
  },
  computed: {
    condition() {
      return this.$store.state.conditions[this.cIndex];
    },

    ...mapState({
      conditions: (state) => state.conditions,
      tableNameOptions: (state) => state.tableNameOptions,
      columnsOptions: (state) => state.columnsOptions,
      queryResult: (state) => state.queryResult,
      errorMessage: (state) => state.errorMessage,
      defaultContainType: (state) => state.defaultContainType,
      defaultLogicalOperator: (state) => state.defaultLogicalOperator,
    }),

    logicalOperationOptions() {
      return Object.values(LogicalOperatorTypes);
    },
    containTypeOptions() {
      return Object.values(ContainTypes);
    },
  },

  methods: {
    ...mapActions(['fetchTableColumns']),
  },
};
</script>

<style scoped>
/* Add your custom CSS styles for ConditionItem here */
</style>