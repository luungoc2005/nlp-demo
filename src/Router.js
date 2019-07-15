import React, { lazy, Suspense } from "react";
import { Skeleton } from 'antd';
import { Router, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from 'history';

import Header from './components/Header';
import Footer from './components/Footer';
import Sider from './components/Sider';

import { Layout } from 'antd';
import { fromEventPattern } from "rxjs";

export const history = createBrowserHistory();

const PageWrapper = ({ children }) => <Suspense fallback={<Skeleton active />}>
  {children}
</Suspense>

const HomePage = lazy(() => import('./pages/HomePage'))
const ClozeTestPage = lazy(() => import('./pages/ClozeTestPage'))
const SentimentPage = lazy(() => import('./pages/SentimentPage'))
const LanguageIdentificationPage = lazy(() => import('./pages/LanguageIdentificationPage'))
const EntityRecognitionPage = lazy(() => import('./pages/EntityRecognitionPage'))
const PartOfSpeechTaggerPage = lazy(() => import('./pages/PartOfSpeechTaggerPage'))

function AppRouter() {
  return (
    <Router history={history}>
      <Layout style={{ height: '100vh' }}>

        <Header />

        <Layout>

          <Sider />

          <Layout.Content style={{ padding: '20px' }}>

            <Switch>
              <Route exact path='/' render={() => <PageWrapper><HomePage /></PageWrapper>} />
              <Route exact path='/cloze' render={() => <PageWrapper><ClozeTestPage /></PageWrapper>} />
              <Route exact path='/language_identification' render={() => <PageWrapper><LanguageIdentificationPage /></PageWrapper>} />
              <Route exact path='/sentiment' render={() => <PageWrapper><SentimentPage /></PageWrapper>} />
              <Route exact path='/entity_recognition' render={() => <PageWrapper><EntityRecognitionPage /></PageWrapper>} />
              <Route exact path='/pos_tagging' render={() => <PageWrapper><PartOfSpeechTaggerPage /></PageWrapper>} />
            </Switch>

            <Footer />

          </Layout.Content>

        </Layout>
      </Layout>
    </Router>
  )
}

export default AppRouter;