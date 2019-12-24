<template> 
  <el-card class="form-container" shadow="never">
    <el-form :model="photo_album" :rules="rules" ref="photo_album_form" label-width="150px">
      <el-form-item label="相册名：" prop="album_name">
        <el-input v-model="photo_album.album_name"></el-input>
      </el-form-item>
      <el-form-item label="相册描述：">
        <el-input v-model="photo_album.album_desc"></el-input>
      </el-form-item>
      <el-form-item label="相册作者：">
        <el-input v-model="photo_album.album_author"></el-input>
      </el-form-item>
      <el-form-item label="相册类型：">
        <el-select v-model="photo_album.album_type">
          <el-option :value=1 label="普通相册"></el-option>
          <el-option :value=2 label="密码相册"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="相册封面：">
        <single-upload v-model="photo_album.album_cover" savePath="photo_album"></single-upload>
      </el-form-item>
      <el-form-item label="状态：">
        <el-radio-group v-model="photo_album.album_status">
          <el-radio :label="1">启动</el-radio>
          <el-radio :label="0">停用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('photo_album_form')">提交</el-button>
        <el-button v-if="!isEdit" @click="resetForm('photo_album_form')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  import {createPhotoAlbum, updatePhotoAlbum, getOnePhotoAlbum} from '@/api/picture_bed/photo_album'
  import {validatPhone} from '@/utils/validate';
  import SingleUpload from '@/components/Upload/singleUpload'
  const defaultPhotoAlbum={
    album_name: null,
    album_desc: null,
    album_type: 1,
    album_status: 1,
    album_cover: null,
    album_author: null,
  };
  export default {
    name: 'PhotoAlbumDetail',
    components:{SingleUpload},
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      photo_album_data: ''
    },
    data() {
      return {
        photo_album:Object.assign({}, defaultPhotoAlbum),
        roles: '',
        rules: {
          photo_name: [
            {required: true, message: '请填写相册名', trigger: 'blur'},
          ],
        }
      }
    },
    created() {
       //判断是否为修改
       if (this.isEdit == true) {
          getOnePhotoAlbum(this.$route.query.id).then(response => {
              let photo_album_data= response.data
              this.photo_album = Object.assign({},photo_album_data);
          });
       }
    },
    methods: {
      onSubmit(photo_album_Form) {
        this.$refs[photo_album_Form].validate((valid) => {
          if (valid) {
            this.$confirm('是否提交数据', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.isEdit) {
                updatePhotoAlbum(this.photo_album.id, {postData: this.photo_album}).then(response => {
                  this.$refs[photo_album_Form].resetFields();
                  this.$router.back();
                });
              } else {
                  createPhotoAlbum({postData: this.photo_album}).then(response => {
                  this.$refs[photo_album_Form].resetFields();
                  this.photo_album = Object.assign({},defaultPhotoAlbum);
                  this.$router.back();
                });
              }
            });

          } else {
            this.$message({
              message: '验证失败',
              type: 'error',
              duration:1000
            });
            return false;
          }
        });
      },
      resetForm(photo_album_Form) {
        this.$refs[photo_album_Form].resetFields();
        this.brand = Object.assign({},defaultPhotoAlbum);
      }
    }
  }
</script>
<style>
</style>


