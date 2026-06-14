# MorningPower TikTok Dashboard

App Next.js untuk login TikTok + baca statistik akun & metrik per-post (@morningpower2023).
Dipakai sebagai (1) Web/Desktop URL, (2) host Redirect URI, (3) bahan demo video untuk TikTok App Review, dan (4) dashboard analytics MorningPower.

## Stack
Next.js 14 (App Router), TikTok Display API. Tanpa database — token disimpan di cookie httpOnly.

## Env vars
- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`

## Routes
- `/` — landing + tombol Login with TikTok (public website URL)
- `/api/auth/login` — mulai OAuth, redirect ke TikTok
- `/api/auth/callback` — tukar code -> token, simpan cookie, ke /dashboard
- `/dashboard` — tampil stats akun + tabel post (views/likes/komen/share)

## Redirect URI (daftarkan di TikTok Login Kit)
`https://<domain>/api/auth/callback`

## Deploy (Railway)
1. New Project -> Deploy from GitHub repo -> pilih repo ini.
2. Set env vars TIKTOK_CLIENT_KEY & TIKTOK_CLIENT_SECRET.
3. Generate domain -> daftarkan Web URL + Redirect URI di TikTok app (Production).
