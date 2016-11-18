'use strict';

module.exports = {
  // https://devdocs.line.me/ja/#send-message-object
  text: (msg) => {
    return {
     type : 'text', 
     text : msg  
    }
  },
  confirm: (msg, textYes, textNo) => {
    return {
      type: 'template',
      altText: 'this is a confirm template',
      template: {
        type: 'confirm',
        text: msg,
        actions: [
          {
            type: 'message',
            label: 'はい',
            text: textYes
          },
          {
            type: 'message',
            label: "いいえ",
            text: textNo
          }
        ]
      }
    }
  },
  buttons: (title, actions) => {
    return {
      type: 'template',
      altText: 'this is a buttons template',
      template: {
        type: 'buttons',
        text: title,
        actions: actions
      }
    }
  },
  buttonAction: (label, action) => {
    return {
      type: 'postback',
      label: label,
      data: action
    }
  }
}
