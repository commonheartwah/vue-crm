import axios from 'axios';
import Qs from 'qs';
let base = '/op'; // nginx配置后的url

// __用户
// 用户登录
export const requestLogin = params => { return axios.post(`${base}/sys/user/login`, Qs.stringify(params)) };
// 请求后台用户列表
export const getBackMemberListPage = params => { return axios.get(`${base}/sys/user/accounts`, { params: params }); };
// 增加后台用户
export const addUser = params => { return axios.post(`${base}/sys/user/add`, Qs.stringify(params)); };
// 修改后台用户
export const editUser = params => { return axios.post(`${base}/sys/user/update`, Qs.stringify(params)); };
// 用户登出
export const requestLogout = () => { return axios.get(`${base}/sys/user/logout`) };
// 修改密码
export const changePassword = params => { return axios.post(`${base}/sys/user/change_password`, Qs.stringify(params)); };

// 用户角色管理
// 查询当前用户的角色
export const requestCurrentRoles = params => { return axios.get(`${base}/sys/user/roles`, { params: params }); };
// 更新当前用户的角色
export const updateRoles = params => { return axios.post(`${base}/sys/user/update_roles`, Qs.stringify(params)); };

// __角色
// 后台角色列表(无分页 不需要参数)
export const getBackRoleList = params => { return axios.get(`${base}/sys/role_perm/roles`, { params: params }); };
// 通过角色id查询角色列表
export const getBackRoleById = params => { return axios.get(`${base}/sys/role_perm/get_role`, { params: params }); };
// 增加角色
export const addRole = params => { return axios.post(`${base}/sys/role_perm/addrole`, Qs.stringify(params)); };
// 修改角色(更新)
export const editRole = params => { return axios.post(`${base}/sys/role_perm/update_role`, Qs.stringify(params)); };
// 获取角色对应的权限
export const getPermsById = params => { return axios.get(`${base}/sys/role_perm/role_perms`, { params: params }); };
// 更新角色对象的权限
export const updatePermsById = params => { return axios.post(`${base}/sys/role_perm/update_role_perms`, Qs.stringify(params)); };

//__Material
// 获取资源列表(图片\视频\音频)
export const getMaterialsList = params => { return axios.get(`${base}/material/list`, { params: params }); };
// 上传图片到资源
export const uploadPicToLib = params => { return axios.post(`${base}/material/upload_image_lib`, Qs.stringify(params)); };
// 上传图片返回url
export const uploadPic = params => { return axios.post(`${base}/material/upload_image`, Qs.stringify(params)); };
// 上传zip包返回url
export const uploadZip = params => { return axios.post(`${base}/material/upload_zip`, Qs.stringify(params)); };
// 更新素材
export const updateMaterial = params => { return axios.post(`${base}/material/update`, Qs.stringify(params)); };
//获取上传七牛的下载URL
export const getDownloadUrl = params => { return axios.post(`${base}/material/get_download_url`, Qs.stringify(params)); };
// 获取上传七牛的token
export const getUploadToken = params => { return axios.post(`${base}/material/get_upload_token`, Qs.stringify(params)); };
// 上传文件成功后向回调接口传值
export const goCallback = params => { return axios.post(`${base}/material/av_upload_callback`, Qs.stringify(params)); };
// 从优酷获取视频
export const getVideoFromYouku = params => { return axios.post(`${base}/material/youku_video`, Qs.stringify(params)); };

//__Plan
// 获取招募计划列表
export const getPlanList = params => { return axios.get(`${base}/plan/list`, { params: params }); };
// 获取指定id的计划
export const getPlanById = params => { return axios.get(`${base}/plan/get`, { params: params }); }
// 新增计划
export const addPlan = params => { return axios.post(`${base}/plan/add`, Qs.stringify(params)); };
// 更新计划
export const editPlan = params => { return axios.post(`${base}/plan/update`, Qs.stringify(params)); };
// 精品课用户微信列表
export const getClassUserWxList = params => { return axios.get(`${base}/class/user/wx/list`, { params: params }); };
// 精品课用户微信删除
export const delClassUserWxList = params => { return axios.post(`${base}/class/user/wx/del`, Qs.stringify(params)); };

// 根据计划id获取指定计划下的成员用户列表
export const getMembersListForPlan = params => { return axios.get(`${base}/plan/list_members`, { params: params }); };
// 当前计划下新增一个/一批计划成员用户
export const addMemberForPlan = params => { return axios.post(`${base}/plan/add_members`, Qs.stringify(params)); };
// 当前计划下删除指定的成员用户
export const removeMemberForPlan = params => { return axios.post(`${base}/plan/del_member`, Qs.stringify(params)); };
// 当前计划下批量删除指定的成员用户
export const batchRemoveMembersForPlan = params => { return axios.post(`${base}/plan/del_members`, Qs.stringify(params)); };
// 提交计划下的停课周期
export const sendStopPeriodForPlan = params => { return axios.post(`${base}/plan/update_holiday_conf`, Qs.stringify(params)); };
// 提交计划下的赠课信息
export const updateUnitForPlan = params => { return axios.post(`${base}/plan/update_plan_units`, Qs.stringify(params)); };
// 招募计划按照区域分班
export const divideGroupForPlan = params => { return axios.post(`${base}/group/brvbar_region`, Qs.stringify(params)); };
//__Group
	// 获取群组列表
	export const getGroupsListForPlan = params => { return axios.get(`${base}/group/list`, { params: params }); };
	// 新增群组
	export const addGroupForPlan = params => { return axios.post(`${base}/group/add`, Qs.stringify(params)); };
	// 更新群组
	export const editGroupForPlan = params => { return axios.post(`${base}/group/update`, Qs.stringify(params)); };
	// 获取制定班级下的班级成员列表
	export const getMembersListForGroup = params => { return axios.get(`${base}/group/list_members`, { params: params }); };
	// 添加成员用户到当前班级中(非批量添加)
	export const addMemberForGroup = params => { return axios.post(`${base}/group/split_member`, Qs.stringify(params)); };
	// 添加成员用户到当前班级中(批量添加)
	export const batchAddMembersForGroup = params => { return axios.post(`${base}/group/split_members`, Qs.stringify(params)); };
	// 从当前班级中删除一个用户
	export const removeMemberForGroup = params => { return axios.post(`${base}/group/remove_member`, Qs.stringify(params)); };
	// 从当前班级中删除一批用户
	export const batchRemoveMembersForGroup = params => { return axios.post(`${base}/group/remove_members`, Qs.stringify(params)); };
	// 根据班级id和名字与电话号码查看是否在班级中
	export const getMemberForGroup = params => { return axios.get(`${base}/group/get_member`, { params: params }); };
	// 给群组下的成员发送模板消息
	export const sendTmplateMsg = params => { return axios.post(`${base}/group/send_tmplate_msg`, Qs.stringify(params)); };
	// 给群组下的成员创建班级
	export const openClass = params => { return axios.post(`${base}/group/send_group_msg`, Qs.stringify(params)); };

// __KV 配置

// 获取KV配置列表
export const getKvList = params => { return axios.get(`${base}/conf/kv/list`, { params: params }); };

// 获取公共的kv配置列表
export const getPublicKvList = params => { return axios.get(`${base}/conf/public/get_public_conf`, { params: params }); };

// 增加KV配置
export const addKvConf = params => { return axios.post(`${base}/conf/kv/add`, Qs.stringify(params)); };
// 更新KV配置
export const editKvConf = params => { return axios.post(`${base}/conf/kv/update`, Qs.stringify(params)); };

// 获取全局假日配置
export const getHolidayConf = params => { return axios.get(`${base}/conf/holiday/detail`, { params: params }); };
// 更新全局假日配置
export const editHolidayConf = params => { return axios.post(`${base}/conf/holiday/update`, Qs.stringify(params)); };

// 获取启动画面配置
export const getScreenConf = params => { return axios.get(`${base}/conf/screen/detail`, { params: params }); };
// 更新启动画面配置
export const editScreenConf = params => { return axios.post(`${base}/conf/screen/update`, Qs.stringify(params)); };

// 获取版本详情
export const getVersionConf = params => { return axios.get(`${base}/conf/version/detail`, { params: params }); };
// 更新版本管理
export const editVersionConf = params => { return axios.post(`${base}/conf/version/update`, Qs.stringify(params)); };

// Page 增加
export const addNewPage = params => { return axios.post(`${base}/conf/page/add_page`, Qs.stringify(params)) };
// Page 修改
export const updatePage = params => { return axios.post(`${base}/conf/page/update_page`, Qs.stringify(params)) };
// Page 获取列表
export const getPageList = params => { return axios.get(`${base}/conf/page/list_page`, { params: params }) };
// Page 详细信息
export const getPageInfo = params => { return axios.get(`${base}/conf/page/get_page`, { params: params }) };
// PageBlock 增加
export const addNewPageBlock = params => { return axios.post(`${base}/conf/page/add_block`, Qs.stringify(params)) };
// PageBlock 修改
export const updatePageBlock = params => { return axios.post(`${base}/conf/page/update_block`, Qs.stringify(params)) };
// PageBlock 获取列表
export const getPageBlockList = params => { return axios.get(`${base}/conf/page/get_block`, { params: params }) };
// 发送推送消息
export const pushNotify = params => { return axios.post(`${base}/push/push_notify`, Qs.stringify(params)) };
// 获取反馈消息列表
export const getFeedback = params => { return axios.get(`${base}/feedback/list`, { params: params }) };

// __Goods
// printGoods 获取列表
export const getPrintgoodsList = params => { return axios.get(`${base}/printgoods/list`, { params: params }); };
// printGoods 批量生成卡号
export const addPrintgoods = params => { return axios.post(`${base}/printgoods/add`, Qs.stringify(params)); };
// printGoods 导出excel
export const exportPrintgoodsExcel = params => { return axios.post(`${base}/printgoods/export`, Qs.stringify(params)); };

// goods 获取列表
export const getGoodsList = params => { return axios.get(`${base}/goods/list`, { params: params }); };
// goods 添加出厂卡号
export const addGoods = params => { return axios.post(`${base}/goods/add`, Qs.stringify(params)); };
// goods 更新
export const updateGoods = params => { return axios.post(`${base}/goods/update`, Qs.stringify(params)); };
// goods 导入excel文件
export const importGoodsExcel = params => { return axios.post(`${base}/goods/import`, Qs.stringify(params)); };

// activeGoods 获取列表
export const getActivegoodsList = params => { return axios.get(`${base}/activegoods/list`, { params: params }); };
// activeGoods 添加
export const addActivegoods = params => { return axios.post(`${base}/activegoods/active`, Qs.stringify(params)); };

// 订单
// 获取订单列表
export const getOrderList = params => { return axios.get(`${base}/order/list`, { params: params }); };

// appUsers
// appUsers 获取列表
export const getAppuserList = params => { return axios.get(`${base}/app_user/list`, { params: params }); };
// appUsers 更新App用户
export const editAppuser = params => { return axios.post(`${base}/app_user/update`, Qs.stringify(params)); };
// appUsers 删除指定用户的所有在线设备
export const deleAllDev = params => { return axios.post(`${base}/app_user/del_onlinedevices`, Qs.stringify(params)); };

// appCourse
// appCourse 获取当前app用户下的课程列表
export const getAppCourseList = params => { return axios.get(`${base}/user_course/list`, { params: params }); };
// appCourse 开课
export const addAppCourse = params => { return axios.post(`${base}/user_course/add`, Qs.stringify(params)); };
// appCourse 关课
export const updateAppCourse = params => { return axios.post(`${base}/user_course/update`, Qs.stringify(params)); };

// 板块（block）
// 编辑课节板块 （成功）
export const editBlockInfo = params => { return axios.post(`${base}/lesson/block/update_block`, Qs.stringify(params)) };
// 从lesson里面拿Block列表 （成功）
export const getBlocksByLesson = params => { return axios.get(`${base}/lesson/block/blocks_by_lesson_id`, { params: params }) };
// 删除block
export const deleteBlockByBlockId = params => { return axios.post(`${base}/lesson/block/delete_block_by_block_id`, Qs.stringify(params)) };
// 获取被删除的block （
export const getDelblocks = params => { return axios.get(`${base}/lesson/get_del_blocks`, { params: params }) };
// 将删除的block 添加回lesson Conf
export const addBlockByBlockId = params => { return axios.post(`${base}/lesson/add_block_to_lesson_by_id`, Qs.stringify(params)) };
// 更新简版板块下条目的顺序、或删除
export const changeReviewEle = params => { return axios.post(`${base}/lesson/block/change_review_elements`, Qs.stringify(params)) };
// 初始化复习课block
export const initReviewBlock = params => { return axios.post(`${base}/lesson/block/init_review`, Qs.stringify(params)) };
// 初始化音乐课件block
export const initMusicBlock = params => { return axios.post(`${base}/lesson/music/init`, Qs.stringify(params)) };
// 修改课程目标图片
export const updateHomeImage = params => { return axios.post(`${base}/lesson/music/update_home_image`, Qs.stringify(params)) };
// 修改课程目标音频
export const updateHomeAudio = params => { return axios.post(`${base}/lesson/music/update_home_audio`, Qs.stringify(params)) };
// 修改音乐课课件状态
export const changeMusicLessonStatus = params => { return axios.post(`${base}/lesson/music/update_status`, Qs.stringify(params)) };
// 设置儿歌视频
export const updateSongVideo = params => { return axios.post(`${base}/lesson/music/update_song_video`, Qs.stringify(params)) };
// 设置讲解视频
export const updateExplainVideo = params => { return axios.post(`${base}/lesson/music/update_explain_video`, Qs.stringify(params)) };
// 添加场景
export const addMusicScene = params => { return axios.post(`${base}/lesson/music/add_scene_block`, Qs.stringify(params)) };
// 删除场景
export const delMusicScene = params => { return axios.post(`${base}/lesson/music/del_scene_block`, Qs.stringify(params)) };
// 场景排序
export const sortMusicScene = params => { return axios.post(`${base}/lesson/music/sort_scene_block`, Qs.stringify(params)) };
// 修改场景
export const updateMusicScene = params => { return axios.post(`${base}/lesson/music/update_scene_block`, Qs.stringify(params)) };
// 更新音乐课词汇
export const updateMusicVocabularies = params => { return axios.post(`${base}/lesson/music/update_vocabularies`, Qs.stringify(params)) };
// 设置音乐课倍速
export const updateSpeedFactor = params => { return axios.post(`${base}/lesson/music/update_speed_factor`, Qs.stringify(params)) };

// lesson
// 新增课节板块 (成功)(暂未使用)
export const addBlock = params => { return axios.post(`${base}/lesson/block/add_block`, Qs.stringify(params)) };
// 调取 lesson列表的接口 （成功）
export const getLessonList = params => { return axios.get(`${base}/lesson/list`, { params: params }) };
// 调取 lesson基本信息的 接口 （成功）
export const getLessonInfo = params => { return axios.get(`${base}/lesson/get`, { params: params }) };
// 调取 lesson 详情的 接口
export const getLessonDetails = params => { return axios.get(`${base}/lesson/details`, { params: params }) };
// 调取 添加block 到lesson 的接口。 （成功）
export const addBlockToLesson = params => { return axios.post(`${base}/lesson/add_block_to_lesson`, Qs.stringify(params)) };
// 操作完block之后的 更新lesson 的接口 (lesson_id &&  block_ids)  （成功）
export const updateBlockInLesson = params => { return axios.post(`${base}/lesson/update_sequence_of_block_in_lesson`, Qs.stringify(params)) };
// 调取 增加lesson 并添加到lesson 列表内 （成功）
export const addLessonToList = params => { return axios.post(`${base}/lesson/add`, Qs.stringify(params)) };
// 调取 修改lesson 更新信息  （成功）
export const editLessonInfo = params => { return axios.post(`${base}/lesson/update`, Qs.stringify(params)) };
// 从Lesson 中 删除 Block
export const delBlockFromLesson = params => { return axios.post(`${base}/lesson/del_block_from_lesson`, Qs.stringify(params)) };
// 更新指定课节的单词元数据
export const updateWordIds = params => { return axios.post(`${base}/lesson/update_word_ids`, Qs.stringify(params)) };
// 更新指定课节的短语元数据
export const updatePhraseIds = params => { return axios.post(`${base}/lesson/update_phrase_ids`, Qs.stringify(params)) };
// 更新指定课节的句型元数据
export const updateSentencePatternIds = params => { return axios.post(`${base}/lesson/update_sentence_pattern_ids`, Qs.stringify(params)) };
// 更新指定课节的句子元数据
export const updateSentenceIds = params => { return axios.post(`${base}/lesson/update_sentence_ids`, Qs.stringify(params)) };
// 更新课节简版板块
export const updateBriefBlocks = params => { return axios.post(`${base}/lesson/update_brief_blocks`, Qs.stringify(params)) };
// 格式化课节简版板块
export const initBriefBlocksElements = params => { return axios.post(`${base}/lesson/block/init_blocks_elements`, Qs.stringify(params)) };
// 格式化课节简版板块
export const changeBriefBlockVoca = params => { return axios.post(`${base}/lesson/block/change_brief_block_vocabularies`, Qs.stringify(params)) };
// 指定课节下添加亲子互动板块
export const addWxxPcBlock = params => { return axios.post(`${base}//lesson/add_wxx_pc_block`, Qs.stringify(params)) };
// 更新课节的亲子互动板块配置
export const updateWxxPcBlock = params => { return axios.post(`${base}/lesson/update_wxx_pc_blocks`, Qs.stringify(params)) };
// 更新课节的磨耳朵音频素材
export const updateWxxEar = params => { return axios.post(`${base}/lesson/update_wxx_ear`, Qs.stringify(params)) };


// Course
// 获取course列表 （成功）
export const getCourseList = params => { return axios.get(`${base}/course/list`, { params: params }) };
// 添加course 到course列表内（成功）
export const addCourseToList = params => { return axios.post(`${base}/course/add`, Qs.stringify(params)) };
// course 基本信息的编辑（成功）
export const editCourseInfo = params => { return axios.post(`${base}/course/update`, Qs.stringify(params)) };
// 提交编辑好的 Course 列表里的 Unit （成功）
export const updateUnitToCourse = params => { return axios.post(`${base}/course/update_sort_unit`, Qs.stringify(params)) };
// 请求 UnitToCourse 的数据
export const initUnitAndCourse = params => { return axios.post(`${base}/course/left_used_unit`, Qs.stringify(params)) };
// 根据 id 获取到当前课程下的教师
export const getTeacherListInCourse = params => { return axios.post(`${base}/course/get_course_teachers`, Qs.stringify(params)) };
// 复制课程
export const copyLessonApi = params => { return axios.post(`${base}/course/copy`, Qs.stringify(params)) };
// 根据指定课程id获取课程下的课节
export const getLessonListByCourse = params => { return axios.get(`${base}/course/course_unit_lesson`, { params: params }) };
// 关联音乐课
export const bindMusicLesson = params => { return axios.post(`${base}/course/bind_music_lesson`, Qs.stringify(params)) };
// 获取音乐课列表
export const getMusicLesson = params => { return axios.get(`${base}/course/get_music_lessons`, { params: params }) };

// TrainCamp
// 添加 trainCamp 到 trainCamp 列表里
export const addTrainCamp = params => { return axios.post(`${base}/train_camp/add`, Qs.stringify(params)) };
//获取trainCamp列表
export const getTrainCampList = params => { return axios.get(`${base}/train_camp/list`, { params: params }) };
//关卡图标配置
export const updateTrainCampIconConf = params => { return axios.post(`${base}/train_camp/update_gate_imgs`, Qs.stringify(params)) };
//修改集训营信息
export const updateTrainCamp = params => { return axios.post(`${base}/train_camp/update`, Qs.stringify(params)) };
//生成链接接口
export const generateLink = params => { return axios.get(`${base}/train_camp/generate_link`, { params: params }) };


// Unit
// 获取Unit列表 （成功 [有待更新，默认数据请求与选择式请求]）
export const getUnitList = params => { return axios.get(`${base}/unit/list`, { params: params }) };
// 添加 Unit 到unit列表内 （成功）
export const addUnitToList = params => { return axios.post(`${base}/unit/add`, Qs.stringify(params)) };
// Unit 基本信息的编辑（成功）
export const editUnitInfo = params => { return axios.post(`${base}/unit/update`, Qs.stringify(params)) };
// 获取 lessonToUnit 数据
export const initLessonInfo = params => { return axios.post(`${base}/unit/get_unit_lessons`, Qs.stringify(params)) };
// 请求 LessonToUnit 的数据
export const initLessonAndUnit = params => { return axios.post(`${base}/unit/left_used_lesson`, Qs.stringify(params)) };
// 提交编辑好的 Unit 列表里的 Lesson （成功）
export const updateLessonToUnit = params => { return axios.post(`${base}/unit/update_sort_lesson`, Qs.stringify(params)) };

// Element
// Element 增加条目
export const addNewElement = params => { return axios.post(`${base}/lesson/block/add_element_to_block`, Qs.stringify(params)) };
// 增加复习课element 条目
export const addReviewElement = params => { return axios.post(`${base}/lesson/block/add_review_to_brief_block`, Qs.stringify(params)) };
// Element 修改条目
export const updateElement = params => { return axios.post(`${base}/element/update`, Qs.stringify(params)) };
// Element 删除条目
export const deleteElement = params => { return axios.post(`${base}/lesson/block/del_element_from_block`, Qs.stringify(params)) };
// Element 请求详细信息
export const getElementInfo = params => { return axios.get(`${base}/element/list`, { params: params }) };
// 操作完element之后的 更新lesson 的接口 (block_id &&  element_ids)
export const updateSequenceElementInBlock = params => { return axios.post(`${base}/lesson/block/update_sequence_of_elements_in_block`, Qs.stringify(params)) };

// Teacher
// Teacher 增加教师
export const addNewTeacher = params => { return axios.post(`${base}/teacher/add`, Qs.stringify(params)) };
// Teacher 修改老师
export const updateTeacher = params => { return axios.post(`${base}/teacher/update`, Qs.stringify(params)) };
// Teacher 获取老师列表
export const getTeacherList = params => { return axios.get(`${base}/teacher/list`, { params: params }) };

// Spu
// Spu 增加
export const addNewSpu = params => { return axios.post(`${base}/spu/add`, Qs.stringify(params)) };
// Spu 修改
export const updateSpu = params => { return axios.post(`${base}/spu/update`, Qs.stringify(params)) };
// Spu 获取列表
export const getSpuList = params => { return axios.get(`${base}/spu/list`, { params: params }) };

// Sku
// Sku 增加
export const addNewSku = params => { return axios.post(`${base}/sku/add`, Qs.stringify(params)) };
// Sku 修改
export const updateSku = params => { return axios.post(`${base}/sku/update`, Qs.stringify(params)) };
// Sku 获取列表
export const getSkuList = params => { return axios.get(`${base}/sku/list`, { params: params }) };

// Channel
// Channel 增加
export const addNewChannel = params => { return axios.post(`${base}/channel/add`, Qs.stringify(params)) };
// Channel 修改
export const updateChannel = params => { return axios.post(`${base}/channel/update`, Qs.stringify(params)) };
// Channel 获取列表
export const getChannelList = params => { return axios.get(`${base}/channel/list`, { params: params }) };

// ChannelCode
// ChannelCode 增加
export const addNewChannelCode = params => { return axios.post(`${base}/channel_code/add`, Qs.stringify(params)) };
// ChannelCode 修改
export const updateChannelCode = params => { return axios.post(`${base}/channel_code/update`, Qs.stringify(params)) };
// ChannelCode 获取列表
export const getChannelCodeList = params => { return axios.get(`${base}/channel_code/list`, { params: params }) };

// learningLibrary
// 列表
export const getLearLibList = params => { return axios.get(`${base}/document/list`, { params: params }) };
// 新增
export const addLearLib = params => { return axios.post(`${base}/document/add`, Qs.stringify(params)) };
// 更新
export const editLearLib = params => { return axios.post(`${base}/document/update`, Qs.stringify(params)) };
// 添加Bilingual配置
export const addBilingualConf = params => { return axios.post(`${base}/conf/bilingual/add_bilingual`, Qs.stringify(params)) };
// 获取Bilingual配置
export const getBilingualConf = params => { return axios.get(`${base}/conf/bilingual/query`, { params: params }) };
// 更新Bilingual配置
export const updateBiligualConf = params => { return axios.post(`${base}/conf/bilingual/update_bilingual`, Qs.stringify(params)) };
// 专辑列表
export const getAlbumList = params => { return axios.get(`${base}/album/list`, { params: params }) };
// 专辑新增
export const addAlbum = params => { return axios.post(`${base}/album/add`, Qs.stringify(params)) };
// 专辑更新
export const updateAlbum = params => { return axios.post(`${base}/album/update`, Qs.stringify(params)) };
// 更新专辑下的文档
export const updateAlbumDocs = params => { return axios.post(`${base}/album/update_doc`, Qs.stringify(params)) };
// 获取指定id的专辑
export const getAlbumById = params => { return axios.get(`${base}/album/get`, { params: params }) };
// 获取已配置的专辑列表
export const getAlbumForBilConf = params => { return axios.get(`${base}/conf/bilingual/query_albums`, { params: params }) };
// 更新专辑的双语配置
export const updateAlbumForBilConf = params => { return axios.post(`${base}/conf/bilingual/update_album_bilingual`, Qs.stringify(params)) };
// 获取指定id下的文档
export const getAlbumByIdForBilConf = params => { return axios.get(`${base}/conf/bilingual/get_album_docs`, { params: params }) };

// CMS
// 新增栏目
export const addNewCategory = params => { return axios.post(`${base}/cms/category/add`, Qs.stringify(params)) };
// 获取指定id栏目
export const getCategoryItem = params => { return axios.get(`${base}/cms/category/get`, { params: params }) };
// 更新栏目
export const updateCategory = params => { return axios.post(`${base}/cms/category/update`, Qs.stringify(params)) };
// 查询栏目列表
export const getCategoryList = params => { return axios.get(`${base}/cms/category/list`, { params: params }) };
// 新增文章
export const addNewArticle = params => { return axios.post(`${base}/cms/article/add`, Qs.stringify(params)) };
// 获取指定id文章
export const getArticleItem = params => { return axios.get(`${base}/cms/article/get`, { params: params }) };
// 更新
export const updateArticle = params => { return axios.post(`${base}/cms/article/update`, Qs.stringify(params)) };
// 查询文章列表
export const getArticleList = params => { return axios.get(`${base}/cms/article/list`, { params: params }) };

/**
 * 评测
 * 模板
 * 模板实例
 */
// 新增模板
export const addTemp = params => { return axios.post(`${base}/template/add`, Qs.stringify(params)) };
// 更新模板
export const updateTemp = params => { return axios.post(`${base}/template/update`, Qs.stringify(params)) };
// 获取指定id的模板
export const getTempById = params => { return axios.get(`${base}/template/get`, { params: params }) };
// 查询模板列表
export const getTempList = params => { return axios.get(`${base}/template/list`, { params: params }) };

// 新增模板实例
export const addTempIns = params => { return axios.post(`${base}/template_instance/add`, Qs.stringify(params)) };
// 更新模板实例
export const updateTempIns = params => { return axios.post(`${base}/template_instance/update`, Qs.stringify(params)) };
// 获取指定id的模板实例
export const getTempInsById = params => { return axios.get(`${base}/template_instance/get`, { params: params }) };
// 查询模板实例列表
export const getTempInsList = params => { return axios.get(`${base}/template_instance/list`, { params: params }) };

// 评测系统
// 获取试卷列表
export const getExamList = params => { return axios.get(`${base}/examination/list`, { params: params }) };
//添加试卷信息
export const addExam = params => { return axios.post(`${base}/examination/add`, Qs.stringify(params)) };
//修改试卷信息
export const updateExam = params => { return axios.post(`${base}/examination/update`, Qs.stringify(params)) };
//添加question到examination
export const addQuestionExam = params => { return axios.post(`${base}/examination/add_question_exam`, Qs.stringify(params)) };
//获取题库列表
export const getQuestionList = params => { return axios.get(`${base}/question/list`, { params: params }) };
//题库添加内容
export const addQuestion = params => { return axios.post(`${base}/question/add`, Qs.stringify(params)) };
//修改题库信息
export const updateQuestion = params => { return axios.post(`${base}/question/update`, Qs.stringify(params)) };
//获取试卷库
export const getExamSuiteList = params => { return axios.get(`${base}/examsuite/list`, { params: params }) };
//添加课程的评测套餐信息
export const addExaminationSuite = params => { return axios.post(`${base}/examsuite/add`, Qs.stringify(params)) };
// 一键初始化地图试卷集
export const initMapExamSuit = params => { return axios.post(`${base}/examsuite/init_template`, Qs.stringify(params)) };
//更新课程关联的套餐
export const updateExaminationSuite = params => { return axios.post(`${base}/examsuite/update`, Qs.stringify(params)) };
//配置课节的评测套餐
export const addExamToSuite = params => { return axios.post(`${base}/examsuite/add_exam_to_suite`, Qs.stringify(params)) };
//删除课节的评测套餐
export const delLessonExamSuite = params => { return axios.post(`${base}/coursesuite/del_lesson_suite`, Qs.stringify(params)) };
// 根据课程id获取当前课节
export const getlessonListByCourseId = params => { return axios.get(`${base}/coursesuite/course_unit_lesson`, { params: params }) };
//课程关联套餐列表
export const getCourseSuiteList = params => { return axios.get(`${base}/coursesuite/list`, { params: params }) };
//添加课程与套餐的关联
export const addCourseSuite = params => { return axios.post(`${base}/coursesuite/add`, Qs.stringify(params)) };
//添加课程与套餐的关联
export const addLessonExamSuite = params => { return axios.post(`${base}/coursesuite/add_lesson_suite`, Qs.stringify(params)) };
//更新课程与套餐的关联
export const updateCourseSuite = params => { return axios.post(`${base}/coursesuite/update`, Qs.stringify(params)) };
//获取模版实例列表
export const getTemplateList = params => { return axios.get(`${base}/template_instance/list`, { params: params }) };
//获取用户成绩列表
export const getUserResultsList = params => { return axios.get(`${base}/user_results/list`, { params: params }) };
/**
 * @description 词句库相关
 * @function 单词相关函数
 * @function 短语相关函数
 * @function 句子相关函数
 * @function 句型相关函数
 */

export const getWordList = params => { return axios.get(`${base}/word/list`, { params: params }) }
export const addWord = params => { return axios.post(`${base}/word/add`, Qs.stringify(params)) }
export const updateWord = params => { return axios.post(`${base}/word/update`, Qs.stringify(params)) }
export const batchQuery = params => { return axios.get(`${base}/word/batch_list`, { params: params }) }
export const batchAddWord = params => { return axios.post(`${base}/word/batch_add`, Qs.stringify(params)) }

export const getPhraseList = params => { return axios.get(`${base}/phrase/list`, { params: params }) }
export const getPhraseById = params => { return axios.get(`${base}/phrase/get`, { params: params }) }
export const addPhrase = params => { return axios.post(`${base}/phrase/add`, Qs.stringify(params)) }
export const updatePhrase = params => { return axios.post(`${base}/phrase/update`, Qs.stringify(params)) }

export const getSentenceList = params => { return axios.get(`${base}/sentence/list`, { params: params }) }
export const getSentenceById = params => { return axios.get(`${base}/sentence/get`, { params: params }) }
export const addSentence = params => { return axios.post(`${base}/sentence/add`, Qs.stringify(params)) }
export const updateSentence = params => { return axios.post(`${base}/sentence/update`, Qs.stringify(params)) }

export const getSentencePatternList = params => { return axios.get(`${base}/sentence_pattern/list`, { params: params }) }
export const addSentencePattern = params => { return axios.post(`${base}/sentence_pattern/add`, Qs.stringify(params)) }
export const updateSentencePattern = params => { return axios.post(`${base}/sentence_pattern/update`, Qs.stringify(params)) }

/*
	* 推广人
*/
// 根据ID数组查询用户
export const geUsersById = params => { return axios.get(`${base}/app_user/get_users`, { params: params }) };
// 根据ID数组查询推广人
export const getPromotersById = params => { return axios.get(`${base}/promoter/get_promoters`, { params: params }) };
// 获取申请列表
export const getApplyList = params => { return axios.get(`${base}/apply/list`, { params: params }) };
// 获取推广人列表
export const getPromoterList = params => { return axios.get(`${base}/promoter/list`, { params: params }) };
// 修改申请人状态提交
export const submitApplyAudit = params => { return axios.post(`${base}/apply/audit`, Qs.stringify(params)) };
// 修改推广人状态提交
export const submitPromoterUpdate = params => { return axios.post(`${base}/promoter/update`, Qs.stringify(params)) };
// 根据批次修改推广人身份
export const updatePosition = params => { return axios.post(`${base}/promoter/update_position`, Qs.stringify(params)) };
// 整理推广人批次等级ID
export const disposalDaterangeid = params => { return axios.post(`${base}/promoter/disposal_daterangeid`, Qs.stringify(params)) };
// 高权限修改推广人信息
export const updatePrivilege = params => { return axios.post(`${base}/promoter/update_privilege`, Qs.stringify(params)) };
// 获取推广人订单列表
export const getPromoterOrderList = params => { return axios.get(`${base}/promoter/order/list`, { params: params }) };
// 添加推广人订单
export const promoterOrderAdd = params => { return axios.post(`${base}/promoter/order/add`, Qs.stringify(params)) };
// 更新推广人订单
export const promoterOrderUpdate = params => { return axios.post(`${base}/promoter/order/update`, Qs.stringify(params)) };
// 删除推广人订单
export const promoterOrderDel = params => { return axios.post(`${base}/promoter/order/del`, Qs.stringify(params)) };
// 推广人销售精品课数据列表
export const getProSaleClass = params => { return axios.get(`${base}/promoter/sale_class/list`, { params: params }) };

// 推广人小秘书微信列表
export const getPromoterWx = params => { return axios.post(`${base}/promoterWx/list`, Qs.stringify(params)) };
// 推广人小秘书微信修改
export const updatePromoterWx = params => { return axios.post(`${base}/promoterWx/update`, Qs.stringify(params)) };
// 推广人小秘书微信新增
export const addPromoterWx = params => { return axios.post(`${base}/promoterWx/add`, Qs.stringify(params)) };
// 推广人小秘书微信删除
export const delPromoterWx = params => { return axios.post(`${base}/promoterWx/del`, Qs.stringify(params)) };

// 添加推广组
export const addPromoterGroup = params => { return axios.post(`${base}/promoter/group/add`, Qs.stringify(params)) };
// 修改推广组
export const updatePromoterGroup = params => { return axios.post(`${base}/promoter/group/update`, Qs.stringify(params)) };
// 推广组列表
export const getPromoterGroupList = params => { return axios.get(`${base}/promoter/group/list`, { params: params }) };
// 推广组列表
export const getPromoterGroupListByFamily = params => { return axios.get(`${base}/promoter/group/get_list`, { params: params }) };
// 获取推广组的基本信息
export const getPromoterInfo = params => { return axios.get(`${base}/promoter/group/get`, { params: params }) };
// 添加推广人到推广人组
export const addMemberForProGroup = params => { return axios.post(`${base}/promoter/group/add_members`, Qs.stringify(params)) };
// 批量删除推广人成员
export const delMemberForProGroup = params => { return axios.post(`${base}/promoter/group/del_members`, Qs.stringify(params)) };
// 获取推广组下推广人成员列表
export const getPromoterGroupMembersList = params => { return axios.get(`${base}/promoter/group/list_members`, { params: params }) };
// 群组中模糊查询推广人
export const getGroupMemb = params => { return axios.get(`${base}/promoter/group/get_member`, { params: params }) };
// 小队中模糊查询推广人
export const getTeamMemb = params => { return axios.get(`${base}/promoter/team/get_member`, { params: params }) };


// 添加推广组目标
export const addProGroupTarget = params => { return axios.post(`${base}/promoter/group/add_target`, Qs.stringify(params)) };
// 修改推广组目标
export const updateProGroupTarget = params => { return axios.post(`${base}/promoter/group/update_target`, Qs.stringify(params)) };
// 推广组目标列表
export const getProGroupTarget = params => { return axios.get(`${base}/promoter/group/get_targets`, { params: params }) };
// 删除推广组目标
export const delProGroupTarget = params => { return axios.post(`${base}/promoter/group/del_targets`, Qs.stringify(params)) };

// 获取推广人组小队列表
export const getPromoterTeamList = params => { return axios.get(`${base}/promoter/team/list`, { params: params }) };
// 新建推广人组小队
export const newPromoterTeam = params => { return axios.post(`${base}/promoter/team/add`, Qs.stringify(params)) };
// 删除推广人组小队
export const delPromoterTeam = params => { return axios.post(`${base}/promoter/team/del`, Qs.stringify(params)) };
// 修改推广人组小队
export const updatePromoterTeam = params => { return axios.post(`${base}/promoter/team/update`, Qs.stringify(params)) };
// 查询推广人群组里的成员
export const getProGroupMember = params => { return axios.get(`${base}/promoter/list`, { params: params }) };

// 获取小队下成员列表
export const getPromoterTeamMembersList = params => { return axios.get(`${base}/promoter/team/list_members`, { params: params }) };
// 新增小队成员用户
export const addMemberForProTeam = params => { return axios.post(`${base}/promoter/team/add_members`, Qs.stringify(params)) };
// 删除小对成员用户
export const delMemberForProTeam = params => { return axios.post(`${base}/promoter/team/del_members`, Qs.stringify(params)) };

// 获取家族列表
export const getPromoterFamilyList = params => { return axios.get(`${base}/promoter/family/list`, { params: params }) };
// 新增家族
export const addPromoterFamily = params => { return axios.post(`${base}/promoter/family/add`, Qs.stringify(params)) };
// 更新家族
export const updatePromoterFamily = params => { return axios.post(`${base}/promoter/family/update`, Qs.stringify(params)) };
// 查询后台用户
export const getPromoterFamily_OpUser = params => { return axios.get(`${base}/promoter/family/listOpUser`, { params: params }) };

// 推广人知识库
// 推广人知识库列表
export const getPromoterWikiList = params => { return axios.get(`${base}/promoter/wiki/list`, { params: params }) };
// 推广人知识库修改
export const updatePromoterWiki = params => { return axios.post(`${base}/promoter/wiki/update`, Qs.stringify(params)) };
// 推广人知识库新增
export const addPromoterWiki = params => { return axios.post(`${base}/promoter/wiki/add`, Qs.stringify(params)) };
// 推广人知识库删除
export const delPromoterWiki = params => { return axios.post(`${base}/promoter/wiki/del`, Qs.stringify(params)) };
// 推广人集训营wiki列表
export const getTrainingWikiList = params => { return axios.get(`${base}/promoter/training/wiki/list`, { params: params }) };
// 推广人集训营wiki修改
export const updateTrainingWikiList = params => { return axios.post(`${base}/promoter/training/wiki/update`, Qs.stringify(params)) };
// 推广人集训营wiki增加
export const addTrainingWikiList = params => { return axios.post(`${base}/promoter/training/wiki/add`, Qs.stringify(params)) };
// 推广人集训营wiki删除
export const delTrainingWikiList = params => { return axios.post(`${base}/promoter/training/wiki/del`, Qs.stringify(params)) };
// 推广人个人集训营wiki列表
export const getPersonalWikiList = params => { return axios.get(`${base}/promoter/personal/wiki/list`, { params: params }) };
// 推广人个人集训营wiki删除
export const delPersonalWiki = params => { return axios.post(`${base}/promoter/personal/wiki/del`, Qs.stringify(params)) };
// 用户与推广人强弱绑定关系列表
export const getProBindList = params => { return axios.get(`${base}/promoter/bind/list`, { params: params }) };
// 用户与推广人强弱绑定关系删除
export const delProBind = params => { return axios.post(`${base}/promoter/bind/del`, Qs.stringify(params)) };
// 用户与推广人二次绑定关系列表
export const getProSecBindList = params => { return axios.get(`${base}/promoter/sec/bind/list`, { params: params }) };
// 用户与推广人二次绑定关系删除
export const delProSecBind = params => { return axios.post(`${base}/promoter/sec/bind/del`, Qs.stringify(params)) };


// 日期段配置
// 新增日期段配置
export const addDateRange = params => { return axios.post(`${base}/promoter/date_range/add`, Qs.stringify(params)) };
// 修改一条日期段配置
export const updateDateRange = params => { return axios.post(`${base}/promoter/date_range/update`, Qs.stringify(params)) };
// 删除日期段配置的一条记录
export const delDateRange = params => { return axios.post(`${base}/promoter/date_range/del`, Qs.stringify(params)) };
// 获取日期段配置实体
export const getDateRangeEntity = params => { return axios.get(`${base}/promoter/date_range/get`, { params: params }) };
// 获取日期段配置列表
export const getDateRangeList = params => { return axios.get(`${base}/promoter/date_range/list`, { params: params }) };

// 招生期数据
// 新增招生期数据
export const addPromoterRange = params => { return axios.post(`${base}/promoter/range/add`, Qs.stringify(params)) };
// 新增推广人招生期内的成员
export const addUserToProRange = params => { return axios.post(`${base}/promoter/range/add_user`, Qs.stringify(params)) };
// 删除招生期数据的一条记录
export const delPromoterRange = params => { return axios.post(`${base}/promoter/range/del`, Qs.stringify(params)) };
// 获取推广人招生用户列表
export const getPromoterRangeUser = params => { return axios.get(`${base}/promoter/range/list_user`, { params: params }) };
// 获取推广人招人数据列表
export const getPromoterRangeList = params => { return axios.get(`${base}/promoter/range/list`, { params: params }) };
// 获取家族长招生数据
export const getPromoterEnrollNumList = params => { return axios.get(`${base}/promoter/enroll_num/list`, { params: params }) };
// 获取家族长招生数据更新
export const updatePromoterEnrollNum = params => { return axios.post(`${base}/promoter/enroll_num/update`, Qs.stringify(params)) };
// 销售期数据
// 获取推广人销售期数据列表
export const getSaleRangeList = params => { return axios.get(`${base}/promoter/sale_range/list`, { params: params }) };
// 新增销售期数据
export const addSaleRange = params => { return axios.post(`${base}/promoter/sale_range/add`, Qs.stringify(params)) };
// 删除销售期数据的一条记录
export const delSaleRange = params => { return axios.post(`${base}/promoter/sale_range/del`, Qs.stringify(params)) };
// 修改一条销售期数据
export const updateSaleRange = params => { return axios.post(`${base}/promoter/sale_range/update`, Qs.stringify(params)) };
// 个人销售日报
export const salePersonalList = params => { return axios.get(`${base}/promoter/stat_man/personal`, { params: params }) };
// 销售日报Top10
export const saleTopTenList = params => { return axios.get(`${base}/promoter/stat_man/personal/topten`, { params: params }) };
// 零销售
export const saleZeroList = params => { return axios.get(`${base}/promoter/stat_man/personal/zero`, { params: params }) };
// 销售期数据
// 获取推广人销售期数据列表
export const getDateNodeList = params => { return axios.get(`${base}/promoter/date_node/list`, { params: params }) };
// 新增销售期数据
export const addDateNode = params => { return axios.post(`${base}/promoter/date_node/add`, Qs.stringify(params)) };
// 删除销售期数据的一条记录
export const delDateNode = params => { return axios.post(`${base}/promoter/date_node/del`, Qs.stringify(params)) };
// 修改一条销售期数据
export const updateDateNode = params => { return axios.post(`${base}/promoter/date_node/update`, Qs.stringify(params)) };

/**
 * @description 短链接相关
 */
export const transformShortUrl = params => { return axios.post(`${base}/url/short_url`, Qs.stringify(params)) }

// cdn 相关
// 刷新cdn
export const refreshCdn = params => { return axios.post(`${base}/sys/cdn/refresh`, Qs.stringify(params)) };
// 预取CDN
export const prefetchCdn = params => { return axios.post(`${base}/sys/cdn/prefetch`, Qs.stringify(params)) };
// 上传文件到CDN
export const uploadCdn = params => { return axios.post(`${base}/sys/cdn/upload`, Qs.stringify(params)) };

// 统计相关
// 获取精品课统计
export const statisticsClassic = params => { return axios.post(`${base}/promoter/statistics/classic`, Qs.stringify(params)) };
// 获取推广人销售统计
export const statisticsSale = params => { return axios.post(`${base}/promoter/statistics/sale`, Qs.stringify(params)) };
// 获取推广人销售课程统计
export const statisticsCourse = params => { return axios.post(`${base}/promoter/statistics/course`, Qs.stringify(params)) };
// 获取推广人招生统计
export const statisticsRecruit = params => { return axios.post(`${base}/promoter/statistics/recruit`, Qs.stringify(params)) };
// 获取推广人
export const statisticsPromoter = params => { return axios.post(`${base}/promoter/statistics/promoter`, Qs.stringify(params)) };
// 推广人组招生统计手动版
export const enrollStatMan = params => { return axios.post(`${base}/promoter/stat_man/enroll`, Qs.stringify(params)) };
// 推广人销售统计手动版
export const saleStatMan = params => { return axios.post(`${base}/promoter/stat_man/sale`, Qs.stringify(params)) };
// 同期业务统计
export const statisticsPromoterRecruitSale = params => { return axios.post(`${base}/promoter/statistics/pro_type/recruit_sale`, Qs.stringify(params)) };
// 家族长期次
export const statisticsFamGroRecruitSale = params => { return axios.post(`${base}/promoter/statistics/fam_gro/recruit_sale`, Qs.stringify(params)) };
// 小组长期次
export const statisticsGroPerRecruitSale = params => { return axios.post(`${base}/promoter/statistics/gro_pers/recruit_sale`, Qs.stringify(params)) };
// 家族长时间
export const statisticsFamFroRecruitSaleTime = params => { return axios.post(`${base}/promoter/statistics/fam_gro/recruit_sale_time`, Qs.stringify(params)) };
// 公司时间
export const statisticsProTypeRecruitSaleTime = params => { return axios.post(`${base}/promoter/statistics/pro_type/recruit_sale_time`, Qs.stringify(params)) };
// 小组长期次
export const statisticsGroPersRecruitSaleTime = params => { return axios.post(`${base}/promoter/statistics/gro_pers/recruit_sale_time`, Qs.stringify(params)) };

// 导出精品课Excel
export const statisticsClassicExport = params => { return axios.get(`${base}/promoter/statistics/export/Classic`, { params: params }) };
// 导出销售Excel
export const statisticsSaleExport = params => { return axios.get(`${base}/promoter/statistics/export/sale`, { params: params }) };
// 导出课程Excel
export const statisticsCourseExport = params => { return axios.get(`${base}/promoter/statistics/export/course`, { params: params }) };
// 导出招生Excel
export const statisticsRecruitExport = params => { return axios.get(`${base}/promoter/statistics/export/recruit`, { params: params }) };
// 导出推广人Excel
export const statisticsPromoterExport = params => { return axios.get(`${base}/promoter/statistics/export/promoter`, { params: params }) };

	// 微信名称列表
	export const getwechatNameList = params => { return axios.post(`${base}/promoter/bind/choose_wechat_byname`, Qs.stringify(params)) };
	// 手机号列表
	export const getPhoneList = params => { return axios.post(`${base}/promoter/bind/choose_wechat_bymobile`, Qs.stringify(params)) };

//操作记录查询
export const operationRecord = params => { return axios.get(`${base}/operation_record/list`, { params: params }) };

	// 小程序海报容器列表
	export const 	getPosterList = params => { return axios.post(`${base}/poster/list`, { params: params }) };
	//后台更新海报容器
	export const 	posterUpdate = params => { return axios.post(`${base}/poster/update`, Qs.stringify(params)) };

// ClassGroup
    // 查询当前班主任下面的班级组
    export const getTeacherGroupList = params => { return axios.get(`${base}/group_teacher/get_group_by_op_and_app`, { params: params }) };
    // // 查询班级组实例
	// export const getClassGroupList = params => { return axios.get(`${base}/class/group/list`, { params: params }) };
	// // 取得班级组下的班级详情数据
	// export const getClassGroupsInfo = params => { return axios.get(`${base}/class/group/get_groups`, { params: params }) };
    // 消息列表接口
    export const getGroupNoticeList = params => { return axios.get(`${base}/group_notice/list`, { params: params }) };
    // 新增消息模版接口
    export const addGroupNoticeList = params => { return axios.post(`${base}/group_notice/add`, Qs.stringify(params))};
    // 修改消息模版接口
    export const updateGroupNoticeList = params => { return axios.post(`${base}/group_notice/update`, Qs.stringify(params))};
    // 消息发送列表
    export const getNoticeRecordList = params => { return axios.get(`${base}/notice_record/list`, { params: params }) };
    // 发送班级通知
    export const batchSendGroupMsg = params => { return axios.post(`${base}/tim/group_msg/batch_send_group_msg`, Qs.stringify(params)) };
    // 审核
    export const groupNoticeValidate = params => { return axios.post(`${base}/group_notice/validate`, Qs.stringify(params)) };
    // 修改审核状态
    export const groupNoticeSubmitValidate = params => { return axios.post(`${base}/group_notice/submit_validate`, Qs.stringify(params)) };
    // 查询当前op账号下的userid
    export const getAppByop = params => { return axios.get(`${base}/group_teacher/get_app_by_op`, { params: params }) };

// IMGroup
  // 在线班级群的列表页接口
	export const getClassGroupList = params => { return axios.get(`${base}/im/group/list`, { params: params }) };
	// 取得班级组下的班级详情数据
	export const getClassGroupsInfo = params => { return axios.get(`${base}/im/group/member_list`, { params: params }) };
	// 更新在线班级群信息
	export const 	imGroupUpdate = params => { return axios.post(`${base}/im/group/update`, Qs.stringify(params)) };

// GroupTeacher
	// 班级管理列表接口
	export const getGroupTeacherList = params => { return axios.get(`${base}/group_teacher/list`, { params: params }) };
	// 班级管理添加接口
	export const 	groupTeacherAdd = params => { return axios.post(`${base}/group_teacher/add`, Qs.stringify(params)) };
	// 班级管理更新接口
	export const 	groupTeacherUpdate = params => { return axios.post(`${base}/group_teacher/update`, Qs.stringify(params)) };
	// 当前后台用户下的班主任信息
	export const  getByOpUserId = params => { return axios.get(`${base}/group_teacher/get_op_user`, { params: params }) };
