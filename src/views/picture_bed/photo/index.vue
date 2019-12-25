<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small">
          <el-form-item label="相册分类：">
            <el-select v-model="listQuery.photo_album" @change="photoAlbumChange">
              <el-option v-for="item in photoAlbumList" :key="item.value" :label="item.label" :value="item.value
          "></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="float: right;" icon="el-icon-plus" type="primary" size="mini" @click="handleAddPhoto">上传图片
      </el-button>
      <el-button style="float: right; margin-right: 20px" icon="el-icon-delete" type="danger" size="mini" @click="deleteSelectdPhoto">删除选中图片
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="photoAlbumTable" :data="list" style="width: 100%;" v-loading="listLoading"  @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column sortable label="图片缩略图" width="300" align="center">
          <template slot-scope="scope">
            <img style="width: 250px;height: 150px" :src="scope.row.photo_url">
          </template>
        </el-table-column>
        <el-table-column label="图片路径" width="600" align="center">
          <template slot-scope="scope">{{scope.row.photo_url}}</template>
        </el-table-column>
        <el-table-column label="图片所属相册" width="250" align="center">
          <template slot-scope="scope">{{scope.row.album_name}}</template>
        </el-table-column>
        <el-table-column sortable label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.created_at}}</template>
        </el-table-column>
        <el-table-column sortable label="更改时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.updated_at}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-delete" type="danger" size="mini" @click="deletePhoto(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" layout="total, sizes,prev, pager, next,jumper" :current-page.sync="listQuery.cur_page" :page-size="listQuery.page_size" :page-sizes="[5,10,15]" :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { getPhoto, deletePhoto } from '@/api/picture_bed/photo'
import { getPhotoAlbum } from '@/api/picture_bed/photo_album'
import { formatDate } from '@/utils/date';
import store from '@/store'
const defaultListQuery = {
  cur_page: 1,
  page_size: 15,
};
export default {
  name: "photoAlbumList",
  components: {},
  data() {
    return {
      listQuery: Object.assign({}, defaultListQuery),
      listLoading: true,
      photoAlbumList: null,
      list: null,
      total: null,
      multipleSelection: [],
    }
  },
  created() {
    if (this.$route.query.photo_album) {
      this.listQuery.photo_album = parseInt(this.$route.query.photo_album)
    }
    this.getList();
    this.getPhotoAlbumList();
  },
  filters: {
    formatLoginTime(time) {
      let date = new Date(time * 1000);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  methods: {
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery);
    },
    handleSearchList() {
      this.listQuery.cur_page = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.cur_page = 1;
      this.listQuery.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.cur_page = val;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      getPhoto(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleAddPhoto() {
      this.$router.push({ path: '/picture_bed/photo/create', query: { photo_album: this.listQuery.photo_album } });
    },
    getPhotoAlbumList() {
      getPhotoAlbum({ 'type': 'getPhotoAlbumList' }).then(response => {
        this.listLoading = false;
        this.photoAlbumList = response.data.list;
      });
    },
    photoAlbumChange(photo_album) {
      this.listQuery.photo_album = photo_album
      this.getList();
    },
    deletePhoto(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePhoto(id).then(response => {
          this.getList();
        });
      })
    },
     handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    deleteSelectdPhoto() {
      var ids = [];
      ids = this.multipleSelection.map(function(item){
          return item.id
      })      
      this.$confirm('是否要批量删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePhoto(0, {'ids': ids}).then(response => {
          this.getList();
        });
      })
    }
  }
}

</script>
<style scoped>
.input-width {
  width: 203px;
}

</style>
