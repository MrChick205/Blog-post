# Blog Post API Backend

Express.js REST API cho ứng dụng blog với PostgreSQL database.

## Cấu trúc dự án

```
backend/
├── config/
│   ├── database.js          # Database connection pool (pg)
│   ├── prisma.js            # Prisma Client instance
│   └── db-init.sql          # Database schema
├── prisma/
│   └── schema.prisma        # Prisma schema definition
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── modules/
│   ├── users/               # User module
│   │   ├── user.model.js
│   │   ├── user.controller.js
│   │   └── user.routes.js
│   ├── posts/               # Post module
│   │   ├── post.model.js
│   │   ├── post.controller.js
│   │   └── post.routes.js
│   ├── comments/            # Comment module
│   │   ├── comment.model.js
│   │   ├── comment.controller.js
│   │   └── comment.routes.js
│   └── likes/               # Like module
│       ├── like.model.js
│       ├── like.controller.js
│       └── like.routes.js
├── scripts/
│   └── migrate.js           # Database migration script
├── app.js                   # Express app configuration
├── server.js                # Server entry point
├── docker-compose.yml       # Docker PostgreSQL setup
└── package.json
```

## Yêu cầu

- Node.js >= 14.x
- Docker và Docker Compose
- PostgreSQL (chạy qua Docker)

## Cài đặt

1. **Cài đặt dependencies:**
```bash
npm install
```

2. **Tạo file .env:**
```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với thông tin database của bạn:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=blogpost
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blogpost
PORT=3000
JWT_SECRET=your-secret-key-change-this-in-production
```

3. **Khởi động PostgreSQL với Docker:**
```bash
docker-compose up -d
```

4. **Chạy migration để tạo database tables:**
```bash
npm run migrate
```

5. **Generate Prisma Client và chạy Prisma migration:**
```bash
# Generate Prisma Client
npm run prisma:generate

# Chạy Prisma migration (nếu chưa có tables)
npm run prisma:migrate
```

6. **Khởi động Prisma Studio để xem database:**
```bash
npm run prisma:studio
```
Prisma Studio sẽ mở tại `http://localhost:5555`

7. **Khởi động server:**
```bash
# Development mode (với nodemon)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users/register` - Đăng ký user mới
- `POST /api/users/login` - Đăng nhập
- `GET /api/users` - Lấy danh sách users
- `GET /api/users/:id` - Lấy thông tin user theo ID
- `GET /api/users/profile/me` - Lấy profile của user hiện tại (protected)
- `PUT /api/users/profile/me` - Cập nhật profile (protected)
- `DELETE /api/users/profile/me` - Xóa tài khoản (protected)

### Posts
- `GET /api/posts` - Lấy danh sách posts (có query: limit, offset, user_id)
- `GET /api/posts/:id` - Lấy post theo ID
- `POST /api/posts` - Tạo post mới (protected)
- `PUT /api/posts/:id` - Cập nhật post (protected)
- `DELETE /api/posts/:id` - Xóa post (protected)
- `GET /api/posts/user/me` - Lấy posts của user hiện tại (protected)

### Comments
- `GET /api/comments/post/:postId` - Lấy comments của một post
- `GET /api/comments/:id` - Lấy comment theo ID
- `POST /api/comments` - Tạo comment mới (protected)
- `PUT /api/comments/:id` - Cập nhật comment (protected)
- `DELETE /api/comments/:id` - Xóa comment (protected)
- `GET /api/comments/user/me` - Lấy comments của user hiện tại (protected)

### Likes
- `GET /api/likes/post/:postId` - Lấy danh sách likes của một post
- `GET /api/likes/post/:postId/count` - Lấy số lượng likes
- `POST /api/likes/toggle` - Toggle like/unlike (protected)
- `GET /api/likes/post/:postId/status` - Kiểm tra trạng thái like (protected)
- `GET /api/likes/user/me` - Lấy likes của user hiện tại (protected)

## Authentication

Các endpoint được đánh dấu (protected) yêu cầu JWT token trong header:
```
Authorization: Bearer <your-token>
```

Token được trả về khi đăng ký hoặc đăng nhập thành công.

## Database Schema

- **users**: id, username, email, password, avatar, created_at
- **posts**: id, title, content, image, user_id, created_at, updated_at
- **comments**: id, content, user_id, post_id, created_at
- **likes**: id, user_id, post_id, created_at (unique constraint trên user_id + post_id)

## Docker Commands

```bash
# Khởi động PostgreSQL
docker-compose up -d

# Dừng PostgreSQL
docker-compose down

# Xem logs
docker-compose logs -f

# Xóa volume (xóa toàn bộ data)
docker-compose down -v
```

## Scripts

- `npm start` - Chạy server production
- `npm run dev` - Chạy server development với nodemon
- `npm run migrate` - Chạy database migration (SQL script)
- `npm run prisma:setup` - Setup và kiểm tra Prisma configuration
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Chạy Prisma migration
- `npm run prisma:studio` - Mở Prisma Studio để xem database
- `npm run prisma:push` - Push schema trực tiếp vào database (dev only)
- `npm run prisma:deploy` - Deploy Prisma migrations (production)
- `npm run prisma:format` - Format Prisma schema file

## Prisma Studio

Prisma Studio là một GUI để xem và chỉnh sửa data trong database. Để sử dụng:

```bash
npm run prisma:studio
```

Sau đó mở trình duyệt tại `http://localhost:5555` để xem và quản lý database.

### Nếu Prisma Studio không chạy được:

1. **Chạy setup script để kiểm tra:**
```bash
npm run prisma:setup
```

2. **Đảm bảo database đang chạy:**
```bash
docker-compose up -d
```

3. **Generate Prisma Client:**
```bash
npm run prisma:generate
```

4. **Chạy migration (nếu chưa có tables):**
```bash
npm run prisma:migrate
# Hoặc
npm run prisma:push
```

5. **Xem chi tiết troubleshooting:** Xem file `PRISMA_TROUBLESHOOTING.md`


