import React from 'react';
import { Layout, Menu } from 'antd';
import { withRouter } from 'react-router-dom';

const Sider = ({ history, location }) => {
  return (
    <Layout.Sider 
      width={200}
      collapsedWidth={0}
      breakpoint="lg"
      style={{
        zIndex: 1,
      }}
    >
      <Menu
        theme="dark"
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
        defaultSelectedKeys={[location.pathname || '/']}
      >
        <Menu.Item key="/" onClick={() => history.push('/')}>Home</Menu.Item>
        <Menu.Item key="/cloze" onClick={() => history.push('/cloze')}>Cloze Test</Menu.Item>
        <Menu.Item key="/language_identification" onClick={() => history.push('/language_identification')}>Language Identification</Menu.Item>
        <Menu.Item key="/entity_recognition" onClick={() => history.push('/entity_recognition')}>Named Entity Recognition</Menu.Item>
        <Menu.Item key="/pos_tagging" onClick={() => history.push('/pos_tagging')}>Part-Of-Speech Tagging</Menu.Item>
        {/* <Menu.Item key="/entity_recognition" onClick={() => history.push('/entity_recognition')}>Entity Recognition</Menu.Item> */}
      </Menu>
    </Layout.Sider>
  );
}

export default withRouter(Sider);
