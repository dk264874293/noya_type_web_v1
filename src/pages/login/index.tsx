import React from 'react';
import { Form,Input, Button,Row,Col,Icon } from 'antd';
import { connect } from 'dva';
import baseUrl from '@/utils/env';
import { FormComponentProps } from 'antd/es/form';
import router from 'umi/router';
import { GlobalModelState } from '@/models/global';
import { ConnectProps,ConnectState } from '@/models/connect'
import Style from './index.less';


interface ILoginProps extends ConnectProps,ConnectState {
  global: GlobalModelState,
  form:FormComponentProps['form'],

}
interface ILoginState {
  uuid: string | number
}

class NormalLoginForm extends React.Component<ILoginProps,ILoginState> {

  readonly state = {
    uuid: ''
  }

  handleSubmit = (e:React.FormEvent<HTMLFormElement>):void => {
    e.preventDefault();
    const { uuid } = this.state
    const { form, dispatch } = this.props;
    form.validateFields((err:Error, values:any) => {
      if (!err) {
        dispatch && dispatch({
          type: 'global/userLogin',
          payload : {...values,uuid},
        }).then(() => {
          router.push('/dataQuery')
        })
      }
    });
  };

  componentDidMount(){
    this.createUuid()
    this.props.form.setFieldsValue({
      username:'abc',
      password: 'admin'
    })
  }

  createUuid = () => {
    this.setState({
      uuid:  Math.random() * 100
    })
  }

  render() {
    const { uuid } = this.state;
    const{ loading, form } = this.props;
    if (!form) {
      return null;
    }
    const { getFieldDecorator } = form

    return (
      <div id={Style.loginBar}>
        <div className={Style['components-form']}>
          <Row>
            <Col span={10}>
              <div className={Style.loginBg}>
                <div className={Style.logo} />
              </div>
            </Col>
            <Col span={14}>
            <Form className={Style.formContent} onSubmit={this.handleSubmit}>
              <Form.Item >
                {
                  getFieldDecorator('username',
                    {rules: [{ required: true, message: '请输入用户名' }],}
                  )(
                    <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}placeholder="请输入用户名"/>,
                  )
                }
              </Form.Item>
              <Form.Item  >
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password" placeholder="请输入密码"
                  />,
                )}
              </Form.Item>
              <Form.Item  >
                {getFieldDecorator('captcha', {
                  rules: [{ required: true, message: '请输入验证码' }],
                })(
                  <Input
                    style={{width:100,marginRight:6}}
                    placeholder="请输入验证码"
                  />,
                )}
                <img src={baseUrl + '/captcha.jpg?uuid=' + uuid} onClick={this.createUuid} style={{width:112}} />
              </Form.Item>
              <Button
                loading={loading.global}
                type="primary"
                htmlType="submit"
                style={{marginTop:6}} block>
                登录
              </Button>
            </Form>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const  NormalLoginFormDom = Form.create({ name: 'normal_login' })(NormalLoginForm)


export default connect(({ global,loading }:ILoginProps):any => ({
  global,loading
}))(NormalLoginFormDom);
