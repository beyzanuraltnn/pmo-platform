# Codespaces Run Guide

## Açılış

1. Repository sayfasında `Code > Codespaces > Create codespace on main` seçin.
2. Container hazır olduğunda restore ve `npm install` otomatik çalışır.

## Çalıştırılacak Komutlar

Backend:

```bash
dotnet run --project src/backend/PMO.Platform.Api/PMO.Platform.Api.csproj --urls http://0.0.0.0:8080
```

Frontend:

```bash
cd src/frontend/pmo-platform-web
npm run dev -- --host 0.0.0.0 --port 5173
```

## Portlar

- Backend: `8080`
- Frontend: `5173`
- PostgreSQL: `5432`

## Demo Login Kullanıcıları

- `admin@pmo.local / Admin123!`
- `pm@pmo.local / Pm123!`
- `product@pmo.local / Product123!`
- `techlead@pmo.local / Tech123!`
- `qa@pmo.local / Qa123!`
- `cto@pmo.local / Cto123!`
- `viewer@pmo.local / Viewer123!`

## Test Edilecek Ekranlar

- `Dashboard`
- `Aktif / Planlanan / Tamamlanan Projeler`
- `Project Detail`
- `Project Charter`
- `RAID Log`
- `Stage Gate`

## Dikkat

- Frontend `.env.example` içinde `VITE_API_BASE_URL=/api` kullanılır.
- Backend development connection string’i Codespaces içindeki `postgres` servisine bakar.
- Frontend API çağrıları Vite proxy üzerinden backend `8080` portuna gider.
