import React, { useState } from 'react';
import type { Bean, TastingEntry } from '../../types';
import { RadarChart } from './RadarChart';
import { DescriptorPicker } from './DescriptorPicker';
import {
  Plus,
  Search,
  Star,
  Download,
  Upload,
  Calendar,
  Sparkles,
  MapPin,
  Flame,
  X,
  Coffee,
  Trash2,
  FileText
} from 'lucide-react';

interface JournalSectionProps {
  beans: Bean[];
  setBeans: React.Dispatch<React.SetStateAction<Bean[]>>;
  tastings: TastingEntry[];
  setTastings: React.Dispatch<React.SetStateAction<TastingEntry[]>>;
  initialBrewLog: {
    methodName: string;
    coffeeGrams: number;
    waterGrams: number;
    brewTimeSeconds: number;
    grindSize: string;
    waterTempC: number;
  } | null;
  clearInitialBrewLog: () => void;
}

export const JournalSection: React.FC<JournalSectionProps> = ({
  beans,
  setBeans,
  tastings,
  setTastings,
  initialBrewLog,
  clearInitialBrewLog,
}) => {
  const [activeTab, setActiveTab] = useState<'tastings' | 'beans'>('tastings');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddBeanModalOpen, setIsAddBeanModalOpen] = useState(false);
  const [isAddTastingModalOpen, setIsAddTastingModalOpen] = useState(false);
  const [selectedTastingView, setSelectedTastingView] = useState<TastingEntry | null>(null);

  // New Bean form state
  const [newBean, setNewBean] = useState<Partial<Bean>>({
    name: '',
    roaster: '',
    originCountry: 'Эфиопия',
    region: '',
    altitudeMeters: '',
    variety: '',
    processing: 'Мытый (Washed)',
    roastLevel: 'Светлая (Фильтр)',
    roastDate: new Date().toISOString().split('T')[0],
    descriptors: [],
    userRating: 5,
    notes: '',
  });

  // New Tasting Entry form state
  const [newTasting, setNewTasting] = useState<Partial<TastingEntry>>({
    beanName: beans[0]?.name || 'Эфиопия Иргачефф',
    roaster: beans[0]?.roaster || '',
    date: new Date().toISOString().split('T')[0],
    methodName: initialBrewLog?.methodName || 'V60 — Метод 4:6 (Tetsu Kasuya)',
    coffeeGrams: initialBrewLog?.coffeeGrams || 20,
    waterGrams: initialBrewLog?.waterGrams || 300,
    grindSize: initialBrewLog?.grindSize || '24 клика Comandante',
    waterTempC: initialBrewLog?.waterTempC || 93,
    brewTimeSeconds: initialBrewLog?.brewTimeSeconds || 210,
    rating: 5,
    flavorProfile: {
      acidity: 8,
      sweetness: 8,
      bitterness: 3,
      body: 6,
      aftertaste: 8,
      clarity: 9,
    },
    descriptors: ['Бергамот', 'Персик', 'Карамель'],
    verdictNotes: '',
  });

  // Trigger tasting modal if coming from brew timer
  React.useEffect(() => {
    if (initialBrewLog) {
      setNewTasting((prev) => ({
        ...prev,
        methodName: initialBrewLog.methodName,
        coffeeGrams: initialBrewLog.coffeeGrams,
        waterGrams: initialBrewLog.waterGrams,
        brewTimeSeconds: initialBrewLog.brewTimeSeconds,
        grindSize: initialBrewLog.grindSize,
        waterTempC: initialBrewLog.waterTempC,
      }));
      setIsAddTastingModalOpen(true);
      clearInitialBrewLog();
    }
  }, [initialBrewLog, clearInitialBrewLog]);

  const handleSaveBean = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBean.name) return;

    const beanToAdd: Bean = {
      id: `bean-${Date.now()}`,
      name: newBean.name || 'Кофе без названия',
      roaster: newBean.roaster || 'Обжарщик не указан',
      originCountry: newBean.originCountry || 'Эфиопия',
      region: newBean.region || '',
      altitudeMeters: newBean.altitudeMeters || '',
      variety: newBean.variety || '',
      processing: (newBean.processing as Bean['processing']) || 'Мытый (Washed)',
      roastLevel: (newBean.roastLevel as Bean['roastLevel']) || 'Светлая (Фильтр)',
      roastDate: newBean.roastDate,
      descriptors: newBean.descriptors || [],
      userRating: newBean.userRating || 5,
      notes: newBean.notes || '',
      createdAt: Date.now(),
    };

    setBeans([beanToAdd, ...beans]);
    setIsAddBeanModalOpen(false);
    setNewBean({
      name: '',
      roaster: '',
      originCountry: 'Эфиопия',
      region: '',
      altitudeMeters: '',
      variety: '',
      processing: 'Мытый (Washed)',
      roastLevel: 'Светлая (Фильтр)',
      roastDate: new Date().toISOString().split('T')[0],
      descriptors: [],
      userRating: 5,
      notes: '',
    });
  };

  const handleSaveTasting = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTasting.beanName) return;

    const tastingToAdd: TastingEntry = {
      id: `tasting-${Date.now()}`,
      beanName: newTasting.beanName || 'Кофе',
      roaster: newTasting.roaster || '',
      date: newTasting.date || new Date().toISOString().split('T')[0],
      methodName: newTasting.methodName || 'V60',
      coffeeGrams: newTasting.coffeeGrams || 15,
      waterGrams: newTasting.waterGrams || 250,
      grindSize: newTasting.grindSize || 'Средний',
      waterTempC: newTasting.waterTempC || 93,
      brewTimeSeconds: newTasting.brewTimeSeconds || 180,
      rating: newTasting.rating || 5,
      flavorProfile: newTasting.flavorProfile || {
        acidity: 7,
        sweetness: 7,
        bitterness: 3,
        body: 6,
        aftertaste: 7,
        clarity: 8,
      },
      descriptors: newTasting.descriptors || [],
      verdictNotes: newTasting.verdictNotes || '',
    };

    setTastings([tastingToAdd, ...tastings]);
    setIsAddTastingModalOpen(false);
  };

  const handleDeleteBean = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Удалить этот сорт из коллекции?')) {
      setBeans(beans.filter((b) => b.id !== id));
    }
  };

  const handleDeleteTasting = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Удалить эту дегустационную запись?')) {
      setTastings(tastings.filter((t) => t.id !== id));
      if (selectedTastingView?.id === id) {
        setSelectedTastingView(null);
      }
    }
  };

  // Export JSON backup
  const handleExportData = () => {
    const data = {
      beans,
      tastings,
      exportDate: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `coffee-journal-backup-${new Date().toISOString().split('T')[0]}.json`;
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
        if (parsed.beans && Array.isArray(parsed.beans)) {
          setBeans(parsed.beans);
        }
        if (parsed.tastings && Array.isArray(parsed.tastings)) {
          setTastings(parsed.tastings);
        }
        alert('Данные дневника успешно импортированы!');
      } catch {
        alert('Ошибка при чтении файла JSON. Убедитесь в корректности формата.');
      }
    };
    reader.readAsText(file);
  };

  // Filtered lists
  const filteredTastings = tastings.filter(
    (t) =>
      t.beanName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.methodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.descriptors.some((d) => d.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredBeans = beans.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roaster.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.originCountry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in text-[#ede2d3]">
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#fdf8f3] font-serif">
            Кофейный дневник дегустаций
          </h2>
          <p className="text-sm text-[#caa890] mt-0.5">
            Коллекция спешелти зёрен, вкусовое колесо и сенсорный радар каждой чашки
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab buttons */}
          <div className="bg-[#1c120c] border border-[#3e2618] p-1 rounded-xl flex shadow-md">
            <button
              onClick={() => setActiveTab('tastings')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'tastings'
                  ? 'btn-crema border border-[#f3be7a]/50 text-[#140d09]'
                  : 'text-[#caa890] hover:text-[#fdf8f3]'
              }`}
            >
              Дегустации ({tastings.length})
            </button>
            <button
              onClick={() => setActiveTab('beans')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'beans'
                  ? 'btn-crema border border-[#f3be7a]/50 text-[#140d09]'
                  : 'text-[#caa890] hover:text-[#fdf8f3]'
              }`}
            >
              Сорта зёрен ({beans.length})
            </button>
          </div>

          <button
            onClick={() => (activeTab === 'tastings' ? setIsAddTastingModalOpen(true) : setIsAddBeanModalOpen(true))}
            className="px-4 py-2 btn-crema border border-[#f3be7a]/60 text-[#140d09] font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{activeTab === 'tastings' ? 'Новая запись' : 'Добавить сорт'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Backup bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1b110a]/90 p-3 rounded-xl border border-[#3a2417] shadow-md">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9c7860]" />
          <input
            type="text"
            placeholder="Поиск по сорту, обжарщику, дескриптору..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#140c08] text-[#ede2d3] pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-lg border border-[#3f2719] focus:outline-none focus:border-[#d48b46]"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#251710] hover:bg-[#321f15] text-[#d8c0b0] rounded-lg border border-[#442a1b] transition-colors cursor-pointer"
            title="Экспортировать бэкап дневника в JSON"
          >
            <Download className="w-3.5 h-3.5 text-[#d48b46]" />
            Экспорт
          </button>
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-[#251710] hover:bg-[#321f15] text-[#d8c0b0] rounded-lg border border-[#442a1b] transition-colors cursor-pointer">
            <Upload className="w-3.5 h-3.5 text-[#d48b46]" />
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
              className="bg-[#1c120c]/90 border border-[#3d2618] hover:border-[#d48b46]/70 rounded-2xl p-4 transition-all hover:-translate-y-0.5 cursor-pointer shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-[#caa890] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#d48b46]" />
                    {t.date}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= t.rating
                            ? 'text-[#f5be7e] fill-[#f5be7e]'
                            : 'text-[#382215]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-bold text-base text-[#fdf8f3] leading-snug line-clamp-1 mb-0.5 font-serif">
                  {t.beanName}
                </h3>
                {t.roaster && (
                  <p className="text-xs text-[#b8957c] mb-2 font-medium">Обжарка: {t.roaster}</p>
                )}

                {/* Recipe params badge */}
                <div className="flex flex-wrap gap-1.5 text-[11px] mb-3">
                  <span className="bg-[#d48b46]/20 text-[#f5be7e] border border-[#d48b46]/35 px-2 py-0.5 rounded-md font-medium">
                    {t.methodName}
                  </span>
                  <span className="bg-[#24150d] text-[#caa890] border border-[#382215] px-2 py-0.5 rounded-md">
                    {t.coffeeGrams}г / {t.waterGrams}г
                  </span>
                  <span className="bg-[#24150d] text-[#caa890] border border-[#382215] px-2 py-0.5 rounded-md">
                    {Math.floor(t.brewTimeSeconds / 60)}:
                    {(t.brewTimeSeconds % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Descriptors tags */}
                {t.descriptors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {t.descriptors.map((desc) => (
                      <span
                        key={desc}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#3a2214] text-[#f5be7e] border border-[#5a3824]"
                      >
                        {desc}
                      </span>
                    ))}
                  </div>
                )}

                {t.verdictNotes && (
                  <p className="text-xs text-[#caa890] line-clamp-2 italic bg-[#140c08] p-2 rounded-lg border border-[#2d1b11] mb-2">
                    «{t.verdictNotes}»
                  </p>
                )}
              </div>

              <div className="pt-2.5 border-t border-[#342014] flex items-center justify-between text-xs">
                <span className="text-[#f5be7e] text-[11px] font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#d48b46]" /> Сенсорный радар
                </span>
                <button
                  onClick={(e) => handleDeleteTasting(t.id, e)}
                  className="p-1 text-[#8e6e58] hover:text-red-400 transition-colors"
                  title="Удалить запись"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredTastings.length === 0 && (
            <div className="col-span-full py-12 text-center text-[#9c7860]">
              <Coffee className="w-12 h-12 mx-auto mb-2 opacity-30 text-[#d48b46]" />
              <p className="text-sm">Записей пока нет. Заварите чашку и добавьте свою первую дегустацию!</p>
            </div>
          )}
        </div>
      )}

      {/* Content for Beans */}
      {activeTab === 'beans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBeans.map((bean) => (
            <div
              key={bean.id}
              className="bg-[#1c120c]/90 border border-[#3d2618] rounded-2xl p-4 shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-[#f5be7e] bg-[#d48b46]/15 px-2.5 py-0.5 rounded-full border border-[#d48b46]/30 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#d48b46]" />
                    {bean.originCountry}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= bean.userRating
                            ? 'text-[#f5be7e] fill-[#f5be7e]'
                            : 'text-[#382215]'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="font-bold text-base text-[#fdf8f3] leading-snug mb-0.5 font-serif">
                  {bean.name}
                </h3>
                <p className="text-xs text-[#d48b46] font-medium mb-2.5">{bean.roaster}</p>

                <div className="space-y-1.5 text-xs text-[#caa890] bg-[#140c08] p-3 rounded-xl border border-[#342014] mb-3">
                  <div className="flex justify-between">
                    <span className="text-[#8e6e58]">Обработка:</span>
                    <span className="font-medium text-[#f5be7e]">{bean.processing}</span>
                  </div>
                  {bean.altitudeMeters && (
                    <div className="flex justify-between">
                      <span className="text-[#8e6e58]">Высота:</span>
                      <span className="text-[#ede2d3]">{bean.altitudeMeters}</span>
                    </div>
                  )}
                  {bean.variety && (
                    <div className="flex justify-between">
                      <span className="text-[#8e6e58]">Разновидность:</span>
                      <span className="text-[#ede2d3]">{bean.variety}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-[#8e6e58] flex items-center gap-1">
                      <Flame className="w-3 h-3 text-[#d48b46]" /> Обжарка:
                    </span>
                    <span className="text-[#ede2d3]">{bean.roastLevel}</span>
                  </div>
                </div>

                {bean.descriptors.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {bean.descriptors.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#362114] text-[#f5be7e] border border-[#52331f]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}

                {bean.notes && (
                  <p className="text-xs text-[#caa890] italic line-clamp-2 mt-2">
                    {bean.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-[#342014] flex items-center justify-between text-xs text-[#8e6e58]">
                <span>{bean.roastDate ? `Обжарено: ${bean.roastDate}` : ''}</span>
                <button
                  onClick={(e) => handleDeleteBean(bean.id, e)}
                  className="p-1 text-[#8e6e58] hover:text-red-400 transition-colors"
                  title="Удалить сорт"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}

          {filteredBeans.length === 0 && (
            <div className="col-span-full py-12 text-center text-[#9c7860]">
              <Coffee className="w-12 h-12 mx-auto mb-2 opacity-30 text-[#d48b46]" />
              <p className="text-sm">Зёрна не найдены. Добавьте свою первую пачку кофе!</p>
            </div>
          )}
        </div>
      )}

      {/* Tasting Detail Modal (with Interactive Radar) */}
      {selectedTastingView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1b110a] border border-[#52331f] rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 overflow-hidden my-auto animate-fade-in text-[#ede2d3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#382215]">
              <div>
                <span className="text-xs font-semibold text-[#d48b46]">
                  {selectedTastingView.date} • {selectedTastingView.methodName}
                </span>
                <h3 className="text-xl font-bold text-[#fdf8f3] font-serif">{selectedTastingView.beanName}</h3>
              </div>
              <button
                onClick={() => setSelectedTastingView(null)}
                className="p-1.5 text-[#9c7860] hover:text-[#fdf8f3] rounded-lg bg-[#251710]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Radar Diagram */}
            <div className="py-4 flex justify-center">
              <RadarChart data={selectedTastingView.flavorProfile} size={280} />
            </div>

            {/* Brew Parameters Table */}
            <div className="grid grid-cols-3 gap-2 p-3 bg-[#140c08] rounded-xl border border-[#342014] text-xs mb-3">
              <div>
                <span className="text-[#8e6e58] block">Пропорция</span>
                <span className="font-bold text-[#f5be7e]">
                  {selectedTastingView.coffeeGrams}г / {selectedTastingView.waterGrams}г
                </span>
              </div>
              <div>
                <span className="text-[#8e6e58] block">Помол</span>
                <span className="font-semibold text-[#ede2d3] line-clamp-1">
                  {selectedTastingView.grindSize}
                </span>
              </div>
              <div>
                <span className="text-[#8e6e58] block">Время</span>
                <span className="font-bold text-[#f5be7e]">
                  {Math.floor(selectedTastingView.brewTimeSeconds / 60)}:
                  {(selectedTastingView.brewTimeSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            {/* Descriptors */}
            {selectedTastingView.descriptors.length > 0 && (
              <div className="mb-3">
                <span className="text-xs text-[#caa890] block mb-1">Дескрипторы вкуса:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTastingView.descriptors.map((d) => (
                    <span
                      key={d}
                      className="text-xs px-2.5 py-1 rounded-full bg-[#362114] text-[#f5be7e] border border-[#52331f]"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Verdict Note */}
            {selectedTastingView.verdictNotes && (
              <div className="p-3 bg-[#24150d] rounded-xl border border-[#482d1c] text-xs text-[#d8c0b0] mb-4">
                <span className="font-semibold text-[#f5be7e] block mb-0.5">Впечатления и заметки:</span>
                «{selectedTastingView.verdictNotes}»
              </div>
            )}

            <button
              onClick={() => setSelectedTastingView(null)}
              className="w-full py-2.5 bg-[#251710] hover:bg-[#342016] text-[#ede2d3] rounded-xl text-sm font-semibold border border-[#3e2618] transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Add New Bean Modal */}
      {isAddBeanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1b110a] border border-[#52331f] rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 overflow-hidden my-auto max-h-[90vh] flex flex-col text-[#ede2d3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#382215]">
              <h3 className="text-lg font-bold text-[#fdf8f3] font-serif flex items-center gap-2">
                <Coffee className="w-5 h-5 text-[#d48b46]" />
                Добавить сорт кофе
              </h3>
              <button
                onClick={() => setIsAddBeanModalOpen(false)}
                className="p-1 text-[#9c7860] hover:text-[#fdf8f3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBean} className="space-y-4 overflow-y-auto pr-1 py-3 text-xs sm:text-sm">
              <div>
                <label className="block text-[#d8c0b0] font-medium mb-1">Название сорта / лота *</label>
                <input
                  type="text"
                  required
                  placeholder="напр. Ethiopia Yirgacheffe Chelchele"
                  value={newBean.name}
                  onChange={(e) => setNewBean({ ...newBean, name: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 text-[#fdf8f3] border"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d8c0b0] font-medium mb-1">Обжарщик</label>
                  <input
                    type="text"
                    placeholder="Tasty Coffee, Submarine..."
                    value={newBean.roaster}
                    onChange={(e) => setNewBean({ ...newBean, roaster: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-[#fdf8f3] border"
                  />
                </div>
                <div>
                  <label className="block text-[#d8c0b0] font-medium mb-1">Страна происхождения</label>
                  <input
                    type="text"
                    placeholder="Эфиопия, Колумбия, Кения..."
                    value={newBean.originCountry}
                    onChange={(e) => setNewBean({ ...newBean, originCountry: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-[#fdf8f3] border"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d8c0b0] font-medium mb-1">Метод обработки</label>
                  <select
                    value={newBean.processing}
                    onChange={(e) => setNewBean({ ...newBean, processing: e.target.value as Bean['processing'] })}
                    className="w-full rounded-xl px-3 py-2 border"
                  >
                    <option value="Мытый (Washed)">Мытый (Washed)</option>
                    <option value="Натуральный (Natural)">Натуральный (Natural)</option>
                    <option value="Анаэробный (Anaerobic)">Анаэробный (Anaerobic)</option>
                    <option value="Хани (Honey)">Хани (Honey)</option>
                    <option value="Экспериментальный">Экспериментальный</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[#d8c0b0] font-medium mb-1">Степень обжарки</label>
                  <select
                    value={newBean.roastLevel}
                    onChange={(e) => setNewBean({ ...newBean, roastLevel: e.target.value as Bean['roastLevel'] })}
                    className="w-full rounded-xl px-3 py-2 border"
                  >
                    <option value="Светлая (Фильтр)">Светлая (Фильтр)</option>
                    <option value="Средне-светлая">Средне-светлая</option>
                    <option value="Средняя (Омни)">Средняя (Омни)</option>
                    <option value="Темная (Эспрессо)">Темная (Эспрессо)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d8c0b0] font-medium mb-1">Высота произрастания</label>
                  <input
                    type="text"
                    placeholder="1900 - 2100 м"
                    value={newBean.altitudeMeters}
                    onChange={(e) => setNewBean({ ...newBean, altitudeMeters: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-[#fdf8f3] border"
                  />
                </div>
                <div>
                  <label className="block text-[#d8c0b0] font-medium mb-1">Дата обжарки</label>
                  <input
                    type="date"
                    value={newBean.roastDate}
                    onChange={(e) => setNewBean({ ...newBean, roastDate: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 border"
                  />
                </div>
              </div>

              {/* Flavor Wheel Descriptor Picker */}
              <DescriptorPicker
                selected={newBean.descriptors || []}
                onChange={(tags) => setNewBean({ ...newBean, descriptors: tags })}
              />

              <div>
                <label className="block text-[#d8c0b0] font-medium mb-1">Заметки и описание лота</label>
                <textarea
                  rows={2}
                  placeholder="Особенности вкуса, ферментации, терруара..."
                  value={newBean.notes}
                  onChange={(e) => setNewBean({ ...newBean, notes: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 border"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddBeanModalOpen(false)}
                  className="px-4 py-2 bg-[#251710] hover:bg-[#321f15] text-[#caa890] rounded-xl border border-[#3e2618]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 btn-crema border border-[#f3be7a]/60 text-[#140d09] font-bold rounded-xl"
                >
                  Сохранить сорт
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Tasting Modal */}
      {isAddTastingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#1b110a] border border-[#52331f] rounded-2xl w-full max-w-2xl shadow-2xl p-5 sm:p-6 overflow-hidden my-auto max-h-[92vh] flex flex-col text-[#ede2d3]">
            <div className="flex items-center justify-between pb-3 border-b border-[#382215]">
              <h3 className="text-lg font-bold text-[#fdf8f3] font-serif flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#d48b46]" />
                Новая дегустация кофе
              </h3>
              <button
                onClick={() => setIsAddTastingModalOpen(false)}
                className="p-1 text-[#9c7860] hover:text-[#fdf8f3]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTasting} className="space-y-4 overflow-y-auto pr-1 py-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#d8c0b0] font-medium mb-1">Название зерна *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ethiopia Yirgacheffe..."
                    value={newTasting.beanName}
                    onChange={(e) => setNewTasting({ ...newTasting, beanName: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-[#fdf8f3] border"
                  />
                </div>

                <div>
                  <label className="block text-[#d8c0b0] font-medium mb-1">Способ заваривания</label>
                  <input
                    type="text"
                    placeholder="V60, AeroPress, Chemex..."
                    value={newTasting.methodName}
                    onChange={(e) => setNewTasting({ ...newTasting, methodName: e.target.value })}
                    className="w-full rounded-xl px-3 py-2 text-[#fdf8f3] border"
                  />
                </div>
              </div>

              {/* Brew parameters row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div>
                  <label className="block text-[#caa890] text-xs mb-1">Кофе (г)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newTasting.coffeeGrams}
                    onChange={(e) => setNewTasting({ ...newTasting, coffeeGrams: parseFloat(e.target.value) || 0 })}
                    className="w-full rounded-lg px-2.5 py-1.5 border"
                  />
                </div>
                <div>
                  <label className="block text-[#caa890] text-xs mb-1">Вода (г)</label>
                  <input
                    type="number"
                    value={newTasting.waterGrams}
                    onChange={(e) => setNewTasting({ ...newTasting, waterGrams: parseInt(e.target.value, 10) || 0 })}
                    className="w-full rounded-lg px-2.5 py-1.5 border"
                  />
                </div>
                <div>
                  <label className="block text-[#caa890] text-xs mb-1">Время (сек)</label>
                  <input
                    type="number"
                    value={newTasting.brewTimeSeconds}
                    onChange={(e) => setNewTasting({ ...newTasting, brewTimeSeconds: parseInt(e.target.value, 10) || 0 })}
                    className="w-full rounded-lg px-2.5 py-1.5 border"
                  />
                </div>
                <div>
                  <label className="block text-[#caa890] text-xs mb-1">Помол</label>
                  <input
                    type="text"
                    placeholder="22 клика"
                    value={newTasting.grindSize}
                    onChange={(e) => setNewTasting({ ...newTasting, grindSize: e.target.value })}
                    className="w-full rounded-lg px-2.5 py-1.5 border"
                  />
                </div>
              </div>

              {/* Star rating */}
              <div className="bg-[#140c08] p-3 rounded-xl border border-[#342014] flex items-center justify-between">
                <span className="text-[#d8c0b0] font-medium">Общая оценка чашки:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      onClick={() => setNewTasting({ ...newTasting, rating: s })}
                      className={`w-6 h-6 cursor-pointer transition-transform hover:scale-110 ${
                        s <= (newTasting.rating || 5)
                          ? 'text-[#f5be7e] fill-[#f5be7e]'
                          : 'text-[#362114]'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Interactive Radar Sensory Profile */}
              <div className="bg-[#140c08] p-4 rounded-xl border border-[#482d1c]">
                <span className="block text-xs uppercase tracking-wider font-bold text-[#f5be7e] mb-2 text-center">
                  Сенсорный вкусовой радар
                </span>
                <RadarChart
                  data={
                    newTasting.flavorProfile || {
                      acidity: 7,
                      sweetness: 7,
                      bitterness: 3,
                      body: 6,
                      aftertaste: 7,
                      clarity: 8,
                    }
                  }
                  size={240}
                  editable={true}
                  onChange={(key, val) => {
                    const currentProf = newTasting.flavorProfile || {
                      acidity: 7,
                      sweetness: 7,
                      bitterness: 3,
                      body: 6,
                      aftertaste: 7,
                      clarity: 8,
                    };
                    setNewTasting({
                      ...newTasting,
                      flavorProfile: { ...currentProf, [key]: val },
                    });
                  }}
                />
              </div>

              {/* Descriptors Picker */}
              <DescriptorPicker
                selected={newTasting.descriptors || []}
                onChange={(tags) => setNewTasting({ ...newTasting, descriptors: tags })}
              />

              <div>
                <label className="block text-[#d8c0b0] font-medium mb-1">Вердикт и вкусовые заметки</label>
                <textarea
                  rows={2}
                  placeholder="Как менялся вкус по мере остывания чашки, баланс сладости и тела..."
                  value={newTasting.verdictNotes}
                  onChange={(e) => setNewTasting({ ...newTasting, verdictNotes: e.target.value })}
                  className="w-full rounded-xl px-3 py-2 border"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddTastingModalOpen(false)}
                  className="px-4 py-2 bg-[#251710] hover:bg-[#321f15] text-[#caa890] rounded-xl border border-[#3e2618]"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 btn-crema border border-[#f3be7a]/60 text-[#140d09] font-bold rounded-xl"
                >
                  Записать дегустацию
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
