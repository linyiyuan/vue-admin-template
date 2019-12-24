<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button style="float:right" type="primary" @click="handleSearchList()" size="small">
          查询搜索
        </el-button>
        <el-button style="float:right;margin-right: 15px" @click="handleResetSearch()" size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.album_name" class="input-width" placeholder="相册名搜索"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="float: right;" icon="el-icon-plus" type="primary" size="mini" @click="handleAddUser">创建相册
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="photoAlbumTable" :data="list" style="width: 100%;" v-loading="listLoading" border>
        <el-table-column sortable label="相册封面" width="300" align="center">
          <template slot-scope="scope">
            <img style="width: 250px;height: 150px" :src="scope.row.album_cover">
          </template>
        </el-table-column>
        <el-table-column  label="相册名" width="200" align="center">
          <template slot-scope="scope">{{scope.row.album_name}}</template>
        </el-table-column>
        <el-table-column  label="相册描述" width="250" align="center">
          <template slot-scope="scope">{{scope.row.album_desc}}</template>
        </el-table-column>
        <el-table-column  label="相册作者" width="120" align="center">
          <template slot-scope="scope">{{scope.row.album_author}}</template>
        </el-table-column>
        <el-table-column sortable label="相册浏览人数" width="160" align="center">
          <template slot-scope="scope">{{scope.row.album_click_num}}</template>
        </el-table-column>
        <el-table-column sortable label="创建时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.created_at}}</template>
        </el-table-column>
        <el-table-column sortable label="更改时间" width="160" align="center">
          <template slot-scope="scope">{{scope.row.updated_at}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button icon="el-icon-picture-outline" type="success" size="mini" @click="handleViewPhoto(scope.row.id)">图片查看</el-button>
            <el-button icon="el-icon-edit" type="primary" size="mini" @click="handleEditUser(scope.$index, scope.row)">编辑</el-button>
            <el-button icon="el-icon-delete" type="danger" size="mini" @click="deletePhotoAlbum(scope.row.id)">删除</el-button>
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
import { getPhotoAlbum,deletePhotoAlbum } from '@/api/picture_bed/photo_album'
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
      list: null,
      total: null,
      multipleSelection: [],
    }
  },
  created() {
    this.getList();
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
      getPhotoAlbum(this.listQuery).then(response => {
        this.listLoading = false;
        this.list = response.data.list;
        this.total = response.data.total;
      });
    },
    handleAddUser() {
      this.$router.push({ path: '/picture_bed/photo_album/create' });
    },
    handleEditUser(index, row) {
      this.$router.push({ path: '/picture_bed/photo_album/update', query: { id: row.id } });
    },
    handleViewPhoto(id) {
      this.$router.push({ path: '/picture_bed/photo', query: { photo_album: id} });
    },
    deletePhotoAlbum(id) {
      this.$confirm('是否要进行该删除操作?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePhotoAlbum(id).then(response => {
          this.getList();
        });
      })
    },
  }
}

</script>
<style scoped>
.input-width {
  width: 203px;
}

</style>
