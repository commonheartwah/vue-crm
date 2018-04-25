<template lang="html">
  <section>
    <!-- 头部搜索 -->
    <el-col class='toolbar' style='padding-bottom: 0px;'>
        <el-form :inline = "true" v-model='filter'>
            <el-form-item>
                <el-input  placeholder='用户成绩ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" v-model="filter.id"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  placeholder='用户ID' icon="circle-cross" v-model="filter.user_id" :on-icon-click="handleIconClick_clearUserID"></el-input>
            </el-form-item>
            <el-form-item>
                <el-input  placeholder='试卷ID' icon="circle-cross" v-model="filter.examination_id" :on-icon-click="handleIconClick_clearExaminationId"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type='primary' @click="queryUserResults">查询</el-button>
            </el-form-item>
        </el-form>
    </el-col>
    <!-- 数据列表展示 -->
    <el-table :data="userResultsList" border style="width: 100%" v-loading='loadUserResultsStatus'>
        <el-table-column prop="entity.id" label="用户成绩ID" sortable width="150" align="center"></el-table-column>
        <el-table-column prop="entity.userId" label="用户ID" align="center"></el-table-column>
        <el-table-column prop="entity.userName" label="用户名称" align="center"></el-table-column>
        <el-table-column prop="entity.userMobile" label="用户手机号" align="center"></el-table-column>
        <el-table-column prop="entity.examId" label="试卷ID" align="center"></el-table-column>
        <el-table-column prop="entity.examName" label="试卷名称" align="center"></el-table-column>
        <el-table-column prop="entity.enExamName" label="试卷英文名称" align="center"></el-table-column>
        <el-table-column prop="entity.examLevel" label="试卷等级" align="center"></el-table-column>
        <el-table-column prop="conf.results" label="用户成绩" align="center"></el-table-column>
    </el-table>
    <!-- 列表分页 -->
    <el-col class='toolbar'>
      <el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="userResultsPage" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
      </el-pagination>
    </el-col>
  </section>
</template>

<script>
import { getUserResultsList } from '../../api/api'
export default {
  data() {
    return {
      //筛选数据初始化
      filter:{
        id: '',
        user_id: '',
        examination_id: ''
      },
      //用户成绩展示列表数据初始化
      userResultsList: [],
      userResults:{},
      //loading状态显示
      loadUserResultsStatus: false,
      //分页初始化数据
      userResultsPage: 1,
      totalCount: 0
    }
  },
  methods: {
    /*
        清空搜索框数据
    */
      handleIconClick_clearId() {
          this.filter.id = '';
      },
      handleIconClick_clearUserID() {
          this.filter.user_id = '';
      },
      handleIconClick_clearExaminationId() {
          this.filter.examination_id = '';
      },
      /*
          查询操作
      */
      queryUserResults() {
          this.loadUserResultsList(1)
      },
      /*
          用户成绩列表数据请求
      */
      loadUserResultsList() {
        let para = Object.assign({}, this.filter)
        this.loadUserResultsStatus = true;
        getUserResultsList(para).then(res => {
            if (res.data.success) {
                this.totalCount = res.data.data.totalCount;
                if(res.data.data.items && res.data.data.items.length) {
                  this.userResultsList = res.data.data.items
                  res.data.data.items.map(item => {
                    switch(item.entity.examLevel){
                        case 1:item.entity.examLevel= '初级';break;
                        case 2:item.entity.examLevel= '中级';break;
                        case 3:item.entity.examLevel= '高级';break;
                      }
                  })
                }
            }else{
              this.$message.error(res.data.msg || '未知错误，请联系管理员');
            }
            this.loadUserResultsStatus = false;
        })
        .catch(err => {
          if (error.response) {
              this.$notify({
                  title: error.response.status,
                  message: '网络请求错误',
                  type: 'error'
              })
          }else if(error.request){
              this.$notify({
                  title: error.request,
                  message: '网络请求错误',
                  type: 'error'
              })
          }else{
              this.$notify({
                  title: '错误',
                  message: error.message,
                  type: 'error'
              })
          };
          this.loadUserResultsStatus = false;
        })
      },
      /*
          分页操作
      */
      handleCurrentChange(page) {
        this.loadUserResultsList(page);
        this.userResultsPage = page;
      }
  },
  mounted() {
    this.loadUserResultsList()
  }
}
</script>

<style lang="less">
</style>
