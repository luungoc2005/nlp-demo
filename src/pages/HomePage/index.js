import React from 'react';
import { PageHeader } from 'antd';
import { withRouter } from 'react-router-dom';

const HomePage = ({ history }) => {
  return (
    <>
      <PageHeader
        onBack={() => history.goBack()}
        title="BotBot.AI Lab"
        subTitle="Home"
      >
        <p>This site houses various experiments in Natural Language Understanding (NLU).</p>
        <p>This includes validation for models that contain transferable knowledge for other downstream NLU tasks.</p>
        <p>Please use the left sidebar and have fun experimenting.</p>

        <h1>Disclaimer</h1>
        <p>Many experiments here will not be of good enough accuracy or quality to be used in production settings, but nevertheless serves as a good glimpse of what future AI can do.</p>
        <p>Note: Site under construction</p>
      </PageHeader>
    </>
  );
}

export default withRouter(HomePage);
