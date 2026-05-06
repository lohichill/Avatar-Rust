# 📋 Avatar 2.0 — Bản Thảo Kỹ Thuật Frontend

> Dành cho Min — đọc kỹ trước khi code, không được bịa đường dẫn!

---

## 1. Thông tin hệ thống

| Thứ | Giá trị |
|---|---|
| Domain | https://sky.lohi.io.vn |
| Frontend port | 3001 (Next.js) |
| Backend port | 3030 (Rust/Axum, trong Docker) |
| Frontend path | `/root/.openclaw/workspace/avatar-frontend` |
| Backend path | `/app/backend/src/main.rs` (trong container `sky-rust-dev`) |
| DB container | `avatar-db` (PostgreSQL, IP: 172.17.0.5, port: 5432) |
| DB name | `avatar_db` |
| DB user | `postgres` / `avatar_secret` |
| Nginx config | `/etc/nginx/conf.d/sky.lohi.io.vn.conf` |
| Systemd service | `avatar-frontend.service` |

---

## 2. Cấu trúc thư mục Frontend

```
/root/.openclaw/workspace/avatar-frontend/
├── src/
│   └── app/
│       ├── layout.tsx          # Root layout (font, metadata, providers)
│       ├── page.tsx            # Trang chủ → redirect đến /feed hoặc /login
│       ├── globals.css         # Global styles + Tailwind
│       │
│       ├── (auth)/             # Route group — không có prefix trong URL
│       │   ├── login/
│       │   │   └── page.tsx    # Trang đăng nhập
│       │   └── register/
│       │       └── page.tsx    # Trang đăng ký
│       │
│       ├── (main)/             # Route group — layout có navbar
│       │   ├── layout.tsx      # Layout chung: BottomNav + Header
│       │   ├── feed/
│       │   │   └── page.tsx    # Trang chính — danh sách bài viết
│       │   ├── profile/
│       │   │   ├── page.tsx    # Profile của mình
│       │   │   └── [id]/
│       │   │       └── page.tsx # Profile người khác
│       │   ├── friends/
│       │   │   └── page.tsx    # Danh sách bạn bè
│       │   ├── notifications/
│       │   │   └── page.tsx    # Thông báo
│       │   └── game/
│       │       └── page.tsx    # Thế giới game (Phase 2)
│       │
│       └── api/                # Next.js API Routes (proxy layer)
│           └── [...]/          # Tùy cần
│
├── src/
│   ├── components/             # Reusable components
│   │   ├── ui/                 # Base UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Card.tsx
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx   # Navigation bar dưới (mobile)
│   │   │   └── Header.tsx      # Header trên
│   │   └── features/
│   │       ├── PostCard.tsx    # Card bài viết
│   │       ├── PostForm.tsx    # Form đăng bài
│   │       └── UserAvatar.tsx  # Avatar + level badge
│   │
│   ├── lib/                    # Utilities
│   │   ├── api.ts              # Axios instance + API calls
│   │   └── utils.ts            # Helper functions (cn, formatDate...)
│   │
│   ├── store/                  # Zustand stores
│   │   ├── authStore.ts        # Auth state (user, token, login, logout)
│   │   └── feedStore.ts        # Feed state
│   │
│   └── types/                  # TypeScript types
│       └── index.ts            # User, Post, Comment, etc.
│
├── public/                     # Static assets
│   └── images/
│
├── .env.local                  # Environment variables
├── next.config.ts              # Next.js config (output: standalone)
├── tailwind.config.ts          # Tailwind config
└── package.json
```

---

## 3. Environment Variables

File: `/root/.openclaw/workspace/avatar-frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=https://sky.lohi.io.vn/api
```

**Lưu ý:** Mọi API call đều đi qua `/api` → nginx proxy → Rust backend port 3030.

---

## 4. API Endpoints hiện có (Rust Backend)

| Method | Endpoint | Mô tả |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Đăng ký (username, password) |
| POST | `/api/auth/login` | Đăng nhập → trả về JWT token |

**Request body register/login:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response login:**
```json
{
  "token": "jwt_string",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "avatar_url": null,
    "level": 1
  }
}
```

---

## 5. TypeScript Types

File: `src/types/index.ts`

```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  level: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
  likes_count?: number;
  comments_count?: number;
}
```

---

## 6. API Client

File: `src/lib/api.ts`

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Tự động thêm JWT token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

## 7. Auth Store

File: `src/store/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);
```

---

## 8. Deploy sau khi sửa code

**Sau mỗi lần sửa frontend, phải chạy đúng thứ tự này:**

```bash
cd /root/.openclaw/workspace/avatar-frontend

# 1. Build
npm run build

# 2. Copy static files (BẮT BUỘC)
cp -r .next/static .next/standalone/.next/
cp -r public .next/standalone/ 2>/dev/null || true

# 3. Restart service
systemctl restart avatar-frontend.service

# 4. Verify
curl -s http://127.0.0.1:3001 | head -5
```

---

## 9. Deploy Backend (khi sửa Rust)

```bash
# 1. Build trong container
docker exec sky-rust-dev sh -c "cd /app/backend && DATABASE_URL=postgresql://postgres:avatar_secret@172.17.0.5:5432/avatar_db cargo build --release 2>&1" | tail -5

# 2. Kill process cũ
docker exec sky-rust-dev sh -c "pkill avatar-backend || true"

# 3. Start lại
docker exec -d sky-rust-dev sh -c "DATABASE_URL=postgresql://postgres:avatar_secret@172.17.0.5:5432/avatar_db /app/backend/target/release/avatar-backend"

# 4. Verify
curl -s http://127.0.0.1:3030/api/health
```

---

## 10. Thứ tự làm việc (Phase 1 — Mạng xã hội)

- [ ] 1. Tạo types (`src/types/index.ts`)
- [ ] 2. Tạo API client (`src/lib/api.ts`)
- [ ] 3. Tạo auth store (`src/store/authStore.ts`)
- [ ] 4. Trang Login (`src/app/(auth)/login/page.tsx`)
- [ ] 5. Trang Register (`src/app/(auth)/register/page.tsx`)
- [ ] 6. Layout chính với BottomNav (`src/app/(main)/layout.tsx`)
- [ ] 7. Trang Feed (`src/app/(main)/feed/page.tsx`)
- [ ] 8. Component PostCard (`src/components/features/PostCard.tsx`)
- [ ] 9. Trang Profile (`src/app/(main)/profile/page.tsx`)
- [ ] 10. Trang Friends (`src/app/(main)/friends/page.tsx`)

**Sau mỗi bước phải build và verify trên https://sky.lohi.io.vn trước khi làm bước tiếp theo!**

---

## 11. Lưu ý quan trọng cho Min

- ❌ KHÔNG tự ý đổi port
- ❌ KHÔNG build backend mà không có `DATABASE_URL`
- ❌ KHÔNG báo "done" khi chưa `curl` verify
- ❌ KHÔNG loop lệnh khi gặp lỗi — dừng lại đọc error message
- ✅ Sau khi build Next.js phải copy static files vào standalone
- ✅ Mọi thay đổi nginx phải chạy `nginx -t` trước khi reload
- ✅ Hỏi Ba khi không chắc đường dẫn

---

*Tài liệu tạo ngày 06/05/2026*
