import React from 'react';
import { 
  PageHeader, 
  AutoComplete, 
  Input, 
  Button,
  Tag,
} from 'antd';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

// https://www.iconfinder.com/iconsets/142-mini-country-flags-16x16px 
// import vietnamFlag from '../../assets/flags/vietnam.png'

const examples = [
  'Thay mới nhịp giữa cầu bị sập ở Đồng Tháp trong bảy ngày',
  'The quick brown fox jumps over the lazy dog',
  '"Stehler" ist in diesem Sinne ein mögliches Wort im Deutschen , das aber durch das bekannte Wort "Dieb" verhindert wird'
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
        >
          {/* <p>
            <span>Supported Languages: </span>
            <img src={vietnamFlag} alt="Vietnam" style={{ marginLeft: 20 }} />
          </p> */}
          <p>Identifying the language used for any given sentence - This model supports 176 languages and trained on Wikipedia data</p>

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
          ? <p>
            <strong>Detected Language: </strong>
            <span>{LIUResp[0].language}</span>
            <Tag>{Math.round(LIUResp[0].probability * 1000) / 100}%</Tag>
          </p>
          : <div />}
        </PageHeader>
      </>
    );
  }
}

export default withRouter(ClozeTestPage);
