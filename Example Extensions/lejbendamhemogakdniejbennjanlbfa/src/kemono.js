/*
 * Kemonobook
 * http://blog.maripo.org/2017/03/kemonobook/
 */
var KemonoBook = {
  kemonized: [],
};
/*
 * Like
 * Love
 * Haha
 * Wow
 * Sad
 * Angry
 */
var KEMONIZE_TABLE = [
  { human: ["いいね！", "ええやん！", "Like"], serval: "すごーい！" },
  {
    human: ["超いいね！", "めっちゃええやん！", "Love"],
    serval: "すっごーい！",
  },
  { human: ["うけるね", "笑たわ", "Haha"], serval: "たーのしー！" },
  { human: ["すごいね", "すごいやん", "Wow"], serval: "すごいすごーい！" },
  { human: ["悲しいね", "悲しいわ", "Sad"], serval: "やだやだー！" },
  { human: ["ひどいね", "そら怒るわ", "Angry"], serval: "ひどいよー！" },
  { human: ["感謝！", "Thankful"], serval: "ありがとう！" },
  {
    human: ["いいね！を取り消す", "ええやん！取り消し", "Unlike"],
    serval: "すごーい！をとりけす",
  },
];

KemonoBook.findTextNodes = function (root) {
  var nodes = [];
  var _elements = root.getElementsByTagName("*");
  var elements = [];
  for (var i = 0; i < _elements.length; i++) {
    elements.push(_elements[i]);
  }
  elements.push(root);
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    if (element.hasChildNodes()) {
      for (var j = 0; j < element.childNodes.length; j++) {
        var child = element.childNodes[j];
        if (child.nodeType == 3) {
          nodes.push(child);
        }
      }
    }
  }
  return nodes;
};

KemonoBook.translateIntoServalLanguage = function (textNode) {
  var matched = false;
  for (var i = 0; i < KEMONIZE_TABLE.length; i++) {
    dict = KEMONIZE_TABLE[i];
    var human = KEMONIZE_TABLE[i].human;
    for (var j = 0; j < human.length; j++) {
      if (textNode.nodeValue == human[j]) {
        textNode.nodeValue = dict.serval;
        matched = true;
      }
    }
  }
};

KemonoBook.kemonize = function () {
  var forms = [];
  selectors = [
    "*[aria-label='リアクション']",
    ".UFILikeLink",
    ".UFILinkBright",
    "div.uiLayer",
  ];
  for (var i = 0; i < selectors.length; i++) {
    var elements = document.querySelectorAll(selectors[i]);
    for (var j = 0; j < elements.length; j++) {
      forms.push(elements[j]);
    }
  }
  for (var i = 0; i < forms.length; i++) {
    if (forms[i].KEMONIZED) {
      continue;
    }
    var elements = KemonoBook.findTextNodes(forms[i]);
    for (var j = 0; j < elements.length; j++) {
      var element = elements[j];
      KemonoBook.translateIntoServalLanguage(element);
    }
    forms[i].addEventListener(
      "click",
      function (e) {
        for (var i = 0; i < KemonoBook.kemonized.length; i++) {
          KemonoBook.kemonized[i].KEMONIZED = false;
        }
        KemonoBook.kemonized = [];
      },
      true
    );
    KemonoBook.kemonized.push(forms[i]);
    forms[i].KEMONIZED = true;
  }
};

(function () {
  setInterval(KemonoBook.kemonize, 100);
})();
