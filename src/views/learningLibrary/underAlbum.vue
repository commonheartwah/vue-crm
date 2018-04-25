<template lang="html">
    <div class="wrapper">
        <section class="ConfMain">
            <el-card class="box-card container">
                <div slot="header" class="clearfix">
                  <section style="ine-height: 36px;font-size: 20px">
                      <p>{{ 'ID: ' + this.currentAlbum.id }}</p>
                      <p>{{ '中文标题: ' + this.currentAlbum.title }}</p>
                      <p>{{ '英文标题: ' + this.currentAlbum.englishTitle  }}</p>
                  </section>
                    <span style="line-height: 36px;font-size: 20px" class="currentType">所属类别: {{ currentType | transformType }}</span>
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
                                <p>{{ 'ID: ' + item.id }}</p>
                                <p>{{ '中文标题: ' + item.title }}</p>
                                <p>{{ '英文标题: ' + item.englishTitle }}</p>
                            </section>
                            <el-button-group>
                                <el-button type="info" size="small" icon="information" @click="enterInDetailPage(item.id)"></el-button>
                                <el-button type="danger" size="small" icon="delete" @click="removeThisOne(item.id)"></el-button>
                            </el-button-group>
                        </div>
                      </el-card>
                    </draggable>
                </section>

                <section class="unitExist" v-loading="unitLoading" v-else>
                    <h4 class="text">当前类型下没有添加资料</h4>
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
  // 更新专辑下的文档
  updateAlbumDocs,
  // 获取专辑列表
  getAlbumList
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
      currentType: '0',
      // 选择文档项的 加载 与 选项
      selectDocLoading: false,
      selectDocOptions: [],
      // 存储当前搜索到的document对象
      documents: "",
      // 存储当前所有的id
      document_ids: '',
      // 存储当前专辑的信息
      currentAlbum: ''
    }
  },
  methods: {
    // 请求数据 通过路由id查找专辑下的文档信息
    loadData() {
      // 初始化的时候给currentType 赋值
      this.currentType = this.$route.query.type + '';

      this.value = [];
      let str = [];
      // 通过id获取专辑
      getAlbumList({
        id: this.$route.query.id
      }).then((res) => {
        if (res.data.success) {
          this.currentAlbum = res.data.data.items[0].entity;
          if (res.data.data.items[0].conf.documents) {
            this.value = res.data.data.items[0].conf.documents;
            this.unitConf = true;
            // 全部id
            this.value.map(item => {
              str.push(item.id)
            })
            this.document_ids = str.join(',');
          }
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
      this.$router.push({
        path: '/addNewLearnLib',
        query: {
          id: id
        }
      })
    },
    // 从配置数组中删除某个
    removeThisOne(id) {
      this.$confirm('确认删除吗?', '提示', {})
        .then(() => {
          let tempArr = [];
          this.value.forEach((item, index) => {
            if (item.id == id) {
              this.value.splice(index, 1);
            }
          })
          this.value.forEach((item, index) => {
            tempArr.push(item.id)
          })
          let para = {
            id: this.$route.query.id,
            document_ids: tempArr.join(',')
          }
          updateAlbumDocs(para).then((res) => {
            if (res.data.success) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.loadData();
            }
          })

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
            id: this.documents.id,
            title: this.documents.title,
            englishTitle: this.documents.englishTitle
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
        tempArr.push(item.id);
      })
      let para = {
        id: this.$route.query.id,
        document_ids: tempArr.join(',')
      }
      // console.log(para);
      updateAlbumDocs(para).then((res) => {
        // console.log(res);
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

    },
  },
  filters: {
    // 转换状态(数字和文字)
    transformType(type) {
      switch (type) {
        case '0':
          return '单词专辑';
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
</style>
