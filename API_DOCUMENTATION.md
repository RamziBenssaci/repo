# Healthcare Management System - Laravel API Documentation

## Base URL
```
https://your-laravel-api.com/api
```

## Authentication
This API uses Bearer Token authentication. Include the token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## Authentication Endpoints

### 1. Admin Login
**Endpoint:** `POST /admin/login`

**Description:** Authenticate admin user and receive bearer token

**Request Body:**
```json
{
  "username": "admin_username",
  "password": "admin_password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 1,
    "username": "admin_username",
    "name": "اسم المدير",
    "email": "admin@example.com",
    "role": "admin",
    "permissions": ["all"],
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "بيانات الدخول غير صحيحة"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "البيانات المطلوبة غير صحيحة",
  "errors": {
    "username": ["حقل اسم المستخدم مطلوب"],
    "password": ["حقل كلمة المرور مطلوب"]
  }
}
```

---

### 2. Staff Login
**Endpoint:** `POST /staff/login`

**Description:** Authenticate staff user and receive bearer token

**Request Body:**
```json
{
  "username": "staff_username",
  "password": "staff_password"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الدخول بنجاح",
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "user": {
    "id": 2,
    "username": "staff_username",
    "name": "اسم الموظف",
    "email": "staff@example.com",
    "role": "staff",
    "department": "قسم الأسنان",
    "position": "طبيب أسنان",
    "permissions": ["reports", "dental", "warehouse"],
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "بيانات الدخول غير صحيحة"
}
```

---

### 3. Admin Logout
**Endpoint:** `POST /admin/logout`

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

### 4. Staff Logout
**Endpoint:** `POST /staff/logout`

**Headers:**
```
Authorization: Bearer {staff_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تسجيل الخروج بنجاح"
}
```

---

## Admin Profile Management Endpoints

### Get Admin Profile
**Endpoint:** `GET /admin/profile`

**Description:** Get current admin profile information

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات المدير بنجاح",
  "data": {
    "id": 1,
    "name": "أحمد محمد الأحمد",
    "email": "admin@health.gov.sa",
    "phone": "0501234567",
    "role": "مدير النظام الرئيسي",
    "last_login": "2024-08-05 10:30",
    "permissions": ["full_access", "user_management", "system_settings", "reports", "audit_logs"],
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
}
```

### Update Admin Profile
**Endpoint:** `PUT /admin/profile`

**Description:** Update admin profile information

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "أحمد محمد الأحمد",
  "email": "admin@health.gov.sa",
  "phone": "0501234567"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث المعلومات الشخصية بنجاح"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "البيانات المطلوبة غير صحيحة",
  "errors": {
    "email": ["البريد الإلكتروني مطلوب"],
    "name": ["الاسم مطلوب"]
  }
}
```

### Change Admin Password
**Endpoint:** `PUT /admin/change-password`

**Description:** Change admin password (no current password verification required)

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "new_password": "new_secure_password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تغيير كلمة المرور بنجاح"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "البيانات المطلوبة غير صحيحة",
  "errors": {
    "new_password": ["كلمة المرور يجب أن تكون 8 أحرف على الأقل"]
  }
}
```

---

## Staff Management Endpoints

### Get Staff Statistics
**Endpoint:** `GET /admin/staff/statistics`

**Description:** Get staff statistics for dashboard

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب إحصائيات الموظفين بنجاح",
  "data": {
    "totalStaff": 15,
    "totalDepartments": 6,
    "totalRoles": 6,
    "activeStaff": 12,
    "inactiveStaff": 3,
    "departmentBreakdown": [
      {"department": "البلاغات", "count": 5},
      {"department": "التموين", "count": 4},
      {"department": "الشراء المباشر", "count": 3}
    ]
  }
}
```

### Create New Staff Member
**Endpoint:** `POST /admin/staff`

**Description:** Create a new staff member account

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "سارة أحمد المحمد",
  "email": "sara.ahmed@health.gov.sa",
  "phone": "0501234567",
  "password": "secure_password123",
  "role": "مسؤولة البلاغات",
  "department": "البلاغات",
  "permissions": ["reports_view", "reports_create", "reports_edit"]
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم إضافة الموظف بنجاح",
  "data": {
    "id": "15",
    "name": "سارة أحمد المحمد",
    "email": "sara.ahmed@health.gov.sa",
    "created_at": "2025-01-15T14:35:00.000000Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "البيانات المطلوبة غير صحيحة",
  "errors": {
    "email": ["البريد الإلكتروني مطلوب"],
    "name": ["الاسم مطلوب"],
    "password": ["كلمة المرور يجب أن تكون 8 أحرف على الأقل"]
  }
}
```

### Get All Staff Members
**Endpoint:** `GET /admin/staff`

**Description:** Get all staff members with their details

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات الموظفين بنجاح",
  "data": [
    {
      "id": "1",
      "name": "سارة أحمد المحمد",
      "email": "sara.ahmed@health.gov.sa",
      "phone": "0501234567",
      "role": "مسؤولة البلاغات",
      "department": "البلاغات",
      "permissions": ["reports_view", "reports_create", "reports_edit", "reports_dashboard"],
      "is_active": true,
      "created_at": "2024-01-15T00:00:00.000000Z",
      "updated_at": "2024-08-05T09:30:00.000000Z",
      "last_login": "2024-08-05T09:30:00.000000Z"
    }
  ]
}
```

### Get Specific Staff Member
**Endpoint:** `GET /admin/staff/{id}`

**Description:** Get details of a specific staff member

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات الموظف بنجاح",
  "data": {
    "id": "1",
    "name": "سارة أحمد المحمد",
    "email": "sara.ahmed@health.gov.sa",
    "phone": "0501234567",
    "role": "مسؤولة البلاغات",
    "department": "البلاغات",
    "permissions": ["reports_view", "reports_create", "reports_edit", "reports_dashboard"],
    "is_active": true,
    "created_at": "2024-01-15T00:00:00.000000Z",
    "updated_at": "2024-08-05T09:30:00.000000Z",
    "last_login": "2024-08-05T09:30:00.000000Z"
  }
}
```

### Update Staff Member
**Endpoint:** `PUT /admin/staff/{id}`

**Description:** Update staff member information and permissions

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "name": "سارة أحمد المحمد",
  "email": "sara.ahmed@health.gov.sa",
  "phone": "0501234567",
  "role": "مسؤولة البلاغات الرئيسية",
  "department": "البلاغات",
  "permissions": ["reports_view", "reports_create", "reports_edit", "reports_dashboard", "reports_manage"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث بيانات الموظف بنجاح"
}
```

### Toggle Staff Status
**Endpoint:** `PATCH /admin/staff/{id}/toggle-status`

**Description:** Activate or deactivate a staff member

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث حالة الموظف بنجاح",
  "data": {
    "is_active": false
  }
}
```

### Reset Staff Password
**Endpoint:** `PUT /admin/staff/{id}/reset-password`

**Description:** Reset a staff member's password

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Request Body:**
```json
{
  "new_password": "new_secure_password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم إعادة تعيين كلمة المرور بنجاح"
}
```

### Delete Staff Member
**Endpoint:** `DELETE /admin/staff/{id}`

**Description:** Delete a staff member account

**Headers:**
```
Authorization: Bearer {admin_token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم حذف الموظف بنجاح"
}
```

---

## Reports Management Endpoints

### 5. Get Facilities
**Endpoint:** `GET /facilities`

**Description:** Get all facilities for dropdown selection

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب المنشآت بنجاح",
  "data": [
    {
      "id": 1,
      "name": "مستشفى الملك فيصل التخصصي",
      "code": "KFSH-001",
      "contact": "+966-11-123-4567",
      "manager": "د. أحمد محمد",
      "medical_director": "د. فاطمة علي"
    }
  ]
}
```

### 6. Create Report
**Endpoint:** `POST /reports`

**Description:** Create a new incident report

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "facility_id": 1,
  "title": "عطل في جهاز الأشعة",
  "type": "equipment",
  "description": "توقف جهاز الأشعة المقطعية بشكل مفاجئ",
  "location": "قسم الأشعة - الدور الثاني",
  "severity": "high",
  "reporter_name": "د. محمد أحمد",
  "reporter_position": "طبيب أشعة",
  "reporter_department": "قسم الأشعة",
  "incident_date": "2025-01-15",
  "incident_time": "14:30",
  "witness_name": "ممرضة سارة",
  "witness_contact": "+966-50-123-4567",
  "immediate_action": "تم إيقاف تشغيل الجهاز فوراً",
  "additional_notes": "الجهاز قيد الصيانة منذ شهر"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم إنشاء البلاغ بنجاح",
  "data": {
    "id": "RPT-2025-001",
    "status": "مفتوح",
    "created_at": "2025-01-15T14:35:00.000000Z"
  }
}
```

### 7. Get All Reports
**Endpoint:** `GET /reports`

**Description:** Get all reports for dashboard and listing

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب البلاغات بنجاح",
  "data": [
    {
      "id": "RPT-2025-001",
      "facility": {
        "id": 1,
        "name": "مستشفى الملك فيصل التخصصي",
        "code": "KFSH-001"
      },
      "title": "عطل في جهاز الأشعة",
      "type": "equipment",
      "description": "توقف جهاز الأشعة المقطعية بشكل مفاجئ",
      "severity": "high",
      "status": "مفتوح",
      "reporter_name": "د. محمد أحمد",
      "created_at": "2025-01-15T14:35:00.000000Z",
      "updated_at": "2025-01-15T14:35:00.000000Z"
    }
  ]
}
```

### 8. Update Report
**Endpoint:** `PUT /reports/{id}`

**Description:** Update an existing report

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "مغلق",
  "resolution": "تم إصلاح الجهاز وإعادة تشغيله",
  "resolved_by": "فريق الصيانة",
  "resolved_at": "2025-01-16T10:00:00.000000Z"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث البلاغ بنجاح"
}
```

### 9. Delete Report
**Endpoint:** `DELETE /reports/{id}`

**Description:** Delete a report

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم حذف البلاغ بنجاح"
}
```

### 10. Get Dashboard Statistics
**Endpoint:** `GET /reports/dashboard`

**Description:** Get dashboard statistics and chart data

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب إحصائيات لوحة التحكم بنجاح",
  "data": {
    "total_reports": 150,
    "open_reports": 45,
    "closed_reports": 95,
    "out_of_order_reports": 10,
    "status_distribution": [
      {"status": "مفتوح", "count": 45},
      {"status": "مغلق", "count": 95},
      {"status": "مكهن", "count": 10}
    ],
    "category_distribution": [
      {"category": "أجهزة طبية", "count": 30},
      {"category": "تكييف وتبريد", "count": 25}
    ],
    "facility_reports": [
      {"facility_name": "مستشفى الملك فيصل", "count": 40}
    ],
    "monthly_trend": [
      {"month": "يناير", "count": 45},
      {"month": "فبراير", "count": 52}
    ]
  }
}
```

## Warehouse Management Endpoints

### Inventory Management

#### Get All Inventory Items
- **URL:** `GET /warehouse/inventory`
- **Authentication:** Required
- **Description:** Retrieve all inventory items

**Response Example:**
```json
{
  "success": true,
  "message": "تم جلب بيانات المخزون بنجاح",
  "data": [
    {
      "id": 1,
      "item_code": "INV-001",
      "name": "أسبرين 500mg",
      "category": "أدوية",
      "quantity": 500,
      "unit": "حبة",
      "price": 2.50,
      "supplier": "شركة الأدوية المتحدة",
      "expiry_date": "2025-12-31",
      "location": "مستودع أ - رف 1",
      "min_stock": 100,
      "max_stock": 1000,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-15T14:30:00Z"
    }
  ]
}
```

#### Add New Inventory Item
- **URL:** `POST /warehouse/inventory`
- **Authentication:** Required
- **Description:** Add a new inventory item

**Request Body:**
```json
{
  "item_code": "INV-002",
  "name": "باراسيتامول 500mg",
  "category": "أدوية",
  "quantity": 300,
  "unit": "حبة",
  "price": 1.75,
  "supplier": "شركة الأدوية المتحدة",
  "facility_id": 1,
  "expiry_date": "2025-06-30",
  "location": "مستودع أ - رف 2",
  "min_stock": 50,
  "max_stock": 500
}
```

#### Update Inventory Item
- **URL:** `PUT /warehouse/inventory/{id}`
- **Authentication:** Required
- **Description:** Update an existing inventory item

#### Delete Inventory Item
- **URL:** `DELETE /warehouse/inventory/{id}`
- **Authentication:** Required
- **Description:** Delete an inventory item

### Withdrawal Orders

#### Create Withdrawal Order
- **URL:** `POST /warehouse/withdrawal-orders`
- **Authentication:** Required
- **Description:** Create a new withdrawal order

**Request Body:**
```json
{
  "facility_id": 1,
  "requested_by": "د. أحمد محمد",
  "items": [
    {
      "inventory_id": 1,
      "quantity": 50,
      "notes": "للعيادة الخارجية"
    }
  ],
  "priority": "عادي",
  "notes": "طلب عاجل للعيادات"
}
```

### Dashboard Data

#### Get Warehouse Dashboard Data
- **URL:** `GET /warehouse/dashboard`
- **Authentication:** Required
- **Description:** Get warehouse dashboard statistics and charts data

**Response Example:**
```json
{
  "success": true,
  "data": {
    "totalItems": 450,
    "lowStockItems": 23,
    "orders": {
      "open": 12,
      "completed": 145,
      "rejected": 8
    },
    "orderStatusData": [
      { "name": "مفتوح", "value": 12, "color": "#3b82f6" },
      { "name": "مصروف", "value": 145, "color": "#10b981" },
      { "name": "مرفوض", "value": 8, "color": "#ef4444" }
    ],
    "facilitiesData": [
      { "name": "مستشفى الملك فهد", "items": 120 },
      { "name": "مركز الأورام", "items": 89 }
    ]
  }
}
```

#### Get Top Suppliers
- **URL:** `GET /warehouse/top-suppliers`
- **Authentication:** Required
- **Description:** Get the top suppliers by items supplied

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "name": "شركة التقنية الطبية",
      "items_supplied": 120,
      "total_value": 50000
    },
    {
      "name": "مؤسسة الأجهزة المتقدمة", 
      "items_supplied": 89,
      "total_value": 35000
    }
  ]
}
```

### Dispensing Reports

#### Get Dispensing Dashboard Data
- **URL:** `GET /warehouse/dispensing`
- **Authentication:** Required
- **Description:** Get dispensing dashboard data with charts and statistics

**Response Example:**
```json
{
  "success": true,
  "data": {
    "chartData": [
      { "name": "يناير", "value": 12500 },
      { "name": "فبراير", "value": 15800 }
    ],
    "facilityData": [
      { "name": "المركز الصحي الأول", "value": 25, "color": "#3b82f6" },
      { "name": "المستشفى العام", "value": 35, "color": "#10b981" }
    ],
    "trendData": [
      { "month": "يناير", "dispensing": 45, "requests": 52 },
      { "month": "فبراير", "dispensing": 55, "requests": 61 }
    ]
  }
}
```

#### Get Dispensing Operations
- **URL:** `GET /warehouse/dispensing/operations`
- **Authentication:** Required
- **Description:** Get detailed dispensing operations

**Response Example:**
```json
{
  "success": true,
  "data": [
    {
      "id": "DISP-001",
      "date": "2024-01-15",
      "facility": "المركز الصحي الأول",
      "items_count": 15,
      "total_value": 2500,
      "requested_by": "د. أحمد محمد",
      "status": "مكتمل",
      "category": "أدوية",
      "created_at": "2024-01-15T09:00:00Z"
    }
  ]
}
```

## Direct Purchase Endpoints

### 1. Create Direct Purchase Order

**POST** `/api/direct-purchase/orders`

**Authentication:** Required (Staff)

**Request Body:**
```json
{
  "itemNumber": "ITM-001",
  "itemName": "جهاز تخطيط القلب",
  "beneficiary": "مركز القلب",
  "supplier": "شركة التقنية الطبية",
  "totalCost": 125000,
  "description": "وصف الطلب",
  "urgency": "عادي"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم إنشاء أمر الشراء بنجاح",
  "data": {
    "id": "ORD-001",
    "status": "جديد",
    "orderDate": "2024-01-15"
  }
}
```

### 2. Get All Direct Purchase Orders

**GET** `/api/direct-purchase/orders`

**Authentication:** Required (Staff)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ORD-001",
      "itemNumber": "ITM-001",
      "itemName": "جهاز تخطيط القلب",
      "beneficiary": "مركز القلب",
      "supplier": "شركة التقنية الطبية",
      "status": "تم التعاقد",
      "totalCost": 125000,
      "orderDate": "2024-01-15",
      "deliveryDate": "2024-02-15"
    }
  ]
}
```

### 3. Get Specific Direct Purchase Order

**GET** `/api/direct-purchase/orders/{id}`

**Authentication:** Required (Staff)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ORD-001",
    "itemNumber": "ITM-001",
    "itemName": "جهاز تخطيط القلب",
    "beneficiary": "مركز القلب",
    "supplier": "شركة التقنية الطبية",
    "status": "تم التعاقد",
    "totalCost": 125000,
    "description": "وصف الطلب",
    "urgency": "عادي",
    "orderDate": "2024-01-15",
    "deliveryDate": "2024-02-15",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-20T14:30:00Z"
  }
}
```

### 4. Update Direct Purchase Order

**PUT** `/api/direct-purchase/orders/{id}`

**Authentication:** Required (Staff)

**Request Body:**
```json
{
  "status": "تم التعاقد",
  "deliveryDate": "2024-02-15",
  "notes": "ملاحظات إضافية"
}
```

**Response:**
```json
{
  "success": true,
  "message": "تم تحديث أمر الشراء بنجاح"
}
```

### 5. Delete Direct Purchase Order

**DELETE** `/api/direct-purchase/orders/{id}`

**Authentication:** Required (Staff)

**Response:**
```json
{
  "success": true,
  "message": "تم حذف أمر الشراء بنجاح"
}
```

### 6. Get Direct Purchase Reports

**GET** `/api/direct-purchase/reports`

**Authentication:** Required (Staff)

**Query Parameters:**
- `type` (optional): Report type (all-orders, by-status, by-item, by-facility-supplier)
- `status` (optional): Filter by order status
- `facility` (optional): Filter by facility
- `supplier` (optional): Filter by supplier
- `item` (optional): Filter by item name or number

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ORD-001",
      "itemNumber": "ITM-001",
      "itemName": "جهاز تخطيط القلب",
      "beneficiary": "مركز القلب",
      "supplier": "شركة التقنية الطبية",
      "status": "تم التعاقد",
      "totalCost": 125000,
      "orderDate": "2024-01-15",
      "deliveryDate": "2024-02-15",
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-20T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 50
  }
}
```

### 7. Get Direct Purchase Dashboard Data

**GET** `/api/direct-purchase/dashboard`

**Authentication:** Required (Staff)

**Query Parameters:**
- `facility` (optional): Filter by facility
- `item` (optional): Filter by item name or number
- `supplier` (optional): Filter by supplier

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total": 165,
      "new": 12,
      "approved": 34,
      "contracted": 89,
      "delivered": 25,
      "rejected": 5,
      "totalValue": 2450000
    },
    "statusDistribution": [
      {
        "status": "جديد",
        "count": 12,
        "percentage": 7.3
      },
      {
        "status": "موافق عليه",
        "count": 34,
        "percentage": 20.6
      }
    ],
    "monthlyTrends": [
      {
        "month": "يناير",
        "orders": 45,
        "value": 650000
      },
      {
        "month": "فبراير",
        "orders": 52,
        "value": 780000
      }
    ],
    "topSuppliers": [
      {
        "name": "شركة التقنية الطبية",
        "orders": 45,
        "value": 850000,
        "rank": 1
      },
      {
        "name": "مؤسسة الأجهزة المتقدمة",
        "orders": 32,
        "value": 620000,
        "rank": 2
      }
    ]
  }
}
```

## Future Endpoints (To Be Implemented)

### Dental Management
- `GET /dental/contracts` - List dental contracts
- `POST /dental/contracts` - Create new contract
- `GET /dental/assets` - List dental assets
- `POST /dental/assets` - Add new asset

### Administrative Transactions
- `GET /transactions` - List transactions
- `POST /transactions` - Create new transaction
- `GET /transactions/{id}` - Get specific transaction

### Settings
- `GET /settings/facilities` - List facilities
- `POST /settings/facilities` - Add facility
- `GET /settings/staff` - List staff members
- `POST /settings/staff` - Add staff member

---

## Error Handling

All endpoints follow consistent error response format:

**Validation Error (422):**
```json
{
  "success": false,
  "message": "البيانات المطلوبة غير صحيحة",
  "errors": {
    "field_name": ["رسالة الخطأ"]
  }
}
```

**Authentication Error (401):**
```json
{
  "success": false,
  "message": "غير مصرح بالوصول"
}
```

**Authorization Error (403):**
```json
{
  "success": false,
  "message": "ليس لديك صلاحية للقيام بهذا الإجراء"
}
```

**Not Found Error (404):**
```json
{
  "success": false,
  "message": "المورد المطلوب غير موجود"
}
```

**Server Error (500):**
```json
{
  "success": false,
  "message": "خطأ في الخادم الداخلي"
}
```

---

## Main Dashboard Management Endpoints

### 11. Get Dashboard Data
**Endpoint:** `GET /dashboard`

**Description:** Get main dashboard statistics and data

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات لوحة التحكم بنجاح",
  "data": {
    "total_clinics": 150,
    "working_clinics": 135,
    "not_working_clinics": 10,
    "out_of_order_clinics": 5,
    "total_facilities": 12,
    "monthly_reports": 45,
    "pending_orders": 23,
    "critical_inventory": 8
  }
}
```

### 12. Get Facilities List
**Endpoint:** `GET /facilities`

**Description:** Get all healthcare facilities for dashboard and selection

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب المنشآت بنجاح",
  "data": [
    {
      "id": 1,
      "name": "مركز صحي الملز",
      "code": "RC001",
      "location": "حي الملز",
      "sector": "الرياض",
      "type": "الرياض - مراكز شرق",
      "total_clinics": 8,
      "working": 7,
      "out_of_order": 1,
      "not_working": 0,
      "is_active": true,
      "contact": "+966-11-123-4567",
      "manager": "د. أحمد محمد",
      "medical_director": "د. فاطمة علي",
      "created_at": "2025-01-01T00:00:00.000000Z",
      "updated_at": "2025-01-01T00:00:00.000000Z"
    }
  ]
}
```

### 13. Register New Facility
**Endpoint:** `POST /facilities`

**Description:** Register a new healthcare facility

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "مركز الزلفي الصحي",
  "code": "ZC001",
  "location": "الزلفي",
  "sector": "الزلفي",
  "type": "مركز صحي",
  "total_clinics": 12,
  "working": 11,
  "out_of_order": 0,
  "not_working": 1,
  "is_active": true,
  "contact": "+966-16-123-4567",
  "manager": "د. محمد الزلفي",
  "medical_director": "د. سارة أحمد"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم تسجيل المنشأة بنجاح",
  "data": {
    "id": 13,
    "name": "مركز الزلفي الصحي",
    "code": "ZC001",
    "created_at": "2025-01-15T14:35:00.000000Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "البيانات المطلوبة غير صحيحة",
  "errors": {
    "name": ["حقل اسم المنشأة مطلوب"],
    "code": ["حقل رمز المنشأة مطلوب"],
    "sector": ["حقل القطاع مطلوب"]
  }
}
```

### 14. Get Recent Reports for Dashboard
**Endpoint:** `GET /dashboard/recent-reports`

**Description:** Get recent incident reports for dashboard display

**Headers:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `limit` (optional): Number of reports to return (default: 5)

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب البلاغات الحديثة بنجاح",
  "data": [
    {
      "id": "RPT-2025-001",
      "facility_name": "مستشفى الملك فيصل التخصصي",
      "title": "عطل في جهاز الأشعة",
      "category": "أجهزة طبية",
      "type": "equipment",
      "severity": "high",
      "status": "مفتوح",
      "reporter_name": "د. محمد أحمد",
      "report_date": "2025-01-15",
      "incident_time": "14:30",
      "created_at": "2025-01-15T14:35:00.000000Z"
    }
  ]
}
```

---

## Facilities Management Endpoints

### 15. Get All Facilities
**Endpoint:** `GET /facilities`

**Description:** Get all facilities with their details

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب المنشآت بنجاح",
  "data": [
    {
      "id": "FAC-001",
      "name": "مستشفى الملك فهد",
      "code": "KFH001",
      "location": "الرياض - الملز",
      "phone": "011-123-4567",
      "email": "info@kfh.health.sa",
      "manager": "د. أحمد السعود",
      "isActive": true,
      "address": "شارع الملك فهد، حي الملز، الرياض 12345",
      "description": "مستشفى متخصص في الطب العام والجراحة",
      "created_at": "2025-01-01T00:00:00.000000Z",
      "updated_at": "2025-01-01T00:00:00.000000Z"
    }
  ]
}
```

### 16. Create New Facility
**Endpoint:** `POST /facilities`

**Description:** Create a new facility

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "مستشفى الملك فهد",
  "code": "KFH001",
  "location": "الرياض - الملز",
  "phone": "011-123-4567",
  "email": "info@kfh.health.sa",
  "manager": "د. أحمد السعود",
  "isActive": true,
  "address": "شارع الملك فهد، حي الملز، الرياض 12345",
  "description": "مستشفى متخصص في الطب العام والجراحة"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم إضافة المنشأة بنجاح",
  "data": {
    "id": "FAC-001",
    "name": "مستشفى الملك فهد",
    "code": "KFH001"
  }
}
```

### 17. Update Facility
**Endpoint:** `PUT /facilities/{id}`

**Description:** Update facility information

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**URL Parameters:**
- `id`: Facility ID

**Request Body:**
```json
{
  "name": "مستشفى الملك فهد",
  "code": "KFH001",
  "location": "الرياض - الملز",
  "phone": "011-123-4567",
  "email": "info@kfh.health.sa",
  "manager": "د. أحمد السعود",
  "isActive": true,
  "address": "شارع الملك فهد، حي الملز، الرياض 12345",
  "description": "مستشفى متخصص في الطب العام والجراحة"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث المنشأة بنجاح"
}
```

### 18. Toggle Facility Status
**Endpoint:** `PATCH /facilities/{id}/toggle-status`

**Description:** Toggle facility active/inactive status

**Headers:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `id`: Facility ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث حالة المنشأة بنجاح",
  "data": {
    "isActive": false
  }
}
```

### 19. Delete Facility
**Endpoint:** `DELETE /facilities/{id}`

**Description:** Delete a facility

**Headers:**
```
Authorization: Bearer {token}
```

**URL Parameters:**
- `id`: Facility ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم حذف المنشأة بنجاح"
}
```

### 20. Get Facility Statistics
**Endpoint:** `GET /facilities/statistics`

**Description:** Get facility statistics for dashboard

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب إحصائيات المنشآت بنجاح",
  "data": {
    "active": 2,
    "inactive": 1,
    "total": 3,
    "activationPercentage": 67
  }
}
```

---

## Direct Purchase Management Endpoints

### 15. Create Direct Purchase Order
**Endpoint:** `POST /direct-purchase/orders`

**Description:** Create a new direct purchase order

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "order_date": "2025-01-15",
  "item_number": "ITM-001",
  "item_name": "أدوية مسكنة",
  "quantity": 100,
  "beneficiary_facility": "مستشفى الرياض العام",
  "financial_approval_number": "FA-2025-001",
  "approval_date": "2025-01-14",
  "total_cost": 5000.00,
  "supplier_name": "شركة الأدوية المتحدة",
  "supplier_contact": "+966-11-123-4567, info@pharma.com",
  "status": "جديد",
  "delivery_date": "2025-01-25",
  "actual_delivery_date": null,
  "notes": "طلب عاجل للعيادات الخارجية"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم إنشاء طلب الشراء المباشر بنجاح",
  "data": {
    "id": "PO-2025-001",
    "order_number": "PO-2025-001",
    "status": "جديد",
    "created_at": "2025-01-15T15:30:00.000000Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "البيانات المطلوبة غير صحيحة",
  "errors": {
    "order_date": ["حقل تاريخ الطلب مطلوب"],
    "item_name": ["حقل اسم الصنف مطلوب"],
    "quantity": ["حقل الكمية مطلوب ويجب أن يكون رقماً موجباً"],
    "beneficiary_facility": ["حقل الجهة المستفيدة مطلوب"]
  }
}
```

### 16. Get All Direct Purchase Orders
**Endpoint:** `GET /direct-purchase/orders`

**Description:** Get all direct purchase orders

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب طلبات الشراء المباشر بنجاح",
  "data": [
    {
      "id": "PO-2025-001",
      "order_number": "PO-2025-001",
      "order_date": "2025-01-15",
      "item_number": "ITM-001",
      "item_name": "أدوية مسكنة",
      "quantity": 100,
      "beneficiary_facility": "مستشفى الرياض العام",
      "financial_approval_number": "FA-2025-001",
      "approval_date": "2025-01-14",
      "total_cost": 5000.00,
      "supplier_name": "شركة الأدوية المتحدة",
      "supplier_contact": "+966-11-123-4567, info@pharma.com",
      "status": "جديد",
      "delivery_date": "2025-01-25",
      "actual_delivery_date": null,
      "notes": "طلب عاجل للعيادات الخارجية",
      "created_at": "2025-01-15T15:30:00.000000Z",
      "updated_at": "2025-01-15T15:30:00.000000Z"
    }
  ]
}
```

### 17. Update Direct Purchase Order
**Endpoint:** `PUT /direct-purchase/orders/{id}`

**Description:** Update an existing direct purchase order

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "موافق عليه",
  "actual_delivery_date": "2025-01-24",
  "notes": "تم التسليم في الموعد المحدد"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث طلب الشراء المباشر بنجاح"
}
```

### 18. Delete Direct Purchase Order
**Endpoint:** `DELETE /direct-purchase/orders/{id}`

**Description:** Delete a direct purchase order (only allowed for orders in "جديد" status)

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم حذف طلب الشراء المباشر بنجاح"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "لا يمكن حذف طلب الشراء بعد الموافقة عليه"
}
```

---

## Dental Contracts Management Endpoints

### 1. Create Dental Contract
**Endpoint:** `POST /dental/contracts`

**Description:** Create a new dental contract request

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "orderDate": "2025-01-15",
  "itemNumber": "DA-001",
  "itemName": "كرسي أسنان متقدم",
  "quantity": 1,
  "beneficiaryFacility": "عيادة أسنان الرياض",
  "financialApprovalNumber": "FA-2025-001",
  "approvalDate": "2025-01-10",
  "totalCost": 25000.00,
  "supplierName": "شركة الأجهزة الطبية المتقدمة",
  "supplierContact": "+966-11-123-4567",
  "status": "جديد",
  "deliveryDate": "2025-02-15",
  "actualDeliveryDate": null,
  "notes": "جهاز متقدم مع ضمان شامل"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم إنشاء عقد الأسنان بنجاح",
  "data": {
    "id": "DC-2025-001",
    "status": "جديد",
    "created_at": "2025-01-15T10:30:00.000000Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "البيانات المطلوبة غير صحيحة",
  "errors": {
    "itemName": ["حقل اسم الصنف مطلوب"],
    "quantity": ["حقل الكمية مطلوب"],
    "beneficiaryFacility": ["حقل العيادة المستفيدة مطلوب"]
  }
}
```

---

### 2. Get All Dental Contracts
**Endpoint:** `GET /dental/contracts`

**Description:** Retrieve all dental contracts

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب عقود الأسنان بنجاح",
  "data": [
    {
      "id": "DC-2025-001",
      "orderDate": "2025-01-15",
      "itemNumber": "DA-001",
      "itemName": "كرسي أسنان متقدم",
      "quantity": 1,
      "beneficiaryFacility": "عيادة أسنان الرياض",
      "financialApprovalNumber": "FA-2025-001",
      "approvalDate": "2025-01-10",
      "totalCost": 25000.00,
      "supplierName": "شركة الأجهزة الطبية المتقدمة",
      "supplierContact": "+966-11-123-4567",
      "status": "تم التعاقد",
      "deliveryDate": "2025-02-15",
      "actualDeliveryDate": null,
      "notes": "جهاز متقدم مع ضمان شامل",
      "created_at": "2025-01-15T10:30:00.000000Z",
      "updated_at": "2025-01-16T09:15:00.000000Z"
    }
  ]
}
```

---

### 3. Get Specific Dental Contract
**Endpoint:** `GET /dental/contracts/{id}`

**Description:** Retrieve a specific dental contract by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب تفاصيل العقد بنجاح",
  "data": {
    "id": "DC-2025-001",
    "orderDate": "2025-01-15",
    "itemNumber": "DA-001",
    "itemName": "كرسي أسنان متقدم",
    "quantity": 1,
    "beneficiaryFacility": "عيادة أسنان الرياض",
    "financialApprovalNumber": "FA-2025-001",
    "approvalDate": "2025-01-10",
    "totalCost": 25000.00,
    "supplierName": "شركة الأجهزة الطبية المتقدمة",
    "supplierContact": "+966-11-123-4567",
    "status": "تم التعاقد",
    "deliveryDate": "2025-02-15",
    "actualDeliveryDate": null,
    "notes": "جهاز متقدم مع ضمان شامل",
    "created_at": "2025-01-15T10:30:00.000000Z",
    "updated_at": "2025-01-16T09:15:00.000000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "العقد غير موجود"
}
```

---

### 4. Update Dental Contract
**Endpoint:** `PUT /dental/contracts/{id}`

**Description:** Update an existing dental contract

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "تم التسليم",
  "actualDeliveryDate": "2025-02-10",
  "notes": "تم التسليم والتركيب بنجاح"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث العقد بنجاح"
}
```

---

### 5. Delete Dental Contract
**Endpoint:** `DELETE /dental/contracts/{id}`

**Description:** Delete a dental contract

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم حذف العقد بنجاح"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "لا يمكن حذف العقد بعد الموافقة عليه"
}
```

---

### 6. Get Dental Contracts Dashboard Data
**Endpoint:** `GET /dental/contracts/dashboard`

**Description:** Get dashboard statistics for dental contracts

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب إحصائيات عقود الأسنان بنجاح",
  "data": {
    "totalContracts": 45,
    "newContracts": 12,
    "approvedContracts": 18,
    "completedContracts": 10,
    "rejectedContracts": 5,
    "totalValue": 1250000.00,
    "statusDistribution": [
      {"status": "جديد", "count": 12},
      {"status": "موافق عليه", "count": 18},
      {"status": "تم التعاقد", "count": 8},
      {"status": "تم التسليم", "count": 10},
      {"status": "مرفوض", "count": 5}
    ],
    "monthlyTrend": [
      {"month": "يناير", "contracts": 15, "value": 375000},
      {"month": "فبراير", "contracts": 20, "value": 500000}
    ],
    "topSuppliers": [
      {
        "name": "شركة الأجهزة الطبية المتقدمة",
        "contracts": 15,
        "value": 400000
      }
    ]
  }
}
```

---

## Notes for Laravel Implementation

1. **Authentication Middleware:** Use Laravel Sanctum for API token authentication
2. **Validation:** Use Laravel Form Request classes for validation
3. **Rate Limiting:** Implement rate limiting for authentication endpoints
4. **CORS:** Configure CORS properly for frontend domain
5. **Localization:** Use Laravel localization for Arabic error messages
6. **Database:** Design tables for users, roles, permissions, and all entities
7. **Security:** Implement proper password hashing and token management

### Database Schema for Dental Contracts
```sql
CREATE TABLE dental_contracts (
    id VARCHAR(50) PRIMARY KEY,
    order_date DATE NOT NULL,
    item_number VARCHAR(100),
    item_name VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL,
    beneficiary_facility VARCHAR(255) NOT NULL,
    financial_approval_number VARCHAR(100),
    approval_date DATE,
    total_cost DECIMAL(12,2),
    supplier_name VARCHAR(255),
    supplier_contact VARCHAR(255),
    status ENUM('جديد', 'موافق عليه', 'تم التعاقد', 'تم التسليم', 'مرفوض') DEFAULT 'جديد',
    delivery_date DATE,
    actual_delivery_date DATE,
    notes TEXT,
    created_by INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

---

## Dental Contracts Management Endpoints

### 11. Get Dental Contracts Dashboard Data
**Endpoint:** `GET /dental/contracts/dashboard`

**Description:** Get comprehensive dashboard data for dental contracts including summary statistics, status distribution, and monthly trends

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات لوحة تحكم عقود الأسنان بنجاح",
  "data": {
    "summary": {
      "total": 125,
      "new": 8,
      "approved": 25,
      "contracted": 67,
      "delivered": 18,
      "rejected": 7,
      "totalValue": 1850000
    },
    "statusData": [
      { "name": "جديد", "value": 8, "color": "#3b82f6" },
      { "name": "موافق عليه", "value": 25, "color": "#f59e0b" },
      { "name": "تم التعاقد", "value": 67, "color": "#8b5cf6" },
      { "name": "تم التسليم", "value": 18, "color": "#10b981" },
      { "name": "مرفوض", "value": 7, "color": "#ef4444" }
    ],
    "monthlyData": [
      { "month": "يناير", "contracts": 32, "value": 485000 },
      { "month": "فبراير", "contracts": 28, "value": 420000 },
      { "month": "مارس", "contracts": 35, "value": 560000 },
      { "month": "أبريل", "contracts": 30, "value": 385000 }
    ],
    "contracts": [
      {
        "id": "CONT-001",
        "itemNumber": "DENT-001",
        "itemName": "كرسي الأسنان المتطور",
        "beneficiary": "عيادة الأسنان - المبنى الرئيسي",
        "supplier": "شركة التجهيزات الطبية المتقدمة",
        "status": "تم التعاقد",
        "totalCost": 85000,
        "orderDate": "2024-01-15",
        "deliveryDate": "2024-02-15"
      }
    ]
  }
}
```

### 12. Get Top Suppliers for Dental Contracts
**Endpoint:** `GET /dental/contracts/top-suppliers`

**Description:** Get the top performing suppliers for dental equipment contracts

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات أفضل الشركات الموردة بنجاح",
  "data": [
    {
      "name": "شركة التجهيزات الطبية المتقدمة",
      "contracts": 35,
      "value": 650000,
      "performance_score": 95.5,
      "last_contract_date": "2024-04-15"
    }
  ]
}
```

### 13. Get Top Active Clinics for Dental Contracts
**Endpoint:** `GET /dental/contracts/top-clinics`

**Description:** Get the most active clinics/departments in terms of dental equipment contracts

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات أكثر العيادات نشاطاً بنجاح",
  "data": [
    {
      "name": "عيادة الأسنان - المبنى الرئيسي",
      "contracts": 42,
      "value": 720000,
      "equipment_count": 15,
      "last_contract_date": "2024-04-12"
    }
  ]
}
```

---

## Dental Assets Management Endpoints

### Create Dental Asset
**Endpoint:** `POST /dental/assets`

**Description:** Create a new dental asset/device

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "deviceName": "جهاز أشعة الأسنان",
  "serialNumber": "DX-2024-001",
  "facilityName": "مستشفى الملك فيصل التخصصي",
  "supplierName": "شركة الأجهزة الطبية المتقدمة",
  "supplierContact": "+966-11-123-4567",
  "supplierEmail": "info@medicaldevices.com",
  "deviceModel": "DX-Pro-2024",
  "deliveryDate": "2024-01-15",
  "installationDate": "2024-01-20",
  "warrantyPeriod": 3,
  "deviceStatus": "يعمل",
  "notes": "جهاز جديد للعيادة الخارجية"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم إضافة الجهاز بنجاح",
  "data": {
    "id": "ASSET-2024-001",
    "deviceName": "جهاز أشعة الأسنان",
    "serialNumber": "DX-2024-001",
    "created_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "البيانات المدخلة غير صحيحة",
  "errors": {
    "deviceName": ["حقل اسم الجهاز مطلوب"],
    "serialNumber": ["الرقم التسلسلي مطلوب"],
    "facilityName": ["اسم المنشأة مطلوب"]
  }
}
```

---

### Get All Dental Assets
**Endpoint:** `GET /dental/assets`

**Description:** Retrieve all dental assets/devices

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب الأصول بنجاح",
  "data": [
    {
      "id": "ASSET-2024-001",
      "deviceName": "جهاز أشعة الأسنان",
      "serialNumber": "DX-2024-001",
      "facilityName": "مستشفى الملك فيصل التخصصي",
      "supplierName": "شركة الأجهزة الطبية المتقدمة",
      "supplierContact": "+966-11-123-4567",
      "supplierEmail": "info@medicaldevices.com",
      "deviceModel": "DX-Pro-2024",
      "deliveryDate": "2024-01-15",
      "installationDate": "2024-01-20",
      "warrantyPeriod": 3,
      "deviceStatus": "يعمل",
      "warrantyStatus": "تحت الضمان",
      "malfunctionCount": 0,
      "notes": "جهاز جديد للعيادة الخارجية",
      "created_at": "2024-01-15T10:30:00.000000Z",
      "updated_at": "2024-01-15T10:30:00.000000Z"
    }
  ]
}
```

**Empty Response (200):**
```json
{
  "success": true,
  "message": "لا توجد أصول",
  "data": []
}
```

---

### Get Single Dental Asset
**Endpoint:** `GET /dental/assets/{id}`

**Description:** Retrieve details of a specific dental asset

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات الأصل بنجاح",
  "data": {
    "id": "ASSET-2024-001",
    "deviceName": "جهاز أشعة الأسنان",
    "serialNumber": "DX-2024-001",
    "facilityName": "مستشفى الملك فيصل التخصصي",
    "supplierName": "شركة الأجهزة الطبية المتقدمة",
    "supplierContact": "+966-11-123-4567",
    "supplierEmail": "info@medicaldevices.com",
    "deviceModel": "DX-Pro-2024",
    "deliveryDate": "2024-01-15",
    "installationDate": "2024-01-20",
    "warrantyPeriod": 3,
    "deviceStatus": "يعمل",
    "warrantyStatus": "تحت الضمان",
    "malfunctionCount": 0,
    "notes": "جهاز جديد للعيادة الخارجية",
    "created_at": "2024-01-15T10:30:00.000000Z",
    "updated_at": "2024-01-15T10:30:00.000000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "الأصل غير موجود"
}
```

---

### Update Dental Asset
**Endpoint:** `PUT /dental/assets/{id}`

**Description:** Update an existing dental asset

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "deviceName": "جهاز أشعة الأسنان المحدث",
  "serialNumber": "DX-2024-001",
  "facilityName": "مستشفى الملك فيصل التخصصي",
  "supplierName": "شركة الأجهزة الطبية المتقدمة",
  "supplierContact": "+966-11-123-4567",
  "supplierEmail": "info@medicaldevices.com",
  "deviceModel": "DX-Pro-2024",
  "deliveryDate": "2024-01-15",
  "installationDate": "2024-01-20",
  "warrantyPeriod": 3,
  "deviceStatus": "مكهن",
  "notes": "تم تحديث حالة الجهاز بعد الصيانة"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث الأصل بنجاح",
  "data": {
    "id": "ASSET-2024-001",
    "updated_at": "2024-01-16T14:20:00.000000Z"
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "الأصل غير موجود"
}
```

**Error Response (422):**
```json
{
  "success": false,
  "message": "البيانات المدخلة غير صحيحة",
  "errors": {
    "deviceName": ["حقل اسم الجهاز مطلوب"]
  }
}
```

---

### Delete Dental Asset
**Endpoint:** `DELETE /dental/assets/{id}`

**Description:** Delete a dental asset from the system

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم حذف الأصل بنجاح"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "الأصل غير موجود"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "لا يمكن حذف هذا الأصل لوجود تقارير مرتبطة به"
}
```

---

### Get Dental Assets Dashboard Data
**Endpoint:** `GET /dental/assets/dashboard`

**Description:** Get dashboard statistics for dental assets

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب إحصائيات الأصول بنجاح",
  "data": {
    "totalAssets": 45,
    "workingAssets": 38,
    "outOfServiceAssets": 7,
    "underWarrantyAssets": 25,
    "assetsByFacility": [
      {
        "facilityName": "مستشفى الملك فيصل التخصصي",
        "totalAssets": 20,
        "workingAssets": 18,
        "outOfServiceAssets": 2
      }
    ],
    "assetsBySupplier": [
      {
        "supplierName": "شركة الأجهزة الطبية المتقدمة",
        "totalAssets": 15,
        "totalValue": 450000
      }
    ],
    "maintenanceAlerts": [
      {
        "assetId": "ASSET-2024-001",
        "deviceName": "جهاز أشعة الأسنان",
        "alertType": "warranty_expiring",
        "message": "ينتهي الضمان خلال 30 يوم"
      }
    ]
  }
}
```

---

## Dental Assets Management Endpoints

### 1. Create Dental Asset
**Endpoint:** `POST /dental/assets`

**Description:** Create a new dental asset in the system

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "name": "أجهزة الأشعة السينية",
  "facility": "مستشفى الملك فهد",
  "supplier": "شركة الطب الحديث",
  "status": "يعمل",
  "type": "أجهزة تشخيص",
  "serial_number": "DX2024001",
  "purchase_date": "2024-01-15",
  "warranty_end": "2027-01-15",
  "maintenance_schedule": "شهري"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم إنشاء الأصل بنجاح",
  "data": {
    "id": 1,
    "name": "أجهزة الأشعة السينية",
    "facility": "مستشفى الملك فهد",
    "supplier": "شركة الطب الحديث",
    "status": "يعمل",
    "type": "أجهزة تشخيص",
    "serial_number": "DX2024001",
    "purchase_date": "2024-01-15",
    "warranty_end": "2027-01-15",
    "maintenance_schedule": "شهري",
    "created_at": "2024-01-20T10:00:00Z",
    "updated_at": "2024-01-20T10:00:00Z"
  }
}
```

---

### 2. Get All Dental Assets
**Endpoint:** `GET /dental/assets`

**Description:** Retrieve all dental assets in the system

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب الأصول بنجاح",
  "data": [
    {
      "id": 1,
      "name": "أجهزة الأشعة السينية",
      "facility": "مستشفى الملك فهد",
      "supplier": "شركة الطب الحديث",
      "status": "يعمل",
      "type": "أجهزة تشخيص",
      "serial_number": "DX2024001",
      "purchase_date": "2024-01-15",
      "warranty_end": "2027-01-15",
      "maintenance_schedule": "شهري",
      "created_at": "2024-01-20T10:00:00Z",
      "updated_at": "2024-01-20T10:00:00Z"
    }
  ]
}
```

---

### 3. Get Dental Assets Dashboard Data
**Endpoint:** `GET /dental/assets/dashboard`

**Description:** Retrieve comprehensive dashboard data for dental assets including statistics and analytics

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات لوحة التحكم بنجاح",
  "data": {
    "assets": [
      {
        "id": 1,
        "name": "أجهزة الأشعة السينية",
        "facility": "مستشفى الملك فهد",
        "supplier": "شركة الطب الحديث",
        "status": "يعمل",
        "type": "أجهزة تشخيص",
        "serial_number": "DX2024001",
        "purchase_date": "2024-01-15",
        "warranty_end": "2027-01-15",
        "maintenance_schedule": "شهري",
        "created_at": "2024-01-20T10:00:00Z",
        "updated_at": "2024-01-20T10:00:00Z"
      }
    ],
    "statistics": {
      "total_assets": 150,
      "working_assets": 135,
      "broken_assets": 15,
      "total_facilities": 8,
      "total_suppliers": 12,
      "total_asset_types": 6
    },
    "charts": {
      "status_distribution": [
        { "name": "يعمل", "value": 135 },
        { "name": "معطل", "value": 15 }
      ],
      "facility_distribution": [
        { "name": "مستشفى الملك فهد", "value": 45 },
        { "name": "مستشفى الملك عبدالعزيز", "value": 38 },
        { "name": "المركز الطبي الحديث", "value": 32 }
      ],
      "type_distribution": [
        { "name": "أجهزة تشخيص", "value": 60 },
        { "name": "أجهزة علاج", "value": 45 },
        { "name": "أجهزة جراحة", "value": 30 }
      ],
      "supplier_distribution": [
        { "name": "شركة الطب الحديث", "value": 50 },
        { "name": "المجموعة الطبية المتقدمة", "value": 40 },
        { "name": "شركة التقنيات الطبية", "value": 35 }
      ]
    }
  }
}
```

---

## Transactions Management Endpoints

### 1. Create New Transaction
**Endpoint:** `POST /transactions`

**Description:** Create a new administrative transaction

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "transactionNumber": "TXN-2025-001",
  "receiveDate": "2025-01-15",
  "subject": "طلب صيانة جهاز أشعة",
  "type": "طلب صيانة",
  "senderEntity": "قسم الأشعة",
  "transferredTo": "قسم الصيانة الطبية",
  "status": "مفتوح تحت الاجراء",
  "notes": "جهاز يحتاج صيانة عاجلة"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "تم إنشاء المعاملة بنجاح",
  "data": {
    "id": "TXN-2025-001",
    "transactionNumber": "TXN-2025-001",
    "status": "مفتوح تحت الاجراء",
    "created_at": "2025-01-15T10:30:00.000000Z"
  }
}
```

---

### 2. Get All Transactions
**Endpoint:** `GET /transactions`

**Description:** Retrieve all administrative transactions

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب المعاملات بنجاح",
  "data": [
    {
      "id": "TXN-2025-001",
      "transactionNumber": "TXN-2025-001",
      "receiveDate": "2025-01-15",
      "subject": "طلب صيانة جهاز أشعة",
      "type": "طلب صيانة",
      "senderEntity": "قسم الأشعة",
      "transferredTo": "قسم الصيانة الطبية",
      "status": "مفتوح تحت الاجراء",
      "notes": "جهاز يحتاج صيانة عاجلة",
      "created_at": "2025-01-15T10:30:00.000000Z",
      "updated_at": "2025-01-15T10:30:00.000000Z"
    }
  ]
}
```

---

### 3. Get Specific Transaction
**Endpoint:** `GET /transactions/{id}`

**Description:** Retrieve a specific transaction by ID

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب تفاصيل المعاملة بنجاح",
  "data": {
    "id": "TXN-2025-001",
    "transactionNumber": "TXN-2025-001",
    "receiveDate": "2025-01-15",
    "subject": "طلب صيانة جهاز أشعة",
    "type": "طلب صيانة",
    "senderEntity": "قسم الأشعة",
    "transferredTo": "قسم الصيانة الطبية",
    "status": "مفتوح تحت الاجراء",
    "notes": "جهاز يحتاج صيانة عاجلة",
    "created_at": "2025-01-15T10:30:00.000000Z",
    "updated_at": "2025-01-15T10:30:00.000000Z"
  }
}
```

---

### 4. Update Transaction
**Endpoint:** `PUT /transactions/{id}`

**Description:** Update an existing transaction

**Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "status": "منجز",
  "notes": "تم إنجاز الصيانة بنجاح"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم تحديث المعاملة بنجاح"
}
```

---

### 5. Delete Transaction
**Endpoint:** `DELETE /transactions/{id}`

**Description:** Delete a transaction

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم حذف المعاملة بنجاح"
}
```

---

### 6. Get Transaction Transfer History
**Endpoint:** `GET /transactions/{id}/history`

**Description:** Get the transfer history of a specific transaction

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب تاريخ التحويلات بنجاح",
  "data": [
    {
      "id": 1,
      "from": "قسم الأشعة",
      "to": "قسم الصيانة الطبية",
      "date": "2025-01-15",
      "notes": "تحويل للصيانة العاجلة",
      "transferredBy": "أحمد محمد",
      "created_at": "2025-01-15T10:30:00.000000Z"
    }
  ]
}
```

---

### 9. Get Transactions Dashboard Data
**Endpoint:** `GET /transactions/dashboard`

**Description:** Get comprehensive dashboard data for transactions including statistics and analytics

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب بيانات لوحة التحكم بنجاح",
  "data": {
    "transactions": [
      {
        "id": "TXN-2025-001",
        "transactionNumber": "TXN-2025-001",
        "receiveDate": "2025-01-15",
        "subject": "طلب صيانة جهاز أشعة",
        "type": "طلب صيانة",
        "senderEntity": "قسم الأشعة",
        "transferredTo": "قسم الصيانة الطبية",
        "status": "مفتوح تحت الاجراء",
        "notes": "جهاز يحتاج صيانة عاجلة",
        "created_at": "2025-01-15T10:30:00.000000Z",
        "updated_at": "2025-01-15T10:30:00.000000Z"
      }
    ],
    "statistics": {
      "total": 250,
      "pending": 45,
      "completed": 180,
      "rejected": 25,
      "overdue": 12
    },
    "facilityBreakdown": [
      {
        "facility": "قسم الصيانة الطبية",
        "total": 85,
        "pending": 15,
        "completed": 60,
        "rejected": 10
      },
      {
        "facility": "قسم التموين",
        "total": 70,
        "pending": 12,
        "completed": 50,
        "rejected": 8
      }
    ],
    "statusBreakdown": [
      {
        "status": "مفتوح تحت الاجراء",
        "count": 45
      },
      {
        "status": "منجز",
        "count": 180
      },
      {
        "status": "مرفوض",
        "count": 25
      }
    ],
    "completionRate": 72
  }
}
```

---

### 7. Get Transaction Types
**Endpoint:** `GET /transactions/types`

**Description:** Get all available transaction types

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب أنواع المعاملات بنجاح",
  "data": [
    "طلب صيانة",
    "طلب توريد",
    "طلب خدمة",
    "شكوى",
    "استفسار",
    "طلب تطوير"
  ]
}
```

---

### 8. Get Transaction Statuses
**Endpoint:** `GET /transactions/statuses`

**Description:** Get all available transaction statuses

**Headers:**
```
Authorization: Bearer {token}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "تم جلب حالات المعاملات بنجاح",
  "data": [
    "مفتوح تحت الاجراء",
    "منجز",
    "مرفوض"
  ]
}
```