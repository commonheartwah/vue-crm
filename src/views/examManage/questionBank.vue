<template lang="html">
    <div class="questionBank">
        <!-- 头部查询筛选 -->
        <el-col class='toolbar' style='padding-bottom: 0px;'>
          <el-form :inline = "true" v-model='filter'>
              <el-form-item>
                  <el-input  placeholder='请输入题库ID' icon="circle-cross" :on-icon-click="handleIconClick_clearId" v-model="filter.id"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-input  placeholder='请输入题库名称' icon="circle-cross" v-model="filter.title" :on-icon-click="handleIconClick_clearName"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-select  placeholder="类型" v-model="filter.type" clearable>
                     <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value" >
                     </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <el-select  placeholder="状态" v-model="filter.status" clearable>
                     <el-option v-for="item in isValue" :key="item.value" :label="item.label" :value="item.value" >
                     </el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <el-button type='primary' @click="queryQuestion">查询</el-button>
              </el-form-item>
              <el-form-item>
                  <el-button type='primary' @click="addQuestion">新增</el-button>
              </el-form-item>
          </el-form>
        </el-col>
        <!-- 题库数据表格 -->
        <el-table :data="questionList" border style="width: 100%" v-loading="questionListLoading">
			<el-table-column prop="entity.id" label="ID" sortable width="100" align="center"></el-table-column>
			<el-table-column prop="entity.title" label="题库名称" align="center"></el-table-column>
			<el-table-column prop="entity.enTitle" label="英文名称" align="center"></el-table-column>
			<el-table-column prop="entity.examName" label="关联试卷名称" align="center"></el-table-column>
            <el-table-column prop="entity.typeText" label="题目类型" align="center"></el-table-column>
            <el-table-column prop="entity.status" label="状态" align="center"></el-table-column>
			<el-table-column label="操作">
                <template scope="scope">
	                <el-button-group>
                        <el-button type="success" size="small" @click="editQues(scope.row, scope.$index)">编辑</el-button>
	                </el-button-group>
				</template>
		    </el-table-column>
  		</el-table>
        <!-- 试题列表分页 -->
        <el-col class='toolbar'>
            <el-pagination style='float: right' @current-change="handleCurrentChange" :current-page.sync="questionPage" :page-size="20" layout="total, prev, pager, next" :total="totalCount">
            </el-pagination>
        </el-col>
      <!-- 新增数据弹窗 -->
      <el-dialog title='新增' :visible.sync="addFormVisible" :close-on-click-modal='false'>
            <el-form :model='question' label-width='100px' ref="question" :rules='questionRules'>
			    <el-form-item label='题库标题' prop="title">
					<el-input v-model='question.title' auto-complete='off'></el-input>
			    </el-form-item>
          	    <el-form-item label='题库英文标题' prop="en_title">
  					<el-input v-model='question.en_title' auto-complete='off'></el-input>
                </el-form-item>
                <el-form-item label='题库类型' prop="type">
                    <el-select  placeholder="类型" v-model="question.type" @change='quesType(question.type)'>
                        <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='所属试卷' prop="examination_id">
                    <el-select v-model="question.examination_id" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchExaminationFunc">
                        <el-option
                            v-for="item in examinationOptions"
                            :key="item.id"
                            :label="'（' + item.id + '）' + item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='模版实例id' prop="templateinstance_id" v-if='questionType == 4'>
                    <el-select v-model="question.templateinstance_id" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchTemplateFunc">
                        <el-option
                            v-for="item in templateOptions"
                            :key="item.id"
                            :label="'（' + item.id + '）' + item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='填空题答案' prop="fill_answer"  v-if='questionType == 3'>
  					<el-input v-model='question.fill_answer' auto-complete='off'></el-input>
                </el-form-item>
                <el-form-item label='选择题选项' prop="" v-if='questionType == 1||questionType==2'>
                    <div v-for='(chooseOption, index) in chooseOptionsArr' style="margin-bottom:10px;">
                        <el-row>
                            <el-col :span="5" align='left'>
                                <el-button type="info" @click='optionConf(index, 0)'>选择题{{index+1}}配置</el-button>
                            </el-col>
                            <el-col :span="5" align='left'>
                                <el-radio class="radio" v-model="question.radio_answer" :label="(index+1)" v-if='questionType==1'>是否正确</el-radio>
                                <el-checkbox v-model="question.checkbox_answer" :label="(index+1)" v-if='questionType==2'>是否正确</el-checkbox>
                            </el-col>
                            <el-col :span="2" align='left'>
                                <el-button type="text" icon="circle-close"  @click='delChooseOptions(0, index)' v-if='chooseOptionsArr.length>3'></el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-col :span="2" class="line" align='center'><el-button type="primary" icon="plus" size="mini" @click='addChoose'></el-button></el-col>
                </el-form-item>
                <el-form-item label="预览" v-show="question.title_image_url || question.title_audio_id || question.title_video_id">
    				<div class="preview-container">
    					<div v-show="question.title_image_url">
    						<img :src="question.title_image_url" alt="">
    						<span>图片预览</span>
    					</div>
    					<div v-show="question.title_audio_id" class="conclude-media">
    						<img :src="question.title_audio_id" alt="" @click="previewMedia(0, question.title_audio_id)">
    						<span>语音</span>
    					</div>

                        <div v-show="question.title_video_id" class="conclude-media">
    						<img :src="question.title_video_id" alt="" @click="previewMedia(0, question.title_video_id)" >
    						<span>视频</span>
    					</div>
    				</div>
    			</el-form-item>
                <!-- 题目正确提示 -->
                <el-form-item label='正确提示' prop="success_messages" v-if='questionType == 1||questionType==2||questionType==3'>
                    <el-col :span="5" align='left'>
                        <el-button type="info" @click='successOptions'>正确提示配置</el-button>
                    </el-col>
                </el-form-item>
                <!-- 题目错误提示 -->
                <el-form-item label='错误提示' prop="error_messages" v-if='questionType == 1||questionType==2||questionType==3'>
                    <div v-for='(SubjectOption, index) in failedSubjectOptions' style="margin-bottom:10px;">
                        <el-row>
                            <el-col :span="5" align='left'>
                                <el-button type="info" @click='failedOptions(index, 0)'>错误提示{{index+1}}配置</el-button>
                            </el-col>
                            <el-col :span="2" align='left'>
                                <el-button type="text" icon="circle-close"  @click='delFailedSubjectOptions(index, 0)' v-if='failedSubjectOptions.length>=2'></el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- <el-col :span="2" class="line" align='center'><el-button type="primary" icon="plus" size="mini" @click='addFailedSubjectOptions'></el-button></el-col> -->
                </el-form-item>
                <el-form-item label='标题图片url' prop="title_image_url">
  					<!-- <el-input v-model='question.title_image_url' auto-complete='off'></el-input> -->
                    <UploadMethods :oProp="0" :oVal="'title_image_url'" :oTags="'测试'" :oClearForm="addFormVisible" v-on:child-say='assignVal'></UploadMethods>
                </el-form-item>
                <el-form-item label='标题音频' prop="title_audio_id">
                    <!-- <el-input v-model='question.title_audio_url' auto-complete='off'></el-input> -->
                    <UploadMethods :oProp="2" :oVal="'title_audio_id'" :oTags="'测试'" :oClearForm="addFormVisible" v-on:child-say='assignVal'></UploadMethods>
                </el-form-item>
                <el-form-item label='标题视频' prop="title_video_id">
  				    <!-- <el-input v-model='question.title_video_url' auto-complete='off'></el-input> -->
                    <UploadMethods :oProp="1" :oVal="'title_video_id'" :oTags="'测试'" :oClearForm="addFormVisible" v-on:child-say='assignVal'></UploadMethods>
                </el-form-item>
    			<el-form-item label='是否有效' prop="status">
					<el-radio class="radio" v-model="question.status" label='1'>有效</el-radio>
				    <el-radio class="radio" v-model="question.status" label='0'>无效</el-radio>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addQuestionBank">提交</el-button>
            </div>
      </el-dialog>

      <!-- 编辑页面弹窗 -->
        <el-dialog title='编辑' :visible.sync="editFormVisible" :close-on-click-modal='false'>
            <el-form :model='editQuestion' label-width='100px' ref='editQuestion' :rules="questionRules">
			    <el-form-item label='题库标题' prop="title">
					<el-input v-model='editQuestion.title' auto-complete='off'></el-input>
			    </el-form-item>
          	    <el-form-item label='题库英文标题' prop="en_title">
  					<el-input v-model='editQuestion.en_title' auto-complete='off'></el-input>
                </el-form-item>
                <el-form-item label='题库类型' prop="type">
                    <el-select  placeholder="类型" v-model="editQuestion.type" disabled>
                       <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
                       </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='所属试卷' prop="examination_id">
                    <el-select v-model="editQuestion.examination_id" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchExaminationFunc">
                        <el-option
                            v-for="item in examinationOptions"
                            :key="item.id"
                            :label="'（' + item.id + '）' + item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='模版实例id' prop="templateinstance_id"  v-if='editQuestion.type == 4'>
                    <el-select v-model="editQuestion.templateinstance_id" placeholder="请输入课程关键词或ID" style="width:300px;" filterable clearable remote :remote-method="searchTemplateFunc">
                        <el-option
                            v-for="item in templateOptions"
                            :key="item.id"
                            :label="'（' + item.id + '）' + item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label='填空题答案' prop="fill_answer"  v-if='editQuestion.type == 3'>
                    <el-input v-model='editQuestion.fill_answer' auto-complete='off'></el-input>
                </el-form-item>
                <el-form-item label='选择题选项' prop="" v-if='editQuestion.type == 1||editQuestion.type==2'>
                    <div v-for='(item, index) in editQuestion.options' style="padding-bottom:10px;">
                        <el-row>
                            <el-col :span="5" align='left'>
                                <el-button type="info" @click='optionConf(index, 1, item)'>选择题{{index+1}}配置</el-button>
                            </el-col>
                            <el-col :span="5" align='left'>
                                <el-radio  v-model="editQuestion.radioAnswer" :label="(index+1)" v-if='editQuestion.type==1'>是否正确</el-radio>
                                <el-checkbox v-model="editQuestion.checkboxAnswer" :label="(index+1)" v-if='editQuestion.type==2'>是否正确</el-checkbox>
                            </el-col>
                            <el-col :span="2" align='left'>
                                <el-button type="text" icon="circle-close"  @click='delChooseOptions(1, index)' v-if='editQuestion.options.length>3'></el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <el-col :span="2" class="line" align='center'><el-button type="primary" icon="plus" size="mini" @click='addEditChoose'></el-button></el-col>
                </el-form-item>


                <!-- 题目正确提示 -->
                <el-form-item label='正确提示' prop="success_messages" v-if='editQuestion.type == 1||editQuestion.type==2||editQuestion.type==3'>
                    <el-col :span="5" align='left'>
                        <el-button type="info" @click='successOptions'>正确提示配置</el-button>
                    </el-col>
                </el-form-item>
                <!-- 题目错误提示 -->
                <el-form-item label='错误提示' prop="error_messages" v-if='editQuestion.type == 1||editQuestion.type==2||editQuestion.type==3'>
                    <div v-for='(SubjectOption, index) in failedSubjectOptions' style="margin-bottom:10px;">
                        <el-row>
                            <el-col :span="5" align='left'>
                                <el-button type="info" @click='failedOptions(index, 0)'>错误提示配置</el-button>
                            </el-col>
                            <el-col :span="2" align='left'>
                                <el-button type="text" icon="circle-close"  @click='delFailedSubjectOptions(index, 0)' v-if='failedSubjectOptions.length>=2'></el-button>
                            </el-col>
                        </el-row>
                    </div>
                    <!-- <el-col :span="2" class="line" align='center'><el-button type="primary" icon="plus" size="mini" @click='addFailedSubjectOptions'></el-button></el-col> -->
                </el-form-item>
                <el-form-item label="标题配置预览" v-show="editQuestion.title_image_url || editQuestion.title_audio_id || editQuestion.title_video_id">
                    <div class="preview-container">
                        <div v-show="editQuestion.title_image_url">
                            <img :src="editQuestion.title_image_url" alt="">
                            <span>图片预览</span>
                        </div>
                        <div v-show="editQuestion.title_audio_id" class="conclude-media">
                            <img :src="editQuestion.title_audio_id" alt="" @click="previewMedia(0, editQuestion.title_audio_id)">
                            <span>语音</span>
                        </div>
                        <div v-show="editQuestion.title_video_id" class="conclude-media">
                            <img :src="editQuestion.title_video_id" alt="" @click="previewMedia(0, editQuestion.title_video_id)" >
                            <span>视频</span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label='标题图片url' prop="title_image_url">
                    <UploadMethods :oProp="0" :oVal="'title_image_url'" :oClearForm="editFormVisible" v-on:child-say='editAssignVal'></UploadMethods>
                </el-form-item>
                <el-form-item label='标题音频' prop="title_audio_id">
                    <UploadMethods :oProp="2" :oVal="'title_audio_id'" :oClearForm="editFormVisible" v-on:child-say='editAssignVal'></UploadMethods>
                </el-form-item>
                <el-form-item label='标题视频' prop="title_video_id">
                    <UploadMethods :oProp="1" :oVal="'title_video_id'" :oClearForm="editFormVisible" v-on:child-say='editAssignVal'></UploadMethods>
                </el-form-item>
    			<el-form-item label='是否有效' prop="status">
					<el-radio class="radio" v-model="editQuestion.status" label='1'>有效</el-radio>
				    <el-radio class="radio" v-model="editQuestion.status" label='0'>无效</el-radio>
                </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click.native="editFormVisible = false">取消</el-button>
                <el-button type="primary" @click.native="editQuestionBank">提交</el-button>
            </div>
        </el-dialog>
        <!-- 选择题配置选项 -->
        <el-dialog title='选择题设置' :visible.sync="optionsFormVisible" :close-on-click-modal='false'>
            <el-form :model='chooseOptions' label-width='100px'>
                <el-form-item label='选择题标题' prop="title">
                    <el-input v-model='chooseOptions.title' auto-complete='off'></el-input>
                </el-form-item>
                <el-form-item label='英文标题' prop="enTitle">
                    <el-input v-model='chooseOptions.enTitle' auto-complete='off'></el-input>
                </el-form-item>
                <el-form-item label="预览" v-show="chooseOptions.imageUrl || chooseOptions.audioMaterialId || chooseOptions.videoMaterialId">
                    <div class="preview-container">
                        <div v-show="chooseOptions.imageUrl">
                            <img :src="chooseOptions.imageUrl" alt="">
                            <span>图片预览</span>
                        </div>
                        <div v-show="chooseOptions.audioMaterialId" class="conclude-media">
                            <img :src="chooseOptions.audioMaterialId" alt="" @click="previewMedia(0, chooseOptions.audioMaterialId)">
                            <span>语音</span>
                        </div>

                        <div v-show="chooseOptions.videoMaterialId" class="conclude-media">
                            <img :src="chooseOptions.videoMaterialId" alt="" @click="previewMedia(0, chooseOptions.videoMaterialId)" >
                            <span>视频</span>
                        </div>
                      </div>
                  </el-form-item>
                <el-form-item label='图片链接' prop="imageUrl">
                    <UploadMethods :oProp="0" :oVal="'imageUrl'" :oTags="'测试'" :oClearForm="optionsFormVisible" v-on:child-say='optionsAssignVal'></UploadMethods>
                </el-form-item>
                <el-form-item label='选项音频' prop="audioMaterialId">
                    <UploadMethods :oProp="2" :oVal="'audioMaterialId'" :oTags="'测试'" :oClearForm="optionsFormVisible" v-on:child-say='optionsAssignVal'></UploadMethods>
                </el-form-item>
                <el-form-item label='选项视频' prop="videoMaterialId">
                    <UploadMethods :oProp="1" :oVal="'videoMaterialId'" :oTags="'测试'"  :oClearForm="optionsFormVisible" v-on:child-say='optionsAssignVal'></UploadMethods>
                    <!-- <el-input v-model='chooseOptions.videoUrl' auto-complete='off'></el-input> -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type='primary' @click='optionsFormVisible=false'>取消</el-button>
                <el-button type="primary" @click='submitOptions'>提交</el-button>
            </div>
        </el-dialog>
        <!-- 正确或者错误提示 -->
        <el-dialog title='答案提示' :visible.sync="answerOptionsFormVisible" :close-on-click-modal='false'>
            <el-form :model='subjectOptions' label-width='100px'>
                <el-form-item label="预览" v-show="subjectOptions.imageUrl || subjectOptions.audioMaterialId || subjectOptions.videoMaterialId">
                    <div class="preview-container">
                        <div v-show="subjectOptions.imageUrl">
                            <img :src="subjectOptions.imageUrl" alt="">
                            <span>图片预览</span>
                        </div>
                        <div v-show="subjectOptions.audioMaterialId" class="conclude-media">
                            <img :src="subjectOptions.audioMaterialId" alt="" @click="previewMedia(0, subjectOptions.audioMaterialId)">
                            <span>语音</span>
                        </div>

                        <div v-show="subjectOptions.videoMaterialId" class="conclude-media">
                            <img :src="subjectOptions.videoMaterialId" alt="" @click="previewMedia(0, subjectOptions.videoMaterialId)" >
                            <span>视频</span>
                        </div>
                      </div>
                  </el-form-item>
                <el-form-item label='图片链接' prop="imageUrl">
                    <UploadMethods :oProp="0" :oVal="'imageUrl'" :oTags="'测试'" :oClearForm="answerOptionsFormVisible" v-on:child-say='subjectAssignVal'></UploadMethods>
                </el-form-item>
                <el-form-item label='选项音频' prop="audioMaterialId">
                    <UploadMethods :oProp="2" :oVal="'audioMaterialId'" :oTags="'测试'" :oClearForm="answerOptionsFormVisible" v-on:child-say='subjectAssignVal'></UploadMethods>
                </el-form-item>
                <el-form-item label='选项视频' prop="videoMaterialId">
                    <UploadMethods :oProp="1" :oVal="'videoMaterialId'" :oTags="'测试'"  :oClearForm="answerOptionsFormVisible" v-on:child-say='subjectAssignVal'></UploadMethods>
                    <!-- <el-input v-model='subjectOptions.videoUrl' auto-complete='off'></el-input> -->
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type='primary' @click='answerOptionsFormVisible=false'>取消</el-button>
                <el-button type="primary" @click='submitAnswerOptions'>提交</el-button>
            </div>
        </el-dialog>
        <div class="preview-audio-container" v-show="previewAudioVisible">
            <div class="mask" @click="stopPreviewAudio"></div>
            <audio controls ref="oAudio"></audio>
        </div>
        <div class="preview-video-container" v-show="previewVideoVisible">
            <div class="mask" @click="stopPreviewVideo"></div>
            <video controls ref="oVideo"></video>
        </div>
    </div>
</template>

<script>
import {
	getExamList,
	getQuestionList,
	addQuestion,
	updateQuestion,
	getTemplateList,
	getMaterialsList,
	getDownloadUrl
} from '../../api/api'
import UploadMethods from '../../components/word-sentence-library/uploadMethods.vue'
import Vue from 'vue'
export default {
	data() {
		return {
			//查询数据初始化
			filter: {
				id: '',
				title: '',
				type: '',
				status: ''
			},
			//status数据初始化
			isValue: [{
					label: '有效',
					value: '1'
				},
				{
					label: '无效',
					value: '0'
				},
			],
			//type类型初始化
			types: [{
					label: '填空题',
					value: 3
				},
				{
					label: '单选题',
					value: 1
				},
				{
					label: '多选题',
					value: 2
				},
				{
					label: 'H5互动题',
					value: 4
				},
			],
			//表单验证
			questionRules: {
				title: [{
					required: true,
					message: '请输入试卷名称',
					trigger: 'blur'
				}],
				type: [{
					type: 'number',
					required: true,
					message: '请输入试卷类型',
					trigger: 'change'
				}],
				templateinstance_id: [{
					type: 'number',
					required: true,
					message: '请输入地图url',
					trigger: 'blur'
				}],
				fill_answer: [{
					required: true,
					message: '请输入填空题答案',
					trigger: 'blur'
				}]
			},
			//分页数据
			totalCount: 0,
			questionPage: 1,
			//题库列表数据初始化
			questionList: [],
			//模版实例数据列表初始化
			templateOptions: [],
			//试卷实例数据列表初始化
			examinationOptions: [],
			//弹窗是否显示初始化
			addFormVisible: false,
			editFormVisible: false,
			questionListLoading: false,
			confFormVisible: false,
			optionsFormVisible: false,
			answerOptionsFormVisible: false,
			isAddOrEdit: 0,
			//试卷数据初始化
			examList: {
				list: [],
				totalNum: 0,
				totalPage: 0,
				page: 1
			},
			//题目类型
			questionType: 0,
			//题库初始化数据
			question: {
				title: '',
				en_title: '',
				type: '',
				examination_id: '',
				templateinstance_id: '',
				title_image_url: '',
				title_audio_url: '',
				title_video_url: '',
				status: '1',
				question_options: '',
				fill_answer: '',
				radio_answer: '',
				checkbox_answer: [],
				success_messages: '',
				error_messages: ''
			},
			emFormVisible: false,
			previewVideoVisible: false, //  预览播放器
			previewAudioVisible: false,
			option: {
				isTrue: false
			},
			// 当前选择题选项
			chooseOptions: {

			},
			// 当前选择题选项
			chooseOptionsArr: [{

			}, {

			}, {

			}],
			chooseIndex: 0, // 第几道选择题
			// 选项内容
			optionsType: 0,
			//编辑题库数据初始化
			editQuestion: {
				title: '',
				en_title: '',
				type: '',
				examination_id: '',
				templateinstance_id: '',
				title_image_url: '',
				title_audio_id: '',
				title_video_id: '',
				status: '1',
				fill_answer: '',
				question_options: '',
				radioAnswer: '',
				checkboxAnswer: ''
			},
			subjectOptions: {},
			successSubjectOptions: {},
			failedSubjectOptions: [{

			}],
			isRightOrWrong: 0, // 判断是正确提示还是错误提示
			failedOptionsIndex: 0, // 错误提示的按钮index
		}
	},
	components: {
		UploadMethods
	},
	methods: {
		/*
		  清空输入框内的值操作
		*/
		handleIconClick_clearId() {
			this.filter.id = '';
		},
		handleIconClick_clearName() {
			this.filter.title = ''
		},
		/*
		    点击查询操作
		*/
		queryQuestion() {
			this.loadList();
		},
		/*
		    分页操作
		*/
		handleCurrentChange(page) {
			this.loadList(page);
			this.questionPage = page;
		},
		/*
		  点击新增操作
		*/
		addQuestion() {
			this.isAddOrEdit = 0;
			this.chooseOptions = {
				title: '',
				en_title: '',
				imageUrl: '',
				audioMaterialId: '',
				videoMaterialId: ''
			}
			this.addFormVisible = true;
			this.question = {
				title: '',
				en_title: '',
				type: '',
				examination_id: '',
				templateinstance_id: '',
				title_image_url: '',
				title_audio_id: '',
				title_video_id: '',
				status: '1',
				question_options: '',
				radio_answer: [],
				checkbox_answer: [],
				success_messages: '',
				error_messages: ''
			};
			this.successSubjectOptions = {};
			this.failedSubjectOptions = [{}];
			this.chooseOptionsArr = [{}, {}, {}]
		},
		/*
		    新增接口调用
		*/
		addQuestionBank() {
			this.$refs.question.validate(valid => {
				let flag = false;
				let optionsFlag = true;
				if (valid) {
					console.log(this.question);
					if (this.questionType == 1 || this.questionType == 2) {
						if (this.chooseOptionsArr && this.chooseOptionsArr.length) {
							this.chooseOptionsArr.map((item, index) => {
								if (Object.keys(item).length == 0) {
									// this.$notify({
									// 	title: '失败',
									// 	message: '选项不能为空',
									// 	type: 'error'
									// })
									optionsFlag = false;
								}
								if (item.audioMaterialId) {
									item.audioConfig = {
										materialId: item.audioMaterialId
									}
									delete item.audioMaterialId
								}
								if (item.videoMaterialId) {
									item.videoConfig = {
										materialId: item.videoMaterialId
									}
									delete item.videoMaterialId
								}
							})
						}
						this.question.question_options = JSON.stringify(this.chooseOptionsArr);
						if (this.questionType == 1) {
							if (this.question.radio_answer.length != 0) {
								flag = true
							}
						} else {
							if (this.question.checkbox_answer.length > 1) {
								flag = true
							}
						}

					} else {
						this.question.question_options = ''
					}
					if ((this.questionType == 1 || this.questionType == 2)) {
						if (!flag) {
							this.$notify({
								title: '失败',
								message: '正确答案不能为空',
								type: 'error'
							})
							return
						}
						if (!optionsFlag) {
							this.$notify({
								title: '失败',
								message: '选项不能为空',
								type: 'error'
							})
							return
						}
					}
					let para = Object.assign({}, this.question);
					para['status'] = Number(para['status']);
					para['checkbox_answer'] = this.question.checkbox_answer.join(',')
					para['templateinstance_id'] = Number(para['templateinstance_id']);
					if (para['error_messages'] = JSON.stringify(this.failedSubjectOptions) !== '[{}]') {
						para['error_messages'] = JSON.stringify(this.failedSubjectOptions)
					} else {
						para['error_messages'] = ''
					}
					delete para['examination_name'];
					addQuestion(para).then(res => {
							if (res.data.success) {
								this.$notify({
									title: '新增成功',
									message: '新增题目信息成功',
									type: 'success'
								});
							} else {
								this.$message.error(res.data.msg || '未知错误，请联系管理员');
							}
							this.loadList(1);
							this.addFormVisible = false;
						})
						.catch(err => {
							this.addFormVisible = false;
							this.errorFunction(err)
						})
					this.chooseOptionsArr = [{}, {}, {}]
					this.chooseOptions = {
						title: '',
						en_title: '',
						imageUrl: '',
						audioMaterialId: '',
						videoMaterialId: ''
					};

				} else {
					this.$notify({
						title: '失败',
						message: '请填入必填项',
						type: 'error'
					})
				}
			})
		},

		/*
		    点击编辑操作
		*/
		editQues(item, index) {
			this.isAddOrEdit = 1;
			this.editFormVisible = true;
			let dataEntity = item.entity;
			let dataConf = item.conf;
			this.editQuestion = {
				id: '',
				title: '',
				en_title: '',
				type: '',
				examination_id: '',
				templateinstance_id: '',
				title_image_url: '',
				title_audio_id: '',
				title_video_id: '',
				status: '',
				fill_answer: '',
				options: '',
				radioAnswer: '',
				checkboxAnswer: '',
				success_messages: '',
				error_messages: ''
			};
			this.editQuestion = {
				id: dataEntity.id,
				title: dataEntity.title,
				en_title: dataEntity.enTitle,
				type: dataEntity.type,
				examination_id: dataEntity.examinationId,
				templateinstance_id: dataConf.templateInstanceId,
				status: dataEntity.stat + '',
			};
			if (dataConf.titleImageUrl) {
				this.$set(this.editQuestion, 'title_image_url', dataConf.titleImageUrl)
			}
			if (dataConf.audioConfig) {
				this.$set(this.editQuestion, 'title_audio_id', dataConf.audioConfig.materialId)
			}
			if (dataConf.videoConfg) {
				this.$set(this.editQuestion, 'title_video_id', dataConf.videoConfg.materialId)
			}
			if (dataConf.questionAnswer) {
				this.editQuestion.fill_answer = dataConf.questionAnswer.fillAnswer;
			}
			if (dataConf.questionOptionList) {
				this.$set(this.editQuestion, 'options', dataConf.questionOptionList)
				// this.editQuestion.options = dataConf.questionOptionList;
				if (dataConf.questionOptionList && dataConf.questionOptionList.length) {
					dataConf.questionOptionList.map(item => {
						if (item.audioConfig) {
							item.audioMaterialId = item.audioConfig.materialId;
							delete item.audioConfig
						}
						if (item.videoConfig) {
							item.videoMaterialId = item.videoConfig.materialId;
							delete item.videoConfig
						}
					})
				}
				// item.audioConfig && !item.audioMaterialId
				// this.chooseOptionsArr = Object.assign([], this.editQuestion.options)
			}
			if (dataConf.questionAnswer) {
				this.$set(this.editQuestion, 'radioAnswer', dataConf.questionAnswer.radioAnswer)
			}
			if (dataConf.questionAnswer) {
				this.$set(this.editQuestion, 'checkboxAnswer', dataConf.questionAnswer.checkboxAnswer)
			}
			if (dataConf.questionMessages) {
				this.editQuestion.successSubjectOptions = dataConf.questionMessages.successMessage;
				if (dataConf.questionMessages.errorMessage && dataConf.questionMessages.errorMessage.length > 0) {
					this.editQuestion.failedSubjectOptions = dataConf.questionMessages.errorMessage;
				} else {
					this.editQuestion.failedSubjectOptions = [{}];
				}
			} else {
				this.editQuestion.failedSubjectOptions = [{}];
			}
		},
		/*
		    更新question接口调用
		*/
		editQuestionBank() {
			this.$refs.editQuestion.validate(valid => {
				if (valid) {
					this.$confirm('是否确认修改?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						// let para = Object.assign({}, this.editQuestion);
						let para = {
							id: this.editQuestion.id,
							title: this.editQuestion.title,
							en_title: this.editQuestion.en_title,
							type: this.editQuestion.type,
							examination_id: this.editQuestion.examination_id,
							fill_answer: this.editQuestion.fill_answer,
							templateinstance_id: this.editQuestion.templateinstance_id,
							title_image_url: this.editQuestion.title_image_url,
							title_audio_id: this.editQuestion.title_audio_id,
							title_video_id: this.editQuestion.title_video_id,
						}
						let optionsFlag = true;
						// this.editQuestion.options = this.chooseOptionsArr;

						if (this.editQuestion.type == 1 || this.editQuestion.type == 2) {
							if (this.editQuestion.options && this.editQuestion.options.length) {
								this.editQuestion.options.map((item, index) => {
									if (Object.keys(item).length == 0) {
										optionsFlag = false;
									}
									// if (item.audioConfig) {
									// 	delete item.audioConfig
									// }
									// if (item.videoConfig) {
									// 	delete item.videoConfig
									// }
									if (item.audioMaterialId) {
										item.audioConfig = {
											materialId: item.audioMaterialId
										}
										delete item.audioMaterialId
									}
									if (item.videoMaterialId) {
										item.videoConfig = {
											materialId: item.videoMaterialId
										}
										delete item.videoMaterialId
									}
								})
							}
						}
						if (JSON.stringify(this.editQuestion.failedSubjectOptions) !== '[{}]') {
							if (this.editQuestion.failedSubjectOptions && this.editQuestion.failedSubjectOptions.length) {
								this.editQuestion.failedSubjectOptions.map((item, index) => {
									let audioMaterialId = '';
									let videoMaterialId = '';
									if (item.audioConfig) {
										audioMaterialId = item.audioConfig.materialId;
										delete item.audioConfig
									}
									if (item.videoConfig) {
										videoMaterialId = item.videoConfig.materialId;
										delete item.videoConfig
									}
									item.audioConfig = {
										materialId: audioMaterialId
									}
									item.videoConfig = {
										materialId: videoMaterialId
									}
								})
							}
						}

						this.editQuestion.success_messages = JSON.stringify(this.editQuestion.successSubjectOptions)
						this.editQuestion.error_messages = JSON.stringify(this.editQuestion.failedSubjectOptions)
						para['question_options'] = JSON.stringify(this.editQuestion.options);
						if (this.editQuestion.error_messages != '[{}]') {
							para['error_messages'] = this.editQuestion.error_messages;
						} else {
							para['error_messages'] = ''
						}
						para['success_messages'] = this.editQuestion.success_messages;
						para['status'] = Number(this.editQuestion.status)
						console.log(optionsFlag)
						if (!optionsFlag) {
							this.$notify({
								title: '失败',
								message: '选项不能为空',
								type: 'error'
							});
							return
						}
						if (this.editQuestion.radioAnswer) {
							para['radio_answer'] = this.editQuestion.radioAnswer
						}
						if (this.editQuestion.checkboxAnswer) {
							para['checkbox_answer'] = this.editQuestion.checkboxAnswer.join(',');
						}
						updateQuestion(para).then(res => {
								if (res.data.success) {
									this.$notify({
										title: '修改成功',
										message: '修改题目信息成功',
										type: 'success'
									});
								} else {
									this.$message.error(res.data.msg || '未知错误，请联系管理员');
								}
								this.loadList(1);
								this.editFormVisible = false;
							})
							.catch(err => {
								this.editFormVisible = false;
								this.errorFunction(err)
							})
					}).catch(() => {
						this.editFormVisible = false;
					});
				}
			})
		},
		/**
		 *  选择题配置弹窗
		 */
		optionConf(index, type, item) {
			// this.chooseOptions = {
			// 	videoMaterialId: '',
			// 	audioMaterialId: '',
			// 	imgUrl: ''
			// };
			this.chooseIndex = index;
			this.optionsFormVisible = true;
			if (type == 0) {
				if (this.questionType == 1 || this.questionType == 2) {
					this.chooseOptions = Object.assign({}, this.chooseOptionsArr[index]);
				}
				// } else {
				// 	this.chooseOptions = Object.assign({}, this.moreChooseArr[index]);
				// }
			} else {
				if (item.audioConfig) {
					item.audioMaterialId = item.audioConfig.materialId;
					delete item.audioConfig
				}
				if (item.videoConfig) {
					item.videoMaterialId = item.videoConfig.materialId;
					delete item.videoConfig
				}
				this.chooseOptions = Object.assign({}, item);
			}
		},

		/**
		 * 判断对象是否为空
		 */
		objIsEmpty(obj) {
			for (var name in obj) {
				return false
			}
			return true
		},
		/**
		 *  答案正确提示
		 */
		successOptions() {
			this.answerOptionsFormVisible = true;
			this.isRightOrWrong = 0;
			if (this.isAddOrEdit == 0) {
				this.subjectOptions = Object.assign({}, this.successSubjectOptions);
			} else {
				this.subjectOptions = Object.assign({}, this.editQuestion.successSubjectOptions);
			}
			if (this.subjectOptions.audioConfig) {
				this.subjectOptions.audioMaterialId = this.subjectOptions.audioConfig.materialId;
			}
			if (this.subjectOptions.videoConfig) {
				this.subjectOptions.videoMaterialId = this.subjectOptions.videoConfig.materialId;
			}
		},
		/**
		 *  答案错误提示
		 */
		failedOptions(index) {
			this.answerOptionsFormVisible = true;
			this.isRightOrWrong = 1;
			if (this.isAddOrEdit == 0) {
				this.subjectOptions = Object.assign({}, this.failedSubjectOptions[index]);
			} else {
				this.subjectOptions = Object.assign({}, this.editQuestion.failedSubjectOptions[index]);
			}
			if (this.subjectOptions.audioConfig) {
				this.subjectOptions.audioMaterialId = this.subjectOptions.audioConfig.materialId;
			}
			if (this.subjectOptions.videoConfig) {
				this.subjectOptions.videoMaterialId = this.subjectOptions.videoConfig.materialId;
			}
			this.failedOptionsIndex = index;
		},
		addFailedSubjectOptions() {
			this.failedSubjectOptions.push({});
		},
		/**
		 * 删除错误提示
		 */
		delFailedSubjectOptions(index) {
			this.$confirm('此操作将删除选项, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				this.failedSubjectOptions.splice(index, 1)
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch(() => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},
		/**
		 * 答案提示提交submit
		 */
		submitAnswerOptions() {
			if (this.isRightOrWrong == 0) {
				this.successSubjectOptions = Object.assign({}, this.subjectOptions);
				if (this.successSubjectOptions.audioMaterialId) {
					this.successSubjectOptions.audioConfig = {
						'materialId': this.successSubjectOptions.audioMaterialId
					}
					delete this.successSubjectOptions.audioMaterialId;
				}
				if (this.successSubjectOptions.videoMaterialId) {
					this.successSubjectOptions.videoConfig = {
						'materialId': this.successSubjectOptions.videoMaterialId
					}
					delete this.successSubjectOptions.videoMaterialId;
				}
				if (this.isAddOrEdit == 0) {
					this.question.success_messages = JSON.stringify(this.successSubjectOptions);
				} else {
					this.editQuestion.successSubjectOptions = Object.assign({}, this.successSubjectOptions)
					// this.editQuestion.success_messages = JSON.stringify(this.successSubjectOptions);
				}
			} else {
				this.failedSubjectOptions[this.failedOptionsIndex] = Object.assign({}, this.subjectOptions)
				if (this.failedSubjectOptions[this.failedOptionsIndex].audioMaterialId) {
					this.failedSubjectOptions[this.failedOptionsIndex].audioConfig = {
						'materialId': this.failedSubjectOptions[this.failedOptionsIndex].audioMaterialId
					}
					delete this.failedSubjectOptions[this.failedOptionsIndex].audioMaterialId;
				}
				if (this.failedSubjectOptions[this.failedOptionsIndex].videoMaterialId) {
					this.failedSubjectOptions[this.failedOptionsIndex].videoConfig = {
						'materialId': this.failedSubjectOptions[this.failedOptionsIndex].videoMaterialId
					}
					delete this.failedSubjectOptions[this.failedOptionsIndex].videoMaterialId;
				}
				if (this.isAddOrEdit == 1) {
					this.editQuestion.failedSubjectOptions = this.failedSubjectOptions;
				}
			}

			this.answerOptionsFormVisible = false;
		},
		/**
		 * 提交选择题选项
		 */
		submitOptions() {
			let flag = false;
			for (let porp in this.chooseOptions) {
				if (this.chooseOptions[porp] != '') {
					flag = true;
				}
			}
			if (flag) {
				if (this.isAddOrEdit == 0) {
					if (this.questionType == 1 || this.questionType == 2) {
						this.chooseOptionsArr[this.chooseIndex] = Object.assign({}, this.chooseOptions);
					}
				} else {
					this.editQuestion.options[this.chooseIndex] = Object.assign({}, this.chooseOptions);
					// this.editQuestion.options[this.chooseIndex] = Object.assign({}, this.chooseOptions);
					// this.editQuestion.options = this.chooseOptionsArr;
				}
				this.optionsFormVisible = false;
			} else {
				this.$notify({
					title: '失败',
					message: '选项不能都为空',
					type: 'error'
				})
			}

		},
		// 增加选项按钮
		addChoose() {
			this.chooseOptionsArr.push({});
		},
		//增加编辑选项
		addEditChoose() {
			this.editQuestion.options.push({})
		},
		/***
		 * @description 与组件的交互
		 * @function 接收子组件的值并给form表单赋值
		 */
		assignVal(val) {
			// if (type == 0) {
			val.oProp == 0 ?
				this.$set(this.question, val.oVal, val.url) :
				this.$set(this.question, val.oVal, val.id);
			// } else {
			// 	val.oProp == 0 ?
			// 		this.$set(this.chooseOptions, val.oVal, val.url) :
			// 		this.$set(this.chooseOptions, val.oVal, val.id);
			// }
		},
		/***
		 * @description 与组件的交互
		 * @function 接收子组件的值并给form表单赋值
		 */
		editAssignVal(val) {
			val.oProp == 0 ?
				this.$set(this.editQuestion, val.oVal, val.url) :
				this.$set(this.editQuestion, val.oVal, val.id);
		},
		optionsAssignVal(val) {
			if (this.isAddOrEdit == 0) {
				val.oProp == 0 ?
					this.$set(this.chooseOptions, val.oVal, val.url) :
					this.$set(this.chooseOptions, val.oVal, val.id);
			} else {
				val.oProp == 0 ?
					this.$set(this.chooseOptions, val.oVal, val.url) :
					this.$set(this.chooseOptions, val.oVal, val.id);
			}
		},
		subjectAssignVal(val) {
			val.oProp == 0 ?
				this.$set(this.subjectOptions, val.oVal, val.url) :
				this.$set(this.subjectOptions, val.oVal, val.id);
		},
		/***
		 * @description 与组件的交互
		 * @function 预览
		 */
		previewMedia(flag, temp) {
			let id;
			if (flag == 1) {
				if (!temp) {
					this.$notify({
						title: "警告",
						message: "未配置音视频",
						type: "warning"
					});
					return false;
				} else {
					id = temp.id;
				}
			} else {
				id = temp;
			}
			if (id) {
				getMaterialsList({
					id: id
				}).then(res => {
					if (res.data.success) {
						let mp4Reg = /\.mp4$/;
						let mp3Reg = /\.mp3$/;
						let responseEntity = res.data.data.items[0].entity;
						getDownloadUrl({
							id: id
						}).then(res => {
							if (res.data.success) {
								if (mp4Reg.test(responseEntity.url)) {
									this.previewVideoVisible = true;
									this.previewAudioVisible = false;
									this.$refs.oAudio.pause();
									this.$refs.oVideo.src = res.data.data.url;
									this.$refs.oVideo.play();
								}
								if (mp3Reg.test(responseEntity.url)) {
									this.previewAudioVisible = true;
									this.previewVideoVisible = false;
									this.$refs.oVideo.pause();
									this.$refs.oAudio.src = res.data.data.url;
									this.$refs.oAudio.play();
								}
							} else {
								this.$notify({
									title: "错误",
									message: res.data.msg,
									type: "error"
								});
							}
						});
					} else {
						this.$notify({
							title: "错误",
							message: res.data.msg,
							type: "error"
						});
					}
				});
			} else {
				this.$notify({
					title: "警告",
					message: "未配置音视频",
					type: "warning"
				});
			}
		},
		stopPreviewVideo() {
			this.previewVideoVisible = !this.previewVideoVisible;
			this.$refs.oVideo.pause();
		},
		stopPreviewAudio() {
			this.previewAudioVisible = !this.previewAudioVisible;
			this.$refs.oAudio.pause();
		},
		/**
		 * 删除选项按钮
		 */
		delChooseOptions(type, index) {
			this.$confirm('此操作将删除选项, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then(() => {
				if (type == 0) {
					this.chooseOptionsArr.splice(index, 1);
				} else {
					this.editQuestion.options.splice(index, 1);
				}
				this.$message({
					type: 'success',
					message: '删除成功!'
				});
			}).catch((err) => {
				this.$message({
					type: 'info',
					message: '已取消删除'
				});
			});
		},

		// 问题类型
		quesType(item) {
			this.questionType = item;
		},
		/*
		  初始化题库数据列表
		*/
		loadList(page) {
			this.questionListLoading = true;
			let para = {
				page_size: 20,
				page_index: page,
				id: this.filter.id,
				title: this.filter.title,
				status: this.filter.status,
				type: this.filter.type
			}
			getQuestionList(para).then(res => {
					if (res.data.success) {
						this.questionList = res.data.data.items;
						this.totalCount = res.data.data.totalCount;
						this.questionPage = res.data.data.page;
						if (this.questionList && this.questionList.length) {
							this.questionList.map(item => {
								item.entity.status = item.entity.stat == 1 ? '有效' : '无效'
								switch (item.entity.type) {
									case 1:
										item.entity.typeText = '单选题';
										break;
									case 2:
										item.entity.typeText = '多选题';
										break;
									case 3:
										item.entity.typeText = '填空题';
										break;
									case 4:
										item.entity.typeText = '游戏互动';
										break;
									default:

								}
							})
						}
					} else {
						this.$message.error(res.data.msg || '未知错误，请联系管理员');
					}
					this.questionListLoading = false;
				})
				.catch(err => {
					this.errorFunction(err);
					this.questionListLoading = false;
				})
		},
		/*
		    选择模版数据列表
		*/
		searchTemplateFunc(query) {
			let temp = Number(query);
			let parameter = {};
			if (temp) {
				parameter = {
					id: temp,
				};
			} else {
				parameter = {
					name: query,
				};
			};
			getTemplateList(parameter).then(res => {
					if (res.data.success) {
						if (res.data.data.items && res.data.data.items.length) {
							this.templateOptions = res.data.data.items.map((item) => {
								let tempObj = {
									id: item.entity.id,
									name: item.entity.name,
								}
								return tempObj
							});
						}
					}
				})
				.catch(err => {
					this.errorFunction(err)
				})
		},
		/*
		    选择试卷数据列表
		*/
		searchExaminationFunc(query) {
			let temp = Number(query);
			let parameter = {};
			if (temp) {
				parameter = {
					id: temp,
				};
			} else {
				parameter = {
					name: query,
				};
			};
			getExamList(parameter).then(res => {
				if (res.data.success) {
					if (res.data.data.items && res.data.data.items.length) {
						this.examinationOptions = res.data.data.items.map((item) => {
							let tempObj = {
								id: item.entity.id,
								name: item.entity.name,
							}
							return tempObj
						});
					}
				}
			})
		},

		//errorFunction
		errorFunction(error) {
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
		},
	},
	mounted() {
		this.loadList(1);
	}
}
</script>

<style lang="less" scope>
.preview-audio-container {
    width: 600px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -300px;
    z-index: 9999;
    audio {
        width: 100%;
    }
}
.preview-video-container {
    width: 600px;
    height: 600px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -300px;
    margin-top: -300px;
    z-index: 9999;
    video {
        width: 100%;
    }
}
.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
}
.preview-container {
    width: 100%;
    height: 200px;
    border: 1px solid #ccc;
    overflow-x: scroll;
    display: flex;
    align-items: center;
    div {
        text-align: center;
        margin: 0 10px;
        img {
            width: 140px;
            display: inline-block;
            height: 140px;
            border: 1px dashed #ccc;
        }
        span {
            display: inline-block;
            width: 100%;
            text-align: center;
            height: 30px;
            line-height: 30px;
            // border: 1px solid green;
        }
    }
}
</style>
