# API Endpoints

Base URL: `/api`

Swagger UI is available at `/api/docs`.

| Method | Endpoint | Roles | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register parent/student account |
| POST | `/auth/login` | Public | Login and receive JWT |
| GET | `/auth/me` | Authenticated | Current user profile |
| GET | `/dashboard` | Authenticated | Dashboard statistics |
| GET | `/classes` | Authenticated | List active classes and available seats |
| POST | `/classes` | Admin | Create/update class seats |
| DELETE | `/classes/:id` | Admin | Soft delete class |
| GET | `/applications` | Authenticated | List/search/filter applications |
| POST | `/applications` | Authenticated | Create draft application with uploads |
| GET | `/applications/:id` | Owner, Admin, Staff | View application |
| PUT | `/applications/:id` | Owner if draft, Admin, Staff | Edit application |
| POST | `/applications/:id/submit` | Owner | Submit draft for review |
| PATCH | `/applications/:id/review` | Admin, Staff | Approve/reject and add remarks |
| GET | `/applications/:id/pdf` | Owner, Admin, Staff | Download application PDF |
| GET | `/applications/export.csv` | Admin, Staff | Export submitted application data |

## Upload Fields

`POST /applications` and `PUT /applications/:id` accept `multipart/form-data`:

- `photo`
- `birthCertificate`
- `transferCertificate`
- `parent` as JSON string
- all admission form fields as plain form fields, including `motherTongue`, `penNumber`, `childId`, `nationalityState`, `religion`, `casteCategory`, `livingWith`, `motherName`, `tcRecordAttached`, `tcNumberDate`, `mediumOfInstruction`, `firstLanguage`, `secondLanguage`, `smallpoxProtection`, `identificationMark1`, `identificationMark2`, and `previousSchoolHistory`

Allowed file types: JPG, PNG, PDF.
