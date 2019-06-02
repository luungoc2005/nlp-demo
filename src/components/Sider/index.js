import React from 'react';
import { Layout, Menu } from 'antd';

function Sider() {
  return (
    <Layout.Sider width={200}>
      <Menu
        mode="inline"
        style={{ height: '100%', borderRight: 0 }}
      >
        <Menu.Item key="1">Cloze Test</Menu.Item>
      </Menu>
    </Layout.Sider>
  );
}

export default Sider;
