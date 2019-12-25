<template>
  <el-card class="form-container" shadow="never"> 
    <el-form :model="photo" :rules="rules" ref="photo_form" label-width="150px">
      <el-form-item label="相册选择：">
        <el-select v-model="photo.photo_album">
          <el-option v-for="item in photoAlbumList" :key="item.value" :label="item.label" :value="item.value
          "></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片上传：">
        <multi-upload v-model="photo.photo_url" :savePath="savePath"></multi-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('photo_form')">提交</el-button>
        <el-button @click="resetForm('photo_form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
import { createPhoto } from '@/api/picture_bed/photo'
import { getPhotoAlbum } from '@/api/picture_bed/photo_album'
import { validatPhone } from '@/utils/validate'
import SingleUpload from '@/components/Upload/singleUpload'
import MultiUpload from '@/components/Upload/multiUpload'
const defaultPhoto = {
  photo_album: null,
  photo_url: [],
};
export default {
  name: 'uploadPhoto',
  components: { SingleUpload, MultiUpload },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    photo_data: ''
  },
  data() {
    return {
      photo: Object.assign({}, defaultPhoto),
      savePath: '0',
      roles: '',
      photoAlbumList: [],
      photoAlbumKeyValue: [],
      rules: {
        photo_name: [
          { required: true, message: '请填写相册名', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.photo.photo_album = 
    this.savePath = parseInt(this.$route.query.photo_album) ? parseInt(this.$route.query.photo_album): null
    this.savePath = 'photo_album_' + this.savePath
    this.getPhotoAlbumList();     
  },
  methods: {
    onSubmit(photo_Form) {
      this.$refs[photo_Form].validate((valid) => {
        if (valid) {
          this.$confirm('是否提交数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {

            createPhoto({ postData: this.photo }).then(response => {
              this.$refs[photo_Form].resetFields();
              this.photo = Object.assign({}, defaultPhoto);
              this.$router.back();
            });

          });

        } else {
          this.$message({
            message: '验证失败',
            type: 'error',
            duration: 1000
          });
          return false;
        }
      });
    },
    getPhotoAlbumList() {
      getPhotoAlbum({ 'type': 'getPhotoAlbumList' }).then(response => {
        this.listLoading = false;
        this.photoAlbumList = response.data.list;
      });
    },
    resetForm(photo_Form) {
      this.$refs[photo_Form].resetFields();
      this.brand = Object.assign({}, defaultPhoto);
    }
  }
}

</script>
<style>
</style>
