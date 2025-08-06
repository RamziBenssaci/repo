import { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { transactionsApi, reportsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Facility {
  id: number;
  name: string;
}

export default function NewTransaction() {
  const [formData, setFormData] = useState({
    transactionNumber: '',
    receiveDate: '',
    subject: '',
    type: '',
    senderEntity: '',
    transferredTo: '',
    status: 'مفتوح تحت الاجراء',
    notes: ''
  });

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [facilitiesLoading, setFacilitiesLoading] = useState(true);
  const [savedTransactionId, setSavedTransactionId] = useState<string | null>(null);
  const [transferHistory, setTransferHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const { toast } = useToast();

  // Fetch facilities and transaction types on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facilitiesResponse, typesResponse] = await Promise.all([
          reportsApi.getFacilities().catch(error => ({
            success: false,
            data: [],
            message: error.message
          })),
          transactionsApi.getTransactionTypes().catch(error => ({
            success: false,
            data: [],
            message: error.message
          }))
        ]);

        if (facilitiesResponse.success && facilitiesResponse.data) {
          setFacilities(facilitiesResponse.data);
        }

        if (typesResponse.success && typesResponse.data) {
          setTransactionTypes(typesResponse.data);
        } else {
          // Fallback to default types if API fails
          setTransactionTypes([
            'طلب صيانة',
            'طلب توريد',
            'طلب خدمة',
            'شكوى',
            'استفسار',
            'طلب تطوير'
          ]);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        // Set fallback data
        setFacilities([]);
        setTransactionTypes([
          'طلب صيانة',
          'طلب توريد',
          'طلب خدمة',
          'شكوى',
          'استفسار',
          'طلب تطوير'
        ]);
      } finally {
        setFacilitiesLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch transfer history when transaction is saved
  useEffect(() => {
    if (savedTransactionId) {
      fetchTransferHistory();
    }
  }, [savedTransactionId]);

  const fetchTransferHistory = async () => {
    if (!savedTransactionId) return;
    
    try {
      setHistoryLoading(true);
      const response = await transactionsApi.getTransactionHistory(savedTransactionId);
      if (response.success && response.data) {
        setTransferHistory(response.data);
      } else {
        setTransferHistory([]);
      }
    } catch (error) {
      console.error('Error fetching transfer history:', error);
      setTransferHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await transactionsApi.createTransaction(formData);
      
      if (response.success) {
        setSavedTransactionId(response.data?.id || '1');
        toast({
          title: "تم إنشاء المعاملة بنجاح",
          description: "تم حفظ المعاملة الجديدة في النظام",
        });
        
        // Reset form
        setFormData({
          transactionNumber: '',
          receiveDate: '',
          subject: '',
          type: '',
          senderEntity: '',
          transferredTo: '',
          status: 'مفتوح تحت الاجراء',
          notes: ''
        });
      } else {
        toast({
          title: "خطأ في إنشاء المعاملة",
          description: response.message || "فشل في حفظ المعاملة",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      console.error('Error creating transaction:', error);
      toast({
        title: "خطأ في الاتصال",
        description: error.message || "فشل في الاتصال بالخادم",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold text-foreground">إنشاء معاملة جديدة</h1>
        <p className="text-muted-foreground mt-2">إضافة معاملة إدارية جديدة للمتابعة</p>
      </div>

      <div className="admin-card">
        <div className="admin-header">
          <h2>بيانات المعاملة</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">رقم المعاملة *</label>
                <input
                  type="text"
                  value={formData.transactionNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, transactionNumber: e.target.value }))}
                  className="w-full p-3 border border-input rounded-md text-right"
                  placeholder="رقم المعاملة"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">تاريخ الاستلام *</label>
                <input
                  type="date"
                  value={formData.receiveDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, receiveDate: e.target.value }))}
                  className="w-full p-3 border border-input rounded-md text-right"
                  required
                />
              </div>
            </div>

            {/* Subject and Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">موضوع المعاملة *</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full p-3 border border-input rounded-md text-right"
                  placeholder="موضوع المعاملة"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">نوع المعاملة *</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-input rounded-md text-right"
                  required
                >
                  <option value="">اختر نوع المعاملة</option>
                  {transactionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sender and Receiver */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الجهة المرسلة *</label>
                <input
                  type="text"
                  value={formData.senderEntity}
                  onChange={(e) => setFormData(prev => ({ ...prev, senderEntity: e.target.value }))}
                  className="w-full p-3 border border-input rounded-md text-right"
                  placeholder="الجهة المرسلة"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-right">الجهة المحول لها *</label>
                <select
                  value={formData.transferredTo}
                  onChange={(e) => setFormData(prev => ({ ...prev, transferredTo: e.target.value }))}
                  className="w-full p-3 border border-input rounded-md text-right"
                  required
                  disabled={facilitiesLoading}
                >
                  <option value="">
                    {facilitiesLoading ? "جاري تحميل الجهات..." : "اختر الجهة المحول لها"}
                  </option>
                  {facilities.map(facility => (
                    <option key={facility.id} value={facility.name}>{facility.name}</option>
                  ))}
                  <option value="قسم الصيانة الطبية">قسم الصيانة الطبية</option>
                  <option value="قسم الصيانة العامة">قسم الصيانة العامة</option>
                  <option value="قسم التموين">قسم التموين</option>
                  <option value="قسم الأمن والسلامة">قسم الأمن والسلامة</option>
                  <option value="قسم تقنية المعلومات">قسم تقنية المعلومات</option>
                </select>
              </div>
            </div>

            {/* Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-right">حالة المعاملة</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-3 border border-input rounded-md text-right"
                >
                  <option value="مفتوح تحت الاجراء">مفتوح تحت الاجراء</option>
                  <option value="منجز">منجز</option>
                  <option value="مرفوض">مرفوض</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium mb-2 text-right">ملاحظات</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full p-3 border border-input rounded-md text-right"
                rows={4}
                placeholder="ملاحظات إضافية حول المعاملة..."
              />
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                disabled={loading}
                className="admin-btn-success flex items-center gap-2 px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                {loading ? 'جاري الحفظ...' : 'حفظ المعاملة'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Transfer History Section */}
      <div className="admin-card">
        <div className="admin-header">
          <h2>تاريخ التحويلات</h2>
        </div>
        <div className="p-4">
          {!savedTransactionId ? (
            <p className="text-muted-foreground text-center">
              سيتم عرض تاريخ تحويلات المعاملة هنا بعد الحفظ
            </p>
          ) : historyLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="mr-2">جاري تحميل التاريخ...</span>
            </div>
          ) : transferHistory.length === 0 ? (
            <p className="text-muted-foreground text-center">
              لا توجد تحويلات لهذه المعاملة حتى الآن
            </p>
          ) : (
            <div className="space-y-3">
              {transferHistory.map((item, index) => (
                <div key={index} className="border border-border rounded-lg p-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="font-medium">التاريخ:</span> {item.date}
                    </div>
                    <div>
                      <span className="font-medium">من:</span> {item.from}
                    </div>
                    <div>
                      <span className="font-medium">إلى:</span> {item.to}
                    </div>
                    {item.notes && (
                      <div className="md:col-span-3">
                        <span className="font-medium">ملاحظات:</span> {item.notes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}