import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, TrendingUp, Filter, Calendar, MapPin, Package, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AdminModal from './AdminModal';
import CustomAlert from '../../../components/CustomAlert';
import CustomDropdown from '../../../components/CustomDropdown';
import { priceService, mapService, predictionService } from '../../../api/services';

const JAWA_TIMUR_REGIONS = [
  "Kabupaten Bangkalan", "Kabupaten Banyuwangi", "Kabupaten Blitar", "Kabupaten Bojonegoro", 
  "Kabupaten Bondowoso", "Kabupaten Gresik", "Kabupaten Jember", "Kabupaten Jombang", 
  "Kabupaten Kediri", "Kabupaten Lamongan", "Kabupaten Lumajang", "Kabupaten Madiun", 
  "Kabupaten Magetan", "Kabupaten Malang", "Kabupaten Mojokerto", "Kabupaten Nganjuk", 
  "Kabupaten Ngawi", "Kabupaten Pacitan", "Kabupaten Pamekasan", "Kabupaten Pasuruan",
  "Kabupaten Ponorogo", "Kabupaten Probolinggo", "Kabupaten Sampang", "Kabupaten Sidoarjo", 
  "Kabupaten Situbondo", "Kabupaten Sumenep", "Kabupaten Trenggalek", "Kabupaten Tuban", 
  "Kabupaten Tulungagung", "Kota Batu", "Kota Blitar", "Kota Kediri", "Kota Madiun", 
  "Kota Malang", "Kota Mojokerto", "Kota Pasuruan", "Kota Probolinggo", "Kota Surabaya"
];

const PriceTable = ({ commodities }) => {
  const [prices, setPrices] = useState([]);
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [activePrediction, setActivePrediction] = useState(null);
  const [fetchingPrediction, setFetchingPrediction] = useState(false);
  
  // Alert State
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    isConfirm: false,
    onConfirm: null
  });

  const showAlert = (config) => {
    setAlertConfig({ ...config, isOpen: true });
  };

  const closeAlert = () => {
    setAlertConfig({ ...alertConfig, isOpen: false });
  };
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Filters
  const [filters, setFilters] = useState({
    commodity: '',
    region: ''
  });

  const getLocalYYYYMMDD = (dateString) => {
    const d = dateString ? new Date(dateString) : new Date();
    const offset = d.getTimezoneOffset() * 60000;
    return new Date(d.getTime() - offset).toISOString().split('T')[0];
  };

  const [formData, setFormData] = useState({
    commodity_id: '',
    region_id: '',
    price: '',
    date: getLocalYYYYMMDD()
  });

  useEffect(() => {
    fetchRegions();
  }, []);

  useEffect(() => {
    fetchPrices();
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters]);

  useEffect(() => {
    const fetchActivePrediction = async () => {
      if (filters.commodity && filters.region) {
        setFetchingPrediction(true);
        try {
          const response = await predictionService.getPrediction(filters.commodity, filters.region, false);
          const predData = response.data?.data || response.data;
          const predictionsArray = predData?.predictions || (Array.isArray(predData) ? predData : (predData ? [predData] : []));
          if (predictionsArray.length > 0) {
            setActivePrediction(predictionsArray[0]);
          } else {
            setActivePrediction(null);
          }
        } catch (error) {
          console.error('Failed to fetch active prediction:', error);
          setActivePrediction(null);
        } finally {
          setFetchingPrediction(false);
        }
      } else {
        setActivePrediction(null);
      }
    };

    fetchActivePrediction();
  }, [filters]);

  const fetchRegions = async () => {
    try {
      const response = await mapService.getMapData();
      setRegions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
    }
  };

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const response = await priceService.getHistory(filters);
      setPrices(response.data || []);
    } catch (error) {
      console.error('Failed to load prices:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPrices = prices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(prices.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenModal = (price = null) => {
    if (price) {
      setCurrentPrice(price);
      setFormData({
        commodity_id: price.commodity_id,
        region_id: price.region_id,
        price: price.price,
        date: getLocalYYYYMMDD(price.date)
      });
    } else {
      setCurrentPrice(null);
      setFormData({
        commodity_id: commodities[0]?.id || '',
        region_id: regions[0]?.id || '',
        price: '',
        date: getLocalYYYYMMDD()
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (currentPrice) {
        await priceService.update(currentPrice.id, formData);
        showAlert({
          title: 'Record Updated',
          message: 'Price data has been successfully updated.',
          type: 'success'
        });
      } else {
        await priceService.create(formData);
        showAlert({
          title: 'Success!',
          message: 'New price record has been added.',
          type: 'success'
        });
      }
      fetchPrices();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save price record:', error);
      const serverMessage = error.response?.data?.message || 'Could not save price record. Please check your input and connection.';
      showAlert({
        title: 'Error Saving Data',
        message: serverMessage,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };



  const handleDelete = (id) => {
    showAlert({
      title: 'Delete Price Record?',
      message: 'This action cannot be undone. Are you sure?',
      type: 'error',
      isConfirm: true,
      confirmText: 'Delete Record',
      onConfirm: async () => {
        try {
          await priceService.delete(id);
          fetchPrices();
          closeAlert();
          showAlert({
            title: 'Deleted',
            message: 'Price record has been removed.',
            type: 'success'
          });
        } catch (error) {
          console.error('Delete failed:', error);
          const serverMessage = error.response?.data?.message || 'Failed to delete record. Please try again.';
          showAlert({
            title: 'Delete Failed',
            message: serverMessage,
            type: 'error',
            isConfirm: false
          });
        }
      }
    });
  };

  const handleRecalculatePrediction = async () => {
    if (!filters.commodity || !filters.region) return;

    setPredicting(true);
    try {
      const response = await predictionService.getPrediction(filters.commodity, filters.region, true);
      console.log('Prediction API Response:', response);
      const predData = response.data?.data || response.data;
      
      const predictionsArray = predData?.predictions || (Array.isArray(predData) ? predData : (predData ? [predData] : []));
      
      if (predictionsArray.length > 0) {
        const latestPred = predictionsArray[0];
        setActivePrediction(latestPred);
        const formattedPrice = new Intl.NumberFormat('id-ID').format(latestPred.price);
        const formattedDate = new Date(latestPred.date).toLocaleDateString('id-ID', {
          month: 'long',
          year: 'numeric'
        });
        
        showAlert({
          title: 'Prediksi Diperbarui!',
          message: `Model AI berhasil memproses ulang data. Hasil estimasi harga untuk ${filters.commodity} di ${filters.region} pada bulan ${formattedDate} adalah Rp ${formattedPrice}.`,
          type: 'success'
        });
      } else {
        showAlert({
          title: 'Gagal Mendapatkan Prediksi',
          message: 'Model AI berhasil dipanggil, tetapi tidak mengembalikan hasil prediksi yang valid.',
          type: 'warning'
        });
      }
    } catch (error) {
      console.error('Failed to recalculate prediction:', error);
      const errorMessage = error.response?.data?.message || 'Gagal memproses ulang prediksi. Pastikan data historis minimal 36 bulan tersedia.';
      showAlert({
        title: 'Gagal Memperbarui Prediksi',
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setPredicting(false);
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Header & Branding
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.setTextColor(30, 41, 59); // Slate-800
      doc.text("SIPANGAN", 14, 20);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(59, 130, 246); // Blue-500
      doc.text("INTELLIGENCE HUB", 14, 24);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text("Laporan Resmi Analisis Harga Pangan Jawa Timur", 14, 30);
      
      // Right-aligned report metadata
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const todayStr = new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.text(`Tanggal Cetak: ${todayStr}`, 196, 20, { align: 'right' });
      doc.text(`Total Records: ${prices.length}`, 196, 25, { align: 'right' });
      
      // Horizontal line
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.setLineWidth(0.5);
      doc.line(14, 34, 196, 34);
      
      // Print active filters
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // Slate-600
      let filterText = "Filter Terpasang: ";
      if (filters.commodity) filterText += `Komoditas [${filters.commodity}]   `;
      if (filters.region) filterText += `Wilayah [${filters.region}]`;
      if (!filters.commodity && !filters.region) filterText += "Semua Komoditas & Wilayah";
      doc.text(filterText, 14, 41);
      
      // Table Data
      const tableColumn = ["No", "Tanggal", "Wilayah", "Komoditas", "Harga"];
      const tableRows = prices.map((item, index) => [
        index + 1,
        new Date(item.date).toLocaleDateString('id-ID'),
        item.region,
        item.commodity_name || filters.commodity || "Semua Komoditas",
        `Rp ${(parseInt(item.price) || 0).toLocaleString('id-ID')}`
      ]);
      
      autoTable(doc, {
        startY: 46,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { 
          fillColor: [59, 130, 246], // Blue-500 theme to match PriceTable
          textColor: [255, 255, 255],
          fontSize: 9,
          fontStyle: 'bold'
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252] // Slate-50 background for alternate rows
        },
        styles: { 
          font: "helvetica", 
          fontSize: 8,
          cellPadding: 3
        },
        columnStyles: {
          0: { width: 10, halign: 'center' },
          1: { width: 35 },
          2: { width: 55 },
          3: { width: 50 },
          4: { width: 30, halign: 'right' }
        }
      });
      
      // Save PDF
      const filename = `Laporan_Harga_Sipangan_${new Date().toISOString().slice(0,10)}.pdf`;
      doc.save(filename);
      
      showAlert({
        title: 'Berhasil!',
        message: 'Laporan PDF berhasil diunduh.',
        type: 'success'
      });
    } catch (error) {
      console.error('Failed to export PDF:', error);
      showAlert({
        title: 'Gagal!',
        message: 'Terjadi kesalahan saat memproses laporan PDF.',
        type: 'error'
      });
    }
  };

  const commodityOptions = [
    { label: 'All Commodities', value: '' },
    ...commodities.map(c => ({ label: c.name, value: c.name }))
  ];

  const regionOptions = [
    { label: 'All Regions', value: '' },
    ...JAWA_TIMUR_REGIONS.map(r => ({ label: r, value: r }))
  ];

  const modalCommodityOptions = commodities.map(c => ({ label: c.name, value: c.id }));
  const modalRegionOptions = regions.map(r => ({ label: r.name, value: r.id }));

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
        <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2 shrink-0 hidden sm:flex uppercase tracking-wider">
          <TrendingUp className="text-blue-500" size={16} />
          Price Records
        </h2>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5 w-full xl:w-auto">
          {/* Custom Filter UI */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full md:w-auto">
            <div className="w-full sm:w-48">
              <CustomDropdown
                value={filters.commodity}
                onChange={(val) => setFilters({ ...filters, commodity: val })}
                options={commodityOptions}
                placeholder="Commodity"
                icon={Package}
              />
            </div>
            <div className="w-full sm:w-56">
              <CustomDropdown
                value={filters.region}
                onChange={(val) => setFilters({ ...filters, region: val })}
                options={regionOptions}
                placeholder="Region"
                icon={MapPin}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={exportToPDF}
              disabled={loading || prices.length === 0}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 h-[42px] sm:h-[46px] px-3 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5 hover:border-white/10 text-gray-300 hover:text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all active:scale-95 shrink-0"
            >
              <FileText size={14} className="text-blue-500" /> <span>Export PDF</span>
            </button>

            <button
              onClick={() => handleOpenModal()}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 h-[42px] sm:h-[46px] px-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95 shrink-0"
            >
              <Plus size={14} /> <span>New Entry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Prediction Info Banner */}
      {filters.commodity && filters.region && (activePrediction || fetchingPrediction) && (
        <div className="bg-purple-950/20 border border-purple-500/20 backdrop-blur-md rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg shadow-purple-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
              {fetchingPrediction ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <TrendingUp className="w-5 h-5" />
              )}
            </div>
            <div>
              <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Prediksi AI Bulan Depan</p>
              <h3 className="text-sm sm:text-base font-black text-white">
                {fetchingPrediction ? 'Memuat estimasi harga...' : `${filters.commodity} di ${filters.region}`}
              </h3>
            </div>
          </div>
          
          {!fetchingPrediction && activePrediction && (
            <div className="flex flex-row items-center gap-4 text-left sm:text-right">
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                  Estimasi ({new Date(activePrediction.date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })})
                </p>
                <p className="text-base sm:text-lg font-black text-purple-400">
                  Rp {new Intl.NumberFormat('id-ID').format(activePrediction.price)}
                </p>
              </div>
              <button
                onClick={handleRecalculatePrediction}
                disabled={predicting}
                title="Hitung ulang prediksi secara manual"
                className="p-2 bg-white/5 hover:bg-white/10 active:scale-95 text-gray-400 hover:text-white rounded-lg transition-all disabled:opacity-50"
              >
                {predicting ? <Loader2 className="animate-spin w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 border-b border-gray-800">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest w-[110px] sm:w-[180px]">Date</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest">Region</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest text-right w-[100px] sm:w-[150px]">Price</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 text-[10px] sm:text-xs font-black text-gray-400 uppercase tracking-widest text-right w-[90px] sm:w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                      <span className="text-gray-500 text-sm font-medium">Fetching Price History...</span>
                    </div>
                  </td>
                </tr>
              ) : currentPrices.length > 0 ? (
                currentPrices.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex items-center gap-1.5 text-gray-400 text-xs sm:text-sm font-medium">
                        <Calendar size={13} className="text-gray-600 shrink-0" />
                        <span>{new Date(item.date).toLocaleDateString('id-ID')}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-400 font-medium text-xs sm:text-sm">{item.region}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <span className="text-emerald-500 font-black text-xs sm:text-sm">
                        Rp {(parseInt(item.price) || 0).toLocaleString('id-ID')}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5 sm:gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-1.5 sm:p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 sm:p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    No price records found. Try adjusting filters or add a new entry.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI */}
        {!loading && prices.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-white/5 bg-gray-900/30 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Showing <span className="text-white">{indexOfFirstItem + 1}</span> to <span className="text-white">{Math.min(indexOfLastItem, prices.length)}</span> of <span className="text-white">{prices.length}</span> records
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Show only current, first, last, and neighbors if many pages
                  if (
                    totalPages > 7 &&
                    page !== 1 &&
                    page !== totalPages &&
                    Math.abs(page - currentPage) > 1
                  ) {
                    if (Math.abs(page - currentPage) === 2) return <span key={page} className="text-gray-700">...</span>;
                    return null;
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => paginate(page)}
                      className={`
                        w-8 h-8 rounded-lg text-xs font-black transition-all
                        ${currentPage === page 
                          ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' 
                          : 'text-gray-500 hover:bg-white/5 hover:text-white'}
                      `}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 text-gray-500 hover:text-white disabled:opacity-30 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Entry Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentPrice ? 'Edit Price Entry' : 'New Price Entry'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Commodity</label>
              <CustomDropdown
                value={formData.commodity_id}
                onChange={(val) => setFormData({ ...formData, commodity_id: val })}
                options={modalCommodityOptions}
                placeholder="Select Commodity"
                icon={Package}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Region</label>
              <CustomDropdown
                value={formData.region_id}
                onChange={(val) => setFormData({ ...formData, region_id: val })}
                options={modalRegionOptions}
                placeholder="Select Region"
                icon={MapPin}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Price (IDR)</label>
              <input
                type="number"
                required
                placeholder="e.g. 12500"
                className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all placeholder:text-gray-700 font-medium"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Record Date</label>
              <input
                type="date"
                required
                className="w-full bg-white/5 border border-white/5 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-medium"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 text-gray-400 font-bold uppercase tracking-wider text-[11px] hover:bg-white/10 transition-all border border-white/5 h-[42px]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2.5 rounded-xl bg-blue-500 text-white font-bold uppercase tracking-wider text-[11px] hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 h-[42px] flex items-center justify-center gap-2"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                currentPrice ? 'Update' : 'Simpan'
              )}
            </button>
          </div>
        </form>
      </AdminModal>

      <CustomAlert
        {...alertConfig}
        onClose={closeAlert}
      />
    </div>
  );
};

export default PriceTable;
