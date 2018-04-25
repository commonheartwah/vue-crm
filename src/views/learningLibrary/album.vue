<template lang="html">
  <section class="learningLibPage">
    <!-- 按钮  过滤  工具条-->
    <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
      <el-form :inline=true :model='filters'>
        <el-form-item>
          <el-input v-model='filters.id' placeholder='ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" @keydown.native.prevent.enter='loadList'></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model='filters.title' placeholder='标题' icon="circle-cross" :on-icon-click="handleIconClick_clearTitle" @keydown.native.prevent.enter='loadList'></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model='filters.EnglishTitle' placeholder='英文标题' icon="circle-cross" :on-icon-click="handleIconClick_clearEnglishTitle" @keydown.native.prevent.enter='loadList'></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model='filters.tags' placeholder='标签' icon="circle-cross" :on-icon-click="handleIconClick_clearTags" @keydown.native.prevent.enter='loadList'></el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="filters.type"
            filterable
            allow-create
            placeholder="类型"
            style="width:115px"
          >
            <el-option
              v-for="item in typeArray"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click='loadList()'>查询</el-button>
          <el-button type="primary" @click="handleAdd()">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <section class="content">
      <el-card class="box-card" v-for="(item, index) in docs" :key='item'>
        <section class="elementCard">
          <div class="itemContent">
            <div class="elementContent elementContentMaterial" style="position: relative">
              <div>
                <img :src="item.entity.posterUrl" class="image">
              </div>
            </div>
          </div>

          <div class="itemEntityContent">
            <div v-if="item.entity.content">
              <span
                v-for="(info, index) in item.entity.content.split('\n')"
                v-if="item.entity.content"
              >
                {{ info }}
              </span>
            </div>
            <span v-else>暂无内容</span>
          </div>

          <div class="itemEntity">
            <p><span>ID：</span>{{ item.entity.id }}</p>
            <p><span>类型：</span>{{ item.entity.type | formatType }}</p>
            <p><span>描述：</span>{{ item.entity.description | formatDescription }}</p>
            <p><span>中文标题：</span>{{ item.entity.title || item.parsed.title }}</p>
            <p><span>英文标题：</span>{{ item.entity.englishTitle || item.parsed.englishTitle }}</p>
            <p>
              <span>详情：</span>
              <el-button-group  class="button">
                <el-button type="text" icon="document" size='small' @click="golearlib(item.entity.id, item.entity.type)" style="margin-right: 14px;">&nbsp;<span style="font-size: 14px; color: rgb(8, 167, 38);">查看</span></el-button>
              </el-button-group>
            </p>
            <p>
              <span>编辑：</span>
              <el-button-group  class="button">
                <el-button type="text" icon="edit" size='small' @click='edit(item)' style="margin-right: 14px;">&nbsp;<span style="font-size: 14px; color: rgb(8, 167, 38)">修改</span></el-button>
              </el-button-group>
            </p>
          </div>
        </section>
      </el-card>
    </section>

    <section class="noData" v-if="!docs.length">
      暂无数据
    </section>

    <!-- 分页条 -->
    <el-col :span='24' class='toolbar'>
      <el-pagination layout='prev, pager, next' @current-change='handleCurrentChange' :page-size='limit' :total='totalCount' style='float: right'></el-pagination>
    </el-col>

    <!-- 新增界面 -->
    <el-dialog title='编辑' v-model='addFormVisible' :close-on-click-modal='false'>
      <el-form :model='addForm' :label-width="addFormLabelWidth" :rules='addFormRules' ref='addForm'>
        <el-form-item label="ID" v-if="addForm.id">
          <el-input type="text" name="" v-model="addForm.id" disabled style="width: 150px;"></el-input>
        </el-form-item>

        <el-form-item label="类型" prop='type'>
          <el-radio-group v-model="addForm.type">
              <el-radio class="radio" :label="0">单词专辑</el-radio>
              <el-radio class="radio" :label="3">英文动画片</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="addForm.title" auto-complete="off" placeholder="请输入中文标题"></el-input>
        </el-form-item>

        <el-form-item label="英文标题" prop="englishTitle">
          <el-input v-model="addForm.englishTitle" auto-complete="off" placeholder="请输入英文标题"></el-input>
        </el-form-item>

        <el-form-item label='素材标签' prop='dynamicTags' style="width:600px;">
          <div>
            <el-tag
              :key="tag"
              v-for="tag in addForm.dynamicTags"
              :closable="true"
              :close-transition="false"
              @close="handleClose(tag)"
              type="success"
              style="margin:0 5px 0 0"
            >
            {{tag}}
            </el-tag>
            <el-input
              class="input-new-tag"
              v-if="inputVisible"
              v-model="inputValue"
              ref="saveTagInput"
              size="mini"
              @keyup.enter.native="handleInputConfirm"
              @blur="handleInputConfirm"
              style="width: 100px;"
              @keydown.enter.native.prevent
            >
            </el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </el-form-item>

        <el-form-item label="描述">
          <el-input type="textarea" v-model="addForm.description" placeholder="请输入描述信息" ></el-input>
        </el-form-item>

        <el-form-item label='内容'>
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" v-model='addForm.content' placeholder="请输入内容,注意回车换行" ></el-input>
        </el-form-item>

        <el-form-item label="封面上传" prop='poster'>
          <el-upload
              class="upload-demo"
              ref='upload'
              drag
              name="bin"
              action="/op/material/upload_image"
              :multiple='false'
              :on-success="handleSuccess"
              :on-change="handleChange"
              :file-list="fileList"
          >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
              <div class="el-upload__tip" slot="tip">只能上传jpg/png文件 规格为336x336</div>
          </el-upload>
          <div class="imgContainer" v-show="addForm.poster_url">
            <img :src="addForm.poster_url ? addForm.poster_url : ''" ref='posterImg'>
          </div>
        </el-form-item>
        <el-form-item label="状态" prop='status'>
          <el-radio-group v-model="addForm.status">
              <el-radio class="radio" :label="1">有效</el-radio>
              <el-radio class="radio" :label="0">无效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="formSubmit" :loading="addLoading">提交</el-button>
		  </div>
    </el-dialog>
  </section>
</template>

<script>
// util工具包
import util from '../../common/js/util'
// axios
import {
  // 获取专辑列表
  getAlbumList,
  // 增加专辑
  addAlbum,
  // 更新专辑
  updateAlbum,
  // 获取指定的专辑
  getAlbumById

} from '../../api/api'

export default {
  data() {
    return {
      filters: {
        id: '',
        title: '',
        EnglishTitle: '',
        tags: '',
        type: ''
      },
      typeArray: [{
          value: '0',
          label: '单词专辑'
        },
        {
          value: '3',
          label: '英文动画片'
        }
      ],
      /**
       * totalCount     数据总量
       * page           当前页码
       * limit         分页每页显示多少数据
       */
      totalCount: 0,
      totalPage: 0,
      page: 1,
      limit: 5,
      // list
      listLoading: false,
      // 数据
      docs: [],
      // 多选数组
      selectArr: [],
      // filter type
      type_page: '',
      // 新增界面
      addFormVisible: false, //新增界面是否显示
      addLoading: false, //新增界面是否显示加载
      addFormLabelWidth: '100px',
      addFormRules: { //新增界面表单规则
        title: [{
          required: true,
          message: '标题为必填项',
          trigger: 'blur'
        }],
        englishTitle: [{
          required: true,
          message: '英文标题为必填项',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '请选择状态'
        }]
      },
      addForm: { //新增界面表单数据类型
        // id: '',
        // title: '',
        // englishTitle: '',
        // type: '',
        // description: '',
        // content: '',
        // dynamicTags: [],
        // status: 1,
        // poster_url
      },
      // tags 标签
      inputVisible: false,
      inputValue: '',
      // 上传文件列表
      fileList: []
    }
  },
  methods: {
    loadList() {
      // 如果是来自双语配置带id参数
      this.type_page = this.filters.type
      let para = {
        id: this.filters.id,
        title: this.filters.title,
        english_title: this.filters.EnglishTitle,
        tags: this.filters.tags,
        type: this.filters.type,
        page_index: this.page,
        page_size: this.limit
      }
      this.listLoading = true;
      console.log(para);
      getAlbumList(para)
        .then((res) => {
          console.log(res);
          if (res.data.success) {
            this.totalCount = res.data.data.totalCount;
            this.totalPage = res.data.data.totalPage;
            if (res.data.data.items) {
              this.docs = res.data.data.items;
            } else {
              this.docs = [];
            }
          } else {
            this.$notify({
              title: '错误',
              message: res.data.msg,
              type: 'error'
            });
            this.docs = [];
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
    },
    // 查询
    handleIconClick_clearId() {
      this.filters.id = '';
    },
    handleIconClick_clearTitle() {
      this.filters.title = '';
    },
    handleIconClick_clearEnglishTitle() {
      this.filters.EnglishTitle = '';
    },
    handleIconClick_clearTags() {
      this.filters.tags = '';
    },
    // 分页
    handleCurrentChange(val) {
      this.page = val;
      this.loadList();
    },
    // 点击新增
    handleAdd() {
      this.addFormVisible = true;
      this.addForm = {
        id: '',
        title: '',
        englishTitle: '',
        type: 0,
        description: '',
        content: '',
        dynamicTags: [],
        status: 1,
        poster_url: ''
      }
    },
    // tags标签
    handleClose(tag) {
      this.addForm.dynamicTags.splice(this.addForm.dynamicTags.indexOf(tag), 1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.addForm.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';
    },
    // 上传文件列表
    handleChange(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(fileList[fileList.length - 1], 1)
      }
    },
    // 上传封面成功后的回调
    handleSuccess(response, file) {
      if (response.success) {
        this.$refs.posterImg.src = response.data,
          this.addForm.poster_url = response.data,
          console.log(this.addForm.poster_url);
      } else {
        this.$notify({
          title: '错误',
          message: response.msg,
          type: 'error'
        })
      }

    },
    formSubmit() {
      let para = {
        id: this.addForm.id ? this.addForm.id : '',
        title: this.addForm.title,
        english_title: this.addForm.englishTitle,
        description: this.addForm.description,
        content: this.addForm.content ? util.ReplaceSeperatorByEnter(this.addForm.content) : '',
        tags: this.addForm.dynamicTags.length ? this.addForm.dynamicTags.join(',') : '',
        type: this.addForm.type,
        sub_type: 0,
        status: this.addForm.status,
        poster_url: this.addForm.poster_url
      }
      if (!this.addForm.id) {

        addAlbum(para).then((res) => {

          if (res.data.success) {
            this.addFormVisible = false;
            this.$notify({
              type: 'success',
              message: '提交成功',
              title: '成功'
            })
            this.addForm = {
              id: '',
              title: '',
              englishTitle: '',
              type: '',
              description: '',
              content: '',
              dynamicTags: [],
              status: 1,
              poster_url: ''
            }
            this.filters.id = ''
            this.loadList();
            this.fileList = [];

          } else {
            this.$notify({
              type: 'error',
              message: res.data.msg,
              title: '错误'
            })
          }
        })
      } else {
        updateAlbum(para).then((res) => {
          if (res.data.success) {
            this.addFormVisible = false;
            this.$notify({
              type: 'success',
              message: '提交成功',
              title: '成功'
            })
            this.addForm = {
              id: '',
              title: '',
              englishTitle: '',
              type: '',
              description: '',
              content: '',
              dynamicTags: [],
              status: 1,
              poster_url: ''
            }
            this.filters.id = ''
            this.loadList();
            this.fileList = [];
          } else {
            this.$notify({
              type: 'error',
              message: res.data.msg,
              title: '错误'
            })
          }
        })
      }
    },
    golearlib(id, type) {
      this.$router.push({
        path: '/underAlbum',
        query: {
          id: id,
          type: type
        }
      })
    },
    // 点击更新
    edit(item) {
      this.addFormVisible = true;
      this.addForm = {
        id: item.entity.id,
        title: item.entity.title,
        englishTitle: item.entity.englishTitle,
        type: item.entity.type,
        description: item.entity.description,
        content: item.entity.content,
        dynamicTags: item.entity.tags ? item.entity.tags.split(',') : [],
        status: item.entity.stat,
        poster_url: item.entity.posterUrl,
      }
    },
  },
  filters: {
    formatType(type) {
      switch (type) {
        case 0:
          return '单词专辑';
          break;
        case 3:
          return '英文动画片';
          break;
        default:
          return '未知';
      }
    },
    TransformArray(str) {
      return str.split('\n');
    },
    // 转换描述
    formatDescription(desc) {
      if (desc) {
        return desc
      } else {
        return '暂无数据'
      }
    }
  },
  mounted() {
    if (this.$route.params.id) {
      this.filters.id = this.$route.params.id;
    }
    this.loadList();
  },
}
</script>

<style lang="less">
.learningLibPage {
    .content {
        margin-bottom: 5px;
        .elementCard {
            height: 200px;
            display: flex;
            justify-content: space-between;
            border-radius: 3px;
            padding: 0 0 0 10px;
            align-items: center;
            .itemContent {
                width: 20%;
                .elementContent {
                    height: 200px;
                    border: 1px solid #d1dbe5;
                    border-radius: 4px;
                    padding: 18px;
                    box-shadow: 0 0 3px #666;
                    overflow-y: hidden;
                    width: 100%;
                }
                .elementContentMaterial {
                    width: 100%;
                    height: 200px;
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    flex-direction: column;
                    align-items: center;
                    .image {
                        width: 100%;
                    }
                    .defaultImage {
                        width: 100%;
                    }
                }
                .elementContentCharacter {
                    margin: 10px 0;
                }
                .elementContentUrl {
                    margin: 10px 0;
                    p {
                        span {
                            color: #99a9bf;
                        }
                    }
                }
            }
            .itemEntityContent {
                width: 40%;
                height: 100%;
                text-align: center;
                margin-left: 50px;
                overflow-y: scroll;
                display: flex;
                justify-content: center;
                align-items: center;
                span {
                    width: 100%;
                    display: inline-block;
                }

            }
            .itemEntity {
                width: 30%;
                padding: 8px;
                p {
                    span {
                        color: #99a9bf;
                    }
                    line-height: 24px;
                }
            }
        }
    }
    .noData {
        width: 100%;
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #d1dbe5;
        border-radius: 4px;
    }

    .imgContainer {
        width: 336px;
        height: 336px;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px dashed #ccc;
        img {
            width: 100%;
        }
    }
}
</style>
