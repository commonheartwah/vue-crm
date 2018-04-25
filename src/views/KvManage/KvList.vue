<template lang="html">
  <div id="KvList">
    <!-- 按钮  过滤  工具条-->
    <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
      <el-form :inline=true :model='filters'>
        <el-form-item>
          <el-input v-model='filters.id' placeholder='配置 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model='filters.name' placeholder='配置名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='loadList'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='loadList'>查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='handleAdd'>新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

      <!-- 列表 -->
    <el-table border :data="confs" highlight-current-row v-loading="listLoading" element-loading-text="努力加载中..." style="width: 100%;">
      <el-table-column type="expand">
        <template scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="配置 ID">
              <span>{{ props.row.id }}</span>
            </el-form-item>
            <el-form-item label="配置名称">
              <span>{{ props.row.name }}</span>
            </el-form-item>
            <el-form-item label="创建时间">
              <span>{{ props.row.ct | formatTime }}</span>
            </el-form-item>
            <el-form-item label="更新时间">
              <span>{{ props.row.ut | formatTime }}</span>
            </el-form-item>
            <el-form-item label="内容类型" style="width: 100%">
              <span>{{ props.row.type | filter_formatType}}</span>
            </el-form-item>
            <el-form-item label="配置内容">
              <p>{{ props.row.content }}</p>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="ID" width="75" sortable align='center'></el-table-column>
      <el-table-column prop="name" label="配置名称" width="320" align="center"></el-table-column>
      <el-table-column prop="content" label="配置内容" show-overflow-tooltip align="center"></el-table-column>
      <el-table-column prop="type" label="内容类型" :formatter='formatType' width="120" align="center"></el-table-column>
      <el-table-column label="操作" width="75" align="center">
        <template scope="scope">
          <el-button type="success" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        </template>
    </el-table-column>
  </el-table>
    <!-- 新增界面 -->
    <el-dialog title='新增' v-model='addFormVisible' :close-on-click-modal='false'>
      <el-form :model='addForm' label-width='100px' :rules='addFormRules' ref='addForm'>
        <el-form-item label='配置名称' prop='name'>
            <el-input v-model='addForm.name'></el-input>
        </el-form-item>
        <el-form-item label='配置内容' prop='content'>
            <el-input type="textarea" v-model='addForm.content'></el-input>
        </el-form-item>
        <el-form-item label="内容类型" prop='type'>
          <el-radio-group v-model="addForm.type">
            <el-radio class="radio" :label="0">普通文本</el-radio>
            <el-radio class="radio" :label="1">整数</el-radio>
            <el-radio class="radio" :label="2">小数</el-radio>
            <el-radio class="radio" :label="3">JSON格式</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="addFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 编辑界面 -->
    <el-dialog title='编辑' v-model='editFormVisible' :close-on-click-modal='false'>
      <el-form :model='editForm' label-width='100px' :rules='editFormRules' ref='editForm'>
        <el-form-item label='配置名称' prop='name'>
          <el-input disabled v-model='editForm.name' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label='配置内容' prop='content'>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 6}" v-model='editForm.content' auto-complete='off'></el-input>
        </el-form-item>
        <el-form-item label="内容类型" prop='type'>
          <el-radio-group v-model="editForm.type" disabled>
            <el-radio class="radio" :label="0">普通文本</el-radio>
            <el-radio class="radio" :label="1">整数</el-radio>
            <el-radio class="radio" :label="2">小数</el-radio>
            <el-radio class="radio" :label="3">JSON格式</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="editFormVisible = false">取消</el-button>
        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
      </div>
    </el-dialog>
    <!-- 分页条 -->
    <el-col :span='24' class='toolbar'>
      <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size=limit :total=totalCount style='float: right'></el-pagination>
    </el-col>
  </div>
</template>

<script>
// 引入axios实例
import {
  getKvList,
  addKvConf,
  editKvConf
} from '../../api/api'

// util工具包
import util from '../../common/js/util'

export default {
  data() {
    return {
      /*
          filter
       */
      filters: {
        id: '',
        name: ''
      },
      /*
          pagination
          数据总量
          当前页码
          分页每页显示多少数据
       */
      totalCount: 1,
      page: 1,
      limit: 1,
      /*
          list
       */
      confs: [
        // {
        //     id: 1,
        //     name: '全局配置',
        //     content: '这是一条好配置',
        //     type: 0,
        // },
      ],
      listLoading: false,
      /*
          新增配置
       */
      addFormVisible: false, //新增界面是否显示
      addLoading: false, //新增界面是否显示加载
      addFormRules: { //新增界面表单规则
        name: [
          { required: true, message: '请输入配置名称', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入配置描述', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择状态' }
        ]
      },
      addForm: { //新增界面表单数据类型
        name: '',
        content: '',
        type: 0
      },
      /*
          编辑配置
      */
      editFormVisible: false, //编辑界面是否显示
      editLoading: false, //编辑界面是否显示加载
      editFormRules: {//编辑界面表单规则
        content: [
          { required: true, message: '请输入配置描述', trigger: 'blur' }
        ]
      },
      editForm: {
        // name: '',
        // content: '',
        // type: 0
      },
    }
  },
  filters: {
    // 列表 formatTime 转换具体时间
    formatTime(date) {
      if (date == 0) {
        return '未更新'
      } else {
        return util.formatDate.format(new Date(date), 'yyyy/MM/dd   hh:mm:ss');
      }
    },
    filter_formatType(type) {
      switch (type) {
        case 0: return '普通文本'; break;
        case 1: return '整数'; break;
        case 2: return '小数'; break;
        case 3: return 'JSON格式'; break;
      }
    },
  },
  methods: {
    //ToolBar
    // 点击input后面的icon 清除内容
    handleIconClick_clearId() {
      this.filters.id = '';
    },
    handleIconClick_clearName() {
      this.filters.name = '';
    },
    loadList() {
      let para = {
        page_index: this.page,
        id: this.filters.id,
        name: this.filters.name
      };
      this.listLoading = true;
      getKvList(para)
        .then((res) => {
          if (res.data.success) {
            this.totalCount = res.data.data.totalCount;
            this.limit = res.data.data.limit;
            this.confs = res.data.data.items;
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
              type: 'error',
            })
          }
          this.listLoading = false;
        })
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.loadList();
    },
    //List
    // 列表显示
    // type 数字转换状态
    formatType(row, column) {
      switch (row.type) {
        case 0: return '普通文本'; break;
        case 1: return '整数'; break;
        case 2: return '小数'; break;
        case 3: return 'JSON格式'; break;
      }
    },
    // 新增页面
    //显示新增界面
    handleAdd() {
      this.addFormVisible = true;
      this.addForm = {
        name: '',
        content: '',
        type: 0
      }
    },
    //新增提交
    addSubmit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', { type: 'warning' })
            .then(() => {
              this.addLoading = true;
              let para = Object.assign({}, this.addForm);
              addKvConf(para)
                .then((res) => {
                  if (res.data.success) {
                    this.$notify({
                      title: '成功',
                      message: '提交成功',
                      type: 'success'
                    });
                    this.$refs['addForm'].resetFields();
                    this.addFormVisible = false;
                    this.loadList();
                  } else {
                    this.$notify({
                      title: '错误',
                      message: res.data.msg,
                      type: 'error'
                    });
                  }
                  this.addLoading = false;
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
      });
    },
    // 显示编辑界面
    handleEdit(index, row) {
      this.editFormVisible = true;
      // 把对象的值插入
      this.editForm = Object.assign({}, row);
    },
    // 编辑页面提交
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗?', '提示', { type: 'warning' })
            .then(() => {
              this.editLoading = true;
              let para = Object.assign({}, this.editForm);
              // 将para中的某些属性替换
              editKvConf(para).then((res) => {
                this.editLoading = false;
                if (res.data.success) {
                  this.$notify({
                    title: '成功',
                    message: '提交成功',
                    type: 'success'
                  });
                  this.$refs['editForm'].resetFields();
                  this.editFormVisible = false;
                  this.loadList();
                } else {
                  this.$notify({
                    title: '错误',
                    message: res.data.msg,
                    type: 'error'
                  });
                }
              })
            })
            .catch(() => {
              this.$notify({
                title: '提示',
                message: '取消操作',
                type: 'info'
              });
            });
        }
      })
    },
  },
  mounted() {
    this.loadList();
  },
}
</script>

<style lang="less" scoped>

</style>
