# Database Schema

MongoDB database: `school_admissions`

## users

| Field | Type | Notes |
| --- | --- | --- |
| name | String | Required |
| email | String | Required, unique, lowercase |
| phone | String | Optional |
| password | String | Required, bcrypt hashed |
| role | String | `admin`, `staff`, `parent` |
| isActive | Boolean | Soft account disable |
| createdAt / updatedAt | Date | Automatic timestamps |

## applications

| Field | Type | Notes |
| --- | --- | --- |
| applicationId | String | Required, unique, generated as `ADM-YYYY-00001` |
| user | ObjectId | Applicant account reference |
| admissionNo | String | School admission number |
| classAdmitted | String | Class admitted |
| dateOfAdmission | Date | Date of admission |
| fullName | String | Required |
| motherTongue | String | Mother tongue of the pupil |
| dateOfBirth | Date | Required |
| aadhaarNumber | String | Optional |
| penNumber | String | PEN number |
| childId | String | Child ID |
| nationalityState | String | Nationality and state |
| religion | String | Religion |
| casteCategory | String | SC/ST/BC details |
| livingWith | String | `Parent`, `Guardian`, `Other` |
| classApplyingFor | String | Required |
| previousSchool | String | Optional |
| address | String | Optional legacy address field |
| parent.name | String | Required |
| parent.phone | String | Required |
| parent.email | String | Optional |
| parent.occupation | String | Optional |
| parent.addressWithCellNo | String | Full address with cell no. |
| motherName | String | Mother name |
| lastClassStudied | String | Class last studied |
| lastSchoolAttended | String | School last attended |
| qualifiedForPromotion | String | `Yes`, `No`, `Not Applicable` |
| tcRecordAttached | String | T.C. or record sheet attached |
| tcNumberDate | String | T.C./record sheet number and date |
| mediumOfInstruction | String | Medium of instruction |
| firstLanguage | String | First language Part-I |
| secondLanguage | String | Second language |
| smallpoxProtection | String | Vaccination/small-pox mark details |
| identificationMark1 | String | Personal mark of identification (i) |
| identificationMark2 | String | Personal mark of identification (ii) |
| previousSchoolHistory | String | Previous school history |
| documents.photo | String | Uploaded file URL |
| documents.birthCertificate | String | Uploaded file URL |
| documents.transferCertificate | String | Uploaded file URL |
| status | String | `Draft`, `Pending`, `Approved`, `Rejected` |
| remarks | Array | Review timeline with message, status, staff user, and date |
| submittedAt | Date | Set on submit |
| reviewedBy | ObjectId | Staff/admin reference |
| reviewedAt | Date | Set on review |
| duplicateWarning | Boolean | True when possible duplicate found |
| duplicateMatches | ObjectId[] | Matching application references |
| createdAt / updatedAt | Date | Automatic timestamps |

Indexes:

- `applicationId` unique index
- Text index over `fullName`, `applicationId`, `parent.phone`, `parent.email`
- `status` index

## classseats

| Field | Type | Notes |
| --- | --- | --- |
| name | String | Required, unique |
| totalSeats | Number | Required |
| filledSeats | Number | Defaults to 0 |
| availableSeats | Virtual | `totalSeats - filledSeats` |
| isActive | Boolean | Soft delete flag |
| createdAt / updatedAt | Date | Automatic timestamps |
