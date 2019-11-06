
import React from 'react';
import { Layout } from 'antd';
import LoginModel,{ IBasicProps } from './LoginModel';
import style from './index.css';
const { Header, Content, Footer} = Layout;


function BasicLayout(props:IBasicProps){
  const { children,location } = props
    return (
      <Layout className={style.layout} >
        <Header >
          <LoginModel location={location} />
        </Header>
        <Content style={{
          background: '#fff', padding: 30,  margin: '24px 24px 0', minHeight: 'initial',
        }}
        >
          { children }
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          © 2018 宏原科技. All Rights Reserved.
        </Footer>

      </Layout>
    );
};

export default BasicLayout;
