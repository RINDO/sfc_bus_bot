'use strict';

const msg = require('./line_message_object.js');
 
module.exports = {
  // welcome ------------------------------------
  WELCOME: [
    msg.text('SFC Busへようこそ！'),
    msg.text('「次のバスいつ？」って送ってくれたら、次のバスの時間を教えるよ！'),
    msg.text('「使い方」, 「ヘルプ」などで使い方を表示することができるから詳しい使い方が知りたい人は見てみてね。')
  ],
  // usage --------------------------------------
  ASK_USAGE: [
    msg.buttons('どの機能の使い方が見たい？', [
      msg.buttonAction('次のバス or 終バス', 'action=help&type=ONE'),
      // msg.buttonAction('ざっくりの時間', 'action=help&type=TWO'),
      msg.buttonAction('コマンド', 'action=help&type=THREE')
    ])
  ],
  USAGE: {
    ONE: [
      msg.text('次のバスや終バスの時刻が知りたいときは、こんな感じで聞いてみてね！'),
      msg.text('「次のバスいつ？」\n「終バスいつ？」')
    ],
    // TWO: [
    //   msg.text('時間を送ってくれたら、その時間帯のバスの時刻表を教えるよ'),
    //   msg.text('「15時台のバス」とか、「15時頃」って送ってみてね。')
    // ],
    THREE: [
      msg.text('コマンドについて説明するね'),
      msg.text('SFC busでは、「出発地 目的地 時間(~25)」を半角スペースで区切って送ることで欲しい時刻表を素早く知ることができるよ！'),
      msg.text(`「出発地」「目的地」には、それを表す半角英単語1文字を入れてね。
対応してる場所はこれだよ。
k: 慶應義塾大学本館前
s: 湘南台駅西口
t: 辻堂駅北口`),
      msg.text('例えば「s k 15」って送ったら、「湘南台駅西口から慶應義塾大学本館前に向かう15時台のバスの時刻表を見せて」っていう意味になるよ'),
      msg.text('湘南台駅から辻堂駅へ向かうバスは対応してないから注意してね。')
    ]
  },
  // error --------------------------------------
  ERROR: [
    msg.text('ごめん、わからないです。'),
    msg.buttons('SFC busの使い方見る？', [
      msg.buttonAction('使い方を表示', 'action=help'),
      msg.buttonAction('今はいい', 'action=cancel')
    ])
  ],
  // ask next -----------------------------------
  ASK_NEXT: [
    msg.buttons('どこからどこへ向かうバス？', [
      msg.buttonAction('慶応本館 → 湘南台', 'action=next_bus&from=慶應義塾大学本館前&to=湘南台駅西口'),
      msg.buttonAction('慶応本館 → 辻堂', 'action=next_bus&from=慶應義塾大学本館前&to=辻堂駅北口'),
      msg.buttonAction('湘南台 → 慶応本館', 'action=next_bus&from=湘南台駅西口&to=慶應義塾大学本館前'),
      msg.buttonAction('辻堂 → 慶応本館', 'action=next_bus&from=辻堂駅北口&to=慶應義塾大学本館前')
    ])
  ],
  // ask last -----------------------------------
  ASK_LAST: [
    msg.buttons('どこからどこへ向かうバス？', [
      msg.buttonAction('慶応本館 → 湘南台', 'action=last_bus&from=慶應義塾大学本館前&to=湘南台駅西口'),
      msg.buttonAction('慶応本館 → 辻堂', 'action=last_bus&from=慶應義塾大学本館前&to=辻堂駅北口'),
      msg.buttonAction('湘南台 → 慶応本館', 'action=last_bus&from=湘南台駅西口&to=慶應義塾大学本館前'),
      msg.buttonAction('辻堂 → 慶応本館', 'action=last_bus&from=辻堂駅北口&to=慶應義塾大学本館前')
    ])
  ]
}