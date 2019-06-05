import React from 'react';
import { 
  PageHeader, 
  AutoComplete, 
  Input, 
  Button,
  Tag,
  Divider,
} from 'antd';
import { getProbabilityTagColor, getFlagEmoji, getCountryFromLanguage } from '../../utils';
import languages from '../../utils/languages';

import axios from 'axios';
import { withRouter } from 'react-router-dom';

// https://www.iconfinder.com/iconsets/142-mini-country-flags-16x16px 
// import vietnamFlag from '../../assets/flags/vietnam.png'

const examples = [
  'Thay mới nhịp giữa cầu bị sập ở Đồng Tháp trong bảy ngày',
  'The quick brown fox jumps over the lazy dog',
  '"Stehler" ist in diesem Sinne ein mögliches Wort im Deutschen , das aber durch das bekannte Wort "Dieb" verhindert wird',
  'Est-ce que vous avez visité Paris?',
  '시간 있을 때 뭐 하세요 ?',
  '你去忙你的吧',
]

class ClozeTestPage extends React.Component {
  state = {
    input: '',
    LIUResp: null,
  }

  getLIUResult = async (items) => {
    try {
      const resp = await axios.post('/demo/language_predict', {
        items
      })
      // console.log(resp)
      if (resp.data) {
        this.setState({
          LIUResp: resp.data,
        })
      }
    }
    catch (e) {

    }
  };

  render() {
    const { history } = this.props;
    const { input, LIUResp } = this.state;

    return (
      <>
        <PageHeader
          onBack={() => history.goBack()}
          title="Text Classification"
          subTitle="Language Identification"
          extra={[
            <Tag key='lang'>176 languages</Tag>
          ]}
        >
          <p>Identifying the language used for any given sentence - This model supports 176 languages and was trained on Wikipedia data</p>

          <Divider />

          <p>Enter text or choose an example:</p>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <AutoComplete 
              dataSource={examples}
              onChange={(value) => this.setState({ input: value })}
              style={{ width: '100%' }}
            >
              <Input 
                value={this.state.input}
              />
            </AutoComplete>
          </div>
          
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Button type="primary" onClick={() => this.getLIUResult([input])}>Submit</Button>
          </div>

          {LIUResp && LIUResp.length
          ? <div style={{ marginTop: 20, marginBottom: 20 }}>
              <strong>Detected Language:</strong>
              <span style={{ marginLeft: 20 }}>{languages[LIUResp[0].language]}</span>
              <Tag style={{ marginLeft: 20 }} color={getProbabilityTagColor(Math.round(LIUResp[0].probability))}>
                {Math.min(Math.round(LIUResp[0].probability * 10000) / 100, 100)}%
              </Tag>
              <div style={{ 
                marginTop: 20, 
                marginBottom: 20,
                wordWrap: 'break-word'
              }}>
                {getCountryFromLanguage(LIUResp[0].language)
                  .map(region => {
                    const emoji = getFlagEmoji(region)
                    if (emoji) {
                      return <span key={region} role="img" aria-label="flag" style={{ marginRight: 10 }}>
                        {emoji}
                      </span>
                    }
                    else {
                      return null;
                    }
                  })
                  .filter(item => item)}
              </div>
            </div>
          : <div />}
        </PageHeader>
      </>
    );
  }
}

export default withRouter(ClozeTestPage);
