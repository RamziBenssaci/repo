import { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, Edit, Trash2, Printer, Loader2 } from 'lucide-react';
import { transactionsApi, reportsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface Transaction {
  id: string;
  transactionNumber: string;
  receiveDate: string;
  subject: string;
  type: string;
  senderEntity: string;
  transferredTo: string;
  status: string;
  notes?: string;
}

interface Facility {
  id: number;
  name: string;
}

export default function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);
  const [transactionStatuses, setTransactionStatuses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFacility, setSelectedFacility] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const { toast } = useToast();

  // Fetch all data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        transactionsResponse,
        facilitiesResponse,
        typesResponse,
        statusesResponse
      ] = await Promise.all([
        transactionsApi.getTransactions().catch(error => ({
          success: false,
          data: [],
          message: error.message
        })),
        reportsApi.getFacilities().catch(error => ({
          success: false,
          data: [],
          message: error.message
        })),
        transactionsApi.getTransactionTypes().catch(error => ({
          success: false,
          data: [],
          message: error.message
        })),
        transactionsApi.getTransactionStatuses().catch(error => ({
          success: false,
          data: [],
          message: error.message
        }))
      ]);

      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data);
      } else {
        setTransactions([]);
        toast({
          title: "تعذر تحميل المعاملات",
          description: transactionsResponse.message || "فشل في تحميل بيانات المعاملات",
          variant: "destructive"
        });
      }

      if (facilitiesResponse.success && facilitiesResponse.data) {
        setFacilities(facilitiesResponse.data);
      }

      if (typesResponse.success && typesResponse.data) {
        setTransactionTypes(typesResponse.data);
      } else {
        setTransactionTypes([
          'طلب صيانة',
          'طلب توريد',
          'طلب خدمة',
          'شكوى',
          'استفسار',
          'طلب تطوير'
        ]);
      }

      if (statusesResponse.success && statusesResponse.data) {
        setTransactionStatuses(statusesResponse.data);
      } else {
        setTransactionStatuses([
          'مفتوح تحت الاجراء',
          'منجز',
          'مرفوض'
        ]);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      setTransactions([]);
      setFacilities([]);
      setTransactionTypes([]);
      setTransactionStatuses([]);
      toast({
        title: "خطأ في الاتصال",
        description: "فشل في الاتصال بالخادم",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering
  const filteredTransactions = transactions.filter(transaction => {
    return (
      (searchTerm === '' || 
       transaction.subject.includes(searchTerm) || 
       transaction.transactionNumber.includes(searchTerm) ||
       transaction.senderEntity.includes(searchTerm)) &&
      (selectedFacility === '' || transaction.transferredTo === selectedFacility) &&
      (selectedType === '' || transaction.type === selectedType) &&
      (selectedStatus === '' || transaction.status === selectedStatus)
    );
  });

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المعاملة؟')) return;

    try {
      const response = await transactionsApi.deleteTransaction(transactionId);
      if (response.success) {
        setTransactions(prev => prev.filter(t => t.id !== transactionId));
        toast({
          title: "تم حذف المعاملة",
          description: "تم حذف المعاملة بنجاح",
        });
      } else {
        toast({
          title: "خطأ في الحذف",
          description: response.message || "فشل في حذف المعاملة",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "خطأ في الاتصال",
        description: error.message || "فشل في الاتصال بالخادم",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredTransactions.map(transaction => ({
      'رقم المعاملة': transaction.transactionNumber,
      'تاريخ الاستلام': transaction.receiveDate,
      'موضوع المعاملة': transaction.subject,
      'النوع': transaction.type,
      'الجهة المرسلة': transaction.senderEntity,
      'المحولة إلى': transaction.transferredTo,
      'الحالة': transaction.status,
      'الملاحظات': transaction.notes || ''
    })));
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المعاملات');
    XLSX.writeFile(wb, 'المعاملات_الإدارية.xlsx');
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add Arabic font support
    doc.setFont('helvetica');
    doc.setFontSize(16);
    doc.text('تقرير المعاملات الإدارية', 105, 20, { align: 'center' });
    
    // Prepare data for table
    const tableData = filteredTransactions.map(transaction => [
      transaction.transactionNumber,
      transaction.receiveDate,
      transaction.subject,
      transaction.type,
      transaction.senderEntity,
      transaction.transferredTo,
      transaction.status
    ]);
    
    // Add table
    (doc as any).autoTable({
      head: [['رقم المعاملة', 'تاريخ الاستلام', 'الموضوع', 'النوع', 'الجهة المرسلة', 'المحولة إلى', 'الحالة']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [66, 139, 202] }
    });
    
    doc.save('المعاملات_الإدارية.pdf');
  };

  const handlePrintTransaction = (transaction: Transaction) => {
    const printContent = `
      <div style="direction: rtl; font-family: Arial, sans-serif; padding: 20px;">
        <h2>تقرير معاملة إدارية - ${transaction.transactionNumber}</h2>
        <hr>
        <p><strong>رقم المعاملة:</strong> ${transaction.transactionNumber}</p>
        <p><strong>تاريخ الاستلام:</strong> ${transaction.receiveDate}</p>
        <p><strong>موضوع المعاملة:</strong> ${transaction.subject}</p>
        <p><strong>النوع:</strong> ${transaction.type}</p>
        <p><strong>الجهة المرسلة:</strong> ${transaction.senderEntity}</p>
        <p><strong>المحولة إلى:</strong> ${transaction.transferredTo}</p>
        <p><strong>الحالة:</strong> ${transaction.status}</p>
        <p><strong>الملاحظات:</strong> ${transaction.notes || 'لا توجد ملاحظات'}</p>
      </div>
    `;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">جاري تحميل المعاملات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold text-foreground">قائمة المعاملات الإدارية</h1>
        <p className="text-muted-foreground mt-2">عرض وإدارة جميع المعاملات الإدارية</p>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="admin-header">
          <h2>البحث والتصفية</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="البحث في المعاملات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-2 border border-input rounded-md text-right"
              />
            </div>

            {/* Facility Filter */}
            <select
              value={selectedFacility}
              onChange={(e) => setSelectedFacility(e.target.value)}
              className="w-full p-2 border border-input rounded-md text-right"
            >
              <option value="">جميع الجهات</option>
              {facilities.map(facility => (
                <option key={facility.id} value={facility.name}>{facility.name}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full p-2 border border-input rounded-md text-right"
            >
              <option value="">جميع الأنواع</option>
              {transactionTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-input rounded-md text-right"
            >
              <option value="">جميع الحالات</option>
              {transactionStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-4">
            <button 
              onClick={handleExportExcel}
              className="admin-btn-success flex items-center justify-center gap-2 text-sm"
            >
              <Download size={14} />
              <span className="hidden sm:inline">تصدير Excel</span>
              <span className="sm:hidden">Excel</span>
            </button>
            <button 
              onClick={handleExportPDF}
              className="admin-btn-info flex items-center justify-center gap-2 text-sm"
            >
              <Download size={14} />
              <span className="hidden sm:inline">تصدير PDF</span>
              <span className="sm:hidden">PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="admin-card">
        <div className="admin-header">
          <h2>المعاملات ({filteredTransactions.length})</h2>
        </div>
        <div className="p-4">
          <div className="responsive-table">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-right">
                  <th className="p-3">رقم المعاملة</th>
                  <th className="p-3 mobile-hidden">تاريخ الاستلام</th>
                  <th className="p-3">موضوع المعاملة</th>
                  <th className="p-3 mobile-hidden">النوع</th>
                  <th className="p-3 mobile-hidden">الجهة المرسلة</th>
                  <th className="p-3 mobile-hidden">المحولة إلى</th>
                  <th className="p-3">الحالة</th>
                  <th className="p-3">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-border text-right hover:bg-accent">
                    <td className="p-3 font-medium">{transaction.transactionNumber}</td>
                    <td className="p-3 mobile-hidden">{transaction.receiveDate}</td>
                    <td className="p-3">{transaction.subject}</td>
                    <td className="p-3 mobile-hidden">{transaction.type}</td>
                    <td className="p-3 mobile-hidden">{transaction.senderEntity}</td>
                    <td className="p-3 mobile-hidden">{transaction.transferredTo}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'مفتوح تحت الاجراء' ? 'bg-warning text-warning-foreground' :
                        transaction.status === 'منجز' ? 'bg-success text-success-foreground' :
                        'bg-danger text-danger-foreground'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex gap-1 justify-center">
                        <button className="p-1.5 text-info hover:bg-info/10 rounded" title="عرض">
                          <Eye size={14} />
                        </button>
                        <button className="p-1.5 text-warning hover:bg-warning/10 rounded" title="تعديل">
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handlePrintTransaction(transaction)}
                          className="p-1.5 text-primary hover:bg-primary/10 rounded mobile-hidden" 
                          title="طباعة"
                        >
                          <Printer size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          className="p-1.5 text-danger hover:bg-danger/10 rounded mobile-hidden" 
                          title="حذف"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredTransactions.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              {transactions.length === 0 ? 
                "لا توجد معاملات في النظام" : 
                "لا توجد معاملات تطابق معايير البحث"
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}