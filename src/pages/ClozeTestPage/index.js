import React from 'react';
import { 
  PageHeader, 
  AutoComplete, 
  Input, 
  Button, 
  Table, 
  Tag,
  Divider,
} from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { getFlagEmoji } from '../../utils';

// https://www.iconfinder.com/iconsets/142-mini-country-flags-16x16px 
// import vietnamFlag from '../../assets/flags/vietnam.png'

const examples = {
  'vi': [
    'Thay mới nhịp giữa cầu bị sập ở Đồng Tháp trong bảy ngày',
    'Thầy trò Park Hang-seo bước vào tập nhẹ ngay khi đến Buriram để chuẩn bị cho King\'s Cup 2019',
    'Với lợi thế sản phẩm dịch vụ đa dạng và những dòng sản phẩm đặc thù, ABC Bank sẵn sàng đáp ứng mọi nhu cầu tài chính của Quý Khách hàng.',
    'Hàng loạt thí sinh và phụ huynh ôm nhau bật khóc nức nở ngoài cổng trường thi vì không làm được bài'
  ],
  'en': [
    'A video of Phoenix police officers threatening a family over minor shoplifting has turned long-simmering frustrations over police violence into sustained outrage over the past few weeks.',
    'EU\'s GPS satellites have been down for four days in mysterious outage',
    'German schools ban Microsoft Office 365 amid privacy concerns',
    'If you actually watched and remember the early seasons, you\'ll recall that Marshall was making a living through corporate law while dreaming of becoming an environmental lawyer.'
  ]
}

class ClozeTestPage extends React.Component {
  state = {
    input: '',
    tokenizeResp: null,
    submittedTokenizeResp: null,
    clozeResp: null,
    selectedToken: null,
    language: 'vi',
  }

  getTokenizeResult = async (items) => {
    const { language } = this.state;
    try {
      const resp = await axios.post('/demo/tokenize', {
        items,
        language,
      })
      // console.log(resp)
      if (resp.data && resp.data.length) {
        this.setState({
          tokenizeResp: resp.data[0].map(token => ({ value: token, isMasked: false })),
          submittedTokenizeResp: null,
          clozeResp: null,
          selectedToken: null,
        })
      }
    }
    catch (e) {

    }
  };

  getClozeTestResult = async () => {
    const { tokenizeResp, language } = this.state;
    try {
      const resp = await axios.post('/demo/cloze_predict', 
        {
          tokens: tokenizeResp,
          language,
        }
      )

      this.setState({ 
        clozeResp: resp.data,
        submittedTokenizeResp: tokenizeResp.slice(),
        selectedToken: null,
      })
    }
    catch (e) {

    }
  };

  setLanguage(language) {
    this.setState({ language })
  }

  render() {
    const { history } = this.props;
    const { language, input, tokenizeResp, submittedTokenizeResp, clozeResp, selectedToken } = this.state;

    return (
      <>
        <PageHeader
          onBack={() => history.goBack()}
          title="Language Modeling"
          subTitle="Cloze Test"
          extra={[
            <Tag.CheckableTag 
              checked={this.state.language === 'en'}
              onChange={() => this.setLanguage('en')}
              key='en'
            >
              English
              <span role="img" aria-label="flag" style={{ marginLeft: 5 }}>
                {getFlagEmoji('GB')}
              </span>
            </Tag.CheckableTag>,
            <Tag.CheckableTag
              checked={this.state.language === 'vi'}
              onChange={() => this.setLanguage('vi')}
              key='vi'
            >
              Vietnamese
              <span role="img" aria-label="flag" style={{ marginLeft: 5 }}>
                {getFlagEmoji('VN')}
              </span>
            </Tag.CheckableTag>
          ]}
        >
          {/* <p>
            <span>Supported Languages: </span>
            <img src={vietnamFlag} alt="Vietnam" style={{ marginLeft: 20 }} />
          </p> */}
          <p>The Cloze Test is the task of filling in the blanks of a sentence to show that the system understands basic grammar, word collocations and contextual meaning of the sentence.</p>
          <p>This public model is trained on a dataset consists of Vietnamese Wikipedia and News sites</p>
          
          <Divider />
          <h1>Step 1:</h1>
          <p>Enter text or choose an example:</p>
  
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <AutoComplete 
              dataSource={examples[language]}
              onChange={(value) => this.setState({ input: value })}
              style={{ width: '100%' }}
            >
              <Input 
                value={this.state.input}
              />
            </AutoComplete>
          </div>
          
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <Button type="primary" onClick={() => this.getTokenizeResult([input])}>Submit</Button>
          </div>
  
          {(tokenizeResp && <>

            <Divider />

            <h1>Step 2:</h1>
            <p>Choose words to omit and have the model predict</p>
            <p>{tokenizeResp.map((tokenObject, idx) => 
            <Button 
              key={idx}
              type="dashed"
              style={{ marginRight: 10, marginBottom: 10 }}
              onClick={() => this.setState({
                tokenizeResp: tokenizeResp.map((val, val_idx) => val_idx === idx
                  ? { ...val, isMasked: !val.isMasked }
                  : val
                )
              })}
            >
              <span style={{ 
                textDecoration: tokenObject.isMasked 
                  ? 'line-through' 
                  : 'none' 
              }}>
                {tokenObject.value}
              </span>
            </Button>)}</p>

            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <Button type="primary" onClick={this.getClozeTestResult}>Submit</Button>
            </div>
          </>)}

          {clozeResp && <>
            <Divider />

            <h1>Result:</h1>
            <p>Click on the predicted words to see top 5 candidates for each word</p>
            {clozeResp.labels.map((top_labels, idx) => 
              submittedTokenizeResp[idx].isMasked 
                ? <Button 
                  key={idx}
                  type="danger"
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={() => this.setState({ selectedToken: idx })}
                >
                  {top_labels[0]}
                </Button>
                : <Button
                  key={idx}
                  disabled
                  type="dashed"
                  style={{ marginRight: 10, marginBottom: 10 }}
                >
                  {submittedTokenizeResp[idx].value}
                </Button>)}
          </>}

          {(selectedToken !== null) 
          ? <>
            <p>Word Probabilities</p>
            <Table 
              pagination={false}
              dataSource={clozeResp.labels[selectedToken].map((top_label, idx) => ({
                label: top_label,
                probability: `${Math.round(
                  Math.exp(clozeResp.values[selectedToken][idx]) * 10000
                ) / 100}%`
              }))}
              columns={[
                {
                  title: 'Candidate',
                  dataIndex: 'label',
                  key: 'label'
                },
                {
                  title: 'Probability',
                  dataIndex: 'probability',
                  key: 'probability'
                }
              ]}
            />
          </>
          : <div />}
        </PageHeader>
      </>
    );
  }
}

export default withRouter(ClozeTestPage);
