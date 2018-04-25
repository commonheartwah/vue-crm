<template lang='html'>

    <section v-loading='listLoading' element-loading-text="努力加载中...">
        <!-- 按钮  过滤  工具条-->
        <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
            <el-form :inline=true :model='filters'>

                <el-form-item>
                    <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.username' placeholder='用户名' icon="circle-cross" :on-icon-click="handleIconClick_clearUsername" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-input v-model='filters.mobile' placeholder='手机号码' icon="circle-cross" :on-icon-click="handleIconClick_clearMobile" @keydown.native.prevent.enter='loadList'></el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type='primary' @click='loadList'>查询</el-button>
                </el-form-item>

            </el-form>
        </el-col>

        <!-- 列表 -->
        <el-table :data='users' highlight-current-row style='width: 100%;' border>

            <el-table-column prop='id' label='ID' width='105' sortable align='center' fixed="left"></el-table-column>

            <el-table-column prop='name' label='用户名' width='155' align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop='gender' label='性别' width='75' align='center' :formatter='formatGender'></el-table-column>

            <el-table-column prop='mobile' label='电话' width='140' align='center' show-overflow-tooltip></el-table-column>

            <el-table-column prop='areaFullName' label='所属地区' width='150' align='center' :formatter='formatArea' show-overflow-tooltip></el-table-column>

            <el-table-column prop='internal' label='是否为内部用户类型' width='120' align='center' :formatter='formatInternal' show-overflow-tooltip></el-table-column>

              <el-table-column prop='internal' label='用户类型' width='120' align='center' :formatter='formatType' show-overflow-tooltip></el-table-column>

            <el-table-column prop='birthday' label='生日' width='90' align='center' :formatter='formatBirthday'></el-table-column>

            <el-table-column prop='stat' label='状态' width='70' align='center' :formatter='formatStat'></el-table-column>

            <el-table-column prop='ct' label='创建时间' width='168' align='center' :formatter='formatCreateTime'></el-table-column>

            <el-table-column label='操作' align='center' width="220" fixed="right">
                <template scope='scope'>
                    <el-button-group>
                        <el-button size='small' type='success' @click='handleEdit(scope.$index, scope.row)'>编辑</el-button>
                        <el-button size='small' type='info' @click='enterInAppCoursePage(scope.$index, scope.row)'>用户课程</el-button>
                        <el-button size='small' type='danger' @click='deleDev(scope.$index, scope.row)'>清除设备</el-button>
                    </el-button-group>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页条 -->
        <el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
        </el-col>

        <!-- 编辑界面 -->
        <el-dialog title='编辑' v-model='editFormVisible' :close-on-click-modal='false'>

            <el-form :model='editForm' label-width='120px' ref='editForm'>
                <el-form-item label="状态" required>

                    <el-radio-group v-model="editForm.stat">
                        <el-radio class="radio" :label="0">有效</el-radio>
                        <el-radio class="radio" :label="1">禁言</el-radio>
                        <el-radio class="radio" :label="2">冻结</el-radio>
                    </el-radio-group>

                </el-form-item>

                <el-form-item label="用户类型" required>

                    <el-radio-group v-model="editForm.type">
                        <el-radio class="radio" :label="0">普通用户</el-radio>
                        <el-radio class="radio" :label="1">推广人</el-radio>
                        <el-radio class="radio" :label="2">推广人组长</el-radio>
                        <el-radio class="radio" :label="3">班长</el-radio>
                        <el-radio class="radio" :label="4">学习委员</el-radio>
                    </el-radio-group>

                </el-form-item>

                <el-form-item label="是否内部用户" required>

                    <el-radio-group v-model="editForm.internal">
                        <el-radio class="radio" :label="0">非内部</el-radio>
                        <el-radio class="radio" :label="1">内部</el-radio>
                    </el-radio-group>

                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
            </div>

        </el-dialog>

    </section>

</template>

<script>
// 引入封装好的axios实例
import {
  getAppuserList,
  editAppuser,
  requestCurrentRoles,
  updateRoles,
  deleAllDev
} from '../../api/api';
// 引入工具包
import util from '../../common/js/util'

export default {

  data() {
    return {
      listLoading: false, // 加载默认false
      // 过滤器
      filters: {
        username: '',
        id: '',
        mobile: ''
      },
      // users 数据
      users: [
        // 假数据
        // {
        //     'id': 1,
        //     'name': '10086',
        //     'phone': '18435137159',
        //     'areaFullName': '北京天安门',
        //     'birthday': 20170430,
        //     'stat': 0,
        //     'type': 0
        // },
      ],
      // 数据总量
      totalCount: 1,
      // 当前页码
      page: 1,
      // 分页每页显示多少数据
      limit: 1,

      // 编辑界面
      editFormVisible: false, //编辑界面是否显示

      editLoading: false, //编辑界面是否显示加载

      editForm: {
        // stat: 1
      },
    }
  },
  methods: {
    // 显示列表(stat 数字转换状态)
    formatStat(row, column) {
      switch (row.stat) {
        case -1:
          return '不限';
          break;
        case 0:
          return '有效';
          break;
        case 1:
          return '禁言';
          break;
        case 2:
          return '冻结';
          break;
      }
    },
    // 显示列表(gender 性别转换男女)
    formatGender(row, column) {
      return row.gender == 1 ? '男' : row.gender == 2 ? '女' : '未知';
    },
    // 显示列表(如果有数据就显示 没有就显示未登记)
    formatBirthday(row, column) {
      return row.birthday ? row.birthday : '未登记';
    },
    formatArea(row, column) {
      return row.areaFullName ? row.areaFullName : '未登记';
    },
    // 显示列表(createTime 转换)
    formatCreateTime(row, column) {
      return util.formatDate.format(new Date(row.ct), 'yyyy/MM/dd   hh:mm:ss');
    },
    // 显示列表(type)
    formatInternal(row, column) {
      return row.internal == 0 ? '非内部' : row.internal == 1 ? '内部' : '未知';
    },
    formatType(row, column) {
      switch (row.type) {
        case 0:
          return '普通用户';
          break;
        case 1:
          return '推广人';
          break;
        case 2:
          return '推广人组长';
          break;
        case 3:
          return '班长';
          break;
        case 4:
          return '学习委员';
          break;
      }
    },
    // 点击input后面的icon 清除内容
    handleIconClick_clearId() {
      this.filters.id = '';
    },
    handleIconClick_clearUsername() {
      this.filters.username = '';
    },
    handleIconClick_clearMobile() {
      this.filters.mobile = '';
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.loadList();
    },
    // 改(编辑界面)
    handleEdit(index, row) {
      this.editFormVisible = true;
      // 把对象的值插入
      this.editForm = Object.assign({}, row);
      console.log(this.editForm);
    },
    // 编辑页面提交
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗?', '提示', {})
            .then(() => {
              this.editLoading = true;
              let para = {
                id: this.editForm.id,
                status: this.editForm.stat,
                type: this.editForm.type,
                internal: this.editForm.internal
              }
              editAppuser(para).then((res) => {
                if (res.data.success) {
                  this.$notify({
                    title: '成功',
                    message: '编辑成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.loadList();
                } else {
                  this.$notify({
                    title: '失败',
                    message: res.data.msg,
                    type: 'error'
                  })
                }
                this.editLoading = false;
              })
            })
            .catch(() => {
              this.$notify({
                title: '提示',
                message: '取消操作',
                type: 'info'
              })
            })
        }
      })
    },
    // 角色管理详情页面
    enterInAppCoursePage(index, row) {
      this.$router.push({
        path: '/appCourseList',
        query: {
          user_id: row.id,
          user_name: row.name
        }
      })
    },
    // 清除用户下所有的设备
    deleDev(index, row) {
      let params = {
        id: row.id
      };

      this.$confirm('确认清除设备吗', '提示', {
          type: 'warning'
        })
        .then(() => {
          deleAllDev(params).then((res) => {
            if (res.data.success) {
              this.$notify({
                title: '成功',
                message: '成功清除设备信息',
                type: 'success'
              })
            } else {
              this.$notify({
                title: '错误',
                message: res.data.msg,
                type: 'error'
              })
            }
          })
        })
        .catch(() => {
          this.$notify({
            title: '提示',
            message: '取消操作',
            type: 'info'
          })
        })
    },

    //加载后台用户列表
    loadList() {
      let para = {
        page_index: this.page,
        id: this.filters.id,
        username: this.filters.username,
        mobile: this.filters.mobile
      };
      this.listLoading = true;
      getAppuserList(para)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.totalCount = res.data.data.totalCount;
            this.limit = res.data.data.limit;
            this.users = res.data.data.items;
          } else {
            this.$notify({
              title: '错误',
              message: res.data.msg,
              type: 'error'
            })
          }
          this.listLoading = false;
        })
        .catch((error) => {
          if (error.response) {
            this.$notify({
              title: error.response.status,
              message: '网络请求错误',
              type: 'error'
            })
          } else if (error.request) {
            this.$notify({
              title: error.request,
              message: '网络请求错误',
              type: 'error'
            })
          } else {
            this.$notify({
              title: '错误',
              message: error.message,
              type: 'error'
            })
          }
          this.listLoading = false;
        })
    }
  },
  mounted() {
    this.loadList();
  }
}
</script>
