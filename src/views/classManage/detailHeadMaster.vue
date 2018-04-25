<template lang="html">
  <div class='box'>
    <h2  class='title'>基础数据</h2>
    <p class='pb'><span class='titleDetial'>后台用户Id：</span>{{arrEntity.opUserId}}</p>
    <p class='pb'><span  class='titleDetial'>app用户Id:</span>{{arrEntity.appUserId}}</p>
    <p class='pb'><span  class='titleDetial'>创建时间:</span>{{arrEntity.ct | formatTime}}</p>
    
    <p class='pb'><span  class='titleDetial'>修改时间:</span>{{arrEntity.ut | formatTime}}</p>
    <p class='pb'><span  class='titleDetial'>状态:</span>{{arrEntity.stat | formatStat}}</p>
    <h2>管理班级数据</h2>
    <ul  v-for="item in arrConf" class='box2'>
      <li >
        <span class='titleDetial'>班级ID：</span>{{item.groupId}}
        <span class='titleDetial'>班级名称：</span>{{item.groupName}}
      </li>
    </ul>
  </div>
</template>

<script>
// axios
import { getGroupTeacherList } from "../../api/api";
// 引入工具包
import util from "../../common/js/util";

export default {
  data() {
    return {
      arr: [],
      arrConf: [],
      arrEntity: []
    };
  },
  methods: {
    loadList() {
      this.basePara = parseInt(this.$route.query.promoter_group_id);

      getGroupTeacherList()
        .then(res => {
          if (res.data.success) {
            let examList = res.data.data.items;
            let arr = [];
            if (examList && examList.length) {
              examList.map((item, index) => {
                if (item.entity.id == this.basePara) {
                  arr.push(examList[index]);
                }
                examList.map((item, index) => {
                item.entity.stat == 1 ? "在职" : "离职";
              });
              });
            }
            this.arr = arr;
            this.arrConf = arr[0].conf.groupList;
            this.arrEntity = arr[0].entity;

          } else {
            this.$message.error(res.data.msg || "未知错误，请联系管理员");
          }
        })
        .catch(err => {
          this.errorFunction(err);
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
        return util.formatDate.format(
          new Date(date),
          "yyyy/MM/dd   hh:mm:ss"
        );
      },
      formatStat(stat) {
        if (stat == 0) {
          return  '离职';
        }
        if (stat === 1) {
          return "在职";
        }
      }
    },
  computed: {},
  mounted() {
    this.loadList();
  }
};
</script>

<style lang="less">
.box {
  margin-left: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  // padding-left: 20px;
  padding: 10px 20px 0 20px;
  border-radius: 10px;
  box-shadow: 5px 5px 5px #888888;
}
.box2 {
  border-top: 1px solid #ccc;
  margin-top: 5px;
}
.pb {
  border-top: 1px solid #ccc;
}
.title {
  margin: 5px 0;
}
.titleDetial {
  display: inline-block;
  width: 100px;
  height: 50px;
  line-height: 50px;
  font-size: 16px;
  margin: 5px 20px;
  // border-top:1px solid #ccc;
}
</style>
