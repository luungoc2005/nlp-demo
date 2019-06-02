import React from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';

const Sider = ({ history }) => {
  return (
    <Layout.Sider width={200}>
      <Menu
        theme="dark"
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
        defaultSelectedKeys={[window.location.pathname]}
      >
        <Menu.Item key="/" onClick={() => history.push('/')}>Home</Menu.Item>
        <Menu.Item key="/cloze" onClick={() => history.push('/cloze')}>Cloze Test</Menu.Item>
      </Menu>
    </Layout.Sider>
  );
}

export default withRouter(Sider);
