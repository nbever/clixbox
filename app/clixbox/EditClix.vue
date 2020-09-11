<template>
  <create-edit-clix :clix-id-to-edit="$route.params.clixId"></create-edit-clix>
</template>

<script>
  import CreateEditClix from './CreateEditClix';

  export default {
    name: 'edit-clix',
    components: {
      CreateEditClix
    }
  }
</script>