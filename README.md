# demo_socket

Demo realtime với Java Spring Boot (backend) và ReactJS (frontend), dùng **SSE (Server-Sent Events)** thay cho WebSocket.

## Chạy dự án

**Backend** (`demo/`) — chạy ở `http://localhost:8080`:

```bash
cd demo
mvn spring-boot:run
```

**Frontend** (`demo_socket/`) — chạy ở `http://localhost:4200`:

```bash
cd demo_socket
npm install
npm run dev
```

## Các trang để xem

| Trang | Đường dẫn | Xem gì |
|-------|-----------|--------|
| **Trang chủ** | `/` | Đăng nhập / đăng ký. Bấm **Login** để vào trang Product, bấm **Register** để vào trang Chat. |
| **Product (giá realtime)** | `/product` | Bảng sản phẩm cập nhật giá realtime mỗi 5 giây qua SSE. Giá tăng hiện màu xanh ▲, giảm màu đỏ ▼. Có phân trang, sắp xếp, kéo-thả hàng/cột. |
| **Chat realtime** | `/chat` | Nhập tên để tham gia, nhắn tin realtime qua SSE. Mở nhiều tab để thấy tin nhắn đồng bộ tức thì. |

