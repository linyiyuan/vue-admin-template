<template> 
  <upload-photo :is-edit='false'></upload-photo>
</template>
<script>
  import uploadPhoto  from './components/uploadPhoto'
  export default {
    name: 'addPhoto',
    components: { uploadPhoto }
  }
</script>
<style>
</style>
