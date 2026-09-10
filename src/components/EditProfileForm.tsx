import { useState, useMemo } from "react";

// ─── Configuration ──────────────────────────────────────────
const FORBIDDEN_WORDS = [
  "admin", "administrateur", "moderateur", "modérateur", "support",
  "montres-bastille", "montresbastille", "bastille", "root", "system",
  "null", "undefined", "test", "user", "superuser", "superadmin",
  "fuck", "shit", "merde", "putain", "connard", "salope", "enculé",
  "bitch", "asshole", "nigger", "nazi", "hitler",
];

const PSEUDO_MAX_LENGTH = 20;
const PSEUDO_MIN_LENGTH = 3;
const PASSWORD_MIN_LENGTH = 8;

// ─── Types ──────────────────────────────────────────────────
interface EditProfileFormProps {
  currentUser: {
    nom: string;
    prenom: string;
    email?: string;
    numero?: string;
    pseudo?: string;
  };
  // State bindings from AccountPage
  newEmail: string;
  setNewEmail: (v: string) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  newNumero: string;
  setNewNumero: (v: string) => void;
  newPseudo: string;
  setNewPseudo: (v: string) => void;
  loading: boolean;
  onSubmit: () => void;
}

// ─── Helpers ────────────────────────────────────────────────

/** Returns a password-strength score from 0-4 */
function getPasswordStrength(pw: string): number {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= PASSWORD_MIN_LENGTH) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const strengthLabels = ["", "Faible", "Moyen", "Bon", "Excellent"];
const strengthColors = ["", "#ef4444", "#f59e0b", "#22c55e", "#C9A96E"];

/** Checks if a pseudo contains forbidden words */
function containsForbiddenWord(pseudo: string): string | null {
  const lower = pseudo.toLowerCase().trim();
  for (const word of FORBIDDEN_WORDS) {
    if (lower.includes(word)) return word;
  }
  return null;
}

// ─── Sub-components ─────────────────────────────────────────

function FieldGroup({
  label,
  children,
  error,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  error?: string | null;
  hint?: string | null;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-xs uppercase tracking-[0.2em] text-primary/80 font-sans font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5 mt-1 animate-[fadeSlideIn_0.25s_ease-out]">
          <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-xs text-text-muted/60 mt-1">{hint}</p>
      )}
    </div>
  );
}

const inputBase =
  "w-full bg-[#111111] border border-white/10 text-text-primary placeholder:text-text-subtle/40 p-3.5 rounded-xl font-sans text-sm transition-all duration-300 focus:border-primary/60 focus:outline-none focus:ring-1 focus:ring-primary/20 focus:bg-[#141414] hover:border-white/20";

// ─── Main Component ─────────────────────────────────────────

export default function EditProfileForm({
  currentUser,
  newEmail,
  setNewEmail,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  newNumero,
  setNewNumero,
  newPseudo,
  setNewPseudo,
  loading,
  onSubmit,
}: EditProfileFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Validation ──

  const pseudoError = useMemo(() => {
    if (!newPseudo) return null;
    if (newPseudo.length < PSEUDO_MIN_LENGTH)
      return `Le pseudo doit faire au moins ${PSEUDO_MIN_LENGTH} caractères`;
    if (newPseudo.length > PSEUDO_MAX_LENGTH)
      return `Le pseudo ne doit pas dépasser ${PSEUDO_MAX_LENGTH} caractères`;
    const forbidden = containsForbiddenWord(newPseudo);
    if (forbidden) return `Le mot « ${forbidden} » n'est pas autorisé`;
    if (!/^[a-zA-Z0-9_.-]+$/.test(newPseudo))
      return "Seuls les lettres, chiffres, _, . et - sont autorisés";
    return null;
  }, [newPseudo]);

  const passwordStrength = useMemo(
    () => getPasswordStrength(newPassword),
    [newPassword]
  );

  const passwordError = useMemo(() => {
    if (!newPassword) return null;
    if (newPassword.length < PASSWORD_MIN_LENGTH)
      return `Le mot de passe doit faire au moins ${PASSWORD_MIN_LENGTH} caractères`;
    if (passwordStrength < 2)
      return "Ajoutez une majuscule, un chiffre ou un caractère spécial";
    return null;
  }, [newPassword, passwordStrength]);

  const confirmError = useMemo(() => {
    if (!confirmPassword) return null;
    if (confirmPassword !== newPassword) return "Les mots de passe ne correspondent pas";
    return null;
  }, [confirmPassword, newPassword]);

  const emailError = useMemo(() => {
    if (!newEmail) return null;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) return "Adresse email invalide";
    return null;
  }, [newEmail]);

  const numeroError = useMemo(() => {
    if (!newNumero) return null;
    const cleaned = newNumero.replace(/[\s\-.()]/g, "");
    if (!/^\+?\d{7,15}$/.test(cleaned)) return "Numéro de téléphone invalide";
    return null;
  }, [newNumero]);

  const hasAnyInput =
    newEmail || newPassword || confirmPassword || newNumero || newPseudo;

  const hasErrors =
    !!pseudoError || !!passwordError || !!confirmError || !!emailError || !!numeroError;

  const canSubmit = hasAnyInput && !hasErrors && !loading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) onSubmit();
  };

  // ── Eye toggle icon ──
  const EyeToggle = ({
    show,
    onToggle,
  }: {
    show: boolean;
    onToggle: () => void;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted/40 hover:text-primary transition-colors"
      tabIndex={-1}
      aria-label={show ? "Masquer" : "Afficher"}
    >
      {show ? (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12c1.292 4.338 5.31 7.5 10.066 7.5.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="relative">
      {/* ── Collapsed State: Trigger Button ── */}
      {!isExpanded && (
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="group w-full text-left p-6 sm:p-8 rounded-2xl bg-surface transition-all duration-500 ease-out
                     shadow-[6px_6px_14px_rgba(0,0,0,0.5),-6px_-6px_14px_rgba(255,255,255,0.03)]
                     hover:shadow-[8px_8px_20px_rgba(0,0,0,0.6),-8px_-8px_20px_rgba(255,255,255,0.04)]
                     hover:border-primary/20 border border-transparent"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-lg text-text-primary group-hover:text-primary transition-colors duration-300">
                  Modifier mes informations
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Email, mot de passe, pseudo, téléphone…
                </p>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-text-muted group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </button>
      )}

      {/* ── Expanded State: The Form ── */}
      {isExpanded && (
        <div
          className="rounded-2xl bg-surface border border-white/5 overflow-hidden
                     shadow-[6px_6px_14px_rgba(0,0,0,0.5),-6px_-6px_14px_rgba(255,255,255,0.03)]
                     animate-[expandIn_0.4s_ease-out]"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 pb-0 sm:pb-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </div>
              <div>
                <h3 className="font-serif text-xl text-text-primary">
                  Modifier mes informations
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Remplissez uniquement les champs que vous souhaitez modifier
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-primary hover:bg-white/5 transition-all duration-300"
              aria-label="Fermer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Decorative separator */}
          <div className="mx-6 sm:mx-8 mt-6">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-7">

            {/* ── Identité ── */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-4 rounded-full bg-primary" />
                <span className="text-xs uppercase tracking-[0.2em] text-text-muted font-sans font-medium">
                  Identité
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Pseudo */}
                <FieldGroup
                  label="Pseudo"
                  error={pseudoError}
                  hint={newPseudo ? `${newPseudo.length}/${PSEUDO_MAX_LENGTH} caractères` : `Actuel : ${currentUser.pseudo || "Non défini"}`}
                >
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle/40 text-sm">@</span>
                    <input
                      id="edit-pseudo"
                      type="text"
                      value={newPseudo}
                      onChange={(e) => setNewPseudo(e.target.value)}
                      maxLength={PSEUDO_MAX_LENGTH + 5}
                      className={`${inputBase} pl-8 ${pseudoError ? "!border-red-400/50 focus:!border-red-400/70 focus:!ring-red-400/20" : ""}`}
                      placeholder={currentUser.pseudo || "MonPseudo"}
                    />
                  </div>
                </FieldGroup>

                {/* Email */}
                <FieldGroup
                  label="Email"
                  error={emailError}
                  hint={!newEmail ? `Actuel : ${currentUser.email || "Non défini"}` : null}
                >
                  <input
                    id="edit-email"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className={`${inputBase} ${emailError ? "!border-red-400/50 focus:!border-red-400/70 focus:!ring-red-400/20" : ""}`}
                    placeholder={currentUser.email || "email@exemple.com"}
                  />
                </FieldGroup>
              </div>
            </div>

            {/* ── Téléphone ── */}
            <FieldGroup
              label="Numéro de téléphone"
              error={numeroError}
              hint={!newNumero ? `Actuel : ${currentUser.numero || "Non renseigné"}` : null}
            >
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-subtle/40">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </span>
                <input
                  id="edit-numero"
                  type="tel"
                  value={newNumero}
                  onChange={(e) => setNewNumero(e.target.value)}
                  className={`${inputBase} pl-10 ${numeroError ? "!border-red-400/50 focus:!border-red-400/70 focus:!ring-red-400/20" : ""}`}
                  placeholder={currentUser.numero || "06 12 34 56 78"}
                />
              </div>
            </FieldGroup>

            {/* ── Sécurité ── */}
            <div>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-4 rounded-full bg-primary" />
                <span className="text-xs uppercase tracking-[0.2em] text-text-muted font-sans font-medium">
                  Sécurité
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Password */}
                <FieldGroup label="Nouveau mot de passe" error={passwordError}>
                  <div className="relative">
                    <input
                      id="edit-password"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className={`${inputBase} pr-10 ${passwordError ? "!border-red-400/50 focus:!border-red-400/70 focus:!ring-red-400/20" : ""}`}
                      placeholder="••••••••"
                    />
                    <EyeToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />
                  </div>

                  {/* Strength bar */}
                  {newPassword && (
                    <div className="mt-2 space-y-1.5 animate-[fadeSlideIn_0.25s_ease-out]">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="h-1 flex-1 rounded-full transition-all duration-500"
                            style={{
                              backgroundColor:
                                passwordStrength >= i
                                  ? strengthColors[passwordStrength]
                                  : "rgba(255,255,255,0.06)",
                            }}
                          />
                        ))}
                      </div>
                      <p
                        className="text-xs font-medium transition-colors"
                        style={{ color: strengthColors[passwordStrength] || "#808080" }}
                      >
                        {strengthLabels[passwordStrength]}
                      </p>
                    </div>
                  )}
                </FieldGroup>

                {/* Confirm Password */}
                <FieldGroup label="Confirmer le mot de passe" error={confirmError}>
                  <div className="relative">
                    <input
                      id="edit-confirm-password"
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`${inputBase} pr-10 ${confirmError ? "!border-red-400/50 focus:!border-red-400/70 focus:!ring-red-400/20" : ""}`}
                      placeholder="••••••••"
                    />
                    <EyeToggle show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)} />
                  </div>

                  {/* Match indicator */}
                  {confirmPassword && !confirmError && (
                    <p className="text-xs text-green-400 flex items-center gap-1.5 mt-1 animate-[fadeSlideIn_0.25s_ease-out]">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Les mots de passe correspondent
                    </p>
                  )}
                </FieldGroup>
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="pt-2">
              <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mb-6" />

              <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-white/5 transition-all duration-300 font-sans order-2 sm:order-1"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full sm:w-auto relative px-8 py-3 rounded-xl text-sm font-semibold font-sans
                             transition-all duration-300 overflow-hidden order-1 sm:order-2
                             disabled:opacity-30 disabled:cursor-not-allowed
                             bg-primary text-dark hover:shadow-[0_0_24px_rgba(201,169,110,0.25)]
                             active:scale-[0.97]"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Mise à jour…
                    </span>
                  ) : (
                    "Enregistrer les modifications"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
