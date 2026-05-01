import cloudinary from '../config/cloudinary.js';

const SIGNED_URL_TTL_SECONDS = 5 * 60;

export function buildStoredDocument(uploadResult, file) {
  return {
    publicId: uploadResult.public_id,
    resourceType: uploadResult.resource_type,
    format: uploadResult.format,
    originalName: file.originalname,
    bytes: uploadResult.bytes,
    deliveryType: uploadResult.type || 'authenticated',
    uploadedAt: new Date().toISOString()
  };
}

export function buildSignedDocumentUrl(document) {
  if (!document) return '';
  if (typeof document === 'string') return document;
  if (!document.publicId) return '';

  return cloudinary.url(document.publicId, {
    secure: true,
    sign_url: true,
    type: document.deliveryType || 'authenticated',
    resource_type: document.resourceType || 'image',
    expires_at: Math.floor(Date.now() / 1000) + SIGNED_URL_TTL_SECONDS
  });
}

export function stripTransientDocumentFields(document) {
  if (!document || typeof document === 'string') return document;
  const { publicId, resourceType, format, originalName, bytes, deliveryType, uploadedAt } = document;
  return { publicId, resourceType, format, originalName, bytes, deliveryType, uploadedAt };
}
