import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import type { TeaItem, TeaTastingEntry } from '../../types/tea';
import { RadarChart } from '../journal/RadarChart';
import type { RadarAxis } from '../journal/RadarChart';
import {
  Plus,
  Search,
  Star,
  Download,
  Upload,
  Calendar,
  Sparkles,
  MapPin,
  X,
  Trash2,
  FileText,
  Save,
  Feather
} from 'lucide-react';

interface TeaJournalSectionProps {
  teas: TeaItem[];
  setTeas: React.Dispatch<React.SetStateAction<TeaItem[]>>;
  teaTastings: TeaTastingEntry[];
  setTeaTastings: React.Dispatch<React.SetStateAction<TeaTastingEntry[]>>;
  initialTeaBrewLog: {
    teaName: string;
    leafGrams: number;
    waterGrams: number;
    waterTempC: number;
    brewTimeSeconds: number;
    methodName: string;
    steepsCount: number;
  } | null;
  clearInitialTeaBrewLog: () => void;
}

const TEA_RADAR_AXES: RadarAxis[] = [
  { key: 'aroma', label: 'Аромат' },
  { key: 'huigan', label: 'Хуэй Гань (Сладость)' },
  { key: 'chaqi', label: 'Ча Ци (Энергия)' },
  { key: 'body', label: 'Плотность настоя' },
  { key: 'freshness', label: 'Свежесть' },
  { key: 'astringency', label: 'Терпкость' },
];

const TEA_DESCRIPTORS_LIST = [
  'Орхидея',
  'Печеный хлеб',
  'Липовый мёд',
  'Чернослив',
  'Сушеная вишня',
  'Жареный каштан',
  'Свежий горошек',
  'Морские нори',
  'Древесная кора',
  'Тёмный шоколад',
  'Карамель',
  'Луговые цветы',
  'Камфора / Мята',
  'Финики',
  'Мускат',
  'Копченый дым',
  'Сливочное масло',
  'Влажный лес',
];

export const TeaJournalSection: React.FC<TeaJournalSectionProps> = ({
  teas,
  setTeas,
  teaTastings,
  setTeaTastings,
  initialTeaBrewLog,
  clearInitialTeaBrewLog,
}) => {
  const [activeTab, setActiveTab] = useState<'tastings' | 'teas'>('tastings');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddTeaModalOpen, setIsAddTeaModalOpen] = useState(false);
  const [isAddTastingModalOpen, setIsAddTastingModalOpen] = useState(false);
  const [selectedTastingView, setSelectedTastingView] = useState<TeaTastingEntry | null>(null);

  // New Tea item form
  const [newTea, setNewTea] = useState<Partial<TeaItem>>({
    name: '',
    chineseName: '',
    category: 'Улун (Цин Ча)',
    province: 'Фуцзянь, Уишань',
    harvestYear: '2026',
    grade: '',
    userRating: 5,
    descriptors: ['Орхидея', 'Липовый мёд'],
    notes: '',
  });

  // New Tea Tasting form
  const [newTasting, setNewTasting] = useState<Partial<TeaTastingEntry>>({
    teaName: teas[0]?.name || 'Да Хун Пао',
    category: teas[0]?.category || 'Улун (Цин Ча)',
    province: teas[0]?.province || 'Фуцзянь',
    date: new Date().toISOString().split('T')[0],
    methodName: initialTeaBrewLog?.methodName || 'Гунфу Ча (Проливы в гайвани)',
    leafGrams: initialTeaBrewLog?.leafGrams || 7,
    waterGrams: initialTeaBrewLog?.waterGrams || 110,
    waterTempC: initialTeaBrewLog?.waterTempC || 92,
    steepsCount: initialTeaBrewLog?.steepsCount || 6,
    rating: 5,
    flavorProfile: {
      aroma: 9,
      huigan: 8,
      chaqi: 9,
      body: 8,
      freshness: 7,
      astringency: 3,
    },
    descriptors: ['Орхидея', 'Печеный хлеб'],
    verdictNotes: '',
  });

  // Pre-fill when coming from tea timer
  React.useEffect(() => {
    if (initialTeaBrewLog) {
      setNewTasting((prev) => ({
        ...prev,
        teaName: initialTeaBrewLog.teaName,
        leafGrams: initialTeaBrewLog.leafGrams,
        waterGrams: initialTeaBrewLog.waterGrams,
        waterTempC: initialTeaBrewLog.waterTempC,
        methodName: initialTeaBrewLog.methodName,
        steepsCount: initialTeaBrewLog.steepsCount,
      }));
      setIsAddTastingModalOpen(true);
      clearInitialTeaBrewLog();
    }
  }, [initialTeaBrewLog, clearInitialTeaBrewLog]);

  const handleSaveTea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTea.name) return;

    const teaToAdd: TeaItem = {
      id: `tea-${Date.now()}`,
      name: newTea.name || 'Чай',
      chineseName: newTea.chineseName || '',
      category: (newTea.category as TeaItem['category']) || 'Улун (Цин Ча)',
      province: newTea.province || 'Китай',
      harvestYear: newTea.harvestYear || '2026',
      grade: newTea.grade || '',
      userRating: newTea.userRating || 5,
      descriptors: newTea.descriptors || [],
      notes: newTea.notes || '',
      createdAt: Date.now(),
    };

    setTeas([teaToAdd, ...teas]);
    setIsAddTeaModalOpen(false);
    setNewTea({
      name: '',
      chineseName: '',
      category: 'Улун (Цин Ча)',
      province: 'Фуцзянь',
      harvestYear: '2026',
      grade: '',
      userRating: 5,
      descriptors: [],
      notes: '',
    });
  };

  const handleSaveTasting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTasting.teaName) return;

    const tastingToAdd: TeaTastingEntry = {
      id: `tea-tasting-${Date.now()}`,
      teaName: newTasting.teaName || 'Чай',
      category: newTasting.category || 'Улун',
      province: newTasting.province || '',
      date: newTasting.date || new Date().toISOString().split('T')[0],
      methodName: newTasting.methodName || 'Гунфу Ча',
      leafGrams: newTasting.leafGrams || 6,
      waterGrams: newTasting.waterGrams || 110,
      waterTempC: newTasting.waterTempC || 92,
      steepsCount: newTasting.steepsCount || 5,
      rating: newTasting.rating || 5,
      flavorProfile: newTasting.flavorProfile || {
        aroma: 8,
        huigan: 8,
        chaqi: 8,
        body: 7,
        freshness: 7,
        astringency: 3,
      },
      descriptors: newTasting.descriptors || [],
      verdictNotes: newTasting.verdictNotes || '',
    };

    setTeaTastings([tastingToAdd, ...teaTastings]);
    setIsAddTastingModalOpen(false);
  };

  const toggleDescriptor = (desc: string, currentList: string[], setter: (val: string[]) => void) => {
    if (currentList.includes(desc)) {
      setter(currentList.filter((d) => d !== desc));
    } else {
      setter([...currentList, desc]);
    }
  };

  // Export JSON backup
  const handleExportData = () => {
    const data = {
      teas,
      teaTastings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tea-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.teas && Array.isArray(parsed.teas)) {
          setTeas(parsed.teas);
        }
        if (parsed.teaTastings && Array.isArray(parsed.teaTastings)) {
          setTeaTastings(parsed.teaTastings);
        }
        alert('Данные чайного дневника успешно импортированы!');
      } catch {
        alert('Ошибка при чтении файла JSON.');
      }
    };
    reader.readAsText(file);
  };

  const filteredTastings = teaTastings.filter(
    (t) =>
      t.teaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.methodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.descriptors.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredTeas = teas.filter(
    (tea) =>
      tea.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tea.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tea.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-[#ede2d3]">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#f2f7f0] font-serif flex items-center gap-2">
            <span>Чайный дневник дегустаций</span>
          </h2>
          <p className="text-sm text-[#a8c5b0] mt-0.5">
            Учет чайной коллекции, сенсорная оценка Хуэй Гань, Ча Ци и аромата проливов
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab buttons */}
          <div className="bg-[#121f16] border border-[#233a2a] p-1 rounded-xl flex shadow-md">
            <button
              onClick={() => setActiveTab('tastings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tastings'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm border border-emerald-400/50'
                  : 'text-[#a7c5b1] hover:text-[#f2f7f0]'
              }`}
            >
              Чаепития ({teaTastings.length})
            </button>
            <button
              onClick={() => setActiveTab('teas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'teas'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-sm border border-emerald-400/50'
                  : 'text-[#a7c5b1] hover:text-[#f2f7f0]'
              }`}
            >
              Чайная полка ({teas.length})
            </button>
          </div>

          <button
            onClick={() => (activeTab === 'tastings' ? setIsAddTastingModalOpen(true) : setIsAddTeaModalOpen(true))}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-[#09150d] font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'tastings' ? 'Записать чаепитие' : 'Добавить чай'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Backup bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111f15]/90 p-3 rounded-xl border border-[#203627] shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#71927c]" />
          <input
            type="text"
            placeholder="Поиск по сорту, провинции, нотам..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0a140d] text-[#e2eee4] pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-[#203627] focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#a0c4ab] bg-[#0c160e] px-2.5 py-1.5 rounded-lg border border-[#1f3525]">
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Чайный дневник в LocalStorage</span>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17271b] hover:bg-[#203625] text-[#c7dfcd] rounded-lg border border-[#2b4c34] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Экспорт
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#17271b] hover:bg-[#203625] text-[#c7dfcd] rounded-lg border border-[#2b4c34] transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            Импорт
            <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
          </label>
        </div>
      </div>

      {/* Content for Tastings */}
      {activeTab === 'tastings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTastings.map((t) => (
            <div
              key={t.id}
              onClick={() => setSelectedTastingView(t)}
              className="bg-[#121f15]/90 border border-[#223928] hover:border-emerald-500/70 rounded-2xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#9fc4aa] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-emerald-400" />
                    {t.date}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= t.rating
                            ? 'text-emerald-400 fill-emerald-400'
                            : 'text-[#1c3022]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-bold text-base text-[#f2f7f0] leading-snug line-clamp-1 mb-0.5 font-serif">
                  {t.teaName}
                </h3>
                {t.province && (
                  <p className="text-xs text-[#8ab295] mb-2 font-medium">Терруар: {t.province}</p>
                )}

                {/* Recipe params badge */}
                <div className="flex flex-wrap gap-1.5 text-[11px] mb-3">
                  <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-medium">
                    {t.methodName}
                  </span>
                  <span className="bg-[#182a1d] text-[#a7c5b1] border border-[#25422d] px-2 py-0.5 rounded-md">
                    {t.leafGrams}г / {t.waterGrams}мл
                  </span>
                  <span className="bg-[#182a1d] text-[#a7c5b1] border border-[#25422d] px-2 py-0.5 rounded-md">
                    {t.steepsCount} проливов
                  </span>
                </div>

                {/* Descriptors tags */}
                {t.descriptors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {t.descriptors.map((desc) => (
                      <span
                        key={desc}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#172b1d] text-emerald-300 border border-[#2a4d33]"
                      >
                        {desc}
                      </span>
                    ))}
                  </div>
                )}

                {t.verdictNotes && (
                  <p className="text-xs text-[#a7c5b1] line-clamp-2 italic bg-[#0a140d] p-2 rounded-lg border border-[#1b2f21] mb-2">
                    «{t.verdictNotes}»
                  </p>
                )}
              </div>

              <div className="pt-2.5 border-t border-[#1e3323] flex items-center justify-between text-xs">
                <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" /> Сенсорный радар Хуэй Гань / Ча Ци
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Удалить эту чайную запись?')) {
                      setTeaTastings(teaTastings.filter((item) => item.id !== t.id));
                    }
                  }}
                  className="p-1 text-[#6f907a] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredTastings.length === 0 && (
            <div className="col-span-full py-12 text-center text-[#7ea38b]">
              <Feather className="w-12 h-12 mx-auto mb-2 opacity-30 text-emerald-400" />
              <p className="text-sm">Чайных записей пока нет. Заварите гайвань и запишите первое чаепитие!</p>
            </div>
          )}
        </div>
      )}

      {/* Content for Teas */}
      {activeTab === 'teas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeas.map((tea) => (
            <div
              key={tea.id}
              className="bg-[#121f15]/90 border border-[#223928] rounded-2xl p-4 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/35 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    {tea.province}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= tea.userRating
                            ? 'text-emerald-400 fill-emerald-400'
                            : 'text-[#1c3022]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-0.5">
                  <h3 className="font-bold text-base text-[#f2f7f0] font-serif leading-snug">
                    {tea.name}
                  </h3>
                  {tea.chineseName && (
                    <span className="text-xs text-emerald-400/80 font-serif">{tea.chineseName}</span>
                  )}
                </div>
                <p className="text-xs text-emerald-400 font-medium mb-2.5">{tea.category}</p>

                <div className="space-y-1.5 text-xs text-[#a0c4ab] bg-[#0a140d] p-3 rounded-xl border border-[#1d3323] mb-3">
                  <div className="flex justify-between">
                    <span className="text-[#6d8e78]">Сбор:</span>
                    <span className="font-medium text-[#e2eee4]">{tea.harvestYear}</span>
                  </div>
                  {tea.grade && (
                    <div className="flex justify-between">
                      <span className="text-[#6d8e78]">Грейд:</span>
                      <span className="text-[#e2eee4]">{tea.grade}</span>
                    </div>
                  )}
                </div>

                {tea.descriptors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {tea.descriptors.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#182c1e] text-emerald-300 border border-[#2b4c34]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {tea.notes && (
                  <p className="text-xs text-[#a0c4ab] italic line-clamp-2 mt-2">
                    {tea.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-[#1e3323] flex items-center justify-between text-xs text-[#71927c]">
                <span>Добавлено: {new Date(tea.createdAt).toLocaleDateString('ru-RU')}</span>
                <button
                  onClick={() => {
                    if (window.confirm('Удалить этот сорт чая?')) {
                      setTeas(teas.filter((item) => item.id !== tea.id));
                    }
                  }}
                  className="p-1 text-[#71927c] hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tasting Detail Modal */}
      {selectedTastingView &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#101c13] border border-[#2b4d34] rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 my-auto animate-fade-in text-[#ede2d3] max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-[#213a27] shrink-0">
                <div>
                  <span className="text-xs font-semibold text-emerald-400">
                    {selectedTastingView.date} • {selectedTastingView.methodName}
                  </span>
                  <h3 className="text-xl font-bold text-[#f2f7f0] font-serif">{selectedTastingView.teaName}</h3>
                </div>
                <button
                  onClick={() => setSelectedTastingView(null)}
                  className="p-1.5 text-[#7ea38b] hover:text-[#f2f7f0] rounded-lg bg-[#1a2e20] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto flex-1 min-h-0 pr-1 py-2 space-y-4">
                {/* Chinese Tea Radar Diagram */}
                <div className="py-2 flex justify-center">
                  <RadarChart
                    data={selectedTastingView.flavorProfile as unknown as Record<string, number>}
                    axes={TEA_RADAR_AXES}
                    theme="tea"
                    size={260}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 p-3 bg-[#0a140d] rounded-xl border border-[#1e3423] text-xs">
                  <div>
                    <span className="text-[#6d8e78] block">Навеска</span>
                    <span className="font-bold text-emerald-300">
                      {selectedTastingView.leafGrams}г / {selectedTastingView.waterGrams}мл
                    </span>
                  </div>
                  <div>
                    <span className="text-[#6d8e78] block">Температура</span>
                    <span className="font-semibold text-[#f2f7f0]">{selectedTastingView.waterTempC}°C</span>
                  </div>
                  <div>
                    <span className="text-[#6d8e78] block">Проливов</span>
                    <span className="font-bold text-emerald-300">{selectedTastingView.steepsCount}</span>
                  </div>
                </div>

                {selectedTastingView.descriptors.length > 0 && (
                  <div>
                    <span className="text-xs text-[#a0c4ab] block mb-1.5">Оттенки вкуса и аромата:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedTastingView.descriptors.map((d) => (
                        <span
                          key={d}
                          className="text-xs px-2.5 py-1 rounded-full bg-[#182c1e] text-emerald-300 border border-[#2b4c34]"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedTastingView.verdictNotes && (
                  <div className="p-3 bg-[#15261a] rounded-xl border border-[#26442e] text-xs text-[#c7dfcd]">
                    <span className="font-semibold text-emerald-300 block mb-0.5">Впечатления и состояние:</span>
                    «{selectedTastingView.verdictNotes}»
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#213a27] shrink-0">
                <button
                  onClick={() => setSelectedTastingView(null)}
                  className="w-full py-2.5 bg-[#17271b] hover:bg-[#203625] text-[#ede2d3] rounded-xl text-sm font-semibold border border-[#2b4c34] transition-colors cursor-pointer"
                >
                  Закрыть
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* Add New Tea Modal */}
      {isAddTeaModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#101c13] border border-[#2b4d34] rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 my-auto max-h-[92vh] flex flex-col text-[#ede2d3]">
              <div className="flex items-center justify-between pb-3 border-b border-[#213a27] shrink-0">
                <h3 className="text-lg font-bold text-[#f2f7f0] font-serif flex items-center gap-2">
                  <Feather className="w-5 h-5 text-emerald-400" />
                  Добавить сорт чая
                </h3>
                <button
                  onClick={() => setIsAddTeaModalOpen(false)}
                  className="p-1 text-[#7ea38b] hover:text-[#f2f7f0] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTea} className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-1.5 py-3 text-xs sm:text-sm">
                <div>
                  <label className="block text-[#c7dfcd] font-medium mb-1">Название чая *</label>
                  <input
                    type="text"
                    required
                    placeholder="напр. Да Хун Пао, Те Гуань Инь, Лун Цзин"
                    value={newTea.name}
                    onChange={(e) => setNewTea({ ...newTea, name: e.target.value })}
                    className="w-full bg-[#0a140d] border border-[#203627] rounded-xl px-3 py-2 text-[#f2f7f0]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#c7dfcd] font-medium mb-1">Иероглифы (необязательно)</label>
                    <input
                      type="text"
                      placeholder="大红袍"
                      value={newTea.chineseName}
                      onChange={(e) => setNewTea({ ...newTea, chineseName: e.target.value })}
                      className="w-full bg-[#0a140d] border border-[#203627] rounded-xl px-3 py-2 text-[#f2f7f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#c7dfcd] font-medium mb-1">Категория</label>
                    <select
                      value={newTea.category}
                      onChange={(e) => setNewTea({ ...newTea, category: e.target.value as TeaItem['category'] })}
                      className="w-full bg-[#0a140d] border border-[#203627] rounded-xl px-3 py-2 text-[#f2f7f0]"
                    >
                      <option value="Улун (Цин Ча)">Улун (Цин Ча)</option>
                      <option value="Шу Пуэр">Шу Пуэр</option>
                      <option value="Шэн Пуэр">Шэн Пуэр</option>
                      <option value="Зеленый (Люй Ча)">Зеленый (Люй Ча)</option>
                      <option value="Белый (Бай Ча)">Белый (Бай Ча)</option>
                      <option value="Красный (Хун Ча)">Красный (Хун Ча)</option>
                      <option value="Матча">Матча</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#c7dfcd] font-medium mb-1">Провинция / Регион</label>
                    <input
                      type="text"
                      placeholder="Фуцзянь, Юньнань, Тайвань..."
                      value={newTea.province}
                      onChange={(e) => setNewTea({ ...newTea, province: e.target.value })}
                      className="w-full bg-[#0a140d] border border-[#203627] rounded-xl px-3 py-2 text-[#f2f7f0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#c7dfcd] font-medium mb-1">Год сбора / выдержка</label>
                    <input
                      type="text"
                      placeholder="2026 или 2018 (выдержанный)"
                      value={newTea.harvestYear}
                      onChange={(e) => setNewTea({ ...newTea, harvestYear: e.target.value })}
                      className="w-full bg-[#0a140d] border border-[#203627] rounded-xl px-3 py-2 text-[#f2f7f0]"
                    />
                  </div>
                </div>

                {/* Descriptors Picker */}
                <div>
                  <span className="block text-xs font-semibold text-emerald-300 mb-1.5">Оттенки букета:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-2 bg-[#0a140d] rounded-xl border border-[#203627]">
                    {TEA_DESCRIPTORS_LIST.map((desc) => {
                      const isSel = (newTea.descriptors || []).includes(desc);
                      return (
                        <button
                          key={desc}
                          type="button"
                          onClick={() => toggleDescriptor(desc, newTea.descriptors || [], (list) => setNewTea({ ...newTea, descriptors: list }))}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            isSel
                              ? 'bg-emerald-500 text-[#09150d] font-bold border-emerald-400'
                              : 'bg-[#152319] border-[#223928] text-[#a7c5b1]'
                          }`}
                        >
                          {desc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[#c7dfcd] font-medium mb-1">Заметки о чае</label>
                  <textarea
                    rows={2}
                    placeholder="Мастерство прожарки, состояние Ча Ци, терруар..."
                    value={newTea.notes}
                    onChange={(e) => setNewTea({ ...newTea, notes: e.target.value })}
                    className="w-full bg-[#0a140d] border border-[#203627] rounded-xl px-3 py-2 text-[#f2f7f0]"
                  />
                </div>

                <div className="pt-3 border-t border-[#213a27] flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddTeaModalOpen(false)}
                    className="px-4 py-2 bg-[#17271b] hover:bg-[#203625] text-[#a7c5b1] rounded-xl border border-[#2b4c34] cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-[#09150d] font-bold rounded-xl cursor-pointer"
                  >
                    Сохранить чай
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Add New Tea Tasting Modal */}
      {isAddTastingModalOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#101c13] border border-[#2b4d34] rounded-2xl w-full max-w-2xl shadow-2xl p-5 sm:p-6 my-auto max-h-[92vh] flex flex-col text-[#ede2d3]">
              <div className="flex items-center justify-between pb-3 border-b border-[#213a27] shrink-0">
                <h3 className="text-lg font-bold text-[#f2f7f0] font-serif flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Новая чайная дегустация
                </h3>
                <button
                  onClick={() => setIsAddTastingModalOpen(false)}
                  className="p-1 text-[#7ea38b] hover:text-[#f2f7f0] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveTasting} className="space-y-4 overflow-y-auto flex-1 min-h-0 pr-1.5 py-3 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#c7dfcd] font-medium mb-1">Сорт чая *</label>
                    <input
                      type="text"
                      required
                      placeholder="Да Хун Пао, Шу Пуэр..."
                      value={newTasting.teaName}
                      onChange={(e) => setNewTasting({ ...newTasting, teaName: e.target.value })}
                      className="w-full bg-[#0a140d] border border-[#203627] rounded-xl px-3 py-2 text-[#f2f7f0]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#c7dfcd] font-medium mb-1">Способ заваривания</label>
                    <input
                      type="text"
                      placeholder="Гунфу Ча (проливами), Варка на огне, Чайник..."
                      value={newTasting.methodName}
                      onChange={(e) => setNewTasting({ ...newTasting, methodName: e.target.value })}
                      className="w-full bg-[#0a140d] border border-[#203627] rounded-xl px-3 py-2 text-[#f2f7f0]"
                    />
                  </div>
                </div>

                {/* Parameters row */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[#8ab295] text-xs mb-1">Лист (г)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newTasting.leafGrams}
                      onChange={(e) => setNewTasting({ ...newTasting, leafGrams: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-[#0a140d] border border-[#203627] rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8ab295] text-xs mb-1">Вода (мл)</label>
                    <input
                      type="number"
                      value={newTasting.waterGrams}
                      onChange={(e) => setNewTasting({ ...newTasting, waterGrams: parseInt(e.target.value, 10) || 0 })}
                      className="w-full bg-[#0a140d] border border-[#203627] rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8ab295] text-xs mb-1">Проливов</label>
                    <input
                      type="number"
                      value={newTasting.steepsCount}
                      onChange={(e) => setNewTasting({ ...newTasting, steepsCount: parseInt(e.target.value, 10) || 1 })}
                      className="w-full bg-[#0a140d] border border-[#203627] rounded-lg px-2.5 py-1.5 text-white"
                    />
                  </div>
                </div>

                {/* Rating */}
                <div className="bg-[#0a140d] p-3 rounded-xl border border-[#1e3423] flex items-center justify-between">
                  <span className="text-[#c7dfcd] font-medium">Оценка чаепития:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        onClick={() => setNewTasting({ ...newTasting, rating: s })}
                        className={`w-6 h-6 cursor-pointer transition-transform hover:scale-110 ${
                          s <= (newTasting.rating || 5)
                            ? 'text-emerald-400 fill-emerald-400'
                            : 'text-[#1c3022]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Interactive Chinese Tea Sensory Radar */}
                <div className="bg-[#0a140d] p-4 rounded-xl border border-[#26442e]">
                  <span className="block text-xs uppercase tracking-wider font-bold text-emerald-300 mb-2 text-center">
                    Чайный сенсорный радар
                  </span>
                  <RadarChart
                    data={newTasting.flavorProfile as unknown as Record<string, number>}
                    axes={TEA_RADAR_AXES}
                    theme="tea"
                    size={240}
                    editable={true}
                    onChange={(key, val) => {
                      const cur = newTasting.flavorProfile || {
                        aroma: 8,
                        huigan: 8,
                        chaqi: 8,
                        body: 7,
                        freshness: 7,
                        astringency: 3,
                      };
                      setNewTasting({
                        ...newTasting,
                        flavorProfile: { ...cur, [key]: val },
                      });
                    }}
                  />
                </div>

                {/* Descriptors Chips */}
                <div>
                  <span className="block text-xs font-semibold text-emerald-300 mb-1.5">Оттенки вкуса и аромата:</span>
                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-2 bg-[#0a140d] rounded-xl border border-[#203627]">
                    {TEA_DESCRIPTORS_LIST.map((desc) => {
                      const isSel = (newTasting.descriptors || []).includes(desc);
                      return (
                        <button
                          key={desc}
                          type="button"
                          onClick={() => toggleDescriptor(desc, newTasting.descriptors || [], (list) => setNewTasting({ ...newTasting, descriptors: list }))}
                          className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                            isSel
                              ? 'bg-emerald-500 text-[#09150d] font-bold border-emerald-400'
                              : 'bg-[#152319] border-[#223928] text-[#a7c5b1]'
                          }`}
                        >
                          {desc}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[#c7dfcd] font-medium mb-1">Впечатления и состояние (Ча Ци)</label>
                  <textarea
                    rows={2}
                    placeholder="Как менялся вкус от первого пролива к последнему, сладость послевкусия, медитативный покой..."
                    value={newTasting.verdictNotes}
                    onChange={(e) => setNewTasting({ ...newTasting, verdictNotes: e.target.value })}
                    className="w-full bg-[#0a140d] border border-[#203627] rounded-xl px-3 py-2 text-[#f2f7f0]"
                  />
                </div>

                <div className="pt-3 border-t border-[#213a27] flex justify-end gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsAddTastingModalOpen(false)}
                    className="px-4 py-2 bg-[#17271b] hover:bg-[#203625] text-[#a7c5b1] rounded-xl border border-[#2b4c34] cursor-pointer"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-[#09150d] font-bold rounded-xl cursor-pointer"
                  >
                    Записать чаепитие
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
