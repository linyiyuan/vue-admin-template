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
            <el-input v-model="listQuery.description" class="input-width" placeholder="角色名"></el-input>
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
                 @click="handleViewRole('add', '')"
                >添加角色
      </el-button>
    </el-card>
    <div class="table-container">
      <el-table ref="roleTable"
                :data="list"
                style="width: 100%;"
                v-loading="listLoading" border>
        <el-table-column type="selection" width="60" align="center"></el-table-column>
        <el-table-column sortable label="Id" prop="Id" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column sortable label="角色名" prop="name" width="180" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column sortable label="角色描述" width="180" align="center">
          <template slot-scope="scope">{{scope.row.description}}</template>
        </el-table-column>
        <el-table-column sortable label="创建时间" prop="last_login" align="center">
          <template slot-scope="scope">{{ scope.row.created_at }}</template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button
              icon="el-icon-edit"
              type="primary"
              size="mini"
              @click="handleViewRole('edit',scope.row)"
              v-if="scope.row.name != 'super_admin'"
            >编辑</el-button>
             <el-button
              icon="el-icon-reset"
              type="info"
              size="mini"
              @click="handleViewPermission(scope.$index, scope.row)"
              v-if="scope.row.name != 'super_admin'"
            >权限设置</el-button>
            <el-button
              v-if="scope.row.name == 'super_admin'"
              icon="el-icon-reset"
              type="danger"
              size="mini"
            >该角色为系统最高权限/不可编辑</el-button>
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

    <!-- 权限设置 -->
     <el-dialog title="权限设置" :visible.sync="selectDialogVisible"  width="35%" :close-on-click-modal="false">
      	<el-tree
		  :data="dialogData.list"
		  :props="dialogData.defaultProps"
		  ref="tree"
		  :current-node-key="dialogData.checkedList"
		  node-key="name"
		  :check-strictly="checkStrictly"
		  :default-expanded-keys="dialogData.defaultCheckedList"
		  :default-checked-keys="dialogData.defaultCheckedList"
		  show-checkbox
		>
		</el-tree>
      <div slot="footer">
        <el-button  size="small" @click="selectDialogVisible = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleAddRolePermission()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加/修改角色 -->
     <el-dialog title="添加角色" :visible.sync="createRoleDialogVisible"  width="500px" :close-on-click-modal="false">
        <el-form ref="roleForm" :model="roleForm" :rules="roleRules" label-width="80px">
        <el-form-item label="角色名" prop="name">
          <el-input v-model="roleForm.name" plachod auto-complete="off" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" auto-complete="off" size="medium"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button  size="small" @click="createRoleDialogVisible = false">取 消</el-button>
        <el-button  size="small" type="primary" @click="handleAddRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getRole, deleteRole, createRole, updateRole, givePermission} from '@/api/role'
  import {getPermission} from '@/api/permission'
  import {formatDate} from '@/utils/date';
  import store from '@/store'
  const defaultListQuery = {
    cur_page: 1,
    page_size: 15,
  };
  export default {
    name: "roleList",
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        checkStrictly: false,
        list: null,
        type: null,
        total: null,
        operateType: null,
        multipleSelection: [],
        closeOrder:{
          dialogVisible:false,
          content:null,
          orderIds:[]
        },    
         dialogData:{
          list: null,
          defaultProps: {
	          children: 'children',
	          label: 'display_name'
          },
          defaultCheckedList:null,
          checkedList:null,
          role_id:null,
        },
         selectDialogVisible:false,
         createRoleDialogVisible:false,
         roleForm:{
          id:null,
          name: null,
          description: null,
         },
          roleRules: {
            name: [
              { required: true, message: '请输入角色名称', trigger: 'blur' }
            ],
            description: [
              { required: true, message: '请输入描述', trigger: 'blur' }
            ]
        }
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
      handleViewPermission(index, row) {
      	this.selectDialogVisible=true;
      	this.dialogData.defaultCheckedList = null
        this.gerPermission(row.id);
      },
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList();
      },
      handleSearchList() {
        this.listQuery.pageNum = 1;
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
        getRole(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
      handleViewRole(type, data) {
        this.createRoleDialogVisible = true
        this.type = type
        if (type == 'edit') {
            this.roleForm.id = data.id
            this.roleForm.name = data.name          
            this.roleForm.description = data.description          
        }else{
            this.roleForm.id = null
            this.roleForm.name = null          
            this.roleForm.description = null   
        }
      },
      handleAddRole() {
        this.$refs['roleForm'].validate((valid) => {
          if (valid) {
            if (this.type == 'add') {
              createRole({postData: this.roleForm}).then(response => {
                  if (response.errorCode == 200) {
                      this.$message({
                        message: response.data,
                        type: 'success',
                        duration:1000
                      });
                      this.getList();
                  }else{
                    this.$message({
                        message: response.data,
                        type: 'success',
                        duration:1000
                      });
                  }
              })
            }else{
              updateRole(this.roleForm.id,{postData: this.roleForm}).then(response => {
                  if (response.errorCode == 200) {
                      this.$message({
                        message: response.data,
                        type: 'success',
                        duration:1000
                      });
                      this.getList();
                  }else{
                    this.$message({
                        message: response.data,
                        type: 'success',
                        duration:1000
                      });
                  }
              })
            }
            
           }else {
            this.$message({
              message: '表单验证不通过',
              type: 'success',
              duration:1000
            });
            return false;
          }
        });
        this.createRoleDialogVisible = false
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
      gerPermission(role_id){
      	getPermission({type: 'tree'}).then(response => {
      		var list = response.data.list
		 	this.dialogData.list = list
      	})

      	getPermission({role_id: role_id}).then(response => {
          this.checkStrictly = true
      		var list = response.data.list
          this.$nextTick(() => {
              this.dialogData.defaultCheckedList = list
              this.checkStrictly = false
          })
      		
      	})
      	this.dialogData.role_id = role_id
      },
      handleAddRolePermission() {
      	var checkedKeys = this.$refs.tree.getCheckedKeys()
      	var halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()

      	var checkedPermission = checkedKeys.concat(halfCheckedKeys)

      	var postData = {roleId: this.dialogData.role_id, permissionsAllow: checkedPermission}
      	givePermission({postData: postData}).then(response => {
      		if (response.errorCode == 200) {
	  			this.$message({
	                message: response.data,
	                type: 'success',
	                duration:1000
	              });
      		}else{
      			this.$message({
	                message: response.data,
	                type: 'success',
	                duration:1000
	              });
      		}
      		this.selectDialogVisible = false
      	})
      },
      // handleCheckClick(data) {
      //   var children = data.children
      //   if (children != undefined) {
      //      var checkedList = []
      //     for (var i = 0; i < children.length; i++) {
      //         checkedList.push(children[i]['name']) 
      //     }

          
      //   }
       
      // }
    }
  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


