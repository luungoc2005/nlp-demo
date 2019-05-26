import React from 'react';
import AppRouter from './Router';

import Header from './components/Header';
import Footer from './components/Footer';

import { Layout } from 'antd';

function App() {
  return (
    <Layout>
      <Header />
      <AppRouter />
      <Footer />
    </Layout>
  );
}

export default App;
