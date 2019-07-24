<template> 
  <div>
    <el-upload
      :action="action"
      :headers="headers"
      :data="dataObj"
      list-type="picture-card"
      :file-list="fileList"
      :before-upload="beforeUpload"
      :on-remove="handleRemove"
      :on-success="handleUploadSuccess"
      :on-preview="handlePreview"
      :limit="maxCount"
      :on-exceed="handleExceed"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" >
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import { getToken } from '@/utils/auth'
  export default {
    name: 'multiUpload',
    props: {
      //图片属性数组
      value: Array,
      //最大上传图片数量
      maxCount:{
        type:Number,
        default:5
      },
      savePath: {
        default: 'test',
      },
    },
    data() {
      return {
        dataObj: {
          savePath: this.savePath,
        },
        action:process.env.BASE_API + '/common/upload_pic',
        headers:{'Authorization' : 'Bearer '+ getToken()},
        dialogVisible: false,
        dialogImageUrl:null,
      };
    },
    computed: {
      fileList() {
        let fileList=[];
        for(let i=0;i<this.value.length;i++){
          fileList.push({url:this.value[i]});
        }
        return fileList;
      }
    },
    methods: {
      emitInput(fileList) {
        let value=[];
        for(let i=0;i<fileList.length;i++){
          value.push(fileList[i].url);
        }
        this.$emit('input', value)
      },
      handleRemove(file, fileList) {
        this.emitInput(fileList);
      },
      handlePreview(file) {
        this.dialogVisible = true;
        this.dialogImageUrl=file.url;
      },
      beforeUpload(file) {
      
      },
      handleUploadSuccess(res, file) {
        if (res.errorCode != 200) {
           this.$message({
              message: res.data.message,
              type: 'error',
              duration:1000
            });
        }
        let data = res.data
        this.showFileList = true;
        this.fileList.push({name: data.fileName, url: data.url});
        this.emitInput(this.fileList);

      },
      handleExceed(files, fileList) {
        this.$message({
          message: '最多只能上传'+this.maxCount+'张图片',
          type: 'warning',
          duration:1000
        });
      },
    }
  }
</script>
<style>

</style>


