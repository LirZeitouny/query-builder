<template>
  <q-card-section>
    <q-select
      v-if="vIndex > 0"
      v-model="value.contains"
      :options="containsOptions"
      label="Contains"
      outlined
    />

    <q-input v-model="value.input" label="Value" outlined />
  </q-card-section>
</template>


<script>
import { Contain, LogicalOperatorTypes } from '../models';

export default {
  props: {
    valueProp: {
      type: Object,
      required: true,
    },
    vIndex: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      value: {
        contains: this.valueProp.contains,
        input: this.valueProp.input,
        logicalOperator: this.valueProp.logicalOperator,
      },
    };
  },

  methods: {},
};
</script>

<style scoped>
.select-field {
  min-width: 150px;
  width: auto;
}
</style>
