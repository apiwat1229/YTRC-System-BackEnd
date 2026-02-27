export const PERMISSIONS = {
    // Users
    USER_VIEW: 'user:view',
    USER_CREATE: 'user:create',
    USER_EDIT: 'user:edit',
    USER_DELETE: 'user:delete',
    // Roles
    ROLE_VIEW: 'role:view',
    ROLE_CREATE: 'role:create',
    ROLE_EDIT: 'role:edit',
    ROLE_DELETE: 'role:delete',
    // Bookings
    BOOKING_VIEW: 'booking:view',
    BOOKING_CREATE: 'booking:create',
    BOOKING_EDIT: 'booking:edit',
    BOOKING_DELETE: 'booking:delete',
    BOOKING_APPROVE: 'booking:approve',
    // Suppliers
    SUPPLIER_VIEW: 'supplier:view',
    SUPPLIER_CREATE: 'supplier:create',
    SUPPLIER_EDIT: 'supplier:edit',
    SUPPLIER_DELETE: 'supplier:delete',
    // Rubber Types
    RUBBER_TYPE_VIEW: 'rubber_type:view',
    RUBBER_TYPE_CREATE: 'rubber_type:create',
    RUBBER_TYPE_EDIT: 'rubber_type:edit',
    RUBBER_TYPE_DELETE: 'rubber_type:delete',
    // Pools
    POOL_VIEW: 'pool:view',
    POOL_CREATE: 'pool:create',
    POOL_EDIT: 'pool:edit',
    POOL_DELETE: 'pool:delete',
    // Job Orders
    JOB_ORDER_VIEW: 'job_order:view',
    JOB_ORDER_CREATE: 'job_order:create',
    JOB_ORDER_EDIT: 'job_order:edit',
    JOB_ORDER_DELETE: 'job_order:delete',
    // Production Reports
    PRODUCTION_REPORT_VIEW: 'production_report:view',
    PRODUCTION_REPORT_CREATE: 'production_report:create',
    PRODUCTION_REPORT_EDIT: 'production_report:edit',
    PRODUCTION_REPORT_DELETE: 'production_report:delete',
    // Shipping Plans
    SHIPPING_PLAN_VIEW: 'shipping_plan:view',
    SHIPPING_PLAN_CREATE: 'shipping_plan:create',
    SHIPPING_PLAN_EDIT: 'shipping_plan:edit',
    SHIPPING_PLAN_DELETE: 'shipping_plan:delete',
    // Raw Material Plans
    RAW_MATERIAL_PLAN_VIEW: 'raw_material_plan:view',
    RAW_MATERIAL_PLAN_CREATE: 'raw_material_plan:create',
    RAW_MATERIAL_PLAN_EDIT: 'raw_material_plan:edit',
    RAW_MATERIAL_PLAN_DELETE: 'raw_material_plan:delete',
    // CPK Analyses
    CPK_ANALYSIS_VIEW: 'cpk_analysis:view',
    CPK_ANALYSIS_CREATE: 'cpk_analysis:create',
    CPK_ANALYSIS_EDIT: 'cpk_analysis:edit',
    CPK_ANALYSIS_DELETE: 'cpk_analysis:delete',
    // Notifications
    NOTIFICATION_VIEW: 'notification:view',
    NOTIFICATION_MANAGE: 'notification:manage',
    // Approvals
    APPROVAL_VIEW: 'approval:view',
    APPROVAL_MANAGE: 'approval:manage',
    // Analytics
    ANALYTICS_VIEW: 'analytics:view',
    // Knowledge Books
    KNOWLEDGE_BOOK_VIEW: 'knowledge_book:view',
    KNOWLEDGE_BOOK_CREATE: 'knowledge_book:create',
    KNOWLEDGE_BOOK_EDIT: 'knowledge_book:edit',
    KNOWLEDGE_BOOK_DELETE: 'knowledge_book:delete',
    // IT Assets
    IT_ASSET_VIEW: 'it_asset:view',
    IT_ASSET_CREATE: 'it_asset:create',
    IT_ASSET_EDIT: 'it_asset:edit',
    IT_ASSET_DELETE: 'it_asset:delete',
    // IT Tickets
    IT_TICKET_VIEW: 'it_ticket:view',
    IT_TICKET_CREATE: 'it_ticket:create',
    IT_TICKET_EDIT: 'it_ticket:edit',
    IT_TICKET_DELETE: 'it_ticket:delete',
    // Maintenance
    MAINTENANCE_VIEW: 'maintenance:view',
    MAINTENANCE_CREATE: 'maintenance:create',
    MAINTENANCE_EDIT: 'maintenance:edit',
    MAINTENANCE_DELETE: 'maintenance:delete',
    // Printer Usage
    PRINTER_USAGE_VIEW: 'printer_usage:view',
    PRINTER_USAGE_CREATE: 'printer_usage:create',
    PRINTER_USAGE_EDIT: 'printer_usage:edit',
    PRINTER_USAGE_DELETE: 'printer_usage:delete',
    // E-Signatures
    E_SIGNATURE_VIEW: 'e_signature:view',
    E_SIGNATURE_CREATE: 'e_signature:create',
    E_SIGNATURE_EDIT: 'e_signature:edit',
    E_SIGNATURE_DELETE: 'e_signature:delete',
    // Access Control
    ACCESS_CONTROL_VIEW: 'access_control:view',
    ACCESS_CONTROL_MANAGE: 'access_control:manage',
    // Posts
    POST_VIEW: 'post:view',
    POST_CREATE: 'post:create',
    POST_EDIT: 'post:edit',
    POST_DELETE: 'post:delete',
    // PLC
    PLC_VIEW: 'plc:view',
    PLC_CONTROL: 'plc:control',
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
