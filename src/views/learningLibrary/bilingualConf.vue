<template lang="html">
  <div class="wrapper">
    <el-col :span='24' style='padding-bottom: 10px;' class='toolbar'>
      <!-- <el-dropdown split-button type="primary" @command="handleAddByType">
        初始化配置
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="0">单词</el-dropdown-item>
          <el-dropdown-item command="1">儿歌循环听</el-dropdown-item>
          <el-dropdown-item command="2">双语电台</el-dropdown-item>
          <el-dropdown-item command="3">双语动画片</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-dropdown split-button @command="handleGetDocByType">
        查看文档类配置
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="1">儿歌循环听</el-dropdown-item>
          <el-dropdown-item command="2">双语电台</el-dropdown-item>
          <el-dropdown-item command="0">单词</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown split-button @command="handleGetAlbumByType">
        查看专辑类配置
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="3">英文动画片</el-dropdown-item>
          <el-dropdown-item command="0">单词</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
    <section class="ConfMain">
      <el-card class="box-card container">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px;font-size: 20px" class="currentType">{{ currentType | transformType }}</span>
          <el-button-group style="float: right;margin: 2px 0 0 10px;">
            <el-button type="info" size="small" icon="plus" @click="addToDocuments()"></el-button>
            <el-button type="success" size="small" icon="check" @click="storeUnit()"></el-button>
          </el-button-group>
          <div style="float: right;">
            <el-select
              v-model="documents"
              placeholder="请输入名称或ID查询"
              filterable
              clearable
              remote
              :remote-method="selectDocRemoteMethod"
              :loading='selectDocLoading'
              style="width: 350px;"
            >
              <el-option
                v-for="item in selectDocOptions"
                :key="item"
                :label="'（' + item.id + '）' + item.title + '-' + item.englishTitle"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <section class="content" v-loading="unitLoading" v-if="unitConf">
          <draggable draggable :list="value">
            <el-card class="box-card piece" v-for="(item, index) in value" :key='item'>
              <div class="text item">
                <section>
                  <p>{{ 'ID: ' + item.entity.id }}</p>
                  <p>{{ '中文标题: ' + item.entity.title }}</p>
                  <p>{{ '英文标题: ' + item.entity.englishTitle }}</p>
                </section>
                <el-button-group>
                  <el-button type="info" size="small" icon="information" @click="enterInDetailPage(item.entity.id)"></el-button>
                  <el-button type="danger" size="small" icon="delete" @click="removeThisOne(item.entity.id)"></el-button>
                </el-button-group>
              </div>
            </el-card>
          </draggable>
        </section>
        <section class="unitExist" v-loading="unitLoading" v-else>
          <h4 class="text">当前类型下没有双语配置</h4>
        </section>
      </el-card>
    </section>
  </div>
</template>

<script>
// axios
import {
  // 获取learningList 列表
  getLearLibList,
  // 双语配置相关
  getBilingualConf,
  addBilingualConf,
  updateBiligualConf,
  // 专辑双语配置相关
  getAlbumForBilConf,
  updateAlbumForBilConf,
  // 获取所有的专辑列表
  getAlbumList,
  // 通过id获取album下的document
  getAlbumByIdForBilConf
} from '../../api/api'
// 引入 draggable
import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },
  data() {
    return {
      unitLoading: false,
      unitConf: false,
      value: [],
      currentType: '3',
      // 选择文档项的 加载 与 选项
      selectDocLoading: false,
      selectDocOptions: [],
      // 存储当前搜索到的document对象
      documents: "",
      // 存储当前所有的id
      document_ids: '',
      // 判断是否是专辑类型的
      isAlbum: true
    }
  },
  methods: {
    // 请求数据 首次与加载单词的配置
    loadData() {
      let para = {}
      para['type'] = this.currentType;
      this.value = [];
      let str = [];
      if (this.currentType == "3") {
        // 首次加载英文动画片
        getAlbumForBilConf(para).then((res) => {
          if (res.data.success) {
            this.value = res.data.data.items;
            this.unitConf = true;
            // 全部id
            res.data.data.items.map(item => {
              str.push(item.entity.id)
            })
            this.document_ids = str.join(',');
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error'
            })
            this.value = [];
            this.unitConf = false;
          }
        })
      } else {
        getBilingualConf(para).then((res) => {
          if (res.data.success) {
            this.value = res.data.data.items;
            this.unitConf = true;
            // 全部id
            res.data.data.items.map(item => {
              str.push(item.entity.id)
            })
            this.document_ids = str.join(',');
          } else {
            this.$notify({
              title: '失败',
              message: res.data.msg,
              type: 'error'
            })
            this.value = [];
            this.unitConf = false;
          }
        })
      }

    },
    // 添加配置(只在系统初始化配置)
    handleAddByType(command) {
      addBilingualConf({
        type: command
      }).then((res) => {
        if (res.data.success) {
          this.$notify({
            title: '成功',
            message: '初始化双语配置成功',
            type: 'success'
          })
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
        }
      })
    },
    /**
     * 通过类型获取双语 文档 配置
     */
    // 通过类型获取双语配置
    handleGetDocByType(command) {
      this.isAlbum = false;
      this.currentType = command;
      this.value = [];
      let str = [];
      getBilingualConf({
        type: command
      }).then((res) => {
        if (res.data.success) {
          this.value = res.data.data.items;
          this.unitConf = true;
          // 全部id
          res.data.data.items.map(item => {
            str.push(item.entity.id)
          })
          this.document_ids = str.join(',');
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
          this.value = [];
          this.unitConf = false;
        }
      })
    },
    /**
     * 通过类型获取双语 专辑 配置 
     */
    handleGetAlbumByType(command) {
      this.isAlbum = true;
      this.currentType = command;
      this.value = [];
      let str = [];
      getAlbumForBilConf({
        type: command
      }).then((res) => {
        if (res.data.success) {
          this.value = res.data.data.items;
          this.unitConf = true;
          // 全部id
          res.data.data.items.map(item => {
            str.push(item.entity.id)
          })
          this.document_ids = str.join(',');
        } else {
          this.$notify({
            title: '失败',
            message: res.data.msg,
            type: 'error'
          })
          this.value = [];
          this.unitConf = false;
        }
      })
    },
    // 查看详情
    enterInDetailPage(id) {
      if (this.isAlbum) {
        this.$router.push({
          name: '专辑列表',
          params: {
            id: id
          }
        })
      } else {
        this.$router.push({
          path: '/addNewLearnLib',
          query: {
            id: id
          }
        })
      }
    },
    // 从配置数组中删除某个
    removeThisOne(id) {
      this.$confirm('确认删除吗?', '提示', {})
        .then(() => {
          let tempArr = [];
          this.value.forEach((item, index) => {
            if (item.entity.id == id) {
              this.value.splice(index, 1);
            }
          })
          this.value.forEach((item, index) => {
            tempArr.push(item.entity.id)
          })
          // 判断如果是专辑类型
          if (this.isAlbum) {
            let para = {
              type: this.currentType,
              album_ids: tempArr.join(',')
            }
            updateAlbumForBilConf(para).then((res) => {
              if (res.data.success) {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success'
                })
                this.loadData();
              }
            })
          } else {
            // 判断非专辑类型
            let para = {
              type: this.currentType,
              document_ids: tempArr.join(',')
            }
            updateBiligualConf(para).then((res) => {
              if (res.data.success) {
                this.$notify({
                  title: '成功',
                  message: '删除成功',
                  type: 'success'
                })
                this.loadData();
              }
            })
          }
        })
        .catch(() => {
          this.$notify({
            title: '提示',
            type: 'info',
            message: '取消删除'
          })
        })
    },
    // 选择文档的方法 判断是选择文档还是选择专辑
    selectDocRemoteMethod(query) {
      if (query !== '') {
        this.selectDocLoading = true;
        let temp = Number(query);
        let parameter = {}
        temp ? parameter['id'] = temp : parameter['title'] = query;
        this.currentType ? parameter['type'] = this.currentType : '';
        if (this.isAlbum) {
          getAlbumList(parameter).then((res) => {
            if (res.data.success && res.data.data.items) {
              this.selectDocOptions = res.data.data.items.map((item) => {
                let tempObj = {
                  id: item.entity.id,
                  title: item.entity.title,
                  englishTitle: item.entity.englishTitle
                }
                return tempObj;
              });
            }
            this.selectDocLoading = false;
          })
        } else {
          getLearLibList(parameter).then((res) => {
            if (res.data.success && res.data.data.items) {
              this.selectDocOptions = res.data.data.items.map((item) => {
                let tempObj = {
                  id: item.entity.id,
                  title: item.entity.title,
                  englishTitle: item.entity.englishTitle
                }
                return tempObj;
              });
            }
            this.selectDocLoading = false;
          });
        }
      } else {
        this.selectDocOptions = [];
      };
    },
    // 添加到文档ID中
    addToDocuments() {
      let array = this.document_ids.split(',');
      if (this.documents) {
        if (this.documents.id > 0) {
          for (let i = 0; i < array.length; i++) {
            if (parseInt(array[i]) == parseInt(this.documents.id)) {
              this.$notify({
                title: '错误',
                message: '已经存在',
                type: 'error'
              })
              return;
            }
          }
          array.push(this.documents.id + '');
          let tempArr = array.join(',');
          this.document_ids = tempArr;
          let tempDoc = {
            entity: {
              id: this.documents.id,
              title: this.documents.title,
              englishTitle: this.documents.englishTitle
            }
          }

          this.value.push(tempDoc);
          this.unitConf = true;
          this.storeUnit();
        }
      }
    },
    // 保存配置
    storeUnit() {
      let tempArr = [];
      this.value.forEach((item) => {
        tempArr.push(item.entity.id);
      })
      if (this.isAlbum) {
        let para = {
          type: this.currentType,
          album_ids: tempArr.join(',')
        }
        updateAlbumForBilConf(para).then((res) => {
          if (res.data.success) {
            this.$notify({
              title: '成功',
              message: '操作成功',
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
      } else {
        let para = {
          type: this.currentType,
          document_ids: tempArr.join(',')
        }
        updateBiligualConf(para).then((res) => {
          if (res.data.success) {
            this.$notify({
              title: '成功',
              message: '操作成功',
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
      }
    },
  },
  filters: {
    // 转换状态(数字和文字)
    transformType(type) {
      switch (type) {
        case '0':
          return '单词';
          break;
        case '1':
          return '儿歌循环听';
          break;
        case '2':
          return '双语电台';
          break;
        case '3':
          return '英文动画片';
          break;
      }
    }
  },
  mounted() {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  width: 100%;
  .ConfMain {
    width: 100%;
    display: flex;
    justify-content: center;
    .container {
      width: 100%;
      .content {
        width: 100%;
        .piece {
          width: 100%;
          .item {
            font-size: 16px;
            width: 100%;
            display: flex;
            align-items: center;
            section {
              width: 90%;
              display: flex;
              justify-content: space-between;
              align-items: center;
              p {
                width: 40%;
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                &:nth-of-type(1) {
                  width: 10%;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
