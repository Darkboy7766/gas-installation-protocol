import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Printer, 
  Save, 
  ChevronRight, 
  ChevronLeft, 
  Car, 
  User, 
  Wrench, 
  Settings,
  CheckCircle2,
  AlertCircle,
  Download,
  Github,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { GasProtocolData, INITIAL_COMPONENTS, GasComponent, COMPONENT_OPTIONS } from './types';

const today = new Date().toISOString().split('T')[0];

const getInitialData = (): GasProtocolData => {
  const lastNum = typeof window !== 'undefined' ? localStorage.getItem('lastProtocolNumber') : '';
  return {
    protocolNumber: lastNum || '',
    protocolDate: today,
    installerName: 'Аутогаз-Варна ООД',
    installerId: '202347382',
    installerAddress: 'Варна бул.Хр.Смирненски',
    vehicleRegNo: '',
    vehicleMake: '',
    vehicleModel: '',
    installationDate: today,
    installationType: 'ВНГ',
    installationMake: '',
    installationModel: '',
    components: INITIAL_COMPONENTS,
    issuerFullName: 'Аутогаз-Варна ООД',
    issueDate: today,
    issuePlace: 'Варна',
  };
};

export default function App() {
  const [data, setData] = useState<GasProtocolData>(getInitialData);
  const [view, setView] = useState<'edit' | 'print'>('edit');
  const [activeStep, setActiveStep] = useState(0);
  const [githubToken, setGithubToken] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedUrl, setPublishedUrl] = useState<string | null>(null);

  useEffect(() => {
    const dateStr = data.protocolDate ? `_${data.protocolDate}` : '';
    const numStr = data.protocolNumber ? `_No${data.protocolNumber}` : '';
    document.title = `Protokol_Gazova_Uredba${numStr}${dateStr}`;
  }, [data.protocolNumber, data.protocolDate]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        setGithubToken(event.data.token);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGithubConnect = async () => {
    try {
      const response = await fetch('/api/auth/github/url');
      const { url } = await response.json();
      window.open(url, 'github_oauth', 'width=600,height=700');
    } catch (error) {
      console.error('Failed to get GitHub auth URL:', error);
      alert('Моля конфигурирайте GITHUB_CLIENT_ID в настройките.');
    }
  };

  const handleGithubPublish = async () => {
    if (!githubToken) return;
    setIsPublishing(true);
    try {
      const repoName = `gas-protocol-app-${Math.floor(Math.random() * 10000)}`;
      const response = await fetch('/api/github/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: githubToken, repoName }),
      });
      const result = await response.json();
      if (result.success) {
        setPublishedUrl(result.url);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Failed to publish to GitHub:', error);
      alert(`Грешка при качване: ${error.message}`);
    } finally {
      setIsPublishing(false);
    }
  };

  const steps = [
    { title: 'Обща информация', icon: <FileText className="w-5 h-5" /> },
    { title: 'Автомобил', icon: <Car className="w-5 h-5" /> },
    { title: 'Уредба и Компоненти', icon: <Settings className="w-5 h-5" /> },
    { title: 'Финализиране', icon: <CheckCircle2 className="w-5 h-5" /> },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => {
      const newData = { ...prev, [name]: value };
      // Sync dates if protocol date changes
      if (name === 'protocolDate') {
        newData.installationDate = value;
        newData.issueDate = value;
      }
      return newData;
    });
  };

  const handleComponentChange = (index: number, field: keyof GasComponent, value: string) => {
    const newComponents = [...data.components];
    newComponents[index] = { ...newComponents[index], [field]: value };
    setData(prev => ({ ...prev, components: newComponents }));
  };

  const filteredComponents = data.components;

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="min-h-screen print:min-h-0 bg-[#F8F9FA] text-[#1A1A1A] font-sans selection:bg-blue-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Протокол за Газова Уредба</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {!githubToken ? (
              <button
                type="button"
                onClick={handleGithubConnect}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all"
              >
                <Github className="w-4 h-4" />
                <span className="hidden md:inline">Свържи с GitHub</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGithubPublish}
                disabled={isPublishing}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-all disabled:opacity-50"
              >
                {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
                {isPublishing ? 'Качване...' : 'Качи в GitHub'}
              </button>
            )}

            <button
              type="button"
              onClick={() => setView(view === 'edit' ? 'print' : 'edit')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                view === 'print' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {view === 'edit' ? <Printer className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {view === 'edit' ? 'Преглед и Печат' : 'Обратно към редакция'}
            </button>
            
            {view === 'print' && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (data.protocolNumber) {
                    localStorage.setItem('lastProtocolNumber', data.protocolNumber);
                  }
                  window.focus();
                  setTimeout(() => {
                    window.print();
                  }, 500);
                }}
                className="relative z-50 bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200 cursor-pointer active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Печат / PDF
              </button>
            )}
          </div>
        </div>
        {view === 'print' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-center text-xs text-gray-400 print:hidden">
            Ако бутонът не реагира, натиснете <kbd className="px-1 py-0.5 rounded bg-gray-100 border border-gray-300 font-sans">Ctrl + P</kbd> за печат
          </div>
        )}
      </header>

      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${view === 'print' ? 'print:p-0 print:m-0' : ''}`}>
        {view === 'edit' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:col-span-3 space-y-1">
              {steps.map((step, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveStep(idx)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    activeStep === idx 
                    ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
                    : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <span className={`${activeStep === idx ? 'text-blue-600' : 'text-gray-400'}`}>
                    {step.icon}
                  </span>
                  {step.title}
                  {activeStep > idx && <CheckCircle2 className="w-4 h-4 ml-auto text-green-500" />}
                </button>
              ))}
            </div>

            {/* Form Content */}
            <div className="lg:col-span-9">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900">{steps[activeStep].title}</h2>
                  <p className="text-gray-500 mt-1">Попълнете необходимата информация за документа.</p>
                </div>

                {activeStep === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <FormField 
                      label="Протокол №" 
                      name="protocolNumber" 
                      value={data.protocolNumber} 
                      onChange={handleInputChange} 
                      placeholder={localStorage.getItem('lastProtocolNumber') ? `Предишен: ${localStorage.getItem('lastProtocolNumber')}` : "Напр. 123"} 
                    />
                    <FormField label="Дата на протокола" name="protocolDate" value={data.protocolDate} onChange={handleInputChange} type="date" />
                    <div className="sm:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">Данни на извършителя (Автоматично)</h4>
                      <p className="text-sm text-gray-600">Наименование: {data.installerName}</p>
                      <p className="text-sm text-gray-600">Булстат: {data.installerId}</p>
                      <p className="text-sm text-gray-600">Адрес: {data.installerAddress} </p>
                      <p className="text-sm text-gray-600">Тел: 052501219</p>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Рег. №" name="vehicleRegNo" value={data.vehicleRegNo} onChange={handleInputChange} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <FormField label="Марка" name="vehicleMake" value={data.vehicleMake} onChange={handleInputChange} />
                      <FormField label="Модел" name="vehicleModel" value={data.vehicleModel} onChange={handleInputChange} />
                    </div>
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="space-y-8">
                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                      <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        Параметри на уредбата
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-blue-800 mb-2">Вид уредба</label>
                          <select 
                            name="installationType" 
                            value={data.installationType} 
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          >
                            <option value="ВНГ">ВНГ (LPG)</option>
                            <option value="СПГ">СПГ (CNG)</option>
                          </select>
                        </div>
                        
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                        <FormField label="Марка на уредбата" name="installationMake" value={data.installationMake} onChange={handleInputChange} />
                        <FormField label="Модел на уредбата" name="installationModel" value={data.installationModel} onChange={handleInputChange} />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Списък на компонентите</h3>
                      <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 w-12">№</th>
                              <th className="px-4 py-3">Компонент</th>
                              <th className="px-4 py-3">Марка</th>
                              <th className="px-4 py-3">Номер на одобряване</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {data.components.map((comp, idx) => (
                              <tr key={comp.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                                <td className="px-4 py-3 font-medium text-gray-700">
                                  {comp.name}
                                </td>
                                <td className="px-4 py-3">
                                  {(() => {
                                    const options = Object.keys(COMPONENT_OPTIONS[comp.name] || {});
                                    const isCustom = comp.make !== '' && !options.includes(comp.make);
                                    
                                    return (
                                      <>
                                        <select 
                                          value={isCustom ? 'other' : comp.make} 
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const newComponents = [...data.components];
                                            newComponents[idx] = { 
                                              ...newComponents[idx], 
                                              make: val === 'other' ? ' ' : val, // Use a space as a temporary "other" value
                                              approvalNumber: '' 
                                            };
                                            setData(prev => ({ ...prev, components: newComponents }));
                                          }}
                                          className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none bg-white"
                                        >
                                          <option value="">Изберете марка</option>
                                          {options.map(make => (
                                            <option key={make} value={make}>{make}</option>
                                          ))}
                                          <option value="other">Друга...</option>
                                        </select>
                                        {(isCustom || comp.make === ' ') && (
                                          <input 
                                            type="text" 
                                            value={comp.make === ' ' ? '' : comp.make}
                                            placeholder="Въведете марка"
                                            className="w-full mt-1 px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                            onChange={(e) => handleComponentChange(idx, 'make', e.target.value)}
                                            autoFocus
                                          />
                                        )}
                                      </>
                                    );
                                  })()}
                                </td>
                                <td className="px-4 py-3">
                                  {(() => {
                                    const makeOptions = COMPONENT_OPTIONS[comp.name]?.[comp.make] || [];
                                    const isCustom = comp.approvalNumber !== '' && !makeOptions.includes(comp.approvalNumber);
                                    const hasPredefinedOptions = makeOptions.length > 0;

                                    return (
                                      <>
                                        <select 
                                          value={isCustom ? 'other' : comp.approvalNumber} 
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            const newComponents = [...data.components];
                                            newComponents[idx] = { 
                                              ...newComponents[idx], 
                                              approvalNumber: val === 'other' ? ' ' : val 
                                            };
                                            setData(prev => ({ ...prev, components: newComponents }));
                                          }}
                                          disabled={!comp.make || comp.make === ' '}
                                          className="w-full px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none bg-white disabled:bg-gray-50"
                                        >
                                          <option value="">Изберете номер</option>
                                          {makeOptions.map(num => (
                                            <option key={num} value={num}>{num}</option>
                                          ))}
                                          <option value="other">Друг...</option>
                                        </select>
                                        {(isCustom || comp.approvalNumber === ' ') && (
                                          <input 
                                            type="text" 
                                            value={comp.approvalNumber === ' ' ? '' : comp.approvalNumber}
                                            placeholder="Въведете номер"
                                            className="w-full mt-1 px-2 py-1 border border-gray-200 rounded focus:border-blue-500 outline-none"
                                            onChange={(e) => handleComponentChange(idx, 'approvalNumber', e.target.value)}
                                            autoFocus
                                          />
                                        )}
                                      </>
                                    );
                                  })()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="space-y-8">
                    <div className="bg-green-50 p-6 rounded-xl border border-green-100 flex items-start gap-4">
                      <div className="bg-green-500 p-2 rounded-full mt-1">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-900">Готови сте за печат!</h3>
                        <p className="text-green-800 mt-1">Прегледайте данните за последен път и генерирайте документа.</p>
                        
                        {publishedUrl && (
                          <div className="mt-4 p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                            <p className="text-sm font-medium text-gray-700 mb-2">Проектът е качен успешно в GitHub:</p>
                            <a 
                              href={publishedUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-2 text-sm break-all"
                            >
                              <ExternalLink className="w-4 h-4 shrink-0" />
                              {publishedUrl}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h4 className="font-bold text-gray-900 border-b pb-2">Издаване</h4>
                        <FormField label="Лице, издало протокола" name="issuerFullName" value={data.issuerFullName} onChange={handleInputChange} />
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Място</label>
                            <div className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700">
                              {data.issuePlace}
                            </div>
                          </div>
                          <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-gray-700">Дата</label>
                            <div className="px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700">
                              {data.issueDate ? new Date(data.issueDate).toLocaleDateString('bg-BG') : ''}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Buttons */}
                <div className="mt-12 flex items-center justify-between pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={activeStep === 0}
                    className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-30 transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Назад
                  </button>
                  
                  {activeStep === steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setView('print')}
                      className="bg-blue-600 text-white px-8 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
                    >
                      <Printer className="w-4 h-4" />
                      Преглед и Печат
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="bg-gray-900 text-white px-8 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
                    >
                      Напред
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        ) : (
          /* Print View */
          <div className="print-container max-w-[210mm] mx-auto bg-white shadow-2xl print:shadow-none p-[10mm] text-[12pt] leading-relaxed font-serif">
            <div className="text-center mb-8">
              <h2 className="text-[16pt] font-bold mb-2">Протокол № {data.protocolNumber || '.........'} / {data.protocolDate ? new Date(data.protocolDate).toLocaleDateString('bg-BG') : '..........'}</h2>
              <p className="text-[11pt] leading-tight">
                за допълнително монтиране на моторно превозно средство на уредба, която позволява<br />
                работата на двигателя с втечнен нефтен газ (ВНГ) или сгъстен природен газ (СПГ)
              </p>
            </div>

            <section className="mb-4">
              <h3 className="font-bold italic mb-2 text-[11pt]">I. Данни за лицето, извършило допълнителното монтиране на МПС на уредба за ВНГ или СПГ:</h3>
              <div className="ml-4 flex flex-wrap gap-x-6 gap-y-1 text-[11pt]">
                <PrintField label="Наименование" value={data.installerName} className="flex-none" />
                <PrintField label="ЕГН/БУЛСТАТ/ЕИК" value={data.installerId} className="flex-none" />
                <PrintField label="Адрес" value={data.installerAddress} className="flex-none" />
                <PrintField label='Телефон' value='Тел: 052 50 12 19' className='flex-none' />
              </div>
            </section>

            <section className="mb-4">
              <h3 className="font-bold italic mb-2 text-[11pt]">II. Данни за моторното превозно средство:</h3>
              <div className="space-y-1 ml-4 text-[11pt]">
                <div className="flex gap-6">
                  <PrintField label="Рег. №" value={data.vehicleRegNo} className="flex-1" />
                  <PrintField label="Марка" value={data.vehicleMake} className="flex-1" />
                  <PrintField label="Модел" value={data.vehicleModel} className="flex-1" />
                </div>
              </div>
            </section>

            <section className="mb-4">
              <h3 className="font-bold italic mb-2 text-[11pt]">III. Данни за монтираната уредба за ВНГ или СПГ:</h3>
              <p className="ml-4 mb-2 text-[11pt]">
                Марка: <span className="px-2 font-bold">{data.installationMake || '................'}</span>, 
                модел: <span className="px-2 font-bold">{data.installationModel || '................'}</span>, 
                състояща се от следните компоненти:
              </p>

              <table className="w-full border-collapse border border-black text-[10pt]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-black px-2 py-1 w-8">№</th>
                    <th className="border border-black px-2 py-1">Компонент</th>
                    <th className="border border-black px-2 py-1 w-32">Марка</th>
                    <th className="border border-black px-2 py-1">Номер на одобряване</th>
                  </tr>
                </thead>
                <tbody>
                  {data.components.map((comp, idx) => (
                    <tr key={comp.id}>
                      <td className="border border-black px-2 py-1 text-center">{idx + 1}</td>
                      <td className="border border-black px-2 py-1">
                        {comp.name}
                      </td>
                      <td className="border border-black px-2 py-1 text-center">{comp.make}</td>
                      <td className="border border-black px-2 py-1 text-center">{comp.approvalNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <div className="text-[11pt] mb-4 mt-4">
              Декларирам, че всички компоненти на уредбата притежават одобряване на типа и уредбата е монтирана съгласно изискванията на приложение № 1, раздел I/раздел II от Наредба № Н-3.
            </div>

            <div className="mb-6">
              <div className="font-bold mb-2">Лице, издало протокола:</div>
              <div className="grid grid-cols-2 gap-10">
                <div className="text-center">
                  <div className="border-b border-black mb-1 h-6 flex items-end justify-center font-bold">{data.issuerFullName}</div>
                  <div className="text-[10pt]">(име)</div>
                </div>
                <div className="text-center">
                  <div className="border-b border-black mb-1 h-6"></div>
                  <div className="text-[10pt]">(подпис, печат)</div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <div>Дата: <span className="px-4">{data.issueDate ? new Date(data.issueDate).toLocaleDateString('bg-BG') : '................'}</span></div>
              <div>Място: <span className="px-4">{data.issuePlace || '................'}</span></div>
            </div>

            <div className="mt-6 text-[10pt] text-justify border-t border-black pt-2">
              Настоящият протокол се издава на основание чл. 20, ал. 2 от Наредба № Н-3 от 18 февруари 2013 г. за изменение в конструкцията на регистрираните пътни превозни средства и индивидуално одобряване на пътни превозни средства, регистрирани извън държавите — членки на Европейския съюз, или друга държава — страна по Споразумението за Европейското икономическо пространство.
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Протокол за Газова Уредба. Създаден съгласно Наредба № Н-3.</p>
        </div>
      </footer>
    </div>
  );
}

function FormField({ label, name, value, onChange, type = "text", placeholder = "" }: { 
  label: string, 
  name: string, 
  value: string, 
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  type?: string,
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-gray-400"
      />
    </div>
  );
}

function PrintField({ label, value, className = "" }: { label: string, value: string, className?: string }) {
  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      <span className="whitespace-nowrap font-medium">{label}:</span>
      <span className="flex-1 border-b border-dotted border-black min-h-[1.5em] px-2 font-bold">
        {value}
      </span>
    </div>
  );
}
