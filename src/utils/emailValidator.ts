// Comprehensive Real vs Fake / Disposable Email Validator

export const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
  'fake.com', 'test.com', 'example.com', 'yopmail.com', 'trashmail.com',
  'sharklasers.com', 'dispostable.com', 'throwawaymail.com', 'nada.ltd',
  'getnada.com', 'inboxkitten.com', 'crazymailing.com', 'mohmal.com',
  'burnermail.io', 'temp-mail.org', 'fakemailgenerator.com', 'generator.email',
  'mytemp.email', 'trashmail.net', 'maildrop.cc', 'disposablemail.com',
  'getairmail.com', 'mytempemail.com', 'armyspy.com', 'cuvox.de', 'dayrep.com',
  'einrot.com', 'fleckens.hu', 'gustr.com', 'jourrapide.com', 'rhyta.com',
  'superrito.com', 'teleworm.us', 'crazymailing.com', 'fakemail.net',
  'emailfake.com', 'emailondeck.com', 'minutemail.com', 'trashmail.me',
  'fakeinbox.com', 'temp-mail.io', 'tempmailo.com', '10minutemail.net',
  'mohmal.im', 'fakemail.com', 'tempr.email', 'discard.email', 'dropmail.me',
  'generator.email', 'boun.cr', 'throwaway.email', 'disposable.email'
]);

export const DUMMY_PREFIXES = new Set([
  'test', 'fake', 'asdf', 'asdfgh', 'qwerty', '123', '1234', '12345', '123456',
  'abc', 'admin', 'user', 'aaaa', 'bbbb', 'cccc', 'nobody', 'noone', 'null',
  'undefined', 'dummy', 'spam', 'temp', 'noreply', 'no-reply'
]);

export interface EmailValidationResult {
  isValid: boolean;
  error?: string;
  isFakeOrDisposable?: boolean;
}

export function validateRealEmail(rawEmail: string, isRTL: boolean = true): EmailValidationResult {
  if (!rawEmail || typeof rawEmail !== 'string') {
    return {
      isValid: false,
      error: isRTL ? 'يرجى إدخال البريد الإلكتروني.' : 'Please enter an email address.'
    };
  }

  const email = rawEmail.trim().toLowerCase();

  // Basic RFC 5322 regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!regex.test(email)) {
    return {
      isValid: false,
      isFakeOrDisposable: true,
      error: isRTL 
        ? '❌ صيغة البريد الإلكتروني غير صحيحة أو غير حقيقية! يرجى إدخال إيميل حقيقي وصحيح.' 
        : '❌ Invalid or fake email format. Please enter a valid, real email.'
    };
  }

  const parts = email.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: isRTL ? '❌ صيغة البريد غير صحيحة.' : '❌ Invalid email.' };
  }

  const [username, domain] = parts;

  // Check username length & dummy patterns
  if (username.length < 3) {
    return {
      isValid: false,
      isFakeOrDisposable: true,
      error: isRTL 
        ? '❌ هذا الإيميل مزور أو قصير جداً! يرجى كتابة إيميل حقيقي.' 
        : '❌ This email is fake or too short. Please enter a real email.'
    };
  }

  if (
    DUMMY_PREFIXES.has(username) || 
    /^([a-z0-9])\1{3,}$/.test(username) || 
    /^[0-9]+$/.test(username) ||
    username.startsWith('asdf') ||
    username.startsWith('test') ||
    username.startsWith('fake')
  ) {
    return {
      isValid: false,
      isFakeOrDisposable: true,
      error: isRTL 
        ? '❌ هذا الإيميل مزور أو غير حقيقي! يرجى إدخال إيميل حقيقي لتتمكن من إنشاء الحساب واستلام كود التحقق.' 
        : '❌ This email address is fake or not real! Please enter a real email to create your account and receive the verification code.'
    };
  }

  // Check domain
  if (
    DISPOSABLE_DOMAINS.has(domain) || 
    domain.includes('fake') || 
    domain.includes('disposable') || 
    domain.includes('temp') || 
    domain.includes('trash') ||
    domain.includes('dummy') ||
    domain.includes('throwaway') ||
    domain.includes('mohmal')
  ) {
    return {
      isValid: false,
      isFakeOrDisposable: true,
      error: isRTL 
        ? '❌ هذا الإيميل مزور أو غير حقيقي! المواقع الوهمية (Temp Mail) محظورة تماماً. يرجى إدخال إيميل حقيقي لتتمكن من إنشاء الحساب.' 
        : '❌ This email is fake or temporary! Disposable email addresses are blocked. Please use your real email.'
    };
  }

  // Check domain TLD
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  if (!tld || tld.length < 2) {
    return {
      isValid: false,
      isFakeOrDisposable: true,
      error: isRTL ? '❌ نطاق البريد غير مكتمل أو مزور (مثل .com أو .net).' : '❌ Incomplete or invalid domain extension.'
    };
  }

  // Check common typos
  const invalidTlds = ['con', 'cm', 'cpm', 'cmo', 'coom', 'comm'];
  if (invalidTlds.includes(tld)) {
    return {
      isValid: false,
      error: isRTL 
        ? `❌ خطأ في كتابة النطاق (.${tld})! هل تقصد (.com)؟ يرجى تصحيحه.` 
        : `❌ Typo in domain (.${tld}). Did you mean (.com)?`
    };
  }

  return { isValid: true };
}
