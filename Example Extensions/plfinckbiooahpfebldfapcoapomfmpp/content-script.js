var extpay = ExtPay("ekw-pobieracz"),
  cs = {
    status: "init",
    saveDirHandle: null,
    framesParams: [],
    proxyList: [],
    userAgents: [],
    exportType: "",
    skipFetched: !1,
    captchaSolver: "auto",
    captchaSolverKey: "",
    currentProxyIdx: -1,
    currentUaIdx: -1,
    firewallCooldown: 10,
    emptyBodyCooldown: 10,
    frameErrorCooldown: 10,
    fetchDelay: 0,
    loadTimeout: 10,
    lastProxyChange: 0,
    lastProCheck: 0,
    reCaptchaSolvingTimeout_auto: 60,
    reCaptchaSolvingTimeout_service: 180,
    isSearchSubmitFrameId: !1,
    solvingLogicTaskFrameId: null,
    fetchMode: "interval",
    totalAmount: 0,
    fromNum: 0,
    toNum: 0,
    currentNum: 0,
    completedAmount: 0,
    kodWydzialu: "",
    customKwList: [],
    user: {},
    EKW_URL:
      "https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW",
    EKW_DONE_URL: "about:blank",
    IFRAME_WIDTH: 500,
    IFRAME_HEIGHT: 500,
    cssWydruk:
      '.gclsDbTextbox{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:1pt groove #000;color:Navy;margin:2px;margin-right:0}.gclsDbTextboxHilt{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:1pt groove #000;color:Navy;margin:2px;margin-right:0;background-color:#ffc}.gclsDbTextboxIncorrectValue{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:1pt groove #000;color:#fff;margin:2px;background-color:Red;margin-right:0}SELECT.gclsDbCombo{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:1pt groove #000;color:Navy;margin:2px}SELECT.gclsDbComboHilt{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:1pt groove #000;color:Navy;margin:2px;background-color:#ffc}SELECT.gclsDbComboIncorrectValue{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:1pt groove #000;color:#fff;margin:2px;background-color:Red}DIV.gclsBHVPage{background-color:#c6c3c6;display:none;border:3 outset grey;padding:2 4 2 4}SPAN.gclsBHVTabStandard{background-color:#738294;border:1 inset whitesmoke;height:15px;padding:2 4 2 4;font-family:Verdana;font-size:14px;font-weight:700;color:#c1e1ec}SPAN.gclsBHVTabMouseOver{cursor:hand;background-color:gray;border:1 outset #fff;padding:2 4 2 4;height:15px;font-family:Verdana;font-size:14px;font-weight:700;color:snow}SPAN.gclsBHVTabSelected{background-color:navy;border:1 outset grey;padding:2 4 2 4;height:15px;font-family:Verdana;font-size:14px;font-weight:700;color:snow}INPUT.gclsSlownik{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:2px outset Gray;color:Navy;margin:2px;margin-right:0;border-right:0}INPUT.gclsSlownikHilt{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:2px outset Gray;color:Navy;margin:2px;margin-right:0;border-right:0;background-color:#ffc}INPUT.gclsSlownikIncorrectValue{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:2px outset Gray;border-right:0;color:#fff;margin:2px;background-color:Red;margin-right:0}DIV.NagList{width:635px;padding:0;margin:0;border-bottom-color:Navy;border-bottom-style:double;border-bottom-width:2px}DIV.OsobyL{width:650px;height:60px;padding:0;margin:0;overflow-y:auto}Table.NagList{padding:0;margin:0;cursor:default;width:635px}Table.OsobyL{padding:0;margin:0;width:635px;cursor:default}body{background-color:#828682;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;margin:5px 5px 5px 5px}H1{font-family:verdana,arial;font-size:14pt;font-weight:700;margin-bottom:12pt}H2{font-family:verdana,arial;font-size:12pt;font-weight:700;margin-bottom:12pt}H2.error{font-family:verdana,arial;font-size:12pt;font-weight:700;margin-bottom:12pt;color:#f11}H3{font-family:verdana,arial;font-size:11pt;font-weight:700}H4{font-family:verdana,arial;font-size:9pt;font-weight:700}div.menu{cursor:hand;display:block;position:relative;width:300pt;height:15pt;left:30pt}div.menuPdnkw{cursor:hand;display:block;position:relative;left:30pt}div.itm{cursor:hand;display:block;position:relative;width:350pt;height:15pt;left:20pt}div.sub{display:block}A.menu{font-family:verdana,arial;font-size:9pt;font-weight:700;text-decoration:none;color:black}A.menu:hover{color:red}imsc\\:tabs{behavior:url(behaviors/tabs.htc)}.ramk{margin:0}table[border]{background-color:transparent;border-left-color:#fff;border-top-color:#fff;border-right-color:#aaa;border-bottom-color:#aaa;border-style:solid;border-width:1px}table[border] td{border-left-color:#aaa;border-top-color:#aaa;border-right-color:#eee;border-bottom-color:#eee;border-style:solid;border-width:1px}.wysokieButtony input{height:45px;display:block;white-space:pre-line;width:270px}.wysokieButtony input span{display:block;height:100%;padding-top:5px}.opis{background-color:#a9a9a9;color:#000;font-size:14px;font-weight:700;padding-left:5px;border-style:solid;border-width:1px;border-color:gray;padding-right:0}.errOpis{background-color:#a9a9a9;color:#000;font-size:14px;font-weight:700;padding-top:20px;padding-left:45px;border-style:solid;border-width:1px;border-color:gray;padding-right:0;margin-bottom:15px;height:75px}.opis_w{background-color:#a9a9a9;color:Navy;font-size:12px;font-weight:700;border:2px;border-right-style:outset;border-right-color:Black;border-bottom-style:outset;border-bottom-color:Black;padding-left:5px}.opis_li{background-color:peru;color:#fff;font-size:12px;text-align:center;font-weight:700;border:2px;border-right-style:outset;border-right-color:Black;border-bottom-style:outset;border-bottom-color:Black}.przyc1{width:200px;color:#000;font-size:12px;font-weight:700;cursor:hand;z-index:0}.przyc11{background-image:url(../img/zakl1_w.gif);position:absolute;width:200px;cursor:hand;z-index:2}.poll{width:600px;border:2px;border-color:#000;border-right-style:outset;border-left-style:outset;border-bottom-style:outset;margin-bottom:20px;border-top-style:ridge;border-top-color:Black}.przyc2{font-weight:700;font-size:12px;color:ivory;background-color:#404da6;margin:2px 2px;border-style:outset;border-width:2px;border-left-color:#98a0d8;border-top-color:#98a0d8;border-right-color:#404da6;border-bottom-color:#404da6}.przyc22{background-image:url(../img/zakl1.gif);position:absolute;width:150px;cursor:hand;z-index:5}.opis_m{background-color:#ffdab9;color:Black;font-size:9px;border:1px;border-left-style:outset;border-left-color:#6495ed;border-top-style:outset;border-top-color:Black;padding-left:5px}.opisc{background-color:#a9a9a9;color:#fff;font-size:11px;font-weight:700;border:1px;border-right-style:outset;border-right-color:Black;border-bottom-style:outset;border-bottom-color:Black;text-align:center}.dane{background-color:#f5f5f5;font-size:14px;border:1px;border-right-style:double;border-right-color:Black;border-bottom-style:inset;border-bottom-color:Black;padding-left:5px}.danewyk{background-color:#f5f5f5;color:#000;font-weight:400;text-align:center;font-size:10px;border:2px;border-right-style:double;border-right-color:Black;border-bottom-style:inset;border-bottom-color:Black}.text-left{text-align:left!important}.danewyk2{background-color:#f5f5f5;color:#000;font-weight:700;text-align:center;font-size:12px;border:2px;border-right-style:double;border-right-color:Black;border-bottom-style:inset;border-bottom-color:Black}.dane_1{background-color:#f5f5f5;font-size:14px;border:1px;border-right-style:double;border-right-color:Black;border-bottom-style:inset;border-bottom-color:Black;padding-left:5px}.dane_0{background-color:#ffc;font-size:14px;border:1px;border-right-style:double;border-right-color:Black;border-bottom-style:inset;border-bottom-color:Black;padding-left:5px}.dane_li{background-color:#f5f5f5;color:red;font-weight:700;text-align:center;font-size:12px;border:2px;border-right-style:double;border-right-color:Black;border-bottom-style:inset;border-bottom-color:Black}.danel{background-color:transparent;font-size:14px;border-color:gray;border-bottom-width:1px;border-left-width:0;border-top-width:1px;border-right-width:1px;padding-left:0;border-bottom-style:solid;border-left-style:none;border-top-style:solid;border-right-style:solid}.danelb{background-color:transparent;font-size:14px;border:0;padding-left:0}.danel_w{background-color:#faebd7;font-size:14px;border:1px;border-style:inset;border-color:#aaa}.nag{font-size:16px;font-weight:700;border:1px outset Olive;background-color:#15a;padding-top:3px;color:snow;text-align:center}.nag1{font-size:14px;font-weight:700;border:1px outset Olive;background-color:#fed852;padding-top:3px;color:navy;text-align:center}.nag_uwaga{font-size:18px;font-weight:700;border:1px outset Olive;background-color:#fed852;padding-top:3px;color:red;text-align:center}.tytq{font-weight:700;height:40px;border:1px outset Olive;background-color:#faebd7;text-align:center;color:#cd5c5c;padding:10 px}div.var{position:absolute;visibility:hidden}.opis_l{background-color:#faebd7;font-size:12px;font-weight:400;border:1px;border-right-style:outset;border-right-color:#faebd7;border-bottom-style:outset;border-bottom-color:#faebd7;padding-left:5px;text-align:center}.opis_list{background-color:#faebd7;font-size:10px;font-weight:700;border:1px;border-right-style:outset;border-right-color:#faebd7;border-bottom-style:outset;border-bottom-color:#faebd7;text-align:center}.blado{background-color:tomato;color:#fff;font-weight:700;border-top:Navy 3px double;border-left:Navy 3px double;border-right:Navy 3px double}.bladq{background-color:tomato;color:#fff;height:40px;text-align:center;font-weight:700;border-top:Navy 3px double;border-left:Navy 3px double;border-right:Navy 3px double;border-bottom:Navy 3px double;padding:10 px}.info{background-color:#eee8aa;height:40px;color:Navy;text-align:center;font-weight:700;border-top:Navy 3px double;border-left:Navy 3px double;border-right:Navy 3px double;border-bottom:Navy 3px double;padding:10 px}.bladt{background-color:tomato;color:#fff;font-weight:700;border-top:Navy 3px double;border-bottom:Navy 3px double;border-left:Navy 3px double;border-right:Navy 3px double}.bladt_lokalizator{background-color:tomato;color:#000;font-weight:regular;font-size:10px;text-align:right}input.but,a.but{font-size:11px;font-weight:700;border:0;border-top:2px outset Olive;border-left:2px double Olive;color:#cd5c5c}#nawigacja{width:70%;border:1px groove black}#nawigacja form{box-sizing:border-box;background-clip:padding-box;border-radius:0;color:#000;outline:0;margin:0;padding:0;text-align:left;vertical-align:middle}#nawigacja td{background-color:silver;border:0 groove #000;border-right-width:1px;height:auto}#nawigacja input{background-color:silver;text-decoration:underline;color:blue;cursor:pointer;border:0;margin:0;padding:0;display:inline;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-size:16px;font-style:normal;font-variant:normal;font-weight:700;height:auto;line-height:normal;text-align:start;white-space:normal}#nawigacja input:visited{color:purple}.przyc{border:thin groove Yellow;text-valign:middle;background-color:#396da5}.text{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:400;font-size:14px;color:#000;margin:2px;background-color:White;border-color:#000;border-style:none;border-width:1pt}.text1{font-weight:700;font-size:16px;color:ivory;background-color:#404da6;margin:2px 2px;border-style:outset;border-width:2px;border-left-color:#98a0d8;border-top-color:#98a0d8;border-right-color:#404da6;border-bottom-color:#404da6}.dane1{background-color:#a9a9ba;text-align:center;font-size:12px;border:1px;border-right-style:double;border-right-color:#00008b;border-bottom-style:inset;border-bottom-color:#00008b;font-weight:700}.daneN1{background-color:#3a6ea5;text-align:center;font-size:11px;border:1px;border-right-style:double;border-right-color:#00008b;font-weight:700;border-top-color:#191970;border-top-style:solid;border-top-width:1px}.daneR{background-color:transparent;text-align:center;font-size:11px;border:1px;border-right-style:double;border-right-color:Black;border-bottom-style:inset;border-bottom-color:Black;font-weight:700}.zdane{background-color:#009;text-align:center;font-size:11px;border:1px;border-right-style:double;border-right-color:#00008b;border-bottom-style:inset;border-bottom-color:#00008b;font-weight:700;color:White}.dane0{background-color:#3a6ea5;text-align:center;font-size:11px;border:1px;border-right-style:double;border-right-color:#00008b;border-bottom-style:inset;border-bottom-color:#00008b;font-weight:700}.daneN0{background-color:khaki;text-align:center;font-size:11px;border:1px;border-right-style:double;border-right-color:#00008b;border-bottom-style:inset;border-bottom-color:#00008b;font-weight:700}textarea{text-transform:uppercase;font-family:Verdana,Geneva,Arial,Helvetica,sans-serif;font-weight:700;font-size:11px;border:1pt groove #000;color:Navy}.br{height:4px}p{margin-bottom:2px}.help{background-color:#fffacd}.list1{font-weight:700;font-size:14px;margin-top:10px;margin-bottom:0}.list2{font-weight:700;font-size:12px;margin-left:20px;margin-top:3px;margin-bottom:0}.list3{font-weight:700;font-size:10px;margin-left:30px;margin-top:3px;margin-bottom:0}.kw{margin:2px 4px 1px 2px}#nawig{position:static;display:block;width:99%;background-color:#c6c3c6;border:3 outset grey;padding:2 4 2 4}INPUT.pomBKat{background-color:#dcdcdc;border:2px outset Gray;width:18px;height:19px;font-size:11px;color:Navy;font-weight:700;text-align:center;vertical-align:baseline;padding-bottom:4px;padding-top:0;margin-left:0;margin-bottom:2px;background-attachment:fixed;background-position:center;background-repeat:no-repeat}INPUT.pomBSlow{background-color:#dcdcdc;border:2px outset Gray;width:18px;height:19px;font-size:11px;color:Navy;font-weight:700;text-align:center;vertical-align:baseline;padding-bottom:4px;padding-top:0;margin-left:0;margin-bottom:2px;background-position:center;background-repeat:no-repeat;background-attachment:fixed}.podsw{cursor:hand;font-weight:700;background-color:#ffc;color:#00008b;text-align:center;font-size:11px;border:1px;border-right-style:double;border-right-color:#00008b;border-bottom-style:inset;border-bottom-color:#00008b}.csTTytul{background-color:#fff;text-align:center;font-size:18px;font-weight:700;border-style:solid;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana;padding:1px}.csTytul{background-color:silver;text-align:center;font-size:16px;font-weight:700;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-style:groove;border-color:#000;font-family:Verdana}.csDTytul{background-color:silver;text-align:center;font-size:18px;font-weight:700;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-style:groove;border-color:#000;font-family:Verdana}.csPodTytulClean{background-color:#fff;text-align:center;font-size:16px;font-weight:700;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-style:groove;border-color:#000;font-family:Verdana}.csOpis{background-color:silver;text-align:left;font-size:14px;border-top-width:1px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana;margin:auto;vertical-align:top}.csROpis{background-color:silver;text-align:right;font-size:14px;border-top-width:1px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana;margin:auto;vertical-align:top}.csBOpis{background-color:silver;text-align:left;font-size:14px;font-weight:700;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csCOpis{background-color:silver;text-align:center;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csMOpis{background-color:silver;text-align:left;font-size:10px;border-top-width:1px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana;margin:auto;vertical-align:top}.csCMOpis{background-color:silver;text-align:center;font-size:10px;border-top-width:1px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana;margin:auto;vertical-align:top}.csRMOpis{background-color:silver;text-align:right;font-size:10px;border-top-width:1px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana;margin:auto;vertical-align:top}.csMark{background-color:#aaa;text-align:left;font-size:10px;border-top-width:1px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana;margin:auto;vertical-align:top}.csMark2{background-color:#888;text-align:left;font-size:10px;border-top-width:1px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana;margin:auto;vertical-align:top}.csDane{background-color:#fff;text-align:left;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csDaneMini{background-color:#fff;text-align:left;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csNBDane{background-color:#fff;text-align:left;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:0;border-right-width:0;border-color:#000;font-family:Verdana}.csNDBDane{background-color:#fff;text-align:left;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:0;border-right-width:1px;border-color:#000;font-family:Verdana}.csBDane{background-color:#fff;text-align:left;font-size:14px;font-weight:700;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csBNBDane{background-color:#fff;text-align:left;font-size:14px;font-weight:700;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:0;border-right-width:0;border-color:#000;font-family:Verdana}.csBNDBDane{background-color:#fff;text-align:left;font-size:14px;font-weight:700;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:0;border-right-width:1px;border-color:#000;font-family:Verdana}.csBCDane{background-color:#fff;text-align:center;font-size:14px;font-weight:700;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.tbOdpis{background-color:#000;cell-spacing:0;cell-padding:0;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;background-color:#e0e0e0;font-family:Verdana;margin:0}div.zakl{position:static;bottom:100px;right:50px;left:100px;top:50px}.nagOpWnio{font-size:14px;font-weight:400;border:1px outset Olive;background-color:#404da6;padding-top:3px;color:snow;text-align:left;font-style:italic}.csCDane{background-color:#fff;text-align:center;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csRDane{background-color:#fff;text-align:right;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csMDane{background-color:#fff;text-align:left;font-size:10px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana;border-left:3px;border-right:3px;border-left-color:black}.csBreak{background-color:silver;text-align:left;font-size:1px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csKasujGorna{background-color:#fff;text-align:left;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csKasujGornaZamknieta{background-color:#888;text-align:left;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csKasujDolna{background-color:#fff;text-align:left;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:0;border-right-width:1px;border-color:#000;font-family:Verdana}.csKasujGorna{background-color:#fff;text-align:left;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}.csKasujObie{background-color:#fff;text-align:left;font-size:14px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:0;border-right-width:1px;border-right-color:#000;border-color:#000;font-family:Verdana;color:white}.csBreak2{border-top:0;border-bottom:0}.csTBreak{background-color:#fff;text-align:left;font-size:1px;border-style:groove;border-top-width:0;border-left-width:0;border-bottom-width:1px;border-right-width:1px;border-color:#000;font-family:Verdana}input.dis{background-color:#e0e0e0}input[type="button"][disabled]{color:#ccc!important;text-shadow:1px 1px 0 #fff!important}.hide{display:none!important}.show{display:block!important}.loader{width:100%;height:100%;background:url(../images/loader-bg.png);color:#fff;text-shadow:1px 1px 0 #555;position:absolute;display:none;text-align:center}.loader div{margin:150px auto;text-align:center;background:url(../images/ajax-loader.gif) no-repeat 100px center #c6c3c6;padding:20px 30px;border:1px solid #555;display:inline-block;width:300px}.book_img\\0{border-width:0;margin-right:5px;margin-top:4px}',
    getLetterValue: function (o) {
      var t = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "X",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "R",
        "S",
        "T",
        "U",
        "W",
        "Y",
        "Z",
      ];
      for (let e = 0; e < t.length; e++) if (o === t[e]) return e;
      return -1;
    },
    calcCheckSumDigit: function (e, o) {
      let t = e + "/" + o.padStart(8, "0");
      e = cs.getLetterValue(t.charAt(0));
      return (
        ((e += 3 * cs.getLetterValue(t.charAt(1))) +
          7 * cs.getLetterValue(t.charAt(2)) +
          cs.getLetterValue(t.charAt(3)) +
          3 * cs.getLetterValue(t.charAt(5)) +
          7 * cs.getLetterValue(t.charAt(6)) +
          cs.getLetterValue(t.charAt(7)) +
          3 * cs.getLetterValue(t.charAt(8)) +
          7 * cs.getLetterValue(t.charAt(9)) +
          cs.getLetterValue(t.charAt(10)) +
          3 * cs.getLetterValue(t.charAt(11)) +
          7 * cs.getLetterValue(t.charAt(12))) %
        10
      );
    },
    frameLog: function (e, o) {
      log("[#" + (e + "").padStart(2, "0") + "] " + o);
    },
    submitForm: function (e, o) {
      console.log("submitting frame_" + e + "...");
      e = document.getElementById("frame_" + e);
      let t = e.contentDocument || e.contentWindow.document;
      (t.getElementById("kodWydzialu").value = o.kodWydzialu),
        (t.getElementById("numerKsiegiWieczystej").value = (
          o.numer + ""
        ).padStart(8, "0")),
        (t.getElementById("cyfraKontrolna").value = cs.calcCheckSumDigit(
          o.kodWydzialu,
          o.numer + ""
        )),
        t.getElementById("kryteriaWKW").submit();
    },
    parseBookHTML: function (e, o, t) {
      let r = 0,
        a = !0;
      return (
        "przyciskWydrukZwykly" === o &&
          e.includes('<input value="Okładka" type="submit">') &&
          (a = !1),
        "przyciskWydrukZwykly" === o && a && (r = -1),
        (e = cs.removeHtmlTag(e, "script")),
        (e = cs.removeHtmlTag(e, "link")),
        (e = cs.removeHtmlTag(e, "form", 6 + r)),
        (e = cs.htmlSetElementsAttribute(e, "form", "method", "GET")),
        ("przyciskWydrukZwykly" === o && a) ||
          (e = cs.htmlSetElementsAttribute(
            e,
            "form",
            "action",
            "Okladka.html",
            0
          )),
        (e = cs.htmlSetElementsAttribute(
          e,
          "form",
          "action",
          "I-O.html",
          1 + r
        )),
        (e = cs.htmlSetElementsAttribute(
          e,
          "form",
          "action",
          "I-Sp.html",
          2 + r
        )),
        (e = cs.htmlSetElementsAttribute(
          e,
          "form",
          "action",
          "II.html",
          3 + r
        )),
        (e = cs.htmlSetElementsAttribute(
          e,
          "form",
          "action",
          "III.html",
          4 + r
        )),
        (e = cs.htmlSetElementsAttribute(
          e,
          "form",
          "action",
          "IV.html",
          5 + r
        )),
        ("przyciskWydrukZwykly" === o && a) ||
          (e = cs.htmlReplaceElementHtml(
            e,
            "form",
            "<input value='Okładka' type='submit'>",
            0
          )),
        (e = cs.htmlReplaceElementHtml(
          e,
          "form",
          "<input value='Dział I-O' type='submit'>",
          1 + r
        )),
        (e = cs.htmlReplaceElementHtml(
          e,
          "form",
          "<input value='Dział I-Sp' type='submit'>",
          2 + r
        )),
        (e = cs.htmlReplaceElementHtml(
          e,
          "form",
          "<input value='Dział II' type='submit'>",
          3 + r
        )),
        (e = cs.htmlReplaceElementHtml(
          e,
          "form",
          "<input value='Dział III' type='submit'>",
          4 + r
        )),
        (e = (e = cs.htmlReplaceElementHtml(
          e,
          "form",
          "<input value='Dział IV' type='submit'>",
          5 + r
        )).replace("<head>", "<head><style>" + cs.cssWydruk + "</style>")),
        (e = t
          ? e
          : e.replace(
              "<body>",
              '<body><h2 style="position: fixed; bottom: 0; right: 0; margin: 0px; padding: 3px; background-color: #828682">Pobrano przy pomocy <a target="_blank" href="https://chrome.google.com/webstore/detail/' +
                chrome.runtime.id +
                '?hl=pl">Księgi wieczyste pobieracz PRO</a></h2>'
            ))
      );
    },
    savePageHTML: async function (e, o, t) {
      let r, a, i;
      (r = await cs.saveDirHandle.getDirectoryHandle(o, { create: !0 })),
        (a = await r.getFileHandle(e, { create: !0 })),
        await (i = await a.createWritable()).write(t),
        await i.close();
    },
    isBookExists: async function (e, o) {
      let t = !1,
        r = !1,
        a = !1;
      (e =
        e +
        "-" +
        (o + "").padStart(8, "0") +
        "-" +
        cs.calcCheckSumDigit(e, o + "")),
        (o = e + ".pdf");
      try {
        t = await cs.saveDirHandle.getDirectoryHandle(e);
      } catch (e) {
        t = !1;
      }
      if (t)
        try {
          a = await t.getFileHandle(o);
        } catch (e) {
          a = !1;
        }
      try {
        r = await cs.saveDirHandle.getFileHandle(o);
      } catch (e) {
        r = !1;
      }
      return cs.exportType.includes("html") && cs.exportType.includes("pdf")
        ? t && a
        : cs.exportType.includes("html")
        ? !!t
        : cs.exportType.includes("pdf")
        ? !!r
        : void 0;
    },
    savePagePDF: async function (e, o, t) {
      let r,
        a = new FormData(),
        i;
      a.append(
        "orientation",
        cs.exportType.includes("landscape") ? "Landscape" : "Portrait"
      ),
        a.append("html", t),
        (i = await (i = await fetch("https://ekw.waw.pl/gen.php", {
          body: a,
          method: "post",
        })).blob()),
        (bookPageFileHandle = cs.exportType.includes("html")
          ? await (bookDirHandle = await cs.saveDirHandle.getDirectoryHandle(
              o,
              { create: !0 }
            )).getFileHandle(e, { create: !0 })
          : await cs.saveDirHandle.getFileHandle(e, { create: !0 })),
        await (r = await bookPageFileHandle.createWritable()).write(i),
        await r.close();
    },
    downloadBook: async function (o, e, t = !1) {
      console.log("Downloading book...");
      let r,
        a = "",
        i,
        n;
      var s, l, d;
      let c,
        m,
        f = 0,
        p = !0;
      try {
        if (
          ((i = document.getElementById("frame_" + o)),
          (s = (n =
            i.contentDocument || i.contentWindow.document).getElementById(
            "kodEci"
          ).value),
          (l = n.getElementById("numerKw").value),
          (d = n.getElementById("cyfraKontrolna").value),
          (c = s + "-" + l + "-" + d),
          "przyciskWydrukZwykly" === e &&
            n.body.innerHTML.includes(
              '<input value="Okładka" type="submit">'
            ) &&
            (p = !1),
          "przyciskWydrukZwykly" === e && p && (f = -1),
          cs.frameLog(
            o,
            "Pobieram księgę " + c.replace("-", "/").replace("-", "/") + "..."
          ),
          cs.framesParams[o].downloadPages.okladka ||
            ("przyciskWydrukZwykly" === e && p) ||
            ((i = document.getElementById("frame_" + o)),
            (n = i.contentDocument || i.contentWindow.document),
            (r = n.documentElement.outerHTML),
            (r = cs.parseBookHTML(r, e, t)),
            (cs.framesParams[o].downloadPages.okladka = r)),
          !cs.framesParams[o].downloadPages.io)
        ) {
          if (
            !(
              ("przyciskWydrukZwykly" === e && p) ||
              (await cs.waitToSolveLogicTask(),
              n.getElementsByTagName("form")[1].submit(),
              (m = await cs.waitForFrameToLoad(
                o,
                "DZIAŁ I-O - OZNACZENIE NIERUCHOMOŚCI"
              )))
            )
          )
            return !(cs.framesParams[o].downloadFailed = !0);
          (i = document.getElementById("frame_" + o)),
            (n = i.contentDocument || i.contentWindow.document),
            (r = n.documentElement.outerHTML),
            (r = cs.parseBookHTML(r, e, t)),
            (cs.framesParams[o].downloadPages.io = r);
        }
        if (!cs.framesParams[o].downloadPages.isp) {
          if (
            (await cs.waitToSolveLogicTask(),
            n.getElementsByTagName("form")[2 + f].submit(),
            !(m = await cs.waitForFrameToLoad(
              o,
              "DZIAŁ I-SP - SPIS PRAW ZWIĄZANYCH Z WŁASNOŚCIĄ"
            )))
          )
            return !(cs.framesParams[o].downloadFailed = !0);
          (i = document.getElementById("frame_" + o)),
            (n = i.contentDocument || i.contentWindow.document),
            (r = n.documentElement.outerHTML),
            (r = cs.parseBookHTML(r, e, t)),
            (cs.framesParams[o].downloadPages.isp = r);
        }
        if (!cs.framesParams[o].downloadPages.ii) {
          if (
            (await cs.waitToSolveLogicTask(),
            n.getElementsByTagName("form")[3 + f].submit(),
            !(m = await cs.waitForFrameToLoad(o, "DZIAŁ II - WŁASNOŚĆ")))
          )
            return !(cs.framesParams[o].downloadFailed = !0);
          (i = document.getElementById("frame_" + o)),
            (n = i.contentDocument || i.contentWindow.document),
            (r = n.documentElement.outerHTML),
            (r = cs.parseBookHTML(r, e, t)),
            (cs.framesParams[o].downloadPages.ii = r);
        }
        if (!cs.framesParams[o].downloadPages.iii) {
          if (
            (await cs.waitToSolveLogicTask(),
            n.getElementsByTagName("form")[4 + f].submit(),
            !(m = await cs.waitForFrameToLoad(
              o,
              "DZIAŁ III - PRAWA, ROSZCZENIA I OGRANICZENIA"
            )))
          )
            return !(cs.framesParams[o].downloadFailed = !0);
          (i = document.getElementById("frame_" + o)),
            (n = i.contentDocument || i.contentWindow.document),
            (r = n.documentElement.outerHTML),
            (r = cs.parseBookHTML(r, e, t)),
            (cs.framesParams[o].downloadPages.iii = r);
        }
        if (!cs.framesParams[o].downloadPages.iv) {
          if (
            (await cs.waitToSolveLogicTask(),
            n.getElementsByTagName("form")[5 + f].submit(),
            !(m = await cs.waitForFrameToLoad(o, "DZIAŁ IV - HIPOTEKA")))
          )
            return !(cs.framesParams[o].downloadFailed = !0);
          (i = document.getElementById("frame_" + o)),
            (n = i.contentDocument || i.contentWindow.document),
            (r = n.documentElement.outerHTML),
            (r = cs.parseBookHTML(r, e, t)),
            (cs.framesParams[o].downloadPages.iv = r);
        }
        cs.exportType.includes("html") &&
          (("przyciskWydrukZwykly" === e && p) ||
            (await cs.savePageHTML(
              "Okladka.html",
              c,
              cs.framesParams[o].downloadPages.okladka
            )),
          await cs.savePageHTML(
            "I-O.html",
            c,
            cs.framesParams[o].downloadPages.io
          ),
          await cs.savePageHTML(
            "I-Sp.html",
            c,
            cs.framesParams[o].downloadPages.isp
          ),
          await cs.savePageHTML(
            "II.html",
            c,
            cs.framesParams[o].downloadPages.ii
          ),
          await cs.savePageHTML(
            "III.html",
            c,
            cs.framesParams[o].downloadPages.iii
          ),
          await cs.savePageHTML(
            "IV.html",
            c,
            cs.framesParams[o].downloadPages.iv
          )),
          cs.exportType.includes("pdf") &&
            t &&
            ((a =
              "przyciskWydrukZwykly" === e && p
                ? cs.removeHtmlElement(
                    cs.framesParams[o].downloadPages.io,
                    "#nawigacja"
                  )
                : ((a = cs.removeHtmlElement(
                    cs.framesParams[o].downloadPages.okladka,
                    "#nawigacja"
                  )),
                  cs.appendHTML(
                    a,
                    "#contentDzialu",
                    cs.getHtmlElementStr(
                      cs.framesParams[o].downloadPages.io,
                      "#contentDzialu"
                    )
                  ))),
            (a = cs.appendHTML(
              a,
              "#contentDzialu",
              cs.getHtmlElementStr(
                cs.framesParams[o].downloadPages.isp,
                "#contentDzialu"
              )
            )),
            (a = cs.appendHTML(
              a,
              "#contentDzialu",
              cs.getHtmlElementStr(
                cs.framesParams[o].downloadPages.ii,
                "#contentDzialu"
              )
            )),
            (a = cs.appendHTML(
              a,
              "#contentDzialu",
              cs.getHtmlElementStr(
                cs.framesParams[o].downloadPages.iii,
                "#contentDzialu"
              )
            )),
            (a = cs.appendHTML(
              a,
              "#contentDzialu",
              cs.getHtmlElementStr(
                cs.framesParams[o].downloadPages.iv,
                "#contentDzialu"
              )
            )),
            await cs.savePagePDF(c + ".pdf", c, a));
      } catch (e) {
        return console.error(e), !(cs.framesParams[o].downloadFailed = !0);
      }
      return (
        (cs.framesParams[o].bookSaved = !0),
        (cs.framesParams[o].isDownloading = !1),
        (cs.framesParams[o].downloadFailed = !1),
        (cs.framesParams[o].downloadPages = {}),
        !0
      );
    },
    waitToSolveLogicTask: async function () {
      for (; cs.solvingLogicTaskFrameId; ) await cs.sleep(500);
      return !0;
    },
    whichPage: function (e) {
      return e.body &&
        e.body.textContent &&
        (e.body.textContent.includes("The requested URL was rejected") ||
          e.body.textContent.includes("your support id is"))
        ? "firewall"
        : e.body &&
          e.body.textContent &&
          e.body.textContent.includes("Księga o numerze:") &&
          e.body.textContent.includes("nie została odnaleziona.")
        ? "book-not-found"
        : e.getElementById("kryteriaWKW")
        ? "search"
        : e.body &&
          e.body.textContent &&
          e.body.textContent.includes("TREŚĆ KSIĘGI WIECZYSTEJ NR") &&
          e.getElementById("nawigacja")
        ? "book-content"
        : e.getElementById("przyciskWydrukZupelny")
        ? "book-summary"
        : "unknown";
    },
    pageHasReCaptcha: function (e) {
      return null != e.getElementById("g-recaptcha2");
    },
    pageHasLogicTaskCaptcha: function (e) {
      return null != e.getElementById("captchaBean.odpowiedzZGui");
    },
    refreshLogicTask: async function (e) {
      let o = e.getElementById("odswiez");
      if (o) {
        o.classList.contains("refreshing-task") ||
          o.classList.add("refreshing-task"),
          await cs.sleep(12e4),
          o.click();
        for (
          var t = new Date().getTime() / 1e3;
          new Date().getTime() / 1e3 - t < 15;

        )
          if (
            (await cs.sleep(100),
            (o = e.getElementById("odswiez")) &&
              !o.classList.contains("refreshing-task"))
          )
            return !0;
      }
      return !1;
    },
    recaptchaSiteKey: function (e) {
      try {
        return e.querySelector("div[class='g-recaptcha2']").dataset.sitekey;
      } catch (e) {}
      return "";
    },
    getReCaptchaSolvingTimeout: function () {
      return "auto" === cs.captchaSolver
        ? cs.reCaptchaSolvingTimeout_auto
        : cs.reCaptchaSolvingTimeout_service;
    },
    solveRecaptchaPaid: async function (a, i) {
      try {
        if ("" === cs.captchaSolverKey)
          return (
            log(
              "Brak klucza API do wybranej usługi rozwiązywania captcha - wpisz go w ustawieniach!"
            ),
            !(cs.framesParams[a].reCaptchaStatus = "error")
          );
        var n = cs.recaptchaSiteKey(i);
        if ("" === n)
          return (
            cs.frameLog(a, "Nie udało się pobrać captcha siteKey"),
            !(cs.framesParams[a].reCaptchaStatus = "error")
          );
        let e = {
            clientKey: cs.captchaSolverKey,
            task: {
              type: "NoCaptchaTaskProxyless",
              websiteURL: cs.EKW_URL,
              websiteKey: n,
            },
          },
          o = "",
          t =
            ("anticaptcha" === cs.captchaSolver
              ? (o = "https://api.anti-captcha.com/")
              : "capmonster" === cs.captchaSolver
              ? (o = "https://api.capmonster.cloud/")
              : "anycaptcha" === cs.captchaSolver &&
                ((o = "https://api.anycaptcha.com/"),
                (e.task.type = "RecaptchaV2TaskProxyless")),
            await fetch(o + "createTask", {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(e),
              method: "post",
            }));
        if (!t.ok || 200 !== t.status) throw "error 1";
        t = await t.json();
        let r = 0;
        if (0 != t.errorId)
          return (
            cs.frameLog(
              a,
              "Błąd po stronie usługi " +
                cs.captchaSolver +
                ": " +
                t.errorDescription +
                " (" +
                t.errorCode +
                ")"
            ),
            !(cs.framesParams[a].reCaptchaStatus = "error")
          );
        (r = t.taskId), (e = { clientKey: cs.captchaSolverKey, taskId: r });
        for (
          var s = Math.floor(Date.now() / 1e3);
          Math.floor(Date.now() / 1e3) - s <=
          cs.getReCaptchaSolvingTimeout() - 5;

        ) {
          if (
            (t = await fetch(o + "getTaskResult", {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(e),
              method: "post",
            })).ok &&
            200 === t.status
          )
            if (0 == (t = await t.json()).errorId && "ready" == t.status)
              return (
                (i.getElementById(
                  "captchaBean.reCaptcha2Bean.recaptchaResponse"
                ).value = t.solution.gRecaptchaResponse),
                console.log(
                  "frame_" +
                    a +
                    " recaptcha token: " +
                    i.getElementById(
                      "captchaBean.reCaptcha2Bean.recaptchaResponse"
                    ).value
                ),
                (cs.framesParams[a].reCaptchaStatus = "solved"),
                !0
              );
          await cs.sleep(1e3);
        }
        return !1;
      } catch (e) {
        return (
          console.error(e),
          cs.frameLog(
            a,
            "Wystąpił błąd podczas rozwiązywania captchy, próbuję ponownie..."
          ),
          !(cs.framesParams[a].reCaptchaStatus = "error")
        );
      }
    },
    randomInt: function (e, o) {
      return (
        (e = Math.ceil(e)),
        (o = Math.floor(o)),
        Math.floor(Math.random() * (o - e)) + e
      );
    },
    cooldownFrame: function (e) {
      console.log(
        "frame_" + e + "request rejected: cooldown " + cs.firewallCooldown + "s"
      ),
        cs.frameLog(
          e,
          "Żądanie zablokowane przez WAF - czekam " +
            cs.firewallCooldown +
            " sekund"
        ),
        (cs.framesParams[e].coolDownStart = Math.floor(Date.now() / 1e3));
    },
    isFrameCooldown: function (e, o) {
      return (
        e.coolDownStart &&
        Math.floor(Date.now() / 1e3) - e.coolDownStart <= cs.firewallCooldown
      );
    },
    isEmptyBodyCooldown: function (e) {
      return (
        e.emptyBodyCoolDownStart &&
        Math.floor(Date.now() / 1e3) - e.emptyBodyCoolDownStart <=
          cs.emptyBodyCooldown
      );
    },
    isFrameErrorCooldown: function (e) {
      return (
        e.frameErrorCoolDownStart &&
        Math.floor(Date.now() / 1e3) - e.frameErrorCoolDownStart <=
          cs.frameErrorCooldown
      );
    },
    isFetchDelayCooldown: function (e) {
      return (
        e.fetchDelayCoolDownStart &&
        Math.floor(Date.now() / 1e3) - e.fetchDelayCoolDownStart <=
          cs.fetchDelay
      );
    },
    isEmptyBodyHalfCooldown: function (e) {
      return (
        e.emptyBodyCoolDownStart &&
        Math.floor(Date.now() / 1e3) - e.emptyBodyCoolDownStart >=
          cs.emptyBodyCooldown / 2
      );
    },
    endFrameCooldown: function (e, o) {
      console.log("end frame_" + e + " cooldown..."),
        cs.frameLog(e, "Wznowiono działanie"),
        (cs.framesParams[e].coolDownStart = null),
        (cs.framesParams[e].emptyBodyCoolDownStart = null),
        (cs.framesParams[e].frameErrorCoolDownStart = null),
        (cs.framesParams[e].fetchDelayCoolDownStart = null),
        (cs.framesParams[e].isDownloading = !1),
        (cs.framesParams[e].bookSaved = !1),
        (cs.framesParams[e].downloadFailed = !1),
        (cs.framesParams[e].reCaptchaSolvingStartTime = 0),
        (cs.framesParams[e].reCaptchaStatus = "idle"),
        (o.location = cs.EKW_URL);
    },
    resetFrameDownloadStatus: function (e) {
      (cs.framesParams[e].isDownloading = !1),
        (cs.framesParams[e].downloadFailed = !1),
        (cs.framesParams[e].bookSaved = !1),
        (cs.framesParams[e].reCaptchaSolvingStartTime = 0),
        (cs.framesParams[e].reCaptchaStatus = "idle");
    },
    clearCookies: function () {
      console.log("clearing all cookies and local storage/session..."),
        localStorage.clear(),
        sessionStorage.clear(),
        chrome.runtime.sendMessage(chrome.runtime.id, {
          type: "clear-cookies",
        });
    },
    changeUserAgent: async function () {
      if (0 === cs.userAgents.length) {
        let e = await fetch("https://ekw.waw.pl/get_ua.php");
        e.ok && 200 === e.status
          ? ((e = await e.text()),
            (cs.userAgents = e.replaceAll("\r\n", "\n").split("\n")))
          : (cs.userAgents = [
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
              "Mozilla/5.0 (X11; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0",
              "Mozilla/5.0 (X11; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/105.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Windows NT 10.0; rv:105.0) Gecko/20100101 Firefox/105.0",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:104.0) Gecko/20100101 Firefox/104.0",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:105.0) Gecko/20100101 Firefox/105.0",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Windows NT 10.0; rv:104.0) Gecko/20100101 Firefox/104.0",
              "Mozilla/5.0 (X11; Linux x86_64; rv:103.0) Gecko/20100101 Firefox/103.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.42",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
              "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:105.0) Gecko/20100101 Firefox/105.0",
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6.1 Safari/605.1.15",
              "Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0",
              "Mozilla/5.0 (X11; Linux x86_64; rv:102.0) Gecko/20100101 Firefox/102.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.33",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
              "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:104.0) Gecko/20100101 Firefox/104.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.53",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:106.0) Gecko/20100101 Firefox/106.0",
              "Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:103.0) Gecko/20100101 Firefox/103.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36 Edg/105.0.1343.50",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 OPR/90.0.4480.84",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 OPR/90.0.4480.117",
              "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.34",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36 Edg/106.0.1370.37",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:102.0) Gecko/20100101 Firefox/102.0",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15",
              "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Safari/605.1.15",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
              "Mozilla/5.0 (Windows NT 10.0; rv:103.0) Gecko/20100101 Firefox/103.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.126 Safari/537.36",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36",
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:105.0) Gecko/20100101 Firefox/105.0",
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 OPR/90.0.4480.100",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Safari/605.1.15",
              "Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:100.0) Gecko/20100101 Firefox/100.0",
              "Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:106.0) Gecko/20100101 Firefox/106.0",
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Safari/605.1.15",
              "Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            ]);
      }
      let e = "";
      cs.currentUaIdx < 0
        ? ((e = cs.userAgents[0]), (cs.currentUaIdx = 0))
        : cs.currentUaIdx + 1 > cs.userAgents.length - 1
        ? ((cs.currentUaIdx = 0), (e = cs.userAgents[0]))
        : ((e = cs.userAgents[cs.currentUaIdx + 1]), (cs.currentUaIdx += 1)),
        console.log("changing user-agent to: " + e),
        await chrome.runtime.sendMessage(chrome.runtime.id, {
          type: "set-user-agent",
          ua: e,
        });
    },
    changeProxy: async function () {
      if (0 !== cs.proxyList.length) {
        let e = "";
        cs.currentProxyIdx < 0
          ? ((e = cs.proxyList[0]), (cs.currentProxyIdx = 0))
          : cs.currentProxyIdx + 1 > cs.proxyList.length - 1
          ? ((cs.currentProxyIdx = 0), (e = cs.proxyList[0]))
          : ((e = cs.proxyList[cs.currentProxyIdx + 1]),
            (cs.currentProxyIdx += 1)),
          console.log("changing proxy to " + e.ip + ":" + e.port),
          log("Ustawiam proxy: " + e.ip + ":" + e.port),
          await chrome.runtime.sendMessage(chrome.runtime.id, {
            type: "set-proxy",
            proxy: e.ip + ":" + e.port,
          });
      }
    },
    isAllFramesPaused() {
      let e = 0,
        o = null;
      for (o of cs.framesParams) o.paused && e++;
      return e >= cs.framesParams.length;
    },
    handleFrames: async function () {
      console.log("handleFrames()");
      let o = [],
        t = [],
        r = null,
        a = null;
      var i, n;
      let s = null,
        l = !1;
      var d;
      let c = 0,
        m = 0,
        f = "",
        p = 0,
        g = "";
      for (
        Logger.open(),
          Logger.show(),
          0 < cs.proxyList.length &&
            ((cs.proxyList = cs.proxyList
              .map((e) => ({ value: e, sort: Math.random() }))
              .sort((e, o) => e.sort - o.sort)
              .map(({ value: e }) => e)),
            await cs.changeProxy()),
          await cs.changeUserAgent(),
          "auto" === cs.captchaSolver && (await cs.recaptchaSolverSwitch(!0));
        ;

      ) {
        if (
          ((s = null),
          (60 <= new Date().getTime() / 1e3 - cs.lastProCheck ||
            0 === cs.lastProCheck) &&
            ((d = await cs.isPro()),
            (l =
              !0 === d
                ? ((cs.lastProCheck = new Date().getTime() / 1e3), d)
                : -1 === d && l)),
          !l && 10 < c)
        )
          return;
        let e = !1;
        for (s of cs.framesParams)
          try {
            if (
              (document
                .getElementById("pause-button")
                .classList.contains("animate-flicker")
                ? (cs.framesParams[s.frameId].paused = !0)
                : "none" ===
                    document.getElementById("play-button").style.display &&
                  (cs.isAllFramesPaused() && (e = !0),
                  (cs.framesParams[s.frameId].paused = !1)),
              cs.isAllFramesPaused())
            )
              document
                .getElementById("pause-button")
                .classList.contains("animate-flicker") &&
                log("Wstrzymano pobieranie"),
                document
                  .getElementById("pause-button")
                  .classList.remove("animate-flicker"),
                (document.getElementById("pause-button").style.display =
                  "none"),
                (document.getElementById("pause-button-text").innerText =
                  "Pauza"),
                (document.getElementById("play-button").style.display =
                  "block");
            else if (
              (e && (log("Wznowiono pobieranie"), (e = !1)),
              (null === cs.solvingLogicTaskFrameId ||
                cs.solvingLogicTaskFrameId === s.frameId) &&
                !cs.isFetchDelayCooldown(s))
            ) {
              cs.framesParams[s.frameId].fetchDelayCoolDownStart = 0;
              try {
                (r = document.getElementById("frame_" + s.frameId)),
                  (a = r.contentDocument || r.contentWindow.document);
              } catch (e) {
                if (cs.isFrameErrorCooldown(s)) continue;
                if (0 === s.frameErrorCoolDownStart) {
                  (cs.framesParams[s.frameId].frameErrorCoolDownStart =
                    Math.floor(Date.now() / 1e3)),
                    console.log(
                      "frame_" +
                        s.frameId +
                        " unknown error, starting cooldown..."
                    );
                  continue;
                }
                (cs.framesParams[s.frameId].frameErrorCoolDownStart = 0),
                  console.log(
                    "frame_" + s.frameId + " unknown error, re-creating..."
                  ),
                  cs.frameLog(
                    s.frameId,
                    "Wystąpił błąd sieciowy, resetuję wątek..."
                  ),
                  console.error(e),
                  cs.resetFrameDownloadStatus(s.frameId),
                  (cs.framesParams[s.frameId].isLoading = !1),
                  (cs.framesParams[s.frameId].loadingStartTime = 0),
                  cs.reSpawnFrame(s.frameId);
                continue;
              }
              for (
                cs.framesParams[s.frameId].frameErrorCoolDownStart = 0,
                  "interval" === cs.fetchMode
                    ? ((m = cs.currentNum + 1), (f = cs.kodWydzialu))
                    : ((m = cs.currentNum + 1),
                      void 0 !== cs.customKwList[m] &&
                        (f = cs.customKwList[m].kodWydzialu));
                ;

              )
                if ("interval" === cs.fetchMode) {
                  if (
                    !(
                      cs.skipFetched &&
                      m <= cs.toNum &&
                      (await cs.isBookExists(f, m))
                    )
                  )
                    break;
                  log(
                    "Pomijam istniejącą księgę " +
                      f +
                      "/" +
                      (m + "").padStart(8, "0") +
                      "/" +
                      cs.calcCheckSumDigit(f, m + "")
                  ),
                    (cs.currentNum += 1),
                    (cs.completedAmount += 1),
                    (m = cs.currentNum + 1);
                } else {
                  if (
                    !(
                      cs.skipFetched &&
                      m <= cs.customKwList.length - 1 &&
                      (await cs.isBookExists(f, cs.customKwList[m].numer))
                    )
                  )
                    break;
                  log(
                    "Pomijam istniejącą księgę " +
                      f +
                      "/" +
                      (cs.customKwList[m].numer + "").padStart(8, "0") +
                      "/" +
                      cs.calcCheckSumDigit(f, cs.customKwList[m].numer + "")
                  ),
                    (cs.currentNum += 1),
                    (cs.completedAmount += 1),
                    (m = cs.currentNum + 1),
                    void 0 !== cs.customKwList[m] &&
                      (f = cs.customKwList[m].kodWydzialu);
                }
              if (o.includes(s.frameId))
                console.log(
                  "Skipping frame_" + s.frameId + " because it's completted"
                );
              else if (cs.framesParams[s.frameId].downloadFailed)
                console.log(
                  "frame_" + s.frameId + " download failed, reset..."
                ),
                  cs.frameLog(
                    s.frameId,
                    "Błąd poczas pobierania, próbuję ponownie..."
                  ),
                  cs.resetFrameDownloadStatus(s.frameId),
                  (a.location = cs.EKW_URL);
              else if ("complete" !== a.readyState) {
                if (cs.framesParams[s.frameId].isLoading) {
                  if (
                    new Date().getTime() / 1e3 -
                      cs.framesParams[s.frameId].loadingStartTime >=
                    cs.loadTimeout
                  ) {
                    console.log(
                      "frame_" + s.frameId + " timeout, reloading..."
                    ),
                      cs.frameLog(
                        s.frameId,
                        "Przekroczono czas oczekiwania na odpowiedź, próbuję ponownie..."
                      ),
                      (cs.framesParams[s.frameId].isLoading = !1),
                      (cs.framesParams[s.frameId].loadingStartTime = 0),
                      (a.location = cs.EKW_URL);
                    continue;
                  }
                } else
                  (cs.framesParams[s.frameId].isLoading = !0),
                    (cs.framesParams[s.frameId].loadingStartTime =
                      new Date().getTime() / 1e3);
                console.log(
                  "Waiting for frame_" + s.frameId + " to finish loading..."
                );
              } else {
                if ("complete" === a.readyState)
                  if (
                    ((cs.framesParams[s.frameId].isLoading = !1),
                    (cs.framesParams[s.frameId].loadingStartTime = 0),
                    "" === a.getElementsByTagName("body")[0].innerText.trim())
                  ) {
                    if (!cs.isEmptyBodyCooldown(s)) {
                      cs.framesParams[s.frameId].emptyBodyCoolDownStart =
                        Math.floor(Date.now() / 1e3);
                      continue;
                    }
                    cs.isEmptyBodyHalfCooldown(s) &&
                      (console.log(
                        "frame_" + s.frameId + " empty body, reset..."
                      ),
                      cs.frameLog(
                        s.frameId,
                        "Błąd podczas ładowania strony, próbuję ponownie..."
                      ),
                      cs.resetFrameDownloadStatus(s.frameId),
                      (cs.framesParams[s.frameId].emptyBodyCoolDownStart =
                        null),
                      (a.location = cs.EKW_URL));
                  } else
                    cs.framesParams[s.frameId].emptyBodyCoolDownStart = null;
                if (
                  cs.framesParams[s.frameId].bookSaved &&
                  -1 !== cs.framesParams[s.frameId].currentNum
                )
                  (g = (
                    "interval" === cs.fetchMode
                      ? ((p = cs.framesParams[s.frameId].currentNum),
                        cs.framesParams[s.frameId])
                      : ((p = cs.customKwList[s.currentNum].numer),
                        cs.customKwList[s.currentNum])
                  ).kodWydzialu),
                    console.log(
                      "frame_" +
                        s.frameId +
                        " finished downloading book num: " +
                        p
                    ),
                    cs.frameLog(
                      s.frameId,
                      "Pobrano księgę " +
                        g +
                        "/" +
                        (p + "").padStart(8, "0") +
                        "/" +
                        cs.calcCheckSumDigit(g, p + "")
                    ),
                    cs.resetFrameDownloadStatus(s.frameId),
                    (cs.completedAmount += 1),
                    (cs.framesParams[s.frameId].currentNum = -1),
                    c++,
                    0 < cs.fetchDelay &&
                      ((cs.framesParams[s.frameId].fetchDelayCoolDownStart =
                        Math.floor(Date.now() / 1e3)),
                      cs.frameLog(
                        s.frameId,
                        "Czekam " +
                          cs.fetchDelay +
                          "s przed pobraniem kolejnej księgi..."
                      )),
                    (a.location = cs.EKW_URL);
                else if ("firewall" === this.whichPage(a))
                  cs.resetFrameDownloadStatus(s.frameId),
                    cs.isFrameCooldown(s, a) ||
                      (s.coolDownStart
                        ? (cs.endFrameCooldown(s.frameId, a),
                          (t = t.filter((e) => e !== s.frameId)))
                        : (t.includes(s.frameId) || t.push(s.frameId),
                          cs.cooldownFrame(s.frameId),
                          0 < t.length &&
                            t.length >=
                              cs.framesParams.length -
                                (cs.totalAmount - cs.completedAmount >
                                cs.framesParams.length
                                  ? 0
                                  : cs.framesParams.length -
                                    (cs.totalAmount - cs.completedAmount)) &&
                            (cs.clearCookies(),
                            (cs.lastProxyChange = new Date().getTime() / 1e3),
                            await cs.changeProxy(),
                            await cs.changeUserAgent())));
                else if (
                  ((t = t.filter((e) => e !== s.frameId)),
                  "book-content" === this.whichPage(a) &&
                    -1 !== cs.framesParams[s.frameId].currentNum)
                )
                  s.isDownloading
                    ? console.log(
                        "Waiting for frame_" +
                          s.frameId +
                          " to finish downloading..."
                      )
                    : ((cs.framesParams[s.frameId].isDownloading = !0),
                      cs.downloadBook(s.frameId, s.rodzajOdpisu, l));
                else if (
                  "book-not-found" === this.whichPage(a) &&
                  -1 !== cs.framesParams[s.frameId].currentNum
                )
                  (g = (
                    "interval" === cs.fetchMode
                      ? ((p = cs.framesParams[s.frameId].currentNum),
                        cs.framesParams[s.frameId])
                      : ((p = cs.customKwList[s.currentNum].numer),
                        cs.customKwList[s.currentNum])
                  ).kodWydzialu),
                    console.log(
                      "frame_" + s.frameId + ": no book with number " + p
                    ),
                    cs.frameLog(
                      s.frameId,
                      "Księga " +
                        s.kodWydzialu +
                        "/" +
                        (p + "").padStart(8, "0") +
                        "/" +
                        cs.calcCheckSumDigit(g, p + "") +
                        " nie istnieje"
                    ),
                    cs.resetFrameDownloadStatus(s.frameId),
                    (cs.completedAmount += 1),
                    (cs.framesParams[s.frameId].currentNum = -1),
                    0 < cs.fetchDelay &&
                      ((cs.framesParams[s.frameId].fetchDelayCoolDownStart =
                        Math.floor(Date.now() / 1e3)),
                      cs.frameLog(
                        s.frameId,
                        "Czekam " +
                          cs.fetchDelay +
                          "s przed pobraniem kolejnej księgi..."
                      )),
                    (a.location = cs.EKW_URL);
                else if (
                  "book-summary" === this.whichPage(a) &&
                  -1 !== cs.framesParams[s.frameId].currentNum
                ) {
                  cs.resetFrameDownloadStatus(s.frameId);
                  let e = !0;
                  a.getElementById("przyciskWydrukZwyklyDisabled") && (e = !1),
                    "przyciskWydrukZwykly" === s.rodzajOdpisu && e
                      ? (a.getElementById("command").innerHTML +=
                          '<input type="hidden" id="dzialKsiegi" name="dzialKsiegi" value="DIO">')
                      : (a.getElementById("command").innerHTML +=
                          '<input type="hidden" id="dzialKsiegi" name="dzialKsiegi" value="OKLADKA">'),
                    ("przyciskWydrukZwykly" === s.rodzajOdpisu && e) ||
                      !cs.framesParams[s.frameId].downloadPages.okladka ||
                      (a.getElementById("dzialKsiegi").value = "DIO"),
                    cs.framesParams[s.frameId].downloadPages.io &&
                      (a.getElementById("dzialKsiegi").value = "DIS"),
                    cs.framesParams[s.frameId].downloadPages.isp &&
                      (a.getElementById("dzialKsiegi").value = "DII"),
                    cs.framesParams[s.frameId].downloadPages.ii &&
                      (a.getElementById("dzialKsiegi").value = "DIII"),
                    cs.framesParams[s.frameId].downloadPages.iii &&
                      (a.getElementById("dzialKsiegi").value = "DIV"),
                    (e
                      ? a.getElementById(
                          cs.framesParams[s.frameId].rodzajOdpisu
                        )
                      : a.getElementById("przyciskWydrukZupelny")
                    ).click();
                } else {
                  if (
                    !1 !== cs.isSearchSubmitFrameId &&
                    cs.isSearchSubmitFrameId !== s.frameId
                  ) {
                    if (
                      ((n =
                        (i = document.getElementById(
                          "frame_" + cs.isSearchSubmitFrameId
                        )).contentDocument || i.contentWindow.document),
                      "search" === this.whichPage(n))
                    ) {
                      console.log(
                        "Waiting for frame_" +
                          s.frameId +
                          " to finish submitting search form of frame_" +
                          cs.isSearchSubmitFrameId +
                          "..."
                      );
                      continue;
                    }
                    cs.isSearchSubmitFrameId = !1;
                  }
                  if ("search" === this.whichPage(a))
                    if (
                      -1 === cs.framesParams[s.frameId].currentNum &&
                      (("interval" === cs.fetchMode && m > cs.toNum) ||
                        ("file" === cs.fetchMode &&
                          m > cs.customKwList.length - 1))
                    )
                      (a.location = cs.EKW_DONE_URL), o.push(s.frameId);
                    else {
                      if (
                        (a.getElementById("captchaBean.odpowiedzZGui.errors") &&
                          (cs.frameLog(
                            s.frameId,
                            "Błędna odpowiedź do zadania logicznego, próbuję ponownie..."
                          ),
                          fetch(
                            "https://ekw.waw.pl/captcha_bad.php?p=" +
                              encodeURIComponent(s.logicTask)
                          ),
                          a
                            .getElementById("captchaBean.odpowiedzZGui.errors")
                            .remove()),
                        this.pageHasReCaptcha(a))
                      ) {
                        if (
                          "solved" !==
                          cs.framesParams[s.frameId].reCaptchaStatus
                        ) {
                          if (
                            0 <
                            cs.framesParams[s.frameId].reCaptchaSolvingStartTime
                          ) {
                            if (
                              new Date().getTime() / 1e3 -
                                cs.framesParams[s.frameId]
                                  .reCaptchaSolvingStartTime >=
                              cs.getReCaptchaSolvingTimeout()
                            ) {
                              console.log(
                                "frame_" +
                                  s.frameId +
                                  " waiting for recaptcha timeout..."
                              ),
                                cs.frameLog(
                                  s.frameId,
                                  "Przekroczono czas oczekiwania na rozwiązanie captchy, próbuję ponownie..."
                                ),
                                cs.resetFrameDownloadStatus(s.frameId),
                                (a.location = cs.EKW_URL);
                              continue;
                            }
                            if (
                              "error" ===
                              cs.framesParams[s.frameId].reCaptchaStatus
                            ) {
                              cs.resetFrameDownloadStatus(s.frameId),
                                (a.location = cs.EKW_URL);
                              continue;
                            }
                          }
                          "solving" !==
                            cs.framesParams[s.frameId].reCaptchaStatus &&
                            "needsSolving" !==
                              cs.framesParams[s.frameId].reCaptchaStatus &&
                            ((cs.framesParams[s.frameId].reCaptchaStatus =
                              "needsSolving"),
                            "auto" !== cs.captchaSolver &&
                              cs.solveRecaptchaPaid(s.frameId, a),
                            (cs.framesParams[
                              s.frameId
                            ].reCaptchaSolvingStartTime =
                              new Date().getTime() / 1e3),
                            console.log(
                              "frame_" + s.frameId + ": needs captcha solving"
                            ),
                            cs.frameLog(s.frameId, "Rozwiązywanie captchy..."));
                          continue;
                        }
                        (cs.framesParams[
                          s.frameId
                        ].reCaptchaSolvingStartTime = 0),
                          (cs.framesParams[s.frameId].reCaptchaStatus = "idle"),
                          cs.frameLog(
                            s.frameId,
                            "Rozwiązano captche, przechodzę dalej..."
                          );
                      }
                      cs.pageHasLogicTaskCaptcha(a),
                        console.log(
                          "frame_" +
                            s.frameId +
                            " submitting for book num: " +
                            m
                        ),
                        cs.resetFrameDownloadStatus(s.frameId),
                        (cs.isSearchSubmitFrameId = s.frameId),
                        -1 === cs.framesParams[s.frameId].currentNum
                          ? ((cs.currentNum = m),
                            (cs.kodWydzialu = f),
                            (cs.framesParams[s.frameId].currentNum = m),
                            (cs.framesParams[s.frameId].kodWydzialu = f),
                            "interval" === cs.fetchMode
                              ? cs.submitForm(s.frameId, {
                                  kodWydzialu: f,
                                  numer: m,
                                })
                              : cs.submitForm(s.frameId, {
                                  kodWydzialu: f,
                                  numer: cs.customKwList[m].numer,
                                }))
                          : "interval" === cs.fetchMode
                          ? cs.submitForm(s.frameId, {
                              kodWydzialu: s.kodWydzialu,
                              numer: s.currentNum,
                            })
                          : cs.submitForm(s.frameId, {
                              kodWydzialu:
                                cs.customKwList[s.currentNum].kodWydzialu,
                              numer: cs.customKwList[s.currentNum].numer,
                            });
                    }
                }
              }
            }
          } catch (e) {
            console.error(e),
              console.log("resetting frame_" + s.frameId + " due to error"),
              cs.frameLog(
                s.frameId,
                "Wystąpił nieznany błąd, resetuję wątek..."
              ),
              this.resetFrameDownloadStatus(s.frameId),
              null !== (r = document.getElementById("frame_" + s.frameId)) &&
                ((a = r.contentDocument || r.contentWindow.document).location =
                  cs.EKW_URL);
          }
        if (
          (("interval" === cs.fetchMode && m > cs.toNum) ||
            ("file" === cs.fetchMode && m > cs.customKwList.length - 1)) &&
          cs.completedAmount >= cs.totalAmount
        ) {
          cs.recaptchaSolverSwitch(!1),
            log("Pobrano wszystkie księgi!"),
            (document.getElementById("play-button").style.display = "none"),
            (document.getElementById("pause-button").style.display = "none");
          for (s of cs.framesParams)
            (r = document.getElementById("frame_" + s.frameId)),
              ((a = r.contentDocument || r.contentWindow.document).location =
                cs.EKW_DONE_URL);
          break;
        }
        await cs.sleep(1e3);
      }
    },
    initFrames: function (o) {
      var t = o.iloscWatkow;
      for (let e = 0; e < t; e++)
        cs.framesParams[e] = {
          frameId: e,
          paused: !1,
          currentNum: -1,
          rodzajOdpisu: o.rodzaj,
          isDownloading: !1,
          downloadFailed: !1,
          downloadPages: {},
          bookSaved: !1,
          coolDownStart: 0,
          emptyBodyCoolDownStart: 0,
          frameErrorCoolDownStart: 0,
          fetchDelayCoolDownStart: 0,
          isLoading: !1,
          loadingStartTime: 0,
          reCaptchaStatus: "none",
          reCaptchaSolvingStartTime: 0,
          logicTask: "",
          logicTaskAnswer: "",
        };
    },
    splitWork: function (o) {
      var t = o.iloscWatkow,
        r = parseInt(o.numeryOd),
        e = parseInt(o.numeryDo) - r + 1,
        a = Math.round(e / t);
      let i = [];
      for (let e = 0; e < t; e++)
        i[e] = {
          frameId: e,
          fromNum: r + e * a,
          toNum: r + e * a + a - 1,
          perThread: a,
          kodWydzialu: o.kodWydzialu,
          rodzajOdpisu: o.rodzaj,
          done: 0,
          isDownloading: !1,
          downloadFailed: !1,
          downloadPages: {},
          bookSaved: !1,
          coolDownStart: 0,
          emptyBodyCoolDownStart: 0,
          frameErrorCoolDownStart: 0,
          fetchDelayCoolDownStart: 0,
          isLoading: !1,
          loadingStartTime: 0,
          reCaptchaStatus: "none",
          reCaptchaSolvingStartTime: 0,
        };
      return (
        a != e / t &&
          (i[t - 1].toNum > o.numeryDo
            ? (i[t - 1].perThread -= i[t - 1].toNum - o.numeryDo)
            : (i[t - 1].perThread += o.numeryDo - i[t - 1].toNum),
          (i[t - 1].toNum = parseInt(o.numeryDo))),
        i
      );
    },
    sleep: function (o) {
      return new Promise((e) => setTimeout(e, o));
    },
    isPro: async function () {
      try {
        return (await extpay.getUser()).paid;
      } catch (e) {
        return console.error(e), -1;
      }
    },
    removeHtmlTag: function (e, o, t = null) {
      const r = new DOMParser(),
        a = r.parseFromString(e, "text/html");
      let i = [...a.getElementsByTagName(o)];
      return (
        i.forEach((e, o) => {
          (null !== t && t !== o) || e.remove();
        }),
        a.documentElement.outerHTML
      );
    },
    removeHtmlElement: function (e, o) {
      const t = new DOMParser(),
        r = t.parseFromString(e, "text/html");
      let a = r.querySelector(o);
      return a.remove(), r.documentElement.outerHTML;
    },
    getHtmlElementStr: function (e, o) {
      let t = new DOMParser(),
        r = t.parseFromString(e, "text/html");
      e = r.querySelector(o);
      return e ? e.innerHTML : "";
    },
    appendHTML: function (e, o, t) {
      let r = new DOMParser(),
        a = r.parseFromString(e, "text/html"),
        i = a.querySelector(o);
      return i.insertAdjacentHTML("beforeend", t), a.documentElement.outerHTML;
    },
    htmlReplaceElementHtml: function (e, o, t, r = null) {
      let a = new DOMParser(),
        i = a.parseFromString(e, "text/html"),
        n = i.querySelectorAll(o);
      for (let e = 0; e < n.length; e++)
        (null !== r && r !== e) || (n[e].innerHTML = t);
      return i.documentElement.outerHTML;
    },
    htmlSetElementsAttribute: function (e, o, t, r, a = null) {
      let i = new DOMParser(),
        n = i.parseFromString(e, "text/html"),
        s = n.querySelectorAll(o);
      for (let e = 0; e < s.length; e++)
        (null !== a && a !== e) || s[e].setAttribute(t, r);
      return n.documentElement.outerHTML;
    },
    waitForElm: async function (e, o, t = 5) {
      for (var r = Math.floor(Date.now() / 1e3); ; ) {
        if (Math.floor(Date.now() / 1e3) - r > t) return !1;
        if (
          (await cs.sleep(100),
          "complete" === e.readyState && e.querySelector(o))
        )
          return !0;
      }
      return !1;
    },
    waitForFunction: async function (e, o = 5) {
      for (var t = Math.floor(Date.now() / 1e3); ; ) {
        if (Math.floor(Date.now() / 1e3) - t > o) return !1;
        if ((await cs.sleep(100), e())) return !0;
      }
      return !1;
    },
    waitForFrameToLoad: async function (e, o = "") {
      var t;
      await cs.sleep(100);
      let r;
      for (var a = Math.floor(Date.now() / 1e3); ; ) {
        if (10 < Math.floor(Date.now() / 1e3) - a) return !1;
        if (
          ((t = document.getElementById("frame_" + e)),
          (r = t.contentDocument || t.contentWindow.document),
          "firewall" === cs.whichPage(r))
        )
          return !1;
        if (
          "complete" === r.readyState &&
          (!o || r.body.textContent.includes(o))
        )
          return console.log("frame " + e + " loaded"), !0;
        await cs.sleep(100);
      }
      return !0;
    },
    waitForFramesToLoad: async function () {
      let r = 0;
      for (;;) {
        if (
          (cs.framesParams.forEach((e, o) => {
            e = document.getElementById("frame_" + e.frameId);
            let t = e.contentDocument || e.contentWindow.document;
            "complete" === t.readyState &&
              (t.getElementById("kodWydzialu") ||
                t.body.textContent.includes(
                  "The requested URL was rejected"
                )) &&
              (console.log("frame_" + o + " loaded"), r++);
          }),
          r >= cs.framesParams.length)
        )
          break;
        await cs.sleep(100);
      }
      return !0;
    },
    reSpawnFrame: function (e) {
      document.getElementById("frame_" + e).remove(),
        document
          .getElementsByTagName("body")[0]
          .insertAdjacentHTML(
            "beforeend",
            `<iframe credentialless="" id="frame_${e}" src="${this.EKW_URL}" width="${this.IFRAME_WIDTH}" height="${this.IFRAME_HEIGHT}"></iframe>`
          );
    },
    spawnFrames: function () {
      let t = "";
      cs.framesParams.forEach((e, o) => {
        t += `<iframe credentialless="" id="frame_${o}" src="${this.EKW_URL}" width="${this.IFRAME_WIDTH}" height="${this.IFRAME_HEIGHT}"></iframe>`;
      }),
        (t =
          (t =
            t +
            `<style>
            @keyframes flickerAnimation {
              0%   { opacity:1; }
              50%  { opacity:0; }
              100% { opacity:1; }
            }
            @-o-keyframes flickerAnimation{
              0%   { opacity:1; }
              50%  { opacity:0; }
              100% { opacity:1; }
            }
            @-moz-keyframes flickerAnimation{
              0%   { opacity:1; }
              50%  { opacity:0; }
              100% { opacity:1; }
            }
            @-webkit-keyframes flickerAnimation{
              0%   { opacity:1; }
              50%  { opacity:0; }
              100% { opacity:1; }
            }
            .animate-flicker {
               -webkit-animation: flickerAnimation 1s infinite;
               -moz-animation: flickerAnimation 1s infinite;
               -o-animation: flickerAnimation 1s infinite;
                animation: flickerAnimation 1s infinite;
            }
            </style>
            ` +
            '<div style="position: fixed; left: 0; top: 0; width: 100%; height: 100%"></div>') +
          `<div id="pause-button" onclick="if (!this.classList.contains('animate-flicker')){this.classList.add('animate-flicker'); document.getElementById('pause-button-text').innerText = 'Czekaj...'}" class="" style="display: block; background-color: #f3f0f0; position: fixed; right: 5px; top: 5px; cursor:pointer; padding: 5px; width: 130px; border-radius: 5px;border: 1px solid black;"><img style="vertical-align: middle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABFQAAARUBKX4CGwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFvSURBVFiFzZe9SsRQEIW/RGEjiHXyCFvsS9il2tr3Sb9l3sDCrYQtrKy3EsQijYW4YCqbsEEEZSwywbjE7ITd/Bw41dw75yQ3mTvjiAgWOI4zAS6BOTAFAiVAqkyAW+BeRD5NiUWkkSoSAxkgRma6J9ibv0HYAyIgbyG8y1xzeK0MAD6wPkB4l2vANxkAZsDmiOIlN8Cs0YA+eRfiVRN+rQE982O+9qbj8OoMRD2Il4z+GKD41Q752tsyR3/R0kDco3jJuCyCE+xF5ga4AlY1sZXGlsZcmWoTGje8Aafq+gx4r8S2wLnGToBXY87QpajtFjyKyBeAiHwAT5XYs4hsNfYNPBhzzl2Ki8UCx7iuDaYuvzfaEAhGYWBQuBSNxFBIR2EgMS6WDgwkcLxCdKExF3gx5gyhXSle8n8pvtPYtTFXUYoHv4yGvo5dABFJgQX9YaGajKclG7wpHUVbPorBZBSjWZ/DqVN2pvvQ1Xj+A94doTf9jngTAAAAAElFTkSuQmCC" />
        <span id="pause-button-text" style="font-weight: bold; padding-left: 10px;">Pauza</span>
        </div>` +
          `<div id="play-button" onclick="this.style.display='none'; document.getElementById('pause-button').style.display='block';" style="display:none; background-color: #f3f0f0; position: fixed; right: 5px; top: 5px; cursor:pointer; padding: 5px; width: 130px; border-radius: 5px;border: 1px solid black;"><img style="vertical-align: middle" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAABDgAAAQ4B6Vk72QAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAGiSURBVFiFzdc9ixNRFMbx34nFmkqwEcM2Vu4WW9tYKTZbiGhja+0XSWUnLKTwE4hgKSgsdm6n4MI2NgvBwioQ8AWvRe5AHJdkbmZicuHp5pznP3PnnnNupJQ0WRGxg7u4j31cz4Jx1ile421K6XujxCmlhcIuRpggNdQkx+wuzb/AuI8hpgXGdU1zjn4RAAY4aWFc1wkGjQBwgPMOzSud42AhQH7zdZjPQwwuBMh73uVnX7Qd/YsAhv/BvNLwLwCzo9bmby/VVD6iFcCoYeBj3MTLDiBGVRHc0bzI7M1t2R18agEwyd4OC4L2aqfmEp7i24oQh3C0KsAcyFU8x69CgCM4bgtQK2LvCvIdw1lXAHMgj/ClQb4zyrpcI4AMcRnvl+Sb9Gx49cwGiU5XRDzAZ9xe8ui4U4CI2I+IN3iFGw1Cxj2zMaqt8ZWIeIaPuFcQekq7QhR4gq8FOf4pRKuW4lv4sKJxUpXiwmb0ENfwAr9bmCdVMypsxz/xo6VxUm/HGx9ItmIk2/hQuhVj+VZcTLbialYDWevlNKrJdNla1/X8D3r3cBN4uoppAAAAAElFTkSuQmCC" />
        <span id="play-button-text" style="font-weight: bold; padding-left: 10px;">Wznów</span>
        </div>`),
        (document.getElementsByTagName("body")[0].innerHTML = t);
    },
    addListeners: function () {
      chrome.runtime.onMessage.addListener(async function (e, o, t) {
        if (e && "start" === e.type) {
          let o = !1;
          try {
            let e = await window.showDirectoryPicker();
            await e.getFileHandle("ekw.test", { create: !0 }),
              (cs.saveDirHandle = e),
              (o = !0);
          } catch (e) {
            console.error(e),
              alert(
                "Błąd - wybierz folder docelowy i zezwól na zapis aby uruchomić proces."
              );
          }
          if (o) {
            (cs.proxyList = e.data.proxyList),
              (cs.exportType = e.data.exportType),
              (cs.skipFetched = e.data.skipFetched),
              (cs.captchaSolver = e.data.captchaSolver),
              (cs.captchaSolverKey = e.data.captchaSolverKey),
              (cs.fetchDelay = e.data.fetchDelay),
              0 < e.data.customKwList.length &&
                ((cs.fetchMode = "file"),
                e.data.customKwList.forEach((e) => {
                  e = e.match(/^([A-Z0-9]{4}).([0-9]{1,8}).*$/);
                  null !== e &&
                    cs.customKwList.push({
                      kodWydzialu: e[1],
                      numer: parseInt(e[2]),
                    });
                })),
              "interval" === cs.fetchMode
                ? ((cs.fromNum = parseInt(e.data.numeryOd)),
                  (cs.toNum = parseInt(e.data.numeryDo)),
                  (cs.currentNum = cs.fromNum - 1),
                  (cs.totalAmount = cs.toNum - cs.fromNum + 1),
                  (cs.kodWydzialu = e.data.kodWydzialu))
                : ((cs.currentNum = -1),
                  (cs.totalAmount = cs.customKwList.length),
                  (cs.kodWydzialu = cs.customKwList[0].kodWydzialu)),
              cs.initFrames(e.data),
              console.log(cs.framesParams);
            try {
              cs.spawnFrames(),
                await cs.waitForFramesToLoad(),
                await cs.handleFrames();
            } catch (e) {
              alert(
                "Wystąpił błąd z weryfikacją dostępu do folderu - spróbuj wybrać go ponownie."
              ),
                console.error(e);
            }
          }
        }
        return !0;
      });
    },
    inIframe: function () {
      try {
        return window.self !== window.top;
      } catch (e) {
        return !0;
      }
    },
    sendMessagesToGoogleFrames(o, t) {
      for (let e = 0; e < window.frames.length; e++)
        try {
          "auto" === t &&
            (window.frames[e].postMessage(
              {
                type: "setFrameId",
                frameId: o,
                status: window.parent.cs.framesParams[o].reCaptchaStatus,
              },
              "*"
            ),
            window.frames[e].postMessage({ type: "activateSolving" }, "*"));
        } catch (e) {}
    },
    recaptchaSolverSwitch(o) {
      new Promise((e) => {
        try {
          chrome.runtime.sendMessage({
            method: "set_settings",
            data: { id: "auto_solve", value: o },
          }),
            chrome.runtime.sendMessage({
              method: "set_settings",
              data: { id: "auto_open", value: o },
            });
        } catch {}
      });
    },
    initCS: async function () {
      await cs.recaptchaSolverSwitch(!1),
        (cs.saveDirHandle = null),
        (cs.framesParams = []),
        (cs.isSearchSubmitFrameId = !1),
        this.addListeners();
    },
  };
document.querySelector('iframe[id^="frame_"]') ||
  cs.inIframe() ||
  (cs.initCS(),
  window.addEventListener("message", function (e) {
    !e.data.type ||
      "setCaptchaStatus" !== e.data.type ||
      !cs.framesParams[e.data.frameId] ||
      ("needsSolving" !== cs.framesParams[e.data.frameId].reCaptchaStatus &&
        "solving" !== cs.framesParams[e.data.frameId].reCaptchaStatus) ||
      (cs.framesParams[e.data.frameId].reCaptchaStatus = e.data.status);
  })),
  cs.inIframe() &&
    setInterval(function () {
      cs.sendMessagesToGoogleFrames(
        window.frameElement.id.split("_")[1],
        window.parent.cs.captchaSolver
      );
    }, 1e3);
