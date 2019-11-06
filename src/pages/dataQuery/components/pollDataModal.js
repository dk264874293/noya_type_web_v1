import PropTypes from 'prop-types';
import { Modal,Tabs,Table,Button } from 'antd';
import router from 'umi/router';
import { DownloadXLSX } from '@/components'

const { TabPane } = Tabs;


const pollDataModal = function({moddalStatus,classify,classfyData,count,modalCancel,uuid,content,dataStatus}){

  const tabDataList = [];
  for(const k in classify){
    tabDataList.push({
      name: classfyData.filter(_ => _.key === k)[0]['value'],
      value: k,
      data: classify[k]
    })
  }

  const columns = [
    {
      title: dataStatus === 'Medicine' ? '医生数（user_id）' : '用户数（user_id）',
      dataIndex: 'users',
      key: 'users',
      sorter: (a, b) => a.users - b.users
    },
    {
      title: dataStatus === 'Medicine' ? '问诊数（post_id）' : '贴子数（post_id）',
      dataIndex: 'posts',
      key: 'posts',
      sorter: (a, b) => a.posts - b.posts
    },
    {
      title: '言论数（id）',
      dataIndex: 'records',
      key: 'records',
      sorter: (a, b) => a.records - b.records
    }
  ]

  const tabPaneList = tabDataList.map( _ => (
    <TabPane tab={_.name} key={_.value}>
      <Table columns={[
        {
          title: _.name,
          dataIndex: 'classify',
          key: 'classify',
        }
      ].concat(columns)} dataSource={_.data} />
    </TabPane>
  ))


  const tabDom = tabDataList.length > 0 ? (
    <Tabs  type="card">
      {tabPaneList}
    </Tabs>
  ) : null;

  const routerWordCloud = () => {
    router.push('/wordCloud?uuid=' + uuid)
  }

  const downData = count ? tabDataList.concat([{
    name: '总计',
    data: [count]
  }]) : tabDataList;

  const totleDom = count ? (
    <div>
      <h3>总计</h3>
      <Table columns={columns} dataSource={[count]} />
    </div>
   ) : null;

  return (
    <Modal
      title="统计结果"
      visible={moddalStatus}
      onCancel={modalCancel}
      maskClosable={false}
      footer={[
        <DownloadXLSX data={downData} content={content}  key="1" >
          下载数据
        </DownloadXLSX>,
        <Button type="primary" key="2" onClick={routerWordCloud} >
          文本词云展示
        </Button>,
      ]}
      width={820}
    >
      {tabDom}
      {totleDom}

    </Modal>
  )
}

pollDataModal.defaultProps = {
};
pollDataModal.propTypes ={
  moddalStatus:PropTypes.bool.isRequired,
  classify:PropTypes.object,
  modalCancel:PropTypes.func.isRequired,
  classfyData:PropTypes.array,
  uuid:PropTypes.string.isRequired,
  dataStatus:PropTypes.string
}

export default pollDataModal
