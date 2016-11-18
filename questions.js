'use strict';

exports.TYPE = {
  UNKOWN:     'unknown',
  HELP:       'help',
  NEXT_BUS:   'next_bus',
  LAST_BUS:   'last_bus',
  // SEARCH_BUS: 'search_bus',
  CANCEL:     'cancel'
}

const QA = [
  // ヘルプ ----------------------------------------
  {
    Q: [
      '使い方',
      'つかいかた',
      'へるぷ',
      'ヘルプ',
      'help'
    ],
    A: this.TYPE.HELP
  },
  // 次のバス ---------------------------------------
  {
    Q: [
      '次のバス',
      'つぎのばす',
      '次',
      'つぎ',
      '次は',
      'つぎは'
    ],
    A: this.TYPE.NEXT_BUS
  },
  // 終バス ----------------------------------------
  {
    Q: [
      '終バス',
      'しゅうばす',
    ],
    A: this.TYPE.LAST_BUS
  },
  // 時間で検索
  // {
  //   Q: [
  //     'じだい',
  //     '時台',
  //     '時だい',
  //     'じごろ',
  //     '時ごろ',
  //     '時頃'
  //   ],
  //   A: this.TYPE.SEARCH_BUS
  // }
  // キャンセル
  {
    Q: [
      '見ない',
      'みない',
      'いい',
      'いらない',
      'NO',
      'no'
    ],
    A: this.TYPE.CANCEL
  }
]

exports.detect_action = (question) => {
  var type = this.TYPE.UNKOWN;
  QA.forEach((it) => {
    it.Q.forEach((q) => {
      if (question.indexOf(q) > -1) type = it.A;
    });
  });
  return type;
}