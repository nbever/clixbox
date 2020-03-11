<template>
  <md-field>
    <label>{{label}}</label>
    <md-input 
      :type="type" 
      :placeholder="placeholder" 
      :value="value"
      @keyup="keyup"
      v-bind="inputProps"
    >  
    </md-input>
  </md-field>
</template>

<script>
  export default {
    name: 'clix-text-field',
    props: {
      value: {
        type: [String, Number],
        default: ''
      },
      placeholder: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'text'
      },
      label: String,
      keyup: Function,
      inputProps: Object
    }
  }
</script>