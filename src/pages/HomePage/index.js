import React from 'react';
import { PageHeader } from 'antd';
import { withRouter } from 'react-router-dom';

const HomePage = ({ history }) => {
  return (
    <>
      <PageHeader
        onBack={() => history.back()}
        title="BotBot.AI Lab"
        subTitle="Home"
      >
      </PageHeader>
    </>
  );
}

export default withRouter(HomePage);
