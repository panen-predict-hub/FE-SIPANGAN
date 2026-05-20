import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Loader2, Package, Calendar, Search, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import AdminModal from './AdminModal';
import CustomAlert from '../../../components/CustomAlert';
import { commodityService } from '../../../api/services';

const CommodityTable = ({ commodities, loading, onRefresh }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCommodity, setCurrentCommodity] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: 'kg',
    waspada_percentage: 10,
    kritis_percentage: 25,
    het_nominal: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  const handleOpenModal = (commodity = null) => {
    if (commodity) {
      setCurrentCommodity(commodity);
      setFormData({
        name: commodity.name,
        unit: commodity.unit || 'kg',
        waspada_percentage: commodity.waspada_percentage !== undefined && commodity.waspada_percentage !== null ? commodity.waspada_percentage : 10,
        kritis_percentage: commodity.kritis_percentage !== undefined && commodity.kritis_percentage !== null ? commodity.kritis_percentage : 25,
        het_nominal: commodity.het_nominal !== undefined && commodity.het_nominal !== null ? commodity.het_nominal : ''
      });
    } else {
      setCurrentCommodity(null);
      setFormData({
        name: '',
        unit: 'kg',
        waspada_percentage: 10,
        kritis_percentage: 25,
        het_nominal: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const thresholdData = {
        waspada_percentage: Number(formData.waspada_percentage),
        kritis_percentage: Number(formData.kritis_percentage),
        het_nominal: formData.het_nominal !== '' && formData.het_nominal !== null && formData.het_nominal !== undefined ? Number(formData.het_nominal) : null
      };

      if (currentCommodity) {
        await commodityService.update(currentCommodity.id, { name: formData.name, unit: formData.unit });
        await commodityService.updateThreshold(currentCommodity.id, thresholdData);
        showAlert({
          title: 'Berhasil!',
          message: 'Data komoditas dan threshold berhasil diperbarui.',
          type: 'success'
        });
      } else {
        const response = await commodityService.create({ name: formData.name, unit: formData.unit });
        const newId = response.data?.data?.id;
        if (newId) {
          await commodityService.updateThreshold(newId, thresholdData);
        }
        showAlert({
          title: 'Berhasil!',
          message: 'Komoditas baru beserta threshold berhasil ditambahkan.',
          type: 'success'
        });
      }
      onRefresh();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save commodity and threshold:', error);
      const serverMessage = error.response?.data?.message || 'Failed to save commodity. Please try again.';
      showAlert({
        title: 'Error!',
        message: serverMessage,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    showAlert({
      title: 'Delete Commodity?',
      message: 'Are you sure you want to delete this commodity? All associated price data might be affected.',
      type: 'error',
      isConfirm: true,
      confirmText: 'Delete Now',
      onConfirm: async () => {
        try {
          await commodityService.delete(id);
          onRefresh();
          closeAlert();
          showAlert({
            title: 'Deleted!',
            message: 'Commodity has been removed.',
            type: 'success'
          });
        } catch (error) {
          console.error('Delete failed:', error);
          const serverMessage = error.response?.data?.message || 'Could not delete commodity. It might be in use.';
          showAlert({
            title: 'Action Failed',
            message: serverMessage,
            type: 'error',
            isConfirm: false
          });
        }
      }
    });
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
      doc.setTextColor(16, 185, 129); // Emerald-500
      doc.text("INTELLIGENCE HUB", 14, 24);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139); // Slate-500
      doc.text("Katalog Resmi Komoditas Pangan Jawa Timur", 14, 30);
      
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
      doc.text(`Total Komoditas: ${filteredCommodities.length}`, 196, 25, { align: 'right' });
      
      // Horizontal line
      doc.setDrawColor(226, 232, 240); // Slate-200
      doc.setLineWidth(0.5);
      doc.line(14, 34, 196, 34);
      
      // Print active filters
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105); // Slate-600
      let filterText = "Pencarian: ";
      if (searchTerm) filterText += `"${searchTerm}"`;
      else filterText += "Semua Komoditas";
      doc.text(filterText, 14, 41);
      
      // Table Data
      const tableColumn = ["No", "Tanggal Input", "Nama Komoditas", "Satuan Ukur"];
      const tableRows = filteredCommodities.map((item, index) => [
        index + 1,
        new Date(item.created_at || item.date || Date.now()).toLocaleDateString('id-ID'),
        item.name,
        item.unit || 'kg'
      ]);
      
      autoTable(doc, {
        startY: 46,
        head: [tableColumn],
        body: tableRows,
        theme: 'striped',
        headStyles: { 
          fillColor: [16, 185, 129], // Emerald-500 theme to match CommodityTable
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
          0: { width: 15, halign: 'center' },
          1: { width: 45 },
          2: { width: 95 },
          3: { width: 30, halign: 'right' }
        }
      });
      
      // Save PDF
      const filename = `Katalog_Komoditas_Sipangan_${new Date().toISOString().slice(0,10)}.pdf`;
      doc.save(filename);
      
      showAlert({
        title: 'Berhasil!',
        message: 'Laporan Katalog PDF berhasil diunduh.',
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

  const filteredCommodities = commodities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCommodities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCommodities.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-4">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 shrink-0">
          <Package className="text-emerald-500" size={20} />
          Commodity Catalog
        </h2>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full xl:w-auto">
          {/* Matching filter container style from PriceTable */}
          <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1 bg-white/5 border border-white/5 rounded-2xl w-full md:w-auto">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Search commodity name..."
                className="w-full bg-transparent border-none pl-12 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <button
            onClick={exportToPDF}
            disabled={loading || filteredCommodities.length === 0}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed border border-white/5 hover:border-white/10 text-gray-300 hover:text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all active:scale-95 shrink-0"
          >
            <FileText size={18} className="text-emerald-500" /> <span>Export PDF</span>
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0"
          >
            <Plus size={18} /> Add Commodity
          </button>
        </div>
      </div>

      <div className="bg-white/5 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left">
            <thead className="bg-gray-900/50 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[140px]">Date</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest w-[200px]">Threshold & HET</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right w-[100px]">Unit</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right w-[120px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                      <span className="text-gray-500 text-sm font-medium">Synchronizing Catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <Calendar size={14} className="text-gray-600" />
                        {new Date(item.created_at || item.updated_at || Date.now()).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-white font-bold tracking-tight">{item.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5 text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-500/90 font-semibold bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded text-[10px]" title="Threshold Waspada">
                            ⚠️ {item.waspada_percentage !== null && item.waspada_percentage !== undefined ? `${item.waspada_percentage}%` : '10%'}
                          </span>
                          <span className="text-rose-500/90 font-semibold bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.5 rounded text-[10px]" title="Threshold Kritis">
                            🚨 {item.kritis_percentage !== null && item.kritis_percentage !== undefined ? `${item.kritis_percentage}%` : '25%'}
                          </span>
                        </div>
                        {item.het_nominal ? (
                          <span className="text-emerald-400/90 font-bold text-[11px] mt-0.5">
                            HET: Rp {Number(item.het_nominal).toLocaleString('id-ID')}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic text-[10px] mt-0.5">
                            Tanpa HET
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 font-medium text-right lowercase">{item.unit || 'kg'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No commodities found. Start by adding a new one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination UI - Matches PriceTable */}
        {!loading && filteredCommodities.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-white/5 bg-gray-900/30 flex items-center justify-between">
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">
              Showing <span className="text-white">{indexOfFirstItem + 1}</span> to <span className="text-white">{Math.min(indexOfLastItem, filteredCommodities.length)}</span> of <span className="text-white">{filteredCommodities.length}</span> items
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
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => paginate(i + 1)}
                    className={`
                      w-8 h-8 rounded-lg text-xs font-black transition-all
                      ${currentPage === i + 1 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                        : 'text-gray-500 hover:bg-white/5 hover:text-white'}
                    `}
                  >
                    {i + 1}
                  </button>
                ))}
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

      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentCommodity ? 'Edit Commodity' : 'New Commodity'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Commodity Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Beras Premium"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest">Measurement Unit</label>
            <input
              type="text"
              required
              placeholder="e.g. kg, liter, ikat"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            />
            <p className="text-[10px] text-gray-500 italic mt-1">* Backend requires unit (e.g. "kg")</p>
          </div>

          <div className="border-t border-gray-800/60 pt-4 my-4">
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">Pengaturan Threshold & HET</p>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <span>⚠️ Batas Waspada</span>
                  <span className="text-[10px] font-normal lowercase text-gray-600">(%)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  placeholder="10"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  value={formData.waspada_percentage}
                  onChange={(e) => setFormData({ ...formData, waspada_percentage: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <span>🚨 Batas Kritis</span>
                  <span className="text-[10px] font-normal lowercase text-gray-600">(%)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  required
                  placeholder="25"
                  className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
                  value={formData.kritis_percentage}
                  onChange={(e) => setFormData({ ...formData, kritis_percentage: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-gray-500 uppercase tracking-widest flex items-center gap-1">
              <span>💵 Nominal HAP / HET</span>
              <span className="text-[10px] font-normal lowercase text-gray-600">(Rp)</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 14500 (kosongkan jika tidak ada)"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
              value={formData.het_nominal}
              onChange={(e) => setFormData({ ...formData, het_nominal: e.target.value })}
            />
            <p className="text-[10px] text-gray-500 italic mt-1">* Melampaui HET otomatis memicu status "Kritis"</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black uppercase tracking-widest py-4 rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                currentCommodity ? 'Update Commodity' : 'Create Commodity'
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

export default CommodityTable;
