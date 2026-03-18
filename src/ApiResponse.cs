{
  "ConnectionStrings": {
    "PostgreSql": "Host=postgres;Port=5432;Database=pmo_platform;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Issuer": "PMO.Platform",
    "Audience": "PMO.Platform.Client",
    "SecretKey": "ChangeThisSecretKeyForDevelopment123!",
    "ExpirationMinutes": 120
  },
  "FileStorage": {
    "RootFolder": "uploads",
    "GatesFolder": "gates",
    "MaxFileSizeInBytes": 5242880,
    "AllowedExtensions": [".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx", ".xlsx", ".txt"]
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://127.0.0.1:5173"
    ]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.AspNetCore": "Information"
    }
  }
}
