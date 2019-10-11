<template> 
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <el-button
          style="float:right;"
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
          <el-form-item label="时间筛选：">
            <el-date-picker
              v-model="listQuery.time"
              type="daterange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
           <el-form-item label="精确查找">
            <el-input v-model="listQuery.uid" class="input-width" placeholder="请输入用户uid"></el-input>
          </el-form-item>
          </el-form-item>
           <el-form-item label="操作查找">
            <el-input v-model="listQuery.action" class="input-width" placeholder="输入操作"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table ref="orderTable"
                :data="list"
                style="width: 100%;"
                @selection-change="handleSelectionChange"
                v-loading="listLoading" border>
        <el-table-column label="用户Id"  width="90"  sortable prop="ID">
          <template slot-scope="scope">{{scope.row.uid}}</template>
        </el-table-column>
        <el-table-column label="用户名" width="180" >
          <template slot-scope="scope">{{scope.row.username}}</template>
        </el-table-column>
        <el-table-column label="操作昵称" width="180" >
          <template slot-scope="scope">{{scope.row.operator}}</template>
        </el-table-column>
        <el-table-column label="操作" width="150" >
          <template slot-scope="scope">{{scope.row.action}}</template>
        </el-table-column>
        <el-table-column label="结果" width="150" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.dealResult}}</template>
        </el-table-column>
        <el-table-column label="请求参数" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.data}}</template>
        </el-table-column>
        <el-table-column label="操作时间"  width="180" >
          <template slot-scope="scope">{{scope.row.created_at | formatCreateTime }}</template>
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
        :page-sizes="[5,10,15,30,50,100]"
        :total="total">
      </el-pagination>
    </div>
  </div>
  </div>
</template>
<script>
  import {getOperateLog} from '@/api/system/operateLog'
  import {formatDate} from '@/utils/date';
  const defaultListQuery = {
    cur_page:1,
    page_size:15,
    time: null,
    uid: null,
    action: null,
  };
  export default {
    name: "rechargeDailySum",
    components:{},
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        listLoading: true,
        list: null,
        total: null,
        multipleSelection: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
      }
    },
    created() {
      this.getList();
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
    },
    methods: {
      handleResetSearch() {
        this.listQuery = Object.assign({}, defaultListQuery);
        this.getList();
      },
      handleSearchList() {
        this.listQuery.cur_page = 1;
        this.getList();
      },
      handleSelectionChange(val){
        this.multipleSelection = val;
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
        getOperateLog(this.listQuery).then(response => {
          this.listLoading = false;
          this.list = response.data.list;
          this.total = response.data.total;
        });
      },
    }

  }
</script>
<style scoped>
  .input-width {
    width: 203px;
  }
</style>


