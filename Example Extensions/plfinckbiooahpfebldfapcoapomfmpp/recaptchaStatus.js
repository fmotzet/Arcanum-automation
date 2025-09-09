let frameId = null;
window.addEventListener("message", function (e) {
  if (e.data.type && "setFrameId" === e.data.type)
    try {
      null === frameId
        ? ((frameId = e.data.frameId),
          console.log("set frame id to: " + frameId))
        : (console.log("sended status: " + e.data.status),
          ("needsSolving" !== e.data.status && "solving" !== e.data.status) ||
            (document.querySelector('#recaptcha-anchor[aria-checked="true"]')
              ? window.parent.parent.postMessage(
                  {
                    type: "setCaptchaStatus",
                    frameId: frameId,
                    status: "solved",
                  },
                  "*"
                )
              : document.querySelector(
                  '#recaptcha-anchor[aria-checked="false"]'
                ) &&
                window.parent.parent.postMessage(
                  {
                    type: "setCaptchaStatus",
                    frameId: frameId,
                    status: "solving",
                  },
                  "*"
                )));
    } catch (e) {
      console.error(e);
    }
});
