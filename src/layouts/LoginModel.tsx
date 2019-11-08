import React from 'react';
import { connect } from 'dva';
import {
  Modal, Button, Form, Icon, Input,Dropdown,Menu,Spin,message
} from 'antd';
import { ConnectProps,ConnectState } from '@/models/connect'
import { GlobalModelState } from '@/models/global';
import { FormComponentProps } from 'antd/es/form';
import router from 'umi/router';
import Style from './LoginModel.less';

export interface IBasicProps extends ConnectProps {
  children?:React.ReactElement
}

interface ILoginProps extends ConnectState,IBasicProps{
  global: GlobalModelState
  form: FormComponentProps['form']
  style?: React.CSSProperties
}

interface ILoginState{
  visible: boolean
  iconLoading: boolean
  selectMenu:string[]
}


class LoginModel extends React.Component<ILoginProps,ILoginState>{
  state = {
    visible: false,
    iconLoading: false,
    selectMenu: []
 }

 componentDidMount(){
  const { location } = this.props;
  this.setState({
    selectMenu: location && location.pathname ? [location.pathname]: []
  })
}

  showModal = () => {
    this.setState({
      visible: true,
    });
    this.props.form.setFieldsValue({
      old_password:'', new_password:'',  confirm_password:'',
    })
  }

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    const {form ,dispatch} = this.props
    e.preventDefault();
    form.validateFields((err, values) => {
      if (!err) {
        dispatch && dispatch({
          type: 'global/userChangePassword',
          payload: values,
        }).then(() =>{
          this.setState({
            visible:false
          })
          message.success('密码修改成功！')
        })
      }
    });
  };
  loginout = () => {
    const {dispatch} = this.props;
    dispatch && dispatch({
      type: 'dataQuery/initData'
    })
    dispatch && dispatch({
      type: 'global/userLogout'
    }).then(()=>{
      router.push('/login')
    })

  }

  menuChange = ({key}:{ key:string }) => {
    router.push(key)
    this.setState({
      selectMenu: [key]
    })
  }

  // <Menu.Item>
  //         <Button  onClick={this.showModal}  type="link">
  //           修改密码
  //         </Button>
  //       </Menu.Item>
  render() {
    const { style,global,loading } = this.props;
    const { userName } = global.user;
    const { getFieldDecorator } = this.props.form;
    const { visible,iconLoading,selectMenu } = this.state;
    const userMenu = (
      <Menu>
        <Menu.Item>
          <Button  onClick={this.loginout}  type="link">
            退出登陆
          </Button>
        </Menu.Item>
      </Menu>)
    return (
      <div id={Style.LoginModel} className='clearFloat' style={style}>
        <div className={Style.logo}></div>
        <Dropdown overlay={userMenu}>
          <Button className={[Style.userBut, "ant-dropdown-link"].join(' ')}  type="link">
            {userName}<Icon type="down" />
          </Button>
        </Dropdown>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectMenu}
          style={{ lineHeight: '64px' }}
          onClick={this.menuChange}
        >
          <Menu.Item key="/dataQuery">数据查询</Menu.Item>
          <Menu.Item key="/wordCloud">词云</Menu.Item>
          <Menu.Item key="/createdTable">创建新表</Menu.Item>
          <Menu.Item key="/wordcluster">聚类</Menu.Item>

          {/*
             <Menu.Item key="/wordcluster">聚类</Menu.Item>
            <Menu.Item key="/betweenGraph">关系图</Menu.Item>
          */}

        </Menu>
        <Modal
          title="修改密码"
          width="380px"
          visible={visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <Spin spinning={loading.global}>
            <Form  className="login-form" submit={this.handleSubmit}>
              <Form.Item style={{marginBottom:'16px'}}>
                {getFieldDecorator('old_password', {
                  rules: [{ required: true, message: '请输入现密码!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入现密码" />
                )}
              </Form.Item>
              <Form.Item style={{marginBottom:'24px'}}>
                {getFieldDecorator('new_password', {
                  rules: [
                    { required: true, message: '请输入新密码!' },
                    { min:6,max:20, message: '密码长度必须在6-20位!' }
                  ],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请输入新密码！" />
                )}
              </Form.Item>
              <Form.Item style={{marginBottom:'24px'}}>
                {getFieldDecorator('confirm_password', {
                  rules: [
                    { required: true, message: '请再次输入新密码!' },
                    { min:6,max:20, message: '密码长度必须在6-20位!' }],
                })(
                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="请再次输入新密码！" />
                )}
              </Form.Item>

              <Button type="primary"  htmlType="submit" loading={iconLoading} block >
                确认
              </Button>
            </Form>
          </Spin>
        </Modal>
      </div>
    );
  }
}
const WrappedNormalLoginForm = Form.create({ name: 'normal_login' })(LoginModel);

export default connect(({ global,loading }:ILoginProps):any => ({
  global,loading
}))(WrappedNormalLoginForm);
