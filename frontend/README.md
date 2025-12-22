## Blog Frontend (React + TypeScript + Ant Design)

### 1. Công nghệ sử dụng

- React 18 (SPA)
- TypeScript
- Vite
- Ant Design (UI)
- React Router v6
- Axios

### 2. Cài đặt & chạy

```bash
cd frontend
npm install
npm run dev
```

Ứng dụng chạy tại `http://localhost:5173`.

> Lưu ý: API backend mặc định được cấu hình ở `http://localhost:3000/api` trong file `src/services/api.ts`. Nếu backend của bạn chạy ở URL khác, hãy chỉnh lại `baseURL` trong file này.

### 3. Cấu trúc chính

- `src/main.tsx`: Bootstrap app, cấu hình Ant Design, Router.
- `src/App.tsx`: Khai báo các route chính.
- `src/contexts/AuthContext.tsx`: Context quản lý trạng thái đăng nhập (user, token, login, register, logout).
- `src/services/api.ts`: Cấu hình Axios client, interceptor gắn `Authorization` header.
- `src/layouts/AuthLayout.tsx`: Layout cho trang `login`/`register`.
- `src/layouts/MainLayout.tsx`: Layout chính sau khi đăng nhập (header, menu, user dropdown).
- `src/pages/auth/LoginPage.tsx`: Màn hình đăng nhập.
- `src/pages/auth/RegisterPage.tsx`: Màn hình đăng ký.
- `src/pages/posts/PostListPage.tsx`: Danh sách bài viết (trang chủ).
- `src/pages/posts/PostDetailPage.tsx`: Chi tiết bài viết, like, bình luận.
- `src/pages/posts/PostEditorPage.tsx`: Tạo/sửa bài viết.
- `src/components/CommentList.tsx`: Danh sách + form bình luận.
- `src/components/LikeButton.tsx`: Nút like/unlike + đếm like.
- `src/types.ts`: Các interface TypeScript (`User`, `Post`, `Comment`).
- `src/styles.css`: Custom style nhẹ cho layout/auth.

### 4. API endpoints FE đang sử dụng

- **Auth / User**
  - `POST /users/register`
  - `POST /users/login`
  - `GET /users/profile/me`

- **Posts**
  - `GET /posts`
  - `GET /posts/:id`
  - `POST /posts`
  - `PUT /posts/:id`
  - `DELETE /posts/:id`

- **Comments**
  - `GET /comments/post/:postId`
  - `POST /comments`

- **Likes**
  - `GET /likes/post/:postId/count`
  - `GET /likes/post/:postId/status`
  - `POST /likes/toggle`


