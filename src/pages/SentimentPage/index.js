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
  'en': [
    'This is one of Polanski\'s best films.',
    'The whole thing plays out with the drowsy heaviness of synchronized swimmer wearing a wool wetsuit.',
    'No movement, no yuks, not much of anything.',
    'A cockamamie tone poem pitched precipitously between swoony lyricism and violent catastrophe... the most aggressively nerve-wracking and screamingly neurotic romantic comedy in cinema history.',
    'A dreary, incoherent, self-indulgent mess of a movie in which a bunch of pompous windbags drone on inanely for two hours...a cacophony of pretentious, meaningless prattle.'
  ],
  'vi': [
    'Nói chung là ngon, với giá 150k full vat và nước thì mình thấy oke. Gà ở đây cực kì ngon, như vị gà Hs của kfc í',
    'Trái cây ở đây nhiều loại, tươi ngon, ngọt vừa phải. Trà sả tắc vừa uống, thơm ngon. Quán sạch sẽ, phục vụ vui vẻ. Giá cả hợp lý. Chuẩn!',
    'Mới mở ra đã hư dây kéo',
    'Gương hơi mờ, Shop k rep tn. Thật sự thất vọng',
    'Hàng ko đúng chất lượng'
  ]
}

class SentimentPage extends React.Component {
  state = {
    input: '',
    sentimentResp: null,
    language: 'vi',
  }

  getSentimentResult = async (items) => {
    const { language } = this.state;
    try {
      const resp = await axios.post('/demo/sentiment_predict', {
        items,
        language,
      })
      // console.log(resp)
      if (resp.data) {
        this.setState({
          sentimentResp: resp.data
        })
      }
    }
    catch (e) {

    }
  };

  setLanguage(language) {
    this.setState({ language })
  }

  render() {
    const { history } = this.props;
    const { input, sentimentResp } = this.state;

    const sentimentScore = sentimentResp 
      ? Math.round(sentimentResp.scores[0] * 100) / 100
      : 0
    return (
      <>
        <PageHeader
          onBack={() => history.goBack()}
          title="Text Classification"
          subTitle="Sentiment Analysis"
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
          <p>The sentiment analysis is a common task of analyzing a sentence's tone and give it a sentiment score to indicate positive or negative emotions associated.</p>
          <p>This public model will give a score ranging from -1 to 1 for extreme negative to extreme positive, with scores closer to 0 indicates neutrality</p>
          <p>Given examples are taken from online review sites.</p>

          <Divider />
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
            <Button type="primary" onClick={() => this.getSentimentResult([input])}>Submit</Button>
          </div>

          {sentimentResp
          ? <div style={{ marginTop: 20, marginBottom: 20 }}>
              <strong>Detected sentiment:</strong>
              <span style={{ marginLeft: 20 }}>{sentimentScore}</span>
              <Tag style={{ marginLeft: 20 }} color={sentimentScore >= 0 ? 'green' : 'red'}>
                {sentimentScore > 0
                  ? 'Positive'
                  : sentimentScore < 0
                    ? 'Negative' 
                    : 'Neutral'}
              </Tag>
            </div>
          : <div />}
        </PageHeader>
      </>
    );
  }
}

export default withRouter(SentimentPage);
