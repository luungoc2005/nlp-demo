import React from 'react';
import { 
  PageHeader, 
  AutoComplete, 
  Input, 
  Button,
  Divider,
  Tag 
} from 'antd';
import { Highlight } from '../../components/Highlight';

import axios from 'axios';
import { withRouter } from 'react-router-dom';

import { getFlagEmoji } from '../../utils';

// https://www.iconfinder.com/iconsets/142-mini-country-flags-16x16px 
// import vietnamFlag from '../../assets/flags/vietnam.png'

const examples = [
  'All right, Mr. DeMille, I\'m ready for my close-up.',
  'I guess, in the end, it\'s not just that Breath of the Wild signals that Zelda has finally evolved and moved beyond the structure it\'s leaned on for so long. It\'s that the evolution in question has required Nintendo to finally treat its audience like intelligent people. That newfound respect has led to something big, and different, and exciting. But in an open world full of big changes, Breath of the Wild also almost always feels like a Zelda game — and establishes itself as the first current, vital-feeling Zelda in almost 20 years.',
  'Central American migrants surged across the United States border with Mexico in May, officials announced on Wednesday, as American and Mexican diplomats began discussions aimed at averting the damaging economic consequences from President Trump\'s threat to impose tariffs on all Mexican imports',
]

const conllTagNames = {
  'PER': 'Person',
  'ORG': 'Organization',
  'LOC': 'Location',
  'MISC': 'Miscellaneous',
}

class EntityRecognitionPage extends React.Component {
  state = {
    input: '',
    nerResp: null,
  }

  getNERResult = async () => {
    try {
      const { input } = this.state;
      const resp = await axios.post('/demo/entities_predict', {
        items: [input]
      })

      this.setState({ 
        nerResp: resp.data,
      })
    }
    catch (e) {

    }
  };

  renderEntities(emptyTag = 'O') {
    const { nerResp } = this.state;
    const getTag = (rawTag) => rawTag.indexOf('-') === 1 && rawTag.split('-').length === 2
      ? rawTag.split('-')[1]
      : rawTag
    
    if (nerResp) {
      let result = []
      const sentResp = nerResp[0] // only render the first sentence

      let currentTag = emptyTag;
      let currentText = '';
      sentResp.forEach((token, tokenIdx) => {
        
        if (currentTag === emptyTag
          || getTag(token.tag) !== currentTag
          || token.tag.indexOf('B-') === 0
          || tokenIdx === sentResp.length - 1) {

          if (currentText) {
            if (currentTag !== emptyTag) {
              result.push(<Highlight 
                key={tokenIdx} 
                description={currentTag}
                tooltip={conllTagNames[currentTag]}
              >
                {currentText}
              </Highlight>);
            }
            else {
              const textSpan = (<span 
                key={tokenIdx} 
                style={{ marginRight: 2, marginTop: 10, marginBottom: 10, }}
              >
                {currentText}
              </span>);
              result.push(textSpan)
            }
            currentText = ''
          }
        }

        currentText += token.label
        currentTag = getTag(token.tag)
      })
      return result
    }
    else {
      return <div />
    }
  }

  render() {
    const { history } = this.props;
    const { input, nerResp } = this.state;

    return (
      <>
        <PageHeader
          onBack={() => history.goBack()}
          title="Sentence Annotation"
          subTitle="Named Entity Recognition"
          extra={[
            <Tag.CheckableTag checked key='en'>
              English
              <span role="img" aria-label="flag" style={{ marginLeft: 5 }}>
                {getFlagEmoji('GB')}
              </span>
            </Tag.CheckableTag>
          ]}
        >
          <p>The Named Entity Recognition task's purpose is to identify named entities - which can consist of people, locations, organizations etc. in a given sentence.</p>
          <p>The English model presenting here was trained on an altered version of the <a href="https://www.clips.uantwerpen.be/conll2003/ner/">CoNLL-2003</a> NER dataset</p>
          
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
            <Button type="primary" onClick={() => this.getNERResult()}>Submit</Button>
          </div>
          
          {nerResp && <>
            <h1>Result:</h1>
            <div style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              marginTop: 20,
              marginBottom: 20,
              flexWrap: 'wrap'
            }}>
              {this.renderEntities()}
            </div>
          </>}
        </PageHeader>
      </>
    );
  }
}

export default withRouter(EntityRecognitionPage);
