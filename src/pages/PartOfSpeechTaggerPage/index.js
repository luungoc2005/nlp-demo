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

const examples = {
  'en': [
    'All right, Mr. DeMille, I\'m ready for my close-up.',
    'I guess, in the end, it\'s not just that Breath of the Wild signals that Zelda has finally evolved and moved beyond the structure it\'s leaned on for so long. It\'s that the evolution in question has required Nintendo to finally treat its audience like intelligent people. That newfound respect has led to something big, and different, and exciting. But in an open world full of big changes, Breath of the Wild also almost always feels like a Zelda game — and establishes itself as the first current, vital-feeling Zelda in almost 20 years.',
    'Central American migrants surged across the United States border with Mexico in May, officials announced on Wednesday, as American and Mexican diplomats began discussions aimed at averting the damaging economic consequences from President Trump\'s threat to impose tariffs on all Mexican imports',
  ],
  'vi': [
    'Dân Trung Quốc đau đầu vì giá thực phẩm trong thương chiến với Mỹ',
    'Cú va chạm giữa tàu ngầm hạt nhân Liên Xô và tàu sân bay Mỹ năm 1984',
    'Thủ quân Curacao ớn vì độ bạo lực của trận Việt Nam - Thái Lan'
  ]
}

// https://www.clips.uantwerpen.be/pages/mbsp-tags
const posTagNames = {
  'CC': 'Conjunction, Coordinating',
  'CD': 'Cardinal Number',
  'DT': 'Determiner',
  'EX': 'Existential There',
  'FW': 'Foreign Word',
  'IN': 'Conjunction, Subordinating or Preposition',
  'JJ': 'Adjective',
  'JJR': 'Adjective, comparative',
  'JJS': 'Adjective, superlative',
  'LS': 'List Item Marker',
  'MD': 'Verb, modal auxillary',
  'MN': 'Noun, singular or mass',
  'N': 'Noun',
  'NNS': 'Noun, plural',
  'NNP': 'Noun, proper singular',
  'NNPS': 'Noun, proper plural',
  'PDT': 'Predeterminer',
  'POS': 'Possessive Ending',
  'PRP': 'Pronoun, personal',
  'PRP$': 'Pronoun, possessive',
  'RB': 'Adverb',
  'RBR': 'Adverb, comparative',
  'RBS': 'Adverb, superlative',
  'RP': 'Adverb, particle',
  'SYM': 'Symbol',
  'TO': 'Infinitival To',
  'UH': 'Interjection',
  'V': 'Verb',
  'VB': 'Verb, Base form',
  'VBZ': 'Verb, 3rd person singular present',
  'VBP': 'Verb, non-3rd person singular present',
  'VBD': 'Verb, past tense',
  'VBN': 'Verb, past participle',
  'VBG': 'Verb, gerund or present participle',
  'WDT': 'wh-determiner',
  'WP': 'wh-pronoun, personal',
  'WP$': 'wh-pronoun, possessive',
  'WRB': 'wh-adverb',
  'NP': 'Noun Phrase',
  'PP': 'Prepositional Phrase',
  'VP': 'Verb Phrase',
  'ADVP': 'Adverb Phrase',
  'ADJP': 'Adjective Phrase',
  'SBAR': 'Subordinating Conjunction',
  'PRT': 'Particle',
  'INTJ': 'Interjection',
}

class PartOfSpeechTaggerPage extends React.Component {
  state = {
    input: '',
    nerResp: null,
    language: 'vi',
  }

  getNERResult = async () => {
    try {
      const { input, language } = this.state;
      const resp = await axios.post('/demo/pos_predict', {
        items: [input],
        language,
      })

      this.setState({ 
        nerResp: resp.data,
      })
    }
    catch (e) {

    }
  };

  renderEntities(emptyTag = '') {
    const { nerResp } = this.state;
    const getTag = (rawTag) => rawTag && rawTag.indexOf('-') === 1 && rawTag.split('-').length === 2
      ? rawTag.split('-')[1]
      : rawTag || ''
    
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
          if (tokenIdx === sentResp.length - 1) currentText += token.label 

          if (currentText) {
            if (currentTag !== emptyTag) {
              result.push(<Highlight 
                key={tokenIdx} 
                description={currentTag}
                tooltip={posTagNames[currentTag.toUpperCase()]}
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

  setLanguage(language) {
    this.setState({ language })
  }

  render() {
    const { history } = this.props;
    const { input, nerResp } = this.state;

    return (
      <>
        <PageHeader
          onBack={() => history.goBack()}
          title="Sentence Annotation"
          subTitle="Part-Of-Speech Tagging"
          extra={[
            // <Tag.CheckableTag 
            //   checked={this.state.language === 'en'}
            //   onChange={() => this.setLanguage('en')}
            //   key='en'
            // >
            //   English
            //   <span role="img" aria-label="flag" style={{ marginLeft: 5 }}>
            //     {getFlagEmoji('GB')}
            //   </span>
            // </Tag.CheckableTag>,
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
          <p>The Part-Of-Speech Tagging task's purpose is to reads a given sentence and assings parts of speech to each word, such as noun, verb, adjective, etc.</p>
          <p>Name abbreviations come from the Penn Treebank tag set - for which there are plenty of online documentation. One reference is here: <a href="https://www.clips.uantwerpen.be/pages/mbsp-tags">Computational Linguistics and Psycholinguistic Research Cenger - Antwerp University</a></p>
          <p>The English model presenting here was trained on an altered version of the <a href="https://www.clips.uantwerpen.be/conll2003/ner/">CoNLL-2003</a> dataset</p>
          
          <Divider />

          <p>Enter text or choose an example:</p>
          <div style={{ marginTop: 20, marginBottom: 20 }}>
            <AutoComplete 
              dataSource={examples[this.state.language]}
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

export default withRouter(PartOfSpeechTaggerPage);
