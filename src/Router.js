import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from 'history';

import HomePage from './pages/HomePage';
import ClozeTestPage from './pages/ClozeTestPage';
import SentimentPage from './pages/SentimentPage';
import LanguageIdentificationPage from './pages/LanguageIdentificationPage';
import EntityRecognitionPage from './pages/EntityRecognitionPage';
import PartOfSpeechTaggerPage from './pages/PartOfSpeechTaggerPage';

import Header from './components/Header';
import Footer from './components/Footer';
import Sider from './components/Sider';

import { Layout } from 'antd';

export const history = createBrowserHistory();

function AppRouter() {
  return (
    <Router history={history}>
      <Layout style={{ height: '100vh' }}>

        <Header />

        <Layout>

          <Sider />

          <Layout.Content style={{ padding: '20px' }}>

            <Switch>
              <Route exact path='/' component={HomePage} />
              <Route exact path='/cloze' component={ClozeTestPage} />
              <Route exact path='/language_identification' component={LanguageIdentificationPage} />
              <Route exact path='/sentiment' component={SentimentPage} />
              <Route exact path='/entity_recognition' component={EntityRecognitionPage} />
              <Route exact path='/pos_tagging' component={PartOfSpeechTaggerPage} />
            </Switch>

            <Footer />

          </Layout.Content>

        </Layout>
      </Layout>
    </Router>
  )
}

export default AppRouter;