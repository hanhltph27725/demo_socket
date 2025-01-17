/* eslint-disable */
var isFlutterInAppWebViewReady = false;

const EventController = {
  isNative: false,
  state: {},
  listEvent: {},
  lateCall: {},
  // { name, handle }: { name: String, handle: (q: any) => void }
  set: ({ name, handle }) => {
    EventController.listEvent[name] = handle;
  },
  call: ({ name, params }) => {
    // EventController.listEvent[name]();
    if (!params) {
      EventController.listEvent[name]();
    } else {
      return EventController.listEvent[name](params);
    }
  },
  //  : { name: any, args: any[] }
  callHandler: ({ name, args }) => {
    console.log('Call to native: ', { name, args });
    if (isFlutterInAppWebViewReady) {
      window.flutter_inappwebview.callHandler(name, ...args);
    } else {
      EventController.lateCall[name] = args;
    }
  },
  setState: ({ key, value }) => {
    EventController.state[key] = value;
  },
  getState: ({ key }) => {
    return EventController.state[key];
  },
};

window.addEventListener('flutterInAppWebViewPlatformReady', function () {
  isFlutterInAppWebViewReady = true;
  EventController.isNative = true;

  Object.keys(EventController.lateCall).forEach((key) => {
    window.flutter_inappwebview.callHandler(
      key,
      ...EventController.lateCall[key]
    );
  });
});
