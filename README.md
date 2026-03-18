# PMO Platform

PMO Platform, .NET 8 backend API ve React + Vite frontend ile geliştirilen proje portföyü yönetim uygulamasıdır. Repo GitHub Codespaces üzerinde çalışacak şekilde hazırlanmıştır; lokal bilgisayarda runtime kurmadan browser tabanlı geliştirme yapılabilir.

## Teknoloji Yığını

- Backend: `.NET 8`, `ASP.NET Core Web API`, `EF Core`, `PostgreSQL`
- Frontend: `React 18`, `TypeScript`, `Vite`
- Ortam: `GitHub Codespaces`, `Dev Container`, `PostgreSQL 16`

## Repo Yapısı

- `src/backend`: .NET çözümü ve API katmanı
- `src/frontend/pmo-platform-web`: React uygulaması
- `.devcontainer`: GitHub Codespaces tanımları

## GitHub Codespaces ile Açma

1. GitHub üzerinde repository sayfasını açın.
2. `Code` menüsünden `Codespaces` sekmesine gidin.
3. `Create codespace on main` ile ortamı başlatın.
4. Container hazır olduktan sonra `postCreateCommand` otomatik olarak şunları yapar:
   - `dotnet restore src/backend/PMO.Platform.sln`
   - `npm install` (`src/frontend/pmo-platform-web`)

## Çalıştırma Komutları

Backend:

```bash
dotnet run --project src/backend/PMO.Platform.Api/PMO.Platform.Api.csproj --urls http://0.0.0.0:8080
```

Frontend:

```bash
cd src/frontend/pmo-platform-web
npm run dev -- --host 0.0.0.0 --port 5173
```

## Forward Edilen Portlar

- `5173`: Frontend (Vite)
- `8080`: Backend (.NET API)
- `5432`: PostgreSQL

Frontend `.env.example` dosyası Codespaces akışına göre `/api` proxy modeli kullanır. Böylece browser içinden backend’e doğrudan Codespaces domain’i yazmadan erişilir.

## Veritabanı

Dev container içinde PostgreSQL servisi otomatik ayağa kalkar.

- Host: `postgres`
- Port: `5432`
- Database: `pmo_platform`
- Username: `postgres`
- Password: `postgres`

Backend development ayarları bu servise göre yapılandırılmıştır.

## Demo Kullanıcılar

- `admin@pmo.local / Admin123!`
- `pm@pmo.local / Pm123!`
- `product@pmo.local / Product123!`
- `techlead@pmo.local / Tech123!`
- `qa@pmo.local / Qa123!`
- `cto@pmo.local / Cto123!`
- `viewer@pmo.local / Viewer123!`

## Test Edilebilecek Ekranlar

- `/dashboard`
- `/projects/active`
- `/projects/:id`
- `/projects/:id/charter`
- `/projects/:id/raid`
- `/stage-gate`

## Notlar

- Backend uygulaması açılışta migration ve seed işlemlerini çalıştıracak şekilde hazırlanmıştır.
- Frontend Vite proxy ile `/api` ve `/uploads` isteklerini backend `8080` portuna yönlendirir.
- Codespaces dışında çalıştırmak isterseniz connection string ve `VITE_API_PROXY_TARGET` ayarlarını ortama göre güncellemeniz gerekebilir.
