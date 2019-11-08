import React from 'react';
import {
  Form,
  Select,
  Input,
  DatePicker,
  Slider,
  Button,
  Checkbox,
  Spin
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import {
  getDataAdvisorGetTemplate, getDatAadvisorGetPlatform,
  getDataadvisorGetInfoData,getDataadvisorGetMotherBaby,
  getDataadvisorPollData,
  IPlatformRes,ITemplateConfig,ITemplate,IMotherBady
} from '@/services/dataQuery';
import PollDataModal from './components/PollDataModal';
import { GlobalModelState } from '@/models/global';
import { IDataQuerystate } from '@/models/dataQuery';
import { ConnectProps,ConnectState } from '@/models/connect'
import { FormComponentProps } from 'antd/es/form';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { IDataQueryState } from './index'

import { selectFilter } from '@/utils';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

let timeStauts:any = null;

interface IMotherBabyProps  extends ConnectProps,ConnectState,IDataQueryState{
  global: GlobalModelState
  dataQuery:IDataQuerystate
  form: FormComponentProps['form']
}

interface IMoreSelect{
  select: any
  key:string
  name:string
}

interface IMotherBabyState {
  templateList: ITemplate[],
  platformList: IPlatformRes[],
  moreSelectList: IMoreSelect[],
  loading: boolean,
  templateStatus:boolean,
  moddalStatus:boolean,
  classify:any,
  count:any,
  content:any[]
}


class MotherBabyFrom extends React.PureComponent<IMotherBabyProps,IMotherBabyState> {



  constructor(props:IMotherBabyProps){
    super(props);
    this.state={
      templateList: [],
      platformList: [],
      moreSelectList: [],
      loading:false,
      templateStatus:false,
      moddalStatus:false,
      classify:null,
      count:null,
      content:[],
    }
  }

  componentDidMount(){
    this.getTemplate()
    // 获取平台数据
    getDatAadvisorGetPlatform(1).then((data:IPlatformRes[]):void => {
      data.unshift({
        name:'全选',
        platformId:'all'
      })
      this.setState({
        platformList: data
      })
    })
    this.addSetTime()
  }

  // 对比数据是否切换到当前页 是的话发起请求 否的话清楚定时器
  componentWillReceiveProps(nextProps:IMotherBabyProps){
    const nextTagVal = nextProps.tagVal;
    const thatTagVal = this.props.tagVal;
    const thatUserId = this.props.global.user.userId;
    const nextUserId = nextProps.global.user.userId;
    if(nextTagVal !== thatTagVal){
      if(nextTagVal === '1'){
        this.addSetTime()
      }
      if(nextTagVal === '2'){
        timeStauts && clearInterval(timeStauts);
      }
    }
    if(thatUserId !== nextUserId){
      this.getTemplate(nextUserId)
    }
  }

  // 判断是否存在uuid并且状态是否完成
  addSetTime(){
    const { MotherBabyUUID,MotherBabyStatus } = this.props.dataQuery;
    if(MotherBabyUUID && MotherBabyUUID !== '' && !MotherBabyStatus){
      this.setTimePollData(MotherBabyUUID)
    }
  }

  // 设置定时器轮询是否完成报告
  setTimePollData = (uuid:string):void => {
    this.setState({
      loading:true
    });
    timeStauts = setInterval(() => {
      getDataadvisorPollData(uuid).then(res => {
        if(res){
          const { classify,count,content } = res;
          const { dispatch } = this.props;
          this.getTemplate();
          clearInterval(timeStauts);
          this.setState({
            loading:false,
            moddalStatus:true,
            classify,count,content
          });
          dispatch && dispatch({
            type: 'dataQuery/setMotherBabyStatus',
            payload : true,
          })
        }
      }).catch(() => {
        clearInterval(timeStauts)
          this.setState({
            loading:false
          });
      });
    }, 10000)
  }

  componentWillUnmount(){
    clearInterval(timeStauts)
  }

  // 获取模版
  getTemplate(userId:number = this.props.global.user.userId){
    if(userId){
      getDataAdvisorGetTemplate(1,userId).then((data:ITemplate[]):void => {
        this.setState({
          templateList: data
        })
      })
    }
  }

  // form 提交
  handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { moreSelectList } = this.state;
        const moreVal = moreSelectList.map(_ => _.key)
        const{ platformId,startValue, endValue,noise,showData,babyDays,keyWords,classifyStatic,template } = values;
        const multipleChoice = [];
        for(const key in values){
          if(moreVal.indexOf(key) >= 0){
            multipleChoice.push({
              [key]:values[key]
            });
          }
        }
        const selectData:IMotherBady = {
          platformId,
          babyDays,
          keyWords,
          classifyStatic,template,
          multipleChoice,
          dataRange:[startValue.format(dateFormat), endValue.format(dateFormat)],
          noisePost:noise.indexOf('noisePost') >= 0 ? 1 : null,
          noiseUser: noise.indexOf('noiseUser') >= 0 ? 1 : null,
          showData: showData.indexOf('showData') >= 0 ? 1 : null,
          showClassifyData: showData.indexOf('showClassifyData') >= 0 ? 1 : null,
        };
        this.setState({
          loading:true
        });
        getDataadvisorGetMotherBaby(selectData).then(res => {
          const { dispatch } = this.props;
          dispatch && dispatch({
            type: 'dataQuery/setMotherBabyUUID',
            payload : res.uuid,
          })
          dispatch && dispatch({
            type: 'dataQuery/setMotherBabyStatus',
            payload : false,
          })

          this.setTimePollData(res.uuid)
        }).catch(() => {
          this.setState({
            loading:false
          });
        });
      }
    });
  };

  // 模版切换
  templateChange = (val:number,option:any) => {
    const { config }:ITemplateConfig = option.props;
    const { platformId,keyWords,dataRange,babyDays,
      classifyStatic,multipleChoice,noiseUser,
      noisePost,showClassifyData,showData } = config;
    const { motherMoreSelect, motherNeed } = this.props.global;
    let moreSelectList:{
      select:any
      key:string
      name:string
    }[] = [];
    let multipleData:{
      [propName: string]: string[]
    } = {};
    let promiseList: Promise<any>[] = [];
    let promiseVal:{
      key:string
      name:string
    }[] = [];
    multipleChoice.map(item => {
      for(const k in item){
        multipleData[k] = item[k]
        const thatData = motherMoreSelect.filter(_ => _.key === k)[0];
        const { key,value } = thatData;
        // 判断是否需要请求远程数据
        if(motherNeed.indexOf(k) >= 0){
          // 异步请求添加至列队
          promiseList.push(getDataadvisorGetInfoData(k))
          promiseVal.push({
            key,
            name:value
          });
        }else{
          moreSelectList.push({
            select:null,
            key,
            name:value
          })
        }
      }
    })
    this.setState({
      loading: true
    })
    Promise.all(promiseList).then(results => {
      for(let i = 0; i < results.length; i++ ){
        moreSelectList.push({
          select:results[i],
          ...promiseVal[i]
        })
      };
      this.setState({
        moreSelectList,
        loading:false
      },() => {
        const noise:(string | null)[] = [noiseUser === '1' ? 'noiseUser': null,noisePost === '1'?'noisePost': null].filter(_ => !!_);
        const showDataVal:(string | null)[] = [showClassifyData === '1' ? 'showClassifyData': null,showData === '1'? 'showData':null ].filter(_ => !!_);
        // 根据模版设置属性
        this.props.form.setFieldsValue({
          platformId,keyWords,babyDays,
          noise,
          showData:showDataVal,
          // classifyStatic,
          startValue:moment(dataRange[0],dateFormat),
          endValue:moment(dataRange[1],dateFormat),
          ...multipleData
        },() => {
          // 判断是否选中分类
          if(showDataVal.indexOf('showClassifyData') >= 0){
            this.props.form.setFieldsValue({
              classifyStatic
            })
          }
         });
      })
    })
  }

  // 筛选条件变更
  moreSelectChange = (val:string[],option:any) => {
    const Len = option.length;
    const { motherNeed } = this.props.global;
    let moreSelectList = this.state.moreSelectList.slice(0);
    if(Len < moreSelectList.length){
      moreSelectList = moreSelectList.filter(item =>  val.indexOf(item.key) >= 0)
      this.setState({
        moreSelectList
      })
      return;
    }
    if(Len > 0){
      const thatVal = option[Len - 1];
      const {children,value} = thatVal.props;
      // 判断是否需要远程请求数据
      if(motherNeed.indexOf(value) >= 0){
        this.setState({
          loading:true
        })
        getDataadvisorGetInfoData(value).then(res => {
          moreSelectList.push({
            select:res,
            key:value,
            name:children
          })
          this.setState({
            moreSelectList
          })
        }).finally(() => {
          this.setState({
            loading:false
          })
        })
      }else{
        moreSelectList.push({
          select:null,
          key:value,
          name:children
        })
        this.setState({
          moreSelectList
        })
      }
    }
  }

  // 是否保存模版
  templateStatusChange = ({target}:CheckboxChangeEvent) => {
    this.setState({
      templateStatus: target.checked
    })
  }

  modalCancel = () => {
    this.setState({
      moddalStatus:false
    })
  }
  // 限制开始时间
  disabledStateDate = (startValue:any) => {
    const endValue = this.props.form.getFieldValue('endValue');
    if (!startValue || !endValue) {
      return startValue > moment().endOf('day').subtract(1, 'd');
    }
    const startVal = startValue.valueOf();
    const endVal = endValue.valueOf();
    const year = 1000 * 60  * 60 * 24 * 365 * 2;
    return startVal > endVal || startVal < (endVal - year) ||  startValue > moment().endOf('day').subtract(1, 'd');
  }
  //  限制结束时间
  disabledEndDate = (endValue:any) => {
    const startValue = this.props.form.getFieldValue('startValue');
    if (!startValue || !endValue) {
      return endValue > moment().endOf('day').subtract(1, 'd');
    }
    const startVal = startValue.valueOf();
    const endVal = endValue.valueOf();
    const year = 1000 * 60  * 60 * 24 * 365 * 2;
    return endVal < startVal || endVal > (startVal + year) ||  endValue > moment().endOf('day').subtract(1, 'd');
  }

  render() {
    const { keywordsList, form, global, dataQuery } = this.props;
    const { getFieldDecorator,getFieldValue } = form;
    const { loading,templateList, platformList,
      moreSelectList,templateStatus,moddalStatus,
      classify,count,content} = this.state;
    const { motherMoreSelect,motherClassfyData } = global;
    const { MotherBabyUUID } = dataQuery;
    const moreSelectVal = moreSelectList.map(_=>_.key);

    const showData = getFieldValue('showData');
    //动态添加筛选表单
    const moreFormItems = moreSelectList.map(k => {
      let option = null;
      let inputDom = null;
      if(k.select){
        option = k.select.map(_ => (
          <Option value={_.name} key={_.id}>{_.name}</Option>
        ))
        inputDom = (
          <Select  mode="multiple" placeholder={'请选择' + k.name}>
            {option}
          </Select>)
      }else{
        inputDom = (
          <Select  mode="tags" placeholder={'请选择' + k.name} />
        )
      }
      return(
        <Form.Item
          label={k.name}
          required={false}
          key={k.key}
        >
          {
            getFieldDecorator(k.key)(
              inputDom
            )
          }
        </Form.Item>
    )});

    const moreSelectDom = motherMoreSelect.map( _ => (
      <Option value={_.key} key={_.key}>{_.value}</Option>
    ));

    const templateDom = templateList.map( _ => (
      <Option config={_.config} value={_.id} key={_.id}>{_.name}</Option>
    ));

    const platformDom = platformList.map( _ => (
      <Option value={_.platformId} key={_.platformId}>{_.name}</Option>
    ));

    const keywordsDom = keywordsList.map( _ => (
      <Option value={_.keyWord} key={_.keyWord}>{_.tagName}</Option>
    ));


    const medicineClassfyDom = motherClassfyData.map(_=>(
      <Option value={_.key} key={_.key}>{_.value}</Option>
    ));

    const modicineClassItem = showData && showData.indexOf('showClassifyData') >= 0 ? (
      <Form.Item label="分类统计字段">
      {getFieldDecorator('classifyStatic', {
        rules: [
          { required: true, message: '请选择分类统计字段', type: 'array' },
        ],
      })(
        <Select mode="multiple" placeholder="请选择分类统计字段" filterOption={selectFilter}>
          {medicineClassfyDom}
        </Select>,
      )}
    </Form.Item>
    ):null;

    const noiseOption = [
      { label: '去水帖', value: 'noisePost' },
      { label: '去水军', value: 'noiseUser' }
    ];

    const showDataOption = [
      { label: '统计总数据', value: 'showData' },
      { label: '分类统计数据量', value: 'showClassifyData' }
    ];

    const templateItem = templateStatus ? (
      <Form.Item label="模版名称">
        {getFieldDecorator('template', {
          rules: [
            { required: true, message: '请输入模版名称' },
          ],
        })(
          <Input />
        )}
      </Form.Item>) : null;


    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };

    return (
      <Spin  spinning={loading}  tip="Loading...请勿关闭页面">
        <PollDataModal
          moddalStatus={moddalStatus}
          classify={classify}
          count={count}
          content={content}
          classfyData={motherClassfyData}
          modalCancel={this.modalCancel}

          uuid={MotherBabyUUID}
        />
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="模版复用" hasFeedback>
            <Select placeholder="请选择模版" onChange={this.templateChange}>
              {templateDom}
            </Select>
          </Form.Item>
          <Form.Item label="平台选择">
            {getFieldDecorator('platformId', {
              rules: [
                { required: true, message: '请选择平台', type: 'array' },
              ],
            })(
              <Select mode="multiple" placeholder="请选择平台" filterOption={selectFilter}>
                {platformDom}
              </Select>,
            )}
          </Form.Item>
          <Form.Item label={(
            <label className="ant-form-item-required" title="时间选择">时间选择</label>
          )}>
            <Form.Item style={{ display: 'inline-block', marginBottom:0 }}>
              {getFieldDecorator('startValue',{
                rules: [
                  { required: true, message: '请选择开始时间' },
                ],
              })(
                <DatePicker
                  disabledDate={this.disabledStateDate}
                  placeholder={'开始时间'}
                  format={dateFormat}
                />
              )}
            </Form.Item>
            <Form.Item style={{ display: 'inline-block', marginLeft:20, marginBottom:0}}>
              {getFieldDecorator('endValue',{
                rules: [
                  { required: true, message: '请选择结束时间' },
                ],
              })(
                <DatePicker
                  disabledDate={this.disabledEndDate}
                  placeholder={'结束时间'}
                  format={dateFormat}
                />
              )}
            </Form.Item>
          </Form.Item>

          <Form.Item label="是否去水">
            {getFieldDecorator('noise', {
              initialValue:['noisePost','noiseUser']
            })(
              <Checkbox.Group options={noiseOption}  />
            )}
          </Form.Item>

          <Form.Item label="孕期/宝宝年龄（月）：">
            {getFieldDecorator('babyDays',{
              initialValue:['-22','36'],
            })(
              <Slider
                min={-22}
                max={36}
                range={true}
                marks={{
                  '-22':'备孕期',
                  '-9': '怀孕',
                  '-6': '孕3个月',
                  '-3':'孕6个月',
                  '0': '出生',
                  '3':'3个月',
                  '6':'6个月',
                  '9':'9个月',
                  '12':'1岁',
                  '18':'1岁半',
                  '24':'2岁',
                  '36': '3岁'
                }}
              />,
            )}
          </Form.Item>

          <Form.Item label="关键词设定：">
            {getFieldDecorator('keyWords')(
              <Select mode="tags"
                filterOption={selectFilter}
                style={{ width: '100%' }}
                placeholder="请输入关键词（支持正则输入），如查询启赋可输入：启赋|illuma">
                {keywordsDom}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="更多筛选：">
            <Select mode="multiple"
              value={moreSelectVal}
              onChange={this.moreSelectChange}
              filterOption={selectFilter}
              style={{ width: '100%' }}
              placeholder="请输入更多筛选条件">
              {moreSelectDom}
            </Select>
          </Form.Item>
          {moreFormItems}

          <Form.Item label="统计/查看：">
            {getFieldDecorator('showData',{
              initialValue:['showData'],
              rules: [
                { required: true, message: '请选择统计/查看', type: 'array' },
              ],
            })(
              <Checkbox.Group options={showDataOption}  />
            )}
          </Form.Item>
          {modicineClassItem}
          {templateItem}
          <Checkbox
            onChange={this.templateStatusChange}
            style={{marginLeft:178,marginBottom:20}}
            checked={templateStatus}>
            保存查询模版
          </Checkbox>
          <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
            <Button type="primary" htmlType="submit">
              开始查询
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

const MotherBaby = Form.create({ name: 'MotherBabyFrom' })(MotherBabyFrom);

export default connect(({ global,dataQuery }:{
  global: GlobalModelState
  dataQuery:IDataQuerystate}) => ({
  global,dataQuery
}))(MotherBaby);
