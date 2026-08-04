import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, Transaction } from '../types';

interface TransferProps {
  user: UserProfile;
  transactions: Transaction[];
  onBack: () => void;
  onTransferComplete: (amount: number, recipient: string) => void;
}

type DocKey = 'face' | 'id' | 'bill';

const DOCS: { key: DocKey; title: string; hint: string; icon: React.ReactNode }[] = [
  {
    key: 'face',
    title: 'Face verification',
    hint: 'Take a clear selfie in good lighting',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    ),
  },
  {
    key: 'id',
    title: 'Means of identification',
    hint: 'NIN slip, driver’s licence, voter’s card or passport',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm4 3a2 2 0 104 0 2 2 0 00-4 0zm-1 6a3 3 0 016 0M15 10h3M15 14h3" />
    ),
  },
  {
    key: 'bill',
    title: 'Proof of address',
    hint: 'Utility bill issued within the last 3 months',
    icon: (
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    ),
  },
];

const KYC_KEY = 'stanbic_v18_kyc';

// Note: captures are simulated. The live preview is never written to a canvas,
// stored, or uploaded — only a "captured" flag is kept, in memory.
const Transfer: React.FC<TransferProps> = ({ onBack }) => {
  const [captured, setCaptured] = useState<Partial<Record<DocKey, boolean>>>({});
  const [activeDoc, setActiveDoc] = useState<DocKey | null>(null);
  const [camError, setCamError] = useState('');
  const [flash, setFlash] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedAt, setSubmittedAt] = useState<string | null>(() =>
    localStorage.getItem(KYC_KEY),
  );

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const allCaptured = DOCS.every((d) => captured[d.key]);

  // Start the camera when a capture sheet opens; always release it on close.
  useEffect(() => {
    if (!activeDoc) return;
    let cancelled = false;
    setCamError('');

    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: activeDoc === 'face' ? 'user' : 'environment' },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        if (!cancelled) setCamError('Camera unavailable. Check camera permissions and try again.');
      }
    })();

    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    };
  }, [activeDoc]);

  // Simulated shutter: flash, mark the step done, discard the frame.
  const capture = () => {
    if (!activeDoc) return;
    const key = activeDoc;
    setFlash(true);
    setTimeout(() => {
      setCaptured((c) => ({ ...c, [key]: true }));
      setFlash(false);
      setActiveDoc(null);
    }, 220);
  };

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      const stamp = new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
      localStorage.setItem(KYC_KEY, stamp);
      setSubmittedAt(stamp);
      setSubmitting(false);
    }, 1600);
  };

  const header = (
    <header className="bg-white border-b border-gray-200 px-2 h-14 flex items-center gap-1">
      <button onClick={onBack} className="p-2 text-gray-600" aria-label="Back">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-base font-semibold text-gray-900">Transfer</h1>
    </header>
  );

  // ---- Submitted / under review -------------------------------------------
  if (submittedAt) {
    return (
      <div className="min-h-full">
        {header}
        <div className="px-4 py-4 space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-[15px] font-semibold text-gray-900 mt-4">Documents received</h2>
            <p className="text-[13px] text-gray-600 mt-2 leading-relaxed">
              We have received your documents and are currently reviewing them. Please note this can
              take up to <span className="font-semibold text-gray-900">7 business days</span>.
            </p>
            <p className="text-xs text-gray-400 mt-3">Submitted {submittedAt}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-gray-900">Verification status</span>
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
                Under review
              </span>
            </div>
            <div className="mt-3 space-y-2">
              {DOCS.map((d) => (
                <div key={d.key} className="flex items-center gap-2 text-[13px] text-gray-600">
                  <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {d.title}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              Transfers will be enabled on your account once verification is complete. You will be
              notified in the app.
            </p>
          </div>

          <BranchNote />

          <button
            onClick={onBack}
            className="w-full bg-[#0033a0] text-white text-sm font-semibold py-3 rounded-lg active:bg-[#002880]"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  // ---- Document checklist --------------------------------------------------
  return (
    <div className="min-h-full">
      {header}

      <div className="px-4 py-4 space-y-4">
        <div className="bg-white border border-gray-200 rounded-xl px-4 py-4">
          <h2 className="text-[15px] font-semibold text-gray-900">Verification required</h2>
          <p className="text-[13px] text-gray-600 mt-1.5 leading-relaxed">
            To enable transfers on your account, we need to verify your identity. Please capture the
            three items below.
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
          {DOCS.map((d) => {
            const done = Boolean(captured[d.key]);
            return (
              <button
                key={d.key}
                onClick={() => setActiveDoc(d.key)}
                className="w-full px-4 py-3.5 flex items-center gap-3 text-left active:bg-gray-50"
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    done ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
                    {d.icon}
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium text-gray-900">{d.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {done ? 'Captured · tap to retake' : d.hint}
                  </p>
                </div>
                {done ? (
                  <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.4}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-[11px] font-semibold text-[#0033a0] shrink-0">Capture</span>
                )}
              </button>
            );
          })}
        </div>

        <button
          onClick={submit}
          disabled={!allCaptured || submitting}
          className="w-full bg-[#0033a0] disabled:bg-gray-300 text-white text-sm font-semibold py-3 rounded-lg active:bg-[#002880] flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Submitting
            </>
          ) : (
            'Submit for verification'
          )}
        </button>

        <BranchNote />
      </div>

      {/* Camera sheet */}
      {activeDoc && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="h-14 px-2 flex items-center justify-between text-white shrink-0">
            <button onClick={() => setActiveDoc(null)} className="p-2" aria-label="Close">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <span className="text-sm font-medium">
              {DOCS.find((d) => d.key === activeDoc)?.title}
            </span>
            <div className="w-9" />
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${activeDoc === 'face' ? 'scale-x-[-1]' : ''}`}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {activeDoc === 'face' ? (
                <div className="w-56 h-72 border-2 border-white/70 rounded-[50%]" />
              ) : (
                <div className="w-[85%] aspect-[1.586] border-2 border-white/70 rounded-xl" />
              )}
            </div>
            {flash && <div className="absolute inset-0 bg-white" />}
            {camError && (
              <div className="absolute inset-x-6 bottom-6 bg-white rounded-xl p-4 text-center">
                <p className="text-[13px] text-gray-700">{camError}</p>
                <button
                  onClick={() => setActiveDoc(null)}
                  className="mt-3 w-full bg-[#0033a0] text-white text-sm font-semibold py-2.5 rounded-lg"
                >
                  Close
                </button>
              </div>
            )}
          </div>

          <div className="shrink-0 px-6 pb-8 pt-4 text-center">
            <p className="text-white/70 text-xs mb-4">
              {activeDoc === 'face'
                ? 'Position your face inside the oval'
                : 'Fit the document inside the frame'}
            </p>
            <button
              onClick={capture}
              disabled={Boolean(camError)}
              className="w-16 h-16 rounded-full bg-white border-4 border-white/40 mx-auto block disabled:opacity-40 active:scale-95 transition-transform"
              aria-label="Capture"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const BranchNote: React.FC = () => (
  <div className="bg-white border border-gray-200 rounded-xl px-4 py-4">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#0033a0] flex items-center justify-center shrink-0">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11m16-11v11M8 14v3m4-3v3m4-3v3" />
        </svg>
      </div>
      <div>
        <p className="text-[13px] font-medium text-gray-900">Prefer to visit a branch?</p>
        <p className="text-xs text-gray-600 mt-1 leading-relaxed">
          You can complete this verification at any Stanbic IBTC branch. Bring your means of
          identification and a recent utility bill. The process and timeline are the same as
          completing it in the app.
        </p>
      </div>
    </div>
  </div>
);

export default Transfer;
