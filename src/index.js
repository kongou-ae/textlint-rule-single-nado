"use strict";
import {split} from "sentence-splitter";
import {getTokenizer} from "kuromojin";

module.exports = function(context, options = {}) {
    const {Syntax, RuleError, report, getSource} = context;
    
    return {
        [Syntax.Str](node){
            const text = getSource(node);
            const sentences = split(text)
            return getTokenizer().then(tokenizer => {
                sentences.forEach(function (sentence,i) {
                    const tokens = tokenizer.tokenizeForSentence(sentence.raw)

                    let firstFlag = false
                    let secondFlag = 0
                    let position = 0
                    
                    // 「等」か「など」が使われているか確認する
                    tokens.forEach(function(token,j){
                        if ( token.surface_form == '等' && token.reading == 'トウ'){
                            firstFlag = true
                            position = token.word_position
                        }                         
                        if ( token.surface_form == 'など' && token.reading == 'ナド'){
                            firstFlag = true
                            position = token.word_position
                        }                         
                    })

                    // 使われていたら、その前に「や」があるかチェック
                    if (firstFlag == true){
                        tokens.forEach(function(token,k){
                            if ( token.surface_form == 'や' && token.pos_detail_1 == '並立助詞'){
                                secondFlag++
                            }
                            if ( token.surface_form == 'と' && token.pos_detail_1 == '並立助詞'){
                                secondFlag++
                            }
                        })
                    }

                    if (secondFlag == 0){
                        const ruleError = new RuleError("「など」「等」を使う場合は、2つ以上の具体例を挙げます。",{
                            index:position - 1 
                        });
                        report(node, ruleError);                           
                    }
                })
            })
            
        }
    }
};
