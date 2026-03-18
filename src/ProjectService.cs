namespace PMO.Platform.Domain.Enums;

public enum ProjectType
{
    Regulation = 1,
    Integration = 2,
    Product = 3,
    Infrastructure = 4
}

public enum ProjectStatus
{
    Planned = 1,
    Active = 2,
    Completed = 3,
    Cancelled = 4
}

public enum RagStatus
{
    Green = 1,
    Yellow = 2,
    Red = 3
}

public enum ProjectPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

public enum ProjectStage
{
    Initiation = 1,
    Analysis = 2,
    Development = 3,
    Test = 4,
    GoLive = 5,
    Closure = 6
}

public enum GateStatus
{
    Draft = 1,
    MissingEvidence = 2,
    ReadyForSubmit = 3,
    WaitingApproval = 4,
    Approved = 5,
    Rejected = 6
}

public enum ApprovalStatus
{
    Pending = 1,
    Approved = 2,
    Rejected = 3
}

public enum CharterApprovalStatus
{
    Draft = 1,
    Submitted = 2,
    Approved = 3,
    Rejected = 4
}

public enum NotificationType
{
    GateApproval = 1,
    GateRejected = 2,
    MilestoneDelayed = 3,
    RiskEscalation = 4,
    GoLiveApproaching = 5,
    RaidAlert = 6
}

public enum EvidenceCategory
{
    TestKaniti = 1,
    UatKaniti = 2,
    Regresyon = 3,
    Guvenlik = 4,
    Operasyon = 5,
    Diger = 6
}

public enum RaidItemType
{
    Risk = 1,
    Issue = 2,
    Assumption = 3,
    Dependency = 4
}

public enum RaidStatus
{
    Open = 1,
    InProgress = 2,
    Mitigated = 3,
    Closed = 4,
    Accepted = 5,
    Blocked = 6
}

public enum RaidPriority
{
    Low = 1,
    Medium = 2,
    High = 3,
    Critical = 4
}

public enum RaidImpact
{
    Low = 1,
    Medium = 2,
    High = 3
}

public enum ProjectTur
{
    Regulasyon = 1,
    Entegrasyon = 2,
    Urun = 3,
    Altyapi = 4
}

public enum ProjectDurum
{
    Planlanan = 1,
    Aktif = 2,
    Tamamlanan = 3,
    Iptal = 4
}

public enum RAGStatus
{
    Green = 1,
    Yellow = 2,
    Red = 3
}

public enum GateDurum
{
    Draft = 1,
    EksikKanit = 2,
    GonderimeHazir = 3,
    OnayBekliyor = 4,
    Onaylandi = 5,
    Reddedildi = 6
}

public enum NotificationTur
{
    GateOnayi = 1,
    GateReddi = 2,
    MilestoneGecikmesi = 3,
    RiskEskalasyonu = 4,
    GoLiveYaklasiyor = 5
}

public enum ApprovalDurum
{
    Beklemede = 1,
    Onaylandi = 2,
    Reddedildi = 3
}

public static class SystemRoles
{
    public const string PmoAdmin = "PMO_ADMIN";
    public const string ProjectManager = "PROJECT_MANAGER";
    public const string ProductManager = "PRODUCT_MANAGER";
    public const string TechLead = "TECH_LEAD";
    public const string Qa = "QA";
    public const string Cto = "CTO";
    public const string Viewer = "VIEWER";

    public static readonly string[] All =
    {
        PmoAdmin,
        ProjectManager,
        ProductManager,
        TechLead,
        Qa,
        Cto,
        Viewer
    };
}
