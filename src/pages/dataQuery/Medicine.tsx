import React from 'react';
import {
  Form,
  Select,
  Input,
  DatePicker,
  Button,
  Checkbox,
  Spin
} from 'antd';
import { connect } from 'dva';
import moment from 'moment';

import {
  getDataAdvisorGetTemplate, getDatAadvisorGetPlatform,
  getDataadvisorGetInfoData,getDataadvisorRunMedicine,
  getDataadvisorPollData
} from '@/services/dataQuery';
import PollDataModal from './components/pollDataModal'

import { selectFilter } from '@/utils';

const { Option } = Select;
const dateFormat = 'YYYY-MM-DD';

let timeStauts = null;
class MedicineFrom extends React.PureComponent {

  state={
    templateList: [],
    platformList: [],
    moreSelectList: [],
    loading:false,
    templateStatus:false,
    moddalStatus:false,
    classify:null,
    count:null,
    content:[]
  }

  componentDidMount(){
    this.getTemplate()
    getDatAadvisorGetPlatform(2).then(data => {
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

  componentWillUnmount(){
    clearInterval(timeStauts);
  }

  componentWillReceiveProps(nextProps){

    const nextTagVal = nextProps.tagVal;
    const thatTagVal = this.props.tagVal;
    const thatUserId = this.props.global.user.userId;
    const nextUserId = nextProps.global.user.userId;
    if(nextTagVal !== thatTagVal){
      if(nextTagVal === '2'){
        this.addSetTime()
      }
      if(nextTagVal === '1'){
        timeStauts && clearInterval(timeStauts);
      }
    }
    if(thatUserId !== nextUserId){
      this.getTemplate()
    }

  }

  addSetTime(){
    const { MedicineUUID,MedicineStatus } = this.props.dataQuery;
    if(MedicineUUID && MedicineUUID !== '' && !MedicineStatus){
      this.setTimePollData(MedicineUUID)
    }
  }

  setTimePollData = (uuid) => {
    this.setState({
      loading:true
    });
    timeStauts = setInterval(() => {
      getDataadvisorPollData(uuid).then(res => {
        if(res){
          const {classify,count,content} = res;
          this.getTemplate();
          clearInterval(timeStauts);
          this.setState({
            loading:false,
            moddalStatus:true,
            classify,count,content
          });
          this.props.dispatch({
            type: 'dataQuery/setMedicineStatus',
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

  getTemplate(userId = this.props.global.user.userId){
    if(userId){
      getDataAdvisorGetTemplate(2,userId).then(data => {
        this.setState({
          templateList: data
        })
      })
    }
  }



  // form 提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { moreSelectList } = this.state;
        const moreVal = moreSelectList.map(_ => _.key)
        const{ platformId,startValue, endValue,showData,keyWords,classifyStatic,template } = values;
        const multipleChoice = [];
        for(const key in values){
          if(moreVal.indexOf(key) >= 0){
            multipleChoice.push({
              [key]:values[key]
            })
          }
        }
        const selectData = {
          platformId,
          keyWords,
          classifyStatic,template,
          multipleChoice,
          dataRange:[startValue.format(dateFormat), endValue.format(dateFormat)],
          showData: showData.indexOf('showData') >= 0 ? 1 : null,
          showClassifyData: showData.indexOf('showClassifyData') >= 0 ? 1 : null,
        }
        this.setState({
          loading:true
        })
        getDataadvisorRunMedicine(selectData).then(res => {
          this.props.dispatch({
            type: 'dataQuery/setMedicineUUID',
            payload : res.uuid,
          })
          this.props.dispatch({
            type: 'dataQuery/setMedicineStatus',
            payload : false,
          })
          this.setTimePollData(res.uuid)
        }).catch(() => {
          this.setState({
            loading:false
          })
        })
      }
    });
  };

  // 模版切换
  templateChange = (val,option) => {
    const {config} = option.props;
    const {platformId,keyWords,dataRange,
      classifyStatic,multipleChoice,showClassifyData,showData } = config;
    console.log(config)
    const { medicineMoreSelect, medicineNeed } = this.props.global;
    let moreSelectList = [];
    let multipleData = {};
    let promiseList = [];
    let promiseVal = [];
    multipleChoice.map(item => {
      for(const k in item){
        multipleData[k] = item[k]
        const thatData = medicineMoreSelect.filter(_ => _.key === k)[0];
        const { key,value } = thatData;
        if(medicineNeed.indexOf(k) >= 0){
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
        const showDataVal = [showClassifyData === '1' ? 'showClassifyData': null,showData === '1'? 'showData':null ].filter(_ => !!_);
        this.props.form.setFieldsValue({
          platformId,keyWords,
          showData:showDataVal,
          // classifyStatic,
          startValue:moment(dataRange[0],dateFormat),
          endValue:moment(dataRange[1],dateFormat),
          ...multipleData
        },() => {
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
  moreSelectChange = (val,option) => {
    const Len = option.length;
    const { medicineNeed } = this.props.global;
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
      if(medicineNeed.indexOf(value) >= 0){
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
  templateStatusChange = ({target}) => {
    this.setState({
      templateStatus: target.checked
    })
  }

  modalCancel = () => {
    this.setState({
      moddalStatus:false
    })
  }

  disabledStateDate = startValue => {
    const endValue = this.props.form.getFieldValue('endValue');
    if (!startValue || !endValue) {
      return startValue > moment().endOf('day').subtract(1, 'd');
    }
    const startVal = startValue.valueOf();
    const endVal = endValue.valueOf();
    const year = 1000 * 60  * 60 * 24 * 365 * 2;
    return startVal > endVal || startVal < (endVal - year) ||  startValue > moment().endOf('day').subtract(1, 'd');
  }

  disabledEndDate = endValue => {
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
      classify,count,content } = this.state;
    const { medicineMoreSelect,medicineClassfyData } = global;
    const { MedicineUUID } = dataQuery
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

    const moreSelectDom = medicineMoreSelect.map( _ => (
      <Option value={_.key} key={_.key}>{_.value}</Option>
    ));
    const templateDom = templateList.map( _ => (
      <Option config={_.config} value={_.id} key={_.id}>{_.name}</Option>
    ));

    const platformDom = platformList.map( _ => (
      <Option value={_.platformId} key={_.platformId}>{_.name}</Option>
    ));

    const medicineClassfyDom = medicineClassfyData.map(_=>(
      <Option value={_.key} key={_.key}>{_.value}</Option>
    ));

    const keywordsDom = keywordsList.map( _ => (
      <Option value={_.keyWord} key={_.keyWord}>{_.tagName}</Option>
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
          dataStatus='Medicine'
          classify={classify}
          count={count}
          content={content}
          classfyData={medicineClassfyData}
          modalCancel={this.modalCancel}
          uuid={MedicineUUID}
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

const Medicine = Form.create({ name: 'MedicineFrom' })(MedicineFrom);

export default connect(({ global,dataQuery }) => ({
  global,dataQuery
}))(Medicine);
