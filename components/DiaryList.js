import React, { Component } from 'react';
import { Text, ListView, View, Image } from 'react-native';
import nodeEmoji from 'node-emoji';

export default class DiaryList extends Component {
  constructor() {
    super();
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(['row 1', 'row 2']),
    };
  }

  render() {
    const _renderRow = (rowData) => (
      <View style={{flexDirection: 'row' ,borderColor: 'limegreen', borderBottomWidth: 0.4, height: 100, justifyContent: 'center'}}>
        <Image
          style={{ flex: 3, width: undefined, height: undefined  }}
          source={require('./IMG_0059.jpg')}
        >
          <View style={{flexDirection:'row', flexWrap:'wrap'}}>
            <Text style={{ fontSize: 30, top: 60, right: 0, position: 'absolute', backgroundColor: 'transparent' }}>
              {nodeEmoji.get('smile')}
            </Text>
          </View>
        </Image>
        <View style={{ flex: 4, padding: 5 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 12, marginBottom: 10, color: 'grey' }}>2017-10-21</Text>
            <Text style={{ fontSize: 12, marginBottom: 10, color: 'grey' }}>by すーさん</Text>
          </View>
          <Text style={{ letterSpacing: 0.6, fontSize: 15, marginBottom: 10 }} numberOfLines={1}>
            今日はみなとみらいまでいったaa
          </Text>
          <Text style={{ letterSpacing: 0.6 }} numberOfLines={2} selectable={true} >
            今日はみなとみらいまでいった.今日はみなとみらいまでい.....aaaaaaaaaaaaaaa
          </Text>
        </View>
      </View>
    )
    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={_renderRow}
        automaticallyAdjustContentInsets={false}
      />
    );
  }
}
