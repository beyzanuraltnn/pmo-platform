{
  "ConnectionStrings": {
    "PostgreSql": "Host=localhost;Port=5432;Database=pmo_platform;Username=postgres;Password=postgres"
  },
  "Jwt": {
    "Issuer": "PMO.Platform",
    "Audience": "PMO.Platform.Client",
    "SecretKey": "ChangeThisSecretKeyForProduction123!",
    "ExpirationMinutes": 60
  },
  "FileStorage": {
    "RootFolder": "uploads",
    "GatesFolder": "gates",
    "MaxFileSizeInBytes": 5242880,
    "AllowedExtensions": [".pdf", ".png", ".jpg", ".jpeg", ".doc", ".docx", ".xlsx", ".txt"]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}
