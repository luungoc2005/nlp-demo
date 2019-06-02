import React from 'react';
import AppRouter from './Router';

import Header from './components/Header';
import Footer from './components/Footer';
import Sider from './components/Sider';

import { Layout } from 'antd';

import messages from './messages';

function App() {
  return (
    <Layout>
      <Header />
      <Layout>
        <Sider />
        <Layout.Content style={{ padding: '20px' }}>
          <AppRouter />
        </Layout.Content>
      </Layout>
      <Footer />
    </Layout>
  );
}

export default App;
