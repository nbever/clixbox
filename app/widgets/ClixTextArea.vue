<template>
  <md-field>
    <label>{{label}}</label>
    <md-textarea 
      :type="type" 
      :placeholder="placeholder" 
      :value="value"
      @keyup="keyup"
      v-bind="inputProps"
      md-autogrow
    >  
    </md-textarea>
  </md-field>
</template>

<script>
  export default {
    name: 'clix-text-area',
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