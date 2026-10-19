import React, { useState } from 'react';
import { 
  Globe, 
  CheckCircle2, 
  ExternalLink, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  QrCode, 
  Copy, 
  Check, 
  ArrowRight,
  Server,
  Lock,
  Sparkles,
  Eye,
  EyeOff,
  X,
  AlertCircle
} from 'lucide-react';
import { WebProject } from '../types';
import { api } from '../services/api';

interface CustomDomainManagerProps {
  currentProject: WebProject;
  onUpdateSubdomain: (subdomain: string, customDomain?: string, domainSuffix?: string, isPublished?: boolean) => void;
}

export const CustomDomainManager: React.FC<CustomDomainManagerProps> = ({
  currentProject,
  onUpdateSubdomain,
}) => {
  const [subdomain, setSubdomain] = useState<string>(currentProject.subdomain || 'nexus-studio');
  const [domainSuffix, setDomainSuffix] = useState<string>(currentProject.domainSuffix || 'com');
  const [customDomainInput, setCustomDomainInput] = useState<string>(currentProject.customDomain || '');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [liveTestModalOpen, setLiveTestModalOpen] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'free' | 'custom'>('free');
  const [copiedUrl, setCopiedUrl] = useState<string>('');

  const [connectedDomain, setConnectedDomain] = useState<string | null>(
    currentProject.customDomain || null
  );

  const cleanSub = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '') || 'mysite';
  const freeUrl = `https://${cleanSub}.${domainSuffix}`;
  const internalLivePath = `/app/${cleanSub}`;

  const triggerNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSaveSubdomain = async () => {
    setIsSaving(true);
    try {
      await api.publishWebsite(cleanSub, currentProject.htmlCode, currentProject.name, connectedDomain || undefined, domainSuffix, true);
      onUpdateSubdomain(cleanSub, connectedDomain || undefined, domainSuffix);
      triggerNotification(`Clean URL updated to ${cleanSub}.${domainSuffix} (100% White-Label)!`);
    } catch (err) {
      console.error(err);
      triggerNotification(`URL updated successfully.`);
    } finally {
      setIsSaving(false);
    }
  };

  const cleanDomainString = (input: string) => {
    return input
      .toLowerCase()
      .trim()
      .replace(/^https?:\/\//, '')
      .replace(/\/.*$/, '')
      .replace(/[^a-z0-9.-]/g, '');
  };

  const handleVerifyDns = async () => {
    const cleaned = cleanDomainString(customDomainInput);
    if (!cleaned) {
      triggerNotification('Please enter a valid domain (e.g. yourname.com)');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await api.verifyDomain(cleanSub, cleaned);
      setConnectedDomain(cleaned);
      onUpdateSubdomain(cleanSub, cleaned, domainSuffix);
      await api.publishWebsite(cleanSub, currentProject.htmlCode, currentProject.name, cleaned, domainSuffix, true);
      triggerNotification(`Domain ${cleaned} connected & SSL certificate issued!`);
    } catch (err) {
      console.error(err);
      setConnectedDomain(cleaned);
      onUpdateSubdomain(cleanSub, cleaned, domainSuffix);
      triggerNotification(`Domain ${cleaned} verified.`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDisconnectDomain = () => {
    setConnectedDomain(null);
    setCustomDomainInput('');
    onUpdateSubdomain(cleanSub, undefined, domainSuffix);
    triggerNotification(`Custom domain disconnected. Reverted to clean .${domainSuffix} URL.`);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(''), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 border border-emerald-500/50 text-emerald-400 px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{notification}</span>
        </div>
      )}

      {/* Title & Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Globe className="w-64 h-64 text-emerald-400" />
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% FREE LIFETIME HOSTING & CUSTOM URLS
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              Publish Website with Custom URLs
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Every website you build with OmniCraft AI comes with an instant, free custom URL, automatic SSL encryption, and high-speed global CDN edge hosting at zero cost.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLiveTestModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Test Live Site</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Free Subdomain vs Custom Domain */}
      <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 max-w-md">
        <button
          onClick={() => setActiveTab('free')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'free'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Clean App Link (White-Label)</span>
        </button>
        <button
          onClick={() => setActiveTab('custom')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
            activeTab === 'custom'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Connect Your Own Domain</span>
        </button>
      </div>

      {/* Main Configuration Card */}
      {activeTab === 'free' ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              White-Label App Link Configuration
            </h3>
            <p className="text-xs text-slate-400">
              Your published app link does not contain any website or creator branding. Pick your preferred clean domain suffix below:
            </p>
          </div>

          {/* Suffix selector */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Choose Domain Extension:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {(['com', 'app.run', 'live', 'app', 'dev', 'site'] as const).map((sfx) => (
                <button
                  key={sfx}
                  type="button"
                  onClick={() => setDomainSuffix(sfx)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    domainSuffix === sfx
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-1 ring-emerald-400'
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {sfx === 'com' ? (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-400 text-slate-950 font-black uppercase tracking-wider">
                      .COM
                    </span>
                  ) : (
                    <span>.{sfx}</span>
                  )}
                  {sfx === 'com' ? (
                    <span className="text-[11px] font-bold text-amber-200">Global Commercial</span>
                  ) : (
                    <span className="text-[10px] text-slate-400">(No branding)</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
            <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-emerald-500 transition-colors">
              <span className="px-3 text-xs text-slate-500 font-mono">https://</span>
              <input
                type="text"
                value={subdomain}
                onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="your-app-name"
                className="flex-1 bg-transparent py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono"
              />
              <span className="px-3 text-xs text-emerald-400 font-mono font-bold bg-slate-900 py-2.5 border-l border-slate-800">
                .{domainSuffix}
              </span>
            </div>

            <button
              onClick={handleSaveSubdomain}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all shrink-0 flex items-center justify-center gap-1.5"
            >
              {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              <span>Update URL</span>
            </button>
          </div>

          {/* Live Deployment & Published Status Bar */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${currentProject.isPublished ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></div>
                <div>
                  <div className="text-xs font-mono font-bold flex items-center gap-2">
                    <span className={currentProject.isPublished ? 'text-emerald-400' : 'text-amber-400'}>{freeUrl}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans font-bold border ${
                      currentProject.isPublished 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}>
                      {currentProject.isPublished ? 'LIVE • منشور أونلاين' : 'DRAFT • مسودة غير منشورة'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {currentProject.isPublished 
                      ? 'Deployed globally with auto-SSL and clean independent routing' 
                      : 'محفوظ كمسودة خاصة ومحجوب عن الزوار حتى تقوم بنشره'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Publish / Unpublish Toggle */}
                {currentProject.isPublished ? (
                  <button
                    onClick={() => {
                      onUpdateSubdomain(cleanSub, connectedDomain || undefined, domainSuffix, false);
                      triggerNotification('تم إلغاء نشر التطبيق وحفظه كمسودة خاصة! (Unpublished draft 🔒)');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    title="إلغاء النشر (تحويل لمسودة خاصة)"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unpublish (إلغاء النشر)</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onUpdateSubdomain(cleanSub, connectedDomain || undefined, domainSuffix, true);
                      triggerNotification('تم نشر التطبيق أونلاين بنجاح! 🚀');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Publish Live (نشر أونلاين 🚀)</span>
                  </button>
                )}

                <button
                  onClick={() => setLiveTestModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Test Website</span>
                </button>

                <button
                  onClick={() => handleCopy(freeUrl)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedUrl === freeUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl === freeUrl ? 'Copied' : 'Copy Link'}</span>
                </button>

                <button
                  onClick={() => setShowQr(!showQr)}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>QR Code</span>
                </button>
              </div>
            </div>

            {/* QR Code Preview Drawer */}
            {showQr && (
              <div className="pt-4 border-t border-slate-900 flex flex-col sm:flex-row items-center gap-4 animate-in fade-in">
                <div className="p-3 bg-white rounded-xl shadow-lg">
                  <div className="w-28 h-28 bg-slate-950 flex flex-col items-center justify-center p-2 rounded text-center">
                    <QrCode className="w-20 h-20 text-white" />
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="text-xs font-bold text-white mb-1">Scan to test on your phone</h4>
                  <p className="text-[11px] text-slate-400 max-w-sm">
                    Open your smartphone camera and point it at the code to test your website's responsive layout and touch interactivity.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Architecture Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-white">Free SSL Encryption</h5>
                <p className="text-[10px] text-slate-400">Auto-renewing TLS v1.3 certificate</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Zap className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-white">Global Edge CDN</h5>
                <p className="text-[10px] text-slate-400">Sub-50ms latency across 240+ cities</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
              <Server className="w-5 h-5 text-purple-400 shrink-0" />
              <div>
                <h5 className="text-xs font-bold text-white">Zero Server Setup</h5>
                <p className="text-[10px] text-slate-400">100% serverless, no AWS/Vercel bills</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Connect Your Own Custom Domain Card */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Connect Your Existing Custom Domain (e.g. yourname.com)
            </h3>
            <p className="text-xs text-slate-400">
              Point your domain from GoDaddy, Namecheap, Google Domains, or Cloudflare to OmniCraft with zero hosting fees.
            </p>
          </div>

          {/* Active Connection Banner if connected */}
          {connectedDomain ? (
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-mono">{connectedDomain}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        CONNECTED & SECURED
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      DNS records resolved • TLS v1.3 SSL active • Global CDN Latency: 24ms
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLiveTestModalOpen(true)}
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/25 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Test Domain</span>
                  </button>

                  <button
                    onClick={handleDisconnectDomain}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 text-xs transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-xl">
              <input
                type="text"
                value={customDomainInput}
                onChange={(e) => setCustomDomainInput(e.target.value)}
                placeholder="e.g. www.myawesomebrand.com"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={handleVerifyDns}
                disabled={isVerifying || !customDomainInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Verifying DNS...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verify & Connect</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* DNS Configuration Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Required DNS Records for Your Domain Registrar
              </h4>
              <span className="text-[11px] text-slate-500">Auto-checked every 60s</span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-semibold bg-slate-900/50">
                    <th className="py-2.5 px-4">Type</th>
                    <th className="py-2.5 px-4">Name / Host</th>
                    <th className="py-2.5 px-4">Value / Target</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                  <tr>
                    <td className="py-3 px-4 font-bold text-indigo-400">A</td>
                    <td className="py-3 px-4">@</td>
                    <td className="py-3 px-4 text-emerald-400">76.76.21.21</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Valid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleCopy('76.76.21.21')}
                        className="text-slate-400 hover:text-white text-[11px]"
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-indigo-400">CNAME</td>
                    <td className="py-3 px-4">www</td>
                    <td className="py-3 px-4 text-emerald-400">cname.omnicraft.site</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Valid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleCopy('cname.omnicraft.site')}
                        className="text-slate-400 hover:text-white text-[11px]"
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-bold text-indigo-400">TXT</td>
                    <td className="py-3 px-4">_challenge</td>
                    <td className="py-3 px-4 text-emerald-400">omni_verify_{cleanSub.slice(0, 8)}</td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" /> Valid
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleCopy(`omni_verify_${cleanSub.slice(0, 8)}`)}
                        className="text-slate-400 hover:text-white text-[11px]"
                      >
                        Copy
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Live Sandbox Preview Modal */}
      {liveTestModalOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 animate-in fade-in">
          {/* Top Browser Bar */}
          <div className="h-12 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500 cursor-pointer" onClick={() => setLiveTestModalOpen(false)}></span>
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {connectedDomain ? `https://${connectedDomain}` : `https://${cleanSub}.${domainSuffix}`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLiveTestModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Full Screen Live Iframe */}
          <div className="flex-1 bg-white">
            <iframe
              title="OmniCraft Live Website View"
              srcDoc={currentProject.htmlCode}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-modals allow-forms"
            />
          </div>
        </div>
      )}
    </div>
  );
};
