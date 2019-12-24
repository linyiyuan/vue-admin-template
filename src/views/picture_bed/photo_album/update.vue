<template> 
  <photo-album-detail :is-edit='true'></photo-album-detail>
</template>
<script>
  import photoAlbumDetail  from './components/photoAlbumDetail'
  export default {
    name: 'updatePhotoAlbum',
    components: { photoAlbumDetail }
  }
</script>
<style>
</style>
