<template lang="html">
  <div id="Template">
    <el-row>
      <el-col :span='24' class='toolbar' style='padding-bottom: 0px;'>
        <el-form :inline=true :model='filters'>
          <el-form-item>
            <el-input v-model='filters.id' placeholder='模板 ID' icon="circle-cross" :on-icon-click="handleIconClick_clearID" @keydown.native.prevent.enter='initData()'></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model='filters.name' placeholder='模板名称' icon="circle-cross" :on-icon-click="handleIconClick_clearName" @keydown.native.prevent.enter='initData()'></el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model='filters.tags' placeholder='模板标签' icon="circle-cross" :on-icon-click="handleIconClick_clearTag" @keydown.native.prevent.enter='initData()'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='initData()'>查询</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type='primary' @click='handleAdd()'>新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="tempClass">
      <h2>模板分类</h2>
      <div class="container">
        <section>
          <span class="tempType">适用关卡:</span>
          <span class="fontBtn" v-for="(item, index) in allAimTypes" @click="getTempListByAimType(index)" :class="item.active ? 'active' : 'normal'">{{ item.name }}</span>
        </section>
        <section>
          <span class="tempType">游戏类型:</span>
          <span class="fontBtn" v-for="(item, index) in allTypes" @click="getTempListByType(index)" :class="item.active ? 'active' : 'normal'">{{ item.name }}</span>
        </section>
      </div>
    </div>
    <div class="tempSubtypeAbout">
      <h2>
        <span>模板列表</span>
      </h2>
      <div class="container">
        <el-col :span="6" :gutter="20" v-for="(item, index) in allTemp" :key='index'>
          <figure>
            <div class="img">
              <img :src="item.entity.imgUrl" v-if="item.entity.imgUrl"></img>
              <div v-else></div>
            </div>
            <figcaption>
              <p class="title">{{ item.entity.name }}</p>
              <p class="update" @click="handleUpdate(item)">更新</p>
            </figcaption>
          </figure>
        </el-col>
        <el-col :span="24">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="page_size"
            layout="prev, pager, next, jumper"
            :total="total"
            style="float: right; margin:10px 30px 0 0;"
          >
          </el-pagination>
        </el-col>
      </div>
    </div>

    <el-dialog title='' v-model='formVisible' :close-on-click-modal='false'>
      <el-form :model='form' :rules='formRules' ref="form" label-width="80px" label-position="right">
        <el-form-item label='ID' prop='id' v-if="!flag_addOrEdit">
          <el-input v-model='form.id' disabled></el-input>
        </el-form-item>
        <el-form-item label='标题' prop='name'>
          <el-input v-model='form.name'></el-input>
        </el-form-item>
        <el-form-item label='描述' prop='description'>
          <el-input v-model='form.description'></el-input>
        </el-form-item>
        <el-form-item label='元数据' prop='meta_data'>
          <el-input v-model='form.meta_data' type="textarea" :autosize="{ minRows: 4, maxRows: 10}"></el-input>
        </el-form-item>
        <el-form-item label='标签' prop='dynamicTags'>
          <div>
            <el-tag :key="tag" v-for="tag in form.dynamicTags" :closable="true" :close-transition="false" @close="handleClose(tag)" type="success" style="margin:0 5px 0 0">{{tag}}</el-tag>
            <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini" style="width: 100px;" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" @keydown.enter.native.prevent></el-input>
            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
          </div>
        </el-form-item>
        <el-form-item label='链接'>
          <el-input v-model='form.url' ></el-input>
        </el-form-item>
        <el-form-item label='封面'>
          <el-input v-model='form.image_url' ></el-input>
        </el-form-item>
         <el-form-item label="模板类型" prop='type'>
          <el-radio-group v-model="form.type">
            <el-radio class="radio" v-for='item in allTypes' :label="item.index" :key='item.index' :disabled='!flag_addOrEdit'>{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="目标类型" prop='type'>
          <el-radio-group v-model="form.aimType">
            <el-radio class="radio" v-for='item in allAimTypes' :label="item.index" :key='item.index'>{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop='status'>
          <el-radio-group v-model="form.status">
            <el-radio class="radio" :label="1">有效</el-radio>
            <el-radio class="radio" :label="0">无效</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="formVisible = false">取消</el-button>
        <el-button type="primary" @click.native="submit" :loading="formLoading">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPublicKvList, //获取类型用
  getTempList,
  addTemp,
  updateTemp
} from "../../api/api";
export default {
  data() {
    return {
      // 所有的type类型
      allTypes: "",
      // 所有的目标类型
      allAimTypes: "",
      // 所有的模板
      allTemp: [],
      // 过滤查询
      filters: {
        name: "",
        tags: "",
        id: ""
      },
      // 表单
      formFlag: false,
      formVisible: false,
      formLoading: false,
      form: {
        name: "",
        description: "",
        meta_data: "",
        url: "",
        dynamicTags: [],
        status: 1,
        type: 1
      },
      formRules: {
        name: [
          {
            required: true,
            message: "名称为必填项",
            trigger: "blur"
          }
        ],
        description: [
          {
            required: true,
            message: "描述为必填项",
            trigger: "blur"
          }
        ],
        meta_data: [
          {
            required: true,
            message: "元数据规则为必填项",
            trigger: "blur"
          }
        ],
        type: [
          {
            required: true
          }
        ],
        status: [
          {
            required: true
          }
        ]
      },
      /*
        tags 标签
       */
      inputVisible: false,
      inputValue: "",
      /**
       * 分页
       */
      currentPage: 1,
      page_size: 20,
      total: 0,
      /***
       * @description currentType     当前模板类型
       * @description currentAimType  当前学习目标类型
       */
      currentType: "",
      currentAimType: "",
      /***
       * currentTags 玩法是保存在tags里面的
       */
      currentTags: "",
      /**
        flag_addOrEdit 判断是新增还是编辑
        true 新增
        false 编辑
       */
      flag_addOrEdit: true
    };
  },
  methods: {
    /**
     * @function 初始化请求获取模板的type类型(包括模板类型和学习目标类型)
     * @description 初始化请求获取type=0 aim_type=0的模板
     */
    initType() {
      getPublicKvList({
        name: "_sys.template_sub_type"
      }).then(res => {
        if (res.data.success) {
          let arr = JSON.parse(res.data.data.content).types;
          this.allTypes = arr.map(item => {
            // 默认加载全部的模板类型 所以active全部是false
            item.active = false;
            return item;
          });
        } else {
          this.$notify({
            title: "错误",
            type: "error",
            message: res.data.msg
          });
        }
      });
      getPublicKvList({
        name: "_sys.template_sub_type"
      }).then(res => {
        if (res.data.success) {
          let arr = JSON.parse(res.data.data.content).aimTypes;
          this.allAimTypes = arr.map(item => {
            // 默认加载全部的模板类型 所以active全部是false
            item.active = false;
            return item;
          });
        } else {
          this.$notify({
            title: "错误",
            type: "error",
            message: res.data.msg
          });
        }
      });
      let para = {
        type: 0,
        aim_type: 0
      };
      // 加载数据
      this.initData(para);
    },
    /***
     * @function 请求列表接口
     * @argument passParams 存在的话说明是通过tag和type来搜索的
     */
    initData(passParams) {
      let para;
      if (passParams) {
        para = Object.assign({}, passParams);
      } else {
        para = {
          id: this.filters.id,
          name: this.filters.name,
          tags: this.filters.tags,
          type: this.currentType,
          page_size: this.page_size,
          page_index: this.currentPage
        };
      }
      getTempList(para).then(res => {
        if (res.data.success) {
          this.allTemp = res.data.data.items;
          this.total = res.data.data.totalCount;
        } else {
          this.$notify({
            title: "错误",
            type: "error",
            messgae: res.data.msg
          });
        }
      });
    },

    /**
     * @function 根据模板类型获取数据
     * @function 根据学习目标类型获取数据
     */
    getTempListByType(i) {
      this.currentType = i;
      this.allTypes.forEach((item, index) => {
        item.active = false;
        if (index == i) {
          item.active = true;
        }
      });
      let para = {
        type: i,
        aim_type: this.currentAimType
      };
      this.initData(para);
    },
    getTempListByAimType(i) {
      this.currentAimType = i;
      this.allAimTypes.forEach((item, index) => {
        item.active = false;
        if (index == i) {
          item.active = true;
        }
      });
      let para = {
        aim_type: i,
        type: this.currentType
      };
      this.initData(para);
    },

    /***
     * @function 通过名称查询
     * @function 通过标签查询
     * @function 通过Id查询
     */
    handleIconClick_clearName() {
      this.filters.name = "";
    },
    handleIconClick_clearTag() {
      this.filters.tags = "";
    },
    handleIconClick_clearID() {
      this.filters.id = "";
    },

    /**
     * @function 分页相关
     */
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.initData();
    },

    /***
      新增模板
     */
    handleAdd() {
      this.flag_addOrEdit = true;
      this.form = {
        name: "",
        description: "",
        meta_data: "",
        url: "",
        dynamicTags: [],
        status: 1,
        type: 0,
        aimType: 0
      };
      this.formVisible = true;
      this.formFlag = false;
    },
    /**
     * 更新模板
     */
    handleUpdate(item) {
      this.flag_addOrEdit = false;
      this.formVisible = true;
      this.formFlag = true;
      this.form = {
        id: item.entity.id,
        name: item.entity.name,
        description: item.entity.description,
        meta_data: JSON.stringify(item.conf.metaData),
        url: item.entity.htmlUrl,
        image_url: item.entity.imgUrl,
        dynamicTags: item.entity.tags ? item.entity.tags.split(",") : [],
        status: item.entity.stat,
        type: item.entity.type,
        aimType: item.entity.aimType
      };
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$confirm("确认提交吗?", "提示", {}).then(() => {
            this.formLoading = true;
            let para = Object.assign({}, this.form);
            para["tags"] = para["dynamicTags"].join(",");
            para["aim_type"] = para["aimType"];
            if (!this.formFlag) {
              addTemp(para).then(res => {
                if (res.data.success) {
                  this.$notify({
                    title: "成功",
                    type: "success",
                    message: "操作成功"
                  });
                  this.formVisible = false;
                  this.form = {};
                  this.initData();
                } else {
                  this.$notify({
                    title: "错误",
                    type: "error",
                    message: res.data.msg
                  });
                }
                this.formLoading = false;
              });
            } else {
              updateTemp(para).then(res => {
                if (res.data.success) {
                  this.$notify({
                    title: "成功",
                    type: "success",
                    message: "操作成功"
                  });
                  this.formVisible = false;
                  this.form = {};
                  this.initData();
                } else {
                  this.$notify({
                    title: "错误",
                    type: "error",
                    message: res.data.msg
                  });
                }
                this.formLoading = false;
              });
            }
          });
        }
      });
    },
    /**
      @description tags标签
     */
    handleClose(tag) {
      this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1);
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
        this.form.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    }
  },
  created() {
    this.initType();
    this.initData();
  }
};
</script>

<style lang="less" scoped>
#Template {
  width: 100%;
  .tempClass {
    width: 100%;
    border: 1px solid rgb(227, 227, 227);
    margin: 16px 0 25px;
    background-color: #fff;
    h2 {
      width: 100%;
      text-align: left;
      font-size: 18px;
      line-height: 60px;
      height: 60px;
      border-bottom: 1px solid rgb(227, 227, 227);
      text-indent: 16px;
    }
    .container {
      section {
        width: 100%;
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        text-indent: 16px;
        color: rgb(29, 31, 33);
        .tempSubtype,
        .tempType {
          margin-right: 2em;
        }
        .fontBtn {
          cursor: pointer;
          margin-right: 20px;
        }
        .active {
          color: rgb(92, 176, 232);
        }
      }
    }
  }
  .tempSubtypeAbout {
    width: 100%;
    border: 1px solid rgb(227, 227, 227);
    background-color: #fff;
    h2 {
      width: 100%;
      line-height: 60px;
      height: 60px;
      border-bottom: 1px solid rgb(227, 227, 227);
      text-indent: 16px;
      display: flex;
      justify-content: space-between;
      padding-right: 20px;
      span {
        &:first-child {
          font-size: 18px;
        }
      }
    }
    .container {
      width: 100%;
      overflow: scroll;
      padding: 20px 0;
      border: 1px solid rgb(229, 229, 229);
      figure {
        width: 90%;
        height: 180px;
        border: 1px solid rgb(229, 229, 229);
        margin: 16px auto;
        .img {
          width: 100%;
          height: 135px;
          padding: 5px;
          div {
            width: 100%;
            height: 100%;
            background-color: rgb(222, 181, 156);
          }
          img {
            width: 100%;
            height: 100%;
          }
        }
        figcaption {
          width: 100%;
          height: 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px;
          .update {
            cursor: pointer;
            color: green;
          }
        }
      }
    }
  }
  ._form {
    width: 80%;
    height: 500px;
    position: fixed;
    top: 20%;
    right: 10%;
    background-color: #fff;
    border: 1px solid #000;
  }
}
</style>
