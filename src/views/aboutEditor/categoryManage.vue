<template lang="html">
	<section>
		<el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
		  <el-form :inline='true' :model='filters'>
			  <el-form-item >
				  <el-input v-model='filters.id' placeholder='请输入 ID' @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickId"></el-input>
			  </el-form-item>
			  <el-form-item   >
				  <el-input v-model='filters.name' placeholder='请输入名称'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickName"></el-input>
			  </el-form-item>
			  <el-form-item   >
				  <el-input v-model='filters.parent_id' placeholder='请输入父栏目 ID'  @keydown.enter.native.prevent @change="handleSeek" icon="circle-cross" :on-icon-click="handleIconClickParentId"></el-input>
			  </el-form-item>
			  <el-form-item>
				  <el-button type='primary' @click='handleSeek'>查询</el-button>
			  </el-form-item>
			  <el-form-item>
				  <el-button type='primary' @click="addCategory">新增</el-button>
			  </el-form-item>
		  </el-form>
		</el-col>

		<el-table :data='formData' v-loading='listLoading' style='width: 100%;' border stripe tooltip-effect='light'>
			<el-table-column type="expand" fixed>
				<template scope="scope" >
					<figure class="formExpand">
                        <img :src="scope.row.imageUrl ? scope.row.imageUrl : '../../static/images/defaultPicInElementVideo.jpg'" class="CourseImage">
                        <figcaption>
                            <p><span>栏目名称：</span>{{ scope.row.name }}</p>
                            <p><span>栏目类型：</span>{{ scope.row.type | formatType }}</p>
                            <p><span>栏目状态：</span>{{ scope.row.stat | formatStat}}</p>
                            <p><span>创建时间：</span>{{ scope.row.ct | formatTime }}</p>
                            <p><span>更新时间：</span>{{ scope.row.ut | formatTime }}</p>
                            <p><span>栏目描述：</span>{{ scope.row.description || '当前栏目未添加描述'}}</p>
                        </figcaption>
                    </figure>
                </template>
			</el-table-column>
			<el-table-column prop='id' label='ID' width='75' sortable align='center' fixed></el-table-column>
			<el-table-column prop='name' label='名称' show-overflow-tooltip align='center' width='380'></el-table-column>
			<el-table-column prop='title' label='标题' show-overflow-tooltip align='center' width='380'></el-table-column>
			<el-table-column prop='parentId' label='父栏目 ID' width='100' align='center' :formatter='formatParentId'></el-table-column>
			<el-table-column prop='type' label='类型' width='100' align='center' :formatter='formatType'></el-table-column>
			<el-table-column prop='stat' label='状态' width='80' align='center' :formatter='formatStat'></el-table-column>
			<el-table-column label='更新时间' width='170' align='center' :formatter='formatDate'></el-table-column>
			<el-table-column fixed="right" label='操作' width='200' align='center'>
				<template scope="scope">
						<el-button type="text" size="small"  @click="routeToArtical(scope.$index, scope.row)">文章列表</el-button>
		        <el-button type="text" size="small"  @click="routeToEditor(scope.$index, scope.row)">添加文章</el-button>
		        <el-button type="text" size="small" @click="editCategory(scope.$index, scope.row)">编辑</el-button>
			    </template>
			</el-table-column>
		</el-table>

		<el-col :span='24' class='toolbar'>
            <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='20' :total='total' style='float: right'></el-pagination>
        </el-col>

		<el-dialog title='新增栏目' v-model='newFormVisible' :close-on-click-modal='false'>
			<el-form :model="addItem" :rules="addItemRules" ref="addItem" label-width="100px" >
				<!-- 名称 -->
				<el-form-item label="栏目名称" prop="name">
					<el-input v-model="addItem.name"  auto-complete="off" @keydown.enter.native.prevent></el-input>
				</el-form-item>
				<!-- 标题 -->
				<el-form-item label="栏目标题" prop="title">
					<el-input v-model="addItem.title"  auto-complete="off" @keydown.enter.native.prevent></el-input>
				</el-form-item>
				<!-- 描述 -->
				<el-form-item label="栏目描述" prop="description">
					<el-input v-model="addItem.description"  auto-complete="off" @keydown.enter.native.prevent></el-input>
				</el-form-item>
				<!-- 类型 -->
				<el-form-item label="栏目类型" prop="type">
					<el-select placeholder="请选择类型"  v-model="addItem.type">
						<el-option key="0" label="栏目" value="0"></el-option>
					</el-select>
	  		    </el-form-item>
				<!-- 选择父栏目 -->
				<el-form-item label="父级栏目" v-if='judgeAddOrEdit'>
					<el-select v-model="addItem.parent_id" placeholder="请输入父栏目名称或Id搜索" style="width:240px;" filterable clearable remote :remote-method="searchCategoryFunc" :loading='searchCategoryLoading'>
						<el-option
						  v-for="item in categoryOptions"
						  :key="item.id"
						  :label="'（' + item.id + '）' + item.name"
						  :value="item.id">
						</el-option>
					</el-select>
				</el-form-item>
				<!-- 状态 -->
				<el-form-item label="栏目状态" prop="status" >
					<el-select placeholder="请选择状态"  v-model="addItem.status">
						<el-option key="1" label="有效" value="1"></el-option>
						<el-option key="0" label="无效" value="0"></el-option>
					</el-select>
	  		    </el-form-item>
				<!-- 封面 -->
				<el-form-item label="栏目封面">
					<el-input v-model="addItem.image_url"  auto-complete="off" @keydown.enter.native.prevent></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
    		    <el-button @click="newFormVisible = false">取 消</el-button>
    		    <el-button type="primary" @click="addFormConfirm('addItem')" :plain="true">确 定</el-button>
    		  </div>

		</el-dialog>

	</section>
</template>

<script>
import util from '../../common/js/util'

import {
  addNewCategory,
  updateCategory,
  getCategoryList
} from '../../api/api';


export default {
  data() {
    return {
      filters: {
        id: '',
        name: '',
        parent_id: ''
      },
      // 栏目列表数据
      formData: [],
      listLoading: false,

      // 新增栏目
      // 弹框
      newFormVisible: false,
      // 表单数据
      addItem: {
        name: '',
        title: '',
        description: '',
        type: '0',
        parent_id: '',
        status: '1',
        image_url: ''
      },
      // 新增表单校验
      addItemRules: {
        name: [{
            required: true,
            message: '请输入栏目名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 128,
            message: '长度在 1 到 128 个字符',
            trigger: 'blur'
          }
        ],
        title: [{
            required: true,
            message: '请输入栏目标题',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 128,
            message: '长度在 1 到 128 个字符',
            trigger: 'blur'
          }
        ],
        description: [{
          min: 0,
          max: 256,
          message: '长度在 0 到 256 个字符',
          trigger: 'blur'
        }],
        type: [{
          required: true,
          message: '请选择模块类型',
          trigger: 'change'
        }],
        status: [{
          required: true,
          message: '请选择模块类型',
          trigger: 'change'
        }]
      },
      // 关于 绑定父栏目
      // 选项集
      categoryOptions: [],
      // 加载 动画
      searchCategoryLoading: false,

      // 判断是新增还是编辑
      judgeAddOrEdit: true,

      // 分页
      page_index: 1,
      total: 0,
    }
  },
  methods: {
    loadData() {
      let parameter = {
        id: this.filters.id,
        name: this.filters.name,
        page_index: this.page_index,
        parent_id: this.filters.parent_id,
      };
      getCategoryList(parameter)
        .then((res) => {
          if (res.data.success) {
            if (res.data.data.items) {
              this.formData = [];
              res.data.data.items.forEach((item) => {
                let tempObj = item.entity;
                if (item.conf) {
                  tempObj['conf'] = item.conf;
                };
                this.formData.push(tempObj);
              });
            };
            this.total = res.data.data.totalCount;
          } else {
            this.$notify.error(res.data.msg);
          };
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
    },
    // 查找的方法
    handleSeek() {
      this.loadData();
    },
    // 查询项清空数据
    handleIconClickId() {
      this.filters.id = '';
      this.handleSeek();
    },
    handleIconClickName() {
      this.filters.name = '';
      this.handleSeek();
    },
    handleIconClickParentId() {
      this.filters.parent_id = '';
      this.handleSeek();
    },
    // 格式化类型
    formatParentId(row) {
      return row.parentId ? row.parentId : '无父栏目'
    },
    formatType(row) {
      return row.type == 0 ? '栏目' : '其他';
    },
    formatStat(row) {
      return row.stat ? '有效' : '无效';
    },
    formatDate(row) {
      if (row.ct === 0) {
        return util.formatDate.format(new Date(row.ut), 'yyyy/MM/dd hh:mm:ss');
      } else {
        return util.formatDate.format(new Date(row.ct), 'yyyy/MM/dd hh:mm:ss');
      }
    },
    // 新增 栏目
    addCategory() {
      this.judgeAddOrEdit = true; // true 为新增 ，false 为 编辑。
      this.newFormVisible = true; // 打开 新增表单窗口
    },
    // 搜索父栏目
    searchCategoryFunc(query) {
      if (query !== '') {
        let temp = Number(query);
        let parameter = {};
        temp ? parameter['id'] = temp : parameter['name'] = query;
        this.searchCategoryLoading = true;
        // 调用 加载列表的接口
        getCategoryList(parameter).then((res) => {
          if (res.data.success) {
            this.categoryOptions = res.data.data.items.map((item) => {
              let tempObj = {
                id: item.entity.id,
                name: item.entity.name,
              }
              return tempObj
            });
          } else {
            this.$notify.error(res.data.msg);
          }
          this.searchCategoryLoading = false;
        });
      } else {
        this.categoryOptions = [];
      }
    },
    // 分页
    handleCurrentChange(val) {
      this.listLoading = true;
      this.page_index = val;
      this.loadData();
    },
    // 提交 新建的表单
    addFormConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.judgeAddOrEdit) {
            addNewCategory(this.addItem)
              .then((res) => {
                if (res.data.success) {
                  this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    offset: 45
                  });
                  this.newFormVisible = false;
                } else {
                  this.$notify({
                    title: '失败',
                    message: res.data.msg,
                    type: 'error',
                    offset: 45
                  });
                };
                this.loadData();
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
                this.loading = false;
              })
          } else {
            updateCategory(this.addItem)
              .then((res) => {
                if (res.data.success) {
                  this.$notify({
                    title: '成功',
                    message: '添加成功',
                    type: 'success',
                    offset: 45
                  });
                  this.newFormVisible = false;
                } else {
                  this.$notify({
                    title: '失败',
                    message: res.data.msg,
                    type: 'error',
                    offset: 45
                  });
                };
                this.loadData();
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
                this.loading = false;
              })
          }

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    // 编辑 窗口弹出
    editCategory(index, row) {
      this.judgeAddOrEdit = false; // true 为新增 ，false 为 编辑。
      this.addItem = JSON.parse(JSON.stringify(row));
      this.newFormVisible = true;
      this.addItem['type'] += '';
      this.$set(this.addItem, 'status', row.stat + '');
      this.$set(this.addItem, 'parent_id', row.parentId);
      this.$set(this.addItem, 'image_url', row.imageUrl);
      this.$delete(this.addItem, 'imageUrl');
      this.$delete(this.addItem, 'parentId');
      this.$delete(this.addItem, 'stat');
    },
    routeToEditor(index, row) {
      this.$router.push({
        name: '富文本',
        query: {
          categoryId: row.id
        }
      })
    },
    routeToArtical(index, row) {
      this.$router.push({
        name: '文章管理',
        query: {
          articleId: row.id
        }
      })
    },
  },
  filters: {
    formatTime(date) {
      if (date === undefined) {
        return
      }
      if (date === 0) {
        return '/'
      }
      return util.formatDate.format(new Date(date), 'yyyy/MM/dd   hh:mm:ss');
    },
    formatType(row) {
      return row == 0 ? '栏目' : '其他';
    },
    formatStat(row) {
      return row ? '有效' : '无效';
    },
  },
  mounted() {
    this.loadData();
  },
  watch: {
    newFormVisible: {
      handler(newVal, oldVal) {
        if (!newVal) {
          this.addItem = {
            name: '',
            title: '',
            description: '',
            type: '0',
            parent_id: '',
            status: '1',
            image_url: ''
          }
        }
      }
    }
  }
}
</script>

<style lang="css" scoped>
.formExpand {
	width: 800px;
	margin-left: 100px;
	display: flex;
	justify-content: space-around;
}
.formExpand figcaption{
	float: right;
	width: 340px;
	line-height: 25px;
}

.formExpand .CourseImage {
	width: 200px;
	height: 200px;
	border: 1px solid #d1dbe5;
	border-radius: 4px;
	padding: 10px;
	box-shadow: 0 0 3px #666;
}
</style>
