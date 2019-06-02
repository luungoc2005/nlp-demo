import React from 'react';
import { PageHeader, AutoComplete, Input, Button, Table } from 'antd';
import axios from 'axios';

// https://www.iconfinder.com/iconsets/142-mini-country-flags-16x16px 
import vietnamFlag from '../../assets/flags/vietnam.png'

const examples = [
  'Thay mới nhịp giữa cầu bị sập ở Đồng Tháp trong bảy ngày',
  'Thầy trò Park Hang-seo bước vào tập nhẹ ngay khi đến Buriram để chuẩn bị cho King\'s Cup 2019',
  'Với lợi thế sản phẩm dịch vụ đa dạng và những dòng sản phẩm đặc thù, ABC Bank sẵn sàng đáp ứng mọi nhu cầu tài chính của Quý Khách hàng.',
  'Hàng loạt thí sinh và phụ huynh ôm nhau bật khóc nức nở ngoài cổng trường thi vì không làm được bài'
]

class HomePage extends React.Component {
  state = {
    input: '',
    tokenizeResp: null,
    submittedTokenizeResp: null,
    clozeResp: null,
    selectedToken: null,
  }

  getTokenizeResult = async (items) => {
    try {
      const resp = await axios.post('/demo/tokenize', {
        items
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
    try {
      const { tokenizeResp } = this.state;
      const resp = await axios.post('/demo/cloze_predict', tokenizeResp)

      this.setState({ 
        clozeResp: resp.data,
        submittedTokenizeResp: tokenizeResp.slice(),
        selectedToken: null,
      })
    }
    catch (e) {

    }
  };

  render() {
    const { input, tokenizeResp, submittedTokenizeResp, clozeResp, selectedToken } = this.state;

    return (
      <>
        <PageHeader
          onBack={() => window.history.back()}
          title="Natural Language Understanding"
          subTitle="Cloze Test"
        >
          <p>
            <span>Supported Languages: </span>
            <img src={vietnamFlag} alt="Vietnam" style={{ marginLeft: 20 }} />
          </p>
          <p>The Cloze Test is the task of filling in the blanks of a sentence to show that the system understands basic grammar, word collocations and contextual meaning of the sentence</p>
          <h1>Step 1:</h1>
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
            <Button type="primary" onClick={() => this.getTokenizeResult([input])}>Submit</Button>
          </div>
  
          {(tokenizeResp && <>
            <h1>Step 2:</h1>
            <p>Choose words to mask out</p>
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
            <h1>Result:</h1>
            {clozeResp.labels.map((top_labels, idx) => <>
              {submittedTokenizeResp[idx].isMasked 
                ? <Button 
                  type="danger"
                  style={{ marginRight: 10, marginBottom: 10 }}
                  onClick={() => this.setState({ selectedToken: idx })}
                >
                  {top_labels[0]}
                </Button>
                : <Button
                  disabled
                  type="dashed"
                  style={{ marginRight: 10, marginBottom: 10 }}
                >
                  {submittedTokenizeResp[idx].value}
                </Button>
              }
            </>)}
          </>}

          {(selectedToken && selectedToken > 0) 
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

export default HomePage;
