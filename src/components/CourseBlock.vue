<template lang="html">
  <section class="content">
          <draggable :list="blockInfo" @end='onMoveEndCallback' @start="onStartCallback" :move="onMoveCallback" class="detailed" :options="dragOption">
              <section  class="elementCard" v-for="(item, index) in blockInfo" :key="index">
                  <div class="itemContent">
                      <div class="elementContent elementContentMaterial"  v-if='item.parsed && item.entity.type == 0'>
                          <img :src='item.parsed.url' class="image" @click='checkMaterial(item)'>
                      </div>
                      <div class="elementContent elementContentMaterial"  v-if='item.entity.type == 1'>
                          <img :src='item.parsed.url' class="image" v-if='item.parsed && item.parsed.url'>
                          <img src="../../static/images/defaultPicInElementVideo.jpg" class="image" v-else >
                      </div>
                      <div class="elementContent elementContentMaterial"  v-if='item.entity.type == 2'>
                          <img :src='item.parsed.url' class="image" v-if='item.parsed && item.parsed.url'>
                          <img src="../../static/images/defaultPicInElementAudio.png" class="image" v-else >
                      </div>
                      <div class="elementContent elementContentUrl"  v-if='item.entity.type == 3'>
                          <p><span>链接：</span>{{ item.parsed.url }}</p>
                          <p><span>名称：</span>{{ item.parsed.name || "未命名"}}</p>
                          <p><span>描述：</span>{{ item.parsed.description || "未添加描述" }}</p>
                      </div>
                      <div class="elementContent elementContentCharacter"  v-if='item.entity.type == 4'>
                          <p v-for='(info, index) in item.parsed.content' :key='index'>
                              <itemContentInfo :info='info | ReplaceSeperator'></itemContentInfo>
                          </p>
                      </div>
                      <div class="elementContent elementContentCharacter"  v-if='item.entity.type == 5'>
                          <p v-if='item.parsed.name'><span>目标课节ID：</span>{{ item.parsed.lessonId }}</p>
                          <p v-if='item.parsed.name'><span>跳转描述：</span>{{ item.parsed.name }}</p>
                          <el-button type="text" icon="share" size='small' @click='skipToLesson(item)'>点击跳转到目标课节</el-button>
                      </div>
                  </div>
                  <div class="itemEntity">
                      <p><span>节  点 ID：</span>{{ item.entity.id }}</p>
                      <p><span>节点名称：</span>{{ item.entity.name || item.parsed.name }}</p>
                      <p><span>节点类型：</span>{{ item.entity.type | formatContentType }}</p>
                      <p v-if='item.parsed && item.parsed.name' style='color: rgb(67, 150, 197)'><span>素材名称：</span>{{ item.parsed.name }}</p>
                      <p v-if='item.entity.type == 4'><span>文本类型：</span>{{ item.parsed.styleType | formatContentStyleType }}</p>
                      <p v-if='item.entity.type == 4 && item.parsed.title'><span>标题：</span>{{ item.parsed.title || ''}}</p>
                      <p v-if='item.entity.type == 4 && item.parsed.subTitle'><span>副标题：</span>{{ item.parsed.subTitle || ''}}</p>
                      <p v-if='item.entity.ut'><span>更新时间：</span>{{ item.entity.ut | formatTime }}</p>
                      <p v-if='!item.entity.ut'><span>更新时间：</span>{{ item.entity.ct | formatTime }}</p>
                      <p v-if='item.entity.type == 0 || item.entity.type == 1 || item.entity.type == 2'>
                          <span>查看素材：</span>
                          <el-button type="text" icon="picture" size='small' v-if='item.entity.type == 0' @click='checkMaterial(item)'>点击查看大图</el-button>
                          <el-button
                              type="text"
                              size='small'
                              class="fa fa-play-circle"
                              v-if='item.entity.type == 1 || item.entity.type == 2'
                              @click="clickToPlay(item)"
                          >&nbsp;点击播放</el-button>
                      </p>
                      <p>
                          <span>节点编辑：</span>
                          <el-button-group  class="button">
                              <el-button type="text" icon="edit" size='small' @click='editElementFunc(item)' style="margin-right: 14px;">修改</el-button>
                              <el-button type="text" icon="delete" size='small' @click='deleteElementFunc(item)' style="margin-right: 14px;">删除</el-button>
                              <el-button type="text" icon="delete" size='small' @click='changeTypeOfElement(item)'>修改类型</el-button>
                          </el-button-group>
                      </p>
                  </div>
              </section>

              <el-col :span="8" v-if='blockInfo.length == 0' :offset='8'>
                <el-card :body-style="{ padding: '0px' }" class="elementCard">
                    <section class='blankContent'>
                        当前板块下无节点。尝试点下面的“新增节点”创建一个
                    </section>
                </el-card>
              </el-col>
          </draggable>
      <div class="footerButton">
          <section class="addNew">
              <el-cascader v-if='showList==1' expand-trigger="hover" :options="litterTypeOption" v-model="AddNewElementType" :change-on-select='true'>
              </el-cascader>
      <el-cascader v-if='showBlockMethod' expand-trigger="hover" :options="typeOptions" v-model="AddNewElementType" :change-on-select='true'>
              </el-cascader>
      <el-cascader v-if='showBlockMethod==false' expand-trigger="hover" :options="musicTypeOption" v-model="AddNewElementType" :change-on-select='true'>
              </el-cascader>
      <!-- <el-cascader  expand-trigger="hover" :options="showBlockMethod?typeOptions:musicTypeOption" v-model="AddNewElementType" :change-on-select='true'>
              </el-cascader> -->
              <el-button type="primary" @click="addNewElement" slot="append">新建节点</el-button>
          </section>

          <el-button-group>
              <!-- <el-tooltip content="保存顺序" placement="top" effect="light">
                  <el-button icon="check" @click='submitElementSequence'></el-button>
              </el-tooltip> -->
              <el-tooltip content="编辑板块" placement="top" effect="light" v-if='showBlockMethod'>
                  <el-button icon="edit" @click='editBlock'></el-button>
              </el-tooltip>
              <el-tooltip content="删除板块" placement="top" effect="light" v-if='showBlockMethod'>
                  <el-button icon="delete2" @click='closeBlock'></el-button>
              </el-tooltip>
      <el-tooltip content="编辑板块" placement="top" effect="light" v-if='showList==1'>
                  <el-button icon="edit" @click='editBlock'></el-button>
              </el-tooltip>
              <el-tooltip content="删除板块" placement="top" effect="light" v-if='showList==1'>
                  <el-button icon="delete2" @click='closeBlock'></el-button>
              </el-tooltip>
          </el-button-group>
      </div>
  </section>
</template>
<script>
import util from "../common/js/util";
import draggable from "vuedraggable";

import { updateSequenceElementInBlock } from "../api/api";

export default {
  props: [
    "ruleForm",
    "selfIndex",
    "blockInfo",
    "blockId",
    "showBlockMethod",
    "isDrag",
    "showList"
  ],
  components: {
    draggable,
    itemContentInfo: {
      props: ["info"],
      render(createElement) {
        if (this.info.length) {
          return createElement(
            "div",
            this.info.map(function(item) {
              return createElement("p", item);
            })
          );
        } else {
          return createElement("p", "No items found.");
        }
      }
    }
  },
  data() {
    return {
      visible2: false,

      fileList: [],
      dialogFormVisible: false,
      newElenemt: {},
      formLabelWidth: "120px",

      AddNewElementType: ["4", "1"],
      litterTypeOption: [
        {
          value: "0",
          label: "图片",
          children: [
            {
              value: "0",
              label: "本地上传"
            },
            {
              value: "1",
              label: "从素材库选择"
            }
          ]
        },
        {
          value: "1",
          label: "视频",
          children: [
            {
              value: "0",
              label: "本地上传"
            },
            {
              value: "1",
              label: "从素材库选择"
            }
          ]
        },
        {
          value: "2",
          label: "音频",
          children: [
            {
              value: "0",
              label: "本地上传"
            },
            {
              value: "1",
              label: "从素材库选择"
            }
          ]
        },
        {
          value: "3",
          label: "链接",
          children: [
            {
              value: "0",
              label: "自定义链接"
            }
          ]
        },
        {
          value: "4",
          label: "文字",
          children: [
            {
              value: "0",
              label: "无气泡文字"
            },
            {
              value: "1",
              label: "气泡文字"
            },
            {
              value: "2",
              label: "有编号序列文字无标题"
            }
          ]
        }
      ],
      musicTypeOption: [
        {
          value: "0",
          label: "图片",
          children: [
            {
              value: "0",
              label: "本地上传"
            },
            {
              value: "1",
              label: "从素材库选择"
            }
          ]
        },
        {
          value: "1",
          label: "视频",
          children: [
            {
              value: "0",
              label: "本地上传"
            },
            {
              value: "1",
              label: "从素材库选择"
            }
          ]
        },
        {
          value: "2",
          label: "音频",
          children: [
            {
              value: "0",
              label: "本地上传"
            },
            {
              value: "1",
              label: "从素材库选择"
            }
          ]
        },
        {
          value: "4",
          label: "文字",
          children: [
            {
              value: "0",
              label: "无气泡文字"
            },
            {
              value: "1",
              label: "气泡文字"
            },
            {
              value: "2",
              label: "有编号序列文字无标题"
            },
            {
              value: "3",
              label: "有编号序列文字带标题无副标题"
            },
            {
              value: "4",
              label: "有编号序列文字带标题带副标题"
            },
            {
              value: "5",
              label: "无编号序列文字无标题"
            }
          ]
        }
      ],
      typeOptions: [
        // 课程能选择的类型
        {
          value: "0",
          label: "图片",
          children: [
            {
              value: "0",
              label: "本地上传"
            },
            {
              value: "1",
              label: "从素材库选择"
            }
          ]
        },
        {
          value: "1",
          label: "视频",
          children: [
            {
              value: "0",
              label: "本地上传"
            },
            {
              value: "1",
              label: "从素材库选择"
            }
          ]
        },
        {
          value: "2",
          label: "音频",
          children: [
            {
              value: "0",
              label: "本地上传"
            },
            {
              value: "1",
              label: "从素材库选择"
            }
          ]
        },
        {
          value: "3",
          label: "链接",
          children: [
            {
              value: "0",
              label: "自定义链接"
            },
            {
              value: "1",
              label: "模板链接"
            }
          ]
        },
        {
          value: "4",
          label: "文字",
          children: [
            {
              value: "0",
              label: "无气泡文字"
            },
            {
              value: "1",
              label: "气泡文字"
            },
            {
              value: "2",
              label: "有编号序列文字无标题"
            },
            {
              value: "3",
              label: "有编号序列文字带标题无副标题"
            },
            {
              value: "4",
              label: "有编号序列文字带标题带副标题"
            },
            {
              value: "5",
              label: "无编号序列文字无标题"
            }
          ]
        },
        {
          value: "5",
          label: "跳转",
          children: [
            {
              value: "0",
              label: "课程跳转"
            }
          ]
        }
      ],

      oldDragDom: "", // 保存旧节点在触发新的 拖动时候恢复此节点的样式
      dragOption: {
        disabled: false
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    closeBlock() {
      this.$emit("closeSelf", this.selfIndex);
    },
    editBlock() {
      this.$emit("editSelf", this.selfIndex);
    },
    addNewElement() {
      if (this.blockId) {
        this.$emit("addElement", 0, this.AddNewElementType, this.blockId);
      } else {
        this.$emit("addElement", this.selfIndex, this.AddNewElementType);
      }
    },
    editElementFunc(obj) {
      this.$emit("editElement", obj);
    },
    deleteElementFunc(obj) {
      this.$emit("deleteElement", obj);
    },
    changeTypeOfElement(obj) {
      this.$emit("changeType", obj);
    },
    // 拖动时候回调
    onStartCallback(evt) {
      // 如果 当前节点存在 则恢复原样
      if (this.oldDragDom) {
        this.oldDragDom.style.backgroundColor = "";
        this.oldDragDom.style.boxShadow = "";
      }
      // 高亮 凸显被拖动的element
      evt.item.style.transform = "rotate(2deg)";
      evt.item.style.backgroundColor = "rgba(150, 208, 208, 0.09)";
      evt.item.style.boxShadow = "5px 5px 2px rgba(200, 190, 190, 0.76)";
    },
    // 拖动时候回调(拖动时改变样式 高亮)
    onMoveCallback(evt) {
      evt.dragged.style.transform = "rotate(2deg)";
      evt.dragged.style.backgroundColor = "rgba(150, 208, 208, 0.09)";
      evt.dragged.style.boxShadow = "5px 5px 2px rgba(200, 190, 190, 0.76)";
    },
    // 拖动结束之后的回调
    onMoveEndCallback(evt) {
      // 结束之后保存顺序
      this.submitElementSequence();
      // 拖动之前索引处的 element 恢复样式
      evt.target.children[evt.oldIndex].style.transform = "";
      evt.target.children[evt.oldIndex].style.backgroundColor = "";
      evt.target.children[evt.oldIndex].style.boxShadow = "";
      // 拖动之后索引处的 element 改变样式 凸显
      evt.target.children[evt.newIndex].style.backgroundColor =
        "rgba(100, 208, 208, 0.2)";
      evt.target.children[evt.newIndex].style.boxShadow =
        "5px 5px 2px rgba(200, 190, 190, 0.76)";
      this.oldDragDom = evt.target.children[evt.newIndex];
    },
    // 查看图片
    checkMaterial(item) {
      window.open(item.parsed.url);
    },
    // 点击播放
    clickToPlay(obj) {
      this.$emit("playAV", obj);
    },
    skipToLesson(obj) {
      let href =
        window.location.href.slice(
          0,
          window.location.href.indexOf("lessonDetails")
        ) +
        "lessonDetails/" +
        obj.parsed.lessonId;
      window.open(href);
    },
    submitElementSequence() {
      let parameter = {
        element_ids: "",
        block_id: ""
      };
      this.blockInfo.forEach(element => {
        parameter.element_ids += element.entity.id + ",";
        parameter.block_id = element.entity.blockId;
      });
      updateSequenceElementInBlock(parameter).then(res => {
        if (res.data.success) {
          this.$message({
            title: "成功",
            message: "操作成功",
            type: "success",
            duration: 1500
          });
        } else {
          this.$notify({
            title: "失败",
            message: res.data.msg,
            type: "error",
            offset: 45
          });
        }
      });
    }
  },
  filters: {
    // 关于时间转换的俩东西
    formatTime(date) {
      if (date === undefined) {
        return;
      }
      if (date === 0) {
        return "/";
      }
      return util.formatDate.format(new Date(date), "yyyy/MM/dd   hh:mm:ss");
    },
    formatContentStyleType(type) {
      switch (type) {
        case 0:
          return "无气泡文字";
          break;
        case 1:
          return "气泡文字";
          break;
        case 2:
          return "有编号序列文字无标题";
          break;
        case 3:
          return "有编号序列文字带标题不加粗";
          break;
        case 4:
          return "有编号序列文字带标题加粗";
          break;
        case 5:
          return "无编号序列文字无标题";
          break;
      }
    },
    formatContentType(type) {
      switch (type) {
        case 0:
          return "图片";
          break;
        case 1:
          return "视频";
          break;
        case 2:
          return "音频";
          break;
        case 3:
          return "链接";
          break;
        case 4:
          return "文字";
          break;
        case 5:
          return "跳转";
          break;
      }
    },
    ReplaceSeperator(mobiles) {
      var i;
      var str = "";
      var result;
      var c;
      for (i = 0; i < mobiles.length; i++) {
        c = mobiles.substr(i, 1);
        if (c == "\r" || c == "\n") {
          str += "\n";
        } else {
          str = str + c;
        }
      }
      result = str.split("\n");
      return result;
    }
  },
  watch: {
    blockInfo: {
      handler(newVal, oldVal) {},
      deep: true
    },
    isDrag: {
      handler(newVal, oldVal) {
        if (newVal) {
          this.dragOption.disabled = false;
        } else {
          this.dragOption.disabled = true;
        }
      },
      deep: true
    }
  },
  created() {}
};
</script>

<style lang='less' scoped>
@titleHeight: 36px;
.content {
  position: relative;
  .detailed {
    padding: 20px 0;
    overflow: hidden;
    .elementCard {
      margin: 0 10px 15px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #d1dbe5;
      border-radius: 3px;
      margin: 8px 8px 8px 28px;
      padding: 0 0 0 10px;
      box-shadow: 0 2px 0 #d1dbe5;
      align-items: center;
      .itemContent {
        width: 48%;
        .elementContent {
          min-height: 100px;
          border: 1px solid #d1dbe5;
          border-radius: 4px;
          padding: 18px;
          box-shadow: 0 0 3px #666;
          max-height: 100px;
          overflow-y: scroll;
          width: 100%;
        }
        .elementContentMaterial {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          flex-direction: column;
          align-items: center;
          .image {
            height: 98px;
            width: auto;
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
      .itemEntity {
        width: 44%;
        padding: 8px;
        p {
          span {
            color: #99a9bf;
          }
        }
      }
    }
  }
  .footerButton {
    border-top: 1px solid #666;
    min-height: 75px;
    .addNew {
      position: absolute;
      bottom: 20px;
      left: 25px;
    }
    .el-button-group {
      position: absolute;
      bottom: 20px;
      right: 44%;
    }
  }
}
.clearfix:after,
.clearfix:before {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
div {
}
</style>
