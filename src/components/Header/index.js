import React from 'react';
import { Layout } from 'antd';

function Header() {
  return (
    <Layout.Header>
      <span style={{ color: 'white', fontWeight: '600' }}>
        <span role="img" aria-label="logo">🔧</span> BotBot.AI Lab
      </span>
    </Layout.Header>
  );
}

export default Header;
