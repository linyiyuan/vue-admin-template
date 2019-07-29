<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right"
          type="primary"
          @click="handleSearchList()"
          size="small">
          查询搜索
        </el-button>
        <el-button
          style="float:right;margin-right: 15px"
          @click="handleResetSearch()"
          size="small">
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small">
          <el-form-item label="输入搜索：">
            <el-input v-model="listQuery.username" class="input-width" placeholder="用户账号"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="float: right;" 
                 icon="el-icon-plus"
                 type="primary"
                 size="mini"
                 @click="handleAddUser"
                >创建用户
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="userTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column sortable label="用户名称" width="120" align="center">
          <template slot-scope="scope">
            <img  style="width: 65px;height: 65px" :src="scope.row.avatar">
          </template>
          </el-table-column>
        <el-table-column sortable label="用户账号" prop="username" width="200" align="center">
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column sortable label="用户名称" width="150" align="center">
          <template slot-scope="scope">{{scope.row.desc}}</template>
        </el-table-column>
        <el-table-column sortable label="角色" width="200" align="center">
          <template slot-scope="scope">
            <el-tag size="mini" v-for="(role, index) in scope.row.roles" :key="index">{{ role.description }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column sortable label="手机号码" width="160" align="center">
          <template slot-scope="scope">{{scope.row.mobile}}</template>
        </el-table-column>
        <el-table-column sortable label="上次登录IP" width="160" align="center">
          <template slot-scope="scope">{{scope.row.last_ip}}</template>
        </el-table-column>
        <el-table-column sortable label="上次登录时间" width="250" align="center">
          <template slot-scope="scope">{{scope.row.last_login | formatLoginTime}}</template>
        </el-table-column>
        <el-table-column sortable label="创建时间" width="230" prop="last_login" align="center">
          <template slot-scope="scope">{{ scope.row.create_time | formatLoginTime}}</template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleEditUser(scope.$index, scope.row)"
            >编辑</el-button>
             <el-button
              icon="el-icon-reset"
              type="info"
              size="mini"
              @click="handleViewResetPassword(scope.row)"
            >重置密码</el-button>
             <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleDeleteUser(scope.$index, scope.row)"
              v-show="scope.row.id != userId"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :current-page.sync="listQuery.cur_page"
        :page-size="listQuery.page_size"
        :page-sizes="[5,10,15]"
        :total="total">
      </el-pagination>
    </div>
    <!-- 重置密码 -->
     <el-dialog title="重置密码" :visible.sync="resetPasswordDialogVisible"  width="500px" :close-on-click-modal="false">
        <el-form ref="roleForm" :model="resetPasswordForm" label-width="80px">
        <el-form-item label="原密码">
          <el-input type="password" v-model="resetPasswordForm.old_password" plachod auto-complete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="新密码" >
          <el-input type="password" v-model="resetPasswordForm.new_password" auto-complete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" >
          <el-input type="password" v-model="resetPasswordForm.confirm_password" auto-complete="off" size="medium"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button  size="small" @click="resetPasswordDialogVisible = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleResetPassword()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {userList, deleteUser, resetPassword} from '@/api/user'
  import {formatDate} from '@/utils/date';
  import store from '@/store'
  const defaultListQuery = {
    cur_page: 1,
    page_size: 15,
  };
  const defaultResetPasswordForm = {
    uid:null,
    old_password:null,
    new_password:null,
    confirm_password:null,
  }
  export default {
    name: "userList",
    components:{},
    data() {
      
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        operateType: null,
        resetPasswordDialogVisible:false,
        multipleSelection: [],
        closeOrder:{
          dialogVisible:false,
          content:null,
          orderIds:[]
        },
        resetPasswordForm:Object.assign({}, defaultResetPasswordForm),
    
        userId:store.getters.userId
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
      handleViewResetPassword(data) {
          this.resetPasswordForm.uid = data.id
          this.resetPasswordDialogVisible = true;
      },
      handleResetPassword() {
          resetPassword({postData: this.resetPasswordForm}).then(response=>{
            this.$message({
              message: '重置密码成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
            this.resetPasswordForm = Object.assign({}, defaultResetPasswordForm)
            this.resetPasswordDialogVisible = false;
          });
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
      },
      handleSearchList() {
        this.listQuery.cur_page = 1;
        this.getList();
      },
      handleDeleteUser(index, row){
        this.deleteUser(row.id);
      },
      handleSizeChange(val){
        this.listQuery.cur_page = 1;
        this.listQuery.page_size = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.cur_page = val;
        this.getList();
      },
      getList() {
        this.listLoading = true;
        userList(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleAddUser() {
        this.$router.push({path:'/auth/user/create'});
      },
      handleEditUser(index,row) {
        this.$router.push({path:'/auth/user/update', query: {id: row.id}});
      },
      deleteUser(id){
        this.$confirm('是否要进行该删除操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUser(id).then(response=>{
            this.$message({
              message: '删除成功！',
              type: 'success',
              duration: 1000
            });
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


