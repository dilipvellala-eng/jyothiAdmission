import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import { api } from '../api/client.js';

const initialForm = {
  admissionNo: '',
  classAdmitted: '',
  dateOfAdmission: '',
  fullName: '',
  motherTongue: '',
  dateOfBirth: '',
  aadhaarNumber: '',
  penNumber: '',
  childId: '',
  nationalityState: '',
  religion: '',
  casteCategory: '',
  livingWith: '',
  parent: { name: '', phone: '', email: '', occupation: '', addressWithCellNo: '' },
  motherName: '',
  lastClassStudied: '',
  lastSchoolAttended: '',
  qualifiedForPromotion: '',
  tcRecordAttached: '',
  tcNumberDate: '',
  classApplyingFor: '',
  mediumOfInstruction: '',
  firstLanguage: '',
  secondLanguage: '',
  smallpoxProtection: '',
  identificationMark1: '',
  identificationMark2: '',
  previousSchoolHistory: '',
  photo: null,
  birthCertificate: null,
  transferCertificate: null
};

const steps = ['Pupil', 'Parent', 'Academic', 'Documents', 'Review'];

export default function AdmissionForm() {
  const [step, setStep] = useState(0);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState(() => normalizeDraft(JSON.parse(localStorage.getItem('admission_draft') || 'null')));
  const [applicationId, setApplicationId] = useState(localStorage.getItem('admission_draft_id') || '');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/classes').then(({ data }) => setClasses(data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const { photo, birthCertificate, transferCertificate, ...serializable } = form;
      localStorage.setItem('admission_draft', JSON.stringify(serializable));
    }, 500);
    return () => clearTimeout(timer);
  }, [form]);

  const currentErrors = useMemo(() => validate(form, step), [form, step]);

  function setField(field, value) {
    setForm({ ...form, [field]: value });
  }

  function setParentField(field, value) {
    setForm({ ...form, parent: { ...form.parent, [field]: value } });
  }

  function next() {
    const validation = validate(form, step);
    setErrors(validation);
    if (Object.keys(validation).length) return;
    setStep((value) => Math.min(value + 1, steps.length - 1));
  }

  async function saveDraft() {
    try {
      const payload = toFormData(form);
      const { data } = applicationId
        ? await api.put(`/applications/${applicationId}`, payload)
        : await api.post('/applications', payload);
      setApplicationId(data._id);
      localStorage.setItem('admission_draft_id', data._id);
      toast.success(`Draft saved as ${data.applicationId}`);
      return data._id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not save draft');
      return null;
    }
  }

  async function submit() {
    const id = await saveDraft();
    if (!id) return;
    try {
      await api.post(`/applications/${id}/submit`);
      localStorage.removeItem('admission_draft');
      localStorage.removeItem('admission_draft_id');
      setForm(initialForm);
      setApplicationId('');
      setStep(0);
      toast.success('Application submitted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not submit application');
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold">Application for Admission</h2>
      </div>
      <div className="panel p-4">
        <div className="grid gap-2 sm:grid-cols-5">
          {steps.map((label, index) => (
            <button key={label} className={`rounded-md px-3 py-2 text-sm font-semibold ${index === step ? 'bg-brand text-white' : 'bg-stone-100 text-stone-600'}`} onClick={() => setStep(index)}>
              {index + 1}. {label}
            </button>
          ))}
        </div>
      </div>
      <section className="panel p-5">
        {step === 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Admission No." value={form.admissionNo} onChange={(value) => setField('admissionNo', value)} />
            <Input label="Class Admitted" value={form.classAdmitted} onChange={(value) => setField('classAdmitted', value)} />
            <Input label="Date of Admission" type="date" value={form.dateOfAdmission} onChange={(value) => setField('dateOfAdmission', value)} />
            <Input label="Name of the Pupil in Full with Surname" value={form.fullName} error={errors.fullName} onChange={(value) => setField('fullName', value)} />
            <Input label="Mother Tongue of the Pupil" value={form.motherTongue} onChange={(value) => setField('motherTongue', value)} />
            <Input label="Date of Birth" type="date" value={form.dateOfBirth} error={errors.dateOfBirth} onChange={(value) => setField('dateOfBirth', value)} />
            <Input label="Aadhaar No." value={form.aadhaarNumber} onChange={(value) => setField('aadhaarNumber', value)} />
            <Input label="PEN No." value={form.penNumber} onChange={(value) => setField('penNumber', value)} />
            <Input label="Child ID" value={form.childId} onChange={(value) => setField('childId', value)} />
            <Input label="Nationality and State Which the Pupil Belongs" value={form.nationalityState} onChange={(value) => setField('nationalityState', value)} />
            <Input label="Religion" value={form.religion} onChange={(value) => setField('religion', value)} />
            <Input label="SC / ST / BC Specify" value={form.casteCategory} onChange={(value) => setField('casteCategory', value)} />
            <Select label="Whether Living with Parent or Guardian" value={form.livingWith} options={['Parent', 'Guardian', 'Other']} onChange={(value) => setField('livingWith', value)} />
          </div>
        )}
        {step === 1 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name of the Parent or Guardian" value={form.parent.name} error={errors.parentName} onChange={(value) => setParentField('name', value)} />
            <Input label="Occupation" value={form.parent.occupation} onChange={(value) => setParentField('occupation', value)} />
            <Input label="Cell No." value={form.parent.phone} error={errors.parentPhone} onChange={(value) => setParentField('phone', value)} />
            <Input label="Email (optional)" type="email" value={form.parent.email} onChange={(value) => setParentField('email', value)} />
            <div className="md:col-span-2">
              <TextArea label="Full Address with Cell No." value={form.parent.addressWithCellNo} onChange={(value) => setParentField('addressWithCellNo', value)} />
            </div>
            <Input label="Mother Name" value={form.motherName} onChange={(value) => setField('motherName', value)} />
          </div>
        )}
        {step === 2 && (
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Class Last Studied" value={form.lastClassStudied} onChange={(value) => setField('lastClassStudied', value)} />
            <Input label="Name of School Last Attended" value={form.lastSchoolAttended} onChange={(value) => setField('lastSchoolAttended', value)} />
            <Select label="Qualified for Promotion" value={form.qualifiedForPromotion} options={['Yes', 'No', 'Not Applicable']} onChange={(value) => setField('qualifiedForPromotion', value)} />
            <Select label="T.C. or Record Sheet Attached" value={form.tcRecordAttached} options={['Yes', 'No']} onChange={(value) => setField('tcRecordAttached', value)} />
            <Input label="T.C. / Record Sheet Number and Date" value={form.tcNumberDate} onChange={(value) => setField('tcNumberDate', value)} />
            <Select label="Class into Which Admission is Sought" value={form.classApplyingFor} error={errors.classApplyingFor} options={classes.map((item) => item.name)} onChange={(value) => setField('classApplyingFor', value)} />
            <Input label="Medium of Instruction" value={form.mediumOfInstruction} onChange={(value) => setField('mediumOfInstruction', value)} />
            <Input label="First Language (Part-I)" value={form.firstLanguage} onChange={(value) => setField('firstLanguage', value)} />
            <Input label="Second Language" value={form.secondLanguage} onChange={(value) => setField('secondLanguage', value)} />
            <Input label="Small-pox Protection / Vaccinated / Marked" value={form.smallpoxProtection} onChange={(value) => setField('smallpoxProtection', value)} />
            <Input label="Personal Mark of Identification (i)" value={form.identificationMark1} onChange={(value) => setField('identificationMark1', value)} />
            <Input label="Personal Mark of Identification (ii)" value={form.identificationMark2} onChange={(value) => setField('identificationMark2', value)} />
            <div className="md:col-span-2">
              <TextArea label="Previous School History of the Pupil" value={form.previousSchoolHistory} onChange={(value) => setField('previousSchoolHistory', value)} />
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-4 md:grid-cols-3">
            <FileInput label="Photo" onChange={(file) => setField('photo', file)} />
            <FileInput label="Birth Certificate" onChange={(file) => setField('birthCertificate', file)} />
            <FileInput label="Transfer Certificate / Record Sheet" onChange={(file) => setField('transferCertificate', file)} />
          </div>
        )}
        {step === 4 && (
          <div className="grid gap-4 lg:grid-cols-3">
            <Summary title="Pupil" rows={[['Name', form.fullName], ['DOB', form.dateOfBirth], ['Mother Tongue', form.motherTongue], ['Aadhaar', form.aadhaarNumber || 'N/A'], ['PEN', form.penNumber || 'N/A'], ['Child ID', form.childId || 'N/A']]} />
            <Summary title="Parent / Guardian" rows={[['Name', form.parent.name], ['Cell No.', form.parent.phone], ['Occupation', form.parent.occupation || 'N/A'], ['Mother Name', form.motherName || 'N/A']]} />
            <Summary title="Admission" rows={[['Class Sought', form.classApplyingFor], ['Medium', form.mediumOfInstruction || 'N/A'], ['First Language', form.firstLanguage || 'N/A'], ['Second Language', form.secondLanguage || 'N/A'], ['TC Attached', form.tcRecordAttached || 'N/A']]} />
            {Object.keys(currentErrors).length > 0 && <p className="text-sm text-red-600 lg:col-span-3">Please complete required fields before final submission.</p>}
          </div>
        )}
        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <button className="btn-secondary" disabled={step === 0} onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Back</button>
          <div className="flex flex-wrap gap-3">
            <button className="btn-secondary" onClick={saveDraft}><Save size={16} /> Save Draft</button>
            {step < steps.length - 1 ? (
              <button className="btn-primary" onClick={next}>Next <ArrowRight size={16} /></button>
            ) : (
              <button className="btn-primary" onClick={submit}><Send size={16} /> Submit</button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Input({ label, value, onChange, error, type = 'text' }) {
  return <div><label className="label">{label}</label><input className="field" type={type} value={value || ''} onChange={(e) => onChange(e.target.value)} />{error && <p className="mt-1 text-xs text-red-600">{error}</p>}</div>;
}

function TextArea({ label, value, onChange, error }) {
  return <div><label className="label">{label}</label><textarea className="field min-h-24" value={value || ''} onChange={(e) => onChange(e.target.value)} />{error && <p className="mt-1 text-xs text-red-600">{error}</p>}</div>;
}

function Select({ label, value, onChange, options, error }) {
  return <div><label className="label">{label}</label><select className="field" value={value || ''} onChange={(e) => onChange(e.target.value)}><option value="">Select</option>{options.map((option) => <option key={option}>{option}</option>)}</select>{error && <p className="mt-1 text-xs text-red-600">{error}</p>}</div>;
}

function FileInput({ label, onChange }) {
  return <div><label className="label">{label}</label><input className="field" type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => onChange(e.target.files[0])} /><p className="mt-1 text-xs text-stone-500">JPG, PNG, or PDF up to 5 MB</p></div>;
}

function Summary({ title, rows }) {
  return <div className="rounded-md border border-stone-200 p-4"><h3 className="font-semibold">{title}</h3><dl className="mt-3 space-y-2">{rows.map(([key, value]) => <div className="flex justify-between gap-4 text-sm" key={key}><dt className="text-stone-500">{key}</dt><dd className="text-right font-medium">{value || '-'}</dd></div>)}</dl></div>;
}

function validate(form, step) {
  const errors = {};
  if (step === 0 || step === 4) {
    if (!form.fullName) errors.fullName = 'Pupil name is required';
    if (!form.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
  }
  if (step === 1 || step === 4) {
    if (!form.parent.name) errors.parentName = 'Parent or guardian name is required';
    if (!form.parent.phone) errors.parentPhone = 'Cell number is required';
  }
  if (step === 2 || step === 4) {
    if (!form.classApplyingFor) errors.classApplyingFor = 'Class sought is required';
  }
  return errors;
}

function normalizeDraft(draft) {
  if (!draft) return initialForm;
  return {
    ...initialForm,
    ...draft,
    parent: { ...initialForm.parent, ...(draft.parent || {}) },
    photo: null,
    birthCertificate: null,
    transferCertificate: null
  };
}

function toFormData(form) {
  const data = new FormData();
  for (const [key, value] of Object.entries(form)) {
    if (['photo', 'birthCertificate', 'transferCertificate'].includes(key)) {
      if (value) data.append(key, value);
    } else if (key === 'parent') {
      data.append('parent', JSON.stringify(value));
    } else {
      data.append(key, value || '');
    }
  }
  return data;
}
