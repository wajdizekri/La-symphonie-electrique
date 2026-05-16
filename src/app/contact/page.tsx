'use client';

import Navbar from '@/components/Navbar';
import { submitRequest } from '@/lib/actions';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, Camera, X } from 'lucide-react';

const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024;

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFilesPicked = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files ?? []);
    setError(null);
    const valid: File[] = [];
    for (const f of picked) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) {
        setError(`"${f.name}" : seuls JPEG, PNG et WebP sont acceptés.`);
        continue;
      }
      if (f.size > MAX_BYTES) {
        setError(`"${f.name}" dépasse 5 Mo.`);
        continue;
      }
      valid.push(f);
    }
    const next = [...files, ...valid].slice(0, MAX_FILES);
    setFiles(next);
    if (e.target) e.target.value = '';
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    // Replace whatever the native input has with our controlled list
    formData.delete('images');
    files.forEach(f => formData.append('images', f));

    const result = await submitRequest(formData);

    if (result.success) {
      setSubmitted(true);
      setFiles([]);
    } else {
      setError(result.error || 'Something went wrong');
    }
    setIsSubmitting(false);
  }

  return (
    <main>
      <section className="section">
        <div className="container" style={{ maxWidth: '800px' }}>
          <div className="text-center" style={{ marginBottom: '40px' }}>
            <h1 className="text-gold">Demander un Devis</h1>
            <p>Remplissez le formulaire ci-dessous et nous vous répondrons sous 48h.</p>
          </div>

          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card text-center"
              style={{ padding: '60px' }}
            >
              <CheckCircle size={64} className="text-gold" style={{ margin: '0 auto 20px' }} />
              <h2 className="text-gold">Merci !</h2>
              <p>Votre demande a bien été reçue. Notre équipe vous contactera très prochainement.</p>
              <button onClick={() => setSubmitted(false)} className="btn btn-secondary" style={{ marginTop: '20px' }}>
                Envoyer une autre demande
              </button>
            </motion.div>
          ) : (
            <div className="card">
              <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
                {/* Honeypot anti-bot — invisible pour les humains */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
                />
                <div className="grid grid-2">
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <label htmlFor="name">Nom Complet</label>
                    <input type="text" id="name" name="name" required className="form-input" placeholder="Jean Dupont" />
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" required className="form-input" placeholder="jean@example.com" />
                  </div>
                </div>

                <div className="grid grid-2">
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <label htmlFor="phone">Téléphone</label>
                    <input type="tel" id="phone" name="phone" required className="form-input" placeholder="+33 6 00 00 00 00" />
                  </div>
                  <div style={{ display: 'grid', gap: '8px' }}>
                    <label htmlFor="serviceType">Type de Service</label>
                    <select id="serviceType" name="serviceType" required className="form-input">
                      <option value="electricite">Électricité</option>
                      <option value="fibre">Fibre Optique</option>
                      <option value="mobilite">Mobilité Électrique (IRVE)</option>
                      <option value="vmc">VMC</option>
                      <option value="portail">Portail Automatique</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '8px' }}>
                  <label htmlFor="description">Détails de votre projet</label>
                  <textarea id="description" name="description" required className="form-input" rows={5} placeholder="Décrivez votre besoin..."></textarea>
                </div>

                <div style={{ display: 'grid', gap: '10px' }}>
                  <label>
                    Photos (facultatif) — <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>jusqu&apos;à {MAX_FILES} images, 5 Mo max chacune</span>
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    name="images"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={onFilesPicked}
                    style={{ display: 'none' }}
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={files.length >= MAX_FILES}
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
                  >
                    <Camera size={18} />
                    {files.length === 0
                      ? 'Ajouter une photo de la panne ou des lieux'
                      : files.length >= MAX_FILES
                      ? `Limite atteinte (${MAX_FILES}/${MAX_FILES})`
                      : `Ajouter une autre photo (${files.length}/${MAX_FILES})`}
                  </button>

                  {files.length > 0 && (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                      gap: '10px',
                      marginTop: '6px',
                    }}>
                      {files.map((f, i) => {
                        const url = URL.createObjectURL(f);
                        return (
                          <div key={i} style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                            <img
                              src={url}
                              alt={f.name}
                              style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
                              onLoad={() => URL.revokeObjectURL(url)}
                            />
                            <button
                              type="button"
                              onClick={() => removeFile(i)}
                              aria-label="Supprimer cette photo"
                              style={{
                                position: 'absolute',
                                top: '4px',
                                right: '4px',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                background: 'rgba(0,0,0,0.7)',
                                color: 'white',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <X size={14} />
                            </button>
                            <div style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              fontSize: '0.7rem',
                              padding: '4px 6px',
                              background: 'rgba(0,0,0,0.6)',
                              color: 'white',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}>
                              {(f.size / 1024).toFixed(0)} Ko
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {error && <p style={{ color: 'var(--error)' }}>{error}</p>}

                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ marginTop: '10px', width: '100%' }}>
                  {isSubmitting ? 'Envoi en cours...' : <><Send size={18} /> Envoyer la Demande</>}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        .form-input {
          padding: 12px;
          border-radius: var(--radius-md);
          background-color: var(--bg-primary);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-family: inherit;
          width: 100%;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 2px rgba(250, 204, 21, 0.1);
        }
        label {
          font-weight: 600;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }
      `}</style>
    </main>
  );
}
