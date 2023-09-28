<template>
      <q-card-section>
        <q-select
          v-if="vIndex > 0"
          v-model="value.contains"
          :options="containsOptions"
          label="Contains"
          outlined
        />
        <q-select
          v-model="condition.selectedOperator"
          :options="operators"
          label="Table"
          outlined
        />
        <q-input v-model="condition.value" label="Value" outlined />
      </q-card-section>

</template>

<script>
import {Contain, LogicalOperator} from '../models'
export default {
  
  data() {
    return {
        value: {contains: Contain.ALL, input: [''], logicalOperator: LogicalOperator.OR }
    };
  },
};
</script>

<style scoped>
.select-field {
  min-width: 150px;
  width: auto;
}
</style>
