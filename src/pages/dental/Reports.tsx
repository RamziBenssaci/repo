import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Filter, Users, Loader2 } from 'lucide-react';
import { dentalContractsApi } from '@/lib/api';
import { exportToExcel, exportToPDF } from '@/utils/exportUtils';
import { toast } from 'sonner';

// Mock data for dental contracts
const mockContracts = [
  {
    id: 'CONT-001',
    itemNumber: 'DENT-001',
    itemName: 'كرسي الأسنان المتطور',
    beneficiary: 'عيادة الأسنان - المبنى الرئيسي',
    supplier: 'شركة التجهيزات الطبية المتقدمة',
    status: 'تم التعاقد',
    totalCost: 85000,
    orderDate: '2024-01-15',
    deliveryDate: '2024-02-15'
  },
  {
    id: 'CONT-002',
    itemNumber: 'DENT-002',
    itemName: 'جهاز الأشعة السينية للأسنان',
    beneficiary: 'مركز طب الأسنان التخصصي',
    supplier: 'مؤسسة الأجهزة التشخيصية',
    status: 'موافق عليه',
    totalCost: 120000,
    orderDate: '2024-01-20',
    deliveryDate: '2024-02-20'
  },
  {
    id: 'CONT-003',
    itemNumber: 'DENT-003',
    itemName: 'أدوات تقويم الأسنان',
    beneficiary: 'قسم تقويم الأسنان',
    supplier: 'شركة الأدوات الطبية المتخصصة',
    status: 'تم التسليم',
    totalCost: 45000,
    orderDate: '2024-01-10',
    deliveryDate: '2024-01-25'
  },
  {
    id: 'CONT-004',
    itemNumber: 'DENT-004',
    itemName: 'جهاز تنظيف الأسنان بالموجات فوق الصوتية',
    beneficiary: 'عيادة الأسنان العامة',
    supplier: 'شركة التجهيزات الطبية المتقدمة',
    status: 'مرفوض',
    totalCost: 25000,
    orderDate: '2024-01-12',
    deliveryDate: null
  }
];

const statusConfig = {
  'جديد': 'bg-blue-100 text-blue-800',
  'موافق عليه': 'bg-yellow-100 text-yellow-800',
  'تم التعاقد': 'bg-purple-100 text-purple-800',
  'تم التسليم': 'bg-green-100 text-green-800',
  'مرفوض': 'bg-red-100 text-red-800'
};

export default function DentalReports() {
  const [allContracts, setAllContracts] = useState<any[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<any[]>([]);
  const [reportType, setReportType] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [itemFilter, setItemFilter] = useState('');
  const [facilityFilter, setFacilityFilter] = useState('all');
  const [supplierFilter, setSupplierFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);

  // Fetch reports data from API
  const fetchReportsData = async (selectedReportType?: string) => {
    setLoading(true);
    try {
      const response = await dentalContractsApi.getReportsData(selectedReportType);
      if (response.success && response.data) {
        setAllContracts(response.data);
        applyFilters(response.data);
        setReportGenerated(true);
        toast.success('تم إنشاء التقرير بنجاح');
      } else {
        // Fallback to mock data if API fails
        setAllContracts(mockContracts);
        applyFilters(mockContracts);
        setReportGenerated(true);
        toast.error('فشل في جلب البيانات من الخادم، سيتم عرض البيانات التجريبية');
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
      // Fallback to mock data
      setAllContracts(mockContracts);
      applyFilters(mockContracts);
      setReportGenerated(true);
      toast.error('فشل في جلب البيانات من الخادم، سيتم عرض البيانات التجريبية');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (dataToFilter = allContracts) => {
    let filtered = [...dataToFilter];

    if (statusFilter && statusFilter !== 'all') {
      filtered = filtered.filter(contract => contract.status === statusFilter);
    }

    if (itemFilter) {
      filtered = filtered.filter(contract => 
        contract.itemNumber?.toLowerCase().includes(itemFilter.toLowerCase()) || 
        contract.itemName?.toLowerCase().includes(itemFilter.toLowerCase())
      );
    }

    if (facilityFilter && facilityFilter !== 'all') {
      filtered = filtered.filter(contract => contract.beneficiary === facilityFilter);
    }

    if (supplierFilter && supplierFilter !== 'all') {
      filtered = filtered.filter(contract => contract.supplier === supplierFilter);
    }

    setFilteredContracts(filtered);
  };

  // Apply filters when filter values change
  useEffect(() => {
    if (allContracts.length > 0) {
      applyFilters();
    }
  }, [statusFilter, itemFilter, facilityFilter, supplierFilter, allContracts]);

  const clearFilters = () => {
    setStatusFilter('all');
    setItemFilter('');
    setFacilityFilter('all');
    setSupplierFilter('all');
    if (allContracts.length > 0) {
      setFilteredContracts(allContracts);
    }
  };

  const handleExportToExcel = async () => {
    if (filteredContracts.length === 0) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    try {
      const exportData = filteredContracts.map(contract => ({
        'رقم العقد': contract.id,
        'رقم المعدة': contract.itemNumber,
        'اسم المعدة': contract.itemName,
        'العيادة المستفيدة': contract.beneficiary,
        'الشركة الموردة': contract.supplier,
        'الحالة': contract.status,
        'التكلفة (ريال)': contract.totalCost,
        'تاريخ العقد': contract.orderDate,
        'تاريخ التسليم': contract.deliveryDate || 'لم يتم التسليم بعد'
      }));

      await exportToExcel(exportData, 'تقرير_عقود_الأسنان');
      toast.success('تم تصدير التقرير إلى Excel بنجاح');
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('فشل في تصدير التقرير إلى Excel');
    }
  };

  const handleExportToPDF = async () => {
    if (filteredContracts.length === 0) {
      toast.error('لا توجد بيانات للتصدير');
      return;
    }

    try {
      const exportData = filteredContracts.map(contract => ({
        id: contract.id,
        itemNumber: contract.itemNumber,
        itemName: contract.itemName,
        facilityName: contract.beneficiary,
        supplier: contract.supplier,
        status: contract.status,
        totalCost: contract.totalCost,
        reportDate: contract.orderDate
      }));

      await exportToPDF(exportData, 'تقرير_عقود_الأسنان', 'direct-purchase');
      toast.success('تم تصدير التقرير إلى PDF بنجاح');
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast.error('فشل في تصدير التقرير إلى PDF');
    }
  };

  const generateReport = async () => {
    if (!reportType) {
      toast.error('يرجى اختيار نوع التقرير');
      return;
    }
    await fetchReportsData(reportType);
  };

  return (
    <div className="p-4 md:p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-right">تقارير عقود الأسنان</h1>
            <p className="text-purple-100 mt-1 text-right">إنشاء وعرض تقارير مفصلة لعقود معدات طب الأسنان</p>
          </div>
        </div>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">نوع التقرير المطلوب</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="اختر نوع التقرير" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-contracts">تقرير بجميع عقود الأسنان</SelectItem>
              <SelectItem value="by-status">تقرير حسب حالة العقود</SelectItem>
              <SelectItem value="by-item">تقرير حسب رقم المعدة أو اسم المعدة</SelectItem>
              <SelectItem value="by-facility-supplier">تقرير لكل عيادة وشركة موردة معينة</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Filter className="h-5 w-5" />
            فلاتر التقرير
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">حالة العقد</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="جديد">جديد</SelectItem>
                  <SelectItem value="موافق عليه">موافق عليه</SelectItem>
                  <SelectItem value="تم التعاقد">تم التعاقد</SelectItem>
                  <SelectItem value="تم التسليم">تم التسليم</SelectItem>
                  <SelectItem value="مرفوض">مرفوض</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">رقم أو اسم المعدة</label>
              <Input
                placeholder="أدخل رقم أو اسم المعدة"
                value={itemFilter}
                onChange={(e) => setItemFilter(e.target.value)}
                className="text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">العيادة/القسم</label>
              <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر العيادة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع العيادات</SelectItem>
                  <SelectItem value="عيادة الأسنان - المبنى الرئيسي">عيادة الأسنان - المبنى الرئيسي</SelectItem>
                  <SelectItem value="مركز طب الأسنان التخصصي">مركز طب الأسنان التخصصي</SelectItem>
                  <SelectItem value="قسم تقويم الأسنان">قسم تقويم الأسنان</SelectItem>
                  <SelectItem value="عيادة الأسنان العامة">عيادة الأسنان العامة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">الشركة الموردة</label>
              <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الشركة الموردة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الشركات</SelectItem>
                  <SelectItem value="شركة التجهيزات الطبية المتقدمة">شركة التجهيزات الطبية المتقدمة</SelectItem>
                  <SelectItem value="مؤسسة الأجهزة التشخيصية">مؤسسة الأجهزة التشخيصية</SelectItem>
                  <SelectItem value="شركة الأدوات الطبية المتخصصة">شركة الأدوات الطبية المتخصصة</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 lg:col-span-1 flex gap-2">
              <Button onClick={generateReport} className="flex-1" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  'إنشاء التقرير'
                )}
              </Button>
              <Button variant="outline" onClick={clearFilters} disabled={!reportGenerated}>
                مسح الفلاتر
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Buttons */}
      {reportGenerated && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">تصدير التقرير</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContracts.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted-foreground">لا توجد بيانات للتصدير</p>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button 
                  onClick={handleExportToExcel} 
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير إلى Excel
                </Button>
                <Button 
                  onClick={handleExportToPDF} 
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Download className="w-4 h-4 ml-2" />
                  تصدير إلى PDF
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!reportGenerated && (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-muted-foreground">لا توجد بيانات حالياً. يرجى اختيار نوع التقرير وإنشاء التقرير أولاً.</p>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {reportGenerated && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">نتائج التقرير</CardTitle>
            <p className="text-muted-foreground text-right">
              إجمالي العقود: {filteredContracts.length} | 
              إجمالي التكلفة: {filteredContracts.reduce((sum, contract) => sum + (contract.totalCost || 0), 0).toLocaleString()} ريال
            </p>
          </CardHeader>
          <CardContent>
            {filteredContracts.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">لا توجد عقود تطابق المعايير المحددة</p>
              </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-right">
                    <thead>
                      <tr className="border-b">
                        <th className="p-2 text-right">رقم العقد</th>
                        <th className="p-2 text-right">رقم المعدة</th>
                        <th className="p-2 text-right">اسم المعدة</th>
                        <th className="p-2 text-right">العيادة المستفيدة</th>
                        <th className="p-2 text-right">الشركة الموردة</th>
                        <th className="p-2 text-right">الحالة</th>
                        <th className="p-2 text-right">التكلفة</th>
                        <th className="p-2 text-right">تاريخ العقد</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredContracts.map((contract) => (
                        <tr key={contract.id} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-medium">{contract.id}</td>
                          <td className="p-2">{contract.itemNumber}</td>
                          <td className="p-2">{contract.itemName}</td>
                          <td className="p-2">{contract.beneficiary}</td>
                          <td className="p-2">{contract.supplier}</td>
                          <td className="p-2">
                            <Badge className={statusConfig[contract.status as keyof typeof statusConfig] || 'bg-gray-100 text-gray-800'}>
                              {contract.status}
                            </Badge>
                          </td>
                          <td className="p-2">{(contract.totalCost || 0).toLocaleString()} ريال</td>
                          <td className="p-2">{contract.orderDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {filteredContracts.map((contract) => (
                <Card key={contract.id}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Badge className={statusConfig[contract.status as keyof typeof statusConfig]}>
                          {contract.status}
                        </Badge>
                        <span className="font-bold">{contract.id}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <p><strong>المعدة:</strong> {contract.itemName}</p>
                        <p><strong>العيادة المستفيدة:</strong> {contract.beneficiary}</p>
                        <p><strong>الشركة الموردة:</strong> {contract.supplier}</p>
                        <p><strong>التكلفة:</strong> {contract.totalCost.toLocaleString()} ريال</p>
                        <p><strong>تاريخ العقد:</strong> {contract.orderDate}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}