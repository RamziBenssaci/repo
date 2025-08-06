import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Clock, CheckCircle, XCircle, AlertTriangle, DollarSign, TrendingUp, Loader2, FileX } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { dentalContractsApi } from '@/lib/api';
import { toast } from 'sonner';

// Mock data as fallback
const mockDentalData = {
  total: 125,
  new: 8,
  approved: 25,
  contracted: 67,
  delivered: 18,
  rejected: 7,
  totalValue: 1850000
};

const mockStatusData = [
  { name: 'جديد', value: 8, color: '#3b82f6' },
  { name: 'موافق عليه', value: 25, color: '#f59e0b' },
  { name: 'تم التعاقد', value: 67, color: '#8b5cf6' },
  { name: 'تم التسليم', value: 18, color: '#10b981' },
  { name: 'مرفوض', value: 7, color: '#ef4444' }
];

const mockMonthlyData = [
  { month: 'يناير', contracts: 32, value: 485000 },
  { month: 'فبراير', contracts: 28, value: 420000 },
  { month: 'مارس', contracts: 35, value: 560000 },
  { month: 'أبريل', contracts: 30, value: 385000 }
];

const mockTopSuppliers = [
  { name: 'شركة التجهيزات الطبية المتقدمة', contracts: 35, value: 650000 },
  { name: 'مؤسسة الأجهزة التشخيصية', contracts: 28, value: 485000 },
  { name: 'شركة الأدوات الطبية المتخصصة', contracts: 22, value: 380000 },
  { name: 'مجموعة أجهزة طب الأسنان', contracts: 18, value: 335000 }
];

const mockTopClinics = [
  { name: 'عيادة الأسنان - المبنى الرئيسي', contracts: 42, value: 720000 },
  { name: 'مركز طب الأسنان التخصصي', contracts: 35, value: 580000 },
  { name: 'قسم تقويم الأسنان', contracts: 28, value: 450000 },
  { name: 'عيادة الأسنان العامة', contracts: 20, value: 300000 }
];

export default function DentalDashboard() {
  // State management
  const [dashboardData, setDashboardData] = useState(mockDentalData);
  const [statusData, setStatusData] = useState(mockStatusData);
  const [monthlyData, setMonthlyData] = useState(mockMonthlyData);
  const [topSuppliers, setTopSuppliers] = useState(mockTopSuppliers);
  const [topClinics, setTopClinics] = useState(mockTopClinics);
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [suppliersLoading, setSuppliersLoading] = useState(true);
  const [clinicsLoading, setClinicsLoading] = useState(true);
  
  // Filter states
  const [selectedClinic, setSelectedClinic] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState('');

  // Fetch dashboard data on component mount
  useEffect(() => {
    fetchDashboardData();
    fetchTopSuppliers();
    fetchTopClinics();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dentalContractsApi.getDashboardData();
      if (response.success && response.data) {
        const data = response.data;
        setDashboardData(data.summary || mockDentalData);
        setStatusData(data.statusData || mockStatusData);
        setMonthlyData(data.monthlyData || mockMonthlyData);
        setAllData(data.contracts || []);
        setFilteredData(data.contracts || []);
      } else {
        // Use mock data as fallback
        setDashboardData(mockDentalData);
        setStatusData(mockStatusData);
        setMonthlyData(mockMonthlyData);
        setAllData([]);
        setFilteredData([]);
        toast.error('فشل في جلب بيانات لوحة التحكم، سيتم عرض البيانات التجريبية');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(mockDentalData);
      setStatusData(mockStatusData);
      setMonthlyData(mockMonthlyData);
      setAllData([]);
      setFilteredData([]);
      toast.error('فشل في الاتصال بالخادم، سيتم عرض البيانات التجريبية');
    } finally {
      setLoading(false);
    }
  };

  const fetchTopSuppliers = async () => {
    setSuppliersLoading(true);
    try {
      const response = await dentalContractsApi.getTopSuppliers();
      if (response.success && response.data) {
        setTopSuppliers(response.data);
      } else {
        setTopSuppliers(mockTopSuppliers);
        toast.error('فشل في جلب بيانات أفضل الشركات الموردة');
      }
    } catch (error) {
      console.error('Error fetching top suppliers:', error);
      setTopSuppliers(mockTopSuppliers);
    } finally {
      setSuppliersLoading(false);
    }
  };

  const fetchTopClinics = async () => {
    setClinicsLoading(true);
    try {
      const response = await dentalContractsApi.getTopClinics();
      if (response.success && response.data) {
        setTopClinics(response.data);
      } else {
        setTopClinics(mockTopClinics);
        toast.error('فشل في جلب بيانات أكثر العيادات نشاطاً');
      }
    } catch (error) {
      console.error('Error fetching top clinics:', error);
      setTopClinics(mockTopClinics);
    } finally {
      setClinicsLoading(false);
    }
  };

  // Client-side filtering with real data
  const applyFilters = () => {
    let filtered = [...allData];

    if (selectedClinic) {
      filtered = filtered.filter(item => 
        item.clinic?.toLowerCase().includes(selectedClinic.toLowerCase()) ||
        item.beneficiary?.toLowerCase().includes(selectedClinic.toLowerCase())
      );
    }

    if (selectedEquipment) {
      filtered = filtered.filter(item => 
        item.itemNumber?.toLowerCase().includes(selectedEquipment.toLowerCase()) ||
        item.itemName?.toLowerCase().includes(selectedEquipment.toLowerCase())
      );
    }

    if (selectedSupplier) {
      filtered = filtered.filter(item => 
        item.supplier?.toLowerCase().includes(selectedSupplier.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedClinic, selectedEquipment, selectedSupplier, allData]);

  const handleFilter = () => {
    applyFilters();
    toast.success('تم تطبيق الفلاتر بنجاح');
  };

  const clearFilters = () => {
    setSelectedClinic('');
    setSelectedEquipment('');
    setSelectedSupplier('');
    setFilteredData(allData);
    toast.success('تم مسح الفلاتر');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8" />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-right">لوحة تحكم عقود الأسنان</h1>
            <p className="text-purple-100 mt-1 text-right">إدارة شاملة لعقود معدات طب الأسنان</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">فلاتر البحث</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={selectedClinic} onValueChange={setSelectedClinic}>
              <SelectTrigger>
                <SelectValue placeholder="اختر العيادة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="عيادة الأسنان - المبنى الرئيسي">عيادة الأسنان - المبنى الرئيسي</SelectItem>
                <SelectItem value="مركز طب الأسنان التخصصي">مركز طب الأسنان التخصصي</SelectItem>
                <SelectItem value="قسم تقويم الأسنان">قسم تقويم الأسنان</SelectItem>
                <SelectItem value="عيادة الأسنان العامة">عيادة الأسنان العامة</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="رقم أو اسم المعدة"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
            />

            <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الشركة الموردة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="شركة التجهيزات الطبية المتقدمة">شركة التجهيزات الطبية المتقدمة</SelectItem>
                <SelectItem value="مؤسسة الأجهزة التشخيصية">مؤسسة الأجهزة التشخيصية</SelectItem>
                <SelectItem value="شركة الأدوات الطبية المتخصصة">شركة الأدوات الطبية المتخصصة</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Button onClick={handleFilter} className="flex-1">
                تطبيق الفلتر
              </Button>
              <Button variant="outline" onClick={clearFilters}>
                مسح
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-purple-600">إجمالي العقود</p>
                {loading ? (
                  <div className="flex items-center justify-end">
                    <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-purple-800">{dashboardData.total}</p>
                )}
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-yellow-600">عقود جديدة</p>
                {loading ? (
                  <div className="flex items-center justify-end">
                    <Loader2 className="h-6 w-6 animate-spin text-yellow-600" />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-yellow-800">{dashboardData.new}</p>
                )}
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-green-600">تم التسليم</p>
                {loading ? (
                  <div className="flex items-center justify-end">
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-green-800">{dashboardData.delivered}</p>
                )}
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-indigo-50 border-indigo-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm font-medium text-indigo-600">القيمة الإجمالية</p>
                {loading ? (
                  <div className="flex items-center justify-end">
                    <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                  </div>
                ) : (
                  <>
                    <p className="text-xl font-bold text-indigo-800">{dashboardData.totalValue?.toLocaleString()}</p>
                    <p className="text-xs text-indigo-600">ريال سعودي</p>
                  </>
                )}
              </div>
              <DollarSign className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-blue-600">جديد</p>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-600 mx-auto" />
              ) : (
                <p className="text-xl font-bold text-blue-800">{dashboardData.new}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="text-center">
              <AlertTriangle className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-yellow-600">موافق عليه</p>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-yellow-600 mx-auto" />
              ) : (
                <p className="text-xl font-bold text-yellow-800">{dashboardData.approved}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-purple-600">تم التعاقد</p>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-purple-600 mx-auto" />
              ) : (
                <p className="text-xl font-bold text-purple-800">{dashboardData.contracted}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-green-600">تم التسليم</p>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-green-600 mx-auto" />
              ) : (
                <p className="text-xl font-bold text-green-800">{dashboardData.delivered}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="text-center">
              <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
              <p className="text-sm font-medium text-red-600">مرفوض</p>
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-red-600 mx-auto" />
              ) : (
                <p className="text-xl font-bold text-red-800">{dashboardData.rejected}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">توزيع حالة العقود</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Trends */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">اتجاه العقود الشهرية</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="contracts" fill="#8b5cf6" name="عدد العقود" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Suppliers and Clinics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Suppliers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">أفضل الشركات الموردة</CardTitle>
          </CardHeader>
          <CardContent>
            {suppliersLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="mr-2 text-gray-600">جاري تحميل البيانات...</span>
              </div>
            ) : topSuppliers.length === 0 ? (
              <div className="text-center py-8">
                <FileX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">لا توجد بيانات للشركات الموردة حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topSuppliers.map((supplier, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="text-right">
                      <p className="font-medium">{supplier.name}</p>
                      <div className="text-sm text-gray-600">
                        <p>{supplier.contracts} عقد</p>
                        <p>{supplier.value?.toLocaleString()} ريال</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-600" />
                      <span className="font-bold text-purple-600">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Clinics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right">أكثر العيادات نشاطاً</CardTitle>
          </CardHeader>
          <CardContent>
            {clinicsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                <span className="mr-2 text-gray-600">جاري تحميل البيانات...</span>
              </div>
            ) : topClinics.length === 0 ? (
              <div className="text-center py-8">
                <FileX className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500">لا توجد بيانات للعيادات حالياً</p>
              </div>
            ) : (
              <div className="space-y-4">
                {topClinics.map((clinic, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="text-right">
                      <p className="font-medium">{clinic.name}</p>
                      <div className="text-sm text-gray-600">
                        <p>{clinic.contracts} عقد</p>
                        <p>{clinic.value?.toLocaleString()} ريال</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <span className="font-bold text-purple-600">#{index + 1}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}