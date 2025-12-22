# Prisma Studio Troubleshooting Guide

Nếu bạn gặp vấn đề khi chạy Prisma Studio, hãy làm theo các bước sau:

## 1. Kiểm tra Prerequisites

### ✅ Database đang chạy
```bash
docker ps
# Hoặc
docker-compose ps
```

Nếu database không chạy:
```bash
docker-compose up -d
```

### ✅ File .env tồn tại và có DATABASE_URL
Kiểm tra file `.env` trong thư mục `backend/`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/blogpost
```

### ✅ Prisma Client đã được generate
```bash
npm run prisma:generate
```

## 2. Chạy Migration

Nếu database chưa có tables, bạn cần chạy migration:

**Option 1: Sử dụng Prisma Migration (khuyến nghị)**
```bash
npm run prisma:migrate
```

**Option 2: Sử dụng SQL script**
```bash
npm run migrate
```

**Option 3: Push schema trực tiếp (development only)**
```bash
npm run prisma:push
```

## 3. Chạy Prisma Studio

```bash
npm run prisma:studio
```

Prisma Studio sẽ mở tại: `http://localhost:5555`

## 4. Các lỗi thường gặp

### Lỗi: "Can't reach database server"
- Kiểm tra database có đang chạy không
- Kiểm tra DATABASE_URL trong .env có đúng không
- Kiểm tra port 5432 có bị block không

### Lỗi: "P1001: Can't reach database server"
- Database chưa được khởi động: `docker-compose up -d`
- DATABASE_URL sai format hoặc sai thông tin

### Lỗi: "P1003: Database does not exist"
- Database chưa được tạo
- Kiểm tra DB_NAME trong docker-compose.yml và DATABASE_URL

### Lỗi: "Schema is out of sync"
- Chạy: `npm run prisma:migrate` hoặc `npm run prisma:push`

## 5. Setup tự động

Chạy script setup để kiểm tra mọi thứ:
```bash
npm run prisma:setup
```

## 6. Kiểm tra kết nối database

Test kết nối bằng Prisma:
```bash
npx prisma db pull
```

Nếu thành công, Prisma sẽ kết nối được với database.

## 7. Reset Database (nếu cần)

⚠️ **CẢNH BÁO**: Lệnh này sẽ xóa toàn bộ data!

```bash
npx prisma migrate reset
```

Sau đó chạy lại migration:
```bash
npm run prisma:migrate
```

