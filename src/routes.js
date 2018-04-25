// 登录注册404
import Login from './views/Login'
import NotFound from './views/404'
import Home from './views/Home'

// 课程管理
import AddLessonToUnit from './views/courseManage/addLessonToUnit'
import AddUnitToCourse from './views/courseManage/addUnitToCourse'
import LessonDetails from './views/courseManage/LessonDetails'
import LessonList from './views/courseManage/LessonList.vue'
import CourseList from './views/courseManage/CourseList.vue'
import TrainingCamp from './views/courseManage/TrainingCamp.vue'

// 班级管理
import OnLineClassList from './views/classManage/onLineClassList.vue'
import MsgManage from './views/classManage/msgManage.vue'
import MsgSend from './views/classManage/msgSend.vue'
import HeadMasterManage from './views/classManage/headMasterManage.vue'
import GroupList from './views/classManage/groupList.vue'
import MsgConfig from './views/classManage/msgConfig.vue'
import DetailHeadMaster from './views/classManage/detailHeadMaster.vue'

// 后台管理
import BackMemberList from './views/backManage/BackMemberList'
import BackRoleList from './views/backManage/BackRoleList'
import RolesPerm from './views/backManage/RolesPerm'

// 教师管理
import TeacherManage from './views/teacherManage/TeacherManage'

// 商品管理
import SpuManage from './views/merchandiseManage/SpuManage'
import SkuManage from './views/merchandiseManage/SkuManage'
import ChannelManage from './views/merchandiseManage/ChannelManage'
import ChannelCodeManage from './views/merchandiseManage/ChannelCodeManage'

// 素材管理
import PicMaterial from './views/materialManage/PicMaterial'
import VideoMaterial from './views/materialManage/VideoMaterial'
import AudioMaterial from './views/materialManage/AudioMaterial'
import AVUpload from './views/materialManage/AVUpload'
import AVUpdate from './views/materialManage/AVUpdate'
import AudioUpdate from './views/materialManage/AudioUpdate'
import BatchUpload from './views/materialManage/BatchUpload'
import ReturnPicUrl from './views/materialManage/ReturnPicUrl'
import AvOneUpload from './views/materialManage/AvOneUpload'
// 招募计划
import PlanList from './views/planManage/PlanList'
import PlanMembersList from './views/planManage/PlanMembersList'
import PlanGroupsList from './views/planManage/PlanGroupsList'
import PlanCalendar from './views/planManage/PlanCalendar'
import PlanHoliday from './views/planManage/PlanHoliday'
import PlanPresentUnit from './views/planManage/PlanPresentUnit'
import class_user_wx_list from './views/planManage/class_user_wx_list'

// Kv配置
import KvList from './views/KvManage/KvList'
import HolidayConf from './views/KvManage/Holiday'
import ScreenConf from './views/KvManage/Screen'
import VersionConf from './views/KvManage/Version'
import PushNotify from './views/KvManage/PushNotify'
import ConfPageList from './views/KvManage/ConfPageList'
import ConfPageDetail from './views/KvManage/ConfPageDetail'
import Feedback from './views/KvManage/feedback'

// Goods
import PrintgoodsList from './views/goodsManage/PrintgoodsList'
import GoodsList from './views/goodsManage/GoodsList'
import ActivegoodsList from './views/goodsManage/ActivegoodsList'

// appusers
import AppMemberList from './views/appManage/AppMemberList'
import AppCourseList from './views/appManage/AppCourseList'
import Generateposter from './views/appManage/Generateposter'
import Billlist from './views/appManage/Billlist'

// order
import OrderList from './views/orderManage/OrderList'

// learningLibrary
import LearningLibrary from './views/learningLibrary/LearningLibrary'
import AddNewLearnLib from './views/learningLibrary/addNewLearnLib'
import BilingualConf from './views/learningLibrary/bilingualConf'
import Album from './views/learningLibrary/album'
import UnderAlbum from './views/learningLibrary/underAlbum'
// editor
import editor from './views/aboutEditor/editor'
import categoryManage from './views/aboutEditor/categoryManage'
import articleManage from './views/aboutEditor/articleManage'

// Template
import Template from './views/evaluation/Template'
import TemplateInstance from './views/evaluation/TemplateInstance'
import AddTemplateInstance from './views/evaluation/AddTemplateInstance'
import TempMeta from './components/evaluation/temp_meta'
import MetaData from './components/evaluation/MetaData'
// promoter
import ApplyList from './views/promoterManage/ApplyList'
import PromoterList from './views/promoterManage/PromoterList'
import PromoterGroupList from './views/promoterManage/PromoterGroup'
import ProMemberList from './views/promoterManage/ProMemberList'
import PromoterTeam from './views/promoterManage/PromoterTeam'
import PromoterFamilyList from './views/promoterManage/PromoterFamily'
import DateRangeList from './views/promoterManage/DateRange'
import PromoterRange from './views/promoterManage/PromoterRange'
import SaleRange from './views/promoterManage/SaleRange'
import ProRangeUser from './views/promoterManage/ProRangeUser'
import DateNodeList from './views/promoterManage/DateNodeList'
import ProOrderList from './views/promoterManage/ProOrderList'
import PromoterWx from './views/promoterManage/promoterWx'
import GroupTarget from './views/promoterManage/GroupTarget'
import pro_sale_class from './views/promoterManage/pro_sale_class'
import pro_wiki from './views/promoterManage/pro_wiki'
import pro_wiki_page from './views/promoterManage/pro_wiki_page'
import pro_train_wiki_page from './views/promoterManage/pro_train_wiki_page'
import pro_bind_list from './views/promoterManage/pro_bind_list'

//评测管理
import Examination from './views/examManage/Examination'
import QuestionBank from './views/examManage/questionBank'
import ExamSuite from './views/examManage/examSuite'
import CourseExam from './views/examManage/courseExam'
import UserResults from './views/examManage/userResults'

// 词句库
import Word from './views/word-sentence-library/word'
import Phrase from './views/word-sentence-library/phrase'
import Sentence from './views/word-sentence-library/sentence'
import SentencePattern from './views/word-sentence-library/sentence-pattern'

// 短连接
import ShortUrl from './views/url/short_url'
// 统计相关
import ProSale from './views/statistics/ProSale'
import ProCourse from './views/statistics/ProCourse'
import ProRecruit from './views/statistics/ProRecruit'
import ProPromoter from './views/statistics/ProPromoter'
import ProClassic from './views/statistics/ProClassic'
import statManEnroll from './views/statistics/statManEnroll'
import statManSale from './views/statistics/statManSale'
import salePersonalDaily from './views/statistics/salePersonalDaily'
import saleTopTenDaily from './views/statistics/saleTopTenDaily'
import saleZeroDaily from './views/statistics/saleZeroDaily'
import PromoterEnroll from './views/statistics/promoterEnroll'
import sameRangeSales from './views/statistics/sameRangeSales'
import companyTime from './views/statistics/companyTime'
import familyRange from './views/statistics/familyRange'
import groupPerDetail from './views/statistics/groupPerDetail'
import familyTimeData from './views/statistics/familyTimeData'
import groPerTime from './views/statistics/groPerTime'

// let or const 影响
const routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
      path: '/',
      component: Home,
      name: '词句库',
      iconCls: 'fa fa-laptop fa-fw',
      children: [
        { path: '/word', component: Word, name: '单词' },
        { path: '/phrase', component: Phrase, name: '短语' },
        { path: '/sentence', component: Sentence, name: '句子' },
        { path: '/sentence-pattern', component: SentencePattern, name: '句型' }
      ]
    },
    {
        path: '/',
        component: Home,
        name: '课程管理',
        iconCls: 'fa fa-book fa-fw',
        children: [
            { path: '/AddUnitToCourse/:courseId', name:'配置单元', component: AddUnitToCourse, hidden: true},
            { path: '/lessonDetails/:lessonId', name:'课节详情', component: LessonDetails , hidden: true},
            { path: '/CourseList', component: CourseList, name: '课程列表' },
            { path: '/LessonList', component: LessonList, name: '课节列表' },
            { path: '/TrainingCamp', component: TrainingCamp, name: '集训营管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '班级管理',
        iconCls: 'fa fa-envelope fa-fw',
        children: [
            { path: '/OnLineClassList', component: OnLineClassList, name: '在线班级列表' },
            { path: '/MsgManage', component: MsgManage, name: '消息管理' },
            { path: '/MsgSend', component: MsgSend, name: '消息发送' },
            { path: '/HeadMasterManage', component: HeadMasterManage, name: '班主任管理' },
            { path: '/GroupList', component: GroupList, name: '班级组成员详情' , hidden: true},
            { path: '/DetailHeadMaster', component: DetailHeadMaster, name: '班主任管理列表详情页' , hidden: true},
            { path: '/MsgConfig', component: MsgConfig, name: '消息配置' , hidden: true},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '素材管理',
        iconCls: 'el-icon-picture fa-fw',
        children: [
            { path: '/material', component: PicMaterial, name: '图片列表' },
            { path: '/videoMaterial', component: VideoMaterial, name: '视频列表' },
            { path: '/audioMaterial', component: AudioMaterial, name: '音频列表' },
            { path: '/avUpload/:type', component: AVUpload, name: '视频上传', hidden: true },
            { path: '/avUpdate', component: AVUpdate, name: '音视频更新', hidden: true },
            { path: '/audioUpdate', component: AudioUpdate, name: '音频更新', hidden: true },
            { path: '/batchUpload/:type', component: BatchUpload, name: '批量上传', hidden: true },
            { path: '/avOneUpload', component: AvOneUpload, name: '单个音视频上传', hidden: true },
            { path: '/returnPicUrl', component: ReturnPicUrl, name: '直接上传' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '教师管理',
        iconCls: 'fa fa-mortar-board fa-fw',
        children: [
            { path: '/TeacherManage', component: TeacherManage, name: '教师列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '评测管理',
        iconCls: 'fa fa-edit fa-fw',
        children: [
            { path: '/QuestionBank', component: QuestionBank, name: '题库管理'},
            { path: '/Examination', component: Examination, name: '试卷管理' },
            { path: '/ExamSuite', component: ExamSuite, name: '试卷集管理'},
            { path: '/CourseExam', component: CourseExam, name: '试卷配置'},
            { path: '/UserResults', component: UserResults, name: '用户成绩管理', hidden: true},
        ]
    },
    {
        path: '/',
        component: Home,
        name: '招募管理',
        iconCls: 'fa fa-mail-forward fa-fw',
        children: [
            { path: '/planList', component: PlanList, name: '招募列表' },
            { path: '/planMembersList', component: PlanMembersList, name: '招募成员列表', hidden: true},
            { path: '/planGroupsList', component: PlanGroupsList, name: '招募群组列表', hidden: true},
            { path: '/planCalendar', component: PlanCalendar, name: '招募课表日历', hidden: true },
            { path: '/planHoliday', component: PlanHoliday, name: '课表停课安排', hidden: true },
            { path: '/planPresentUnit', component: PlanPresentUnit, name: '赠课详情', hidden: true },
            { path: '/class_user_wx_list', component: class_user_wx_list, name: '精品课用户微信' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '推广人',
        iconCls: 'fa fa-user-o fa-fw',
        children: [
            { path: '/ApplyList', component: ApplyList, name: '申请列表' },
            { path: '/PromoterList', component: PromoterList, name: '推广人列表'},
            { path: '/PromoterWx', component: PromoterWx, name: '小秘书列表'},
            { path: '/PromoterGroupList', component: PromoterGroupList, name: '推广人组' },
            { path: '/pro_group_target', component: GroupTarget, name: '推广人组目标' },
            { path: '/PromoterFamilyList', component: PromoterFamilyList, name: '推广人家族' },
            { path: '/DateRangeList', component: DateRangeList, name: '日期配置' },
            { path: '/DateNodeList', component: DateNodeList, name: '日期提醒点' },
            { path: '/PromoterRange', component: PromoterRange, name: '招生期数据' },
            { path: '/SaleRange', component: SaleRange, name: '销售期数据' },
            { path: '/ProOrderList', component: ProOrderList, name: '推广人订单管理' },
            { path: '/pro_sale_class', component: pro_sale_class, name: '销售精品课' },
            { path: '/pro_wiki', component: pro_wiki, name: '知识库列表' },
            { path: '/pro_bind_list', component: pro_bind_list, name: '推广人绑定' },
            { path: '/pro_wiki_page', component: pro_wiki_page, name: '知识库详情', hidden: true },
            { path: '/pro_train_wiki_page', component: pro_train_wiki_page, name: '集训营知识库详情', hidden: true },
            { path: '/ProRangeUser', component: ProRangeUser, name: '招生成员列表', hidden: true},
            { path: '/ProMemberList', component: ProMemberList, name: '推广人成员列表', hidden: true },
            { path: '/PromoterTeam', component: PromoterTeam, name: '推广人小队列表', hidden: true }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '商品管理',
        iconCls: 'fa fa-tasks fa-fw',
        children: [
            { path: '/SpuManage', component: SpuManage, name: '商品列表' },
            { path: '/ChannelManage', component: ChannelManage, name: '渠道管理'},
            { path: '/ChannelCodeManage', component: ChannelCodeManage, name: '渠道配置'},
            { path: '/SkuManage/:spuId', component: SkuManage, name: '商品详情', hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '卡片管理',
        iconCls: 'fa fa-credit-card fa-fw',
        children: [
            { path: '/printgoodsList', component: PrintgoodsList, name: '备选卡片' },
            { path: '/goodsList', component: GoodsList, name: '出厂卡片' },
            { path: '/activegoodsList', component: ActivegoodsList, name: '激活卡片' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '订单管理',
        iconCls: 'fa fa-credit-card-alt fa-fw',
        children: [
            { path: '/orderList', component: OrderList, name: '订单列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计管理',
        iconCls: 'fa fa-table fa-fw',
        children: [
            { path: '/ProClassic', component: ProClassic, name: '精品课统计' },
            { path: '/ProSale', component: ProSale, name: '销售统计' },
            { path: '/ProCourse', component: ProCourse, name: '课程统计' },
            { path: '/ProRecruit', component: ProRecruit, name: '招生统计' },
            { path: '/ProPromoter', component: ProPromoter, name: '推广人统计' },
            { path: '/statManEnroll', component: statManEnroll, name: '招生数据'},
            { path: '/statManSale', component: statManSale, name: '销售数据' },
            { path: '/salePersonalDaily', component: salePersonalDaily, name: '销售个人日报'},
            { path: '/saleTopTenDaily', component: saleTopTenDaily, name: '销售Top10日报'},
            { path: '/saleZeroDaily', component: saleZeroDaily, name: '零销售日报'},
            { path: '/PromoterEnroll', component: PromoterEnroll, name: '个人招生节点数据'},
            { path: '/sameRangeSales', component: sameRangeSales, name: '进度情况表'},
            { path: '/companyTime', component: companyTime, name: '完成情况表'},
            { path: '/familyRange', component: familyRange, name: '家族进度情况表'},
            { path: '/familyTimeData', component: familyTimeData, name: '家族完成情况表'},
            { path: '/groPerTime', component: groPerTime, name: '个人数据', hidden: true},
            { path: '/groupPerDetail', component: groupPerDetail, name: '个人详情', hidden: true}
        ]
    },
    {
        path: '/',
        component: Home,
        name: '运营管理',
        iconCls: 'fa fa-vcard-o fa-fw',
        children: [
            { path: '/appMemberList', component: AppMemberList, name: 'App 用户' },
            { path: '/appCourseList', component: AppCourseList, name: 'App用户课程', hidden: true },
            { path: '/ConfPageList', component: ConfPageList, name: 'App 页面'},
            { path: '/ConfPageDetail/:pageId', component: ConfPageDetail, name: 'App 页面详情', hidden: true},
            { path: '/versionConf', component: VersionConf, name: 'App 版本' },
            { path: '/screenConf', component: ScreenConf, name: '启动画面' },
            { path: '/PushNotify', component: PushNotify, name: '内容推送' },
            { path: '/Feedback', component: Feedback, name: '反馈查询' },
            { path: '/Generateposter', component:Generateposter , name: '海报生成', hidden: true },
            { path: '/Billlist', component:Billlist , name: '海报生成列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '后台管理',
        iconCls: 'fa fa-user-plus fa-fw',
        children: [
            { path: '/backMember', component: BackMemberList, name: '后台用户列表' },
            { path: '/backRole', component: BackRoleList, name: '后台角色列表' },
            { path: '/rolePerm', component: RolesPerm, name: '后台用户权限', hidden: true }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '配置',
        iconCls: 'fa fa-cogs fa-fw',
        children: [
            { path: '/kvList', component: KvList, name: 'KV 配置列表' },
            { path: '/holidayConf', component: HolidayConf, name: '全局假日' },
            { path: '/bilingualConf', component: BilingualConf, name: '双语配置' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '关于栏目',
        iconCls: 'fa fa-edit fa-fw',
        children: [
            { path: '/articleAbout', component: editor, name: '富文本', hidden: true },
            { path: '/categoryManage', component: categoryManage, name: '栏目管理' },
            { path: '/articleManage', component: articleManage, name: '文章管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '学习资料',
        iconCls: 'fa fa-file-text-o fa-fw',
        children: [
            { path: '/learningLibrary', component: LearningLibrary, name: '资料列表' },
            { path: '/album', component: Album, name: '专辑列表' },
            { path: '/addNewLearnLib', component: AddNewLearnLib, name: '增加学习资料', hidden: true },
            { path: '/underAlbum', component: UnderAlbum, name: '专辑资料', hidden: true }
        ]
    },
    {
      path: '/',
      component: Home,
      name: '链接服务',
      iconCls: 'fa fa-link fa-fw',
      children: [{
        path: '/short_url',
        component: ShortUrl,
        name: '短链接'
      }]
    },
    {
      path: '/',
      component: Home,
      name: '模板',
      iconCls: 'fa fa-laptop fa-fw',
      children: [
        { path: '/Template', component: Template, name: '模板列表' },
        { path: '/TemplateInstance', component: TemplateInstance, name: '模板实例列表' },
        { path: '/MetaData', component: MetaData, name: '元数据模板', hidden: true },
        { path: '/AddTemplateInstance', component: AddTemplateInstance, name: '生成实例', hidden: true },
      ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
]
export default routes;
