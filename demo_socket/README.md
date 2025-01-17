# NativeMethod

## Đổi title trong navbar

```ts
NativeMethod.changeTitle(title: String)
```

## Toast

```ts
NativeMethod.toast(msg: String, key?: String)
```

EX: NativeMethod.toast("Đây là một toast", "info")

### Keys

- **error_dev_log** : toast log khi ở env dev, thông báo có lỗi xảy ra nếu ở env prod
- **error** : toast lỗi, có màu nền đỏ
- **success** : toast thông báo thành công, có nền màu xanh lá
- **warning** : toast cảnh báo, có nền màu vàng
- **info**(default) : toast thông tin, có nền màu xanh dương

## Điều hướng và gửi dữ liệu cho app

```ts
NativeMethod.redirectToNative(key: String);
NativeMethod.redirectToNative([key: String, ...opts?: String | number]);
```

EX: NativeMethod.redirectToNative('upgradeMembership')

EX: NativeMethod.redirectToNative(['changeTicker', 'HPG']);

### Key và opts

- `["changeTicker", ticker: String]` : tắt miniapp, mở trang biểu đồ kỹ thuật và chuyển cổ phiếu của biểu đồ sang cổ phiếu được chỉ định
- `"upgradeMembership"` : tắt miniapp, mở trang nâng cấp hội viên
- `"portfolio"` : tắt miniapp, mở trang portfolio
- `"home"` : tắt miniapp, quay về trang chủ

## Tắt miniapp

```ts
NativeMethod.closeWebview()
```

## Loading

**Loading khởi đầu**: loading khi khởi động miniapp, che hoàn toàn miniapp

**Hidden loading**: loading được bật bán thủ công trong quá trình sử dụng miniapp, che mờ miniapp

- `NativeMethod.loading.loadingDone()` : kết thúc loading khởi đầu của miniapp (hiện đang đặt ở NativeInit)
- `NativeMethod.loading.openLoading()` : mở hidden loading
- `NativeMethod.loading.closeLoading()` : đóng hidden loading

## Custom event

**Lắng nghe và trigger các event được quy ước với app**

- `NativeMethod.addEventListener({ name: String, handle: (params: any) => void })` : lắng nghe khi app gọi đến event thì tiến hành xử lý
  EX:

```js
NativeMethod.addEventListener({
  name: 'onGetName',
  handle: (name) => {
    console.log(name)
  }
})
```

- `NativeMethod.triggerEventListener({ name: String, params: any })` : kích hoạt event đã được định nghĩa
  EX:

```js
NativeMethod.triggerEventListener({
  name: 'onGetName',
  params: 'hello'
})
```

- `NativeMethod.callHandle({ name: String, args: (String | number)[] })` : kích hoạt sự kiện của app đã được quy ước
  EX:

```js
NativeMethod.callHandle({
  name: 'sendInfo',
  args: ['hello', 123]
})
```

## Video/image

- mở camera để chụp ảnh, đồng thời gửi thông báo cho custom cam

```js
  NativeMethod.media.takeImage({
  callback: (file: ["base64" : base64Image, "name": nameImage]) => void,
  props: any[],
  })
```

những hàm phía dưới chưa xử lý, nếu dùng thì báo trước

- `NativeMethod.media.getImage({callback: (file: ["base64" : base64Image, "name": nameImage]) => void})` : chọn ảnh từ thư viện trong máy
- `NativeMethod.media.recordVideo({callback: (file: ["base64" : base64Image, "name": nameImage]) => void})` : mở camera quay video
- `NativeMethod.media.getVideo({callback: (file: ["base64" : base64Image, "name": nameImage]) => void})` : chọn video

## Template cho chọn ảnh

kết quả được trả về thông qua callback dưới dạng base64, chuyển về dạng file bằng cách dùng urltoFile trong thư viện NativeMethod
đã đóng mở loading và xử lý ảnh, call back sẽ nhận được file ảnh đã chọn

```js
const takeImage = (callback, side) => {
  NativeMethod.loading.openLoading()
  NativeMethod.media.takeImage({
    callback: (file) => {
      if (file['base64'])
        urltoFile(file, 'image')
          .then((e) => {
            callback(e)
          })
          .finally(() => {
            NativeMethod.loading.closeLoading()
          })
      NativeMethod.loading.closeLoading()
    },
    props: [side]
  })
}
```
