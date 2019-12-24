<template> 
  <photo-album-detail :is-edit='false'></photo-album-detail>
</template>
<script>
  import photoAlbumDetail  from './components/photoAlbumDetail'
  export default {
    name: 'addPhotoAlbum',
    components: { photoAlbumDetail }
  }
</script>
<style>
</style>
