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
          <el-form-item label="日期筛选：">
            <el-date-picker v-model="listQuery.date" align="right" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions" @change="getWebSiteList()">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="时间间隔：">
             <el-input-number v-model="listQuery.time_interval" :min="30" :max="1440" label="时间间隔" step="30"></el-input-number>
          </el-form-item>
          <el-form-item label="站点查询：">
            <el-select v-model="listQuery.website" filterable placeholder="请选择">
			    <el-option
			      v-for="item in websiteList"
			      :key="item.value"
			      :label="item.label"
			      :value="item.value">
			    </el-option>
			  </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <div class="table-container">
      <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>流量监控</span>
          </div>
          <ve-line :data="chartData" :settings="chartSettings"></ve-line>
        </el-card>
    </div>
  </div>
</template>
<script>
import { getNetraffic, getWebSiteList } from '@/api/system/homeData.js';
import { formatDate } from '@/utils/date';
import store from '@/store';
const defaultListQuery = {
  date: '2014-08-21',
  time_interval: 30,
  begin_time: '00:00:00',
  end_time: '23:59:59' ,
  website: '',
};
export default {
  name: "CoinCount",
  data() {
    this.extend = {
      series: {
        label: {
          normal: {
            show: true
          }
        }
      }
    }
    this.chartSettings = {
        area: true
      }
    return {
      listQuery: Object.assign({}, defaultListQuery),
      chartData: [],
      title: null,
      listLoading: true,
      tableHeader: [],
      filterVal: [],
      excelList: null,
      websiteList:[],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
    }
  },
  created() {
    this.getWebSiteList();
  },
  filters: {
    formatLoginTime(time) {
      let date = new Date(time * 1000);
      return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
    },
  },
  methods: {
    getList() {
      this.listLoading = true;
      getNetraffic(this.listQuery).then(response => {
        this.listLoading = false;
        this.chartData = response.data;
      });
    },
    getWebSiteList() {
    	getWebSiteList(this.listQuery).then(response => {
        this.listLoading = false;
        this.websiteList = response.data;
      });
    },
    handleSearchList() {
      this.getList();
    },
    handleResetSearch() {
      this.listQuery = Object.assign({}, defaultListQuery)
      this.getList();
    },
  }
}

</script>
<style scoped>
.input-width {
  width: 203px;
}

</style>