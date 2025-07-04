export enum ROLES {
    SUPERADMIN = "superadmin",
    USER = "user",
}

export enum TRANSACTION_TYPE {
    INCOME = "income",
    EXPENSE = "expense",
}

export enum TRANSACTION_CATEGORY {
    SALARY = "", // gaji
    CHARITY = "charity", // dana sedekah
    EMERGENCY = "emergency", // dana darurat
    LIVING = "living", // dana hidup
    ENTERTAINMENT = "entertainment", // dana hiburan
    OTHER = "other", // etc
}
